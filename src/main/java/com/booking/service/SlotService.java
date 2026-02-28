package com.booking.service;

import com.booking.dto.request.SlotRequest;
import com.booking.dto.response.SlotResponse;
import com.booking.entity.Service;
import com.booking.entity.Slot;
import com.booking.exception.ResourceNotFoundException;
import com.booking.repository.ServiceRepository;
import com.booking.repository.SlotRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SlotService {

    private final SlotRepository slotRepository;
    private final ServiceRepository serviceRepository;

    public SlotService(SlotRepository slotRepository,
                       ServiceRepository serviceRepository) {
        this.slotRepository = slotRepository;
        this.serviceRepository = serviceRepository;
    }

    @Transactional
    public SlotResponse createSlot(SlotRequest request) {

        Service service = serviceRepository.findById(request.getServiceId())
                .orElseThrow(() -> new ResourceNotFoundException("Service not found"));

        Slot slot = Slot.builder()
                .service(service)
                .startTime(request.getStartTime())
                .endTime(request.getEndTime())
                .isBooked(false)
                .build();

        return mapToResponse(slotRepository.save(slot));
    }

    @Transactional(readOnly = true)
    public List<SlotResponse> getSlotsByService(Long serviceId) {

        return slotRepository.findByServiceId(serviceId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<SlotResponse> getAvailableSlots(Long serviceId) {

        return slotRepository.findByServiceIdAndIsBookedFalse(serviceId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private SlotResponse mapToResponse(Slot slot) {
        return SlotResponse.builder()
                .id(slot.getId())
                .startTime(slot.getStartTime())
                .endTime(slot.getEndTime())
                .isBooked(slot.getIsBooked())

                // 🔥 ACCESS INSIDE SESSION
                .serviceId(slot.getService().getId())
                .serviceName(slot.getService().getName())

                .build();
    }
}
