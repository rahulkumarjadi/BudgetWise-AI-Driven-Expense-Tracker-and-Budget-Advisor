package com.example.BudgetTracker.Budget.src.main.java.org.example.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * Custom exception thrown when a user's transaction
 * exceeds their defined budget limit.
 */
@ResponseStatus(HttpStatus.BAD_REQUEST)
public class BudgetExceededException extends RuntimeException {

    private static final long serialVersionUID = 1L;

    public BudgetExceededException(String message) {
        super(message);
    }
}