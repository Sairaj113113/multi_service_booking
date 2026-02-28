package com.booking.controller;

import com.booking.dto.request.SlotRequest;
import com.booking.dto.response.SlotResponse;
import com.booking.security.CustomUserDetails;
import com.booking.service.SlotService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/slots")
public class SlotController {

    private final SlotService slotService;

    public SlotController(SlotService slotService) {
        this.slotService = slotService;
    }

    @PostMapping
    @PreAuthorize("hasAuthority('ROLE_PROVIDER')")
    public ResponseEntity<SlotResponse> createSlot(
            @Valid @RequestBody SlotRequest request,
            @AuthenticationPrincipal CustomUserDetails currentUser) {
        SlotResponse response = slotService.createSlot(request, currentUser);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/service/{serviceId}")
    public ResponseEntity<List<SlotResponse>> getSlotsByService(@PathVariable Long serviceId) {
        return ResponseEntity.ok(slotService.getSlotsByService(serviceId));
    }

    @GetMapping("/service/{serviceId}/available")
    public ResponseEntity<List<SlotResponse>> getAvailableSlotsByService(@PathVariable Long serviceId) {
        return ResponseEntity.ok(slotService.getAvailableSlotsByService(serviceId));
    }
}
