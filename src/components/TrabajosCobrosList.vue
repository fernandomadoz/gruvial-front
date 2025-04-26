<template>

    <v-dialog
      v-model="dialog"
      persistent
    >
        <template v-slot:activator="{ props }">
              <v-alert type="success" v-show="mensaje != null">{{ mensaje }}</v-alert>
              <hr  v-show="mensaje != null" />    

              <v-btn
                size="small"
                color="yellow"
                v-bind="props"
                @click="ABMLinea('A', null)"
            >Insertar</v-btn> 
            
            <v-btn
                size="small"
                color="default"
                @click="actualizarLista"
                class="mx-2"
                >Actualizar
            </v-btn> 

            <!-- Inicio Tabla de Cobros -->
                <v-table v-show="!loading_list">
                    <thead>
                    <tr>
                        <th class="text-left">Accion</th>
                        <th class="text-left pointer" @click="cambiarOrdenCobros('id')">id</th>
                        <th class="text-left pointer" @click="cambiarOrdenCobros('confirmado')">Confirmado</th>
                        <th class="text-left pointer" @click="cambiarOrdenCobros('fecha_de_cobro_f')">Fecha de cobro</th>
                        <!--th class="text-left pointer" @click="cambiarOrdenCobros('persona_que_cobro.name')">Persona que cobro</th-->
                        <!--th class="text-left pointer" @click="cambiarOrdenCobros('cuenta_de_destino.detalle_select')">Cuenta destino</th-->
                        <th class="text-left pointer" @click="cambiarOrdenCobros('tipo_de_cobro.tipo_de_cobro')">Tipo de cobro</th>
                        <th class="text-left pointer" @click="cambiarOrdenCobros('importe_total')">Importe Total</th>
                        <th class="text-left pointer" @click="cambiarOrdenCobros('importe_total_con_retenciones')">Importe Total con Retenciones</th>
                        <!--th class="text-left pointer" @click="cambiarOrdenCobros('importe_total_facturado')">Facturado</th-->
                        <!--th class="text-left pointer" @click="cambiarOrdenCobros('diferencia_cobrado_facturado')">Diferencia</th-->
                        <!--th class="text-left pointer" @click="cambiarOrdenCobros('deposito_de_cobro.deposito_detalle')">Deposito de cobro</th-->
                        <!--th class="text-left pointer" @click="cambiarOrdenCobros('cheque.detalle_select')">Cheque de cobro</th-->
                        <!--th class="text-left pointer" @click="cambiarOrdenCobros('deposito_de_destino.deposito_detalle')">Deposito Destino</th-->
                        <th class="text-left pointer" @click="cambiarOrdenCobros('facturas')">Facturas Asociadas</th>
                        <th class="text-left pointer" @click="cambiarOrdenCobros('observaciones')">Observaciones</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr
                        v-for="item in listaCobros"
                        :key="item.id"
                        v-bind:class="classCobro(item)"
                    >
                        <td>
                            <v-btn
                                size="small"
                                icon="mdi-pencil"
                                color="yellow"
                                @click="ABMLinea('M', item)"
                                v-bind="props"
                            ></v-btn> 
                            <v-btn
                                size="small"
                                icon="mdi-close-circle"
                                color="yellow"
                                @click="ABMLinea('B', item)"
                                v-bind="props"
                            ></v-btn>
                        </td>
                        <td>{{ (item.id) }}</td>
                        <td>{{ item.confirmado }} </td>
                        <td>{{ item.fecha_de_cobro }}</td>
                        <!--td>{{ item.persona_que_cobro_id > 0 ? item.persona_que_cobro.name : '' }}</td-->
                        <!--td>{{ item.cuenta_de_destino_id > 0 ? item.cuenta_de_destino.detalle_select : '' }}</td-->
                        <td>{{ (item.tipo_de_cobro.tipo_de_cobro) }}</td>
                        <td valign="top" class="text-h6">${{ formatoNumero(item.importe_total) }}</td>
                        <td valign="top" class="text-h6">${{ formatoNumero(item.importe_total_con_retenciones) }}</td>
                        <!--td>${{ formatoNumero(item.importe_total_facturado) }}</td-->
                        <!--td>${{ formatoNumero(item.diferencia_cobrado_facturado) }}</td-->
                        <!--td>{{ item.deposito_de_cobro_id > 0 ? item.deposito_de_cobro.deposito_detalle : '' }}</td-->
                        <!--td>{{ item.cheque_id > 0 ? item.cheque.detalle_select : '' }}</td-->
                        <!--td>{{ item.deposito_de_destino_id > 0 ? item.deposito_de_destino.deposito_detalle : '' }}</td-->
                        <td valign="top" class="text-h6">${{ formatoNumero(item.importe_total_facturado) }}<br>
                            <v-expansion-panels v-if="item.facturas.length>4">
                                <v-expansion-panel v-bind:class="classCobro(item)" >
                                    <v-expansion-panel-title>Facturas asociadas</v-expansion-panel-title>
                                    <v-expansion-panel-text>
                                        <v-chip
                                            size="small"
                                            v-for="factura in item.facturas"
                                            :key="factura"
                                            class="m-1"
                                            >
                                            ${{ formatoNumero(factura.importe_total) }} (Factura nro: {{ factura.nro_de_factura }} | id: {{ factura.id }})
                                        </v-chip>
                                    </v-expansion-panel-text>
                                </v-expansion-panel>
                            </v-expansion-panels>

                            
                            <v-chip v-else
                                size="small"
                                v-for="factura in item.facturas"
                                :key="factura"
                                class="m-1"
                                >
                                ${{ formatoNumero(factura.importe_total) }} (Factura nro: {{ factura.nro_de_factura }} | id: {{ factura.id }})
                            </v-chip>

                        </td>
                        <td>{{ item.observaciones }}</td>
                    </tr>
                    </tbody>
                </v-table>
            <!-- Fin Tabla de Cobros -->
                
            <v-row v-show="loading_list" class="mt-4">
                <v-container>
                    <v-progress-circular
                    indeterminate
                    color="amber"
                    ></v-progress-circular>
                </v-container>
            </v-row>

        </template>
  

        <v-card>
            <v-card-title>
                <v-row>

                    <v-col cols="12" sm="2" md="11">
                        <span class="text-h5">Cobro</span>
                    </v-col>
                    <v-col cols="1" sm="1" md="1">
                        <v-icon
                            class="float-right"
                            icon="mdi-close-circle"
                            color="grey"
                            @click="dialog = false"
                        ></v-icon>
                    </v-col>
                </v-row>
            </v-card-title>
            <v-card-text>
                <v-container>
                    
                    <v-form
                        ref="formCobros"
                        v-model="validCobro"
                        lazy-validation
                    >
                        
                            <!-- INICIO ENCABEZADO COBROS -->
                            <v-row>
                                
                
                                <v-col cols="12" sm="4" md="4">
                                    <v-switch
                                        :disabled="deshabilitarEdicionCamposABMCobros"
                                        v-model="confirmado"
                                        color="success"
                                        label="Cobro recibido o verificado por Cristina"
                                        class="float-left"
                                    ></v-switch>
                                </v-col>
                                
                                <v-col cols="12" sm="4" md="4">
                                    <v-autocomplete
                                        v-model="cobro.tipo_de_cobro.id"
                                        :items="tipos_de_cobros"
                                        :disabled="deshabilitarEdicionCamposABMCobros"
                                        :rules="tipo_de_cobroRules"
                                        :hint="txtNotificarCambioTipoDeCobro"
                                        item-title="tipo_de_cobro"
                                        item-value="id"
                                        required
                                        dense
                                        filled
                                        label="Tipo de Cobro *"
                                    ></v-autocomplete> 
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col cols="12" sm="6" md="4">
                                    <v-text-field
                                        :disabled="deshabilitarEdicionCamposABMCobros"
                                        v-model="cobro.fecha_de_cobro_f"
                                        :rules="fecha_de_cobroRules"
                                        label="Fecha de Cobro *"
                                        type="date"
                                        required
                                    ></v-text-field>  
                                </v-col>
                                <v-col cols="12" sm="6" md="4">
                                    <v-autocomplete
                                        v-model="cobro.persona_que_cobro.id"
                                        :items="personas"
                                        :disabled="deshabilitarEdicionCamposABMCobros"
                                        :rules="persona_que_cobroRules"
                                        item-title="detalle_select"
                                        item-value="id"
                                        dense
                                        required
                                        filled
                                        label="Persona que cobro *"
                                    ></v-autocomplete>      
                                </v-col>
                                <v-col cols="12" sm="6" md="4">
                                    <v-select
                                        v-model="cobro.cuenta_de_destino.id"
                                        :items="cuentas"
                                        :disabled="deshabilitarEdicionCamposABMCobros"
                                        item-title="detalle_select"
                                        item-value="id"
                                        label="Cuenta destino *"
                                        required
                                        :rules="cuenta_de_destinoRules"
                                        return-object
                                    ></v-select>     
                                </v-col>
                            </v-row>
                            <!-- FIN ENCABEZADO COBROS -->

                            <!-- INICIO DEPOSITO -->
                            <!--v-row>
                                <v-col cols="12" sm="6" md="4">
                                    <v-text-field
                                        v-show="tipo_de_cobro_id == 2"
                                        :disabled="deshabilitarEdicionCamposABMCobros"
                                        v-model="cobro.deposito_de_cobro.fecha_de_deposito_f"
                                        label="Fecha de deposito *"
                                        type="date"
                                        required
                                    ></v-text-field>  
                                </v-col>
                            </v-row-->
                            <!-- FIN DEPOSITO -->

                            
                            <!-- INICIO CHEQUE -->
                            <v-row v-show="tipo_de_cobro_id == 3 || tipo_de_cobro_id == 4">

                                <!-- SEPARADOR -->
                                <v-col cols="12" sm="12" md="12">
                                    <v-list-subheader class="font-weight-black">
                                        DATOS DEL CHEQUE
                                        <v-chip color="green" variant="flat"  v-show="cobro.cheque.entregado" class="ml-4">
                                            {{ cobro.cheque.entregado }}
                                        </v-chip>
                                    </v-list-subheader>
                                    <v-divider class="border-opacity-100 my-0 py-0" :thickness="5"></v-divider>
                                </v-col>

                                <v-col cols="12" sm="6" md="4">
                                    <v-text-field
                                        v-model="cobro.cheque.emisor"
                                        :disabled="deshabilitarEdicionCamposABMCobros"
                                        maxlength="100"
                                        required
                                        counter="100"
                                        label="Emisor"
                                    ></v-text-field>      
                                </v-col>
                                <v-col cols="12" sm="6" md="4">
                                    <v-text-field
                                        v-model="cobro.cheque.numero_de_cheque"
                                        :disabled="deshabilitarEdicionCamposABMCobros"
                                        required
                                        maxlength="30"
                                        counter="30"
                                        label="Nro Cheque"
                                    ></v-text-field>      
                                </v-col>
                                <v-col cols="12" sm="6" md="4">
                                    <v-autocomplete
                                        v-model="cobro.cheque.banco.id"
                                        :items="bancos"
                                        :disabled="deshabilitarEdicionCamposABMCobros"
                                        item-title="nombre_del_banco"
                                        item-value="id"
                                        dense
                                        filled
                                        label="Banco *"
                                        required
                                    ></v-autocomplete>      
                                </v-col>
                                <!--v-col cols="12" sm="6" md="4">
                                    <v-text-field
                                        :disabled="deshabilitarEdicionCamposABMCobros"
                                        v-model="cobro.cheque.fecha_de_emision_f"
                                        label="Fecha de Emisión *"
                                        type="date"
                                        required
                                    ></v-text-field>  
                                </v-col-->
                                <v-col cols="12" sm="6" md="4">
                                    <v-text-field
                                        :disabled="deshabilitarEdicionCamposABMCobros"
                                        v-model="cobro.cheque.fecha_inicio_de_cobro_f"
                                        label="Fecha de Inicio de Cobro *"
                                        type="date"
                                        required
                                    ></v-text-field>  
                                </v-col>

                                <v-col cols="12" sm="6" md="4">
                                    <v-text-field
                                        :disabled="deshabilitarEdicionCamposABMCobros"
                                        v-model="cobro.cheque.fecha_de_vencimiento_f"
                                        label="Fecha de Vencimiento *"
                                        type="date"
                                        required
                                        readonly
                                    ></v-text-field>  
                                </v-col>

                                <v-col cols="12" sm="6" md="4">
                                    <v-select
                                        v-model="cobro.cheque.causa_de_baja_de_cheque.id"
                                        :items="causas_de_bajas_de_cheques"
                                        :disabled="deshabilitarEdicionCamposABMCobros"
                                        item-title="causa_de_baja_de_cheque"
                                        item-value="id"
                                        label="Causa de No Cobro"
                                        return-object
                                        clearable
                                    ></v-select>     
                                </v-col>

                                

                                <v-col cols="12" sm="6" md="4">
                                    <v-text-field
                                        v-show="!cobro.cheque.entregado"
                                        :disabled="deshabilitarEdicionCamposABMCobros"
                                        v-model="cobro.cheque.fecha_de_cobro_f"
                                        label="Fecha de Acreditación del Cheque"
                                        type="date"
                                        required
                                        clearable
                                    ></v-text-field>  
                                </v-col>

                            </v-row>
                            <!-- FIN CHEQUE -->

                            

                            <!-- INICIO IMPORTES -->                                
                                
                                <!-- SEPARADOR -->
                                <v-col cols="12" sm="12" md="12">
                                    <v-list-subheader class="font-weight-black">IMPORTES DEL COBRO</v-list-subheader>
                                    <v-divider class="border-opacity-100 my-0 py-0" :thickness="5"></v-divider>
                                </v-col>
                                

                                <v-row>
                                    <v-col cols="12" sm="6" md="4">
                                        <!--v-text-field
                                            :disabled="deshabilitarEdicionCamposABMCobros"
                                            v-model="importe_total"
                                            :rules="importeRules"
                                            :label="tipo_de_cobro_detalle"
                                            type="number"
                                            min="0"
                                            required
                                            prefix="$"
                                        ></v-text-field--> 

                                        <MoneyField
                                            :disabled="deshabilitarEdicionCamposABMCobros"
                                            v-model="importe_total"
                                            :rules="importeRules"
                                            :options="currencyOptions_general"
                                            :label="tipo_de_cobro_detalle"
                                            required="required"
                                        >
                                        </MoneyField>  
                                    </v-col>

                                    <!--v-col cols="12" sm="6" md="4">                                
                                        <MoneyField
                                            :disabled="deshabilitarEdicionCamposABMCobros"
                                            v-model="importe_neto"
                                            :rules="requeridoRules"
                                            :options="currencyOptions_general"
                                            label="Neto *"
                                            required="required"
                                        >
                                        </MoneyField> 
                                    </v-col>

                                    
                                    <v-col cols="12" sm="6" md="4">
                                        <MoneyField
                                            :disabled="deshabilitarEdicionCamposABMCobros"
                                            v-model="importe_iva"
                                            :rules="requeridoRules"
                                            :options="currencyOptions_general"
                                            label="Iva *"
                                            required="required"
                                        >
                                        </MoneyField> 
                                    </v-col-->
                                </v-row>

                                <v-row>  
                                    <v-col cols="12" sm="6" md="6">
                                        <v-switch
                                            v-model="otros_importes"
                                            label="cargar retenciones"
                                            color="success"
                                        ></v-switch>
                                    </v-col>
                                </v-row>
                                

                                <v-row v-show="!otros_importes">  
                                    <v-col cols="12" sm="6" md="6">
                                        <v-switch
                                            v-model="cobro.carga_de_retenciones_pendientes"
                                            label="carga de retenciones pendientes y envio de recordatorios"
                                            color="success"
                                        ></v-switch>
                                    </v-col>
                                </v-row>
                                
                                
                                <v-row v-show="cobro.carga_de_retenciones_pendientes">         

                                    <v-col cols="12" sm="12" md="12">
                                        <v-alert
                                            density="compact"
                                            text="Esto enviara a partir de mañana y cada 5 dias, un recordatorio de solicitud de retenciones a el mail y whatsapp. El email saldra de info@gruvial.com.ar y el whatsapp desde 3804201747."
                                            title="Info importante"
                                            type="warning"
                                            class="ml-4"
                                        ></v-alert>
                                    </v-col>
                                                    
                                    
                                    <v-col cols="12" sm="6" md="4">
                                        <v-text-field
                                            :disabled="deshabilitarEdicionCamposABMCobros"
                                            v-model="cobro.email_notificar_reclamo_de_retenciones"
                                            label="Email para reclamo de retenciones"
                                            type="text"
                                            :rules="email_celular_notificar_reclamo_de_retencionesRules"
                                            ></v-text-field>  
                                    </v-col>                                   
                                
                                    <v-col cols="12" sm="6" md="4">
                                        <v-text-field
                                            :disabled="deshabilitarEdicionCamposABMCobros"
                                            v-model="cobro.celular_notificar_reclamo_de_retenciones"
                                            label="Celular para reclamo de retenciones"
                                            type="text"
                                            :rules="email_celular_notificar_reclamo_de_retencionesRules"
                                            ></v-text-field>  
                                    </v-col>    

                                    <v-col cols="12" sm="12" md="12">
                                        <v-textarea
                                            :disabled="deshabilitarEdicionCamposABMCobros"
                                            label="Texto para reclamo de retenciones *"
                                            counter="250"
                                            maxlength="250"
                                            v-model="cobro.texto_notificar_reclamo_de_retenciones"
                                            :rules="texto_notificar_reclamo_de_retencionesRules"
                                            ></v-textarea>
                                    </v-col>                               
                                    <v-divider></v-divider>
                                </v-row>

                                <v-row v-show="otros_importes">            
                                                                       
                                    <v-col cols="12" sm="6" md="4">
                                        <!--v-text-field
                                            :disabled="deshabilitarEdicionCamposABMCobros"
                                            v-model="retencion_iibb"
                                            :rules="requeridoRules"
                                            label="Retención IIBB *"
                                            type="number"
                                            min="0"
                                            prefix="$"
                                        ></v-text-field-->  
                                
                                        <MoneyField
                                            :disabled="deshabilitarEdicionCamposABMCobros"
                                            v-model="retencion_iibb"
                                            :rules="requeridoRules"
                                            :options="currencyOptions_general"
                                            label="Retención IIBB *"
                                            required="required"
                                        >
                                        </MoneyField>
                                    </v-col>

                                    
                                    <v-col cols="12" sm="6" md="4">
                                        <!--v-text-field
                                            :disabled="deshabilitarEdicionCamposABMCobros"
                                            v-model="retencion_ganancias"
                                            :rules="requeridoRules"
                                            label="Retención Ganancias *"
                                            type="number"
                                            min="0"
                                            prefix="$"
                                        ></v-text-field-->  
                                
                                        <MoneyField
                                            :disabled="deshabilitarEdicionCamposABMCobros"
                                            v-model="retencion_ganancias"
                                            :rules="requeridoRules"
                                            :options="currencyOptions_general"
                                            label="Retención Ganancias *"
                                            required="required"
                                        >
                                        </MoneyField>
                                    </v-col>

                                    
                                    <v-col cols="12" sm="6" md="4">
                                        <!--v-text-field
                                            :disabled="deshabilitarEdicionCamposABMCobros"
                                            v-model="retencion_suss"
                                            :rules="requeridoRules"
                                            label="Retención SUSS *"
                                            type="number"
                                            min="0"
                                            prefix="$"
                                        ></v-text-field-->  
                                
                                        <MoneyField
                                            :disabled="deshabilitarEdicionCamposABMCobros"
                                            v-model="retencion_suss"
                                            :rules="requeridoRules"
                                            :options="currencyOptions_general"
                                            label="Retención SUSS *"
                                            required="required"
                                        >
                                        </MoneyField>
                                    </v-col>

                                    
                                    <v-col cols="12" sm="6" md="4">
                                        <!--v-text-field
                                            :disabled="deshabilitarEdicionCamposABMCobros"
                                            v-model="retencion_iva"
                                            :rules="requeridoRules"
                                            label="Retención IVA *"
                                            type="number"
                                            min="0"
                                            prefix="$"
                                        ></v-text-field-->  
                                
                                        <MoneyField
                                            :disabled="deshabilitarEdicionCamposABMCobros"
                                            v-model="retencion_iva"
                                            :rules="requeridoRules"
                                            :options="currencyOptions_general"
                                            label="Retención IVA *"
                                            required="required"
                                        >
                                        </MoneyField>
                                    </v-col>

                                    
                                    <v-col cols="12" sm="6" md="4">
                                        <!--v-text-field
                                            :disabled="deshabilitarEdicionCamposABMCobros"
                                            v-model="retencion_otra"
                                            :rules="requeridoRules"
                                            label="Retención Otra *"
                                            type="number"
                                            min="0"
                                            prefix="$"
                                        ></v-text-field-->  
                                
                                        <MoneyField
                                            :disabled="deshabilitarEdicionCamposABMCobros"
                                            v-model="retencion_otra"
                                            :rules="requeridoRules"
                                            :options="currencyOptions_general"
                                            label="Retención Otra *"
                                            required="required"
                                        >
                                        </MoneyField>
                                    </v-col>
                                </v-row>
                            <!-- FIN IMPORTES -->



                            <!-- INICIO DEPOSITO DESTINO -->
                                
                            <v-row v-show="tipo_de_cobro_id == 1 || tipo_de_cobro_id == 3">
                                
                                <v-divider class="border-opacity-100 my-0 pt-5" :thickness="2"></v-divider>
                                
                                <v-col cols="12" sm="12" md="12">
                                    <v-switch
                                        :disabled="deshabilitarEdicionCamposABMCobros"
                                        v-model="cobro_depositado"
                                        color="success"
                                        :label="'A su vez, este Cobro en '+tipo_de_cobro+' se ha depositado'"
                                    ></v-switch>
                                </v-col>
                            </v-row>

                            <v-row v-show="(tipo_de_cobro_id == 1 || tipo_de_cobro_id == 3) && cobro_depositado">
                                <v-col cols="12" sm="6" md="4">
                                    <v-text-field
                                        :disabled="deshabilitarEdicionCamposABMCobros"
                                        v-model="cobro.deposito_de_destino.fecha_de_deposito_f"
                                        label="Fecha de deposito"
                                        type="date"
                                        required
                                    ></v-text-field>  
                                </v-col>                                   
                                <v-col cols="12" sm="6" md="4">
                                    <v-autocomplete
                                        v-model="cobro.deposito_de_destino.persona_que_deposito.id"
                                        :items="personas"
                                        :disabled="deshabilitarEdicionCamposABMCobros"
                                        item-title="detalle_select"
                                        item-value="id"
                                        dense
                                        filled
                                        label="Persona que Deposito *"
                                        required
                                    ></v-autocomplete>      
                                </v-col>
                                <v-col cols="12" sm="6" md="4">
                                    <v-select
                                        v-model="cobro.deposito_de_destino.cuenta_de_destino.id"
                                        :items="cuentas"
                                        :disabled="deshabilitarEdicionCamposABMCobros"
                                        item-title="detalle_select"
                                        item-value="id"
                                        label="Cuenta destino *"
                                        required
                                    ></v-select>     
                                </v-col>
                                
                                <v-col cols="12" sm="12" md="12">
                                    <v-radio-group 
                                    v-model="se_deposito_destino"
                                    v-show="tipo_de_cobro_id == 3 && cobro_depositado"
                                    >
                                    <template v-slot:label>
                                        <div><strong>Se deposito</strong></div>
                                    </template>
                                    <v-radio value="deposito_destino_cheque">
                                        <template v-slot:label>
                                        <div>El Cheque</div>
                                        </template>
                                    </v-radio>
                                    <v-radio value="deposito_destino_efectivo">
                                        <template v-slot:label>
                                        <div>En Efectivo</div>
                                        </template>
                                    </v-radio>
                                    </v-radio-group>
                                </v-col>
                            </v-row>
                            <!-- FIN DEPOSITO DESTINO -->

                            <!-- SECCION FINAL -->  
                            <v-row>                        
                                <!-- FACTURAS ASOCIADAS -->  
                                <v-col cols="12" sm="12" md="12" v-show="Object.keys(facturas_de_trabajo).length>0"> 
                                        <p>Seleccione las facturas pagadas:</p>
                                        <v-checkbox class="checkbox_factura"                                    
                                        v-for="item in facturas_de_trabajo"
                                        :key="item.id"
                                        :value="item.id"
                                        v-model="facturas"
                                        v-show="!item.factura_saldada || facturas.includes(item.id) || mostrarFacturasOk"
                                        >
                                        <template v-slot:label>
                                            {{ labelFactura(item) }}
                                        </template>
                                    </v-checkbox>
                                </v-col>
                                <v-col cols="12" sm="12" md="12" v-show="Object.keys(facturas_de_trabajo).length>0"> 
                                    <v-switch v-model="mostrarFacturasOk" label="Mostrar todas las facturas" color="success"></v-switch>
                                </v-col>
                                <!-- OBSERVACIONES -->                            
                                <v-col cols="12" sm="12" md="12">
                                    <v-textarea
                                        :disabled="deshabilitarEdicionCamposABMCobros"
                                        label="Observaciones generales del cobro"
                                        counter="250"
                                        maxlength="250"
                                        v-model="cobro.observaciones"
                                    ></v-textarea>
                                </v-col>
                            </v-row>       
                            <!-- FIN SECCION FINAL -->  


                            <!--  SERVICIOS FACTURADOS-->
                                <v-col cols="12" sm="12" md="12" v-show="Object.keys(lineas_de_trabajo).length>0 && firma_id == 2"> 
                                    <p>Seleccione los servicios cobrados:</p>
                                    <v-checkbox class="checkbox_remito"                                    
                                    v-for="item in lineas_de_trabajo"
                                    :disabled="deshabilitarEdicionCamposABMEncabezado"
                                    :key="item.id"
                                    :label="item.fecha_inicio +' '+item.maquina?.nombre_de_maquina + ' $ '+formatoNumero(item.importe) "
                                    :value="item.id"
                                    v-model="lineas"
                                    ></v-checkbox>
                                </v-col>

                                <!-- v-show="lineas.includes(item.id) || mostrarLineasOk" -->
                                
                                <!--v-col cols="12" sm="12" md="12" v-show="Object.keys(lineas_de_trabajo).length>0 && firma_id == 2"> 
                                    <v-switch v-model="mostrarLineasOk" label="Mostrar todos los servicios" color="success"></v-switch>
                                </v-col-->
                            <!--  SERVICIOS FACTURADOS-->



                        <v-spacer></v-spacer>
                        <v-btn
                            class="ma-2"
                            color="primary"
                            @click="validate"
                        >
                            <v-icon
                            start
                            icon="mdi-content-save"
                            ></v-icon>
                            {{ botonABM }}  
                        </v-btn>
                        <v-btn
                            class="ma-2"
                            color="grey"
                            @click="dialog = false"
                            :disabled="loading"
                        >
                            <v-icon
                            start
                            icon="mdi-content-save"
                            ></v-icon>
                            Cerrar  
                        </v-btn>
                        
                        <v-progress-circular
                        indeterminate
                        color="amber"
                        v-show="loading"
                        ></v-progress-circular>

                    </v-form>

                </v-container>
                <small>*Campos obligatorios</small>
            </v-card-text>
            <v-card-actions>

            </v-card-actions>
        </v-card>
    </v-dialog>

