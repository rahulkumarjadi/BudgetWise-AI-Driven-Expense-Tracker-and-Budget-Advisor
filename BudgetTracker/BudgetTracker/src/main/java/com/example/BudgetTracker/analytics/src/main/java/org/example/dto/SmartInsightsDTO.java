package com.example.BudgetTracker.analytics.src.main.java.org.example.dto;



//package com.example.BudgetTracker.analytics.src.main.java.org.example.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SmartInsightsDTO {
    private SpendingPatternDTO spendingPattern;
    private ExpenseForecastDTO expenseForecast;
    private List<SavingsRecommendationDTO> savingsRecommendations;
    private List<AnomalyDTO> anomalies;
}