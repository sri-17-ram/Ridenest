package com.saferidekids.config;

import com.saferidekids.entity.Driver;
import com.saferidekids.entity.Institution;
import com.saferidekids.entity.Parent;
import com.saferidekids.entity.User;
import com.saferidekids.entity.User.Role;
import com.saferidekids.entity.Vehicle;
import com.saferidekids.entity.Vehicle.VehicleType;
import com.saferidekids.repository.DriverRepository;
import com.saferidekids.repository.InstitutionRepository;
import com.saferidekids.repository.ParentRepository;
import com.saferidekids.repository.UserRepository;
import com.saferidekids.repository.VehicleRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final ParentRepository parentRepository;
    private final DriverRepository driverRepository;
    private final InstitutionRepository institutionRepository;
    private final VehicleRepository vehicleRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) {
        log.info("Running DataSeeder to inject missing demo users...");

        // Admin User
        if (!userRepository.existsByEmail("sriapral@gmail.com")) {
            User admin = User.builder()
                    .email("sriapral@gmail.com")
                    .password(passwordEncoder.encode("sriapral1726"))
                    .firstName("Sri")
                    .lastName("Admin")
                    .phoneNumber("9000000001")
                    .role(Role.ADMIN)
                    .enabled(true)
                    .verified(true)
                    .build();
            userRepository.save(admin);
            log.info("Created Admin demo user.");
        }

        // Driver User
        if (!userRepository.existsByEmail("driver@demo.com")) {
            User driverUser = User.builder()
                    .email("driver@demo.com")
                    .password(passwordEncoder.encode("Demo@1234"))
                    .firstName("Demo")
                    .lastName("Driver")
                    .phoneNumber("9000000002")
                    .role(Role.DRIVER)
                    .enabled(true)
                    .verified(true)
                    .build();
            driverUser = userRepository.save(driverUser);

            Driver driverProfile = Driver.builder()
                    .user(driverUser)
                    .address("123 Driver St")
                    .city("Bangalore")
                    .build();
            driverRepository.save(driverProfile);
            log.info("Created Driver demo user.");
            
            if (vehicleRepository.count() == 0) {
                Vehicle vehicle1 = Vehicle.builder()
                        .driver(driverProfile)
                        .registrationNumber("TN 01 AB 4321")
                        .type(VehicleType.BUS)
                        .seatingCapacity(40)
                        .make("Tata")
                        .model("Starbus")
                        .year(2022)
                        .active(true)
                        .overallStatus(Vehicle.VerificationStatus.APPROVED)
                        .build();
                vehicleRepository.save(vehicle1);
                
                Vehicle vehicle2 = Vehicle.builder()
                        .driver(driverProfile)
                        .registrationNumber("TN 07 BX 2198")
                        .type(VehicleType.VAN)
                        .seatingCapacity(12)
                        .make("Force")
                        .model("Traveller")
                        .year(2023)
                        .active(true)
                        .overallStatus(Vehicle.VerificationStatus.APPROVED)
                        .build();
                vehicleRepository.save(vehicle2);
                log.info("Created Demo Vehicles with TN registration.");
            }
        }

        // Institution User
        if (!userRepository.existsByEmail("school@demo.com")) {
            User schoolUser = User.builder()
                    .email("school@demo.com")
                    .password(passwordEncoder.encode("Demo@1234"))
                    .firstName("Demo")
                    .lastName("School")
                    .phoneNumber("9000000003")
                    .role(Role.INSTITUTION)
                    .enabled(true)
                    .verified(true)
                    .build();
            schoolUser = userRepository.save(schoolUser);

            Institution institutionProfile = Institution.builder()
                    .user(schoolUser)
                    .name("Demo School")
                    .type(Institution.InstitutionType.SCHOOL)
                    .registrationNumber("REG123456")
                    .address("456 School Rd")
                    .city("Bangalore")
                    .state("Karnataka")
                    .pincode("560001")
                    .build();
            institutionRepository.save(institutionProfile);
            log.info("Created Institution demo user.");
        }

        // Parent User
        if (!userRepository.existsByEmail("parent@demo.com")) {
            User parentUser = User.builder()
                    .email("parent@demo.com")
                    .password(passwordEncoder.encode("Demo@1234"))
                    .firstName("Demo")
                    .lastName("Parent")
                    .phoneNumber("9000000004")
                    .role(Role.PARENT)
                    .enabled(true)
                    .verified(true)
                    .build();
            parentUser = userRepository.save(parentUser);

            Parent parentProfile = Parent.builder()
                    .user(parentUser)
                    .address("789 Parent Ave")
                    .city("Bangalore")
                    .state("Karnataka")
                    .pincode("560002")
                    .build();
            parentRepository.save(parentProfile);
            log.info("Created Parent demo user.");
        }

        log.info("DataSeeder complete.");
    }
}
