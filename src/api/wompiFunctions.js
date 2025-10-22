//IMPORT llave publica
const publicKey = import.meta.env.VITE_WOMPI_PUBLIC_KEY;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const wompiApiUrl = import.meta.env.VITE_WOMPI_API_URL;

//Con esta funcion obtenemos la informacion del merchant para mostrar en el modal de pago y que el cliente pueda usar los checkboxes para aceptar los terminos y condiciones y la política de tratamiento de datos personales
export async function getMerchant() {
  try {
    const response = await fetch(`${wompiApiUrl}/merchants/${publicKey}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Error en la petición: ${response.status}`);
    }

    const data = await response.json();
    console.log("Merchant data:", data);
    return data;
  } catch (error) {
    console.error("Error al obtener merchant:", error);
    throw error;
  }
}

//Con esta función tokenizamos la tarjeta
export async function tokenizeCard(cardData) {
  try {
    // Formatear exp_month por el htpa error
    const expMonth = cardData.exp_month.toString().padStart(2, "0");

    const response = await fetch(`${wompiApiUrl}/tokens/cards`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${publicKey}`,
      },
      body: JSON.stringify({
        number: cardData.number,
        exp_month: expMonth,
        exp_year: cardData.exp_year,
        cvc: cardData.cvc,
        card_holder: cardData.card_holder,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.log("Error en la tokenización:", errorData);
      throw new Error(
        errorData.error?.reason ||
          `Error en la tokenización: ${response.status}`
      );
    }

    const data = await response.json();
    console.log("Token de tarjeta generado:", data);
    return data;
  } catch (error) {
    console.error("Error al tokenizar tarjeta:", error);
    throw error;
  }
}

//Con esta función tokenizamos el nequi para obtener el token del numerito
export async function tokenizeNequi(phoneNumber) {
  try {
    const response = await fetch(`${wompiApiUrl}/tokens/nequi`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${publicKey}`,
      },
      body: JSON.stringify({
        phone_number: phoneNumber,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.error?.reason ||
          `Error en la tokenización: ${response.status}`
      );
    }

    const data = await response.json();
    console.log("Token de Nequi generado:", data);
    return data;
  } catch (error) {
    console.error("Error al tokenizar Nequi:", error);
    throw error;
  }
}

//Función para verificar el estado del token de Nequi
export async function verifyNequiSubscription(token) {
  try {
    const response = await fetch(`${wompiApiUrl}/tokens/nequi/${token}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${publicKey}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error en la verificación:", errorData);
      throw new Error(
        errorData.error?.reason ||
          `Error en la verificación: ${response.status}`
      );
    }

    const nequiData = await response.json();
    console.log("Estado del token de Nequi:", nequiData);

    // Verificar si el estado es APPROVED
    return nequiData.data.status === "APPROVED";
  } catch (error) {
    console.error("Error al verificar Nequi:", error);
    throw error;
  }
}

export async function createPaymentSource({
  userId,
  token,
  type,
  email,
  acceptance_token,
  accept_personal_auth,
}) {
  try {
    const functionUrl = `https://zqgzynkpxgtaipmmmrwz.supabase.co/functions/v1/createPaymentSource`;

    const res = await fetch(functionUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${supabaseAnonKey}`,
      },
      body: JSON.stringify({
        user_id: userId,
        token,
        type,
        email,
        acceptance_token,
        accept_personal_auth,
      }),
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.error || "Error creando método de pago");

    console.log("Payment source creado:", data.paymentSource);
    return data.paymentSource;
  } catch (err) {
    console.error("Error creando fuente de pago:", err);
    throw err;
  }
}

export async function createSubscription({
  user_id,
  payment_source_id,
  billing_interval = "monthly", // monthly o yearly
  email,
}) {
  try {
    const response = await fetch(
      "https://zqgzynkpxgtaipmmmrwz.supabase.co/functions/v1/create-subscription",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${supabaseAnonKey}`,
        },
        body: JSON.stringify({
          user_id,
          payment_source_id,
          billing_interval,
          email,
        }),
      }
    );

    // Manejar errores HTTP
    if (!response.ok) {
      const errData = await response.json();
      console.error("❌ Error al crear la suscripción:", errData);
      throw new Error(errData.error || "Error al crear la suscripción");
    }

    // Parsear respuesta exitosa
    const data = await response.json();
    console.log("✅ Suscripción creada:", data);
    return data; // contiene { subscription, payment }
  } catch (error) {
    console.error("❌ Error en createSubscription:", error);
    throw error;
  }
}
