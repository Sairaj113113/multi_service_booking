package com.booking.controller;

import com.booking.entity.PlatformSettings;
import com.booking.repository.PlatformSettingsRepository;
import jakarta.validation.Valid;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/settings")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminSettingsController {

    private final PlatformSettingsRepository settingsRepository;

    @Data
    public static class SettingsResponse {
        private Long id;
        private String platformName;
        private String supportEmail;
        private String contactPhone;
        private String currency;
        private String timezone;
        private Integer bookingDuration;
        private Integer maxBookingsPerSlot;
        private Integer cancellationHours;
        private Double platformCommission;
        private Boolean enablePayments;
        private Boolean enableNotifications;
    }

    @Data
    public static class SettingsRequest {
        private String platformName;
        private String supportEmail;
        private String contactPhone;
        private String currency;
        private String timezone;
        private Integer bookingDuration;
        private Integer maxBookingsPerSlot;
        private Integer cancellationHours;
        private Double platformCommission;
        private Boolean enablePayments;
        private Boolean enableNotifications;
    }

    @GetMapping
    public ResponseEntity<SettingsResponse> getSettings() {
        PlatformSettings settings = settingsRepository.findFirstByOrderByIdAsc()
            .orElseGet(() -> {
                // Create default settings if none exist
                PlatformSettings defaultSettings = PlatformSettings.builder().build();
                return settingsRepository.save(defaultSettings);
            });

        SettingsResponse response = new SettingsResponse();
        response.setId(settings.getId());
        response.setPlatformName(settings.getPlatformName());
        response.setSupportEmail(settings.getSupportEmail());
        response.setContactPhone(settings.getContactPhone());
        response.setCurrency(settings.getCurrency());
        response.setTimezone(settings.getTimezone());
        response.setBookingDuration(settings.getBookingDuration());
        response.setMaxBookingsPerSlot(settings.getMaxBookingsPerSlot());
        response.setCancellationHours(settings.getCancellationHours());
        response.setPlatformCommission(settings.getPlatformCommission());
        response.setEnablePayments(settings.getEnablePayments());
        response.setEnableNotifications(settings.getEnableNotifications());

        return ResponseEntity.ok(response);
    }

    @PutMapping
    public ResponseEntity<SettingsResponse> updateSettings(@Valid @RequestBody SettingsRequest request) {
        PlatformSettings settings = settingsRepository.findFirstByOrderByIdAsc()
            .orElseGet(() -> {
                PlatformSettings defaultSettings = PlatformSettings.builder().build();
                return settingsRepository.save(defaultSettings);
            });

        // Update fields if provided
        if (request.getPlatformName() != null) {
            settings.setPlatformName(request.getPlatformName());
        }
        if (request.getSupportEmail() != null) {
            settings.setSupportEmail(request.getSupportEmail());
        }
        if (request.getContactPhone() != null) {
            settings.setContactPhone(request.getContactPhone());
        }
        if (request.getCurrency() != null) {
            settings.setCurrency(request.getCurrency());
        }
        if (request.getTimezone() != null) {
            settings.setTimezone(request.getTimezone());
        }
        if (request.getBookingDuration() != null) {
            settings.setBookingDuration(request.getBookingDuration());
        }
        if (request.getMaxBookingsPerSlot() != null) {
            settings.setMaxBookingsPerSlot(request.getMaxBookingsPerSlot());
        }
        if (request.getCancellationHours() != null) {
            settings.setCancellationHours(request.getCancellationHours());
        }
        if (request.getPlatformCommission() != null) {
            settings.setPlatformCommission(request.getPlatformCommission());
        }
        if (request.getEnablePayments() != null) {
            settings.setEnablePayments(request.getEnablePayments());
        }
        if (request.getEnableNotifications() != null) {
            settings.setEnableNotifications(request.getEnableNotifications());
        }

        PlatformSettings saved = settingsRepository.save(settings);

        SettingsResponse response = new SettingsResponse();
        response.setId(saved.getId());
        response.setPlatformName(saved.getPlatformName());
        response.setSupportEmail(saved.getSupportEmail());
        response.setContactPhone(saved.getContactPhone());
        response.setCurrency(saved.getCurrency());
        response.setTimezone(saved.getTimezone());
        response.setBookingDuration(saved.getBookingDuration());
        response.setMaxBookingsPerSlot(saved.getMaxBookingsPerSlot());
        response.setCancellationHours(saved.getCancellationHours());
        response.setPlatformCommission(saved.getPlatformCommission());
        response.setEnablePayments(saved.getEnablePayments());
        response.setEnableNotifications(saved.getEnableNotifications());

        return ResponseEntity.ok(response);
    }
}
