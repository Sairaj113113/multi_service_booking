package com.booking.config;

import com.cloudinary.Cloudinary;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.HashMap;
import java.util.Map;

@Configuration
public class CloudinaryConfig {

    @Bean
    public Cloudinary cloudinary() {
        Map<String, String> config = new HashMap<>();
        config.put("cloud_name", "droabswua");
        config.put("api_key", "794548179974695");
        config.put("api_secret", "5e-I3I5GTjeeOXlmbFnXkUR0V6U"); // ⚠️ rotate later

        return new Cloudinary(config);
    }
}