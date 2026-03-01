package com.booking.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookingResponse {
    private Long id;
    private Long userId;
    private String userName;
    private Long slotId;
    private LocalDateTime slotStartTime;
    private LocalDateTime slotEndTime;
    private String serviceName;
    private String status;
    private String paymentStatus;
    private String paymentMethod;
    private BigDecimal amount;
    private String currency;
    private String paymentReference;
    private LocalDateTime paidAt;
}
