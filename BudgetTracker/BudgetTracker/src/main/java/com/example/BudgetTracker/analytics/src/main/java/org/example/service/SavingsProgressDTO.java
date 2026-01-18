package com.example.BudgetTracker.analytics.src.main.java.org.example.service;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SavingsProgressDTO {
    private String month;      // e.g., "Jan"
    private double amount;     // e.g., 500.0
    private double target;     // e.g., 1000.0 (Optional, for progress bars)
}