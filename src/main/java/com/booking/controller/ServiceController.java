package com.booking.controller;

import com.booking.dto.request.ServiceRequest;
import com.booking.dto.response.ServiceResponse;
import com.booking.security.CustomUserDetails;
import com.booking.service.ServiceService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@RestController
@RequestMapping("/api/services")
public class ServiceController {

    private final ServiceService serviceService;

    public ServiceController(ServiceService serviceService) {
        this.serviceService = serviceService;
    }

    // ✅ CREATE SERVICE (UPDATED FOR IMAGE UPLOAD)
    @PostMapping(consumes = "multipart/form-data")
@PreAuthorize("hasAuthority('ROLE_PROVIDER')")
public ResponseEntity<ServiceResponse> createService(
        @RequestParam String name,
        @RequestParam(required = false) String description,
        @RequestParam Double price,
        @RequestParam Integer durationMinutes,
        @RequestParam(required = false) String location, // ✅ ADD THIS
        @RequestParam MultipartFile image,
        @AuthenticationPrincipal CustomUserDetails currentUser) {

    try {
        // 🔹 Create uploads folder if not exists
        Path uploadPath = Paths.get("uploads");
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        // 🔹 Save image file
        String fileName = System.currentTimeMillis() + "_" + image.getOriginalFilename();
        Path filePath = uploadPath.resolve(fileName);
        Files.write(filePath, image.getBytes());

        // 🔹 Build request object
        ServiceRequest request = new ServiceRequest();
        request.setName(name);
        request.setDescription(description);
        request.setPrice(BigDecimal.valueOf(price));
        request.setDurationMinutes(durationMinutes);
        request.setLocation(location); // ✅ VERY IMPORTANT

        // 🔹 Store image URL
        request.setImageUrl("http://localhost:8080/uploads/" + fileName);

        // 🔹 Call service layer
        ServiceResponse response = serviceService.createService(request, currentUser);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);

    } catch (Exception e) {
        e.printStackTrace();
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }
}

    // ✅ GET ALL SERVICES
    @GetMapping
    public ResponseEntity<List<ServiceResponse>> getAllServices() {
        return ResponseEntity.ok(serviceService.getAllServices());
    }

    // ✅ GET SERVICE BY ID
    @GetMapping("/{id}")
    public ResponseEntity<ServiceResponse> getServiceById(@PathVariable Long id) {
        return ResponseEntity.ok(serviceService.getServiceById(id));
    }

    // ✅ DELETE SERVICE
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_PROVIDER')")
    public ResponseEntity<Void> deleteService(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails currentUser) {

        serviceService.deleteService(id, currentUser);
        return ResponseEntity.noContent().build();
    }
}