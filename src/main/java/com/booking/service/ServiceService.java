package com.booking.service;

import com.booking.dto.request.ServiceRequest;
import com.booking.dto.response.ServiceResponse;
import com.booking.entity.User;
import com.booking.exception.ResourceNotFoundException;
import com.booking.repository.ServiceRepository;
import com.booking.repository.SlotRepository;
import com.booking.repository.UserRepository;
import com.booking.security.CustomUserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ServiceService {

    private final ServiceRepository serviceRepository;
    private final SlotRepository slotRepository;
    private final UserRepository userRepository;
    private final AdminNotificationService notificationService;

    public ServiceService(ServiceRepository serviceRepository, SlotRepository slotRepository, UserRepository userRepository, AdminNotificationService notificationService) {
        this.serviceRepository = serviceRepository;
        this.slotRepository = slotRepository;
        this.userRepository = userRepository;
        this.notificationService = notificationService;
    }

    @Transactional
    public ServiceResponse createService(ServiceRequest request, CustomUserDetails currentUser) {

        User provider = userRepository.findById(currentUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Provider not found"));

        com.booking.entity.Service service = com.booking.entity.Service.builder()
                .name(request.getName())
                .description(request.getDescription())
                .imageUrl(request.getImageUrl())
                .price(request.getPrice())
                .durationMinutes(request.getDurationMinutes())
                .provider(provider)
                .build();

        com.booking.entity.Service saved = serviceRepository.save(service);
        
        // Create admin notification for new service
        notificationService.createNewServiceNotification(saved, provider);

        return mapToResponse(saved);
    }

@Transactional
public void deleteService(Long serviceId, CustomUserDetails currentUser) {

    boolean isOwner = serviceRepository
            .existsByIdAndProviderId(serviceId, currentUser.getId());

    if (!isOwner) {
        throw new com.booking.exception.AccessDeniedException(
                "You can only delete your own services");
    }

    // Delete all slots associated with this service first
    slotRepository.deleteByServiceId(serviceId);

    serviceRepository.deleteById(serviceId);
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
                .imageUrl(service.getImageUrl())
                .price(service.getPrice())
                .durationMinutes(service.getDurationMinutes())
                .providerId(service.getProvider().getId())
                .providerName(service.getProvider().getName())
                .build();
    }
}
