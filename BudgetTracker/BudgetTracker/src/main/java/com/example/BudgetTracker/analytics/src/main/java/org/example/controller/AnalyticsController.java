//package com.example.BudgetTracker.analytics.src.main.java.org.example.controller;
//
//import com.example.BudgetTracker.analytics.src.main.java.org.example.dto.*;
//import com.example.BudgetTracker.analytics.src.main.java.org.example.service.AnalyticsService;
//import lombok.RequiredArgsConstructor;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.List;
//
//@RestController
//@RequestMapping("/api/analytics")
//@RequiredArgsConstructor
//@CrossOrigin
//public class AnalyticsController {
//
//    private final AnalyticsService analyticsService;
//
//    @GetMapping("/income-expense")
//    public IncomeExpenseDTO incomeExpense(@RequestParam Long userId,
//                                          @RequestParam int month,
//                                          @RequestParam int year) {
//
//        return analyticsService.getIncomeExpense(userId, month, year);
//    }
//
//
//    @GetMapping("/category-expense")
//    public List<CategoryExpenseDTO> categoryExpense(@RequestParam Long userId,
//                                                    @RequestParam int month,
//                                                    @RequestParam int year,
//                                                    @RequestParam(defaultValue = "All") String category) {
//
//        return analyticsService.getCategoryExpense(userId, month, year, category);
//    }
//    @GetMapping("/budget-vs-spent")
//    public List<BudgetComparisonDTO> budgetCompare(@RequestParam Long userId,
//                                                   @RequestParam int month,
//                                                   @RequestParam int year) {
//
//        return analyticsService.getBudgetVsSpent(userId, month, year);
//    }
//
//    @GetMapping("/savings-progress")
//    public ResponseEntity<?> getSavingsProgress(@RequestParam Long userId) {
//        // You'll need to implement this in your AnalyticsService
//        return ResponseEntity.ok(analyticsService.getSavingsProgress(userId));
//    }
//    @GetMapping("/overall-budget")
//    public ResponseEntity<OverallBudgetDTO> getOverallBudget(
//            @RequestParam Long userId,
//            @RequestParam int month,
//            @RequestParam int year
//    ) {
//        return ResponseEntity.ok(
//                analyticsService.getOverallBudget(userId, month, year)
//        );
//    }
//}



package com.example.BudgetTracker.analytics.src.main.java.org.example.controller;

import com.example.BudgetTracker.analytics.src.main.java.org.example.dto.*;
import com.example.BudgetTracker.analytics.src.main.java.org.example.service.AnalyticsService;
import com.example.BudgetTracker.analytics.src.main.java.org.example.service.SmartInsightsService;
import com.example.BudgetTracker.analytics.src.main.java.org.example.service.GeminiAIService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
@CrossOrigin
public class AnalyticsController {

    private final AnalyticsService analyticsService;
    private final SmartInsightsService smartInsightsService;
    private final GeminiAIService geminiAIService;

    @GetMapping("/income-expense")
    public IncomeExpenseDTO incomeExpense(@RequestParam Long userId,
                                          @RequestParam int month,
                                          @RequestParam int year) {

        return analyticsService.getIncomeExpense(userId, month, year);
    }


    @GetMapping("/category-expense")
    public List<CategoryExpenseDTO> categoryExpense(@RequestParam Long userId,
                                                    @RequestParam int month,
                                                    @RequestParam int year,
                                                    @RequestParam(defaultValue = "All") String category) {

        return analyticsService.getCategoryExpense(userId, month, year, category);
    }

    @GetMapping("/budget-vs-spent")
    public List<BudgetComparisonDTO> budgetCompare(@RequestParam Long userId,
                                                   @RequestParam int month,
                                                   @RequestParam int year) {

        return analyticsService.getBudgetVsSpent(userId, month, year);
    }

    @GetMapping("/savings-progress")
    public ResponseEntity<?> getSavingsProgress(@RequestParam Long userId) {
        // You'll need to implement this in your AnalyticsService
        return ResponseEntity.ok(analyticsService.getSavingsProgress(userId));
    }

    @GetMapping("/overall-budget")
    public ResponseEntity<OverallBudgetDTO> getOverallBudget(
            @RequestParam Long userId,
            @RequestParam int month,
            @RequestParam int year
    ) {
        return ResponseEntity.ok(
                analyticsService.getOverallBudget(userId, month, year)
        );
    }

    // ========== SMART INSIGHTS ENDPOINTS ==========

    @GetMapping("/smart-insights")
    public ResponseEntity<SmartInsightsDTO> getSmartInsights(
            @RequestParam Long userId,
            @RequestParam int month,
            @RequestParam int year
    ) {
        return ResponseEntity.ok(
                smartInsightsService.getSmartInsights(userId, month, year)
        );
    }

    @GetMapping("/smart-insights/spending-pattern")
    public ResponseEntity<?> getSpendingPattern(
            @RequestParam Long userId,
            @RequestParam int month,
            @RequestParam int year
    ) {
        SmartInsightsDTO insights = smartInsightsService.getSmartInsights(userId, month, year);
        return ResponseEntity.ok(insights.getSpendingPattern());
    }

    @GetMapping("/smart-insights/forecast")
    public ResponseEntity<?> getExpenseForecast(
            @RequestParam Long userId,
            @RequestParam int month,
            @RequestParam int year
    ) {
        SmartInsightsDTO insights = smartInsightsService.getSmartInsights(userId, month, year);
        return ResponseEntity.ok(insights.getExpenseForecast());
    }

    @GetMapping("/smart-insights/recommendations")
    public ResponseEntity<?> getSavingsRecommendations(
            @RequestParam Long userId,
            @RequestParam int month,
            @RequestParam int year
    ) {
        SmartInsightsDTO insights = smartInsightsService.getSmartInsights(userId, month, year);
        return ResponseEntity.ok(insights.getSavingsRecommendations());
    }

    @GetMapping("/smart-insights/anomalies")
    public ResponseEntity<?> getAnomalies(
            @RequestParam Long userId,
            @RequestParam int month,
            @RequestParam int year
    ) {
        SmartInsightsDTO insights = smartInsightsService.getSmartInsights(userId, month, year);
        return ResponseEntity.ok(insights.getAnomalies());
    }

    // ========== GEMINI AI INSIGHTS ENDPOINT ==========

    @GetMapping("/gemini-insights")
    public ResponseEntity<GeminiInsightsDTO> getGeminiInsights(
            @RequestParam Long userId,
            @RequestParam int month,
            @RequestParam int year
    ) {
        // Gather all financial data
        SmartInsightsDTO smartInsights = smartInsightsService.getSmartInsights(userId, month, year);
        IncomeExpenseDTO incomeExpense = analyticsService.getIncomeExpense(userId, month, year);
        List<CategoryExpenseDTO> categoryExpenses = analyticsService.getCategoryExpense(userId, month, year, "All");
        OverallBudgetDTO overallBudget = analyticsService.getOverallBudget(userId, month, year);

        // Generate Gemini AI insights
        GeminiInsightsDTO geminiInsights = geminiAIService.generatePersonalizedInsights(
                smartInsights, incomeExpense, categoryExpenses, overallBudget
        );

        return ResponseEntity.ok(geminiInsights);
    }
}