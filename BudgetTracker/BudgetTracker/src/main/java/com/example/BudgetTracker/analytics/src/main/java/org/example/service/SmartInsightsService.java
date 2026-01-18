package com.example.BudgetTracker.analytics.src.main.java.org.example.service;

//public class SmartInsightsService {
//}
//package com.example.BudgetTracker.analytics.src.main.java.org.example.service;

import com.example.BudgetTracker.Transaction.src.main.java.org.example.entity.TransactionType;
import com.example.BudgetTracker.analytics.src.main.java.org.example.dto.*;
import com.example.BudgetTracker.Transaction.src.main.java.org.example.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.YearMonth;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SmartInsightsService {

    private final TransactionRepository transactionRepository;

    public SmartInsightsDTO getSmartInsights(Long userId, int month, int year) {
        SmartInsightsDTO insights = new SmartInsightsDTO();
        insights.setSpendingPattern(analyzeSpendingPattern(userId, month, year));
        insights.setExpenseForecast(forecastExpenses(userId, month, year));
        insights.setSavingsRecommendations(generateSavingsRecommendations(userId, month, year));
        insights.setAnomalies(detectAnomalies(userId, month, year));
        return insights;
    }

    private SpendingPatternDTO analyzeSpendingPattern(Long userId, int month, int year) {
        // Get current month and previous month expenses
        Double currentExpense = transactionRepository.sumByTypeAndMonth(
                userId, TransactionType.EXPENSE, month, year);

        int prevMonth = month == 1 ? 12 : month - 1;
        int prevYear = month == 1 ? year - 1 : year;
        Double previousExpense = transactionRepository.sumByTypeAndMonth(
                userId, TransactionType.EXPENSE, prevMonth, prevYear);

        currentExpense = currentExpense == null ? 0.0 : currentExpense;
        previousExpense = previousExpense == null ? 0.0 : previousExpense;

        // Calculate pattern
        double percentageChange = previousExpense > 0
                ? ((currentExpense - previousExpense) / previousExpense) * 100
                : 0.0;

        String pattern;
        String insight;
        if (Math.abs(percentageChange) < 5) {
            pattern = "Stable";
            insight = "Your spending is consistent with last month.";
        } else if (percentageChange > 0) {
            pattern = "Increasing";
            insight = String.format("Your spending increased by %.1f%% compared to last month. Consider reviewing your expenses.",
                    Math.abs(percentageChange));
        } else {
            pattern = "Decreasing";
            insight = String.format("Great job! Your spending decreased by %.1f%% compared to last month.",
                    Math.abs(percentageChange));
        }

        // Get top spending category
        List<CategoryExpenseDTO> categories = transactionRepository.categoryWiseExpenseByMonth(userId, month, year);
        CategoryExpenseDTO topCategory = categories.isEmpty() ? null : categories.get(0);

        SpendingPatternDTO spendingPattern = new SpendingPatternDTO();
        spendingPattern.setPattern(pattern);
        spendingPattern.setPercentageChange(percentageChange);
        spendingPattern.setTopCategory(topCategory != null ? topCategory.getCategory() : "N/A");
        spendingPattern.setTopCategoryAmount(topCategory != null ? topCategory.getAmount() : 0.0);
        spendingPattern.setInsight(insight);

        return spendingPattern;
    }

    private ExpenseForecastDTO forecastExpenses(Long userId, int month, int year) {
        // Get last 3 months of expenses for trend analysis
        List<Double> last3MonthsExpenses = new ArrayList<>();

        for (int i = 0; i < 3; i++) {
            int targetMonth = month - i;
            int targetYear = year;

            if (targetMonth <= 0) {
                targetMonth += 12;
                targetYear--;
            }

            Double expense = transactionRepository.sumByTypeAndMonth(
                    userId, TransactionType.EXPENSE, targetMonth, targetYear);
            last3MonthsExpenses.add(expense == null ? 0.0 : expense);
        }

        // Simple moving average for prediction
        double avgExpense = last3MonthsExpenses.stream()
                .mapToDouble(Double::doubleValue)
                .average()
                .orElse(0.0);

        // Calculate trend
        double firstMonth = last3MonthsExpenses.get(2);
        double lastMonth = last3MonthsExpenses.get(0);
        double trendSlope = lastMonth - firstMonth;

        double predictedExpense = avgExpense + (trendSlope / 3);

        String trend;
        if (Math.abs(trendSlope) < avgExpense * 0.1) {
            trend = "Stable";
        } else if (trendSlope > 0) {
            trend = "Upward";
        } else {
            trend = "Downward";
        }

        // Confidence based on variance
        double variance = calculateVariance(last3MonthsExpenses, avgExpense);
        double confidenceLevel = Math.max(50, Math.min(95, 100 - (variance / avgExpense * 100)));

        // Category-wise forecasts
        List<CategoryForecastDTO> categoryForecasts = generateCategoryForecasts(userId, month, year);

        ExpenseForecastDTO forecast = new ExpenseForecastDTO();
        forecast.setPredictedNextMonthExpense(Math.round(predictedExpense * 100.0) / 100.0);
        forecast.setConfidenceLevel(Math.round(confidenceLevel * 100.0) / 100.0);
        forecast.setCategoryForecasts(categoryForecasts);
        forecast.setTrend(trend);

        return forecast;
    }

    private List<CategoryForecastDTO> generateCategoryForecasts(Long userId, int month, int year) {
        List<CategoryExpenseDTO> currentCategories = transactionRepository.categoryWiseExpenseByMonth(userId, month, year);

        return currentCategories.stream()
                .map(cat -> {
                    // Get 3-month average for this category
                    double avg = getCategory3MonthAverage(userId, cat.getCategory(), month, year);
                    CategoryForecastDTO forecast = new CategoryForecastDTO();
                    forecast.setCategory(cat.getCategory());
                    forecast.setPredictedAmount(Math.round(avg * 100.0) / 100.0);
                    forecast.setHistoricalAverage(Math.round(avg * 100.0) / 100.0);
                    return forecast;
                })
                .collect(Collectors.toList());
    }

    private double getCategory3MonthAverage(Long userId, String category, int month, int year) {
        List<Double> amounts = new ArrayList<>();

        for (int i = 0; i < 3; i++) {
            int targetMonth = month - i;
            int targetYear = year;

            if (targetMonth <= 0) {
                targetMonth += 12;
                targetYear--;
            }

            List<CategoryExpenseDTO> cats = transactionRepository.categoryWiseExpenseByMonthAndCategory(
                    userId, category, targetMonth, targetYear);

            double total = cats.stream().mapToDouble(CategoryExpenseDTO::getAmount).sum();
            amounts.add(total);
        }

        return amounts.stream().mapToDouble(Double::doubleValue).average().orElse(0.0);
    }

    private List<SavingsRecommendationDTO> generateSavingsRecommendations(Long userId, int month, int year) {
        List<SavingsRecommendationDTO> recommendations = new ArrayList<>();
        List<CategoryExpenseDTO> categories = transactionRepository.categoryWiseExpenseByMonth(userId, month, year);

        for (CategoryExpenseDTO category : categories) {
            // Get historical average for this category
            double historicalAvg = getCategory3MonthAverage(userId, category.getCategory(), month, year);
            double currentAmount = category.getAmount();

            // If current spending is significantly above average, recommend reduction
            if (currentAmount > historicalAvg * 1.2) {
                double potentialSavings = currentAmount - historicalAvg;
                String priority = potentialSavings > 500 ? "High" : potentialSavings > 200 ? "Medium" : "Low";

                SavingsRecommendationDTO recommendation = new SavingsRecommendationDTO();
                recommendation.setCategory(category.getCategory());
                recommendation.setPotentialSavings(Math.round(potentialSavings * 100.0) / 100.0);
                recommendation.setRecommendation(String.format(
                        "Your %s spending is %.0f%% above average. Consider reducing by $%.2f",
                        category.getCategory(),
                        ((currentAmount - historicalAvg) / historicalAvg) * 100,
                        potentialSavings
                ));
                recommendation.setPriority(priority);
                recommendations.add(recommendation);
            }
        }

        // Sort by potential savings (highest first)
        recommendations.sort((a, b) -> Double.compare(b.getPotentialSavings(), a.getPotentialSavings()));

        return recommendations.stream().limit(5).collect(Collectors.toList());
    }

    private List<AnomalyDTO> detectAnomalies(Long userId, int month, int year) {
        List<AnomalyDTO> anomalies = new ArrayList<>();

        // Get category-wise statistics
        List<CategoryExpenseDTO> categories = transactionRepository.categoryWiseExpenseByMonth(userId, month, year);

        for (CategoryExpenseDTO category : categories) {
            double historicalAvg = getCategory3MonthAverage(userId, category.getCategory(), month, year);
            double currentAmount = category.getAmount();

            YearMonth yearMonth = YearMonth.of(year, month);

            // Check for unusual spikes (>50% above average)
            if (currentAmount > historicalAvg * 1.5 && historicalAvg > 0) {
                double deviation = ((currentAmount - historicalAvg) / historicalAvg) * 100;

                AnomalyDTO anomaly = new AnomalyDTO();
                anomaly.setCategory(category.getCategory());
                anomaly.setAmount(currentAmount);
                anomaly.setDate(yearMonth.toString());
                anomaly.setType("Unusual Spike");
                anomaly.setDeviationPercentage(Math.round(deviation * 100.0) / 100.0);
                anomaly.setDescription(String.format(
                        "Spending in %s is %.0f%% higher than your 3-month average of $%.2f",
                        category.getCategory(),
                        deviation,
                        historicalAvg
                ));
                anomalies.add(anomaly);
            }

            // Check for unusual drops (>50% below average)
            if (currentAmount < historicalAvg * 0.5 && historicalAvg > 100) {
                double deviation = ((historicalAvg - currentAmount) / historicalAvg) * 100;

                AnomalyDTO anomaly = new AnomalyDTO();
                anomaly.setCategory(category.getCategory());
                anomaly.setAmount(currentAmount);
                anomaly.setDate(yearMonth.toString());
                anomaly.setType("Unusual Drop");
                anomaly.setDeviationPercentage(Math.round(deviation * 100.0) / 100.0);
                anomaly.setDescription(String.format(
                        "Spending in %s is %.0f%% lower than usual. Great savings!",
                        category.getCategory(),
                        deviation
                ));
                anomalies.add(anomaly);
            }
        }

        return anomalies;
    }

    private double calculateVariance(List<Double> values, double mean) {
        if (values.isEmpty()) return 0.0;

        double sumSquaredDiff = values.stream()
                .mapToDouble(val -> Math.pow(val - mean, 2))
                .sum();

        return Math.sqrt(sumSquaredDiff / values.size());
    }
}