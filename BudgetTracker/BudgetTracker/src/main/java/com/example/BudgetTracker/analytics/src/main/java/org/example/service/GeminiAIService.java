package com.example.BudgetTracker.analytics.src.main.java.org.example.service;

//public class GeminiAIService {
//}


//package com.example.BudgetTracker.analytics.src.main.java.org.example.service;

import com.example.BudgetTracker.analytics.src.main.java.org.example.dto.*;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
@RequiredArgsConstructor
public class GeminiAIService {

    @Value("${gemini.api.key:your-api-key-here}")
    private String geminiApiKey;

    private final RestTemplate restTemplate = new RestTemplate();
    private static final String GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent";

    public GeminiInsightsDTO generatePersonalizedInsights(
            SmartInsightsDTO smartInsights,
            IncomeExpenseDTO incomeExpense,
            List<CategoryExpenseDTO> categoryExpenses,
            OverallBudgetDTO overallBudget
    ) {
        try {
            // Build context for Gemini
            String prompt = buildFinancialPrompt(smartInsights, incomeExpense, categoryExpenses, overallBudget);

            // Call Gemini API
            String geminiResponse = callGeminiAPI(prompt);

            // Parse and structure response
            return parseGeminiResponse(geminiResponse, smartInsights);

        } catch (Exception e) {
            // Fallback to rule-based insights if Gemini fails
            return generateFallbackInsights(smartInsights);
        }
    }

    private String buildFinancialPrompt(
            SmartInsightsDTO smartInsights,
            IncomeExpenseDTO incomeExpense,
            List<CategoryExpenseDTO> categoryExpenses,
            OverallBudgetDTO overallBudget
    ) {
        StringBuilder prompt = new StringBuilder();
        prompt.append("You are a professional financial advisor AI. Analyze this financial data and provide personalized insights:\n\n");

        // Income & Expense
        prompt.append("FINANCIAL SUMMARY:\n");
        prompt.append("- Monthly Income: ₹").append(incomeExpense.getIncome()).append("\n");
        prompt.append("- Monthly Expenses: ₹").append(incomeExpense.getExpense()).append("\n");
        prompt.append("- Savings Rate: ").append(calculateSavingsRate(incomeExpense)).append("%\n\n");

        // Spending Pattern
        if (smartInsights.getSpendingPattern() != null) {
            prompt.append("SPENDING TREND:\n");
            prompt.append("- Pattern: ").append(smartInsights.getSpendingPattern().getPattern()).append("\n");
            prompt.append("- Change: ").append(smartInsights.getSpendingPattern().getPercentageChange()).append("%\n");
            prompt.append("- Top Category: ").append(smartInsights.getSpendingPattern().getTopCategory())
                    .append(" (₹").append(smartInsights.getSpendingPattern().getTopCategoryAmount()).append(")\n\n");
        }

        // Category Breakdown
        prompt.append("CATEGORY EXPENSES:\n");
        categoryExpenses.forEach(cat ->
                prompt.append("- ").append(cat.getCategory()).append(": ₹").append(cat.getAmount()).append("\n")
        );
        prompt.append("\n");

        // Budget Status
        prompt.append("BUDGET STATUS:\n");
        prompt.append("- Total Budget: ₹").append(overallBudget.getTotalBudget()).append("\n");
        prompt.append("- Amount Spent: ₹").append(overallBudget.getTotalSpent()).append("\n");
        prompt.append("- Remaining: ₹").append(overallBudget.getTotalBudget() - overallBudget.getTotalSpent()).append("\n\n");

        // Forecast
        if (smartInsights.getExpenseForecast() != null) {
            prompt.append("FORECAST:\n");
            prompt.append("- Predicted Next Month: ₹").append(smartInsights.getExpenseForecast().getPredictedNextMonthExpense()).append("\n");
            prompt.append("- Trend: ").append(smartInsights.getExpenseForecast().getTrend()).append("\n\n");
        }

        prompt.append("Based on this data, provide:\n");
        prompt.append("1. A brief financial health assessment (2-3 sentences)\n");
        prompt.append("2. Top 3 actionable recommendations for improving financial health\n");
        prompt.append("3. Spending habits analysis (what's going well and what needs attention)\n");
        prompt.append("4. Long-term financial strategy advice\n\n");
        prompt.append("Format your response in a clear, structured way with sections.");

        return prompt.toString();
    }

