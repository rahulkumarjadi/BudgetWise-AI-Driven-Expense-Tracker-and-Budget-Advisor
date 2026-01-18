
import api from "./axiosClient";

// 1. Fixed URL: /budgets -> /budget (singular)
export const setBudget = (budgetData) => {
  return api.post("/budget", budgetData);
};

// 2. Fixed URL: /budgets/check -> /budget/analysis
// 3. Fixed Params: budgetMonth -> month, budgetYear -> year
export const checkBudget = ({
  userId,
  category,
  budgetMonth,
  budgetYear
}) => {
  return api.get("/budget/analysis", {
    params: {
      userId,
      category,
      month: budgetMonth, // Changed to match Java @RequestParam
      year: budgetYear    // Changed to match Java @RequestParam
    }
  });
};


