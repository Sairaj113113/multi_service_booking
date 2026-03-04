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

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "slot_id", nullable = false)
    private Slot slot;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private BookingStatus status = BookingStatus.PENDING_PAYMENT;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private PaymentStatus paymentStatus = PaymentStatus.PENDING;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PaymentMethod paymentMethod;

    @Column(nullable = false, precision = 10, scale = 2)
    private java.math.BigDecimal amount;

    @Column(nullable = false, length = 10)
    @Builder.Default
    private String currency = "USD";

    @Column(length = 120)
    private String paymentReference;

    @Column(length = 100)
    private String razorpayOrderId;

    private java.time.LocalDateTime paidAt;

    @Column(nullable = false, updatable = false)
    private java.time.LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = java.time.LocalDateTime.now();
    }

    public enum BookingStatus {
        PENDING_PAYMENT, CONFIRMED, BOOKED, CANCELLED
    }

    public enum PaymentStatus {
        PENDING, PAID, FAILED, REFUNDED
    }

    public enum PaymentMethod {
        CARD, UPI, CASH
    }
}
