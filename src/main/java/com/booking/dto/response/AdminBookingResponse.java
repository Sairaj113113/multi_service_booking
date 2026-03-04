package com.booking.dto.response;

import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
public class AdminBookingResponse {
    private Long bookingId;
    private String userName;
    private String userEmail;
    private String serviceName;
    private LocalDateTime slotStartTime;
    private LocalDateTime slotEndTime;
    private BigDecimal amount;
    private String currency;
    private String status;
    private String paymentStatus;
    private String paymentMethod;
    private LocalDateTime createdAt;
    private LocalDateTime paidAt;
}
