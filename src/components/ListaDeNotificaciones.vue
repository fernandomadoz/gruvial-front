<template>
    <v-alert :type="typeAlert" v-show="mensaje != null">{{ mensaje }}</v-alert>

    <v-card
    class="mx-auto"
    v-if="props.lista.length>0"
    >
        
          <v-card
          class="mx-auto w-full"
          color="surface-light"
        >
          <v-card-text>
            <v-text-field
              append-inner-icon="mdi-magnify"
              density="compact"
              label="Buscar y filtrar"
              variant="solo"
              hide-details
              single-line
              v-model="criterio"
            ></v-text-field>
          </v-card-text>
        </v-card>



        <div
        v-for="notificacion in props.lista"
        :key="notificacion.id"
        :title="mostrarTitulo(notificacion)"
        :class="claseCss(notificacion) +' p-3'"
         v-show="notificacion.detalle.toLowerCase().includes(criterio.toLowerCase()) || criterio == ''"
        >
          
            <!-- DETALLE -->

              <!-- SUELDOS -->
              <v-row v-if="props.tipo == 'sueldo'" >
                <v-col cols="12" sm="12" md="3">
                  <div v-html="detalleSueldo(notificacion.detalle, notificacion.sueldo)"></div>
                  <!-- BOTON VER MAS -->
                  <v-btn color="yellow" :to="irA(notificacion)" class="m-1">Ver mas</v-btn> 
                </v-col>
                <v-col cols="12" sm="12" md="9">
                  <FormDeSueldo :tiempo="props.tiempo" :notificacion="notificacion" :cuentas="cuentas" :tipos_de_cobros="tipos_de_cobros" @registracion-ok="(importe_pago_mensual_registrado) => registrarPagoMensual('green', importe_pago_mensual_registrado, notificacion)"></FormDeSueldo>
                </v-col>
              </v-row>
              
              <!-- PAGOS MENSUALES -->
              <v-row v-if="props.tipo == 'pagomensual'">
                <v-col cols="12" sm="12" md="3">
                  <div v-html="formatText(notificacion.detalle)"></div>
                  <!-- BOTON VER MAS -->
                  <v-btn color="yellow" :to="irA(notificacion)" class="m-1">Ver mas</v-btn> 
                </v-col>
                <v-col cols="12" sm="12" md="9" v-if="notificacion.color=='red'">
                  <div class="bg-white p-4 border rounded-lg w-full h-full">
                  <FormDePagoMensual :tiempo="props.tiempo" :compra_encabezado_id="notificacion.id" :cuentas="cuentas" :tipos_de_cobros="tipos_de_cobros" @registracion-ok="(importe_pago_mensual_registrado) => registrarPagoMensual('green', importe_pago_mensual_registrado, notificacion)"></FormDePagoMensual>
                </div>
                </v-col>
              </v-row>

              <!-- OTROS -->
              <v-row v-if="props.tipo == 'cheque' || props.tipo == 'recordatorio' || props.tipo == 'trabajo'" >
                <v-col cols="12" sm="12" md="12">
                  <!--div v-html="notificacion.fecha_recordatorio"></div-->
                  <div v-html="formatText(notificacion.detalle)"></div>
                  <!-- BOTON VER MAS -->
                  <v-btn color="yellow" :to="irA(notificacion)" class="m-1">Ver mas</v-btn> 
                </v-col>
              </v-row>


            
            <!-- PARA CHEQUES REGISTRAR FECHA DE DEBITO O COBRO -->
            <v-dialog max-width="500" v-if="props.tipo == 'cheque'">
              <template v-slot:activator="{ props: activatorProps }">
                <v-btn
                  v-bind="activatorProps"
                  color="surface-variant"
                  :text="'Registrar '+textoFechaDeCobroDeCheque(notificacion.tipo)"
                  variant="flat"
                  class="m-1"
                ></v-btn>
              </template>

              <template v-slot:default="{ isActive }">
                <v-card :title="'Registrar '+textoFechaDeCobroDeCheque(notificacion.tipo)">
                  <v-card-text>
                    <v-text-field
                        v-model="fecha_de_cobro"
                        :label="textoFechaDeCobroDeCheque(notificacion.tipo)"
                        type="date"
                        clearable
                    ></v-text-field>  
                  </v-card-text>

                  <v-card-actions>
                    <v-spacer></v-spacer>

                    <v-btn
                      :loading="loading"
                      @click="procesarCobroDeCheque(notificacion, isActive)"
                    >
                    Registrar

                      <template v-slot:loader>
                        <v-progress-linear indeterminate></v-progress-linear>
                      </template>
                    </v-btn>
                    <v-btn
                      text="Cerrar"
                      @click="isActive.value = false"
                    ></v-btn>
                  </v-card-actions>
                </v-card>
              </template>
            </v-dialog>
            <!-- PARA CHEQUES REGISTRAR FECHA DE DEBITO O COBRO -->


        </div>
    </v-card>
    <v-alert
    v-else
    type="success"
    :text="props.textoVacio"
    ></v-alert>  
</template>

