package com.saferidekids;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class SafeRideKidsApplication {
    public static void main(String[] args) {
        SpringApplication.run(SafeRideKidsApplication.class, args);
    }
}
