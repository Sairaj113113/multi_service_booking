package com.booking;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.booking.entity.User;        // ✅ ADD THIS
       // ✅ ADD THIS
import com.booking.repository.UserRepository;

@SpringBootApplication
public class BookingSystemApplication {

    public static void main(String[] args) {
        SpringApplication.run(BookingSystemApplication.class, args);
    }

    @Bean
public CommandLineRunner createAdmin(UserRepository userRepository, PasswordEncoder passwordEncoder) {
    return args -> {

        String adminEmail = "luxeadmin@luxebook.com";

        User admin = userRepository.findByEmail(adminEmail)
                .orElse(new User());

        admin.setName("Admin");
        admin.setEmail(adminEmail);

        // 🔥 FORCE RESET PASSWORD EVERY TIME
        admin.setPassword(passwordEncoder.encode("admin123"));

        admin.setRole(User.Role.ROLE_ADMIN);

        userRepository.save(admin);

        System.out.println("Admin reset done!");
    };
}
}