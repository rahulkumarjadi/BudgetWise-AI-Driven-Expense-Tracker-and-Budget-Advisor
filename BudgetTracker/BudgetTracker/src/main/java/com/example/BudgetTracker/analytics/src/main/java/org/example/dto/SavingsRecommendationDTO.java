package com.example.BudgetTracker.analytics.src.main.java.org.example.dto;

//public class SavingsRecommendationDTO {
//}


//package com.example.BudgetTracker.analytics.src.main.java.org.example.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SavingsRecommendationDTO {
    private String category;
    private double potentialSavings;
    private String recommendation;
    private String priority;  // "High", "Medium", "Low"
}