</template>

<script setup>
  import { ref, watch, reactive, computed } from "vue";
  import axios from "axios";
  import { useData } from '../composables/useData';
  import router from "@/router";
  import { isProxy, toRaw } from 'vue';
  import MoneyField from '../components/MoneyField.vue';
  import { cambiarOrden, crearOrdenActual } from '@/utils/sortUtils';

  const { token, headersAxios, trabajo_encabezado_id, user_id, firma_id } = useData();
  const ENDPOINT_PATH_API = ref(import.meta.env.VITE_ENDPOINT_PATH+'api/')
  const mensaje = ref(null);
  const loading = ref(false)
  const loading_list = ref(false)
  let dialog = ref(false)
  let cobro = ref({
            tipo_de_cobro: {
                id: 1
            }})
    const obj = reactive({ count: 0 })
          
  let cobro_id = ref(null)
  let botonABM = ref(null)
  let deshabilitarEdicionCamposABMCobros = ref(false)
  let accionABM = ref(null)
  let importe_neto = ref(null)
  let importe_iva = ref(null)
  let retencion_iibb = ref(null)
  let retencion_ganancias = ref(null)
  let retencion_suss = ref(null)
  let retencion_iva = ref(null)
  let retencion_otra = ref(null)
  let importe_total = ref(null)
  let tipo_de_cobro_detalle = ref('Importe Total')
  let cobro_depositado = ref(null)
  let se_deposito_destino = ref(null)
  let tipo_de_cobro_id = ref(1)
  let tipo_de_cobro = ref(null)
  let tipo_de_cobro_id_original = ref(null)
  let txtNotificarCambioTipoDeCobro = ref(null)
  let confirmado = ref(false)
  let otros_importes = ref(false)
  let mostrarFacturasOk = ref(false)
  const listaCobros = ref(null)
  let lineas = ref([])
  const mostrarLineasOk = ref(false)

  const currencyOptions_general = ref({
    locale: 'es-AR', 
    currency: 'ARS', 
    distractionFree: false, 
    precision: 2, 
    //valueRange: {min: 1}, 
    autoDecimalMode: true, 
  })

  //Variables trabajos_encabezados
  const formCobros = ref(null) 
  let facturas = ref([])

  let json = JSON.stringify({ 
      trabajo_encabezado_id: trabajo_encabezado_id.value
  });

  //Traigo los Cobros
  actualizarLista()
          
  //Traigo personas
  const body_personas = await axios.get(ENDPOINT_PATH_API.value + "persona", {headers: headersAxios.value[0]})
  let personas = body_personas['data']
          
  //Traigo cuentas
  const body_cuentas = await axios.get(ENDPOINT_PATH_API.value + "cuenta", {headers: headersAxios.value[0]})
  let cuentas = body_cuentas['data']

  //Traigo firmas
  const body_firmas = await axios.get(ENDPOINT_PATH_API.value + "firma", {headers: headersAxios.value[0]})
  let firmas = body_firmas['data']

  //Traigo bancos
  const body_bancos = await axios.get(ENDPOINT_PATH_API.value + "banco", {headers: headersAxios.value[0]})
  let bancos = body_bancos['data']

  //Traigo causa de baja de cheques
  const body_causas_de_bajas_de_cheques = await axios.get(ENDPOINT_PATH_API.value + "causa-de-baja-de-cheque", {headers: headersAxios.value[0]})
  let causas_de_bajas_de_cheques = body_causas_de_bajas_de_cheques['data']

  //Traigo tipos de cobros
  const body_tipos_de_cobros = await axios.get(ENDPOINT_PATH_API.value + "tipo-de-cobro", {headers: headersAxios.value[0]})
  let tipos_de_cobros = body_tipos_de_cobros['data']

  //Traigo las facturas
  let body_facturas = await axios.post(ENDPOINT_PATH_API.value + "facturas-de-trabajo", json, {headers: headersAxios.value[0]});
  let facturas_de_trabajo = body_facturas['data']

  //Traigo los servicios o lineas de trabajo
  let body_lineas = await axios.post(ENDPOINT_PATH_API.value + "trabajo-linea-listar", json, {headers: headersAxios.value[0]});
  let lineas_de_trabajo = body_lineas['data']

  // ----- Inicio: Validación y envio del Formulario Encabezado

  //Rules de los Campos
  let validCobro = ref(true);
  const fecha_de_cobroRules = [
    v => !!v || 'Fecha de Cobro Es requerido'
  ];
  const cuenta_de_destinoRules = [
    v => !!v || 'Cuenta Destino Es requerido'
  ];
  const persona_que_cobroRules = [
    v => !!v || 'Persona es requerido'
  ];
  const tipo_de_cobroRules = [
    v => !!v || 'Tipo de cobro Es requerido'
  ];

  let importeRules = [
      value => {
          if (value) {
            if (value==0) {
                return 'debe ser mayor a cero'
            }
          }
          else {
            return 'Es requerido'
          }
          return true
      }
  ]


  let texto_notificar_reclamo_de_retencionesRules = [
      value => {
          if (cobro.value.carga_de_retenciones_pendientes && !value) {
            return 'Debes escribir el mensaje que se enviara cada 5 dias'
          }
          return true
      }
  ]

  let email_celular_notificar_reclamo_de_retencionesRules = [
      value => {
          if (cobro.value.carga_de_retenciones_pendientes && !cobro.value.celular_notificar_reclamo_de_retenciones && !cobro.value.email_notificar_reclamo_de_retenciones) {
            return 'Debes completar al menos el email o el celular'
          }
          return true
      }
  ]
  

  const requeridoRules = [
    v => !!v || 'este valor es requerido, puede ser cero también'
  ];
  /*
  const requeridoRules = [
    v => (!!v || v==0) || 'Es requerido'
  ];
  */
