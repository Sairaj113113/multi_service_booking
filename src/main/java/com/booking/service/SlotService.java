package com.booking.service;

import com.booking.dto.request.SlotRequest;
import com.booking.dto.response.SlotResponse;
import com.booking.entity.Service;
import com.booking.entity.Slot;
import com.booking.exception.BadRequestException;
import com.booking.exception.ResourceNotFoundException;
import com.booking.repository.ServiceRepository;
import com.booking.repository.SlotRepository;
import com.booking.security.CustomUserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class SlotService {

    private final SlotRepository slotRepository;
    private final ServiceRepository serviceRepository;

    public SlotService(SlotRepository slotRepository,
                       ServiceRepository serviceRepository) {
        this.slotRepository = slotRepository;
        this.serviceRepository = serviceRepository;
    }

    public SlotResponse createSlot(SlotRequest request, CustomUserDetails currentUser) {

        Service service = serviceRepository.findById(request.getServiceId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Service not found with id: " + request.getServiceId()));

        // 🔐 Provider ownership check
        if (!service.getProvider().getId().equals(currentUser.getId())) {
            throw new com.booking.exception.AccessDeniedException(
                    "You can only create slots for your own services");
        }

        // ⏱ Time validation
        if (!request.getEndTime().isAfter(request.getStartTime())) {
            throw new BadRequestException("End time must be after start time");
        }

        Slot slot = Slot.builder()
                .service(service)
                .startTime(request.getStartTime())
                .endTime(request.getEndTime())
                .available(true)
                .build();

        return mapToResponse(slotRepository.save(slot));
    }

    @Transactional(readOnly = true)
    public List<SlotResponse> getSlotsByService(Long serviceId) {

        if (!serviceRepository.existsById(serviceId)) {
            throw new ResourceNotFoundException("Service not found with id: " + serviceId);
        }

        return slotRepository.findByServiceId(serviceId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<SlotResponse> getAvailableSlotsByService(Long serviceId) {

        if (!serviceRepository.existsById(serviceId)) {
            throw new ResourceNotFoundException("Service not found with id: " + serviceId);
        }

        return slotRepository.findByServiceIdAndAvailableTrue(serviceId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private SlotResponse mapToResponse(Slot slot) {
        return SlotResponse.builder()
                .id(slot.getId())
                .serviceId(slot.getService().getId())
                .serviceName(slot.getService().getName()) // ✅ now safe
                .startTime(slot.getStartTime())
                .endTime(slot.getEndTime())
                .available(slot.getAvailable())
                .build();
    }
}
