package com.booking.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AdminProviderResponse {
    private Long id;
    private String name;
    private String email;
    private String phone;
    private long totalServices;
    private long totalBookingsHandled;
}