    private String callGeminiAPI(String prompt) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            Map<String, Object> requestBody = new HashMap<>();
            Map<String, Object> content = new HashMap<>();
            Map<String, String> parts = new HashMap<>();
            parts.put("text", prompt);
            content.put("parts", Collections.singletonList(parts));
            requestBody.put("contents", Collections.singletonList(content));

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

            String url = GEMINI_API_URL + "?key=" + geminiApiKey;
            ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.POST, entity, Map.class);

            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                List<Map<String, Object>> candidates = (List<Map<String, Object>>) response.getBody().get("candidates");
                if (candidates != null && !candidates.isEmpty()) {
                    Map<String, Object> content2 = (Map<String, Object>) candidates.get(0).get("content");
                    List<Map<String, String>> parts2 = (List<Map<String, String>>) content2.get("parts");
                    if (parts2 != null && !parts2.isEmpty()) {
                        return parts2.get(0).get("text");
                    }
                }
            }

            return null;
        } catch (Exception e) {
            System.err.println("Gemini API Error: " + e.getMessage());
            return null;
        }
    }

    private GeminiInsightsDTO parseGeminiResponse(String response, SmartInsightsDTO smartInsights) {
        if (response == null || response.isEmpty()) {
            return generateFallbackInsights(smartInsights);
        }

        GeminiInsightsDTO insights = new GeminiInsightsDTO();

        // Extract sections from response
        String[] sections = response.split("\n\n");

        // Parse financial health assessment
        String healthAssessment = extractSection(response, "health", "assessment");
        insights.setFinancialHealthScore(calculateHealthScore(smartInsights));
        insights.setHealthAssessment(healthAssessment != null ? healthAssessment : "Your financial health is being analyzed...");

        // Parse recommendations
        List<String> recommendations = extractRecommendations(response);
        insights.setRecommendations(recommendations.isEmpty() ? getDefaultRecommendations() : recommendations);

        // Parse spending habits
        String spendingHabits = extractSection(response, "spending", "habits");
        insights.setSpendingHabitsAnalysis(spendingHabits != null ? spendingHabits : "Continue monitoring your spending patterns.");

        // Parse strategy
        String strategy = extractSection(response, "strategy", "long-term");
        insights.setLongTermStrategy(strategy != null ? strategy : "Focus on building emergency savings and reducing unnecessary expenses.");

        // Add personalized tips
        insights.setPersonalizedTips(generatePersonalizedTips(smartInsights));

        return insights;
    }

    private String extractSection(String response, String... keywords) {
        String[] lines = response.split("\n");
        StringBuilder section = new StringBuilder();
        boolean capturing = false;

        for (String line : lines) {
            String lowerLine = line.toLowerCase();

            // Check if line contains any keyword
            boolean hasKeyword = false;
            for (String keyword : keywords) {
                if (lowerLine.contains(keyword.toLowerCase())) {
                    hasKeyword = true;
                    break;
                }
            }

            if (hasKeyword && (lowerLine.contains(":") || lowerLine.contains("*"))) {
                capturing = true;
                continue;
            }

            if (capturing) {
                if (line.trim().isEmpty() || line.matches("^\\d+\\..*") || line.startsWith("**")) {
                    if (section.length() > 0) break;
                } else {
                    section.append(line.trim()).append(" ");
                }
            }
        }

        return section.length() > 0 ? section.toString().trim() : null;
    }

    private List<String> extractRecommendations(String response) {
        List<String> recommendations = new ArrayList<>();
        String[] lines = response.split("\n");

        for (String line : lines) {
            line = line.trim();
            if (line.matches("^\\d+\\..*") || line.startsWith("*") || line.startsWith("-")) {
                String rec = line.replaceFirst("^[\\d+\\.\\*\\-]\\s*", "").trim();
                if (rec.length() > 20) { // Filter out short/invalid lines
                    recommendations.add(rec);
                    if (recommendations.size() >= 5) break;
                }
            }
        }

        return recommendations;
    }

    private int calculateHealthScore(SmartInsightsDTO insights) {
        int score = 50; // Base score

        if (insights.getSpendingPattern() != null) {
            String pattern = insights.getSpendingPattern().getPattern();
            if ("Decreasing".equals(pattern)) score += 20;
            else if ("Stable".equals(pattern)) score += 10;
            else score -= 10;
        }

        if (insights.getSavingsRecommendations() != null) {
            int highPriority = (int) insights.getSavingsRecommendations().stream()
                    .filter(r -> "High".equals(r.getPriority())).count();
            score -= (highPriority * 5);
        }

        if (insights.getAnomalies() != null) {
            score -= (insights.getAnomalies().size() * 3);
        }

        return Math.max(0, Math.min(100, score));
    }

    private double calculateSavingsRate(IncomeExpenseDTO incomeExpense) {
        double income = incomeExpense.getIncome();
        double expense = incomeExpense.getExpense();
        if (income == 0) return 0;
        return ((income - expense) / income) * 100;
    }

    private List<String> getDefaultRecommendations() {
        return Arrays.asList(
                "Track your daily expenses to identify unnecessary spending",
                "Set up automatic savings transfers at the beginning of each month",
                "Review and cancel unused subscriptions",
                "Create an emergency fund covering 3-6 months of expenses",
                "Consider investing surplus income for long-term wealth building"
        );
    }

    private List<String> generatePersonalizedTips(SmartInsightsDTO insights) {
        List<String> tips = new ArrayList<>();

        if (insights.getSpendingPattern() != null) {
            if ("Increasing".equals(insights.getSpendingPattern().getPattern())) {
                tips.add("💡 Your spending is trending upward. Review your recent purchases and identify areas to cut back.");
            }
        }

        if (insights.getExpenseForecast() != null) {
            if ("Upward".equals(insights.getExpenseForecast().getTrend())) {
                tips.add("📈 Your expenses are forecasted to increase. Plan ahead and adjust your budget accordingly.");
            }
        }

        if (insights.getSavingsRecommendations() != null && !insights.getSavingsRecommendations().isEmpty()) {
            SavingsRecommendationDTO topRec = insights.getSavingsRecommendations().get(0);
            tips.add("💰 Focus on reducing " + topRec.getCategory() + " expenses to save up to ₹" +
                    String.format("%.0f", topRec.getPotentialSavings()) + " this month.");
        }

        tips.add("🎯 Set specific financial goals and track your progress weekly.");
        tips.add("📊 Use the 50/30/20 rule: 50% needs, 30% wants, 20% savings.");

        return tips;
    }

    private GeminiInsightsDTO generateFallbackInsights(SmartInsightsDTO smartInsights) {
        GeminiInsightsDTO insights = new GeminiInsightsDTO();
        insights.setFinancialHealthScore(calculateHealthScore(smartInsights));
        insights.setHealthAssessment("Your financial data has been analyzed. Continue monitoring your spending patterns.");
        insights.setRecommendations(getDefaultRecommendations());
        insights.setSpendingHabitsAnalysis("Regular tracking of expenses helps maintain financial discipline.");
        insights.setLongTermStrategy("Build an emergency fund and invest in diversified assets for long-term wealth creation.");
        insights.setPersonalizedTips(generatePersonalizedTips(smartInsights));
        return insights;
    }
}