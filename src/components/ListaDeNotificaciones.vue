<template>
    <v-card
    class="mx-auto"
    v-if="props.lista.length>0"
    >
      <v-list lines="Vencidos">

          <v-list-item 
          v-for="notificacion in props.lista"
          :key="notificacion.id"
          :title="mostrarTitulo(notificacion)"
          :class="claseCss(notificacion)"
          >
          
          <v-btn
          size="small"
              icon="mdi-pencil"
              color="yellow"
              @click="irA(notificacion)"
          ></v-btn> 
          <template v-slot:subtitle>

              <!--div v-html="notificacion.fecha_recordatorio"></div-->
              <div v-html="formatText(notificacion.detalle)"></div>
          </template>

          </v-list-item>

      </v-list>
    </v-card>
    <v-alert
    v-else
    type="success"
    :text="props.textoVacio"
    ></v-alert>  
</template>

<script setup>
  import { ref } from "vue"
  import router from "@/router";

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
  })

       
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

    router.push(destino);

}




const formatText = (text) => {
    if (text) {
      return text.split('|')
        .map(part => {
          const colonIndex = part.indexOf(':');
          if (colonIndex !== -1) {
            const boldedText = `<strong>${part.substring(0, colonIndex)}</strong>`;
            const restOfText = part.substring(colonIndex);
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

</script>


<style>
.resaltar:hover {
  background-color: #f6fb92;
}
.red {
  background-color: rgb(226, 112, 112);
}
.red:hover {
  background-color: #f6fb92;
}
.green {
  background-color: rgb(111, 238, 111);
}
.green:hover {
  background-color: #f6fb92;
}
</style>