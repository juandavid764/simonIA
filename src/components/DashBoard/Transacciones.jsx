import { useEffect, useState, useCallback, use } from "react";
import {
  getTransactions,
  updateTransaction,
  deleteTransaction,
} from "../../supabase/transactions";

import { useAuth } from "../../context/AuthContext.jsx";
import { useSubscribeToTransacciones } from "../../Hooks/Subcriptions.jsx";

import { currentMonth, currentYear, nombreMes } from "../../utils/timeData.js";

export const Transacciones = () => {
  const { user } = useAuth();

  const [ingresos, setIngresos] = useState([]);
  const [gastos, setGastos] = useState([]);
  const [totalIngresos, setTotalIngresos] = useState(0);
  const [totalGastos, setTotalGastos] = useState(0);
  const [balance, setBalance] = useState(0);

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [reload, setReload] = useState(false);
  const [editForm, setEditForm] = useState({
    descripcion: "",
    monto: "",
    fecha: "",
    category: "",
    tipo: "gasto",
  });

  // Función para recargar los datos
  const reloadData = useCallback(() => {
    setReload((prev) => !prev);
  }, []);

  // Suscribirse a las transacciones en tiempo real
  useSubscribeToTransacciones(reloadData, user?.id);

  // Efecto para obtener transacciones al cargar el componente
  useEffect(() => {
    if (!user?.id) return;
    setLoading(true);
    getTransactions(user.id)
      .then((data) => {
        setTransactions(data || []);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching transactions:", error);
        setLoading(false);
      });
  }, [user?.id, reload]);  // calcular ingresos y gastos cada vez que cambian las transacciones
  useEffect(() => {
    const ingresosTemp = transactions.filter((tx) => {
    return tx.tipo === "ingreso" &&
           tx.fecha &&
           new Date(tx.fecha).getUTCMonth() + 1 === currentMonth &&
           new Date(tx.fecha).getUTCFullYear() === currentYear;
  });

  const gastosTemp = transactions.filter((tx) => {
    return tx.tipo === "gasto" &&
           tx.fecha &&
           new Date(tx.fecha).getUTCMonth() + 1 === currentMonth &&
           new Date(tx.fecha).getUTCFullYear() === currentYear;
  });

    setIngresos(ingresosTemp);
    setGastos(gastosTemp);
  }, [transactions]);

  // Calculamos el totales cada vez que cambian ingresos o gastos
  useEffect(() => {
    setTotalIngresos(
      ingresos.reduce((acc, tx) => acc + (Number(tx.monto) || 0), 0)
    );

    setTotalGastos(
      gastos.reduce((acc, tx) => acc + (Number(tx.monto) || 0), 0)
    );
  }, [ingresos, gastos]);

  // Calculamos el balance cada vez que cambian los totales
  useEffect(() => {
    setBalance(totalIngresos - totalGastos);
  }, [totalIngresos, totalGastos]);

  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 8;
  const totalPages = Math.ceil(transactions.length / rowsPerPage);
  const paginatedTransactions = transactions.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );
  const handlePrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  // Funciones para edición de transacciones
  const handleEditTransaction = (transaction) => {
    setEditingTransaction(transaction);
    setEditForm({
      descripcion: transaction.descripcion,
      monto: transaction.monto.toString(),
      fecha: transaction.fecha,
      category: transaction.category || "",
      tipo: transaction.tipo,
    });
  };

  const handleCancelEdit = () => {
    setEditingTransaction(null);
    setEditForm({
      descripcion: "",
      monto: "",
      fecha: "",
      category: "",
      tipo: "gasto",
    });
  };

  const handleUpdateTransaction = async (e) => {
    e.preventDefault();
    try {
      await updateTransaction(editingTransaction.id, {
        descripcion: editForm.descripcion,
        monto: parseFloat(editForm.monto),
        fecha: editForm.fecha,
        category: editForm.category,
        tipo: editForm.tipo,
      });
      // No necesitamos actualizar el estado local manualmente
      // La suscripción en tiempo real se encargará de esto
      handleCancelEdit();
    } catch (error) {
      console.error("Error updating transaction:", error);
      alert("Error al actualizar la transacción");
    }
  };

  const handleDeleteTransaction = async (id) => {
    if (
      window.confirm("¿Estás seguro de que quieres eliminar esta transacción?")
    ) {
      try {
        await deleteTransaction(id);
        // No necesitamos actualizar el estado local manualmente
        // La suscripción en tiempo real se encargará de esto
      } catch (error) {
        console.error("Error deleting transaction:", error);
        alert("Error al eliminar la transacción");
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <h2 className="text-2xl font-bold text-[#25D366]">Transacciones</h2>{" "}
        <button
          onClick={reloadData}
          className="flex items-center justify-center p-2 rounded-full bg-[#222E35] hover:bg-[#25D366]/20 text-[#25D366] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#25D366] hover:scale-105 active:scale-95"
          title="Refrescar transacciones"
          aria-label="Refrescar"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 transition-transform duration-300 hover:rotate-180"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
        </button>
      </div>
      <div className="bg-[#111B21] p-6 rounded-lg border border-[#222E35] overflow-x-auto mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
          <div className="flex flex-col md:flex-row md:items-center gap-2">
            <span className="text-gray-400 font-semibold">
              Balance general de {nombreMes}:
            </span>
            <span
              className={`text-2xl font-bold ${
                balance >= 0 ? "text-green-400" : "text-red-400"
              }`}
            >
              {balance >= 0 ? "+" : ""}${balance.toLocaleString("es-CO")}
            </span>
          </div>
          <div className="flex gap-6">
            <span className="text-sm text-green-400 font-semibold">
              Ingresos: ${totalIngresos.toLocaleString("es-CO")}
            </span>
            <span className="text-sm text-red-400 font-semibold">
              Gastos: ${totalGastos.toLocaleString("es-CO")}
            </span>
          </div>
        </div>
      </div>
      <div className="bg-[#111B21] p-6 rounded-lg border border-[#222E35] overflow-x-auto">
        <h3 className="text-lg font-semibold text-gray-200 mb-4">
          Transacciones Recientes
        </h3>
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
                    <th className="py-2 px-2 sm:px-3 font-bold uppercase tracking-wide text-xs md:text-sm whitespace-nowrap">
                      Descripción
                    </th>
                    <th className="py-2 px-2 sm:px-3 font-bold uppercase tracking-wide text-xs md:text-sm whitespace-nowrap">
                      Monto
                    </th>
                    <th className="py-2 px-2 sm:px-3 font-bold uppercase tracking-wide text-xs md:text-sm whitespace-nowrap">
                      Fecha
                    </th>
                    <th className="py-2 px-2 sm:px-3 font-bold uppercase tracking-wide text-xs md:text-sm whitespace-nowrap">
                      Categoría
                    </th>
                    <th className="py-2 px-2 sm:px-3 font-bold uppercase tracking-wide text-xs md:text-sm whitespace-nowrap">
                      Tipo
                    </th>
                    <th className="py-2 px-2 sm:px-3 font-bold uppercase tracking-wide text-xs md:text-sm whitespace-nowrap">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedTransactions.map((tx) => (
                    <tr
                      key={tx.id}
                      className={`border-b border-[#222E35] hover:bg-[#202C33] transition ${
                        tx.tipo === "gasto"
                          ? "bg-red-950/40"
                          : "bg-green-950/40"
                      }`}
                    >
                      {""}
                      <td className="py-2 px-2 sm:px-3 text-gray-300 text-xs md:text-sm">
                        {tx.descripcion}
                      </td>
                      <td
                        className={`py-2 px-2 sm:px-3 text-gray-100 font-bold text-xs md:text-sm whitespace-nowrap`}
                      >
                        ${tx.monto.toLocaleString("es-CO")}
                      </td>
                      <td className="py-2 px-2 sm:px-3 text-gray-300 text-xs md:text-sm whitespace-nowrap">
                        {tx.fecha}
                      </td>
                      <td className="py-2 px-2 sm:px-3 text-gray-300 text-xs md:text-sm whitespace-nowrap">
                        {tx.category || "-"}
                      </td>
                      <td
                        className={`py-2 px-2 sm:px-3 font-bold text-xs md:text-sm whitespace-nowrap ${
                          tx.tipo === "gasto"
                            ? "text-red-400"
                            : "text-green-400"
                        }`}
                      >
                        {tx.tipo}
                      </td>{" "}
                      <td className="py-2 px-2 sm:px-3 text-xs md:text-sm whitespace-nowrap">
                        {" "}
                        <div className="flex gap-1.5 justify-center items-center">
                          <button
                            onClick={() => handleEditTransaction(tx)}
                            className="group flex items-center justify-center w-8 h-8 bg-[#222E35] text-gray-400 rounded-lg hover:bg-[#2A3F47] hover:text-blue-300 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 transform hover:scale-105 active:scale-95"
                            title="Editar transacción"
                            aria-label="Editar"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={2}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                              />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDeleteTransaction(tx.id)}
                            className="group flex items-center justify-center w-8 h-8 bg-[#222E35] text-gray-400 rounded-lg hover:bg-[#2A3F47] hover:text-red-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50 transform hover:scale-105 active:scale-95"
                            title="Eliminar transacción"
                            aria-label="Eliminar"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={2}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        </div>
                      </td>
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
            </div>{" "}
          </div>
        )}
      </div>

      {/* Modal de edición */}
      {editingTransaction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#111B21] p-6 rounded-lg border border-[#222E35] w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-200 mb-4">
              Editar Transacción
            </h3>
            <form onSubmit={handleUpdateTransaction} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Descripción
                </label>
                <input
                  type="text"
                  value={editForm.descripcion}
                  onChange={(e) =>
                    setEditForm({ ...editForm, descripcion: e.target.value })
                  }
                  className="w-full p-2 rounded border border-[#222E35] bg-[#1A232A] text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#25D366]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Monto
                </label>
                <input
                  type="number"
                  value={editForm.monto}
                  onChange={(e) =>
                    setEditForm({ ...editForm, monto: e.target.value })
                  }
                  className="w-full p-2 rounded border border-[#222E35] bg-[#1A232A] text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#25D366]"
                  required
                  step="0.01"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Fecha
                </label>
                <input
                  type="date"
                  value={editForm.fecha}
                  onChange={(e) =>
                    setEditForm({ ...editForm, fecha: e.target.value })
                  }
                  className="w-full p-2 rounded border border-[#222E35] bg-[#1A232A] text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#25D366]"
                  required
                />
              </div>{" "}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Categoría
                </label>
                <select
                  value={editForm.category}
                  onChange={(e) =>
                    setEditForm({ ...editForm, category: e.target.value })
                  }
                  className="w-full p-2 rounded border border-[#222E35] bg-[#1A232A] text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#25D366]"
                >
                  <option value="">Seleccionar categoría</option>
                  <option value="Comida">Comida</option>
                  <option value="Transporte">Transporte</option>
                  <option value="Vivienda">Vivienda</option>
                  <option value="Servicios">Servicios</option>
                  <option value="Ocio">Ocio</option>
                  <option value="Salud">Salud</option>
                  <option value="Educación">Educación</option>
                  <option value="Compras">Compras</option>
                  <option value="Otros">Otros</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Tipo
                </label>
                <select
                  value={editForm.tipo}
                  onChange={(e) =>
                    setEditForm({ ...editForm, tipo: e.target.value })
                  }
                  className="w-full p-2 rounded border border-[#222E35] bg-[#1A232A] text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#25D366]"
                  required
                >
                  <option value="gasto">Gasto</option>
                  <option value="ingreso">Ingreso</option>
                </select>
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-[#25D366] text-[#111B21] font-semibold rounded hover:bg-[#1DA851] transition-colors"
                >
                  Actualizar
                </button>
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="flex-1 px-4 py-2 bg-gray-600 text-white font-semibold rounded hover:bg-gray-700 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
