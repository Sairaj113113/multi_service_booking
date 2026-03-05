package com.booking.controller;

import com.booking.entity.User;
import com.booking.repository.BookingRepository;
import com.booking.repository.UserRepository;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/analytics")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminAnalyticsController {

    private final UserRepository userRepository;
    private final BookingRepository bookingRepository;

    // DTOs
    @Data
    public static class OverviewResponse {
        private long totalUsers;
        private long totalProviders;
        private long totalBookings;
        private BigDecimal totalRevenue;
    }

    @Data
    public static class TrendData {
        private String date;
        private long bookings;
    }

    @Data
    public static class RevenueTrendData {
        private String date;
        private BigDecimal revenue;
    }

    @Data
    public static class ServiceDistributionData {
        private String service;
        private long count;
    }

    @Data
    public static class ProviderPerformanceData {
        private String providerName;
        private long totalBookings;
        private BigDecimal revenueGenerated;
        private double avgRating;
    }

    @GetMapping("/overview")
    public ResponseEntity<OverviewResponse> getOverview() {
        OverviewResponse response = new OverviewResponse();
        
        // Count total users (excluding providers and admins)
        response.setTotalUsers(userRepository.countByRole(User.Role.ROLE_USER));
        
        // Count total providers
        response.setTotalProviders(userRepository.countByRole(User.Role.ROLE_PROVIDER));
        
        // Count total bookings
        response.setTotalBookings(bookingRepository.count());
        
        // Calculate total revenue from paid bookings
        BigDecimal totalRevenue = bookingRepository.sumAmountByPaymentStatus(
            com.booking.entity.Booking.PaymentStatus.PAID
        );
        response.setTotalRevenue(totalRevenue != null ? totalRevenue : BigDecimal.ZERO);
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/bookings-trend")
    public ResponseEntity<List<TrendData>> getBookingsTrend() {
        // Get bookings from last 30 days grouped by date
        LocalDateTime thirtyDaysAgo = LocalDateTime.now().minusDays(30);
        
        List<com.booking.entity.Booking> recentBookings = bookingRepository
            .findByCreatedAtAfter(thirtyDaysAgo);
        
        // Group by date
        Map<String, Long> bookingsByDate = recentBookings.stream()
            .collect(Collectors.groupingBy(
                b -> b.getCreatedAt().toLocalDate().toString(),
                Collectors.counting()
            ));
        
        // Fill in missing dates with 0
        List<TrendData> result = new ArrayList<>();
        LocalDate startDate = thirtyDaysAgo.toLocalDate();
        LocalDate endDate = LocalDate.now();
        
        for (LocalDate date = startDate; !date.isAfter(endDate); date = date.plusDays(1)) {
            String dateStr = date.toString();
            TrendData data = new TrendData();
            data.setDate(dateStr);
            data.setBookings(bookingsByDate.getOrDefault(dateStr, 0L));
            result.add(data);
        }
        
        return ResponseEntity.ok(result);
    }

    @GetMapping("/revenue-trend")
    public ResponseEntity<List<RevenueTrendData>> getRevenueTrend() {
        // Get paid bookings from last 30 days
        LocalDateTime thirtyDaysAgo = LocalDateTime.now().minusDays(30);
        
        List<com.booking.entity.Booking> paidBookings = bookingRepository
            .findByPaymentStatusAndCreatedAtAfter(
                com.booking.entity.Booking.PaymentStatus.PAID,
                thirtyDaysAgo
            );
        
        // Group by date and sum revenue
        Map<String, BigDecimal> revenueByDate = paidBookings.stream()
            .collect(Collectors.groupingBy(
                b -> b.getCreatedAt().toLocalDate().toString(),
                Collectors.reducing(
                    BigDecimal.ZERO,
                    com.booking.entity.Booking::getAmount,
                    BigDecimal::add
                )
            ));
        
        // Fill in missing dates with 0
        List<RevenueTrendData> result = new ArrayList<>();
        LocalDate startDate = thirtyDaysAgo.toLocalDate();
        LocalDate endDate = LocalDate.now();
        
        for (LocalDate date = startDate; !date.isAfter(endDate); date = date.plusDays(1)) {
            String dateStr = date.toString();
            RevenueTrendData data = new RevenueTrendData();
            data.setDate(dateStr);
            data.setRevenue(revenueByDate.getOrDefault(dateStr, BigDecimal.ZERO));
            result.add(data);
        }
        
        return ResponseEntity.ok(result);
    }

    @GetMapping("/service-distribution")
    public ResponseEntity<List<ServiceDistributionData>> getServiceDistribution() {
        // Use the query that fetches slot and service to avoid lazy loading issues
        List<com.booking.entity.Booking> allBookings = bookingRepository.findAllWithSlotAndService();
        
        // Group by service name (from slot -> service)
        Map<String, Long> serviceCounts = allBookings.stream()
            .filter(b -> b.getSlot() != null && b.getSlot().getService() != null)
            .collect(Collectors.groupingBy(
                b -> b.getSlot().getService().getName(),
                Collectors.counting()
            ));
        
        List<ServiceDistributionData> result = serviceCounts.entrySet().stream()
            .map(entry -> {
                ServiceDistributionData data = new ServiceDistributionData();
                data.setService(entry.getKey());
                data.setCount(entry.getValue());
                return data;
            })
            .sorted((a, b) -> Long.compare(b.getCount(), a.getCount()))
            .collect(Collectors.toList());
        
        return ResponseEntity.ok(result);
    }

    @GetMapping("/provider-performance")
    public ResponseEntity<List<ProviderPerformanceData>> getProviderPerformance() {
        List<User> providers = userRepository.findByRole(User.Role.ROLE_PROVIDER);
        
        List<ProviderPerformanceData> result = providers.stream()
            .map(provider -> {
                ProviderPerformanceData data = new ProviderPerformanceData();
                data.setProviderName(provider.getName());
                
                // Get all bookings for this provider's services
                List<com.booking.entity.Booking> providerBookings = bookingRepository
                    .findByProviderId(provider.getId());
                
                data.setTotalBookings(providerBookings.size());
                
                // Calculate revenue from paid bookings
                BigDecimal revenue = providerBookings.stream()
                    .filter(b -> b.getPaymentStatus() == com.booking.entity.Booking.PaymentStatus.PAID)
                    .map(com.booking.entity.Booking::getAmount)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
                data.setRevenueGenerated(revenue);
                
                // Placeholder for rating (would need review system)
                data.setAvgRating(4.5); // Default placeholder
                
                return data;
            })
            .sorted((a, b) -> b.getRevenueGenerated().compareTo(a.getRevenueGenerated()))
            .collect(Collectors.toList());
        
        return ResponseEntity.ok(result);
    }
}
