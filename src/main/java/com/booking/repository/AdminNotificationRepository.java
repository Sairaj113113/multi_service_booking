package com.booking.repository;

import com.booking.entity.AdminNotification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AdminNotificationRepository extends JpaRepository<AdminNotification, Long> {

    List<AdminNotification> findTop10ByOrderByCreatedAtDesc();

    List<AdminNotification> findByIsReadFalseOrderByCreatedAtDesc();

    long countByIsReadFalse();
}
