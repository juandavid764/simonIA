import { useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import { updateUser } from "../../supabase/user";
import { updateConfigByUserId } from "../../supabase/config";

export const Configuracion = () => {
  const { user } = useAuth();
  const [notificaciones, setNotificaciones] = useState(true);

  const [userData, setUserData] = useState({
    nombre: user.nombre,
    telefono: user.telefono,
    contrasena: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleToggleNotificaciones = () => {
    setNotificaciones((prev) => !prev);
    // Aquí podrías guardar la preferencia en backend o localStorage si lo deseas
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validar formato del teléfono
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(userData.telefono)) {
      alert("Por favor, ingresa un número de teléfono válido de 10 dígitos.");
      return;
    }

    let userUpdateOk = true;
    let configUpdateOk = true;
    let userError = null;
    let configError = null;

    // Actualizar datos de usuario
    try {
      await updateUser(user.id, {
        telefono: userData.telefono,
        nombre: userData.nombre,
        contrasena: userData.contrasena,
      });
    } catch (err) {
      userUpdateOk = false;
      userError = err?.message || err;
    }

    // Actualizar preferencia de notificaciones
    try {
      await updateConfigByUserId(user.id, {
        recordatorio: notificaciones,
      });
    } catch (err) {
      configUpdateOk = false;
      configError = err?.message || err;
    }

    if (userUpdateOk && configUpdateOk) {
      alert("Datos y preferencias actualizados exitosamente.");
    } else if (!userUpdateOk && !configUpdateOk) {
      alert("Error al actualizar los datos y preferencias. Por favor, intenta nuevamente.\n" + userError + "\n" + configError);
    } else if (!userUpdateOk) {
      alert("Error al actualizar los datos del usuario. Por favor, intenta nuevamente.\n" + userError);
    } else if (!configUpdateOk) {
      alert("Error al actualizar las preferencias. Por favor, intenta nuevamente.\n" + configError);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-[#25D366]">Configuración</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#111B21] p-4 sm:p-6 rounded-lg border border-[#222E35]">
          <h3 className="text-lg font-semibold text-gray-200 mb-4">
            Preferencias del Bot
          </h3>
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-gray-400">Notificaciones</span>
                <p className="text-xs text-gray-500 mt-1">
                  Recordatorio que se envia cuando han pasado 48 horas sin
                  realizar una transacción.
                </p>
              </div>
              <button
                className={`w-12 h-6 rounded-full relative transition-colors duration-200 ${
                  notificaciones ? "bg-[#25D366]" : "bg-gray-500"
                }`}
                onClick={handleToggleNotificaciones}
                aria-pressed={notificaciones}
                aria-label="Activar o desactivar notificaciones"
                type="button"
              >
                <span
                  className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all duration-200 ${
                    notificaciones ? "left-7" : "left-1"
                  }`}
                ></span>
              </button>
            </div>
          </div>
        </div>
        {/* Nueva sección para cambiar datos de usuario */}
        <div className="bg-[#111B21] p-4 sm:p-6 rounded-lg border border-[#222E35]">
          <h3 className="text-lg font-semibold text-gray-200 mb-4">
            Cambiar datos de usuario
          </h3>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-[#E9EDEF] mb-1">
                Nombre
              </label>
              <input
                type="text"
                name="nombre"
                value={userData.nombre}
                onChange={handleInputChange}
                placeholder="Nuevo nombre"
                className="w-full rounded-md border-0 px-3.5 py-2 text-[#E9EDEF] shadow-sm ring-1 ring-inset ring-[#2A3942] bg-[#2A3942] placeholder:text-[#8696A0] focus:ring-2 focus:ring-inset focus:ring-[#00A884] sm:text-sm sm:leading-6"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#E9EDEF] mb-1">
                Teléfono
              </label>
              <input
                type="tel"
                name="telefono"
                value={userData.telefono}
                onChange={handleInputChange}
                placeholder="Nuevo número de WhatsApp"
                className="w-full rounded-md border-0 px-3.5 py-2 text-[#E9EDEF] shadow-sm ring-1 ring-inset ring-[#2A3942] bg-[#2A3942] placeholder:text-[#8696A0] focus:ring-2 focus:ring-inset focus:ring-[#00A884] sm:text-sm sm:leading-6"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#E9EDEF] mb-1">
                Contraseña
              </label>
              <input
                type="password"
                name="contrasena"
                value={userData.contrasena}
                onChange={handleInputChange}
                placeholder="Nueva contraseña"
                className="w-full rounded-md border-0 px-3.5 py-2 text-[#E9EDEF] shadow-sm ring-1 ring-inset ring-[#2A3942] bg-[#2A3942] placeholder:text-[#8696A0] focus:ring-2 focus:ring-inset focus:ring-[#00A884] sm:text-sm sm:leading-6"
              />
            </div>
            <button
              type="submit"
              className="w-full px-4 sm:px-6 py-2 sm:py-3 rounded-lg bg-[#00A884] text-white hover:bg-[#008F6F] font-bold text-base transition-colors duration-200 mt-2"
            >
              Guardar cambios
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
