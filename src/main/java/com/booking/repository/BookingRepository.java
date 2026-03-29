package com.booking.repository;

import com.booking.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    // ── User queries ─────────────────────────────────────────────

    @Query("""
        SELECT b FROM Booking b
        JOIN FETCH b.slot s
        JOIN FETCH s.service
        JOIN FETCH b.user
        WHERE b.user.id = :userId
        ORDER BY b.createdAt DESC
    """)
    List<Booking> findMyBookings(@Param("userId") Long userId);

    /**
     * Find any non-cancelled booking this user has for a specific slot.
     * Used to prevent duplicate bookings and to surface pending-payment bookings for retry.
     */
    @Query("""
        SELECT b FROM Booking b
        JOIN FETCH b.slot s
        JOIN FETCH s.service
        WHERE b.user.id = :userId
          AND s.id = :slotId
          AND b.status <> com.booking.entity.Booking$BookingStatus.CANCELLED
    """)
    Optional<Booking> findActiveBookingByUserAndSlot(
            @Param("userId") Long userId,
            @Param("slotId") Long slotId);

    // ── Slot queries ──────────────────────────────────────────────

    boolean existsBySlotIdAndStatus(Long slotId, Booking.BookingStatus status);

    List<Booking> findBySlotId(Long slotId);

    // ── Razorpay ──────────────────────────────────────────────────

    Booking findByRazorpayOrderId(String razorpayOrderId);

    // ── Full fetch (no LazyInitializationException) ───────────────

    @Query("""
        SELECT b FROM Booking b
        JOIN FETCH b.slot s
        JOIN FETCH s.service svc
        JOIN FETCH svc.provider p
        JOIN FETCH b.user u
        WHERE b.id = :id
    """)
    Optional<Booking> findByIdWithDetails(@Param("id") Long id);

    // ── Provider queries ──────────────────────────────────────────

    @Query("""
        SELECT b FROM Booking b
        JOIN FETCH b.user
        JOIN FETCH b.slot s
        JOIN FETCH s.service sv
        JOIN FETCH sv.provider p
        WHERE sv.provider.id = :providerId
        ORDER BY b.createdAt DESC
    """)
    List<Booking> findByProviderId(@Param("providerId") Long providerId);

    // ── Admin queries ─────────────────────────────────────────────

    @Query("""
        SELECT b FROM Booking b
        JOIN FETCH b.user
        JOIN FETCH b.slot s
        JOIN FETCH s.service
        ORDER BY b.createdAt DESC
    """)
    List<Booking> findAllWithSlotAndService();

    // ── Analytics ─────────────────────────────────────────────────

    @Query("SELECT COALESCE(SUM(b.amount), 0) FROM Booking b WHERE b.paymentStatus = :status")
    BigDecimal sumAmountByPaymentStatus(@Param("status") Booking.PaymentStatus status);

    List<Booking> findByCreatedAtAfter(LocalDateTime dateTime);

    List<Booking> findByPaymentStatusAndCreatedAtAfter(
            Booking.PaymentStatus status, LocalDateTime dateTime);
}