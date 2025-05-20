export const Soporte = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-[#25D366]">Soporte</h2>
      <div className="grid grid-cols-1 gap-6">
        <div className="bg-[#111B21] p-4 sm:p-6 rounded-lg border border-[#222E35]">
          <h3 className="text-lg font-semibold text-gray-200 mb-4">Contacto</h3>
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-3">
              <span className="text-gray-400">Email:</span>
              <a href="mailto:juandaviderazo2401@gmail.com" className="text-[#25D366] hover:underline break-all">
                juandaviderazo2401@gmail.com
              </a>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-3">
              <span className="text-gray-400">WhatsApp:</span>
              <a href="https://wa.me/573153250375" className="text-[#25D366] hover:underline break-all">
                +57 3153250375
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};