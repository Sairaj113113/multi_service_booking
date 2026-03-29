package com.booking.service;

import com.booking.dto.request.ServiceRequest;
import com.booking.dto.response.ServiceResponse;
import com.booking.entity.Slot;
import com.booking.entity.User;
import com.booking.exception.ResourceNotFoundException;
import com.booking.repository.BookingRepository;
import com.booking.repository.ServiceRepository;
import com.booking.repository.SlotRepository;
import com.booking.repository.UserRepository;
import com.booking.security.CustomUserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ServiceService {

    private final ServiceRepository serviceRepository;
    private final SlotRepository slotRepository;
    private final UserRepository userRepository;
    private final BookingRepository bookingRepository; // 🔥 ADD THIS
    private final AdminNotificationService notificationService;

    public ServiceService(ServiceRepository serviceRepository,
                          SlotRepository slotRepository,
                          UserRepository userRepository,
                          BookingRepository bookingRepository, // 🔥 ADD
                          AdminNotificationService notificationService) {
        this.serviceRepository = serviceRepository;
        this.slotRepository = slotRepository;
        this.userRepository = userRepository;
        this.bookingRepository = bookingRepository;
        this.notificationService = notificationService;
        
    }

    // ✅ CREATE SERVICE
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
                .location(request.getLocation())                
                .provider(provider)
                .build();
                

        com.booking.entity.Service saved = serviceRepository.save(service);

        notificationService.createNewServiceNotification(saved, provider);

        return mapToResponse(saved);
    }

    // ✅ DELETE SERVICE (FINAL FIX)
    @Transactional
    public void deleteService(Long serviceId, CustomUserDetails currentUser) {

        // 🔹 Fetch service
        com.booking.entity.Service service = serviceRepository.findById(serviceId)
                .orElseThrow(() -> new ResourceNotFoundException("Service not found"));

        // 🔒 Ownership check
        if (!service.getProvider().getId().equals(currentUser.getId())) {
            throw new RuntimeException("Unauthorized");
        }

        // 🔥 Delete image file
        try {
            String imageUrl = service.getImageUrl();

            if (imageUrl != null && imageUrl.contains("/uploads/")) {
                String fileName = imageUrl.substring(imageUrl.lastIndexOf("/") + 1);
                Path filePath = Paths.get("uploads").resolve(fileName);
                Files.deleteIfExists(filePath);
            }

        } catch (Exception e) {
            e.printStackTrace();
        }

        // 🔥 STEP 1: DELETE BOOKINGS FIRST
        List<Slot> slots = slotRepository.findByServiceId(serviceId);

        for (Slot slot : slots) {
            bookingRepository.findBySlotId(slot.getId())
                    .forEach(bookingRepository::delete);
        }

        // 🔥 STEP 2: DELETE SLOTS
        for (Slot slot : slots) {
            slotRepository.delete(slot);
        }

        // 🔥 STEP 3: DELETE SERVICE
        serviceRepository.delete(service);
    }

    // ✅ GET ALL
    @Transactional(readOnly = true)
    public List<ServiceResponse> getAllServices() {
        return serviceRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // ✅ GET BY ID
    @Transactional(readOnly = true)
    public ServiceResponse getServiceById(Long id) {

        com.booking.entity.Service service = serviceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Service not found with id: " + id));

        return mapToResponse(service);
    }

    // ✅ MAPPER
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
                .location(service.getLocation())        
                .build();
    }
}