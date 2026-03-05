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

    @Query("""
        SELECT b FROM Booking b
        JOIN FETCH b.user
        JOIN FETCH b.slot s
        JOIN FETCH s.service
        WHERE b.user.id = :userId
    """)
    List<Booking> findMyBookings(Long userId);

    boolean existsBySlotIdAndStatus(Long slotId, Booking.BookingStatus status);
    
    Booking findByRazorpayOrderId(String razorpayOrderId);
    
    @Query("SELECT b FROM Booking b JOIN FETCH b.user WHERE b.id = :id")
    Optional<Booking> findByIdWithUser(@Param("id") Long id);

    @Query("SELECT COALESCE(SUM(b.amount), 0) FROM Booking b WHERE b.paymentStatus = :status")
    BigDecimal sumAmountByPaymentStatus(Booking.PaymentStatus status);

    List<Booking> findByCreatedAtAfter(LocalDateTime dateTime);

    List<Booking> findByPaymentStatusAndCreatedAtAfter(Booking.PaymentStatus status, LocalDateTime dateTime);

    @Query("""
        SELECT b FROM Booking b
        JOIN FETCH b.slot s
        JOIN FETCH s.service
    """)
    List<Booking> findAllWithSlotAndService();

    @Query("""
        SELECT b FROM Booking b
        JOIN FETCH b.user
        JOIN FETCH b.slot s
        JOIN FETCH s.service sv
        WHERE sv.provider.id = :providerId
    """)
    List<Booking> findByProviderId(@Param("providerId") Long providerId);
}