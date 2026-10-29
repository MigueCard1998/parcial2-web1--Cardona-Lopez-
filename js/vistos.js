// js/vistos.js · Persistencia en LocalStorage
const CLAVE = 'parcial2-vistos';

// R6 · Guarda el array como texto JSON, por ejemplo "[1,12]"
export const guardarVistos = (ids) => {
  localStorage.setItem(CLAVE, JSON.stringify(ids));
};

// R6 · Lee y convierte; si no hay nada o está dañado, devuelve []
export const leerVistos = () => {
  try {
    const texto = localStorage.getItem(CLAVE);
    return texto ? JSON.parse(texto) : [];
  } catch {
    return [];
  }
};