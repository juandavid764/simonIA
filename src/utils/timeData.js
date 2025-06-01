 // Obtenemos el mes y año actual usando UTC para consistencia
  const now = new Date();
  export const currentMonth = now.getUTCMonth() + 1; // Los meses en JavaScript son 0-11, así que sumamos 1
  export const currentYear = now.getUTCFullYear();
  const monthNames = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];
  export const nombreMes = monthNames[now.getUTCMonth()];