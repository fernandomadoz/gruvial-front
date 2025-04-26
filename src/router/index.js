import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import TrabajosView from '../views/TrabajosView.vue';
import TrabajoView from '../views/TrabajoView.vue';
import MaquinasView from '../views/MaquinasView.vue';
import MaquinaView from '../views/MaquinaView.vue';
import MaquinaInfoView from '../views/MaquinaInfoView.vue';
import RelacionView from '../views/RelacionView.vue';
import ClienteView from '../views/ClienteView.vue';
import ProveedorView from '../views/ProveedorView.vue';
import RecordatorioView from '../views/RecordatorioView.vue';
import ComprasView from '../views/ComprasView.vue';
import CompraView from '../views/CompraView.vue';
import ClientesView from '../views/ClientesView.vue';
import ProveedoresView from '../views/ProveedoresView.vue';
import RecordatoriosView from '../views/RecordatoriosView.vue';
import ChequesView from '../views/ChequesView.vue';
import ChequeView from '../views/ChequeView.vue';
import FacturasVentaView from '../views/FacturasVentaView.vue';
import FacturasCompraView from '../views/FacturasCompraView.vue';
import ServiciosView from '../views/ServiciosView.vue';
import CotizacionesView from '../views/CotizacionesView.vue';
import RelacionesView from '../views/RelacionesView.vue';
import LoginView from "../views/LoginView.vue";
import NotificacionesView from "../views/NotificacionesView.vue";
import Login from "../views/Login.vue";
import ChangePasswordView from '../views/ChangePasswordView.vue';
import ReportesView from '../views/ReportesView.vue';
import CargaView from '../views/CargaView.vue';

import { useDataStore } from "@/stores/DataStore";
import auth from "@/logic/auth";

//const DataStore = useDataStore();

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      beforeEnter: async (to, from) => {
        const DataStore = useDataStore();
        const result_check = await auth.checkChangePassword();
        if (result_check['data']['sino_seteo_password_propio'] != 'SI') {
          return "/change-password"
        }
      }
    },
    { 
      path: "/centro-de-notificaciones", 
      name: 'NotificacionesView',
      component: NotificacionesView 
    },
    { 
      path: "/login", 
      name: 'Login',
      component: Login 
    },
    { 
      path: "/trabajos-list", 
      name: 'TrabajosList',
      component: TrabajosView 
    },
    { 
      path: "/trabajo/:trabajo_id/:tab?", 
      name: 'Trabajo',
      component: TrabajoView,
      props: true
    },
    { 
      path: "/relacion/:accion/:relacion_id", 
      name: 'Relacion',
      component: RelacionView,
      props: true

    },
    { 
      path: "/cheque/:accion/:cheque_id", 
      name: 'Cheque',
      component: ChequeView,
      props: true

    },
    { 
      path: "/cliente/:accion/:cliente_id", 
      name: 'Cliente',
      component: ClienteView,
      props: true
    },
    { 
      path: "/proveedor/:accion/:proveedor_id", 
      name: 'Proveedor',
      component: ProveedorView,
      props: true
    },
    { 
      path: "/recordatorio/:accion/:recordatorio_id", 
      name: 'Recordatorio',
      component: RecordatorioView,
      props: true
    },
    { 
      path: "/compra/:compra_encabezado_id/:tab?", 
      name: 'Compra',
      component: CompraView,
      props: true
    },
    { 
      path: "/compras-list", 
      name: 'ComprasList',
      component: ComprasView 
    },
    { 
      path: "/clientes-list/:cod_mensaje?", 
      name: 'ClientesList',
      component: ClientesView,
      props: true
    },
    { 
      path: "/maquinas-list", 
      name: 'MaquinasList',
      component: MaquinasView 
    },
    { 
      path: "/maquina/:maquina_id/:tab?", 
      name: 'Maquina',
      component: MaquinaView,
      props: true
    },  
    { 
      path: "/maquina-info/:maquina_id/:modo?", 
      name: 'MaquinaInfo',
      component: MaquinaInfoView,
      props: true
    },  
    { 
      path: "/proveedores-list/:cod_mensaje?", 
      name: 'ProveedoresList',
      component: ProveedoresView,
      props: true
    },  
    { 
      path: "/recordatorios-list/:cod_mensaje?", 
      name: 'RecordatoriosList',
      component: RecordatoriosView,
      props: true
    },  
    { 
      path: "/cheques-list/:cod_mensaje?", 
      name: 'ChequesList',
      component: ChequesView,
      props: true
    },  
    { 
      path: "/facturas-venta-list", 
      name: 'FacturasVentaList',
      component: FacturasVentaView 
    },  
    { 
      path: "/facturas-compra-list", 
      name: 'FacturasCompraList',
      component: FacturasCompraView 
    },  
    { 
      path: "/servicios-list", 
      name: 'ServiciosList',
      component: ServiciosView 
    },  
    { 
      path: "/cotizaciones-list", 
      name: 'CotizacionesList',
      component: CotizacionesView 
    },   
    { 
      path: "/relaciones-list/:cod_mensaje?", 
      name: 'RelacionesList',
      component: RelacionesView,
      props: true
    },    
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    },
    { 
      path: "/change-password", 
      name: 'CangePassword',
      component: ChangePasswordView 
    },
    { 
      path: "/reportes", 
      name: 'ReportesView',
      component: ReportesView 
    },
    { 
      path: "/carga", 
      name: 'CargaView',
      component: CargaView 
    },
  ]
});

router.beforeEach(async (to, from) => {
  const DataStore = useDataStore();

  if (
    // make sure the user is authenticated
    !DataStore.isLogged &&
    // ❗️ Avoid an infinite redirect
    to.name !== 'Login' &&
    // ❗️ Avoid an infinite redirect
    to.name !== 'CargaView'
  ) {
    // redirect the user to the login page
    return { name: 'Login' }
  }
})

router.beforeEach((to) => {
  // ✅ This will work because the router starts its navigation after
  // the router is installed and pinia will be installed too
  const store = useDataStore()

  if (to.meta.requiresAuth && !store.isLoggedIn) return '/login'
})


export default router
