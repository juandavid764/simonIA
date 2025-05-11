import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { insertUser } from "../supabase/fuctions.js";
import logo from "../assets/logo_simonIA.jpg";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
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

    // Show success message or redirect
    let textWpp = `Hola, soy me acabo de registrar en SimonIA.`;

    let cellphone = "573507689818"; // replace with the actual phone number

    // encoding the message text to be sent
    const textoCodificado = encodeURIComponent(textWpp);

    // creating the link
    const link = `https://wa.me/${cellphone}?text=${textoCodificado}`;

    // Insert user data into Supabase
    const response = await insertUser({
      telefono: `57${formData.phone}`,
      nombre: formData.name,
      email: formData.email,
    });

    if (response) {
      alert("Registro exitoso. Te redirigiendo a WhatsApp...");
    } else {
      alert("Error al registrar. Por favor, intenta nuevamente.");
      return;
    }

    window.location.href = link;
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
      className="py-16 md:py-24"
      style={{ backgroundColor: "#1A202C" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2
              style={{
                fontSize: "1.125rem",
                fontWeight: "600",
                color: "#F6E05E",
              }}
            >
              Comienza Ahora
            </h2>
            <p
              style={{
                marginTop: "0.5rem",
                fontSize: "1.875rem",
                fontWeight: "bold",
                color: "#F7FAFC",
              }}
            >
              Únete a SimonIA
            </p>
            <p
              style={{
                marginTop: "1.5rem",
                fontSize: "1.125rem",
                color: "#A0AEC0",
              }}
            >
              Regístrate para comenzar a usar SimonIA y transforma la manera en
              que gestionas tus finanzas.
            </p>
          </motion.div>
        </div>

        <div className="mx-auto mt-16 max-w-xl">
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            onSubmit={handleSubmit}
            className="space-y-6 rounded-2xl bg-gray-900 p-8 shadow-lg ring-1 ring-simon-green/20"
          >
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium leading-6 text-gray-200"
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
                  className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-200 shadow-sm ring-1 ring-inset ring-simon-green/40 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-simon-gold bg-gray-800 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-gray-200"
              >
                Correo electrónico
              </label>
              <div className="mt-2">
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-200 shadow-sm ring-1 ring-inset ring-simon-green/40 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-simon-gold bg-gray-800 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium leading-6 text-gray-200"
              >
                Número de WhatsApp
              </label>
              <div className="mt-2 flex items-center">
                <span className="inline-flex items-center px-3 rounded-l-md border-0 bg-gray-800 text-gray-400 sm:text-sm">
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
                  className="block w-full rounded-r-md border-0 px-3.5 py-2 text-gray-200 shadow-sm ring-1 ring-inset ring-simon-green/40 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-simon-gold bg-gray-800 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full px-6 py-3 rounded-lg bg-yellow-500 text-gray-900 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-yellow-500"
              >
                Comenzar ahora
              </button>
            </div>
          </motion.form>
        </div>
      </div>
    </div>
  );
}
