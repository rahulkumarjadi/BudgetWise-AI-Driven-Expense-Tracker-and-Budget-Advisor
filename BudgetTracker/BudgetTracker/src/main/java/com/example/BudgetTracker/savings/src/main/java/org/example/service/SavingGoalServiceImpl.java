
package com.example.BudgetTracker.savings.src.main.java.org.example.service;

import lombok.RequiredArgsConstructor;

import com.example.BudgetTracker.savings.src.main.java.org.example.dto.SavingGoalRequest;
import com.example.BudgetTracker.savings.src.main.java.org.example.dto.SavingGoalResponse;
import com.example.BudgetTracker.savings.src.main.java.org.example.entity.SavingGoal;
import com.example.BudgetTracker.savings.src.main.java.org.example.repository.SavingGoalRepository;

import com.example.BudgetTracker.Transaction.src.main.java.org.example.entity.Transaction;
import com.example.BudgetTracker.Transaction.src.main.java.org.example.entity.TransactionType;
import com.example.BudgetTracker.Transaction.src.main.java.org.example.repository.TransactionRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SavingGoalServiceImpl implements SavingGoalService {

    private final SavingGoalRepository repository;
    private final TransactionRepository transactionRepository;

    /* ---------------- CREATE GOAL ---------------- */

    @Override
    public void createGoal(SavingGoalRequest request) {

        if (request.getUserId() == null) {
            throw new RuntimeException("UserId is required");
        }

        SavingGoal goal = SavingGoal.builder()
                .userId(request.getUserId())
                .name(request.getName())
                .targetAmount(request.getTargetAmount())
                .savedAmount(0.0)
                .completed(false)
                .build();

        repository.save(goal);
    }

    /* ---------------- ADD SAVINGS ---------------- */

    @Override
    @Transactional
    public void addSavings(Long goalId, double amount) {

        if (amount <= 0) {
            throw new RuntimeException("Amount must be greater than zero");
        }

        SavingGoal goal = repository.findById(goalId)
                .orElseThrow(() -> new RuntimeException("Saving goal not found"));

        Long userId = goal.getUserId();

        Double incomeObj = transactionRepository.totalIncome(userId);
        Double expenseObj = transactionRepository.totalExpense(userId);
        Double savingsObj = transactionRepository.totalSavings(userId);

        double income = incomeObj != null ? incomeObj : 0.0;
        double expense = expenseObj != null ? expenseObj : 0.0;
        double savings = savingsObj != null ? savingsObj : 0.0;

        double availableBalance = income - (expense + savings);

        if (amount > availableBalance) {
            throw new RuntimeException("Insufficient balance to save");
        }

        Transaction transaction = new Transaction();
        transaction.setUserId(userId);
        transaction.setAmount(amount);
        transaction.setType(TransactionType.SAVINGS);
        transaction.setCategory("Savings");
        transaction.setDescription("Saved for " + goal.getName());
        transaction.setTransactionDate(LocalDate.now());

        transactionRepository.save(transaction);

        double savedSoFar = goal.getSavedAmount();
        double newAmount = savedSoFar + amount;

        goal.setSavedAmount(newAmount);

        if (newAmount >= goal.getTargetAmount()) {
            goal.setCompleted(true);
        }

        repository.save(goal);
    }

    /* ---------------- GET GOALS ---------------- */

    @Override
    public List<SavingGoalResponse> getGoals(Long userId) {

        if (userId == null) {
            throw new RuntimeException("UserId is required");
        }

        return repository.findByUserId(userId)
                .stream()
                .map(goal -> {

                    double saved = goal.getSavedAmount();
                    double target = goal.getTargetAmount();
                    double remaining = Math.max(target - saved, 0);
                    double percent = (saved / target) * 100;

                    return SavingGoalResponse.builder()
                            .goalId(goal.getGoalId())
                            .name(goal.getName())
                            .targetAmount(target)
                            .savedAmount(saved)
                            .remainingAmount(remaining)
                            .progressPercentage(Math.min(percent, 100))
                            .completed(goal.getCompleted())
                            .build();
                })
                .toList();
    }

    /* ---------------- UPDATE GOAL ---------------- */

    @Override
    public void updateGoal(Long goalId, SavingGoalRequest request) {

        SavingGoal goal = repository.findById(goalId)
                .orElseThrow(() -> new RuntimeException("Goal not found"));

        goal.setName(request.getName());
        goal.setTargetAmount(request.getTargetAmount());

        repository.save(goal);
    }

    /* ---------------- DELETE GOAL ---------------- */

    @Override
    @Transactional
    public void deleteGoal(Long goalId) {

        SavingGoal goal = repository.findById(goalId)
                .orElseThrow(() -> new RuntimeException("Saving goal not found"));

        double saved = goal.getSavedAmount();

        if (saved > 0) {
            Transaction refund = new Transaction();
            refund.setUserId(goal.getUserId());
            refund.setAmount(saved);
            refund.setType(TransactionType.INCOME);
            refund.setCategory("Savings Refund");
            refund.setDescription("Refund from deleted goal: " + goal.getName());
            refund.setTransactionDate(LocalDate.now());

            transactionRepository.save(refund);
        }

        repository.delete(goal);
    }
}

