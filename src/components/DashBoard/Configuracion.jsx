import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import { updateUser } from "../../supabase/user";
import { updateConfigByUserId, getConfigByUserId } from "../../supabase/config";

export const Configuracion = () => {
  const { user, setUser } = useAuth();
  let initialConfig;
  const rawPhone = user?.telefono || "";
  const [configForm, setConfigForm] = useState(false);
  const [userDataForm, setUserDataForm] = useState({
    nombre: user?.nombre || "",
    telefono: rawPhone.startsWith("57") ? rawPhone.slice(2) : rawPhone,
    contrasena: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserDataForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleToggleNotificaciones = () => {
    setConfigForm((prev) => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validar formato del teléfono
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(userDataForm.telefono)) {
      alert("Por favor, ingresa un número de teléfono válido de 10 dígitos.");
      return;
    }

    // Variables para manejar el estado de las actualizaciones
    let userUpdateOk = true;
    let configUpdateOk = true;
    let userError = null;
    let configError = null; // Actualizar datos de usuario
    const dataUserUpdate = {
      telefono: `57${userDataForm.telefono}`,
      nombre: userDataForm.nombre,
    };

    if (userDataForm.contrasena !== "") {
      dataUserUpdate.contrasena = userDataForm.contrasena;
    }

    try {
      const updatedUser = await updateUser(user.id, dataUserUpdate);
      if (updatedUser) {
        setUser((prev) => ({
          ...prev,
          ...updatedUser,
        }));
      }

    } catch (err) {
      userUpdateOk = false;
      userError = err?.message || err;
    }

    if (initialConfig && initialConfig.recordatorio === configForm) {
      // Si la configuración no ha cambiado, no actualizamos
    } else {
      // Actualizar preferencia de notificaciones
      try {
        await updateConfigByUserId(user.id, {
          recordatorio: configForm,
        });
      } catch (err) {
        configUpdateOk = false;
        configError = err?.message || err;
      }
    }

    if (userUpdateOk && configUpdateOk) {
      alert("Datos y preferencias actualizados exitosamente.");
    } else if (!userUpdateOk && !configUpdateOk) {
      alert(
        "Error al actualizar los datos y preferencias. Por favor, intenta nuevamente.\n" +
          userError +
          "\n" +
          configError
      );
    } else if (!userUpdateOk) {
      alert(
        "Error al actualizar los datos del usuario. Por favor, intenta nuevamente.\n" +
          userError
      );
    } else if (!configUpdateOk) {
      alert(
        "Error al actualizar las preferencias. Por favor, intenta nuevamente.\n" +
          configError
      );
    }
  };

  // Cargar configuración al montar el componente
  useEffect(() => {
    if (!user?.id) return;

    const fetchConfig = async () => {
      try {
        const config = await getConfigByUserId(user.id);
        if (config) {
          setConfigForm(config.recordatorio);
          initialConfig = config.recordatorio;
        }
      } catch (error) {
        console.error("Error al obtener la configuración:", error);
      }
    };

    fetchConfig();
  }, [user?.id]);

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
                  configForm ? "bg-[#25D366]" : "bg-gray-500"
                }`}
                onClick={handleToggleNotificaciones}
                aria-pressed={configForm}
                aria-label="Activar o desactivar notificaciones"
                type="button"
              >
                <span
                  className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all duration-200 ${
                    configForm ? "left-7" : "left-1"
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
                value={userDataForm.nombre}
                onChange={handleInputChange}
                placeholder="Nuevo nombre"
                className="w-full rounded-md border-0 px-3.5 py-2 text-[#E9EDEF] shadow-sm ring-1 ring-inset ring-[#2A3942] bg-[#2A3942] placeholder:text-[#8696A0] focus:ring-2 focus:ring-inset focus:ring-[#00A884] sm:text-sm sm:leading-6"
              />
            </div>{" "}
            <div>
              <label className="block text-sm font-medium text-[#E9EDEF] mb-1">
                Teléfono
              </label>
              <div className="flex items-center">
                <span className="h-10 inline-flex items-center px-3 rounded-l-md border-0 font-bold bg-[#2A3942] text-[#8696A0] sm:text-sm">
                  +57
                </span>
                <input
                  type="tel"
                  name="telefono"
                  value={userDataForm.telefono}
                  onChange={handleInputChange}
                  placeholder="350 768 9818"
                  className="w-full rounded-r-md border-0 px-3.5 py-2 text-[#E9EDEF] shadow-sm ring-1 ring-inset ring-[#2A3942] bg-[#2A3942] placeholder:text-[#8696A0] focus:ring-2 focus:ring-inset focus:ring-[#00A884] sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#E9EDEF] mb-1">
                Contraseña
              </label>
              <input
                type="password"
                name="contrasena"
                value={userDataForm.contrasena}
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
