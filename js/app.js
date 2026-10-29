// js/app.js · La interfaz: estado, DOM y eventos.
import { obtenerEpisodios } from './api.js';
import { filtrarEpisodios, contarPersonajes, alternarId } from './logica.js';
import { leerVistos, guardarVistos } from './vistos.js';

// ============ ESTADO ============
let episodios = [];
let vistos = leerVistos();
const filtros = { texto: '', temporada: '' };

// ============ DOM ============
const lista = document.querySelector('#lista');
const contador = document.querySelector('#contador');
const formFiltros = document.querySelector('#form-filtros');
const inputBusqueda = document.querySelector('#busqueda');
const selectTemporada = document.querySelector('#filtro-temporada');

// R3 · Modelos 1 y 2
const tarjetaHTML = (episodio) => {
  const visto = vistos.includes(episodio.id);
  return `
    <article class="flex flex-col gap-2 rounded-2xl bg-white p-5 shadow${visto ? ' ring-2 ring-emerald-500' : ''}">
      <span class="w-fit rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-semibold text-indigo-700">${episodio.episode}</span>
      <h3 class="text-lg font-bold">${episodio.name}</h3>
      <p class="text-sm text-slate-500">Emitido: ${episodio.air_date}</p>
      <p class="text-sm text-slate-500">${episodio.characters.length} personajes</p>
      <button type="button" data-id="${episodio.id}"
              class="mt-auto rounded-lg py-2 font-semibold text-white ${visto ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-indigo-600 hover:bg-indigo-700'}">
        ${visto ? '✓ Visto' : 'Marcar como visto'}
      </button>
    </article>`;
};

// R2 · Modelos 3 y 4
const mostrarCargando = () => {
  lista.innerHTML = `
    <p class="col-span-full rounded-2xl bg-white p-8 text-center text-slate-500">Cargando episodios…</p>`;
};

const mostrarError = (mensaje) => {
  lista.innerHTML = `
    <div class="col-span-full rounded-2xl bg-rose-50 p-8 text-center text-rose-700">
      <p>No se pudieron cargar los episodios (${mensaje}).</p>
      <button type="button" id="btn-reintentar"
              class="mt-4 rounded-lg bg-rose-600 px-4 py-2 font-semibold text-white hover:bg-rose-700">
        Reintentar
      </button>
    </div>`;
};

// R3 + R4 + R5 · Modelo 5 (vacío) y contador
const render = () => {
  const visibles = filtrarEpisodios(episodios, filtros);

  lista.innerHTML = visibles.length
    ? visibles.map(tarjetaHTML).join('')
    : `<p class="col-span-full rounded-2xl bg-white p-8 text-center text-slate-500">Ningún episodio coincide con la búsqueda.</p>`;

  contador.textContent =
    `${visibles.length} de ${episodios.length} episodios · ${contarPersonajes(visibles)} personajes`;
};

// R2 · Carga
const cargar = async () => {
  mostrarCargando();
  try {
    episodios = await obtenerEpisodios();
    render();
  } catch (error) {
    mostrarError(error.message);
  }
};

// R4 · Eventos de filtros
inputBusqueda.addEventListener('input', () => {
  filtros.texto = inputBusqueda.value;
  render();
});

selectTemporada.addEventListener('change', () => {
  filtros.temporada = selectTemporada.value;
  render();
});

formFiltros.addEventListener('submit', (evento) => {
  evento.preventDefault(); // Enter NO recarga la página
});

// R6 · Delegación: un solo listener para las tarjetas y para Reintentar
lista.addEventListener('click', (evento) => {
  const boton = evento.target.closest('button');
  if (!boton) return;

  if (boton.id === 'btn-reintentar') {
    cargar();
    return;
  }

  if (boton.dataset.id) {
    vistos = alternarId(vistos, Number(boton.dataset.id));
    guardarVistos(vistos);
    render();
  }
});

cargar();