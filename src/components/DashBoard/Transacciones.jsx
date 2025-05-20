import { useEffect, useState } from "react";
import { getTransactions } from "../../supabase/transactions";
import { useAuth } from "../../context/AuthContext.jsx";

export const Transacciones = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const data = await getTransactions(user.id);
        setTransactions(data || []);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, [user.id]);

  // Calcular balance general del mes actual
  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();
  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];
  const nombreMes = monthNames[now.getMonth()];
  const ingresos = transactions.filter(
    (tx) => tx.tipo === 'ingreso' && tx.fecha && new Date(tx.fecha).getMonth() + 1 === currentMonth && new Date(tx.fecha).getFullYear() === currentYear
  );
  const gastos = transactions.filter(
    (tx) => tx.tipo === 'gasto' && tx.fecha && new Date(tx.fecha).getMonth() + 1 === currentMonth && new Date(tx.fecha).getFullYear() === currentYear
  );
  const totalIngresos = ingresos.reduce((acc, tx) => acc + (Number(tx.monto) || 0), 0);
  const totalGastos = gastos.reduce((acc, tx) => acc + (Number(tx.monto) || 0), 0);
  const balance = totalIngresos - totalGastos;

  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 8;
  const totalPages = Math.ceil(transactions.length / rowsPerPage);
  const paginatedTransactions = transactions.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handlePrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-[#25D366]">Transacciones</h2>
      <div className="bg-[#111B21] p-6 rounded-lg border border-[#222E35] overflow-x-auto mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
          <div className="flex flex-col md:flex-row md:items-center gap-2">
            <span className="text-gray-400 font-semibold">Balance general de {nombreMes}:</span>
            <span className={`text-2xl font-bold ${balance >= 0 ? 'text-green-400' : 'text-red-400'}`}>{balance >= 0 ? '+' : ''}${balance.toLocaleString('es-CO')}</span>
          </div>
          <div className="flex gap-6">
            <span className="text-sm text-green-400 font-semibold">Ingresos: ${totalIngresos.toLocaleString('es-CO')}</span>
            <span className="text-sm text-red-400 font-semibold">Gastos: ${totalGastos.toLocaleString('es-CO')}</span>
          </div>
        </div>
      </div>
      <div className="bg-[#111B21] p-6 rounded-lg border border-[#222E35] overflow-x-auto">
        <h3 className="text-lg font-semibold text-gray-200 mb-4">Transacciones Recientes</h3>
        {loading ? (
          <p className="text-gray-400">Cargando transacciones...</p>
        ) : transactions.length === 0 ? (
          <p className="text-gray-400">No hay transacciones recientes</p>
        ) : (
          <div className="w-full">
            <div className="max-h-72 overflow-y-auto rounded-md border border-[#222E35]">
              <table className="min-w-full divide-y divide-[#222E35] text-sm">
                <thead>
                  <tr className="bg-[#202C33]">
                    <th className="py-2 px-2 sm:px-3 font-bold uppercase tracking-wide text-xs md:text-sm whitespace-nowrap">Descripción</th>
                    <th className="py-2 px-2 sm:px-3 font-bold uppercase tracking-wide text-xs md:text-sm whitespace-nowrap">Monto</th>
                    <th className="py-2 px-2 sm:px-3 font-bold uppercase tracking-wide text-xs md:text-sm whitespace-nowrap">Fecha</th>
                    <th className="py-2 px-2 sm:px-3 font-bold uppercase tracking-wide text-xs md:text-sm whitespace-nowrap">Categoría</th>
                    <th className="py-2 px-2 sm:px-3 font-bold uppercase tracking-wide text-xs md:text-sm whitespace-nowrap">Tipo</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedTransactions.map((tx) => (
                    <tr
                      key={tx.id}
                      className={`border-b border-[#222E35] hover:bg-[#202C33] transition ${tx.tipo === 'gasto' ? 'bg-red-950/40' : 'bg-green-950/40'}`}
                    >
                      <td className="py-2 px-2 sm:px-3 text-gray-300 text-xs md:text-sm">{tx.descripcion}</td>
                      <td className={`py-2 px-2 sm:px-3 text-gray-100 font-bold text-xs md:text-sm whitespace-nowrap`}>${tx.monto.toLocaleString('es-CO')}</td>
                      <td className="py-2 px-2 sm:px-3 text-gray-300 text-xs md:text-sm whitespace-nowrap">{tx.fecha}</td>
                      <td className="py-2 px-2 sm:px-3 text-gray-300 text-xs md:text-sm whitespace-nowrap">{tx.category || '-'}</td>
                      <td className={`py-2 px-2 sm:px-3 font-bold text-xs md:text-sm whitespace-nowrap ${tx.tipo === 'gasto' ? 'text-red-400' : 'text-green-400'}`}>{tx.tipo}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Paginación */}
            <div className="flex justify-end items-center gap-2 mt-4">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded bg-[#202C33] text-gray-300 hover:bg-[#25D366]/20 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                Anterior
              </button>
              <span className="text-gray-400 text-sm">
                Página {currentPage} de {totalPages}
              </span>
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="px-3 py-1 rounded bg-[#202C33] text-gray-300 hover:bg-[#25D366]/20 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                Siguiente
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};