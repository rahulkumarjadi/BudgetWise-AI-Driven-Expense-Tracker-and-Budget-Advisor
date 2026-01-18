package com.example.BudgetTracker.Budget.src.main.java.org.example.controller;

import com.example.BudgetTracker.Budget.src.main.java.org.example.dto.BudgetRequest;
import com.example.BudgetTracker.Budget.src.main.java.org.example.dto.BudgetResponse;
import com.example.BudgetTracker.Budget.src.main.java.org.example.entity.Alert;
import com.example.BudgetTracker.Budget.src.main.java.org.example.repository.AlertRepository;
import com.example.BudgetTracker.Budget.src.main.java.org.example.service.BudgetService;
import com.example.BudgetTracker.Client.src.main.java.org.example.security.JwtUtils; // ✅ Import JwtUtils
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/budget")
@CrossOrigin(origins = "http://localhost:3000")
public class BudgetController {

    private final BudgetService budgetService;
    private final AlertRepository alertRepository;
    private final JwtUtils jwtUtils; // ✅ Add JwtUtils

    public BudgetController(BudgetService budgetService,
                            AlertRepository alertRepository,
                            JwtUtils jwtUtils) {
        this.budgetService = budgetService;
        this.alertRepository = alertRepository;
        this.jwtUtils = jwtUtils;
    }

    // Helper to get UserId from Token
    private Long getUserId(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new RuntimeException("Unauthorized");
        }
        String token = authHeader.substring(7);
        return Long.parseLong(jwtUtils.getSubject(token));
    }

    /* ---------------- BUDGET ---------------- */

    @PostMapping
    public void saveBudget(@RequestHeader("Authorization") String auth, @RequestBody BudgetRequest request) {
        request.setUserId(getUserId(auth)); // ✅ Inject ID from token
        budgetService.saveBudget(request);
    }

    @GetMapping("/analysis")
    public BudgetResponse analyze(
            @RequestHeader("Authorization") String auth,
            @RequestParam String category,
            @RequestParam int month,
            @RequestParam int year
    ) {
        Long userId = getUserId(auth); // ✅ Get ID from token
        return budgetService.analyzeBudget(userId, category, month, year);
    }

    /* ---------------- ALERTS ---------------- */

    @GetMapping("/alerts")
    public List<Alert> getAlerts(@RequestHeader("Authorization") String auth) {
        Long userId = getUserId(auth);
        return alertRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    @GetMapping("/alerts/count")
    public long getAlertCount(@RequestHeader("Authorization") String auth) {
        Long userId = getUserId(auth);
        return alertRepository.countByUserIdAndIsReadFalse(userId);
    }

    @PutMapping("/alerts/read")
    public void markAlertsRead(@RequestHeader("Authorization") String auth) {
        Long userId = getUserId(auth);
        List<Alert> alerts = alertRepository.findByUserIdOrderByCreatedAtDesc(userId);
        alerts.forEach(alert -> alert.setRead(true));
        alertRepository.saveAll(alerts);
    }

    @DeleteMapping("/alerts/delete/all")
    public void deleteAllAlerts(@RequestHeader("Authorization") String auth) {
        Long userId = getUserId(auth);
        alertRepository.deleteAllAlerts(userId);
    }

    // Existing PathVariable methods remain largely the same, but you could
    // verify userId here too for extra security if desired.
    @PutMapping("/{budgetId}")
    public void updateBudget(
            @PathVariable Long budgetId,
            @RequestParam double limitAmount
    ) {
        budgetService.updateBudget(budgetId, limitAmount);
    }
}