package com.booking.payment;

import com.booking.payment.dto.CreateOrderResponse;
import com.booking.payment.dto.VerifyPaymentRequest;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final RazorpayService razorpayService;

    public PaymentController(RazorpayService razorpayService) {
        this.razorpayService = razorpayService;
    }

    @PostMapping("/create-order/{bookingId}")
    public ResponseEntity<CreateOrderResponse> createOrder(
            @PathVariable Long bookingId,
            @AuthenticationPrincipal UserDetails userDetails) {
        
        try {
            CreateOrderResponse response = razorpayService.createOrderForBooking(bookingId, userDetails.getUsername());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/verify")
    public ResponseEntity<String> verifyPayment(@Valid @RequestBody VerifyPaymentRequest request) {
        try {
            boolean isValid = razorpayService.verifyPayment(request);
            if (isValid) {
                return ResponseEntity.ok("Payment verified successfully");
            } else {
                return ResponseEntity.badRequest().body("Invalid payment signature");
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Payment verification failed: " + e.getMessage());
        }
    }
}
