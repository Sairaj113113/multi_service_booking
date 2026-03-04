package com.booking.dto.response;

import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;

@Data
@Builder
public class AdminDashboardStats {
    private long totalUsers;
    private long totalProviders;
    private long totalBookings;
    private long activeBookings;
    private long cancelledBookings;
    private BigDecimal totalRevenue;
    private BigDecimal todayRevenue;
}
