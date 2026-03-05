package com.booking.controller;

import com.booking.entity.AdminNotification;
import com.booking.service.AdminNotificationService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/notifications")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminNotificationController {

    private final AdminNotificationService notificationService;

    @GetMapping
    public ResponseEntity<List<AdminNotification>> getNotifications() {
        return ResponseEntity.ok(notificationService.getLatestNotifications());
    }

    @GetMapping("/unread-count")
    public ResponseEntity<UnreadCountResponse> getUnreadCount() {
        long count = notificationService.getUnreadCount();
        return ResponseEntity.ok(new UnreadCountResponse(count));
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<Void> markAsRead(@PathVariable Long id) {
        notificationService.markAsRead(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/read-all")
    public ResponseEntity<Void> markAllAsRead() {
        notificationService.markAllAsRead();
        return ResponseEntity.ok().build();
    }

    @Data
    public static class UnreadCountResponse {
        private final long count;
    }
}