<script setup>
  import { ref,computed } from "vue"
  import router from "@/router";
  import { useData } from '../composables/useData'
  import axios from "axios"
  import FormDePagoMensual from '../components/FormDePagoMensual.vue';
  import FormDeSueldo from '../components/FormDeSueldo.vue';
  

  const { headersAxios, firmas, firma_id, user_id, setearMensajeStore, mensajeStore, setearTrabajoEncabezadoId } = useData()
  const ENDPOINT_PATH_API = ref(import.meta.env.VITE_ENDPOINT_PATH+'api/')
  const loading = ref(false)
  const mensaje = ref(null)
  const dialog = ref(false)
  const fecha_de_cobro = ref(false)
  const today = new Date();
  const criterio = ref('')
  fecha_de_cobro.value = today.getFullYear() + '-' + ('0' + (today.getMonth() + 1)).slice(-2) + '-' + ('0' + today.getDate()).slice(-2);

  const props = defineProps({
      tipo: {
            type: String,
            default: null
        },
      lista: {
            type: Object,
            default: null
        },
      textoVacio: {
            type: String,
            default: null
        },
      tiempo: {
            type: String,
            default: null
        },
    })

  //Traigo cuentas
  let jsonCuentas = JSON.stringify({ 
      firma_id: firma_id.value
  });
  const body_cuentas = await axios.post(ENDPOINT_PATH_API.value + "cuentas-por-firma", jsonCuentas, {headers: headersAxios.value[0]})
  let cuentas = body_cuentas['data']

  //Traigo tipos de cobros
  const body_tipos_de_cobros = await axios.get(ENDPOINT_PATH_API.value + "tipo-de-cobro", {headers: headersAxios.value[0]})
  let tipos_de_cobros = body_tipos_de_cobros['data']
       
  const irA = (item) => {
    let destino = null
    if (props.tipo == 'cheque') {
        if (item.tipo == 'CHEQUE') {
        destino = '/cheque/M/'+item.id
        }
        if (item.tipo == 'COBRO') {
        destino = '/trabajo/'+item.id
        }
        if (item.tipo == 'COMPRA') {
        destino = '/compra/'+item.id
        }
    }

    if (props.tipo == 'trabajo') {
      destino = '/trabajo/'+item.id
    }

    if (props.tipo == 'pagomensual' || props.tipo == 'sueldo') {
      destino = '/compra/'+item.id
    }

    if (props.tipo == 'recordatorio') {
      destino = '/recordatorio/M/'+item.id
    }

    if (props.tipo == 'trabajomensual') {
      destino = '/trabajo/'+item.id
    }

    return destino;

}



 
async function procesarCobroDeCheque(item, isActive) {
    if (props.tipo == 'cheque') {
      loading.value = true
      const jsonCheque = JSON.stringify({ 
        id: item.cheque_id,
        fecha_de_cobro: fecha_de_cobro.value
      });
      
      const body_update = await axios.post(ENDPOINT_PATH_API.value + "registrar-cobro-de-cheque", jsonCheque, {headers: headersAxios.value[0]})

      body_update['data'].mensaje
      loading.value = false
      item.color='green'
      isActive.value = false

    }

}


const formatText = (text) => {
    if (text) {
      return text.split('|')
        .map(part => {
          const colonIndex = part.indexOf(':');
          if (colonIndex !== -1) {
            let titulo = part.substring(0, colonIndex);
            const boldedText = `<strong>${titulo}</strong>`;
            let restOfText = part.substring(colonIndex);
            if (titulo == ' Importe' || titulo == ' Pagado') {
              restOfText = restOfText.replace(/[:\s]/g, '')
              restOfText = ': $ '+Number(restOfText).toLocaleString("es-AR", 'ARS')
              return `<div class="text-h6">${boldedText}${restOfText}</div><br>`;
            }
            return `${boldedText}${restOfText}<br>`;
          } else {
            return `${part}<br>`;
          }
        })
        .join('');
    }
    else {
      return text
    }
  }
  function claseCss(notificacion) {
    if (notificacion.hasOwnProperty('color')) {
      return notificacion.color
    }
    return 'resaltar'
  }

  function mostrarTitulo(notificacion) {
    let titulo = null
    if (props.tipo == 'cheque') {
      titulo = notificacion.tipo
    }
    return titulo
  }
  
  function textoFechaDeCobroDeCheque(tipo) {
    let texto = 'Fecha de Cobro'
    if (tipo == 'COMPRA') {
      texto = 'Fecha de debito de cheque'
    }
    if (tipo == 'COBRO') {
      texto = 'Fecha de acreditación de cheque'
    }
    return texto
  }

  function registrarPagoMensual(color, importe, notificacion) {
    notificacion.color = color
    notificacion.sueldo = Number(notificacion.sueldo)+importe
    console.log(notificacion.sueldo)
    console.log(importe)
  }

  function detalleSueldo(detalle, importe) {
        let detalle_formateado = formatText(detalle)+'<div class="text-h6">$'+formatoNumero(importe)+'</h6><br>'
        return detalle_formateado
    }
  
  
  function formatoNumero(numero) {
      let decimal = {useGrouping: false }
      let moneda = { style: "currency", minimumFractionDigits: 2, maximumFractionDigits: 2 }
      //return Number(numero).toLocaleString("ARS", decimal)
      return Number(numero).toLocaleString("es-AR", 'ARS')

  }
</script>


<style>
.resaltar:hover {
  background-color: #ffffffb2;
}
.red {
  background-color: rgb(226, 112, 112);
}
.red:hover {
  background-color: #ffffffb2;
}
.green {
  background-color: rgb(111, 238, 111);
}
.green:hover {
  background-color: #ffffffb2;
}
</style>