import { Link } from "react-router-dom";

export const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-8">
      <h1 className="text-6xl font-bold text-simon-green mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-2">Página no encontrada</h2>
      <p className="mb-6 text-center max-w-md">
        Lo sentimos, la página que buscas no existe o no tienes acceso a ella.<br/>
        Si necesitas ayuda con SimonIA, tu chatbot financiero para WhatsApp, vuelve al inicio.
      </p>
      <Link
        to="/"
        className="px-6 py-3 rounded-full bg-[#25D366] text-white font-bold shadow-md hover:bg-[#128C7E] transition-colors duration-200 text-base flex items-center gap-2"
        style={{ boxShadow: '0 2px 8px 0 rgba(37,211,102,0.15)' }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487a9.38 9.38 0 0 0-4.862-1.337C7.114 3.15 3.15 7.114 3.15 12c0 1.61.405 3.13 1.12 4.45L3 21l4.66-1.22A8.96 8.96 0 0 0 12 20.85c4.886 0 8.85-3.964 8.85-8.85 0-2.13-.747-4.09-2.001-5.613" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.5 11.5a3.5 3.5 0 1 0 7 0 3.5 3.5 0 0 0-7 0Z" />
        </svg>
        Volver al inicio
      </Link>
    </div>
  );
};
