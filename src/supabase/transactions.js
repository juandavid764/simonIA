import { supabase } from "./client.js";

// Create a new transaction
export async function createTransaction(transaction) {
  const { data, error } = await supabase
    .from("transactions")
    .insert([transaction])
    .select()
    .single();
  if (error) throw error;
  return data;
}

// Get all transactions (optionally by user_id)
export async function getTransactions(user_id = null) {
  let query = supabase
    .from("transactions")
    .select("*")
    .order("fecha", { ascending: false });
  if (user_id) {
    query = query.eq("user_id", user_id);
  }
  const { data, error } = await query;
  if (error) throw error;
  return data;
}

// Get a single transaction by id
export async function getTransactionById(id) {
  const { data, error } = await supabase
    .from("transactions")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw error;
  return data;
}

// Update a transaction by id
export async function updateTransaction(id, updates) {
  const { data, error } = await supabase
    .from("transactions")
    .update(updates)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

// Delete a transaction by id
export async function deleteTransaction(id) {
  const { error } = await supabase.from("transactions").delete().eq("id", id);
  if (error) throw error;
  return true;
}

// Get monthly statistics from the monthly_reports view
export async function getMonthlyReports(user_id, year = null) {
  let query = supabase
    .from("monthly_reports")
    .select("*")
    .eq("user_id", user_id)
    .order("año", { ascending: false })
    .order("mes", { ascending: false });

  if (year) {
    query = query.eq("año", year);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

// Get current month statistics
export async function getCurrentMonthStats(user_id) {
  const now = new Date();
  const currentYear = now.getFullYear(); // Usar tiempo local en lugar de UTC
  const currentMonth = now.getMonth() + 1; // Usar tiempo local en lugar de UTC

  const { data, error } = await supabase
    .from("monthly_reports")
    .select("*")
    .eq("user_id", user_id)
    .eq("año", currentYear)
    .eq("mes", currentMonth)
    .single();

  if (error && error.code !== "PGRST116") throw error; // PGRST116 = no rows returned
  return data;
}

// Get statistics for a specific month and year
export async function getSpecificMonthStats(user_id, year, month) {
  const { data, error } = await supabase
    .from("monthly_reports")
    .select("*")
    .eq("user_id", user_id)
    .eq("año", year)
    .eq("mes", month)
    .single();

  if (error && error.code !== "PGRST116") throw error; // PGRST116 = no rows returned
  return data;
}

// Get category statistics for a specific period
export async function getCategoryStats(user_id, startDate, endDate) {
  const { data, error } = await supabase
    .from("transactions")
    .select("category, tipo, monto")
    .eq("user_id", user_id)
    .eq("tipo", "gasto")
    .gte("fecha", startDate)
    .lte("fecha", endDate)
    .not("category", "is", null);

  if (error) throw error;

  // Group by category and sum amounts
  const categoryTotals = data.reduce((acc, transaction) => {
    const category = transaction.category;
    acc[category] = (acc[category] || 0) + parseFloat(transaction.monto);
    return acc;
  }, {});

  return Object.entries(categoryTotals).map(([category, total]) => ({
    category,
    total: parseFloat(total.toFixed(2)),
  }));
}

// Get category statistics for a specific month and year
export async function getCategoryStatsForMonth(user_id, year, month) {
  // Calculate start and end dates for the specified month
  const startOfMonth = new Date(year, month - 1, 1);
  const endOfMonth = new Date(year, month, 0);

  // Formatear fechas como YYYY-MM-DD en tiempo local
  const formatLocalDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  return await getCategoryStats(
    user_id,
    formatLocalDate(startOfMonth),
    formatLocalDate(endOfMonth)
  );
}

// Get recent transactions comparison
export async function getTransactionsComparison(user_id, days = 30) {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const prevStartDate = new Date(startDate);
  prevStartDate.setDate(prevStartDate.getDate() - days);
  const prevEndDate = new Date(startDate);

  // Current period
  const { data: currentData, error: currentError } = await supabase
    .from("transactions")
    .select("tipo, monto")
    .eq("user_id", user_id)
    .gte("fecha", startDate.toISOString().split("T")[0])
    .lte("fecha", endDate.toISOString().split("T")[0]);

  if (currentError) throw currentError;

  // Previous period
  const { data: prevData, error: prevError } = await supabase
    .from("transactions")
    .select("tipo, monto")
    .eq("user_id", user_id)
    .gte("fecha", prevStartDate.toISOString().split("T")[0])
    .lt("fecha", startDate.toISOString().split("T")[0]);

  if (prevError) throw prevError;

  const calculateTotals = (data) => {
    return data.reduce(
      (acc, transaction) => {
        if (transaction.tipo === "ingreso") {
          acc.ingresos += parseFloat(transaction.monto);
        } else {
          acc.gastos += parseFloat(transaction.monto);
        }
        return acc;
      },
      { ingresos: 0, gastos: 0 }
    );
  };

  const current = calculateTotals(currentData);
  const previous = calculateTotals(prevData);

  return {
    current: {
      ingresos: parseFloat(current.ingresos.toFixed(2)),
      gastos: parseFloat(current.gastos.toFixed(2)),
      balance: parseFloat((current.ingresos - current.gastos).toFixed(2)),
    },
    previous: {
      ingresos: parseFloat(previous.ingresos.toFixed(2)),
      gastos: parseFloat(previous.gastos.toFixed(2)),
      balance: parseFloat((previous.ingresos - previous.gastos).toFixed(2)),
    },
  };
}

// Get year overview
export async function getYearOverview(user_id, year = null) {
  const targetYear = year || new Date().getFullYear(); // Usar tiempo local en lugar de UTC

  const { data, error } = await supabase
    .from("monthly_reports")
    .select("*")
    .eq("user_id", user_id)
    .eq("año", targetYear)
    .order("mes", { ascending: true });

  if (error) throw error;
  return data;
}

// Get weekly analysis for current month
export async function getWeeklyAnalysis(user_id) {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1); // Usar tiempo local
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0); // Usar tiempo local

  // Formatear fechas como YYYY-MM-DD en tiempo local
  const formatLocalDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const { data, error } = await supabase
    .from("transactions")
    .select("fecha, tipo, monto")
    .eq("user_id", user_id)
    .gte("fecha", formatLocalDate(startOfMonth))
    .lte("fecha", formatLocalDate(endOfMonth))
    .order("fecha", { ascending: true });

  if (error) throw error;

  // Group by weeks
  const weeks = {};
  data.forEach((transaction) => {
    const date = new Date(transaction.fecha + 'T00:00:00'); // Forzar interpretación local
    const weekNumber = Math.ceil(date.getDate() / 7); // Usar getDate() en lugar de getUTCDate()
    const weekKey = `Semana ${weekNumber}`;

    if (!weeks[weekKey]) {
      weeks[weekKey] = { ingresos: 0, gastos: 0, transacciones: 0 };
    }

    weeks[weekKey].transacciones++;
    if (transaction.tipo === "ingreso") {
      weeks[weekKey].ingresos += parseFloat(transaction.monto);
    } else {
      weeks[weekKey].gastos += parseFloat(transaction.monto);
    }
  });

  return Object.entries(weeks).map(([week, data]) => ({
    week,
    ...data,
    balance: parseFloat((data.ingresos - data.gastos).toFixed(2)),
  }));
}

// Get weekly analysis for a specific month and year
export async function getWeeklyAnalysisForMonth(user_id, year, month) {
  const startOfMonth = new Date(year, month - 1, 1);
  const endOfMonth = new Date(year, month, 0);

  // Formatear fechas como YYYY-MM-DD en tiempo local
  const formatLocalDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const { data, error } = await supabase
    .from("transactions")
    .select("fecha, tipo, monto")
    .eq("user_id", user_id)
    .gte("fecha", formatLocalDate(startOfMonth))
    .lte("fecha", formatLocalDate(endOfMonth))
    .order("fecha", { ascending: true });

  if (error) throw error;

  // Group by weeks
  const weeks = {};
  data.forEach((transaction) => {
    const date = new Date(transaction.fecha + 'T00:00:00'); // Forzar interpretación local
    const weekNumber = Math.ceil(date.getDate() / 7); // Usar getDate() en lugar de getUTCDate()
    const weekKey = `Semana ${weekNumber}`;

    if (!weeks[weekKey]) {
      weeks[weekKey] = { ingresos: 0, gastos: 0, transacciones: 0 };
    }

    weeks[weekKey].transacciones++;
    if (transaction.tipo === "ingreso") {
      weeks[weekKey].ingresos += parseFloat(transaction.monto);
    } else {
      weeks[weekKey].gastos += parseFloat(transaction.monto);
    }
  });

  return Object.entries(weeks).map(([week, data]) => ({
    week,
    ...data,
    balance: parseFloat((data.ingresos - data.gastos).toFixed(2)),
  }));
}

// Get average monthly spending by category
export async function getAverageSpendingByCategory(user_id, months = 6) {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setUTCMonth(startDate.getUTCMonth() - months);

  const { data, error } = await supabase
    .from("transactions")
    .select("fecha, category, monto")
    .eq("user_id", user_id)
    .eq("tipo", "gasto")
    .gte("fecha", startDate.toISOString().split("T")[0])
    .lte("fecha", endDate.toISOString().split("T")[0])
    .not("category", "is", null);

  if (error) throw error;
  // Group by category and month
  const categoryMonths = {};
  data.forEach((transaction) => {
    const date = new Date(transaction.fecha);
    const monthKey = `${date.getUTCFullYear()}-${date.getUTCMonth() + 1}`;
    const category = transaction.category;

    if (!categoryMonths[category]) {
      categoryMonths[category] = {};
    }

    if (!categoryMonths[category][monthKey]) {
      categoryMonths[category][monthKey] = 0;
    }

    categoryMonths[category][monthKey] += parseFloat(transaction.monto);
  });

  // Calculate averages
  return Object.entries(categoryMonths).map(([category, monthData]) => {
    const monthValues = Object.values(monthData);
    const average =
      monthValues.reduce((sum, val) => sum + val, 0) /
      Math.max(monthValues.length, 1);

    return {
      category,
      average: parseFloat(average.toFixed(2)),
      months: monthValues.length,
      total: parseFloat(
        monthValues.reduce((sum, val) => sum + val, 0).toFixed(2)
      ),
    };
  });
}

// Get financial health score
export async function getFinancialHealthScore(user_id) {
  const currentMonth = await getCurrentMonthStats(user_id);
  const comparison = await getTransactionsComparison(user_id, 90); // 3 months
  const categoryStats = await getAverageSpendingByCategory(user_id, 3);

  if (!currentMonth) {
    return { score: 0, factors: [], recommendations: [] };
  }

  let score = 50; // Base score
  const factors = [];
  const recommendations = [];

  // Factor 1: Positive balance (30 points max)
  if (currentMonth.balance > 0) {
    const balanceRatio =
      currentMonth.balance / (currentMonth.total_ingresos || 1);
    const balancePoints = Math.min(30, balanceRatio * 100);
    score += balancePoints;
    factors.push(`Balance positivo: +${balancePoints.toFixed(0)} puntos`);

    if (balanceRatio > 0.2) {
      recommendations.push("¡Excelente! Mantén este nivel de ahorro.");
    }
  } else {
    score -= 20;
    factors.push("Balance negativo: -20 puntos");
    recommendations.push("Considera reducir gastos o aumentar ingresos.");
  }

  // Factor 2: Spending trend (20 points max)
  if (comparison && comparison.previous.gastos > 0) {
    const spendingChange =
      (comparison.current.gastos - comparison.previous.gastos) /
      comparison.previous.gastos;
    if (spendingChange < -0.1) {
      // Reduced spending by 10%+
      score += 20;
      factors.push("Reducción de gastos: +20 puntos");
    } else if (spendingChange > 0.2) {
      // Increased spending by 20%+
      score -= 15;
      factors.push("Aumento significativo de gastos: -15 puntos");
      recommendations.push(
        "Revisa tus gastos recientes para identificar aumentos innecesarios."
      );
    }
  }

  // Factor 3: Category diversification (10 points max)
  if (categoryStats.length >= 3) {
    score += 10;
    factors.push("Diversificación de gastos: +10 puntos");
  } else {
    recommendations.push(
      "Considera categorizar mejor tus gastos para un mejor control."
    );
  }

  // Factor 4: Transaction frequency consistency (10 points max)
  if (currentMonth.total_transacciones >= 10) {
    score += 10;
    factors.push("Registro consistente: +10 puntos");
  } else {
    recommendations.push(
      "Registra todas tus transacciones para un mejor análisis."
    );
  }

  score = Math.max(0, Math.min(100, score));

  return {
    score: Math.round(score),
    factors,
    recommendations,
    level:
      score >= 80
        ? "Excelente"
        : score >= 60
        ? "Bueno"
        : score >= 40
        ? "Regular"
        : "Necesita Mejora",
  };
}

// Get budget recommendations based on spending patterns
export async function getBudgetRecommendations(user_id) {
  const averageSpending = await getAverageSpendingByCategory(user_id, 3);
  const currentMonth = await getCurrentMonthStats(user_id);

  if (!currentMonth || averageSpending.length === 0) {
    return [];
  }

  const totalIncome = currentMonth.total_ingresos;
  const recommendations = [];

  // Calculate recommended budget percentages
  const budgetRules = {
    Alimentación: 0.25,
    Transporte: 0.15,
    Vivienda: 0.3,
    Entretenimiento: 0.1,
    Salud: 0.05,
    Ropa: 0.05,
    Educación: 0.1,
  };

  averageSpending.forEach((category) => {
    const recommendedAmount =
      totalIncome * (budgetRules[category.category] || 0.1);
    const currentSpending = category.average;

    if (currentSpending > recommendedAmount * 1.2) {
      // 20% over recommended
      recommendations.push({
        category: category.category,
        type: "reduce",
        current: currentSpending,
        recommended: recommendedAmount,
        difference: currentSpending - recommendedAmount,
        message: `Considera reducir gastos en ${category.category}`,
      });
    } else if (currentSpending < recommendedAmount * 0.5) {
      // 50% under recommended
      recommendations.push({
        category: category.category,
        type: "increase",
        current: currentSpending,
        recommended: recommendedAmount,
        difference: recommendedAmount - currentSpending,
        message: `Podrías invertir más en ${category.category}`,
      });
    }
  });

  return recommendations;
}

// Get savings projection
export async function getSavingsProjection(user_id, months = 12) {
  const monthlyReports = await getMonthlyReports(user_id);

  if (monthlyReports.length < 3) {
    return null; // Need at least 3 months of data
  }

  // Calculate average monthly savings
  const recentMonths = monthlyReports.slice(0, 6); // Last 6 months
  const averageSavings =
    recentMonths.reduce((sum, month) => sum + month.balance, 0) /
    recentMonths.length;

  // Calculate trend
  const oldestMonth = recentMonths[recentMonths.length - 1];
  const newestMonth = recentMonths[0];
  const trend =
    (newestMonth.balance - oldestMonth.balance) / recentMonths.length;

  // Project future savings
  const projections = [];
  let currentSavings = 0;

  for (let i = 1; i <= months; i++) {
    const projectedMonthlySavings = averageSavings + trend * i;
    currentSavings += projectedMonthlySavings;    const futureDate = new Date();
    futureDate.setUTCMonth(futureDate.getUTCMonth() + i);

    projections.push({
      month: i,
      date: futureDate.toISOString().split("T")[0],
      monthlySavings: parseFloat(projectedMonthlySavings.toFixed(2)),
      cumulativeSavings: parseFloat(currentSavings.toFixed(2)),
    });
  }

  return {
    averageMonthlySavings: parseFloat(averageSavings.toFixed(2)),
    trend: parseFloat(trend.toFixed(2)),
    projections,
  };
}
