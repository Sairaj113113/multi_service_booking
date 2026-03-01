package com.booking.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class PaymentRequest {

    @NotBlank(message = "Payment method is required")
    @Size(max = 20, message = "Payment method is too long")
    private String paymentMethod;

    @Size(max = 120, message = "Payment reference is too long")
    private String paymentReference;
}
