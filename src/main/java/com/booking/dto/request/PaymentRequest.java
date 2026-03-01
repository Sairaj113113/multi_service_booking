package com.booking.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class PaymentRequest {

    @NotBlank(message = "Payment method is required")
    private String paymentMethod;

    private String paymentReference;
}
