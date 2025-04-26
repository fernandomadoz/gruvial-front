<template>
    <v-card v-show="estado" v-bind:title="estado" v-bind:class="{ nopagado: !pagado, pagado: pagado  }" subtitle="" style="margin-bottom: 20px;"></v-card>
    <v-card v-bind:title="titulo" subtitle=""></v-card>
    <div v-if="firmasCompraCombinada?.length>1">
      <div class="pa-4">
        <h2 class="text-subtitle-1 font-weight-bold mb-0">
          Compra combinada
        </h2>
        <v-chip-group
          selected-class="text-primary"
          column
        >
          <v-chip v-for="firma in firmasCompraCombinada" :key="firma.id">
            {{ firma.firma }}
          </v-chip>
        </v-chip-group>
      </div>
    </div>
    

    <div class="d-flex my-2" v-if="props.compra_encabezado_id!=-1">
      <v-row>
        <v-col cols="12" sm="6" md="4">
          <v-chip class="w-100" size="x-large" label prepend-icon="mdi-hammer-wrench" v-if="!es_mensual">Importe: <span class="text-blue pl-3">${{ formatoNumero(importe_de_compra) }}</span></v-chip>
        </v-col>
        <v-col cols="12" sm="6" md="4">
          <v-chip class="w-100" size="x-large" label prepend-icon="mdi-text-box-outline">Facturado: <span class="text-blue pl-3">${{ formatoNumero(importeFacturas) }}</span></v-chip>
        </v-col>
        <v-col cols="12" sm="6" md="4">
          <v-chip class="w-100" size="x-large" label prepend-icon="mdi-currency-usd">Pagado: <span class="text-blue pl-3">${{ formatoNumero(importePagos) }}</span></v-chip>
        </v-col>
      </v-row>
    </div>
    
  
    <v-card>
      <v-tabs
        v-model="tab"
        background-color="primary"
      >
        <v-tab value="Encabezado">Encabezado</v-tab>
        <v-tab value="Pagos" v-if="props.compra_encabezado_id!=-1">Pagos</v-tab>
        <v-tab value="Facturas"  v-if="props.compra_encabezado_id!=-1">Facturas</v-tab>
      </v-tabs>

      <v-card-text>
        <v-window v-model="tab">

          <v-window-item value="Encabezado">
            <v-form
              ref="formEncabezado"
              v-model="valid"
              lazy-validation
            >
              <v-row>

                <v-col cols="12" sm="6" md="4">                  
                  <v-select
                    v-model="firma_id_compra"
                    :items="firmas2"
                    item-title="firma"
                    item-value="id"
                    label="Firma"
                    :rules="firmaRules"
                    required
                  ></v-select>    
                </v-col>

                <v-col cols="12" sm="6" md="4">
                  <v-text-field
                      v-model="fecha_de_compra"
                      :rules="fecha_de_compraRules"
                      label="Fecha de Compra"
                      type="date"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" sm="6" md="4">
                  <v-autocomplete
                    v-model="plan_de_cuenta_id"
                    :items="planesDeCuenta"
                    item-title="plan_de_cuenta"
                    item-value="id"
                    dense
                    filled
                    label="Clasificación de Gasto"
                    :rules="plan_de_cuentaRules"
                    required
                  ></v-autocomplete>    
                </v-col>

                
                <v-col cols="12" sm="6" md="4">
                  <v-select
                      v-show="firma_id_compra == 3"
                      v-model="unidad_de_negocio_id"
                      :items="unidades_de_negocio"
                      item-title="unidad_de_negocio"
                      item-value="id"
                      label="Unidad de Negocio"
                      :rules="unidad_de_negocioRules"
                      required
                  ></v-select>  
                </v-col>

            </v-row>
            
            <v-row v-if="mostrarCombinarFirmas">  
              <v-col cols="12" sm="6" md="4">
                <v-checkbox
                  :disabled="firma_id_sesion==1"
                  v-model="firmasDelaCompra"
                  label="Gruvial"
                  :value=1
                  :rules="firmasDelaCompraRules"
                ></v-checkbox>
              </v-col>

              <v-col cols="12" sm="6" md="4">
                <v-checkbox
                  :disabled="firma_id_sesion==2"
                  v-model="firmasDelaCompra"
                  label="Desagotadora"
                  :value=2
                  :rules="firmasDelaCompraRules"
                ></v-checkbox>
              </v-col>

              <v-col cols="12" sm="6" md="4">
                <v-checkbox
                  :disabled="firma_id_sesion==3"
                  v-model="firmasDelaCompra"
                  label="Sanibox"
                  :value=3
                  :rules="firmasDelaCompraRules"
                ></v-checkbox>
              </v-col>
                
            </v-row>

            <v-row v-show="!compra_personal">  
              <v-col cols="12" sm="6" md="6">
                  <v-switch
                    v-model="es_mensual"
                    label="Esta compra o gasto es un servicio de pago mensual?"
                    color="success"
                  ></v-switch>
                </v-col>
                
                <v-col cols="12" sm="6" md="3" v-if="es_mensual">
                  <v-switch
                    v-model="dado_de_baja"
                    label="Dar de baja el servicio de pago mensual"
                    color="error"
                    class="text-red"
                  ></v-switch>
                </v-col>
            </v-row>
            
            <v-row>                
                <v-col cols="12" sm="6" md="8" v-show="!compra_personal">
                    <v-text-field
                    v-model="detalle"
                    :rules="detalleRules"
                    counter="250"
                    clearable
                    label="Detalle de la compra"
                  ></v-text-field>       
                </v-col>
                
                <v-col cols="12" sm="6" md="4" v-show="!es_mensual">
                    {{importe_de_pagoTexto}}
                    <!--v-text-field
                        v-model="importe_de_compra"
                        :rules="importeRules"
                        label="Importe Total de Compra"
                        required
                        type="number"
                        min="0"
                        prefix="$"
                    ></v-text-field-->  
                    
                    <MoneyField
                        v-model="importe_de_compra"
                        :options="currencyOptions_general"
                        label="Importe Total de Compra"
                        required="required"
                        :rules="importeRules"
                        :errorMessage="errorMessage_mgm_money_importe_solicitado"
                    >
                    </MoneyField>
                </v-col>

                
              </v-row>

            <!-- PROVEEDOR -->
              <v-row>              
                <v-col cols="12" sm="8" md="9">
                  <v-autocomplete
                    v-if="!nuevoProveedor"
                    v-model="proveedor_id"
                    :items="proveedores"
                    item-title="detalle_select"
                    item-value="id"
                    dense
                    filled
                    label="Proveedor"
                    :rules="proveedorRules"
                    required
                  ></v-autocomplete>    
                </v-col>

                
                <v-col cols="12" sm="6" md="3">
                  <v-switch
                    v-model="nuevoProveedor"
                    label="Es un proveedor nuevo?"
                    color="success"
                  ></v-switch>
                </v-col>
                  
              </v-row>
          
            <!-- NUEVO PROVEEDOR -->
              <v-row v-show="nuevoProveedor">
                <v-col cols="12" sm="6" md="4">
                  <v-text-field
                    v-model="nombre_o_razon_social"
                    :rules="nombre_o_razon_socialRules"
                    counter="80"
                    clearable
                    label="Nombre o Razon Social"
                  ></v-text-field>           
                </v-col>
                
                <v-col cols="12" sm="6" md="4">
                  <v-text-field
                    v-model="cuit_o_cuil"
                    counter="11"
                    type="number"
                    clearable
                    label="CUIT o CUIL"
                    :rules="cuit_o_cuilRules"
                  ></v-text-field>            
                </v-col>

                
                <v-col cols="12" sm="6" md="4">
                  <v-autocomplete
                    v-model="condicion_iva_id"
                    :items="condiciones_iva"
                    item-title="condicion_iva"
                    item-value="id"
                    :rules="condicion_ivaRules"
                    dense
                    filled
                    label="Condicion IVA"
                  ></v-autocomplete> 
                </v-col>
                
                <v-col cols="12" sm="6" md="4">
                  <v-text-field
                    v-model="telefonos"
                    :rules="telefonosRules"
                    counter="80"
                    clearable
                    label="Telefonos"
                  ></v-text-field>   
                </v-col>
                
                <v-col cols="12" sm="6" md="4">
                  <v-text-field
                    v-model="email"
                    :rules="emailRules"
                    label="E-mail"
                  ></v-text-field> 
                </v-col>

                                
                <v-col cols="12" sm="6" md="4">
                  <v-text-field
                    v-model="direccion"
                    :rules="direccionRules"
                    counter="200"
                    clearable
                    label="Direccion"
                  ></v-text-field>       
                </v-col>

                

              </v-row>
            <!-- FIN NUEVO PROVEEDOR -->

            <!-- FIN PROVEEDOR -->
            
            <!-- OBSERVACIONES -->
              <v-row v-show="!compra_personal">
                <v-col cols="12" sm="12" md="12">
                  <v-textarea
                    label="Observaciones o aclaraciones generales de esta compra, gasto o inversión"
                    v-model="observaciones"
                  ></v-textarea>
                </v-col>
              </v-row>

              <v-col cols="12" sm="12" md="12" v-if="props.compra_encabezado_id==-1">

              <!-- INICIO PAGO -->
                <v-row v-if="carga_pago">
                  
                  <v-col cols="12" sm="6" md="4">
                    <!--v-text-field
                        v-model="importe_de_pago"
                        label="Importe de Pago *"
                        type="number"
                        min="0"
                        prefix="$"
                        required
                    ></v-text-field-->  
                    
                    <MoneyField
                        v-model="importe_de_pago"
                        :options="currencyOptions_general"
                        label="Importe de Pago *"
                        required="required"
                        :rules="importeRules"
                        :errorMessage="errorMessage_mgm_money_importe_solicitado"
                    >
                    </MoneyField>
                  </v-col>

                  <v-col cols="12" sm="6" md="4">
                      <v-autocomplete
                          v-model="cuenta_de_origen_id"
                          :items="cuentas"
                          item-title="detalle_select"
                          item-value="id"
                          dense
                          filled
                          label="Cuenta que Paga"
                          clearable
                          required
                      ></v-autocomplete>      
                  </v-col>

                  <v-col cols="12" sm="6" md="4">
                      <v-autocomplete
                          v-model="tipo_de_cobro_id"
                          :items="tipos_de_cobros"
                          :hint="txtNotificarCambioTipoDeCobro"
                          item-title="tipo_de_cobro"
                          item-value="id"
                          dense
                          filled
                          label="Tipo de Pago"
                      ></v-autocomplete> 
                  </v-col>

                  <v-col cols="12" sm="6" md="4">
                    <v-text-field
                        v-model="fecha_de_pago"
                        :rules="fecha_de_pagoRules"
                        label="Fecha de Pago"
                        type="date"
                    ></v-text-field>
                  </v-col>
                  

                </v-row>

                <!-- INICIO CHEQUE -->
                  <v-row v-show="(tipo_de_cobro_id == 3 || tipo_de_cobro_id == 4) && carga_pago">
                    
                    <v-col cols="12" sm="6" md="4">
                      <v-switch
                        v-model="cheque_en_cartera"
                        label="Cheque en cartera?"
                        color="success"
                      ></v-switch>
                    </v-col>
                    <v-col cols="12" sm="6" md="4" v-if="cheque_en_cartera">
                        <v-autocomplete
                            v-model="cheque_id"
                            :items="cheques_en_cartera"
                            item-title="cheque"
                            item-value="id"
                            dense
                            filled
                            label="Cheque *"
                            :rules="chequeRules"
                        ></v-autocomplete>      
                    </v-col>
                  </v-row>
                  <v-row v-show="(tipo_de_cobro_id == 3 || tipo_de_cobro_id == 4) && carga_pago && !cheque_en_cartera">
                    
                        
                      <v-col cols="12" sm="6" md="4">
                          <v-text-field                          
                              v-model="numero_de_cheque"
                              maxlength="30"
                              counter="30"
                              label="Nro de Cheque"
                              :rules="chequeRules"
                          ></v-text-field>      
                      </v-col>
                      <!--v-col cols="12" sm="6" md="4">
                          <v-text-field
                              v-model="fecha_de_emision"
                              label="Fecha de Emisión *"
                              type="date"
                              :rules="chequeRules"
                          ></v-text-field>  
                      </v-col-->
                      <v-col cols="12" sm="6" md="4">
                          <v-text-field
                              v-model="fecha_inicio_de_cobro"
                              label="Fecha de Inicio de Cobro *"
                              type="date"
                              :rules="chequeRules"
                          ></v-text-field>  
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                          <v-text-field
                              v-model="fecha_de_vencimiento"
                              label="Fecha de Vencimiento *"
                              type="date"
                              :rules="chequeRules"
                          ></v-text-field>  
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                          <v-text-field
                              v-model="fecha_de_cobro"
                              label="Fecha de Cobro"
                              type="date"
                              clearable
                          ></v-text-field>  
                      </v-col>
                  </v-row>
                <!-- FIN CHEQUE -->
              
              <!-- FIN PAGO -->
              

              <!-- INICIO FACTURA -->
                <v-row v-if="props.compra_encabezado_id==-1">
                  <v-col cols="12" sm="4" md="4">
                      <v-switch
                        v-model="carga_factura"
                        label="Cargar Factura?"
                        color="success"
                        @click="setearCargaDeFactura"
                      ></v-switch>
                    </v-col>

                  <v-col cols="12" sm="6" md="6" v-show="carga_factura">                       
                      <v-btn-toggle
                        v-model="porcentaje_de_iva"
                        rounded="0"
                        color="deep-purple-accent-3"
                        group
                        class="float-right"
                      >
                        <div class="mx-5">IVA:</div>
                        <v-btn :value="21">
                          21%
                        </v-btn>

                        <v-btn :value="10.5">
                          10,5%
                        </v-btn>

                        <v-btn :value="0">
                          0%
                        </v-btn>

                        <v-text-field                          
                              v-model="porcentaje_de_iva"
                              label="porcentaje a calcular"
                              suffix="%"
                              type="number"
                        ></v-text-field> 
                          
                      </v-btn-toggle>
                    </v-col>
                    
                </v-row>
                
                <v-row v-if="carga_factura">
                  
                  <v-col cols="12" sm="6" md="4">
                      <v-select
                          v-model="razon_social_id"
                          :items="razones_sociales"
                          item-title="razon_social"
                          item-value="id"
                          label="Facturado a *"
                          :rules="requeridoRules"
                          required="required"
                      ></v-select>    
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                      <v-select
                          v-model="tipo_de_factura_id"
                          :items="tipos_de_facturas"
                          item-title="tipo_de_factura"
                          item-value="id"
                          required="required"
                          label="Tipo de Factura *"
                          :rules="requeridoRules"
                      ></v-select>     
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                      <v-text-field
                          v-model="fecha_de_factura"
                          :rules="requeridoRules"
                          label="Fecha de Factura *"
                          type="date"
                          required
                      ></v-text-field>  
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                      <v-text-field
                          v-model="nro_de_factura"
                          :rules="requeridoRules"
                          counter="15"
                          required="required"
                          maxlength="15"
                          label="Nro de Factura *"
                      ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                      <!--v-text-field
                          v-model="importe_total"
                          :rules="requeridoRules"
                          label="Importe Total *"
                          type="number"
                          min="0"
                          prefix="$"
                          required="required"
                      ></v-text-field-->  
                      
                      <MoneyField
                          v-model="importe_total"
                          :options="currencyOptions_general"
                          label="Importe Total *"
                          required="required"
                          :rules="requeridoRules"
                      >
                      </MoneyField>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                      <!--v-text-field
                          v-model="importe_neto"
                          label="Neto"
                          type="number"
                          min="0"
                          prefix="$"
                      ></v-text-field-->  
                      
                      <MoneyField
                          v-model="importe_neto"
                          :options="currencyOptions_general"
                          label="Neto"
                      >
                      </MoneyField>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                      <!--v-text-field
                          v-model="importe_iva"
                          label="IVA"
                          type="number"
                          min="0"
                          prefix="$"
                      ></v-text-field-->  
                      
                      <MoneyField
                          v-model="importe_iva"
                          :options="currencyOptions_general"
                          label="IVA"
                      >
                      </MoneyField>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                      <!--v-text-field
                          v-model="importe_no_grabado"
                          label="No grabado"
                          type="number"
                          min="0"
                          prefix="$"
                      ></v-text-field--> 
                      
                      <MoneyField
                          v-model="importe_no_grabado"
                          :options="currencyOptions_general"
                          label="No grabado"
                      >
                      </MoneyField> 
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                      <!--v-text-field
                          v-model="importe_percepcion_iibb"
                          label="Retencion IIBB"
                          type="number"
                          min="0"
                          prefix="$"
                      ></v-text-field--> 
                      
                      <MoneyField
                          v-model="importe_percepcion_iibb"
                          :options="currencyOptions_general"
                          label="Retencion IIBB"
                      >
                      </MoneyField>  
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                      <!--v-text-field
                          v-model="importe_percepcion_iva"
                          label="Percepcion IVA"
                          type="number"
                          min="0"
                          prefix="$"
                      ></v-text-field-->  
                      
                      <MoneyField
                          v-model="importe_percepcion_iva"
                          :options="currencyOptions_general"
                          label="Percepcion IVA"
                      >
                      </MoneyField>
                  </v-col>
                </v-row>  
              <!-- FIN FACTURA -->
              
              </v-col>


              <v-alert type="success" v-show="mensajeStore != null">{{ mensajeStore }}</v-alert>

              <v-btn
                class="ma-2"
                color="primary"
                @click="validate(null)"
                :disabled="loading"
              >
                <v-icon
                  start
                  icon="mdi-content-save"
                ></v-icon>
                Guardar  
              </v-btn>
              
              <v-btn 
                class="ma-2"
                color="primary"
                @click="validate('nuevo')"
                :disabled="loading"
              >
                <v-icon
                  start
                  icon="mdi-content-save"
                ></v-icon>
                Guardar y cargar uno nuevo
              </v-btn>
              
              <v-dialog width="500" v-if="compra_encabezado_id != -1" >
                  <template v-slot:activator="{ props }">
                      <v-btn color="red" v-bind="props" class="ma-2">
                        Eliminar
                        <v-icon end icon="mdi-cancel"></v-icon>
                      </v-btn>
                  </template>

                  <template v-slot:default="{ isActive }">
                    <v-card title="Eliminar">
                      <v-card-text>
                        <p>
                          Esta seguro que quieres Eliminar esta compra?<br><br>
                          <i class="text-gery">Eliminaras también los pagos y facturas cargadas dentro de esta compra</i>
                        </p>                        
                      </v-card-text>
                      <v-card-actions>
                        <v-spacer></v-spacer>

                        <v-btn
                          @click="validate('borrar-y-volver-al-listado')"
                          color="red"
                        >Si, Eliminar</v-btn>
                        
                        <v-btn
                          @click="isActive.value = false"
                        >Cancelar</v-btn>
                      </v-card-actions>
                    </v-card>
                  </template>
              </v-dialog>
              <br>
              <br>

              <v-progress-circular
              indeterminate
              color="amber"
              v-show="loading"
              ></v-progress-circular>


              <v-row v-if="compra_encabezado_id != -1">
                <!--v-col cols="12" sm="6" md="4">
                  <v-switch
                    v-model="compra_cancelado"
                    label="Cancelar compra"
                    color="error"
                  ></v-switch>
                </v-col>
                <v-col cols="12" sm="6" md="8" v-show="compra_cancelado">
                  <v-textarea
                    label="observaciones de cancelación"
                    v-model="observaciones_de_cancelacion"
                  ></v-textarea>
                </v-col-->
              </v-row>

              <v-row v-show="compra_cancelado && !fecha_de_cancelacion">
                <v-col cols="12" sm="12" md="12" v-show="compra_cancelado">
                  `<v-btn
                    class="ma-2"
                    color="primary"
                    @click="validate(null)"
                    :disabled="loading"
                  >
                    <v-icon
                      start
                      icon="mdi-content-save"
                    ></v-icon>
                    Guardar Cancelación 
                  </v-btn>`

                  <v-progress-circular
                    indeterminate
                    color="amber"
                    v-show="loading"
                  ></v-progress-circular>
                  
                </v-col>
              </v-row>
            </v-form>
          </v-window-item>
          

          <v-window-item value="Pagos" v-if="props.compra_encabezado_id!=-1">
            <ComprasPagosList 
              :controlarMontoDeImporte="controlarMontoDeImporte"
              :importe_de_compra="importe_de_compra" 
              :esCompraCombinada="esCompraCombinada" 
              :firmasCompraCombinada="firmasCompraCombinada"
            />
          </v-window-item>

          <v-window-item value="Facturas" v-if="compra_encabezado_id!=-1">
            <ComprasFacturasList />
          </v-window-item>

        </v-window>
      </v-card-text>
    </v-card>
    
  <!--v-card style="padding: 20px">{{compra_encabezado}}</v-card>
  <v-card style="padding: 20px">{{proveedores}}</v-card-->




  
