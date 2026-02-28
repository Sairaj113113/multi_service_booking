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
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class SlotService {

    private final SlotRepository slotRepository;
    private final ServiceRepository serviceRepository;

    public SlotService(SlotRepository slotRepository, ServiceRepository serviceRepository) {
        this.slotRepository = slotRepository;
        this.serviceRepository = serviceRepository;
    }

    public SlotResponse createSlot(SlotRequest request, CustomUserDetails currentUser) {
        Service service = serviceRepository.findById(request.getServiceId())
                .orElseThrow(() -> new ResourceNotFoundException("Service not found with id: " + request.getServiceId()));

        if (!service.getProvider().getId().equals(currentUser.getId())) {
            throw new com.booking.exception.AccessDeniedException("You can only create slots for your own services");
        }

        if (request.getEndTime().isBefore(request.getStartTime()) ||
                request.getEndTime().isEqual(request.getStartTime())) {
            throw new BadRequestException("End time must be after start time");
        }

        Slot slot = Slot.builder()
                .service(service)
                .startTime(request.getStartTime())
                .endTime(request.getEndTime())
                .available(true)
                .build();

        Slot saved = slotRepository.save(slot);
        return mapToResponse(saved);
    }

    public List<SlotResponse> getSlotsByService(Long serviceId) {
        if (!serviceRepository.existsById(serviceId)) {
            throw new ResourceNotFoundException("Service not found with id: " + serviceId);
        }
        return slotRepository.findByServiceId(serviceId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

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
                .serviceName(slot.getService().getName())
                .startTime(slot.getStartTime())
                .endTime(slot.getEndTime())
                .available(slot.getAvailable())
                .build();
    }
}
