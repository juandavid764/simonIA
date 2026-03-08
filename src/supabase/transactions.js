import { supabase } from "./client.js";

const TRANSACTIONS_TABLE = "transacciones";

const CATEGORY_NORMALIZATION = {
  alimentacion: "alimentacion",
  "alimentacion": "alimentacion",
  comida: "alimentacion",
  transporte: "transporte",
  vivienda: "vivienda",
  servicios: "servicios",
  ocio: "ocio",
  entretenimiento: "ocio",
  salud: "salud",
  educacion: "educacion",
  "educacion": "educacion",
  compras: "compras",
  ropa: "compras",
  otros: "otros",
  otro: "otros",
};

const CATEGORY_LABELS = {
  alimentacion: "Alimentacion",
  transporte: "Transporte",
  vivienda: "Vivienda",
  servicios: "Servicios",
  ocio: "Ocio",
  salud: "Salud",
  educacion: "Educacion",
  compras: "Compras",
  otros: "Otros",
};

const formatLocalDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const toLocalDate = (dateString) => new Date(`${dateString}T00:00:00`);

const normalizeCategory = (category) => {
  if (!category) return null;
  const normalized = String(category).trim().toLowerCase();
  return CATEGORY_NORMALIZATION[normalized] || normalized;
};

const getCategoryLabel = (categoryCode) => {
  if (!categoryCode) return "Sin categoria";
  return CATEGORY_LABELS[categoryCode] || categoryCode;
};

const toDbTransaction = (transaction = {}) => {
  const payload = { ...transaction };

  if (payload.user_id && !payload.usuario_id) {
    payload.usuario_id = payload.user_id;
  }

  if (Object.prototype.hasOwnProperty.call(payload, "category")) {
    payload.categoria = payload.category;
  }

  delete payload.user_id;
  delete payload.category;

  payload.categoria = normalizeCategory(payload.categoria);

  if (payload.tipo === "ingreso") {
    payload.categoria = null;
  }

  return payload;
};

const fromDbTransaction = (row = {}) => ({
  ...row,
  monto: Number(row.monto),
  user_id: row.usuario_id,
  category: row.categoria,
});

const summarizeTransactions = (transactions = []) => {
  const totals = transactions.reduce(
    (acc, transaction) => {
      const amount = Number(transaction.monto) || 0;
      if (transaction.tipo === "ingreso") {
        acc.total_ingresos += amount;
      } else {
        acc.total_gastos += amount;
      }
      return acc;
    },
    { total_ingresos: 0, total_gastos: 0 }
  );

  const resultado = totals.total_ingresos - totals.total_gastos;

  return {
    total_ingresos: Number(totals.total_ingresos.toFixed(2)),
    total_gastos: Number(totals.total_gastos.toFixed(2)),
    resultado: Number(resultado.toFixed(2)),
    balance: Number(resultado.toFixed(2)),
    total_transacciones: transactions.length,
  };
};

