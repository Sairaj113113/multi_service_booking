package com.booking.repository;

import com.booking.entity.Slot;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SlotRepository extends JpaRepository<Slot, Long> {
    List<Slot> findByServiceId(Long serviceId);
    List<Slot> findByServiceIdAndAvailableTrue(Long serviceId);
}
