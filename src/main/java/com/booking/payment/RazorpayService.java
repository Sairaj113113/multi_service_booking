package com.booking.payment;

import com.booking.entity.Booking;
import com.booking.entity.Slot;
import com.booking.payment.dto.CreateOrderResponse;
import com.booking.payment.dto.VerifyPaymentRequest;
import com.booking.repository.BookingRepository;
import com.booking.repository.SlotRepository;
import com.booking.service.AdminNotificationService;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import com.razorpay.Utils;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
public class RazorpayService {

    private static final Logger logger = LoggerFactory.getLogger(RazorpayService.class);

    private final RazorpayClient razorpayClient;
    private final BookingRepository bookingRepository;
    private final SlotRepository slotRepository;
    private final AdminNotificationService notificationService;

    @Value("${razorpay.key-id}")
    private String keyId;

    @Value("${razorpay.key-secret}")
    private String keySecret;

    public RazorpayService(RazorpayClient razorpayClient,
                           BookingRepository bookingRepository,
                           SlotRepository slotRepository,
                           AdminNotificationService notificationService) {
        this.razorpayClient = razorpayClient;
        this.bookingRepository = bookingRepository;
        this.slotRepository = slotRepository;
        this.notificationService = notificationService;
    }

    // ─────────────────────────────────────────────────────────────
    // CREATE ORDER
    // Supports RETRY: if booking already has a Razorpay order that
    // was never paid, we create a fresh order (old one is abandoned).
    // ─────────────────────────────────────────────────────────────
    @Transactional
    public CreateOrderResponse createOrderForBooking(Long bookingId, String userEmail) {

        Booking booking = bookingRepository.findByIdWithDetails(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        logger.info("Creating Razorpay order | bookingId={} | status={} | paymentStatus={} | user={}",
                bookingId, booking.getStatus(), booking.getPaymentStatus(), booking.getUser().getEmail());

        // Ownership check
        if (!booking.getUser().getEmail().equals(userEmail)) {
            throw new RuntimeException("Booking does not belong to user");
        }

        // Only allow order creation for PENDING_PAYMENT bookings that aren't yet paid
        if (booking.getStatus() == Booking.BookingStatus.CANCELLED) {
            throw new RuntimeException("Cannot pay for a cancelled booking");
        }
        if (booking.getStatus() == Booking.BookingStatus.COMPLETED) {
            throw new RuntimeException("Booking is already completed");
        }
        if (booking.getPaymentStatus() == Booking.PaymentStatus.PAID) {
            throw new RuntimeException("Booking is already paid");
        }

        // Verify slot is still available (another user may have grabbed it)
        // For retries the slot may already be free (we never blocked it for online payments)
        Slot slot = booking.getSlot();
        if (!slot.getAvailable()) {
            // Slot was taken by someone else — cancel this booking
            booking.setStatus(Booking.BookingStatus.CANCELLED);
            bookingRepository.save(booking);
            throw new RuntimeException("Slot is no longer available");
        }

        try {
            BigDecimal amount = booking.getAmount();
            int amountInPaise = amount.multiply(BigDecimal.valueOf(100)).intValue();

            logger.info("Creating Razorpay order | amount (paise)={}", amountInPaise);

            JSONObject orderRequest = new JSONObject();
            orderRequest.put("amount", amountInPaise);
            orderRequest.put("currency", "INR");
            // Use timestamp suffix so retries always get a fresh receipt
            orderRequest.put("receipt", "booking_" + bookingId + "_" + System.currentTimeMillis());

            Order razorpayOrder = razorpayClient.orders.create(orderRequest);
            String razorpayOrderId = razorpayOrder.get("id");

            // Overwrite any previous (abandoned) Razorpay order ID
            booking.setRazorpayOrderId(razorpayOrderId);
            bookingRepository.save(booking);

            logger.info("Razorpay order created | orderId={}", razorpayOrderId);

            return new CreateOrderResponse(keyId, amountInPaise, "INR", razorpayOrderId);

        } catch (RazorpayException e) {
            logger.error("Razorpay API error | {}", e.getMessage(), e);
            throw new RuntimeException("Razorpay error: " + e.getMessage());
        }
    }

    // ─────────────────────────────────────────────────────────────
    // VERIFY PAYMENT
    // Called after Razorpay popup success.
    // Signature is verified server-side; slot is blocked only here.
    // ─────────────────────────────────────────────────────────────
    @Transactional
    public boolean verifyPayment(VerifyPaymentRequest request) {

        try {
            // 1. Verify Razorpay signature
            JSONObject attributes = new JSONObject();
            attributes.put("razorpay_order_id",   request.getRazorpayOrderId());
            attributes.put("razorpay_payment_id",  request.getRazorpayPaymentId());
            attributes.put("razorpay_signature",   request.getRazorpaySignature());

            Utils.verifyPaymentSignature(attributes, keySecret);

            // 2. Fetch booking
            Booking booking = bookingRepository.findByRazorpayOrderId(request.getRazorpayOrderId());
            if (booking == null) {
                throw new RuntimeException("No booking found for Razorpay order: " + request.getRazorpayOrderId());
            }

            logger.info("Payment verified | bookingId={} | paymentId={}", booking.getId(), request.getRazorpayPaymentId());

            // 3. Guard: idempotency — if already processed, return true
            if (booking.getPaymentStatus() == Booking.PaymentStatus.PAID) {
                logger.warn("Payment already recorded for bookingId={}", booking.getId());
                return true;
            }

            // 4. Update booking
            booking.setPaymentStatus(Booking.PaymentStatus.PAID);
            booking.setStatus(Booking.BookingStatus.BOOKED);
            booking.setPaymentReference(request.getRazorpayPaymentId());
            booking.setPaidAt(LocalDateTime.now());

            // 5. Block slot (ONLY here, after successful payment verification)
            Slot slot = booking.getSlot();
            slot.setAvailable(false);
            slotRepository.save(slot);

            bookingRepository.save(booking);

            logger.info("Booking confirmed | bookingId={} | slotId={}", booking.getId(), slot.getId());
            return true;

        } catch (Exception e) {
            logger.error("Payment verification failed | {}", e.getMessage(), e);
            throw new RuntimeException("Payment verification failed: " + e.getMessage());
        }
    }
}