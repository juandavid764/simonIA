import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  getCurrentMonthStats,
  getCategoryStats,
  getTransactionsComparison,
  getYearOverview,
  getWeeklyAnalysis,
} from "../../supabase/transactions";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Calendar,
  PieChart,
  DollarSign,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
} from "lucide-react";

export const Estadisticas = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [currentStats, setCurrentStats] = useState(null);
  const [categoryStats, setCategoryStats] = useState([]);
  const [comparison, setComparison] = useState(null);  const [yearOverview, setYearOverview] = useState([]);
  const [weeklyAnalysis, setWeeklyAnalysis] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState("month");

  useEffect(() => {
    if (user?.id) {
      loadStatistics();
    }
  }, [user?.id, selectedPeriod]);

  const loadStatistics = async () => {
    setLoading(true);
    try {
      // Current month stats
      const currentMonthData = await getCurrentMonthStats(user.id);
      setCurrentStats(currentMonthData);      // Category stats for current month
      const now = new Date();
      const startOfMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
      const endOfMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 0));

      const categoryData = await getCategoryStats(
        user.id,
        startOfMonth.toISOString().split("T")[0],
        endOfMonth.toISOString().split("T")[0]
      );
      setCategoryStats(categoryData);

      // Comparison with previous period
      const comparisonData = await getTransactionsComparison(user.id, 30);
      setComparison(comparisonData); // Year overview
      const yearData = await getYearOverview(user.id);
      setYearOverview(yearData);      // Weekly analysis
      const weeklyData = await getWeeklyAnalysis(user.id);
      setWeeklyAnalysis(weeklyData);

    } catch (error) {
      console.error("Error loading statistics:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(amount || 0);
  };

  const calculatePercentageChange = (current, previous) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
  };

  const monthNames = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-[#25D366]">Estadísticas</h2>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-gray-400">Cargando estadísticas...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-[#25D366]">
          Estadísticas Financieras
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => setSelectedPeriod("month")}
            className={`px-3 py-1 rounded text-sm transition-colors ${
              selectedPeriod === "month"
                ? "bg-[#25D366] text-[#111B21]"
                : "bg-[#222E35] text-gray-300 hover:bg-[#25D366]/20"
            }`}
          >
            Mes Actual
          </button>
          <button
            onClick={() => setSelectedPeriod("year")}
            className={`px-3 py-1 rounded text-sm transition-colors ${
              selectedPeriod === "year"
                ? "bg-[#25D366] text-[#111B21]"
                : "bg-[#222E35] text-gray-300 hover:bg-[#25D366]/20"
            }`}
          >
            Año
          </button>
        </div>
      </div>

      {/* Resumen Principal */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#111B21] p-6 rounded-lg border border-[#222E35]">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-green-900/50 rounded-lg">
              <TrendingUp className="text-green-400" size={24} />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-400">
                Ingresos del Mes
              </h3>
              <p className="text-2xl font-bold text-green-400">
                {formatCurrency(currentStats?.total_ingresos)}
              </p>
            </div>
          </div>
          {comparison && (
            <div className="flex items-center gap-1 text-sm">
              {comparison.current.ingresos > comparison.previous.ingresos ? (
                <ArrowUpRight className="text-green-400" size={16} />
              ) : comparison.current.ingresos < comparison.previous.ingresos ? (
                <ArrowDownRight className="text-red-400" size={16} />
              ) : (
                <Minus className="text-gray-400" size={16} />
              )}
              <span
                className={`font-medium ${
                  comparison.current.ingresos > comparison.previous.ingresos
                    ? "text-green-400"
                    : comparison.current.ingresos < comparison.previous.ingresos
                    ? "text-red-400"
                    : "text-gray-400"
                }`}
              >
                {Math.abs(
                  calculatePercentageChange(
                    comparison.current.ingresos,
                    comparison.previous.ingresos
                  )
                ).toFixed(1)}
                %
              </span>
              <span className="text-gray-400">vs mes anterior</span>
            </div>
          )}
        </div>

        <div className="bg-[#111B21] p-6 rounded-lg border border-[#222E35]">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-red-900/50 rounded-lg">
              <TrendingDown className="text-red-400" size={24} />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-400">
                Gastos del Mes
              </h3>
              <p className="text-2xl font-bold text-red-400">
                {formatCurrency(currentStats?.total_gastos)}
              </p>
            </div>
          </div>
          {comparison && (
            <div className="flex items-center gap-1 text-sm">
              {comparison.current.gastos > comparison.previous.gastos ? (
                <ArrowUpRight className="text-red-400" size={16} />
              ) : comparison.current.gastos < comparison.previous.gastos ? (
                <ArrowDownRight className="text-green-400" size={16} />
              ) : (
                <Minus className="text-gray-400" size={16} />
              )}
              <span
                className={`font-medium ${
                  comparison.current.gastos > comparison.previous.gastos
                    ? "text-red-400"
                    : comparison.current.gastos < comparison.previous.gastos
                    ? "text-green-400"
                    : "text-gray-400"
                }`}
              >
                {Math.abs(
                  calculatePercentageChange(
                    comparison.current.gastos,
                    comparison.previous.gastos
                  )
                ).toFixed(1)}
                %
              </span>
              <span className="text-gray-400">vs mes anterior</span>
            </div>
          )}
        </div>

        <div className="bg-[#111B21] p-6 rounded-lg border border-[#222E35]">
          <div className="flex items-center gap-3 mb-4">
            <div
              className={`p-2 rounded-lg ${
                (currentStats?.resultado || 0) >= 0
                  ? "bg-green-900/50"
                  : "bg-red-900/50"
              }`}
            >
              <DollarSign
                className={`${
                  (currentStats?.resultado || 0) >= 0
                    ? "text-green-400"
                    : "text-red-400"
                }`}
                size={24}
              />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-400">
                Balance del Mes
              </h3>
              <p
                className={`text-2xl font-bold ${
                  (currentStats?.resultado || 0) >= 0
                    ? "text-green-400"
                    : "text-red-400"
                }`}
              >
                {formatCurrency(currentStats?.resultado)}
              </p>
            </div>
          </div>
          {comparison && (
            <div className="flex items-center gap-1 text-sm">
              {comparison.current.balance > comparison.previous.balance ? (
                <ArrowUpRight className="text-green-400" size={16} />
              ) : comparison.current.balance < comparison.previous.balance ? (
                <ArrowDownRight className="text-red-400" size={16} />
              ) : (
                <Minus className="text-gray-400" size={16} />
              )}
              <span
                className={`font-medium ${
                  comparison.current.balance > comparison.previous.balance
                    ? "text-green-400"
                    : comparison.current.balance < comparison.previous.balance
                    ? "text-red-400"
                    : "text-gray-400"
                }`}
              >
                {formatCurrency(
                  Math.abs(
                    comparison.current.balance - comparison.previous.balance
                  )
                )}
              </span>
              <span className="text-gray-400">diferencia</span>
            </div>
          )}
        </div>
      </div>

      {/* Gastos por Categoría */}
      <div className="bg-[#111B21] p-6 rounded-lg border border-[#222E35]">
        <h3 className="text-lg font-semibold text-gray-200 mb-4 flex items-center gap-2">
          <PieChart size={20} />
          Gastos por Categoría (Mes Actual)
        </h3>
        {categoryStats.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categoryStats
              .sort((a, b) => b.total - a.total)
              .map((category, index) => {
                const totalGastos = categoryStats.reduce(
                  (sum, cat) => sum + cat.total,
                  0
                );
                const percentage = (
                  (category.total / totalGastos) *
                  100
                ).toFixed(1);

                return (
                  <div
                    key={category.category}
                    className="bg-[#1A232A] p-4 rounded-lg border border-[#222E35] hover:border-[#25D366]/30 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-200">
                        {category.category}
                      </h4>
                      <span className="text-sm text-gray-400">
                        {percentage}%
                      </span>
                    </div>
                    <p className="text-xl font-bold text-red-400 mb-2">
                      {formatCurrency(category.total)}
                    </p>
                    <div className="w-full bg-[#222E35] rounded-full h-2">
                      <div
                        className="bg-red-400 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-400">
            No hay gastos registrados para este mes
          </div>
        )}
      </div>

      {/* Resumen Anual */}
      {selectedPeriod === "year" && yearOverview.length > 0 && (
        <div className="bg-[#111B21] p-6 rounded-lg border border-[#222E35]">
          <h3 className="text-lg font-semibold text-gray-200 mb-4 flex items-center gap-2">
            <Calendar size={20} />
            Resumen Anual {new Date().getFullYear()}
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#222E35]">
                  <th className="text-left py-3 px-4 text-gray-300 font-semibold">
                    Mes
                  </th>
                  <th className="text-right py-3 px-4 text-gray-300 font-semibold">
                    Ingresos
                  </th>
                  <th className="text-right py-3 px-4 text-gray-300 font-semibold">
                    Gastos
                  </th>
                  <th className="text-right py-3 px-4 text-gray-300 font-semibold">
                    Balance
                  </th>
                  <th className="text-center py-3 px-4 text-gray-300 font-semibold">
                    Estado
                  </th>
                </tr>
              </thead>
              <tbody>
                {yearOverview.map((month) => (
                  <tr
                    key={`${month.año}-${month.mes}`}
                    className="border-b border-[#222E35]/50 hover:bg-[#1A232A]"
                  >
                    <td className="py-3 px-4 text-gray-200 font-medium">
                      {monthNames[month.mes - 1]}
                    </td>
                    <td className="py-3 px-4 text-right text-green-400">
                      {formatCurrency(month.total_ingresos)}
                    </td>
                    <td className="py-3 px-4 text-right text-red-400">
                      {formatCurrency(month.total_gastos)}
                    </td>
                    <td
                      className={`py-3 px-4 text-right font-semibold ${
                        month.resultado >= 0 ? "text-green-400" : "text-red-400"
                      }`}
                    >
                      {formatCurrency(month.resultado)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {month.resultado >= 0 ? (
                        <div className="inline-flex items-center gap-1 px-2 py-1 bg-green-900/50 text-green-400 rounded-full">
                          <TrendingUp size={12} />
                          <span className="text-xs font-medium">Positivo</span>
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1 px-2 py-1 bg-red-900/50 text-red-400 rounded-full">
                          <TrendingDown size={12} />
                          <span className="text-xs font-medium">Negativo</span>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>{" "}
        </div>
      )}

      {/* Análisis Semanal */}
      {weeklyAnalysis.length > 0 && (
        <div className="bg-[#111B21] p-6 rounded-lg border border-[#222E35]">
          <h3 className="text-lg font-semibold text-gray-200 mb-4 flex items-center gap-2">
            <Activity size={20} />
            Análisis Semanal del Mes
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {weeklyAnalysis.map((week, index) => (
              <div
                key={week.week}
                className="bg-[#1A232A] p-4 rounded-lg border border-[#222E35]"
              >
                <h4 className="font-semibold text-gray-200 mb-3">
                  {week.week}
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Ingresos:</span>
                    <span className="text-green-400">
                      {formatCurrency(week.ingresos)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Gastos:</span>
                    <span className="text-red-400">
                      {formatCurrency(week.gastos)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm font-semibold border-t border-[#222E35] pt-2">
                    <span className="text-gray-300">Balance:</span>
                    <span
                      className={
                        week.balance >= 0 ? "text-green-400" : "text-red-400"
                      }
                    >
                      {formatCurrency(week.balance)}
                    </span>
                  </div>
                  <div className="text-xs text-gray-400 text-center">
                    {week.transacciones} transacciones
                  </div>
                </div>
              </div>
            ))}
          </div>        </div>      )}
    </div>
  );
};
