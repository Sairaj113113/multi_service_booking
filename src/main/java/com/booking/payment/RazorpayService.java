package com.booking.payment;

import com.booking.entity.Booking;
import com.booking.payment.dto.CreateOrderResponse;
import com.booking.payment.dto.VerifyPaymentRequest;
import com.booking.repository.BookingRepository;
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

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
public class RazorpayService {

    private static final Logger logger = LoggerFactory.getLogger(RazorpayService.class);

    private final RazorpayClient razorpayClient;
    private final BookingRepository bookingRepository;
    private final AdminNotificationService notificationService;

    @Value("${razorpay.key-id}")
    private String keyId;

    @Value("${razorpay.key-secret}")
    private String keySecret;

    public RazorpayService(RazorpayClient razorpayClient,
                           BookingRepository bookingRepository,
                           AdminNotificationService notificationService) {
        this.razorpayClient = razorpayClient;
        this.bookingRepository = bookingRepository;
        this.notificationService = notificationService;
    }

    // ============================================
    // CREATE ORDER
    // ============================================
    public CreateOrderResponse createOrderForBooking(Long bookingId, String userEmail) {

        Booking booking = bookingRepository.findByIdWithUser(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        logger.info("Creating order for booking {}", bookingId);
        logger.info("Booking status: {}", booking.getStatus());
        logger.info("Payment status: {}", booking.getPaymentStatus());
        logger.info("Booking user: {}", booking.getUser().getEmail());
        logger.info("JWT user: {}", userEmail);

        

        // 1️⃣ Check ownership
        if (!booking.getUser().getEmail().equals(userEmail)) {
            throw new RuntimeException("Booking does not belong to user");
        }

        // 2️⃣ Only allow if payment still pending
        if (booking.getPaymentStatus() != Booking.PaymentStatus.PENDING) {
            throw new RuntimeException("Booking is not eligible for payment");
        }

        try {
            // 3️⃣ Convert amount to paise safely
            BigDecimal amount = booking.getAmount();
            int amountInPaise = amount
                    .multiply(BigDecimal.valueOf(100))
                    .intValue();

            logger.info("Amount in paise: {}", amountInPaise);

            // 4️⃣ Create Razorpay order
            JSONObject orderRequest = new JSONObject();
            orderRequest.put("amount", amountInPaise);
            orderRequest.put("currency", "INR");
            orderRequest.put("receipt", "booking_" + bookingId);

            Order razorpayOrder = razorpayClient.orders.create(orderRequest);

            String razorpayOrderId = razorpayOrder.get("id");

            // 5️⃣ Save order ID
            booking.setRazorpayOrderId(razorpayOrderId);
            bookingRepository.save(booking);

            logger.info("Razorpay order created: {}", razorpayOrderId);

            return new CreateOrderResponse(
                    keyId,
                    amountInPaise,
                    "INR",
                    razorpayOrderId
            );

        } catch (RazorpayException e) {
            logger.error("Razorpay error: {}", e.getMessage(), e);
            throw new RuntimeException("Razorpay error: " + e.getMessage());
        }
    }

    // ============================================
    // VERIFY PAYMENT
    // ============================================
    public boolean verifyPayment(VerifyPaymentRequest request) {

        try {
            JSONObject attributes = new JSONObject();
            attributes.put("razorpay_order_id", request.getRazorpayOrderId());
            attributes.put("razorpay_payment_id", request.getRazorpayPaymentId());
            attributes.put("razorpay_signature", request.getRazorpaySignature());

            Utils.verifyPaymentSignature(attributes, keySecret);

            Booking booking = bookingRepository
                    .findByRazorpayOrderId(request.getRazorpayOrderId());

            if (booking == null) {
                throw new RuntimeException("Booking not found for this order");
            }

            booking.setPaymentStatus(Booking.PaymentStatus.PAID);
            booking.setStatus(Booking.BookingStatus.CONFIRMED);
            booking.setPaymentReference(request.getRazorpayPaymentId());
            booking.setPaidAt(LocalDateTime.now());

            bookingRepository.save(booking);

            // Create admin notification for payment completion
            notificationService.createPaymentCompletedNotification(booking, booking.getAmount());

            logger.info("Payment verified for booking {}", booking.getId());

            return true;

        } catch (Exception e) {
            logger.error("Payment verification failed", e);
            throw new RuntimeException("Payment verification failed");
        }
    }
}