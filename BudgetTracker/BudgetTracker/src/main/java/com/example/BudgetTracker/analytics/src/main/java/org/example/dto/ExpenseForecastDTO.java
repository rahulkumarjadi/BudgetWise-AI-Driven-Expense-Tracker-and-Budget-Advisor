package com.example.BudgetTracker.analytics.src.main.java.org.example.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ExpenseForecastDTO {
    private double predictedNextMonthExpense;
    private double confidenceLevel;  // 0-100
    private List<CategoryForecastDTO> categoryForecasts;
    private String trend;  // "Upward", "Downward", "Stable"
}