import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { insertUser } from "../../supabase/user.js";
import logo from "../../assets/logo_estred.png";

export const RegisterForm = ({ cambiarModo, isAuthPage = false }) => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    contrasena: "",
  });

  // Add the logo to the document head for the favicon
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "icon";
    link.href = logo;
    document.head.appendChild(link);

    return () => {
      document.head.removeChild(link);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate phone number format
    const phoneRegex = /^\d{10}$/; // Colombian phone numbers should have 10 digits
    if (!phoneRegex.test(formData.phone)) {
      alert("Por favor, ingresa un número de teléfono válido de 10 dígitos.");
      return;
    }

    // Insert user data into Supabase
    const response = await insertUser({
      telefono: `57${formData.phone}`,
      nombre: formData.name,
      contrasena: formData.contrasena,
    });

    // Check if the user is on the home page
    if (response && isAuthPage) {
      alert("Registro exitoso. Te redirigiendo a WhatsApp...");
      // Show success message or redirect
      let textWpp = `Hola, soy me acabo de registrar en SimonIA.`;

      let cellphone = "573507689818"; // replace with the actual phone number

      // encoding the message text to be sent
      const textoCodificado = encodeURIComponent(textWpp);

      // creating the link
      const link = `https://wa.me/${cellphone}?text=${textoCodificado}`;

      // Redirect to WhatsApp
      window.location.href = link;
    } else if (response) {
      alert("Registro exitoso. Inicia sesión para continuar.");
    } else {
      alert("Error al registrar. Por favor, intenta nuevamente.");
      return;
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div
      id="register"
      className="min-h-screen"
      style={{ backgroundColor: "[#1A202C]" }} // Fondo igual a los demás componentes
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mt-16 max-w-xl">
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            onSubmit={handleSubmit}
            className="space-y-6 rounded-2xl bg-[#202C33] p-8 shadow-lg" // WhatsApp chat background
          >
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium leading-6 text-[#E9EDEF]"
              >
                Nombre
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="block w-full rounded-md border-0 px-3.5 py-2 text-[#E9EDEF] shadow-sm ring-1 ring-inset ring-[#2A3942] placeholder:text-[#8696A0] focus:ring-2 focus:ring-inset focus:ring-[#00A884] bg-[#2A3942] sm:text-sm sm:leading-6"
                  placeholder="Tu nombre"
                />
              </div>
            </div>

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
                  className="block w-full rounded-md border-0 px-3.5 py-2 text-[#E9EDEF] shadow-sm ring-1 ring-inset ring-[#2A3942] placeholder:text-[#8696A0] focus:ring-2 focus:ring-inset focus:ring-[#00A884] bg-[#2A3942] sm:text-sm sm:leading-6"
                  placeholder="Tu contraseña"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full px-6 py-3 rounded-lg bg-[#00A884] text-white hover:bg-[#008F6F] focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#00A884] transition-colors duration-200"
              >
                <div className="flex items-center justify-center gap-2 font-bold">
                  {isAuthPage ? "Regístrate" : "Comenzar ahora"}
                </div>
              </button>
              {isAuthPage && (
                <div className="mt-4 text-center text-sm text-[#8696A0]">
                  Ya tienes cuenta?{" "}
                  <button
                    className="text-[#00A884] underline"
                    id="registro"
                    onClick={cambiarModo}
                  >
                    Iniciar sesión
                  </button>
                </div>
              )}
            </div>
          </motion.form>
        </div>
      </div>
    </div>
  );
};