/*
  let requeridoRules = [
      value => {
          if (value) {

            
            if (!value) {
                return 'E-mail es requerido'
            }
            
            if (value && !(/.+@.+\..+/.test(value))) {
                return 'E-mail debe ser valido'
            }
          }
          else {
            return 'Es requerido'
          }
          return true
      }
  ]
*/

  //Valido el Formulario
  async function validate () {
    let vaaaa = await formCobros.value.validate()
    console.log('entro')
    if (validCobro.value || accionABM.value == 'B') {
        enviarFormCobro()
    }    
    else {
        console.log(vaaaa)
    }
  }
  
  //Envio el Formulario
  async function enviarFormCobro() {

    loading.value = true

    let cuenta_de_destino_id = cobro.value.cuenta_de_destino.id
    if (typeof(cuenta_de_destino_id) == 'object') {
      cuenta_de_destino_id = cuenta_de_destino_id.id
    }
        
    let causa_de_baja_de_cheque_id = cobro.value.cheque.causa_de_baja_de_cheque.id
    if (causa_de_baja_de_cheque_id != null) {    
        if (typeof(causa_de_baja_de_cheque_id) == 'object') {
        causa_de_baja_de_cheque_id = causa_de_baja_de_cheque_id.id
        }
    }
    let confirmado_sino = tf_a_sino(confirmado.value)

    //construjo el json a enviar a laravel
    json = JSON.stringify({ 
      trabajo_encabezado_id: trabajo_encabezado_id.value,
      fecha_de_cobro: cobro.value.fecha_de_cobro_f,
      persona_que_cobro_id: cobro.value.persona_que_cobro.id,
      cuenta_de_destino_id: cuenta_de_destino_id,
      tipo_de_cobro_id: tipo_de_cobro_id.value,
      observaciones: cobro.value.observaciones,
      importe_neto: importe_neto.value,
      importe_iva: importe_iva.value,
      retencion_iibb: retencion_iibb.value,
      retencion_ganancias: retencion_ganancias.value,
      retencion_suss: retencion_suss.value,
      retencion_iva: retencion_iva.value,
      retencion_otra: retencion_otra.value,      
      importe_total: importe_total.value,
      //deposito_de_cobro: {
      //  fecha_de_deposito: cobro.value.deposito_de_cobro.fecha_de_deposito_f
      //  },
      cheque: {
        emisor: cobro.value.cheque.emisor,
        numero_de_cheque: cobro.value.cheque.numero_de_cheque,
        banco_id: cobro.value.cheque.banco.id,
        //fecha_de_emision: cobro.value.cheque.fecha_de_emision_f,
        fecha_inicio_de_cobro: cobro.value.cheque.fecha_inicio_de_cobro_f,
        fecha_de_cobro: cobro.value.cheque.fecha_de_cobro_f,
        fecha_de_vencimiento: cobro.value.cheque.fecha_de_vencimiento_f,
        causa_de_baja_de_cheque_id: causa_de_baja_de_cheque_id
        },
      cobro_depositado: cobro_depositado.value,
      deposito_de_destino: {
        fecha_de_deposito: cobro.value.deposito_de_destino.fecha_de_deposito_f,
        persona_que_deposito_id: cobro.value.deposito_de_destino.persona_que_deposito.id,
        cuenta_de_destino_id: cobro.value.deposito_de_destino.cuenta_de_destino.id,
        se_deposito_destino: se_deposito_destino.value
      },
      user_id: user_id.value,
      confirmado: tf_a_sino(confirmado.value),
      facturas: facturas.value,
      carga_de_retenciones_pendientes: cobro.value.carga_de_retenciones_pendientes,
      email_notificar_reclamo_de_retenciones: cobro.value.email_notificar_reclamo_de_retenciones,
      celular_notificar_reclamo_de_retenciones: cobro.value.celular_notificar_reclamo_de_retenciones,
      texto_notificar_reclamo_de_retenciones: cobro.value.texto_notificar_reclamo_de_retenciones,
      lineas: lineas.value,
      
    });
    
    //Si cobro_id = -1 creo la linea de trabajo sino actualizo
    let body_abm = ''
    if (accionABM.value == 'A') {
      body_abm = await axios.post(ENDPOINT_PATH_API.value + "cobro", json, {headers: headersAxios.value[0]})
    }
    if (accionABM.value == 'M') {
      //body_abm = await axios.put(ENDPOINT_PATH_API.value + "cobro/"+cobro_id.value, json, {headers: headersAxios.value[0]})
      body_abm = await axios.post(ENDPOINT_PATH_API.value + "cobro-update/"+cobro_id.value, json, {headers: headersAxios.value[0]})
    }  
    
    if (accionABM.value == 'B') {
      //body_abm = await axios.delete(ENDPOINT_PATH_API.value + "cobro/"+cobro_id.value, json, {headers: headersAxios.value[0]})
      body_abm = await axios.post(ENDPOINT_PATH_API.value + "cobro-delete/"+cobro_id.value, json, {headers: headersAxios.value[0]})
    }      
    mensaje.value = body_abm['data'].mensaje

    //Traigo las cobros
    json = JSON.stringify({ 
        trabajo_encabezado_id: trabajo_encabezado_id.value
    });
    dialog.value = false

    
    actualizarLista()

    getTime()
    loading.value = false
  }

  function ABMLinea(accion, item) {
    accionABM.value = accion
    console.log(accion)
    facturas.value = []

    if (accion == 'A') {
        cobro_id.value = -1
        importe_neto.value = 0
        importe_iva.value = 0
        retencion_iibb.value = 0
        retencion_ganancias.value = 0
        retencion_suss.value = 0
        retencion_iva.value = 0
        retencion_otra.value = 0
        importe_total.value = 0
        cobro_depositado.value = false
        se_deposito_destino.value = null
        tipo_de_cobro_id_original.value = null
        confirmado.value = false
        otros_importes.value = false
        lineas.value = []
        cobro.value = {

            trabajo_encabezado_id: trabajo_encabezado_id.value,
            fecha_de_cobro: null,
            persona_que_cobro: {
                id: null
            },
            cuenta_de_destino: {
                id: null
            },
            tipo_de_cobro: {
                id: null
            },
            observaciones: null,
            /*
            deposito_de_cobro: {
                id: null,
                fecha_de_deposito: null,
                fecha_de_deposito_f: null
                },
            */
            cheque: {
                emisor:null,
                numero_de_cheque: null,
                banco: {
                    id: null
                    },
                //fecha_de_emision: null,
                fecha_inicio_de_cobro: null,
                fecha_de_cobro: null,
                fecha_de_vencimiento: null,
                causa_de_baja_de_cheque: {
                    id: null
                    }
                },
            deposito_de_destino: {
                fecha_de_deposito: null,
                importe: null,
                persona_que_deposito: {
                    id: null
                    },
                cuenta_de_destino: {
                    id: null
                    }            
                        
            },
            user_id: user_id.value,
            facturas: [
                {
                    factura_id: null
                }
            ],
            lineas: [
                {
                    trabajo_linea_id: null
                }
            ],

        }
        
        botonABM.value = 'Insertar';
        deshabilitarEdicionCamposABMCobros.value = false    
        
    }
    else {
        cobro.value = item
        cobro_id.value = cobro.value.id 
        importe_neto.value = cobro.value.importe_neto   
        importe_iva.value = cobro.value.importe_iva   
        retencion_iibb.value = cobro.value.retencion_iibb
        retencion_ganancias.value = cobro.value.retencion_ganancias
        retencion_suss.value = cobro.value.retencion_suss
        retencion_iva.value = cobro.value.retencion_iva
        retencion_otra.value = cobro.value.retencion_otra
        importe_total.value = cobro.value.importe_total   
        tipo_de_cobro_id_original.value = cobro.value.tipo_de_cobro.id
        otros_importes.value = checkOtrosImportes()
        if (!cobro.value.persona_que_cobro) {
            cobro.value.persona_que_cobro = {
                id: null
            }
        }  
        if (!cobro.value.cuenta_de_destino) {
            cobro.value.cuenta_de_destino = {
                id: null
            }
        }  
        if (!cobro.value.tipo_de_cobro) {
            cobro.value.tipo_de_cobro = {
                id: null
            }
        }  
        /*
        if (cobro.value.deposito_de_cobro == null) {
            cobro.value.deposito_de_cobro = {
                id: null,
                fecha_de_deposito: null,
                fecha_de_deposito_f: null
            }
        }  
        */

        // SI EL CHEQUE ES NULO
        if (!cobro.value.cheque) {
            cobro.value.cheque = {
                id: null,
                emisor: null,
                numero_de_cheque: null,
                banco: {
                    id: null
                    },
                //fecha_de_emision: null,
                fecha_de_cobro: null,
                fecha_inicio_de_cobro: null,
                fecha_de_vencimiento: null,
                causa_de_baja_de_cheque: {
                    id: null
                    }
            }
        }
        else {
            //SI HAY UN CHEQUE
            if (!cobro.value.cheque.causa_de_baja_de_cheque) {
                cobro.value.cheque.causa_de_baja_de_cheque = {
                    id: null
                    }
            }
            if (!cobro.value.cheque.banco) {
                cobro.value.cheque.banco = {
                    id: null
                    }
            }
            
            if (!cobro.value.deposito_de_destino) {
                cobro.value.deposito_de_destino = {
                    id: null,
                    persona_que_deposito: {
                        id: null
                    },
                    cuenta_de_destino: {
                        id: null
                    }
                }
            }
            /*
            if (cobro.value.deposito_de_destino.persona_que_deposito == null) {
                cobro.value.deposito_de_destino.persona_que_deposito = {
                    id: null
                    }
            }
            */
            if (!cobro.value.deposito_de_destino.cuenta_de_destino) {
                cobro.value.deposito_de_destino.cuenta_de_destino = {
                    id: null
                    }
            }
            


        }  

        // SI NO HAY DEPOSITO DESTINO 
        if (cobro.value.deposito_de_destino?.id == null) {
            cobro.value.deposito_de_destino = {
                id: null,
                fecha_de_deposito: null,
                persona_que_deposito: {
                    id: null
                    },
                cuenta_de_destino: {
                    id: null
                    },
                se_deposito_destino: null
            }
            se_deposito_destino.value = null
            cobro_depositado.value = false

        }
        else {
            // SI HAY DEPOSITO DESTINO 
            cobro_depositado.value = true
            if (!cobro.value.deposito_de_destino.cheque) {
                se_deposito_destino.value = 'deposito_destino_efectivo'
            }
            else {
                se_deposito_destino.value = 'deposito_destino_cheque'
            }
        }
        lineas.value = []
        cobro.value.lineas.forEach( function(valor, indice, array) {
            lineas.value.push(valor.trabajo_linea_id)
        });
    }
    if (accion == 'M') {
        botonABM.value = 'Modificar';
        
        facturas.value = []
        item.facturas.forEach( function(valor, indice, array) {
            facturas.value.push(valor.id)
        });
        confirmado.value = sino_a_tf(cobro.value.confirmado)

        deshabilitarEdicionCamposABMCobros.value = false       
    }
    if (accion == 'B') {
        botonABM.value = 'Eliminar';     
        deshabilitarEdicionCamposABMCobros.value = true       
        confirmado.value = sino_a_tf(cobro.value.confirmado)
    }
  }

  function sino_a_tf(sino) {
    return sino == 'SI' ? true : false
  }

  function tf_a_sino(tf) {
    console.log('tf')
    console.log(tf)
    return tf ? 'SI' : 'NO'
  }

  function getTime() {
    setTimeout(() => {
      mensaje.value = null
    }, 10 * 1000)

  }

    /*
    function traerImporte() {
        importe_neto.value = cobro.importe_neto
        importe_iva.value = cobro.importe_iva
        importe_total.value = cobro.importe_total
        if (cobro.value.tipo_de_cobro.id == 1) {
            tipo_de_cobro_detalle.value = 'Importe efectivo'
        }
        if (cobro.value.tipo_de_cobro.id == 2) {
            tipo_de_cobro_detalle.value = 'Importe depositado'
        }
        if (cobro.value.tipo_de_cobro.id == 3) {
            tipo_de_cobro_detalle.value = 'Importe del cheque'
        }

        return importe.value
    }
    */
    
    /*
    // watch works directly on a ref
    watch(tipo_de_cobro_id_original, async (newValue, oldValue) => {
        if (newValue == 2 && accionABM.value == 'M') {
            txtNotificarCambioTipoDeCobro.value = 'Este cambio, eliminirá el deposito cargado anteriormente'
        }
        if (newValue == 3 && accionABM.value == 'M') {
            txtNotificarCambioTipoDeCobro.value = 'Este cambio, eliminará el cheque cargado anteriormente'
        }
        tipo_de_cobro_id.value = newValue
    })
    */ 
    watch(
        () => cobro.value.tipo_de_cobro.id,
        (newValue, oldValue) => {
            txtNotificarCambioTipoDeCobro.value = ''
            if (tipo_de_cobro_id_original.value == 2 && accionABM.value == 'M' && (newValue == 1 || newValue == 3 || newValue == 5)) {
                txtNotificarCambioTipoDeCobro.value = 'Este cambio, eliminirá el deposito cargado anteriormente'
            }
            if (tipo_de_cobro_id_original.value == 3 && accionABM.value == 'M' && (newValue == 1 || newValue == 2 || newValue == 5)) {
                txtNotificarCambioTipoDeCobro.value = 'Este cambio, eliminará el cheque cargado anteriormente'
            }
            tipo_de_cobro_id.value = newValue
            tipo_de_cobro.value = ''
            if (newValue == 1) {
                tipo_de_cobro.value = 'Efectivo'
            }
            if (newValue == 3 || newValue == 4) {
                tipo_de_cobro.value = 'Cheque'
            }
            if (newValue == 2 || newValue == 4 || newValue == 5) {
                cobro_depositado.value = false
            }
        }
    )    

    watch(
        () => cobro.value.cheque?.fecha_inicio_de_cobro_f,
        (newValue, oldValue) => {
            if (newValue != '' && typeof newValue === 'string') {
                cobro.value.cheque.fecha_de_vencimiento_f = calcularFechaDeVencimiento(newValue)
            }
            
        }
        
    )  

    
    watch(
        () => otros_importes.value,
        (newValue, oldValue) => {
            if (newValue) {
                cobro.value.carga_de_retenciones_pendientes = false
            }
            
        }
        
    ) 
     

    

    function calcularFechaDeVencimiento(fechaStr) {
        // Convertir el string a objeto de fecha
        let fechaObj = new Date(fechaStr);

        // Sumarle 29 días
        fechaObj.setDate(fechaObj.getDate() + 29);

        // Formatear la nueva fecha como string 'yyyy-mm-dd'
        let nuevaFechaStr = fechaObj.toISOString().split('T')[0];

        return nuevaFechaStr;
    }



    function checkOtrosImportes() {
        let check = false
        if (!cobro.value.carga_de_retenciones_pendientes) {
            check = retencion_iibb.value > 0 ? true : check
            check = retencion_ganancias.value > 0 ? true : check
            check = retencion_suss.value > 0 ? true : check
            check = retencion_iva.value > 0 ? true : check
            check = retencion_otra.value > 0 ? true : check
        }
        console.log('check')
        console.log(check)
        return check
    }

    function labelFactura(item) {
        let texto = ' Factura nro: '+ item.nro_de_factura + ' $'+ formatoNumero(item.importe_total) + ' (id: '+item.id+')'
        texto += item.factura_saldada ? ' (saldada)' : ''
        //texto += item.factura_saldada ? ' (saldada)' : 'resta cobrar: '+item.importe_restante_a_cobrar
        return texto
    }
    
    function formatoNumero(numero) {
        let decimal = {useGrouping: false }
        let moneda = { style: "currency", minimumFractionDigits: 2, maximumFractionDigits: 2 }
        //return Number(numero).toLocaleString("ARS", decimal)
        return Number(numero).toLocaleString("es-AR", 'ARS')

    }

    

    // Crear una instancia de `ordenActual` utilizando la función de utilidades
    const ordenActual = crearOrdenActual();

    // Usar la función importada para cambiar el orden de `cobros`
    const cambiarOrdenCobros = (propiedad) => {
    cambiarOrden(listaCobros.value, ordenActual.value, propiedad);
    };


    async function actualizarLista() {
        listaCobros.value = null
        loading_list.value = true
        let body_lista = await axios.post(ENDPOINT_PATH_API.value + "trabajo-cobro-listar", json, {headers: headersAxios.value[0]});
        listaCobros.value = body_lista['data']
        loading_list.value = false
  
    }
    
    function classCobro(item) {
        let clase = ''
        if (item.confirmado == 'NO' || item.confirmado == '') {
            clase = 'noconfirmado'
        }
        if (item.confirmado == 'SI') {
            clase = 'confirmado'
        }
        return clase
    }

</script>


<style scoped>
.checkbox_factura {
    margin-bottom: -50px;
}

.noconfirmado {
  background-color: #ffbdc3;
}
.confirmado {
  background-color: #c4ffbd;
}

.pointer {
  cursor: pointer;
}
</style>