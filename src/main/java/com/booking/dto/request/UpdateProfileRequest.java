package com.booking.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UpdateProfileRequest {

    @NotBlank(message = "Name is required")
    @Size(min = 2, max = 120, message = "Name must be between 2 and 120 characters")
    private String name;

    @Size(max = 255, message = "Avatar URL is too long")
    private String avatarUrl;

    @Size(max = 30, message = "Phone is too long")
    private String phone;

    @Size(max = 1000, message = "Bio is too long")
    private String bio;

    @Size(max = 255, message = "Address is too long")
    private String address;

    @Size(max = 100, message = "City is too long")
    private String city;

    @Size(max = 100, message = "Country is too long")
    private String country;

    @Size(max = 150, message = "Company name is too long")
    private String companyName;

    @Size(max = 255, message = "Website is too long")
    private String website;

    @Size(max = 80, message = "Timezone is too long")
    private String timezone;
}
