// Configurable vía NEXT_PUBLIC_WHATSAPP_NUMBER (ver .env.example).
// Sin esa variable, se usa el número mostrado en el mockup aprobado por el
// cliente (p.37 de ALDARA_Propuesta_Cliente_FINAL_v2.pdf, "O contáctanos
// por aquí" → WhatsApp +34 623 456 789).
export const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "34623456789";
export const WHATSAPP_DISPLAY = "+34 623 456 789";
export const WHATSAPP_HOURS = "Lun - Vie 9:30 - 18:30h";
export const STORE_ADDRESS = "Calle del Almendro 12, Puerto Almenara, España";
export const STORE_HOURS = "Lun - Sáb 10:00 - 20:30h";
export const CONTACT_EMAIL = "hola@aldara.store";
export const WHATSAPP_DEFAULT_MESSAGE = "Hola ALDARA, quería consultar por vuestras piezas ✨";

export function whatsappHref(message: string = WHATSAPP_DEFAULT_MESSAGE): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
