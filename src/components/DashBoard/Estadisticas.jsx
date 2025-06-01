import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  getCurrentMonthStats,
  getCategoryStats,
  getTransactionsComparison,
  getYearOverview,
  getWeeklyAnalysis,
  getSpecificMonthStats,
  getCategoryStatsForMonth,
  getWeeklyAnalysisForMonth,
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
  ChevronDown,
} from "lucide-react";

export const Estadisticas = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [currentStats, setCurrentStats] = useState(null);
  const [categoryStats, setCategoryStats] = useState([]);
  const [comparison, setComparison] = useState(null);  const [yearOverview, setYearOverview] = useState([]);
  const [weeklyAnalysis, setWeeklyAnalysis] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState("month");
  
  // New state for month filtering
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [showMonthSelector, setShowMonthSelector] = useState(false);
  
  // Ref for month selector dropdown
  const monthSelectorRef = useRef(null);

  useEffect(() => {
    if (user?.id) {
      loadStatistics();
    }
  }, [user?.id, selectedPeriod, selectedYear, selectedMonth]);

  // Click outside handler for month selector
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (monthSelectorRef.current && !monthSelectorRef.current.contains(event.target)) {
        setShowMonthSelector(false);
      }
    };

    if (showMonthSelector) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [showMonthSelector]);
  const loadStatistics = async () => {
    setLoading(true);
    try {
      if (selectedPeriod === "month") {
        // Check if we're viewing current month or a specific month
        const now = new Date();
        const isCurrentMonth = selectedYear === now.getFullYear() && selectedMonth === (now.getMonth() + 1);
        
        let currentMonthData;
        if (isCurrentMonth) {
          currentMonthData = await getCurrentMonthStats(user.id);
        } else {
          currentMonthData = await getSpecificMonthStats(user.id, selectedYear, selectedMonth);
        }
        setCurrentStats(currentMonthData);

        // Category stats for selected month
        const categoryData = await getCategoryStatsForMonth(user.id, selectedYear, selectedMonth);
        setCategoryStats(categoryData);

        // Weekly analysis for selected month
        const weeklyData = await getWeeklyAnalysisForMonth(user.id, selectedYear, selectedMonth);
        setWeeklyAnalysis(weeklyData);

        // Comparison with previous month
        let prevYear = selectedYear;
        let prevMonth = selectedMonth - 1;
        if (prevMonth === 0) {
          prevMonth = 12;
          prevYear = selectedYear - 1;
        }
        
        const prevMonthData = await getSpecificMonthStats(user.id, prevYear, prevMonth);
        if (currentMonthData && prevMonthData) {
          setComparison({
            current: {
              ingresos: currentMonthData.total_ingresos || 0,
              gastos: currentMonthData.total_gastos || 0,
              balance: currentMonthData.resultado || 0,
            },
            previous: {
              ingresos: prevMonthData.total_ingresos || 0,
              gastos: prevMonthData.total_gastos || 0,
              balance: prevMonthData.resultado || 0,
            },
          });
        } else {
          setComparison(null);
        }
      } else {
        // Year overview
        const yearData = await getYearOverview(user.id, selectedYear);
        setYearOverview(yearData);
        
        // Clear month-specific data when viewing year
        setCurrentStats(null);
        setCategoryStats([]);
        setWeeklyAnalysis([]);
        setComparison(null);
      }

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

  // Helper function to get available years (last 3 years + current year)
  const getAvailableYears = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = 0; i < 4; i++) {
      years.push(currentYear - i);
    }
    return years;
  };

  // Helper function to get selected month name
  const getSelectedMonthName = () => {
    return monthNames[selectedMonth - 1];
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
  }  return (
    <div className="space-y-4 md:space-y-6 p-4 md:p-0">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-xl md:text-2xl font-bold text-[#25D366]">
          Estadísticas Financieras
        </h2>
        <div className="flex flex-wrap gap-2 items-center justify-start sm:justify-end">          {/* Period selector */}
          <button
            onClick={() => setSelectedPeriod("month")}
            className={`px-3 py-2 rounded text-sm transition-colors ${
              selectedPeriod === "month"
                ? "bg-[#25D366] text-[#111B21]"
                : "bg-[#222E35] text-gray-300 hover:bg-[#25D366]/20"
            }`}
          >
            Mes
          </button>
          <button
            onClick={() => setSelectedPeriod("year")}
            className={`px-3 py-2 rounded text-sm transition-colors ${
              selectedPeriod === "year"
                ? "bg-[#25D366] text-[#111B21]"
                : "bg-[#222E35] text-gray-300 hover:bg-[#25D366]/20"
            }`}
          >
            Año
          </button>          {/* Month/Year selector */}
          {selectedPeriod === "month" && (
            <div className="relative w-full sm:w-auto" ref={monthSelectorRef}>
              <button
                onClick={() => setShowMonthSelector(!showMonthSelector)}
                className="flex items-center justify-between w-full sm:w-auto gap-2 px-3 py-2 bg-[#222E35] text-gray-300 rounded text-sm hover:bg-[#25D366]/20 transition-colors min-w-[120px]"
              >
                <span className="truncate">{getSelectedMonthName()} {selectedYear}</span>
                <ChevronDown 
                  size={16} 
                  className={`transition-transform flex-shrink-0 ${showMonthSelector ? 'rotate-180' : ''}`} 
                />
              </button>
              
              {showMonthSelector && (
                <div className="absolute right-0 top-full mt-1 bg-[#111B21] border border-[#222E35] rounded-lg shadow-lg z-10 w-full sm:w-[200px] min-w-[200px]">
                  <div className="p-2">
                    <div className="mb-2">
                      <label className="text-xs text-gray-400 block mb-1">Año</label>
                      <select
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                        className="w-full px-2 py-1 bg-[#222E35] text-gray-200 rounded text-sm border border-[#2A3942] focus:border-[#25D366] focus:outline-none"
                      >
                        {getAvailableYears().map(year => (
                          <option key={year} value={year}>{year}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 block mb-1">Mes</label>
                      <select
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                        className="w-full px-2 py-1 bg-[#222E35] text-gray-200 rounded text-sm border border-[#2A3942] focus:border-[#25D366] focus:outline-none"
                      >
                        {monthNames.map((month, index) => (
                          <option key={index + 1} value={index + 1}>{month}</option>
                        ))}
                      </select>
                    </div>
                    <div className="mt-2 pt-2 border-t border-[#222E35]">
                      <button
                        onClick={() => setShowMonthSelector(false)}
                        className="w-full px-2 py-1 bg-[#25D366] text-[#111B21] rounded text-sm hover:bg-[#25D366]/90 transition-colors"
                      >
                        Aplicar
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}          {selectedPeriod === "year" && (
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                className="w-full sm:w-auto px-3 py-2 bg-[#222E35] text-gray-300 rounded text-sm border border-[#2A3942] focus:border-[#25D366] focus:outline-none"
              >
                {getAvailableYears().map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>      {/* Resumen Principal */}
      {selectedPeriod === "month" && currentStats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">          <div className="bg-[#111B21] p-3 sm:p-4 md:p-6 rounded-lg border border-[#222E35]">
            <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <div className="p-1.5 sm:p-2 bg-green-900/50 rounded-lg flex-shrink-0">
                <TrendingUp className="text-green-400" size={16} />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-xs sm:text-sm md:text-sm font-medium text-gray-400 mb-1">
                  Ingresos de {getSelectedMonthName()} {selectedYear}
                </h3>
                <p className="text-base sm:text-lg md:text-2xl font-bold text-green-400 truncate">
                  {formatCurrency(currentStats?.total_ingresos)}
                </p>
              </div>
            </div>{comparison && (
              <div className="flex items-center gap-1 text-xs md:text-sm flex-wrap">
                {comparison.current.ingresos > comparison.previous.ingresos ? (
                  <ArrowUpRight className="text-green-400 flex-shrink-0" size={14} />
                ) : comparison.current.ingresos < comparison.previous.ingresos ? (
                  <ArrowDownRight className="text-red-400 flex-shrink-0" size={14} />
                ) : (
                  <Minus className="text-gray-400 flex-shrink-0" size={14} />
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
                <span className="text-gray-400 truncate">vs mes anterior</span>
              </div>
            )}
          </div>

          <div className="bg-[#111B21] p-4 md:p-6 rounded-lg border border-[#222E35]">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-900/50 rounded-lg flex-shrink-0">
                <TrendingDown className="text-red-400" size={20} />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-xs md:text-sm font-medium text-gray-400 mb-1">
                  Gastos de {getSelectedMonthName()} {selectedYear}
                </h3>
                <p className="text-lg md:text-2xl font-bold text-red-400 truncate">
                  {formatCurrency(currentStats?.total_gastos)}
                </p>
              </div>
            </div>
            {comparison && (
              <div className="flex items-center gap-1 text-xs md:text-sm flex-wrap">
                {comparison.current.gastos > comparison.previous.gastos ? (
                  <ArrowUpRight className="text-red-400 flex-shrink-0" size={14} />
                ) : comparison.current.gastos < comparison.previous.gastos ? (
                  <ArrowDownRight className="text-green-400 flex-shrink-0" size={14} />
                ) : (
                  <Minus className="text-gray-400 flex-shrink-0" size={14} />
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
                <span className="text-gray-400 truncate">vs mes anterior</span>
              </div>
            )}
          </div>

          <div className="bg-[#111B21] p-4 md:p-6 rounded-lg border border-[#222E35]">
            <div className="flex items-center gap-3 mb-4">
              <div
                className={`p-2 rounded-lg flex-shrink-0 ${
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
                  size={20}
                />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-xs md:text-sm font-medium text-gray-400 mb-1">
                  Balance de {getSelectedMonthName()} {selectedYear}
                </h3>
                <p
                  className={`text-lg md:text-2xl font-bold truncate ${
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
              <div className="flex items-center gap-1 text-xs md:text-sm flex-wrap">
                {comparison.current.balance > comparison.previous.balance ? (
                  <ArrowUpRight className="text-green-400 flex-shrink-0" size={14} />
                ) : comparison.current.balance < comparison.previous.balance ? (
                  <ArrowDownRight className="text-red-400 flex-shrink-0" size={14} />
                ) : (
                  <Minus className="text-gray-400 flex-shrink-0" size={14} />
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
                <span className="text-gray-400 truncate">diferencia</span>
              </div>
            )}
          </div>
        </div>
      )}      {/* Gastos por Categoría */}
      {selectedPeriod === "month" && (
        <div className="bg-[#111B21] p-6 rounded-lg border border-[#222E35]">
          <h3 className="text-lg font-semibold text-gray-200 mb-4 flex items-center gap-2">
            <PieChart size={20} />
            Gastos por Categoría ({getSelectedMonthName()} {selectedYear})
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
              No hay gastos registrados para {getSelectedMonthName()} {selectedYear}
            </div>
          )}
        </div>
      )}      {/* Resumen Anual */}
      {selectedPeriod === "year" && yearOverview.length > 0 && (
        <div className="bg-[#111B21] p-6 rounded-lg border border-[#222E35]">
          <h3 className="text-lg font-semibold text-gray-200 mb-4 flex items-center gap-2">
            <Calendar size={20} />
            Resumen Anual {selectedYear}
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
      )}      {/* Análisis Semanal */}
      {selectedPeriod === "month" && weeklyAnalysis.length > 0 && (
        <div className="bg-[#111B21] p-6 rounded-lg border border-[#222E35]">
          <h3 className="text-lg font-semibold text-gray-200 mb-4 flex items-center gap-2">
            <Activity size={20} />
            Análisis Semanal de {getSelectedMonthName()} {selectedYear}
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
