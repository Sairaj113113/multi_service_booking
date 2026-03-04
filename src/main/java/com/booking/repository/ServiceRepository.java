package com.booking.repository;

import com.booking.entity.Service;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ServiceRepository extends JpaRepository<Service, Long> {
    List<Service> findByProviderId(Long providerId);

    boolean existsByIdAndProviderId(Long id, Long providerId);
    
    long countByProviderId(Long providerId);
}

