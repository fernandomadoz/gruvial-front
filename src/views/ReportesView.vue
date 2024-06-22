<template>

    <v-progress-circular
        v-if="loading"
        indeterminate
        color="amber"
    ></v-progress-circular>

            
    <v-item-group multiple>
        <v-container>
        <v-row>
            <v-col cols="12" md="2">
                <v-item v-slot="{ isSelected, toggle }" v-model="ventas">
                    <v-card
                    :color="isSelected ? 'primary' : ''"
                    class="d-flex align-center"
                    height="80"
                    dark
                    @click="toggle"
                    >
                    <v-scroll-y-transition>
                        <div
                        class="text-h6 flex-grow-1 text-center"
                        >
                        {{ isSelected ? 'Selected' : 'Click Me!' }}
                        </div>
                    </v-scroll-y-transition>
                    </v-card>
                </v-item>
            </v-col>
        </v-row>
        </v-container>
    </v-item-group>

    <p>etiquetas {{ etiquetas }}</p>
    <p>valores {{ valores }}</p>
      <v-sheet
        class="v-sheet--offset mx-auto overflow-visible"
        color="cyan"
        elevation="12"
        max-width="calc(100% - 32px)"
        rounded="lg"
      >
        <v-sparkline
          :labels="etiquetas"
          :model-value="valores"
          color="white"
          line-width="2"
          padding="16"
          type="trend"
        ></v-sparkline>
      </v-sheet>
  
</template>
<script setup>
  import { ref, watch, onMounted } from "vue";
  import axios from "axios";
  import { useData } from '../composables/useData';
  
  const ENDPOINT_PATH_API = ref(import.meta.env.VITE_ENDPOINT_PATH+'api/')
  const { firma_id, headersAxios } = useData();
  const loading = ref(true)
  const ventas = ref(null)
  const etiquetas = ref(null)
  const valores = ref([])


  
  etiquetas.value = [
        '12am',
        '3am',
        '6am',
        '9am',
        '12pm',
        '3pm',
        '6pm',
        '9pm',
    ]
    valores.value[0] = [
          [200],
          [675],
          [410],
          [390],
          [310],
          [460],
          [250],
          [240],
        ]
    valores.value[1] = [
          [100],
          [375],
          [210],
          [490],
          [510],
          [560],
          [150],
          [340],
        ]
  onMounted(() => {
    traerTrabajos()  
  })

  
  const traerTrabajos = async () => {
      loading.value=true
      //console.log(page)
      let jsonCliente = JSON.stringify({ 
          firma_id: firma_id.value
      });

      let body = await axios.post(ENDPOINT_PATH_API.value + "traer-valores-reportes", jsonCliente, {headers: headersAxios.value[0]});
      //console.log(body['data'])
      
      ventas.value = body['data']['ventas']
      loading.value=false

      //redibujarGrafico()

      
    }

    function redibujarGrafico() {        
      let ventasFiltradas = ventas.value.filter(venta => venta.razon_social_id === 2);
      etiquetas.value = ventasFiltradas.map(venta => venta.anio+'/'+venta.mes);
      valores.value = ventasFiltradas.map(venta => venta.iva);
    }

  
  
</script>
<style>
    .v-sheet--offset {
      top: -24px;
      position: relative;
    }
</style>