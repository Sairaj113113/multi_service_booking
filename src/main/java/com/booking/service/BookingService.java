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

import java.util.List;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final SlotRepository slotRepository;
    private final UserRepository userRepository;

    public BookingService(BookingRepository bookingRepository,
                          SlotRepository slotRepository,
                          UserRepository userRepository) {
        this.bookingRepository = bookingRepository;
        this.slotRepository = slotRepository;
        this.userRepository = userRepository;
    }

    // ✅ BOOK SLOT
    @Transactional
    public BookingResponse bookSlot(BookingRequest request, CustomUserDetails currentUser) {

        User user = userRepository.findById(currentUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Slot slot = slotRepository.findById(request.getSlotId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Slot not found with id: " + request.getSlotId()));

        if (!slot.getAvailable()) {
            throw new BadRequestException("Slot is not available for booking");
        }

        if (bookingRepository.existsBySlotIdAndStatus(
                slot.getId(), Booking.BookingStatus.BOOKED)) {
            throw new BadRequestException("Slot is already booked");
        }

        slot.setAvailable(false);
        slotRepository.save(slot);

        Booking booking = Booking.builder()
                .user(user)
                .slot(slot)
                .status(Booking.BookingStatus.BOOKED)
                .build();

        Booking saved = bookingRepository.save(booking);

        return mapToResponse(saved);
    }

    // ✅ CANCEL BOOKING
    @Transactional
    public BookingResponse cancelBooking(Long bookingId, CustomUserDetails currentUser) {

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Booking not found with id: " + bookingId));

        if (!booking.getUser().getId().equals(currentUser.getId())) {
            throw new AccessDeniedException("You can only cancel your own bookings");
        }

        if (booking.getStatus() == Booking.BookingStatus.CANCELLED) {
            throw new BadRequestException("Booking is already cancelled");
        }

        booking.setStatus(Booking.BookingStatus.CANCELLED);

        Slot slot = booking.getSlot();
        slot.setAvailable(true);
        slotRepository.save(slot);

        Booking updated = bookingRepository.save(booking);

        return mapToResponse(updated);
    }

    // ✅ GET MY BOOKINGS (🔥 FIXED)
    @Transactional(readOnly = true)
    public List<BookingResponse> getMyBookings(CustomUserDetails currentUser) {

        return bookingRepository.findMyBookings(currentUser.getId())
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    // ✅ MAPPER
    private BookingResponse mapToResponse(Booking booking) {

        return BookingResponse.builder()
                .id(booking.getId())
                .userId(booking.getUser().getId())
                .userName(booking.getUser().getName())
                .slotId(booking.getSlot().getId())
                .slotStartTime(booking.getSlot().getStartTime())
                .slotEndTime(booking.getSlot().getEndTime())
                .serviceName(booking.getSlot().getService().getName())
                .status(booking.getStatus().name())
                .build();
    }
}