const fetchTransactionsByDateRange = async ({
  usuarioId,
  startDate,
  endDate,
  onlyType = null,
  select = "*",
}) => {
  let query = supabase
    .from(TRANSACTIONS_TABLE)
    .select(select)
    .eq("usuario_id", usuarioId)
    .gte("fecha", startDate)
    .lte("fecha", endDate)
    .order("fecha", { ascending: true });

  if (onlyType) {
    query = query.eq("tipo", onlyType);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
};

// Create a new transaction
export async function createTransaction(transaction) {
  const payload = toDbTransaction(transaction);

  const { data, error } = await supabase
    .from(TRANSACTIONS_TABLE)
    .insert([payload])
    .select()
    .single();

  if (error) throw error;
  return fromDbTransaction(data);
}

// Get all transactions (optionally by user_id)
export async function getTransactions(user_id = null) {
  let query = supabase
    .from(TRANSACTIONS_TABLE)
    .select("*")
    .order("fecha", { ascending: false })
    .order("id", { ascending: false });

  if (user_id) {
    query = query.eq("usuario_id", user_id);
  }

  const { data, error } = await query;
  if (error) throw error;

  return (data || []).map(fromDbTransaction);
}

// Get a single transaction by id
export async function getTransactionById(id) {
  const { data, error } = await supabase
    .from(TRANSACTIONS_TABLE)
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return fromDbTransaction(data);
}

// Update a transaction by id
export async function updateTransaction(id, updates) {
  const payload = toDbTransaction(updates);

  const { data, error } = await supabase
    .from(TRANSACTIONS_TABLE)
    .update(payload)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return fromDbTransaction(data);
}

// Delete a transaction by id
export async function deleteTransaction(id) {
  const { error } = await supabase.from(TRANSACTIONS_TABLE).delete().eq("id", id);
  if (error) throw error;
  return true;
}

// Get monthly statistics aggregated from transactions
export async function getMonthlyReports(user_id, year = null) {
  if (!user_id) return [];

  let query = supabase
    .from(TRANSACTIONS_TABLE)
    .select("fecha, tipo, monto")
    .eq("usuario_id", user_id)
    .order("fecha", { ascending: false });

  if (year) {
    query = query
      .gte("fecha", `${year}-01-01`)
      .lte("fecha", `${year}-12-31`);
  }

  const { data, error } = await query;
  if (error) throw error;

  const grouped = {};

  (data || []).forEach((transaction) => {
    const date = toLocalDate(transaction.fecha);
    const anio = date.getFullYear();
    const mes = date.getMonth() + 1;
    const key = `${anio}-${mes}`;

    if (!grouped[key]) {
      grouped[key] = {
        anio,
        mes,
        transactions: [],
      };
    }

    grouped[key].transactions.push(transaction);
  });

  return Object.values(grouped)
    .map((group) => {
      const summary = summarizeTransactions(group.transactions);
      return {
        anio: group.anio,
        mes: group.mes,
        ...summary,
      };
    })
    .sort((a, b) => {
      if (a.anio === b.anio) return b.mes - a.mes;
      return b.anio - a.anio;
    });
}

// Get current month statistics
export async function getCurrentMonthStats(user_id) {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  return getSpecificMonthStats(user_id, currentYear, currentMonth);
}

// Get statistics for a specific month and year
export async function getSpecificMonthStats(user_id, year, month) {
  if (!user_id || !year || !month) return null;

  const startOfMonth = formatLocalDate(new Date(year, month - 1, 1));
  const endOfMonth = formatLocalDate(new Date(year, month, 0));

  const data = await fetchTransactionsByDateRange({
    usuarioId: user_id,
    startDate: startOfMonth,
    endDate: endOfMonth,
    select: "tipo, monto",
  });

  return summarizeTransactions(data);
}

// Get category statistics for a specific period
export async function getCategoryStats(user_id, startDate, endDate) {
  const data = await fetchTransactionsByDateRange({
    usuarioId: user_id,
    startDate,
    endDate,
    onlyType: "gasto",
    select: "categoria, tipo, monto",
  });

  const categoryTotals = data.reduce((acc, transaction) => {
    const categoryCode = normalizeCategory(transaction.categoria);
    if (!categoryCode) return acc;

    acc[categoryCode] = (acc[categoryCode] || 0) + Number(transaction.monto || 0);
    return acc;
  }, {});

  return Object.entries(categoryTotals).map(([categoryCode, total]) => ({
    category: getCategoryLabel(categoryCode),
    categoryCode,
    total: Number(total.toFixed(2)),
  }));
}

// Get category statistics for a specific month and year
export async function getCategoryStatsForMonth(user_id, year, month) {
  const startOfMonth = new Date(year, month - 1, 1);
  const endOfMonth = new Date(year, month, 0);

  return getCategoryStats(
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
  prevEndDate.setDate(prevEndDate.getDate() - 1);

  const currentData = await fetchTransactionsByDateRange({
    usuarioId: user_id,
    startDate: formatLocalDate(startDate),
    endDate: formatLocalDate(endDate),
    select: "tipo, monto",
  });

  const previousData = await fetchTransactionsByDateRange({
    usuarioId: user_id,
    startDate: formatLocalDate(prevStartDate),
    endDate: formatLocalDate(prevEndDate),
    select: "tipo, monto",
  });

  const calculateTotals = (transactions) =>
    transactions.reduce(
      (acc, transaction) => {
        if (transaction.tipo === "ingreso") {
          acc.ingresos += Number(transaction.monto || 0);
        } else {
          acc.gastos += Number(transaction.monto || 0);
        }
        return acc;
      },
      { ingresos: 0, gastos: 0 }
    );

  const current = calculateTotals(currentData);
  const previous = calculateTotals(previousData);

  return {
    current: {
      ingresos: Number(current.ingresos.toFixed(2)),
      gastos: Number(current.gastos.toFixed(2)),
      balance: Number((current.ingresos - current.gastos).toFixed(2)),
    },
    previous: {
      ingresos: Number(previous.ingresos.toFixed(2)),
      gastos: Number(previous.gastos.toFixed(2)),
      balance: Number((previous.ingresos - previous.gastos).toFixed(2)),
    },
  };
}

// Get year overview
export async function getYearOverview(user_id, year = null) {
  const targetYear = year || new Date().getFullYear();
  const monthlyData = await getMonthlyReports(user_id, targetYear);

  return [...monthlyData].sort((a, b) => a.mes - b.mes);
}

// Get weekly analysis for current month
export async function getWeeklyAnalysis(user_id) {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  const data = await fetchTransactionsByDateRange({
    usuarioId: user_id,
    startDate: formatLocalDate(startOfMonth),
    endDate: formatLocalDate(endOfMonth),
    select: "fecha, tipo, monto",
  });

  const weeks = {};

  data.forEach((transaction) => {
    const date = toLocalDate(transaction.fecha);
    const weekNumber = Math.ceil(date.getDate() / 7);
    const weekKey = `Semana ${weekNumber}`;

    if (!weeks[weekKey]) {
      weeks[weekKey] = { ingresos: 0, gastos: 0, transacciones: 0 };
    }

    weeks[weekKey].transacciones += 1;
    if (transaction.tipo === "ingreso") {
      weeks[weekKey].ingresos += Number(transaction.monto || 0);
    } else {
      weeks[weekKey].gastos += Number(transaction.monto || 0);
    }
  });

  return Object.entries(weeks).map(([week, dataByWeek]) => ({
    week,
    ...dataByWeek,
    balance: Number((dataByWeek.ingresos - dataByWeek.gastos).toFixed(2)),
  }));
}

// Get weekly analysis for a specific month and year
export async function getWeeklyAnalysisForMonth(user_id, year, month) {
  const startOfMonth = new Date(year, month - 1, 1);
  const endOfMonth = new Date(year, month, 0);

  const data = await fetchTransactionsByDateRange({
    usuarioId: user_id,
    startDate: formatLocalDate(startOfMonth),
    endDate: formatLocalDate(endOfMonth),
    select: "fecha, tipo, monto",
  });

  const weeks = {};

  data.forEach((transaction) => {
    const date = toLocalDate(transaction.fecha);
    const weekNumber = Math.ceil(date.getDate() / 7);
    const weekKey = `Semana ${weekNumber}`;

    if (!weeks[weekKey]) {
      weeks[weekKey] = { ingresos: 0, gastos: 0, transacciones: 0 };
    }

    weeks[weekKey].transacciones += 1;
    if (transaction.tipo === "ingreso") {
      weeks[weekKey].ingresos += Number(transaction.monto || 0);
    } else {
      weeks[weekKey].gastos += Number(transaction.monto || 0);
    }
  });

  return Object.entries(weeks).map(([week, dataByWeek]) => ({
    week,
    ...dataByWeek,
    balance: Number((dataByWeek.ingresos - dataByWeek.gastos).toFixed(2)),
  }));
}

// Get average monthly spending by category
export async function getAverageSpendingByCategory(user_id, months = 6) {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - months);

  const data = await fetchTransactionsByDateRange({
    usuarioId: user_id,
    startDate: formatLocalDate(startDate),
    endDate: formatLocalDate(endDate),
    onlyType: "gasto",
    select: "fecha, categoria, monto",
  });

  const categoryMonths = {};

  data.forEach((transaction) => {
    const date = toLocalDate(transaction.fecha);
    const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
    const category = normalizeCategory(transaction.categoria);

    if (!category) return;

    if (!categoryMonths[category]) {
      categoryMonths[category] = {};
    }

    if (!categoryMonths[category][monthKey]) {
      categoryMonths[category][monthKey] = 0;
    }

    categoryMonths[category][monthKey] += Number(transaction.monto || 0);
  });

  return Object.entries(categoryMonths).map(([category, monthData]) => {
    const monthValues = Object.values(monthData);
    const total = monthValues.reduce((sum, value) => sum + value, 0);
    const average = total / Math.max(monthValues.length, 1);

    return {
      category,
      categoryLabel: getCategoryLabel(category),
      average: Number(average.toFixed(2)),
      months: monthValues.length,
      total: Number(total.toFixed(2)),
    };
  });
}

// Get financial health score
export async function getFinancialHealthScore(user_id) {
  const currentMonth = await getCurrentMonthStats(user_id);
  const comparison = await getTransactionsComparison(user_id, 90);
  const categoryStats = await getAverageSpendingByCategory(user_id, 3);

  if (!currentMonth || currentMonth.total_transacciones === 0) {
    return { score: 0, factors: [], recommendations: [] };
  }

  let score = 50;
  const factors = [];
  const recommendations = [];

  if (currentMonth.balance > 0) {
    const balanceRatio = currentMonth.balance / (currentMonth.total_ingresos || 1);
    const balancePoints = Math.min(30, balanceRatio * 100);
    score += balancePoints;
    factors.push(`Balance positivo: +${balancePoints.toFixed(0)} puntos`);

    if (balanceRatio > 0.2) {
      recommendations.push("Excelente. Manten este nivel de ahorro.");
    }
  } else {
    score -= 20;
    factors.push("Balance negativo: -20 puntos");
    recommendations.push("Considera reducir gastos o aumentar ingresos.");
  }

  if (comparison && comparison.previous.gastos > 0) {
    const spendingChange =
      (comparison.current.gastos - comparison.previous.gastos) /
      comparison.previous.gastos;

    if (spendingChange < -0.1) {
      score += 20;
      factors.push("Reduccion de gastos: +20 puntos");
    } else if (spendingChange > 0.2) {
      score -= 15;
      factors.push("Aumento significativo de gastos: -15 puntos");
      recommendations.push(
        "Revisa tus gastos recientes para identificar aumentos innecesarios."
      );
    }
  }

  if (categoryStats.length >= 3) {
    score += 10;
    factors.push("Diversificacion de gastos: +10 puntos");
  } else {
    recommendations.push(
      "Considera categorizar mejor tus gastos para un mejor control."
    );
  }

  if (currentMonth.total_transacciones >= 10) {
    score += 10;
    factors.push("Registro consistente: +10 puntos");
  } else {
    recommendations.push(
      "Registra todas tus transacciones para un mejor analisis."
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

  const budgetRules = {
    alimentacion: 0.25,
    transporte: 0.15,
    vivienda: 0.3,
    ocio: 0.1,
    salud: 0.05,
    educacion: 0.1,
    compras: 0.05,
    servicios: 0.1,
    otros: 0.05,
  };

  averageSpending.forEach((categoryStat) => {
    const recommendedAmount =
      totalIncome * (budgetRules[categoryStat.category] || 0.1);
    const currentSpending = categoryStat.average;
    const label = categoryStat.categoryLabel;

    if (currentSpending > recommendedAmount * 1.2) {
      recommendations.push({
        category: categoryStat.category,
        categoryLabel: label,
        type: "reduce",
        current: currentSpending,
        recommended: recommendedAmount,
        difference: currentSpending - recommendedAmount,
        message: `Considera reducir gastos en ${label}`,
      });
    } else if (currentSpending < recommendedAmount * 0.5) {
      recommendations.push({
        category: categoryStat.category,
        categoryLabel: label,
        type: "increase",
        current: currentSpending,
        recommended: recommendedAmount,
        difference: recommendedAmount - currentSpending,
        message: `Podrias invertir mas en ${label}`,
      });
    }
  });

  return recommendations;
}

// Get savings projection
export async function getSavingsProjection(user_id, months = 12) {
  const monthlyReports = await getMonthlyReports(user_id);

  if (monthlyReports.length < 3) {
    return null;
  }

  const recentMonths = monthlyReports.slice(0, 6);
  const averageSavings =
    recentMonths.reduce((sum, month) => sum + month.balance, 0) /
    recentMonths.length;

  const oldestMonth = recentMonths[recentMonths.length - 1];
  const newestMonth = recentMonths[0];
  const trend = (newestMonth.balance - oldestMonth.balance) / recentMonths.length;

  const projections = [];
  let currentSavings = 0;

  for (let i = 1; i <= months; i += 1) {
    const projectedMonthlySavings = averageSavings + trend * i;
    currentSavings += projectedMonthlySavings;

    const futureDate = new Date();
    futureDate.setMonth(futureDate.getMonth() + i);

    projections.push({
      month: i,
      date: formatLocalDate(futureDate),
      monthlySavings: Number(projectedMonthlySavings.toFixed(2)),
      cumulativeSavings: Number(currentSavings.toFixed(2)),
    });
  }

  return {
    averageMonthlySavings: Number(averageSavings.toFixed(2)),
    trend: Number(trend.toFixed(2)),
    projections,
  };
}
