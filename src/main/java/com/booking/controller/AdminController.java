package com.booking.controller;

import com.booking.dto.response.AdminBookingResponse;
import com.booking.dto.response.AdminDashboardStats;
import com.booking.dto.response.AdminProviderResponse;
import com.booking.dto.response.UserResponse;
import com.booking.service.AdminService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasAuthority('ROLE_ADMIN')")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/users")
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        return ResponseEntity.ok(adminService.getAllUsers());
    }

    @GetMapping("/dashboard")
    public ResponseEntity<AdminDashboardStats> getDashboardStats() {
        return ResponseEntity.ok(adminService.getDashboardStats());
    }

    @GetMapping("/bookings")
    public ResponseEntity<List<AdminBookingResponse>> getAllBookings() {
        return ResponseEntity.ok(adminService.getAllBookings());
    }

    @PutMapping("/bookings/{id}/cancel")
    public ResponseEntity<Void> cancelBooking(@PathVariable Long id) {
        adminService.cancelBooking(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/providers")
    public ResponseEntity<List<AdminProviderResponse>> getAllProviders() {
        return ResponseEntity.ok(adminService.getAllProviders());
    }

    @PutMapping("/users/{id}/promote")
    public ResponseEntity<Void> promoteUserToProvider(@PathVariable Long id) {
        adminService.promoteUserToProvider(id);
        return ResponseEntity.ok().build();
    }
}
