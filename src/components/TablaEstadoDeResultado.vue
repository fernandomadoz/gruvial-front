<template>
  <v-table v-if="datos_tabla" density="compact">
    <thead>
      
      <tr>
        <th></th>
        <th 
            v-for="nombre_de_columna in datos_tabla.columnas"
            :key="nombre_de_columna"
            class="text-right"
        >
          {{ nombre_de_columna }}
        </th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="fila in datos_tabla.filas"
        :key="fila.titulo"
        class="text-left"
      >
        <td v-bind:class="fila.th ? 'fila-th' : ''"> {{ fila.titulo }} 
          <IconoInfo v-if="fila.info" :info="fila.info" />
        </td>
        <td 
        v-for="(valor, index) in fila.valores" 
        :key="valor" 
        class="text-right" 
        v-bind:class="fila.th ? 'fila-th' : ''"
        > 
            <template v-if="index % 2 === 1">
                {{ new Intl.NumberFormat('es-AR', { 
                    minimumFractionDigits: 2, 
                    maximumFractionDigits: 2 
                }).format(valor.valor) }}%
            </template>
            <template v-else>
                ${{ new Intl.NumberFormat('es-AR', { 
                    minimumFractionDigits: 2, 
                    maximumFractionDigits: 2 
                }).format(valor.valor) }}
                <DetalleEstado v-if="fila.detalle" :detalle="fila.detalle" :periodo="valor.mes" />
            </template>
        </td>
      </tr>
    </tbody>
  </v-table>
</template>

<script setup>
import IconoInfo from '../components/IconoInfo.vue';
import DetalleEstado from '../components/DetalleEstado.vue';

  const props = defineProps({
      datos_tabla: {
          type: Object,
          default: {
              columnas: null,
              filas: null,
          }
      }
  })

</script>
<style>
.fila-th {
    background-color: #e5e5e5;
    font-weight:500;
}
</style>