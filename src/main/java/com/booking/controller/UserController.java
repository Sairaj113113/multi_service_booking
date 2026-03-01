package com.booking.controller;

import com.booking.dto.request.UpdateProfileRequest;
import com.booking.dto.response.UserProfileResponse;
import com.booking.security.CustomUserDetails;
import com.booking.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/me")
    @PreAuthorize("hasAnyRole('USER','PROVIDER','ADMIN')")
    public ResponseEntity<UserProfileResponse> getMyProfile(
            @AuthenticationPrincipal CustomUserDetails currentUser) {
        return ResponseEntity.ok(userService.getMyProfile(currentUser));
    }

    @PutMapping("/me")
    @PreAuthorize("hasAnyRole('USER','PROVIDER','ADMIN')")
    public ResponseEntity<UserProfileResponse> updateMyProfile(
            @Valid @RequestBody UpdateProfileRequest request,
            @AuthenticationPrincipal CustomUserDetails currentUser) {
        return ResponseEntity.ok(userService.updateMyProfile(request, currentUser));
    }
}
