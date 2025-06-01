 // Obtenemos el mes y año actual usando tiempo local para Colombia (UTC-5)
const now = new Date();
export const currentMonth = now.getMonth() + 1; // Los meses en JavaScript son 0-11, así que sumamos 1
export const currentYear = now.getFullYear();
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
export const nombreMes = monthNames[now.getMonth()];