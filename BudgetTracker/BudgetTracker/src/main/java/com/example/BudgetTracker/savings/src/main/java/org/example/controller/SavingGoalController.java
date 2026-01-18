package com.example.BudgetTracker.savings.src.main.java.org.example.controller;

import com.example.BudgetTracker.Client.src.main.java.org.example.security.JwtUtils; // Import your JWT tool
import com.example.BudgetTracker.savings.src.main.java.org.example.dto.SavingGoalRequest;
import com.example.BudgetTracker.savings.src.main.java.org.example.dto.SavingGoalResponse;
import com.example.BudgetTracker.savings.src.main.java.org.example.service.SavingGoalService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/savings")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class SavingGoalController {

    private final SavingGoalService service;
    private final JwtUtils jwtUtils; // Add this to handle the token

    // Helper method to get UserID from the Bearer Token
    private Long getUserId(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new RuntimeException("Unauthorized: No token provided");
        }
        String token = authHeader.substring(7);
        return Long.parseLong(jwtUtils.getSubject(token));
    }

    @PostMapping
    public void createGoal(
            @RequestHeader("Authorization") String auth,
            @RequestBody SavingGoalRequest request) {

        Long userId = getUserId(auth);
        request.setUserId(userId); // Inject the correct ID into the request
        service.createGoal(request);
    }

    @GetMapping
    public List<SavingGoalResponse> getGoals(@RequestHeader("Authorization") String auth) {
        Long userId = getUserId(auth);
        return service.getGoals(userId);
    }

    @PutMapping("/{goalId}/add")
    public void addSavings(
            @PathVariable Long goalId,
            @RequestParam double amount) {
        service.addSavings(goalId, amount);
    }

    @PutMapping("/{goalId}")
    public void updateGoal(
            @PathVariable Long goalId,
            @RequestBody SavingGoalRequest request) {
        service.updateGoal(goalId, request);
    }

    @DeleteMapping("/{goalId}")
    public void deleteGoal(@PathVariable Long goalId) {
        service.deleteGoal(goalId);
    }
}