import { createRouter, createWebHistory } from "vue-router";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Login from "../views/Login.vue";
import Register from "../views/Register.vue";
import Admin from "../views/Admin.vue";
import Overview from "../views/Overview.vue";
import NovaPoshta from "../views/NovaPoshta.vue";
import Products from "../views/Products.vue";
import POS from "../views/POS.vue";
import Orders from "../views/Orders.vue";
import Clients from "../views/Clients.vue";
import Inventory from "../views/Inventory.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "admin",
      component: Admin,
      meta: {
        requiresAuth: true,
      },
      children: [
        {
          path: "overview",
          name: "overview",
          component: Overview,
        },
        {
          path: "products",
          name: "products",
          component: Products,
        },
        {
          path: "pos",
          name: "pos",
          component: POS,
        },
        {
          path: "clients",
          name: "clients",
          component: Clients,
        },
        {
          path: "orders",
          name: "orders",
          component: Orders,
        },
        {
          path: "inventory",
          name: "inventory",
          component: Inventory,
        },
        {
          path: "novaposhta",
          name: "novaposhta",
          component: NovaPoshta,
        },
      ],
    },
    {
      path: "/login",
      name: "login",
      component: Login,
    },
    {
      path: "/register",
      name: "register",
      component: Register,
    },
    
    
  ],
});

const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    const removeListener = onAuthStateChanged(
      getAuth(),
      (user) => {
        removeListener();
        resolve(user);
      },
      reject
    );
  });
};

router.beforeEach(async (to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (await getCurrentUser()) {
      next();
    } else {
      next("/login");
    }
  } else {
    next();
  }
});

export default router;
