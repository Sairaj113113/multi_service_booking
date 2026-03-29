package com.booking.service;

import com.booking.dto.request.BookingRequest;
import com.booking.dto.response.BookingResponse;
import com.booking.entity.Booking;
import com.booking.entity.Slot;
import com.booking.entity.User;
import com.booking.exception.AccessDeniedException;
import com.booking.exception.BadRequestException;
import com.booking.exception.ResourceNotFoundException;
import com.booking.repository.BookingRepository;
import com.booking.repository.SlotRepository;
import com.booking.repository.UserRepository;
import com.booking.security.CustomUserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final SlotRepository slotRepository;
    private final UserRepository userRepository;
    private final AdminNotificationService notificationService;

    public BookingService(BookingRepository bookingRepository,
                          SlotRepository slotRepository,
                          UserRepository userRepository,
                          AdminNotificationService notificationService) {
        this.bookingRepository = bookingRepository;
        this.slotRepository = slotRepository;
        this.userRepository = userRepository;
        this.notificationService = notificationService;
    }

    // ─────────────────────────────────────────────────────────────
    // BOOK SLOT
    // Flow: Create booking (PENDING_PAYMENT) → Razorpay handles rest
    //       For CASH: create booking (BOOKED) + block slot immediately
    // ─────────────────────────────────────────────────────────────
    @Transactional
    public BookingResponse bookSlot(BookingRequest request, CustomUserDetails currentUser) {

        User user = userRepository.findById(currentUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Slot slot = slotRepository.findById(request.getSlotId())
                .orElseThrow(() -> new ResourceNotFoundException("Slot not found"));

        if (!slot.getAvailable()) {
            throw new BadRequestException("Slot is no longer available");
        }

        Booking.PaymentMethod method = resolvePaymentMethod(request.getPaymentMethod());

        // Check: does this user already have an active (non-cancelled) booking for this slot?
        // Allow re-booking only if prior booking is PENDING_PAYMENT (unpaid) — handled via retry flow.
        // Block if already BOOKED or COMPLETED.
        bookingRepository.findActiveBookingByUserAndSlot(currentUser.getId(), request.getSlotId())
                .ifPresent(existing -> {
                    if (existing.getStatus() == Booking.BookingStatus.BOOKED ||
                        existing.getStatus() == Booking.BookingStatus.COMPLETED) {
                        throw new BadRequestException("You already have an active booking for this slot");
                    }
                    // PENDING_PAYMENT means they should use the retry flow instead
                    throw new BadRequestException("PENDING_PAYMENT:" + existing.getId());
                });

        if (method == Booking.PaymentMethod.CASH) {
            // CASH: confirm immediately, block slot now
            Booking booking = Booking.builder()
                    .user(user)
                    .slot(slot)
                    .status(Booking.BookingStatus.BOOKED)
                    .paymentStatus(Booking.PaymentStatus.PENDING) // cash = pay at venue
                    .paymentMethod(method)
                    .amount(slot.getService().getPrice())
                    .currency("USD")
                    .build();

            slot.setAvailable(false);
            slotRepository.save(slot);

            Booking saved = bookingRepository.save(booking);
            return mapToResponse(saved);

        } else {
            // CARD / UPI: create PENDING_PAYMENT booking, do NOT block slot yet
            Booking booking = Booking.builder()
                    .user(user)
                    .slot(slot)
                    .status(Booking.BookingStatus.PENDING_PAYMENT)
                    .paymentStatus(Booking.PaymentStatus.PENDING)
                    .paymentMethod(method)
                    .amount(slot.getService().getPrice())
                    .currency("USD")
                    .build();

            Booking saved = bookingRepository.save(booking);
            return mapToResponse(saved);
        }
    }

    // ─────────────────────────────────────────────────────────────
    // CANCEL BOOKING (called by user)
    // ─────────────────────────────────────────────────────────────
    @Transactional
    public BookingResponse cancelBooking(Long bookingId, CustomUserDetails currentUser) {

        Booking booking = bookingRepository.findByIdWithDetails(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + bookingId));

        if (!booking.getUser().getId().equals(currentUser.getId())) {
            throw new AccessDeniedException("You can only cancel your own bookings");
        }

        if (booking.getStatus() == Booking.BookingStatus.CANCELLED) {
            throw new BadRequestException("Booking is already cancelled");
        }

        if (booking.getStatus() == Booking.BookingStatus.COMPLETED) {
            throw new BadRequestException("Cannot cancel a completed booking");
        }

       Booking.BookingStatus oldStatus = booking.getStatus(); // ✅ store BEFORE change

booking.setStatus(Booking.BookingStatus.CANCELLED);

if (booking.getPaymentStatus() == Booking.PaymentStatus.PAID) {
    booking.setPaymentStatus(Booking.PaymentStatus.REFUNDED);
}

// 🔥 FIX → use old status OR remove condition
if (oldStatus == Booking.BookingStatus.BOOKED 
        || oldStatus == Booking.BookingStatus.PENDING_PAYMENT) {

    Slot slot = booking.getSlot();
    if (slot != null) {
        slot.setAvailable(true);
        slotRepository.save(slot);
    }
}

        return mapToResponse(bookingRepository.save(booking));
    }

    // ─────────────────────────────────────────────────────────────
    // CONFIRM PAYMENT (manual / fallback — not used in Razorpay flow)
    // ─────────────────────────────────────────────────────────────
    @Transactional
    public BookingResponse confirmPayment(Long bookingId, String method, String reference,
                                          CustomUserDetails currentUser) {

        Booking booking = bookingRepository.findByIdWithDetails(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + bookingId));

        if (!booking.getUser().getId().equals(currentUser.getId())) {
            throw new AccessDeniedException("You can only pay for your own bookings");
        }

        if (booking.getStatus() == Booking.BookingStatus.CANCELLED) {
            throw new BadRequestException("Cannot pay for a cancelled booking");
        }

        if (booking.getPaymentStatus() == Booking.PaymentStatus.PAID) {
            throw new BadRequestException("Payment already completed");
        }

        booking.setPaymentMethod(resolvePaymentMethod(method));
        booking.setPaymentStatus(Booking.PaymentStatus.PAID);
        booking.setPaymentReference(reference == null || reference.isBlank()
                ? generateReference(bookingId) : reference);
        booking.setPaidAt(java.time.LocalDateTime.now());
        booking.setStatus(Booking.BookingStatus.BOOKED);

        // Block slot on manual payment confirmation
        Slot slot = booking.getSlot();
        slot.setAvailable(false);
        slotRepository.save(slot);

        return mapToResponse(bookingRepository.save(booking));
    }

    // ─────────────────────────────────────────────────────────────
    // GET MY BOOKINGS (user)
    // ─────────────────────────────────────────────────────────────
    @Transactional(readOnly = true)
    public List<BookingResponse> getMyBookings(CustomUserDetails currentUser) {
        return bookingRepository.findMyBookings(currentUser.getId())
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    // ─────────────────────────────────────────────────────────────
    // GET PROVIDER BOOKINGS
    // ─────────────────────────────────────────────────────────────
    @Transactional(readOnly = true)
    public List<BookingResponse> getProviderBookings(CustomUserDetails currentUser) {
        return bookingRepository.findByProviderId(currentUser.getId())
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    // ─────────────────────────────────────────────────────────────
    // PROVIDER ACTIONS
    // ─────────────────────────────────────────────────────────────

    /**
     * Provider accepts a CASH booking (moves PENDING_PAYMENT → BOOKED).
     * For online payments this is done automatically via Razorpay webhook.
     */
    @Transactional
    public BookingResponse providerAcceptBooking(Long bookingId, CustomUserDetails currentUser) {

        Booking booking = bookingRepository.findByIdWithDetails(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        validateProviderOwnership(booking, currentUser);

        if (booking.getStatus() != Booking.BookingStatus.PENDING_PAYMENT) {
            throw new BadRequestException("Only PENDING_PAYMENT bookings can be accepted");
        }

        booking.setStatus(Booking.BookingStatus.BOOKED);

        // Block slot
        Slot slot = booking.getSlot();
        slot.setAvailable(false);
        slotRepository.save(slot);

        return mapToResponse(bookingRepository.save(booking));
    }

    @Transactional
public BookingResponse providerCompleteBooking(Long bookingId, CustomUserDetails currentUser) {

    Booking booking = bookingRepository.findByIdWithDetails(bookingId)
            .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

    validateProviderOwnership(booking, currentUser);

    if (booking.getStatus() != Booking.BookingStatus.BOOKED) {
        throw new BadRequestException("Only BOOKED (active) bookings can be marked complete");
    }

    booking.setStatus(Booking.BookingStatus.COMPLETED);

    // 🔥🔥🔥 MAIN FIX
    if (booking.getPaymentMethod() == Booking.PaymentMethod.CASH) {
        booking.setPaymentStatus(Booking.PaymentStatus.PAID);
        booking.setPaidAt(LocalDateTime.now());
    }

    return mapToResponse(bookingRepository.save(booking));
}
    @Transactional
    public BookingResponse providerCancelBooking(Long bookingId, CustomUserDetails currentUser) {

        Booking booking = bookingRepository.findByIdWithDetails(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        validateProviderOwnership(booking, currentUser);

        if (booking.getStatus() == Booking.BookingStatus.CANCELLED) {
            throw new BadRequestException("Booking is already cancelled");
        }
        if (booking.getStatus() == Booking.BookingStatus.COMPLETED) {
            throw new BadRequestException("Cannot cancel a completed booking");
        }

        booking.setStatus(Booking.BookingStatus.CANCELLED);

        if (booking.getPaymentStatus() == Booking.PaymentStatus.PAID) {
            booking.setPaymentStatus(Booking.PaymentStatus.REFUNDED);
        }

        // Free up slot if it was blocked
        Slot slot = booking.getSlot();
        slot.setAvailable(true);
        slotRepository.save(slot);

        return mapToResponse(bookingRepository.save(booking));
    }

    // ─────────────────────────────────────────────────────────────
    // HELPERS
    // ─────────────────────────────────────────────────────────────

    private void validateProviderOwnership(Booking booking, CustomUserDetails currentUser) {
        Long providerId = booking.getSlot().getService().getProvider().getId();
        if (!providerId.equals(currentUser.getId())) {
            throw new AccessDeniedException("You can only manage your own bookings");
        }
    }

    BookingResponse mapToResponse(Booking booking) {
    return BookingResponse.builder()
            .bookingId(booking.getId())   // ✅ FIXED

            .userId(booking.getUser().getId())
            .userName(booking.getUser().getName())
            .slotId(booking.getSlot().getId())
            .slotStartTime(booking.getSlot().getStartTime())
            .slotEndTime(booking.getSlot().getEndTime())
            .serviceName(booking.getSlot().getService().getName())
            .status(booking.getStatus().name())
            .paymentStatus(booking.getPaymentStatus().name())
            .paymentMethod(booking.getPaymentMethod() != null
                    ? booking.getPaymentMethod().name() : null)
            .amount(booking.getAmount())
            .currency(booking.getCurrency())
            .paymentReference(booking.getPaymentReference())
            .paidAt(booking.getPaidAt())
            .location(booking.getSlot().getService().getLocation())
            .build();
}

    private Booking.PaymentMethod resolvePaymentMethod(String method) {
        if (method == null || method.isBlank()) {
            return Booking.PaymentMethod.CASH;
        }
        try {
            return Booking.PaymentMethod.valueOf(method.toUpperCase());
        } catch (IllegalArgumentException ex) {
            throw new BadRequestException("Invalid payment method: " + method);
        }
    }

    private String generateReference(Long bookingId) {
        return "PAY-" + bookingId + "-" + System.currentTimeMillis();
    }
}