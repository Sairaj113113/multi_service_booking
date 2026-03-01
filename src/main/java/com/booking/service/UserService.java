package com.booking.service;

import com.booking.dto.request.UpdateProfileRequest;
import com.booking.dto.response.UserProfileResponse;
import com.booking.entity.User;
import com.booking.exception.ResourceNotFoundException;
import com.booking.repository.UserRepository;
import com.booking.security.CustomUserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public UserProfileResponse getMyProfile(CustomUserDetails currentUser) {
        User user = userRepository.findById(currentUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return mapToProfile(user);
    }

    @Transactional
    public UserProfileResponse updateMyProfile(UpdateProfileRequest request, CustomUserDetails currentUser) {
        User user = userRepository.findById(currentUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        user.setName(request.getName());
        user.setAvatarUrl(request.getAvatarUrl());
        user.setPhone(request.getPhone());
        user.setBio(request.getBio());
        user.setAddress(request.getAddress());
        user.setCity(request.getCity());
        user.setCountry(request.getCountry());
        user.setCompanyName(request.getCompanyName());
        user.setWebsite(request.getWebsite());
        user.setTimezone(request.getTimezone());

        return mapToProfile(userRepository.save(user));
    }

    private UserProfileResponse mapToProfile(User user) {
        return UserProfileResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole().name())
                .avatarUrl(user.getAvatarUrl())
                .phone(user.getPhone())
                .bio(user.getBio())
                .address(user.getAddress())
                .city(user.getCity())
                .country(user.getCountry())
                .companyName(user.getCompanyName())
                .website(user.getWebsite())
                .timezone(user.getTimezone())
                .build();
    }
}
