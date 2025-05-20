export const Estadisticas = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-[#25D366]">Estadísticas</h2>
      <div className="grid grid-cols-1 gap-6">
        <div className="bg-[#111B21] p-4 sm:p-6 rounded-lg border border-[#222E35] flex flex-col items-center justify-center min-h-[200px]">
          <span className="text-3xl font-bold text-[#25D366] mb-2">🚧</span>
          <h3 className="text-xl font-semibold text-gray-200 mb-2 text-center">
            ¡Próximamente!
          </h3>
          <p className="text-gray-400 text-center text-sm sm:text-base">
            Muy pronto podrás ver tus estadísticas avanzadas y reportes personalizados aquí.
          </p>
        </div>
      </div>
    </div>
  );
};
