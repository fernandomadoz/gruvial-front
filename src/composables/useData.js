
import { storeToRefs } from 'pinia';
import { useDataStore } from '../stores/DataStore';


export const useData = () => {

    const DataStore = useDataStore();
    const {isLogged, user, token, firma_id, firmas, headersAxios, headersAxiosFiles, user_id, mensajeStore, trabajo_encabezado_id, compra_encabezado_id, getRolDeUsusarioId, getOpcionesMenuPrincipal, getFirmasPorUsuario, getPermisosPorUsuario, getNotificacionesPorUsuario } = storeToRefs(DataStore);

    const setearFirma = (id) => {
        DataStore.setearFirma(id);
    }

    const setearUser = (id) => {
        DataStore.setearUser(id);
    }

    const setearMensajeStore = (mensaje) => {
        DataStore.setearMensajeStore(mensaje);
    }

    const setearTrabajoEncabezadoId = (id) => {
        DataStore.setearTrabajoEncabezadoId(id);
    }

    const setearCompraEncabezadoId = (id) => {
        DataStore.setearCompraEncabezadoId(id);
    }

    const setearRolDeUsusarioId = (id) => {
        DataStore.setearRolDeUsusarioId(id);
    }
    
    
    
    
    /*
    const { setearUser } = useData;
    const { setearEmpresa } = useData;    
    */
   

    return {
        isLogged, 
        user, 
        token, 
        firma_id, 
        user_id,
        mensajeStore,
        firmas,
        trabajo_encabezado_id,
        compra_encabezado_id,
        headersAxios,
        headersAxiosFiles,
        getRolDeUsusarioId,
        getOpcionesMenuPrincipal,
        getFirmasPorUsuario,
        getPermisosPorUsuario,
        getNotificacionesPorUsuario,
        setearUser,
        setearFirma,
        setearMensajeStore,
        setearTrabajoEncabezadoId,
        setearCompraEncabezadoId,
        setearRolDeUsusarioId
    }
} 