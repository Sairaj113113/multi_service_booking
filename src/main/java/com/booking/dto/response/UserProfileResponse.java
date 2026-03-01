package com.booking.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserProfileResponse {
    private Long id;
    private String name;
    private String email;
    private String role;
    private String avatarUrl;
    private String phone;
    private String bio;
    private String address;
    private String city;
    private String country;
    private String companyName;
    private String website;
    private String timezone;
}
