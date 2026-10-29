// js/logica.js · Lógica pura: recibe datos y devuelve datos. Aquí NO aparece document.

// R4 · Filtra por texto (en el nombre) y por temporada (inicio del código)
export const filtrarEpisodios = (lista, { texto, temporada }) => {
  const busqueda = texto.trim().toLowerCase();

  return lista.filter((episodio) =>
    episodio.name.toLowerCase().includes(busqueda) &&
    episodio.episode.startsWith(temporada)
  );
};

// R5 · Suma la cantidad de personajes de todos los episodios
export const contarPersonajes = (lista) =>
  lista.reduce((total, episodio) => total + episodio.characters.length, 0);

// R6 · Agrega o quita un id SIN modificar el array original
export const alternarId = (ids, id) =>
  ids.includes(id)
    ? ids.filter((x) => x !== id)
    : [...ids, id];
