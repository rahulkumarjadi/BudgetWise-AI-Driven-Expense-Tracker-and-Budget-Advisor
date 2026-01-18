package com.example.BudgetTracker.analytics.src.main.java.org.example.dto;

//public class GeminiInsightsDTO {
//}



import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class GeminiInsightsDTO {
    private int financialHealthScore;  // 0-100
    private String healthAssessment;
    private List<String> recommendations;
    private String spendingHabitsAnalysis;
    private String longTermStrategy;
    private List<String> personalizedTips;
}