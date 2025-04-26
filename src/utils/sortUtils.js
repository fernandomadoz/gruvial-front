// src/utils/sortUtils.js
import { ref } from 'vue';

// Función para ordenar arrays por propiedades anidadas
export const cambiarOrden = (array, ordenActual, propiedad) => {
  // Si se hace clic en la misma propiedad, se alterna el orden
  if (ordenActual.propiedad === propiedad) {
    ordenActual.orden = ordenActual.orden === 'asc' ? 'desc' : 'asc';
  } else {
    // Si es una nueva propiedad, se reinicia a orden ascendente
    ordenActual.propiedad = propiedad;
    ordenActual.orden = 'asc';
  }

  // Ordenar el array
  array.sort((a, b) => {
    const valorA = propiedad.split('.').reduce((obj, key) => obj[key], a);
    const valorB = propiedad.split('.').reduce((obj, key) => obj[key], b);

    if (valorA < valorB) return ordenActual.orden === 'asc' ? -1 : 1;
    if (valorA > valorB) return ordenActual.orden === 'asc' ? 1 : -1;
    return 0;
  });
};

// Función para crear una instancia de `ordenActual`
export const crearOrdenActual = () => {
  return ref({
    propiedad: '', // Propiedad por la que se está ordenando
    orden: 'asc'   // Orden actual, por defecto ascendente
  });
};
