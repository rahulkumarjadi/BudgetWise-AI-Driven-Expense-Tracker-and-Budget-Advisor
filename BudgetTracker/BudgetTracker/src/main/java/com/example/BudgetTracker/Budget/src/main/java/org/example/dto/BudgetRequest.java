package com.example.BudgetTracker.Budget.src.main.java.org.example.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class BudgetRequest {
    @JsonProperty("userId")
    private Long userId;
    private String category;
    private double limitAmount;
    private int budgetMonth;
    private int budgetYear;
}


