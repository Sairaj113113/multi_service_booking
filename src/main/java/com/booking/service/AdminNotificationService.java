package com.booking.service;

import com.booking.entity.AdminNotification;
import com.booking.entity.Booking;
import com.booking.entity.User;
import com.booking.repository.AdminNotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminNotificationService {

    private final AdminNotificationRepository notificationRepository;

    @Transactional
    public AdminNotification createUserRegistrationNotification(User user) {
        AdminNotification notification = AdminNotification.builder()
                .type(AdminNotification.NotificationType.USER_REGISTRATION)
                .message("New user registered: " + user.getName())
                .referenceId(user.getId())
                .isRead(false)
                .build();
        return notificationRepository.save(notification);
    }

    @Transactional
    public AdminNotification createNewBookingNotification(Booking booking) {
        String serviceName = booking.getSlot() != null && booking.getSlot().getService() != null
                ? booking.getSlot().getService().getName()
                : "Unknown Service";
        
        AdminNotification notification = AdminNotification.builder()
                .type(AdminNotification.NotificationType.NEW_BOOKING)
                .message("New booking received for " + serviceName)
                .referenceId(booking.getId())
                .isRead(false)
                .build();
        return notificationRepository.save(notification);
    }

    @Transactional
    public AdminNotification createNewServiceNotification(com.booking.entity.Service service, User provider) {
        AdminNotification notification = AdminNotification.builder()
                .type(AdminNotification.NotificationType.NEW_SERVICE)
                .message("Provider " + provider.getName() + " added a new service: " + service.getName())
                .referenceId(service.getId())
                .isRead(false)
                .build();
        return notificationRepository.save(notification);
    }

    @Transactional
    public AdminNotification createUserPromotedNotification(User user) {
        AdminNotification notification = AdminNotification.builder()
                .type(AdminNotification.NotificationType.USER_PROMOTED)
                .message("User " + user.getName() + " promoted to provider")
                .referenceId(user.getId())
                .isRead(false)
                .build();
        return notificationRepository.save(notification);
    }

    @Transactional
    public AdminNotification createPaymentCompletedNotification(Booking booking, BigDecimal amount) {
        AdminNotification notification = AdminNotification.builder()
                .type(AdminNotification.NotificationType.PAYMENT_COMPLETED)
                .message("Payment of $" + amount + " received for Booking #" + booking.getId())
                .referenceId(booking.getId())
                .isRead(false)
                .build();
        return notificationRepository.save(notification);
    }

    @Transactional(readOnly = true)
    public List<AdminNotification> getLatestNotifications() {
        return notificationRepository.findTop10ByOrderByCreatedAtDesc();
    }

    @Transactional(readOnly = true)
    public long getUnreadCount() {
        return notificationRepository.countByIsReadFalse();
    }

    @Transactional
    public void markAsRead(Long notificationId) {
        AdminNotification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        notification.setIsRead(true);
        notificationRepository.save(notification);
    }

    @Transactional
    public void markAllAsRead() {
        List<AdminNotification> unreadNotifications = notificationRepository.findByIsReadFalseOrderByCreatedAtDesc();
        unreadNotifications.forEach(n -> n.setIsRead(true));
        notificationRepository.saveAll(unreadNotifications);
    }
}
