import { createRouter, createWebHistory } from "vue-router";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Home from "../views/Home.vue";
import Store from "../views/Store.vue";
import Login from "../views/Login.vue";
import Register from "../views/Register.vue";
import User from "../views/User.vue";
import Admin from "../views/Admin.vue";
import Overview from "../views/Overview.vue";
import Products from "../views/Products.vue";
import Orders from "../views/Orders.vue";
import Clients from "../views/Clients.vue";
import Product from "../components/Product.vue"

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: Home,
    },
    {
      path: "/store",
      name: "store",
      component: Store,
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
    {
      path: "/product/:id",
      name: "product",
      component: Product,
    },
    {
      path: "/user",
      name: "user",
      component: User,
      meta: {
        requiresAuth: true,
      }
    },
    {
      path: "/admin",
      name: "admin",
      component: Admin,
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
          path: "clients",
          name: "clients",
          component: Clients,
        },
        {
          path: "orders",
          name: "orders",
          component: Orders,
        },
      ],
    },
  ],
});

const getCurrentUser = () => {
  return new Promise((resolve, reject) =>{
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

router.beforeEach(async(to, from, next) => {
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
