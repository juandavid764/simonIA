import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { insertUser } from "../supabase/fuctions.js";
import logo from "../assets/logo_simonIA.jpg";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
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
              <button
                type="submit"
                className="w-full px-6 py-3 rounded-lg bg-[#00A884] text-white hover:bg-[#008F6F] focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#00A884] transition-colors duration-200"
              >
                <div className="flex items-center justify-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  Comenzar ahora
                </div>
              </button>
            </div>
          </motion.form>
        </div>
      </div>
    </div>
  );
}
