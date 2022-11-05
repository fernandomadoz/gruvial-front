import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import TrabajosView from '../views/TrabajosView.vue';
import LoginView from "../views/LoginView.vue";
import Login from "../views/Login.vue";
import { useDataStore } from "@/stores/DataStore";
import TrabajoView from '../views/TrabajoView.vue';

//const DataStore = useDataStore();

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    { 
      path: "/login-view", 
      name: 'LoginView',
      component: LoginView 
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
      path: "/trabajo/:id", 
      name: 'Trabajo',
      component: TrabajoView
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    }
  ]
});

router.beforeEach(async (to, from) => {
  const DataStore = useDataStore();

  if (
    // make sure the user is authenticated
    !DataStore.isLogged &&
    // ❗️ Avoid an infinite redirect
    to.name !== 'Login'
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
