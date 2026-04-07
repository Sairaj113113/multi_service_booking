package com.booking.controller;

import com.booking.dto.request.ServiceRequest;
import com.booking.dto.response.ServiceResponse;
import com.booking.security.CustomUserDetails;
import com.booking.service.ServiceService;
import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/services")
public class ServiceController {

    private final ServiceService serviceService;
    private final Cloudinary cloudinary;

    // ✅ Constructor Injection
    public ServiceController(ServiceService serviceService, Cloudinary cloudinary) {
        this.serviceService = serviceService;
        this.cloudinary = cloudinary;
    }

    // ✅ CREATE SERVICE (SAFE IMAGE UPLOAD)
    @PostMapping(consumes = "multipart/form-data")
    @PreAuthorize("hasAuthority('ROLE_PROVIDER')")
    public ResponseEntity<ServiceResponse> createService(
            @RequestParam String name,
            @RequestParam(required = false) String description,
            @RequestParam Double price,
            @RequestParam Integer durationMinutes,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) MultipartFile image, // ✅ optional now
            @AuthenticationPrincipal CustomUserDetails currentUser) {

        try {
            String imageUrl = null;

            // 🔥 SAFE Cloudinary Upload
            try {
                if (image != null && !image.isEmpty()) {
                    Map uploadResult = cloudinary.uploader().upload(
                            image.getBytes(),
                            ObjectUtils.emptyMap()
                    );
                    imageUrl = uploadResult.get("secure_url").toString();
                }
            } catch (Exception e) {
                e.printStackTrace();
                imageUrl = null; // ✅ no crash
            }

            // 🔹 Build request object
            ServiceRequest request = new ServiceRequest();
            request.setName(name);
            request.setDescription(description);
            request.setPrice(BigDecimal.valueOf(price));
            request.setDurationMinutes(durationMinutes);
            request.setLocation(location);
            request.setImageUrl(imageUrl); // ✅ safe

            // 🔹 Save to DB
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