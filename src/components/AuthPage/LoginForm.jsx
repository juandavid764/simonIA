import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import { validarUsuario } from "../../supabase/user.js";
import { useAuth } from "../../context/AuthContext.jsx";

export const LoginForm = ({ cambiarModo }) => {
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const [mensaje, setMensaje] = useState("");

  const [formData, setFormData] = useState({
    phone: "",
    contrasena: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const phoneRegex = /^\d{10}$/; //should have 10 digits
    if (!phoneRegex.test(formData.phone)) {
      alert("Por favor, ingresa un número de teléfono válido de 10 dígitos.");
      return;
    }

    const data = await validarUsuario(
      `57${formData.phone}`,
      formData.contrasena
    );

    if (!data) {
      setMensaje("❌ Usuario o contraseña incorrectos");
      return;
    }

    signIn(data);

    navigate("/Dashboard");
  };

  const handleChange = (e) => {
    setMensaje("");
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[##1A202C]">
      <div className="flex flex-col md:flex-row items-center justify-center w-full max-w-5xl gap-12">
        {/* Lado izquierdo: branding y mensaje */}
        <div className="hidden md:flex flex-col items-start justify-center flex-1 pl-8">
          <h1
            className="text-5xl md:text-6xl font-bold text-[#00A884] mb-4 select-none"
            style={{ fontFamily: "Montserrat, Arial, sans-serif" }}
          >
            SimonIA
          </h1>
          <p className="text-2xl text-gray-100 font-light max-w-md mb-2">
            SimonIA te ayuda a automatizar tus finanzas y comunicarte con tu
            asesor financiero por WhatsApp.
          </p>
          <p className="text-lg text-gray-400 font-light max-w-md">
            Gestiona tu dinero, recibe recomendaciones y resuelve tus dudas en
            tiempo real.
          </p>
        </div>
        {/* Lado derecho: formulario login */}
        <div className="flex-1 flex flex-col items-center justify-center w-full">
          <motion.form
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            onSubmit={handleSubmit}
            className="w-full max-w-md bg-[#202C33] rounded-2xl shadow-xl p-8 space-y-6 border border-[#222D34]"
          >
            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium leading-6 text-[#E9EDEF]"
              >
                Número de WhatsApp
              </label>
              <div className="mt-2 flex items-center">
                <span className="h-10 inline-flex items-center px-3 rounded-l-md border-0 font-bold bg-[#2A3942] text-[#8696A0] sm:text-sm">
                  +57
                </span>
                <div className="mt-2 w-full">
                  <input
                    type="tel"
                    name="phone"
                    id="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    placeholder="350 768 9818"
                    className="block w-full rounded-r-md border-0 px-3.5 py-2 text-[#E9EDEF] shadow-sm ring-1 ring-inset ring-[#2A3942] placeholder:text-[#8696A0] focus:ring-2 focus:ring-inset focus:ring-[#00A884] bg-[#2A3942] sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="contrasena"
                  className="block text-sm font-medium leading-6 text-[#E9EDEF]"
                >
                  Contraseña
                </label>
                <div className="mt-2">
                  <input
                    type="password"
                    name="contrasena"
                    id="contrasena"
                    value={formData.contrasena}
                    onChange={handleChange}
                    required
                    placeholder="Tu contraseña"
                    className="block w-full rounded-md border border-[#2A3942] px-4 py-3 text-[#E9EDEF] shadow-sm placeholder-[#8696A0] focus:ring-2 focus:ring-[#00A884] focus:border-[#00A884] bg-[#2A3942] text-base"
                  />
                </div>
              </div>
            </div>
            <button
              type="submit"
              className="w-full px-6 py-3 rounded-lg bg-[#00A884] text-white hover:bg-[#008F6F] font-bold text-lg transition-colors duration-200 mt-2"
            >
              Iniciar sesión
            </button>
            {mensaje && (
              <div className="text-center text-sm font-medium mb-4 text-red-500">
                {mensaje}
              </div>
            )}
            <div className="text-center mt-2 text-[#8696A0]">
              ¿No tienes cuenta?{" "}
              <button
                type="button"
                className="text-[#00A884] hover:underline text-sm font-medium"
                onClick={cambiarModo}
              >
                Regístrate
              </button>
            </div>
          </motion.form>
        </div>
      </div>
    </div>
  );
};
