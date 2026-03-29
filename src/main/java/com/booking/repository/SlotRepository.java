package com.booking.repository;

import com.booking.entity.Slot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface SlotRepository extends JpaRepository<Slot, Long> {

    List<Slot> findByServiceId(Long serviceId);

    List<Slot> findByServiceIdAndAvailableTrue(Long serviceId);

    // ✅ NEW METHOD (IMPORTANT)
    List<Slot> findByServiceIdAndAvailableTrueAndStartTimeAfter(
            Long serviceId, LocalDateTime now
    );

    @Modifying
    @org.springframework.data.jpa.repository.Query("DELETE FROM Slot s WHERE s.service.id = :serviceId")
    void deleteByServiceId(@Param("serviceId") Long serviceId);
}