</template> 
 
<script setup> 
  import axios from "axios"
  import { useData } from '../composables/useData'
  import router from "../router"
  import { defineComponent } from 'vue'
  import { ref, onMounted, watch, computed} from "vue"
  import "bootstrap/dist/css/bootstrap.min.css"

  // Components
  import ComprasPagosList from '../components/ComprasPagosList.vue';
  import ComprasFacturasList from '../components/ComprasFacturasList.vue';
  import MoneyField from '../components/MoneyField.vue';
  
  
  const props = defineProps({
    compra_encabezado_id: {
          type: Number,
          default: null
      },
    tab: {
          type: String,
          default: null
      },
  })

  onMounted(() => {
    tab.value = props.tab ? props.tab : 'Encabezado'
  })
  
  //Variables grales de Aplicacion
  const { headersAxios, firmas, firma_id, user_id, setearMensajeStore, mensajeStore, setearCompraEncabezadoId } = useData()

  const ENDPOINT_PATH_API = ref(import.meta.env.VITE_ENDPOINT_PATH+'api/')

  let compra_encabezado = ref([])
  let titulo = ''
  let tab = ref(null)
  const nuevoProveedor = ref(false)
  const loading = ref(false)
  const mostrarCombinarFirmas = ref(false)
  const firmasDelaCompra = ref([Number(firma_id.value)])
  const firmasCompraCombinada = ref([])
  const esCompraCombinada = ref(false)
  const firma_id_sesion = ref(Number(firma_id.value))

  //Traigo firmas
  const body_firmas = await axios.get(ENDPOINT_PATH_API.value + "firma-por-usuario", {headers: headersAxios.value[0]})
  let firmas2 = body_firmas['data']

  let elementoCombinado = {
    "id": 9999,
    "firma": "Compra de pago combinado",
    "created_at": null,
    "updated_at": null
  }

  firmas2.push(elementoCombinado)

  //Traigo proveedores
  let body_proveedores = await axios.get(ENDPOINT_PATH_API.value + "proveedor", {headers: headersAxios.value[0]})
  let proveedores = ref(body_proveedores['data'])


  //Traigo Planes de Cuenta
  let body_planes_de_cuenta = await axios.get(ENDPOINT_PATH_API.value + "plan-de-cuenta", {headers: headersAxios.value[0]})
  let planesDeCuenta = ref(body_planes_de_cuenta['data'])

  //Traigo cuentas
  let jsonCuentas = JSON.stringify({ 
      firma_id: firma_id.value
  });
  const body_cuentas = await axios.post(ENDPOINT_PATH_API.value + "cuentas-por-firma", jsonCuentas, {headers: headersAxios.value[0]})
  let cuentas = body_cuentas['data']
  
  //Traigo tipos de cobros
  const body_tipos_de_cobros = await axios.get(ENDPOINT_PATH_API.value + "tipo-de-cobro", {headers: headersAxios.value[0]})
  let tipos_de_cobros = body_tipos_de_cobros['data']

  
  //Traigo tipos de cobros
  const body_unidades_de_negocio = await axios.get(ENDPOINT_PATH_API.value + "unidad-de-negocio", {headers: headersAxios.value[0]})
  let unidades_de_negocio = body_unidades_de_negocio['data']

  

  //Traigo tipos de facturas
  const body_tipos_de_facturas = await axios.get(ENDPOINT_PATH_API.value + "tipo-de-factura", {headers: headersAxios.value[0]})
  let tipos_de_facturas = body_tipos_de_facturas['data']

  //Traigo razones sociales
  const body_razones_sociales = await axios.get(ENDPOINT_PATH_API.value + "razon-social", {headers: headersAxios.value[0]})
  let razones_sociales = body_razones_sociales['data']


  //Traigo Condiciones de IVA
  const body_condiciones_iva = await axios.get(ENDPOINT_PATH_API.value + "condicion-iva", {headers: headersAxios.value[0]})
  let condiciones_iva = ref(body_condiciones_iva['data'])


  //Variables compras_encabezados
  setearCompraEncabezadoId(props.compra_encabezado_id)
  let firma_id_compra = ref(null)
  let proveedor_id = ref(null)
  let fecha_de_compra = ref(null)
  let detalle = ref(null)
  let importe_de_compra = ref(0)
  let observaciones = ref(null)
  let observaciones_de_cancelacion = ref(null)
  let fecha_de_cancelacion = ref(null)
  let fecha_de_cancelacion_f = ref(null)
  const formEncabezado = ref(null) 
  let plan_de_cuenta_id = ref(null)
  let nombre_o_razon_social = ref(null)
  let cuit_o_cuil = ref(null)
  let telefonos = ref(null)
  let direccion = ref(null)
  let condicion_iva_id = ref(null)
  let email = ref(null)
  let estado = ref(null)
  let pagado = ref(null)
  let importeFacturas = ref(null)
  let importePagos = ref(null)
  const es_mensual = ref(false)
  const dado_de_baja = ref(false)
  const carga_pago = ref(true)
  const carga_factura = ref(false)
  const cheque_en_cartera = ref(false)
  const compra_personal = ref(false)
  const importe_de_pago = ref(false)
  const cuenta_de_origen_id = ref(null)
  const fecha_de_pago = ref(null)
  const unidad_de_negocio_id = ref(null)
  const tipo_de_cobro_id = ref(null)
  const numero_de_cheque = ref(null)
  //const fecha_de_emision = ref(null)
  const fecha_inicio_de_cobro = ref(null)
  const fecha_de_vencimiento = ref(null)
  const fecha_de_cobro = ref(null)
  const tipo_de_factura_id = ref(null)
  const razon_social_id = ref(null)
  const fecha_de_factura = ref(null)
  const nro_de_factura = ref(null)
  const importe_neto = ref(0)
  const importe_iva = ref(0)
  const importe_no_grabado = ref(0)
  const importe_percepcion_iibb = ref(0)
  const importe_percepcion_iva = ref(0)
  const importe_total = ref(0)
  const compra_cancelado = ref(false)
  const cheques_en_cartera = ref(null)
  const cheque_id = ref(null)
  const porcentaje_de_iva = ref(21)
  const accionPosterior = ref(null)
  const currencyOptions_general = ref({
    locale: 'es-AR', 
    currency: 'ARS', 
    distractionFree: false, 
    precision: 2, 
    //valueRange: {min: 1}, 
    autoDecimalMode: true, 
  })

  if (props.compra_encabezado_id == -1) {
    // Seteo valores de variables para un alta de compras_encabezados
    titulo = 'Crear nueva Compra | Gasto | Inversión'
    compra_encabezado = -1
    const today = new Date();
    fecha_de_compra.value = today.getFullYear() + '-' + ('0' + (today.getMonth() + 1)).slice(-2) + '-' + ('0' + today.getDate()).slice(-2);
    fecha_de_pago.value = fecha_de_compra.value
  }
  else {
    // Traigo compras_encabezados y seteo variables
    const body_find = await axios.get(ENDPOINT_PATH_API.value + "compra-encabezado/"+props.compra_encabezado_id, {headers: headersAxios.value[0]})
    compra_encabezado = body_find['data']
    titulo = 'Compra ID: '+props.compra_encabezado_id+' | '+compra_encabezado.data.proveedor.nombre_o_razon_social
    firma_id_compra.value = compra_encabezado.data.firma.id
    proveedor_id.value = compra_encabezado.data.proveedor.id
    plan_de_cuenta_id.value = compra_encabezado.data.plan_de_cuenta.id
    fecha_de_compra.value = compra_encabezado.data.fecha_de_compra_f
    detalle.value = compra_encabezado.data.detalle
    importe_de_compra.value = compra_encabezado.data.importe_de_compra
    observaciones.value = compra_encabezado.data.observaciones
    fecha_de_cancelacion.value = compra_encabezado.data.fecha_de_cancelacion
    observaciones_de_cancelacion.value = compra_encabezado.data.observaciones_de_cancelacion
    estado.value = compra_encabezado.data.estado
    pagado.value = compra_encabezado.data.pagado
    importeFacturas.value = compra_encabezado.data.importeFacturas
    importePagos.value = compra_encabezado.data.importePagos
    es_mensual.value = sino_a_tf(compra_encabezado.data.es_mensual)
    dado_de_baja.value = sino_a_tf(compra_encabezado.data.dado_de_baja)
    compra_cancelado.value = fecha_de_cancelacion.value ? true : false;
    esCompraCombinada.value = compra_encabezado.data.esCompraCombinada
    firmasCompraCombinada.value = compra_encabezado.data.firmasCompraCombinada
    unidad_de_negocio_id.value = compra_encabezado.data.unidad_de_negocio_id
  }




  // ----- Inicio: Validación y envio del Formulario Encabezado

  //Rules de los Campos 
  let valid = ref(true);
  const firmaRules = [
    v => !!v || 'Firma es requerido'
  ];
  const proveedorRules = [
    v => !!v || 'Proveedor es requerido'
  ];
  const plan_de_cuentaRules = [
    v => !!v || 'Plan de cuenta es requerido'
  ];
  const fecha_de_compraRules = [
    v => !!v || 'Fecha de Inicio es requerido'
  ];
  const fecha_de_pagoRules = [
    v => !!v || 'Fecha de Inicio es requerido'
  ];

  let detalleRules = [
      value => {
          if (!compra_personal.value && !value) {
              return 'Detalle es requerido'
          }
      }
  ]
