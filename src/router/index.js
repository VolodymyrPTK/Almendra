import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import Store from "../views/Store.vue";
import Login from "../views/Login.vue";
import Register from "../views/Register.vue";
import User from "../views/User.vue";
import Admin from "../views/Admin.vue";
import Overview from "../views/Overview.vue";
import Products from "../views/Products.vue";
import Orders from "../views/Orders.vue";

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
      path: "/user",
      name: "user",
      component: User,
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
          path: "orders",
          name: "orders",
          component: Orders,
        },
      ],
    },
  ],
});

export default router;
