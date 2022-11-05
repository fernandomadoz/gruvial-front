
import { storeToRefs } from 'pinia';
import { useDataStore } from '../stores/DataStore';


export const useData = () => {

    const DataStore = useDataStore();
    const {ENDPOINT_PATH_API, isLogged, user, token, firma_id, firmas, headersAxios, user_id, mensajeStore, trabajo_encabezado_id } = storeToRefs(DataStore);

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
    
    
    
    /*
    const { setearUser } = useData;
    const { setearEmpresa } = useData;    
    */
   

    return {
        ENDPOINT_PATH_API,
        isLogged, 
        user, 
        token, 
        firma_id, 
        user_id,
        mensajeStore,
        firmas,
        trabajo_encabezado_id,
        headersAxios,
        setearUser,
        setearFirma,
        setearMensajeStore,
        setearTrabajoEncabezadoId
    }
} 