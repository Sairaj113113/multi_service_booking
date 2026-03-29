package com.booking.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "bookings")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 🔹 USER
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // 🔹 SLOT
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "slot_id", nullable = false)
    private Slot slot;

    // 🔥 FIXED STATUS
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private BookingStatus status = BookingStatus.PENDING_PAYMENT;

    // 🔹 PAYMENT STATUS
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private PaymentStatus paymentStatus = PaymentStatus.PENDING;

    // 🔹 PAYMENT METHOD
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PaymentMethod paymentMethod;

    // 🔹 AMOUNT
    @Column(nullable = false, precision = 10, scale = 2)
    private java.math.BigDecimal amount;

    // 🔹 CURRENCY
    @Column(nullable = false, length = 10)
    @Builder.Default
    private String currency = "USD";

    // 🔹 PAYMENT DETAILS
    @Column(length = 120)
    private String paymentReference;

    @Column(length = 100)
    private String razorpayOrderId;

    private java.time.LocalDateTime paidAt;

    // 🔹 CREATED TIME
    @Column(nullable = false, updatable = false)
    private java.time.LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = java.time.LocalDateTime.now();
    }

    // 🔥 FINAL CLEAN STATUS ENUM
    public enum BookingStatus {
        PENDING_PAYMENT,   // Waiting for provider/payment
        BOOKED,            // Accepted → Active booking
        COMPLETED,         // Service done
        CANCELLED          // Cancelled
    }

    // 🔹 PAYMENT STATUS
    public enum PaymentStatus {
        PENDING,
        PAID,
        FAILED,
        REFUNDED
    }

    // 🔹 PAYMENT METHOD
    public enum PaymentMethod {
        CARD,
        UPI,
        CASH
    }
}