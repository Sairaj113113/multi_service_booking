package com.booking.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "platform_settings")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PlatformSettings {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Builder.Default
    @Column(name = "platform_name", length = 100)
    private String platformName = "LuxeBook";

    @Builder.Default
    @Column(name = "support_email", length = 100)
    private String supportEmail = "support@luxebook.com";

    @Builder.Default
    @Column(name = "contact_phone", length = 30)
    private String contactPhone = "";

    @Builder.Default
    @Column(length = 10)
    private String currency = "USD";

    @Builder.Default
    @Column(length = 50)
    private String timezone = "UTC";

    @Builder.Default
    @Column(name = "booking_duration")
    private Integer bookingDuration = 60;

    @Builder.Default
    @Column(name = "max_bookings_per_slot")
    private Integer maxBookingsPerSlot = 1;

    @Builder.Default
    @Column(name = "cancellation_hours")
    private Integer cancellationHours = 24;

    @Builder.Default
    @Column(name = "platform_commission")
    private Double platformCommission = 10.0;

    @Builder.Default
    @Column(name = "enable_payments")
    private Boolean enablePayments = true;

    @Builder.Default
    @Column(name = "enable_notifications")
    private Boolean enableNotifications = true;
}
