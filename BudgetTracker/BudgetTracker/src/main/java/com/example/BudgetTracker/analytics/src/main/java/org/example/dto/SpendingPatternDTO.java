package com.example.BudgetTracker.analytics.src.main.java.org.example.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SpendingPatternDTO {
    private String pattern;  // e.g., "Increasing", "Decreasing", "Stable"
    private double percentageChange;
    private String topCategory;
    private double topCategoryAmount;
    private String insight;
}

