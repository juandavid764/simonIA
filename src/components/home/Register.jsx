import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { insertUser } from "../../supabase/user.js";
import logo from "../../assets/logo_estred.png";
import { RegisterForm } from "../AuthPage/RegisterForm.jsx";

export const Register = () => {
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

  return (
    <div
      id="register"
      className="min-h-screen"
      style={{ backgroundColor: "#1A202C" }} // Fondo igual a los demás componentes
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 ">
        <div className="mx-auto max-w-2xl lg:text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center"
          >
            <img
              src={logo}
              alt="SimonIA Logo"
              className="w-24 h-24 rounded-full mb-4"
            />
            <h2
              style={{
                fontSize: "1.125rem",
                fontWeight: "600",
                color: "#00A884", // WhatsApp green
              }}
            >
              Comienza Ahora
            </h2>
            <p
              style={{
                marginTop: "0.5rem",
                fontSize: "1.875rem",
                fontWeight: "bold",
                color: "#E9EDEF", // WhatsApp light text
              }}
            >
              Únete a SimonIA
            </p>
            <p
              style={{
                marginTop: "1.5rem",
                fontSize: "1.125rem",
                color: "#8696A0", // WhatsApp secondary text
              }}
            >
              Regístrate para comenzar a usar SimonIA y transforma la manera en
              que gestionas tus finanzas.
            </p>
          </motion.div>
        </div>

      </div>
        <RegisterForm/>
    </div>
  );
};
