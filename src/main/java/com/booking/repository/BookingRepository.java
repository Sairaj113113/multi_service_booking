package com.booking.repository;

import com.booking.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

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
}