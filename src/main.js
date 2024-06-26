import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import { initializeApp } from "firebase/app";
import { collection, getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { autoAnimatePlugin } from '@formkit/auto-animate/vue';



const firebaseConfig = {
  apiKey: "AIzaSyDO4sBYIDZlWsKTFrmUfgG1ZATkRbqumNE",
  authDomain: "almendra-a411d.firebaseapp.com",
  databaseURL:
    "https://almendra-a411d-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "almendra-a411d",
  storageBucket: "almendra-a411d.appspot.com",
  messagingSenderId: "673059035521",
  appId: "1:673059035521:web:59332f550787711fe47080",
  measurementId: "G-BPLB9LX991",
};
initializeApp(firebaseConfig);

export const db = getFirestore();
export const dataBase = collection(db, "products");
export const dataReg = collection(db, "data");
export const profileReg = collection(db, "profiles");
export const cartReg = collection(db, "carts");
export const orderReg = collection(db, "orders");
export const storage = getStorage();

const app = createApp(App);

app.use(createPinia());
app.use(router);

//app.mount("#app");
app.use(autoAnimatePlugin).mount('#app')