let nombre_o_razon_socialRules = [
    value => {
        if (nuevoProveedor.value && !value) {
            return 'Nombre o Razon Social es requerido'
        }
    }
]

let condicion_ivaRules = [
    value => {
        if (nuevoProveedor.value && !value) {
            return 'Condición de IVA es requerido'
        }
    }
]


let unidad_de_negocioRules = [
      value => {
          if (firma_id_compra.value == 3 && !value) {
              return 'La Unidad de Negocio es requerida'
          }
      }
  ]

  

  const regexCUIT_CUIL = /^(20|23|24|27|30|33|34)(\d{8})(\d{1})$/;

  function validarCUIT_CUIL(cuit) {
    if (!regexCUIT_CUIL.test(cuit)) {
      return false;
    }

    const digitos = cuit.match(/\d/g).map(Number);
    const verificador = digitos.pop();
    const suma = digitos.reduce((acc, digit, index) => acc + digit * (2 + (index % 6)), 0);
    const resto = suma % 11;
    const resultado = resto === 0 ? 0 : resto === 1 ? 9 : 11 - resto;

    return resultado === verificador;
  }

  let cuit_o_cuilRules = [
      value => {
          if (nuevoProveedor.value) {
            if (!value) {
                return 'CUIT es requerido'
            }
            else {
              if (value.length != 11) {
                  return 'CUIT debe ser sin guiones y no mayor a 11 caracteres'
              }
              else {
                if (proveedores.value.some(item => item.cuit_o_cuil === value)) {
                    return 'Ya existe un proveedor con ese CUIT registrado, busquelo en la lista de proveedor'

                }
              }
              
            }
          }
          
          return true
      }
  ]

  let emailRules = [
      value => {
          if (nuevoProveedor.value) {
            /*
            if (!value) {
                return 'E-mail es requerido'
            }
            */
            if (value && !(/.+@.+\..+/.test(value))) {
                return 'E-mail debe ser valido'
            }
          }
          return true
      }
  ]

  /*
  const cuit_o_cuilRules =  [
    v => (v && v.length <= 13) || 'Maximo 13 caracteres',
    v => /\b(20|23|24|27|30|33|34)(\D)?[0-9]{8}(\D)?[0-9]/g || 'CUIT debe ser valido',
  ];
  */

  

  let firmasDelaCompraRules = [
      value => {
        if (mostrarCombinarFirmas) {
          if (!value || value.length < 2) {
              return 'Debe elegir al menos dos firmas'
          }
        }
        return true
        
      }
  ]

  let importeRules = [
      value => {
        console.log('value')
        console.log(value)
        if (!value && es_mensual.value == false) {
            console.log('Es requerido')
            return 'Es requerido'
        }
        console.log('trueeee')
        
        return true
        
      }
  ]

  const requeridoRules = [
    v => !!v || 'Es requerido'
  ];

  //Valido el Formulario
  async function validate(accionValidate = null) {
    let resul = await formEncabezado.value.validate()
    accionPosterior.value = accionValidate

    // Si el formulario es valido guardo los datos
    if (valid.value) {
      enviarFormEncabazado()
    }
    else {
      console.log(valid.value)
      console.log(resul)
    }

  };

  //Envio el Formulario
  async function enviarFormEncabazado() {
    //loading.value = true
    if (compra_personal.value) {
      cuenta_de_origen_id.value = 21
      tipo_de_cobro_id.value = 1
      fecha_de_pago.value = fecha_de_factura.value
    }
    const json = JSON.stringify({ 
      compra_encabezado_id: props.compra_encabezado_id,
      firma_id_sesion: firma_id_sesion.value,
      firma_id: firma_id_compra.value,
      importe_de_compra: importe_de_compra.value,
      firmasDelaCompra: firmasDelaCompra.value,
      proveedor: {
        nuevoProveedor: nuevoProveedor.value,
        id: proveedor_id.value,
        nombre_o_razon_social: nombre_o_razon_social.value,
        cuit_o_cuil: cuit_o_cuil.value,
        direccion: direccion.value,
        condicion_iva_id: condicion_iva_id.value,
        telefonos: telefonos.value,
        email: email.value,
      },
      fecha_de_compra: fecha_de_compra.value,
      user_id: user_id.value,
      plan_de_cuenta_id: plan_de_cuenta_id.value,
      detalle: detalle.value,
      observaciones: observaciones.value,
      es_mensual: tf_a_sino(es_mensual.value),
      dado_de_baja: tf_a_sino(dado_de_baja.value),

      carga_factura: carga_factura.value,
      importe_de_pago: importe_de_pago.value,
      cuenta_de_origen_id: cuenta_de_origen_id.value,
      fecha_de_pago: fecha_de_pago.value,
      unidad_de_negocio_id: unidad_de_negocio_id.value,
      cheque_id: cheque_id.value,
      tipo_de_cobro_id: tipo_de_cobro_id.value,
      numero_de_cheque: numero_de_cheque.value,
      //fecha_de_emision: fecha_de_emision.value,
      fecha_inicio_de_cobro: fecha_inicio_de_cobro.value,
      fecha_de_vencimiento: fecha_de_vencimiento.value,
      fecha_de_cobro: fecha_de_cobro.value,
      tipo_de_factura_id: tipo_de_factura_id.value,
      razon_social_id: razon_social_id.value,
      fecha_de_factura: fecha_de_factura.value,
      nro_de_factura: nro_de_factura.value,
      importe_neto: importe_neto.value,
      importe_iva: importe_iva.value,
      importe_no_grabado: importe_no_grabado.value,
      importe_percepcion_iibb: importe_percepcion_iibb.value,
      importe_percepcion_iva: importe_percepcion_iva.value,
      importe_total: importe_total.value,
      compra_cancelado: compra_cancelado.value,
      observaciones_de_cancelacion: observaciones_de_cancelacion.value,
      
    });

    let resultadoGuardar = null;


    //Si compra_encabezado_id = -1 creo el compra sino actualizo
    if (props.compra_encabezado_id == -1) {
      const body_new = await axios.post(ENDPOINT_PATH_API.value + "compra-encabezado", json, {headers: headersAxios.value[0]})
      setearMensajeStore(body_new['data'].mensaje)
      setearCompraEncabezadoId(body_new['data'].compra_encabezado.id)
      proveedor_id.value = body_new['data'].compra_encabezado.proveedor.id
      router.push("/compra/"+body_new['data'].compra_encabezado.id);
    }
    else {
      if (accionPosterior.value == 'borrar-y-volver-al-listado') {
        //const body_update = await axios.delete(ENDPOINT_PATH_API.value + "compra-encabezado/"+props.compra_encabezado_id, json, {headers: headersAxios.value[0]})
        const body_update = await axios.post(ENDPOINT_PATH_API.value + "compra-encabezado-delete/"+props.compra_encabezado_id, json, {headers: headersAxios.value[0]})
        let compra_encabezado_update = body_update['data']
        setearMensajeStore(body_update['data'].mensaje)
      }
      else {
        //const body_update = await axios.put(ENDPOINT_PATH_API.value + "compra-encabezado/"+props.compra_encabezado_id, json, {headers: headersAxios.value[0]})
        const body_update = await axios.post(ENDPOINT_PATH_API.value + "compra-encabezado-update/"+props.compra_encabezado_id, json, {headers: headersAxios.value[0]})
        let compra_encabezado_update = body_update['data']
        proveedor_id.value = body_update['data'].compra_encabezado.proveedor.id
        setearMensajeStore(body_update['data'].mensaje)
      }
      
    }    
    //Traigo proveedores
    body_proveedores = await axios.get(ENDPOINT_PATH_API.value + "proveedor", {headers: headersAxios.value[0]})
    proveedores.value = body_proveedores['data']      
    nuevoProveedor.value = false
    getTime()
    loading.value = false
  }

  // ----- Fin: Validación y envio del Formulario Encabezado
  
  function getTime() {
    setTimeout(() => {
      setearMensajeStore(null)
      if (accionPosterior.value == 'nuevo') {
        resetForm()
        router.push("/compra/-1");        
      }
      if (accionPosterior.value == 'borrar-y-volver-al-listado') {
        resetForm()
        router.push("/compras-list");        
      }
    }, 2 * 1000);
  }


