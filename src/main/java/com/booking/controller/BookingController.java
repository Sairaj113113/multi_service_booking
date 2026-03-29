package com.booking.controller;

import com.booking.dto.request.BookingRequest;
import com.booking.dto.request.PaymentRequest;
import com.booking.dto.response.BookingResponse;
import com.booking.security.CustomUserDetails;
import com.booking.service.BookingService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    // ─────────────────────────────────────────────────────────────
    // USER ENDPOINTS  →  /api/bookings
    // ─────────────────────────────────────────────────────────────

    /** Create a new booking (PENDING_PAYMENT for card/UPI, BOOKED for CASH) */
    @PostMapping("/api/bookings")
    @PreAuthorize("hasAuthority('ROLE_USER')")
    public ResponseEntity<BookingResponse> bookSlot(
            @Valid @RequestBody BookingRequest request,
            @AuthenticationPrincipal CustomUserDetails currentUser) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(bookingService.bookSlot(request, currentUser));
    }

    /** User cancels their own booking */
    @PutMapping("/api/bookings/{id}/cancel")
    @PreAuthorize("hasAuthority('ROLE_USER')")
    public ResponseEntity<BookingResponse> cancelBooking(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails currentUser) {
        return ResponseEntity.ok(bookingService.cancelBooking(id, currentUser));
    }

    /** Manual payment confirmation (fallback — Razorpay uses its own endpoint) */
    @PutMapping("/api/bookings/{id}/pay")
    @PreAuthorize("hasAuthority('ROLE_USER')")
    public ResponseEntity<BookingResponse> confirmPayment(
            @PathVariable Long id,
            @Valid @RequestBody PaymentRequest request,
            @AuthenticationPrincipal CustomUserDetails currentUser) {
        return ResponseEntity.ok(bookingService.confirmPayment(
                id, request.getPaymentMethod(), request.getPaymentReference(), currentUser));
    }

    /** Get current user's bookings */
    @GetMapping("/api/bookings/my")
    @PreAuthorize("hasAuthority('ROLE_USER')")
    public ResponseEntity<List<BookingResponse>> getMyBookings(
            @AuthenticationPrincipal CustomUserDetails currentUser) {
        return ResponseEntity.ok(bookingService.getMyBookings(currentUser));
    }

    // ─────────────────────────────────────────────────────────────
    // PROVIDER ENDPOINTS  →  /api/provider/bookings
    // ─────────────────────────────────────────────────────────────

    /** Get all bookings for the logged-in provider */
    @GetMapping("/api/provider/bookings")
    @PreAuthorize("hasAuthority('ROLE_PROVIDER')")
    public ResponseEntity<List<BookingResponse>> getProviderBookings(
            @AuthenticationPrincipal CustomUserDetails currentUser) {
        return ResponseEntity.ok(bookingService.getProviderBookings(currentUser));
    }

    /**
     * Provider accepts a booking.
     * Typically used for CASH bookings still in PENDING_PAYMENT.
     * Online (Razorpay) bookings move to BOOKED automatically on payment success.
     */
    @PutMapping("/api/provider/bookings/{id}/accept")
    @PreAuthorize("hasAuthority('ROLE_PROVIDER')")
    public ResponseEntity<BookingResponse> acceptBooking(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails currentUser) {
        return ResponseEntity.ok(bookingService.providerAcceptBooking(id, currentUser));
    }

    /** Provider marks a BOOKED booking as COMPLETED after service is done */
    @PutMapping("/api/provider/bookings/{id}/complete")
    @PreAuthorize("hasAuthority('ROLE_PROVIDER')")
    public ResponseEntity<BookingResponse> completeBooking(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails currentUser) {
        return ResponseEntity.ok(bookingService.providerCompleteBooking(id, currentUser));
    }

    /** Provider cancels a booking */
    @PutMapping("/api/provider/bookings/{id}/cancel")
    @PreAuthorize("hasAuthority('ROLE_PROVIDER')")
    public ResponseEntity<BookingResponse> cancelByProvider(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails currentUser) {
        return ResponseEntity.ok(bookingService.providerCancelBooking(id, currentUser));
    }
}