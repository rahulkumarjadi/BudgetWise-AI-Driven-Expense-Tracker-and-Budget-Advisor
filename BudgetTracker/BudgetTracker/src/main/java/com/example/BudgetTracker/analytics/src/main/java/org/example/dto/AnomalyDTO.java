package com.example.BudgetTracker.analytics.src.main.java.org.example.dto;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AnomalyDTO {
    private String category;
    private double amount;
    private String date;
    private String type;  // "Unusual Spike", "Unusual Drop", "Unusual Transaction"
    private double deviationPercentage;
    private String description;
}