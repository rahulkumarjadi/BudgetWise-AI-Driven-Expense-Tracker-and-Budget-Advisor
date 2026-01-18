package com.example.BudgetTracker;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EntityScan(basePackages = "com.example.BudgetTracker") // Tells Spring where @Entity classes are
@EnableJpaRepositories(basePackages = "com.example.BudgetTracker") // Tells Spring where Repositories are
public class BudgetTrackerApplication {
    public static void main(String[] args) {
        SpringApplication.run(BudgetTrackerApplication.class, args);
    }
}