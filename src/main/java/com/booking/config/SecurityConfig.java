package com.booking.config;

import com.booking.security.CustomUserDetailsService;
import com.booking.security.JwtAuthEntryPoint;
import com.booking.security.JwtAuthenticationFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    private final CustomUserDetailsService userDetailsService;
    private final JwtAuthenticationFilter jwtAuthFilter;
    private final JwtAuthEntryPoint jwtAuthEntryPoint;

    public SecurityConfig(CustomUserDetailsService userDetailsService,
                          JwtAuthenticationFilter jwtAuthFilter,
                          JwtAuthEntryPoint jwtAuthEntryPoint) {
        this.userDetailsService = userDetailsService;
        this.jwtAuthFilter = jwtAuthFilter;
        this.jwtAuthEntryPoint = jwtAuthEntryPoint;
    }

    @Bean
public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

    http
            .cors(cors -> {}) // ✅ ENABLE CORS (THIS WAS MISSING)

            .csrf(csrf -> csrf.disable())

            .headers(headers ->
                    headers.frameOptions(frame -> frame.disable())
            )

            .sessionManagement(session ->
                    session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )

            .authorizeHttpRequests(auth -> auth

                    // H2
                    .requestMatchers("/h2-console/**").permitAll()

                    // AUTH
                    .requestMatchers(HttpMethod.POST, "/api/auth/register").permitAll()
                    .requestMatchers(HttpMethod.POST, "/api/auth/login").permitAll()

                    // PUBLIC GET
                    .requestMatchers(HttpMethod.GET, "/api/services/**").permitAll()
                    .requestMatchers(HttpMethod.GET, "/api/slots/**").permitAll()

                    // PROVIDER
                    .requestMatchers(HttpMethod.POST, "/api/services/**").hasRole("PROVIDER")
                    .requestMatchers(HttpMethod.POST, "/api/slots/**").hasRole("PROVIDER")

                    // USER
                    .requestMatchers(HttpMethod.POST, "/api/bookings/**").hasRole("USER")
                    .requestMatchers(HttpMethod.PUT, "/api/bookings/**").hasRole("USER")
                    .requestMatchers(HttpMethod.GET, "/api/bookings/my").hasRole("USER")

                    // ADMIN
                    .requestMatchers("/api/admin/**").hasRole("ADMIN")

                    .anyRequest().permitAll()
            )

            .authenticationProvider(authenticationProvider())

            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

    return http.build();
}
    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(userDetailsService);
        provider.setPasswordEncoder(passwordEncoder());
        return provider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config)
            throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}