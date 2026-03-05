package com.booking.controller;

import com.booking.entity.Booking;
import com.booking.entity.User;
import com.booking.repository.BookingRepository;
import com.booking.repository.UserRepository;
import com.booking.security.CustomUserDetails;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/provider/bookings")
@RequiredArgsConstructor
@PreAuthorize("hasRole('PROVIDER')")
public class ProviderBookingController {

    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<List<ProviderBookingResponse>> getProviderBookings(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        
        User provider = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("Provider not found"));
        
        List<Booking> bookings = bookingRepository.findByProviderId(provider.getId());
        
        List<ProviderBookingResponse> responses = bookings.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(responses);
    }

    @PutMapping("/{id}/accept")
    public ResponseEntity<Void> acceptBooking(@PathVariable Long id,
                                              @AuthenticationPrincipal CustomUserDetails userDetails) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        
        validateProviderAccess(booking, userDetails);
        
        booking.setStatus(Booking.BookingStatus.CONFIRMED);
        bookingRepository.save(booking);
        
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}/complete")
    public ResponseEntity<Void> completeBooking(@PathVariable Long id,
                                                @AuthenticationPrincipal CustomUserDetails userDetails) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        
        validateProviderAccess(booking, userDetails);
        
        booking.setStatus(Booking.BookingStatus.BOOKED);
        bookingRepository.save(booking);
        
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<Void> cancelBooking(@PathVariable Long id,
                                              @AuthenticationPrincipal CustomUserDetails userDetails) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        
        validateProviderAccess(booking, userDetails);
        
        booking.setStatus(Booking.BookingStatus.CANCELLED);
        bookingRepository.save(booking);
        
        return ResponseEntity.ok().build();
    }

    private void validateProviderAccess(Booking booking, CustomUserDetails userDetails) {
        User provider = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("Provider not found"));
        
        Long bookingProviderId = booking.getSlot() != null && booking.getSlot().getService() != null
                ? booking.getSlot().getService().getProvider().getId()
                : null;
        
        if (bookingProviderId == null || !bookingProviderId.equals(provider.getId())) {
            throw new RuntimeException("Access denied: You can only manage your own bookings");
        }
    }

    private ProviderBookingResponse mapToResponse(Booking booking) {
        DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("hh:mm a");
        DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        
        ProviderBookingResponse.UserInfo userInfo = null;
        if (booking.getUser() != null) {
            userInfo = new ProviderBookingResponse.UserInfo(
                    booking.getUser().getName(),
                    booking.getUser().getEmail(),
                    booking.getUser().getPhone()
            );
        }
        
        return new ProviderBookingResponse(
                booking.getId(),
                booking.getSlot() != null && booking.getSlot().getService() != null
                        ? booking.getSlot().getService().getName()
                        : "Unknown Service",
                booking.getCreatedAt() != null ? booking.getCreatedAt().toLocalDate().format(dateFormatter) : "",
                booking.getSlot() != null && booking.getSlot().getStartTime() != null
                        ? booking.getSlot().getStartTime().format(timeFormatter)
                        : "",
                booking.getStatus() != null ? booking.getStatus().name() : "",
                booking.getPaymentStatus() != null ? booking.getPaymentStatus().name() : "",
                booking.getAmount() != null ? booking.getAmount() : BigDecimal.ZERO,
                userInfo
        );
    }

    @Data
    public static class ProviderBookingResponse {
        private final Long bookingId;
        private final String serviceName;
        private final String bookingDate;
        private final String bookingTime;
        private final String status;
        private final String paymentStatus;
        private final BigDecimal amount;
        private final UserInfo user;

        @Data
        public static class UserInfo {
            private final String name;
            private final String email;
            private final String phone;
        }
    }
}
