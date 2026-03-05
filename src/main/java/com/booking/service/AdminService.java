package com.booking.service;

import com.booking.dto.response.AdminBookingResponse;
import com.booking.dto.response.AdminDashboardStats;
import com.booking.dto.response.AdminProviderResponse;
import com.booking.dto.response.UserResponse;
import com.booking.entity.Booking;
import com.booking.entity.User;
import com.booking.exception.ResourceNotFoundException;
import com.booking.repository.BookingRepository;
import com.booking.repository.ServiceRepository;
import com.booking.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminService {

    private final UserRepository userRepository;
    private final BookingRepository bookingRepository;
    private final ServiceRepository serviceRepository;
    private final AdminNotificationService notificationService;

    public AdminService(UserRepository userRepository,
                       BookingRepository bookingRepository,
                       ServiceRepository serviceRepository,
                       AdminNotificationService notificationService) {
        this.userRepository = userRepository;
        this.bookingRepository = bookingRepository;
        this.serviceRepository = serviceRepository;
        this.notificationService = notificationService;
    }

    public List<UserResponse> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(user -> UserResponse.builder()
                        .id(user.getId())
                        .name(user.getName())
                        .email(user.getEmail())
                        .role(user.getRole().name())
                        .build())
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public AdminDashboardStats getDashboardStats() {
        List<User> allUsers = userRepository.findAll();
        List<Booking> allBookings = bookingRepository.findAll();

        long totalUsers = allUsers.size();
        long totalProviders = allUsers.stream()
                .filter(u -> u.getRole() == User.Role.ROLE_PROVIDER)
                .count();
        long totalBookings = allBookings.size();
        long activeBookings = allBookings.stream()
                .filter(b -> b.getStatus() == Booking.BookingStatus.CONFIRMED)
                .count();
        long cancelledBookings = allBookings.stream()
                .filter(b -> b.getStatus() == Booking.BookingStatus.CANCELLED)
                .count();

        // Calculate total revenue from PAID bookings
        BigDecimal totalRevenue = allBookings.stream()
                .filter(b -> b.getPaymentStatus() == Booking.PaymentStatus.PAID)
                .map(Booking::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Calculate today's revenue
        LocalDateTime todayStart = LocalDate.now().atStartOfDay();
        LocalDateTime todayEnd = LocalDate.now().atTime(LocalTime.MAX);
        BigDecimal todayRevenue = allBookings.stream()
                .filter(b -> b.getPaymentStatus() == Booking.PaymentStatus.PAID)
                .filter(b -> b.getPaidAt() != null)
                .filter(b -> !b.getPaidAt().isBefore(todayStart) && !b.getPaidAt().isAfter(todayEnd))
                .map(Booking::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return AdminDashboardStats.builder()
                .totalUsers(totalUsers)
                .totalProviders(totalProviders)
                .totalBookings(totalBookings)
                .activeBookings(activeBookings)
                .cancelledBookings(cancelledBookings)
                .totalRevenue(totalRevenue)
                .todayRevenue(todayRevenue)
                .build();
    }

    @Transactional(readOnly = true)
    public List<AdminBookingResponse> getAllBookings() {
        return bookingRepository.findAll()
                .stream()
                .map(this::mapToAdminBookingResponse)
                .collect(Collectors.toList());
    }

    private AdminBookingResponse mapToAdminBookingResponse(Booking booking) {
        return AdminBookingResponse.builder()
                .bookingId(booking.getId())
                .userName(booking.getUser().getName())
                .userEmail(booking.getUser().getEmail())
                .serviceName(booking.getSlot().getService().getName())
                .slotStartTime(booking.getSlot().getStartTime())
                .slotEndTime(booking.getSlot().getEndTime())
                .amount(booking.getAmount())
                .currency(booking.getCurrency())
                .status(booking.getStatus().name())
                .paymentStatus(booking.getPaymentStatus().name())
                .paymentMethod(booking.getPaymentMethod().name())
                .createdAt(booking.getCreatedAt())
                .paidAt(booking.getPaidAt())
                .build();
    }

    @Transactional
    public void cancelBooking(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + bookingId));

        booking.setStatus(Booking.BookingStatus.CANCELLED);
        bookingRepository.save(booking);
    }

    @Transactional(readOnly = true)
    public List<AdminProviderResponse> getAllProviders() {
        return userRepository.findAll()
                .stream()
                .filter(u -> u.getRole() == User.Role.ROLE_PROVIDER)
                .map(this::mapToAdminProviderResponse)
                .collect(Collectors.toList());
    }

    private AdminProviderResponse mapToAdminProviderResponse(User provider) {
        long totalServices = serviceRepository.countByProviderId(provider.getId());

        return AdminProviderResponse.builder()
                .id(provider.getId())
                .name(provider.getName())
                .email(provider.getEmail())
                .phone(provider.getPhone())
                .totalServices(totalServices)
                .totalBookingsHandled(0)
                .build();
    }

    @Transactional
    public void promoteUserToProvider(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        if (user.getRole() == User.Role.ROLE_PROVIDER) {
            throw new IllegalStateException("User is already a provider");
        }

        user.setRole(User.Role.ROLE_PROVIDER);
        userRepository.save(user);

        // Create admin notification for user promotion
        notificationService.createUserPromotedNotification(user);
    }
}
