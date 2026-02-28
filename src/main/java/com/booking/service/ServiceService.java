package com.booking.service;

import com.booking.dto.request.ServiceRequest;
import com.booking.dto.response.ServiceResponse;
import com.booking.entity.User;
import com.booking.exception.ResourceNotFoundException;
import com.booking.repository.ServiceRepository;
import com.booking.repository.UserRepository;
import com.booking.security.CustomUserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ServiceService {

    private final ServiceRepository serviceRepository;
    private final UserRepository userRepository;

    public ServiceService(ServiceRepository serviceRepository, UserRepository userRepository) {
        this.serviceRepository = serviceRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public ServiceResponse createService(ServiceRequest request, CustomUserDetails currentUser) {

        User provider = userRepository.findById(currentUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Provider not found"));

        com.booking.entity.Service service = com.booking.entity.Service.builder()
                .name(request.getName())
                .description(request.getDescription())
                .price(request.getPrice())
                .durationMinutes(request.getDurationMinutes())
                .provider(provider)
                .build();

        return mapToResponse(serviceRepository.save(service));
    }

    @Transactional(readOnly = true)
    public List<ServiceResponse> getAllServices() {
        return serviceRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ServiceResponse getServiceById(Long id) {

        com.booking.entity.Service service = serviceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Service not found with id: " + id));

        return mapToResponse(service);
    }

    private ServiceResponse mapToResponse(com.booking.entity.Service service) {

        return ServiceResponse.builder()
                .id(service.getId())
                .name(service.getName())
                .description(service.getDescription())
                .price(service.getPrice())
                .durationMinutes(service.getDurationMinutes())
                .providerId(service.getProvider().getId())
                .providerName(service.getProvider().getName())
                .build();
    }
}