let text = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'

  function sino_a_tf(sino) {
    return sino == 'SI' ? true : false
  }

  function tf_a_sino(tf) {
    return tf ? 'SI' : 'NO'
  }

  function setearCargaDeFactura() {
    if (carga_factura.value) {
      importe_total.value = importe_de_compra.value
    }
  }

  function calcularIVA() {
    porcentaje_de_iva.value = Number(porcentaje_de_iva.value)
    if (porcentaje_de_iva.value > 0) {
      importe_iva.value = importe_total.value * (porcentaje_de_iva.value / (100 + porcentaje_de_iva.value))
      importe_iva.value = importe_iva.value.toFixed(2)
      importe_neto.value = importe_total.value - importe_iva.value
      importe_neto.value = importe_neto.value.toFixed(2)
    }
    else {
      importe_iva.value = 0
      importe_neto.value = importe_total.value
    }
    
  }
  
  watch(
        () => importe_de_compra.value,
        (newValue, oldValue) => {
          importe_total.value = newValue
          importe_de_pago.value = newValue          
        }
    )   

    watch(
        () => importe_total.value,
        (newValue, oldValue) => {        
          if (newValue>0) {
                calcularIVA()
            } 
        }
    ) 

    watch(
        () => porcentaje_de_iva.value,
        (newValue, oldValue) => {         
            calcularIVA()
        }
    )  
    
  watch(
        () => plan_de_cuenta_id.value,
        (newValue, oldValue) => {
          if (newValue == 1) {
            compra_personal.value = true
            carga_pago.value = false
            cuenta_de_origen_id.value = 21
            carga_factura.value = true
            detalle.value = null
            es_mensual.value = false
            observaciones.value = null
          }
          else {
            compra_personal.value = false
            carga_pago.value = true
            cuenta_de_origen_id.value = null
          }
        }
    )   
  
  
  watch(
      () => cheque_en_cartera.value,
      async (newValue, oldValue) => {
        if (newValue) {
          let body_chequesencartera = await axios.get(ENDPOINT_PATH_API.value + "cheques-en-cartera", {headers: headersAxios.value[0]})
          cheques_en_cartera.value = body_chequesencartera['data']
        }
        else {
          cheque_id.value = false
        }
      }
  )   
  
  
  watch(
      () => tipo_de_factura_id.value,
      async (newValue, oldValue) => {
        if (newValue == 3 || newValue == 4 || newValue == 6) {
          porcentaje_de_iva.value = 0
        }
      }
  )   

  watch(
        () => firma_id_compra.value,
        (newValue, oldValue) => {
          if (newValue == 9999) {
            mostrarCombinarFirmas.value = true
            firmasDelaCompra.value = [Number(firma_id.value)]
          }
          else {
            mostrarCombinarFirmas.value = false
            firmasDelaCompra.value = [Number(newValue)]
          }        
          
        }
    ) 
    

    function resetForm() {
      //firma_id_compra.value = null
      
      const today = new Date();
      fecha_de_compra.value = today.getFullYear() + '-' + ('0' + (today.getMonth() + 1)).slice(-2) + '-' + ('0' + today.getDate()).slice(-2);
      proveedor_id.value = null
      //fecha_de_compra.value = null
      detalle.value = null
      importe_de_compra.value = 0
      observaciones.value = null
      observaciones_de_cancelacion.value = null
      fecha_de_cancelacion.value = null
      fecha_de_cancelacion_f.value = null
      formEncabezado.value = null
      plan_de_cuenta_id.value = null
      nombre_o_razon_social.value = null
      cuit_o_cuil.value = null
      telefonos.value = null
      direccion.value = null
      condicion_iva_id.value = null
      email.value = null
      estado.value = null
      pagado.value = null
      importeFacturas.value = null
      importePagos.value = null
      es_mensual.value = false
      dado_de_baja.value = false
      carga_pago.value = true
      carga_factura.value = false
      cheque_en_cartera.value = false
      compra_personal.value = false
      importe_de_pago.value = 0
      cuenta_de_origen_id.value = null
      fecha_de_pago.value = null
      unidad_de_negocio_id.value = null
      tipo_de_cobro_id.value = null
      numero_de_cheque.value = null
      fecha_inicio_de_cobro.value = null
      fecha_de_vencimiento.value = null
      fecha_de_cobro.value = null
      tipo_de_factura_id.value = null
      razon_social_id.value = null
      fecha_de_factura.value = null
      nro_de_factura.value = null
      importe_neto.value = 0
      importe_iva.value = 0
      importe_no_grabado.value = 0
      importe_percepcion_iibb.value = 0
      importe_percepcion_iva.value = 0
      importe_total.value = 0
      compra_cancelado.value = false
      cheques_en_cartera.value = null
      cheque_id.value = null
      porcentaje_de_iva.value = 21
      accionPosterior.value = null  
    }

    function calcularFechaDeVencimiento(fechaStr) {
        // Convertir el string a objeto de fecha
        let fechaObj = new Date(fechaStr);

        // Sumarle 29 días
        fechaObj.setDate(fechaObj.getDate() + 29);

        // Formatear la nueva fecha como string 'yyyy-mm-dd'
        let nuevaFechaStr = fechaObj.toISOString().split('T')[0];

        return nuevaFechaStr;
    }
    
    watch(
        () => fecha_inicio_de_cobro.value,
        (newValue, oldValue) => {
            if (newValue != '' && typeof newValue === 'string') {
                fecha_de_vencimiento.value = calcularFechaDeVencimiento(newValue)
            }
            
        }
        
    )  
    
    watch(
        () => plan_de_cuenta_id.value,
        (newValue, oldValue) => {
            if (newValue == 18) {
              unidad_de_negocio_id.value = 5
            }
            
        }
        
    )  

    
    
    const controlarMontoDeImporte = computed(() => {
        let controlar_monto_de_importe = true
        if (es_mensual.value) {
          controlar_monto_de_importe = false
        }

        return controlar_monto_de_importe
    })

    const importe_de_pagoTexto = computed(() => {
        let texto = ''
        let cantFirmas = firmasDelaCompra.value.length
        if (cantFirmas > 1) {
            if (props.compra_encabezado_id == -1) {
                let importeDividido = importe_de_compra.value/cantFirmas
                importeDividido = importeDividido.toFixed(2)
                texto = 'El Importe se dividira en '+cantFirmas+' y cada uno pagará: $'+Number(importeDividido).toLocaleString("es-AR", 'ARS')
            }
            else {
                texto = 'El Importe se ha dividido en '+cantFirmas
            }
        }

        return texto
    })
    
    function formatoNumero(numero) {
        let decimal = {useGrouping: false }
        let moneda = { style: "currency", minimumFractionDigits: 2, maximumFractionDigits: 2 }
        //return Number(numero).toLocaleString("ARS", decimal)
        return Number(numero).toLocaleString("es-AR", 'ARS')

    }
</script>



<style scoped>
.bg-field {
  background-color: #f6f6f6;
  height: 50px;
}
.nopagado {
  background-color: #ffbdc3;
}
.pagado {
  background-color: #31cf5e;
}
</style>
