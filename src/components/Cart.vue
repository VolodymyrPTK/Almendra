<template>
  <div class="cart">

    <div style="margin-top: 10px;" class="cart-name"><b>Кошик</b></div>
    <div class="cart-name">До сплати {{ total }} грн</div>

    <div class="item-container" :class="{ up: show }">
      <div class="cart-items" v-for="item in items" :key="item.id">
        <img class="productImage" :src="item.itemImage" />
        <div class="sum">
          <div class="item-name">
            <b>{{ item.name }}</b>
          </div>
          <div class="numbers">
            <div>{{ item.price }} грн</div>
            <div class="quant">
              <button class="round-btn" @click="reduceQuantity(item.id)">-</button>
              <div>{{ item.quantity }} шт</div>
              <button class="round-btn" @click="addQuantity(item.id)">+</button>
            </div>
          </div>
        </div>
        <div style="font-size: 18px; width: 20%">
          <b>{{ item.price * item.quantity }} грн</b>
        </div>
        <button class="round-btn" @click="deleteProduct(item.id)">X</button>
      </div>
    </div>

    <transition name="slide2">
      <div v-if="show" class="button-container">
        <div class="total" :class="{ totalup: show }">



          <div class="user">
            <div class="profile">
              <div class="names" style="display: flex; justify-content: space-around;">
                <h3 v-if="!showModalFlag">{{ profile.firstName }} {{ profile.secondName }}</h3>
              </div>
              <div style="margin: 5px;" v-if="!showModalFlag">Мейл: {{ profile.email }}</div>
              <div style="margin: 5px;" v-if="!showModalFlag">Телефон: {{ profile.phone }}</div>
              <button v-if="!showModalFlag" class="btn" v-on:click="showModal()">Редагувати</button>

              <div class="edit-modal" v-if="showModalFlag">
                <input type="text" id="name" v-model="profile.secondName" placeholder="Призвіще" />
                <input type="text" id="name" v-model="profile.firstName" placeholder="Ім'я" />
                <input type="text" id="phone" v-model="profile.phone" placeholder="Телефон" />
                <div style="display: flex; width: 300px;">
                  <button class="btn" @click="updateData()" :disabled="loading">
                    <div class="spinner-container" v-if="loading">
                      <div class="spinner-border" role="status"></div>
                    </div>
                    <div v-else>Зберегти</div>
                  </button>
                  <button class="btn" @click="closeModal()">Назад</button>
                </div>
              </div>
            </div>

            <div class="container">
              <div class="tabs">
                <input type="radio" id="radio-1" name="tabs" checked />
                <label class="tab" for="radio-1">За реквізитами</label>
                <input type="radio" id="radio-2" name="tabs" />
                <label class="tab" for="radio-2">Післяплата</label>
                <span class="glider"></span>
              </div>
            </div>

            <div class="adress">
              <div class="box" @click="onNovaPoshtaClick" v-if="!expandedNovaPoshta && !expandedUkrPoshta">
                <img class="cart-img" src="../assets/novaposhta.jpg" alt="Нова Пошта">
              </div>
              <div class="expanded" v-if="expandedNovaPoshta">
                <h4>Місто: {{ profile.city }}</h4>
                <h4>Віділеня: {{ profile.warehouse }}</h4>
                <button @click="reset">Volver</button>
              </div>
              <div class="box" @click="onUkrPoshtaClick" v-if="!expandedUkrPoshta && !expandedNovaPoshta">
                <img class="cart-img" src="../assets/ukrposhta.png" alt="УкрПошта">
              </div>

              <div class="expanded" v-if="expandedUkrPoshta">
                <h1>Buscar ciudad por código postal</h1>

                <input type="text" v-model="searchUP" @input="searchCitiesUP" @focus="showDropdownUP = true"
                  @blur="showDropdownUP = false" />
                <ul v-if="showDropdownUP">
                  <li v-for="city in citiesUP" @click="selectCityUP(city)">
                    {{ city }}
                  </li>
                </ul>

                <button @click="reset">Volver</button>
              </div>
            </div>

          </div>
          <div style="display: flex; width: 100%;">
            <button @click="confirmPurchase()">Оформити</button>
            <button @click="closeConfirm()">Назад</button>
          </div>
        </div>

      </div>
    </transition>

    <div class="button-container" :class="{ down: show }">
      <button @click="saveCart()">Сплатити</button>
      <button @click="closeCart()">Закрити</button>
    </div>
  </div>
</template>

<script>
import { getAuth } from "firebase/auth";
import {
  doc, getDoc, getDocs, query, where, onSnapshot, increment, collection, deleteDoc, updateDoc,
} from "firebase/firestore";
import { profileReg, cartReg, dataBase, db } from "../main";
import { ref } from 'vue';

const apiKey = "0fe8dfcca7f61242d252e83fd715eaf2";
const endpointRef = "https://api.novaposhta.ua/v2.0/json/";

export default {
  name: "Cart",
  props: {
    msg: String,
  },
  setup() {
    const expandedNovaPoshta = ref(false);
    const expandedUkrPoshta = ref(false);
    const expandNovaPoshta = () => {
      expandedNovaPoshta.value = true;
    };
    const expandUkrPoshta = () => {
      expandedUkrPoshta.value = true;
    };
    const reset = () => {
      expandedNovaPoshta.value = false;
      expandedUkrPoshta.value = false;
    };
    return { expandedNovaPoshta, expandedUkrPoshta, expandNovaPoshta, expandUkrPoshta, reset };
  },
  data() {
    return {
      products: [],
      product: {},
      profiles: [],
      profile: {},
      cartProducts: [],
      items: [],
      item: {
        itemId: "",
      },
      cartId: "",
      show: false,
      showModalFlag: false,
      profiles: [],
      profile: {
        firstName: "",
        secondName: "",
        phone: "",
        city: "",
      },
      loading: false,
      search: "",
      cities: [],
      selectedCity: null,
      warehouses: [],
      selectedWarehouse: null,
      selectedOption: null,
      postIndex: '',
      citiesUkrPoshta: [],
      showDropdown: false,
    };
  },
  methods: {
    //Ukr Poshta
    searchCitiesUP() {
      // Realizar la solicitud a la API de Ukrposhta
      fetch(`https://api.ukrposhta.ua/address/v1/pochttown?postalcode=${this.searchUP}&limit=10`)
        .then(response => response.json())
        .then(data => {
          // Obtener los datos de las ciudades
          this.citiesUP = data.map(city => `${city.CITYTYPE_UA} ${city.PDCITY_UA}`);
        })
        .catch(error => {
          console.error('Error al buscar ciudades:', error);
        });
    },
    selectCityUP(city) {
      // Lógica para seleccionar la ciudad
      console.log('Ciudad seleccionada:', city);
    },


    //Nova Poshta
    onNovaPoshtaClick() {
      this.selectedOption = 'novaPoshta';
      this.expandNovaPoshta();
      console.log('novaposhta')
    },
    onUkrPoshtaClick() {
      this.selectedOption = 'ukrPoshta';
      this.expandUkrPoshta();
      console.log('urkposhta')
    },
    showModal() {
      this.showModalFlag = true;
    },
    closeModal() {
      this.showModalFlag = false;
    },
    async saveCart() {
      this.show = !this.show;
    },
    async closeCart() {
      this.$emit("close");
    },
    async closeConfirm() {
      this.show = !this.show;
    },
    async addQuantity(id) {
      try {
        const auth = getAuth();
        const user = auth.currentUser;
        if (user) {
          this.profile.uid = user.uid;
          const docRef = doc(cartReg, this.cartId, "cartProducts", id);
          await updateDoc(docRef, { quantity: increment(1) });
        }
      } catch (error) {
        console.error("Error adding product", error);
      }
    },
    async updateData() {
      this.loading = true;
      try {
        const docRef = doc(db, "profiles", this.profile.uid);
        await updateDoc(docRef, {
          firstName: this.profile.firstName,
          secondName: this.profile.secondName,
          phone: this.profile.phone,
        });
        console.log("Data updated successfully");
        this.showModalFlag = false;
      } catch (error) {
        console.error(error);
      }
      this.loading = false;
    },
    async searchCities() {
      const endpoint = endpointRef;
      const body = {
        apiKey: apiKey,
        modelName: "Address",
        calledMethod: "getCities",
        methodProperties: {
          FindByString: this.search,
        },
      };
      await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      })
        .then((response) => response.json())
        .then((data) => {
          this.cities = data.data;
        })
        .catch((error) => {
          // handle error
        });
    },
    selectCity(city) {
      this.search = city.Description;
      this.showDropdown = false;
      this.selectedCity = city;
    },
    async updateUserData() {
      const userRef = doc(db, "profiles", this.profile.uid);
      await updateDoc(userRef, {
        city: this.selectedCity.Description,
      });
    },
    async reduceQuantity(id) {
      try {
        const auth = getAuth();
        const user = auth.currentUser;
        if (user) {
          this.profile.uid = user.uid;
          const docRef = doc(cartReg, this.cartId, "cartProducts", id);
          const docSnap = await getDoc(docRef);
          const quantity = docSnap.data().quantity;
          if (quantity > 1) {
            await updateDoc(docRef, { quantity: increment(-1) });
          } else {
            await deleteDoc(docRef);
          }
        }
      } catch (error) {
        console.error("Error reducing product quantity", error);
      }
    },
    async deleteProduct(id) {
      try {
        const auth = getAuth();
        const user = auth.currentUser;
        if (user) {
          this.profile.uid = user.uid;
          const docRef = doc(cartReg, this.cartId, "cartProducts", id);
          await deleteDoc(docRef);
        }
      } catch (error) {
        console.error("Error deleting product", error);
      }
    },
  },
  showModal() {
    this.showModalFlag = true;
  },
  async updateData() {
    this.loading = true;
    try {
      const docRef = doc(db, "profiles", this.profile.uid);
      await updateDoc(docRef, {
        firstName: this.profile.firstName,
        secondName: this.profile.secondName,
        phone: this.profile.phone,
      });
      console.log("Data updated successfully");
      this.showModalFlag = false;
    } catch (error) {
      console.error(error);
    }
    this.loading = false;
  },
  async searchCities() {
    const endpoint = endpointRef;
    const body = {
      apiKey: apiKey,
      modelName: "Address",
      calledMethod: "getCities",
      methodProperties: {
        FindByString: this.search,
      },
    };
    await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })
      .then((response) => response.json())
      .then((data) => {
        this.cities = data.data;
      })
      .catch((error) => {
        // handle error
      });
  },
  selectCity(city) {
    this.search = city.Description;
    this.showDropdown = false;
    this.selectedCity = city;
  },
  async updateUserData() {
    const userRef = doc(db, "profiles", this.profile.uid);
    await updateDoc(userRef, {
      city: this.selectedCity.Description,
    });
  },
  async created() {
    onSnapshot(dataBase, (snapshot) => {
      snapshot.docs.forEach((doc) => {
        this.products.push({ ...doc.data(), id: doc.id });
      });
    });
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      this.profile.email = user.email;
      this.profile.uid = user.uid;
      // Fetch profile
      const docRef = doc(profileReg, this.profile.uid);
      const profileDoc = await getDoc(docRef);
      const profileData = profileDoc.data();

      this.profile.firstName = profileData.firstName;
      this.profile.secondName = profileData.secondName;
      this.profile.city = profileData.city;
      this.profile.phone = profileData.phone;
      this.profile.warehouse = profileData.warehouse;

      this.profiles.push({ ...profileData, id: profileDoc.id });

      // Fetch cart
      const q = query(
        cartReg,
        where("uid", "==", this.profile.uid),
        where("finalized", "==", false)
      );
      const querySnapshot = await getDocs(q);
      this.cartId = querySnapshot.docs[0].id;
      const cartData = collection(cartReg, this.cartId, "cartProducts");
      onSnapshot(cartData, (snapshot) => {
        this.items = [];
        snapshot.docs.forEach((doc) => {
          this.items.push({ ...doc.data(), id: doc.id });
        });
      });

      // Fetch products
      onSnapshot(dataBase, (snapshot) => {
        snapshot.docs.forEach((doc) => {
          this.products.push({ ...doc.data(), id: doc.id });
        });
      });

    }
  },
  computed: {
    total() {
      let total = 0;
      this.items.forEach((item) => {
        total += item.price * item.quantity;
      });
      return total;
    },
  },
};
</script>

<style scoped lang="scss">
.cart {
  overflow: hidden;
  display: flex;
  position: fixed;
  flex-direction: column;
  justify-content: space-between;
  width: 500px;
  height: 80%;
  backdrop-filter: blur(35px);
  background-color: rgba(253, 253, 253, 0.1);
  border-radius: 25px;
  box-shadow: -15px 0 25px rgba(0, 0, 0, 0.6);
  border: 4px solid rgba(255, 255, 255, 0.25);
  right: 25px;
  transition: 0.5s;
}

.box {
  width: 100%;
  height: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.expanded {
  width: 100%;
  height: 100%;
}

.cart-img {
  height: 100px;
  border-radius: 25px;
  cursor: pointer;
}

.adress {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 25px;
  box-shadow: 0 5px 7px rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(35px);
  background-color: rgba(253, 253, 253, 0.5);
  padding: 0.75rem;
  margin: 25px 0;
  width: 400px;
  height: 150px;
}

.profile {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 25px;
  box-shadow: 0 5px 7px rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(35px);
  background-color: rgba(253, 253, 253, 0.5);
  padding: 0.75rem;
  margin: 25px 0;
  width: 400px;
  height: 205px;
}

.container {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 25px 0;
}

.tabs {
  display: flex;
  position: relative;
  padding: 0.75rem;
  border-radius: 25px;
  box-shadow: 0 5px 7px rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(35px);
  background-color: rgba(253, 253, 253, 0.5);

  * {
    z-index: 2;
  }
}

input[type="radio"] {
  display: none;
}

.tab {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 54px;
  width: 200px;
  font-size: 1.25rem;
  font-weight: 500;
  cursor: pointer;
  transition: color 0.15s ease-in;
  color: #5f5f5f;
}

input[type="radio"] {
  &:checked {
    &+label {
      color: #000000;
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.6), 0 -2px 3px rgba(255, 255, 255, 1);
    }
  }
}

input[id="radio-1"] {
  &:checked {
    &~.glider {
      transform: translateX(0);
    }
  }
}

input[id="radio-2"] {
  &:checked {
    &~.glider {
      transform: translateX(100%);
    }
  }
}

.glider {
  position: absolute;
  display: flex;
  height: 54px;
  width: 200px;
  background-color: #ffffff;
  box-shadow: 0 5px 7px rgba(0, 0, 0, 0.2);
  z-index: 1;
  border-radius: 20px; // just a high number to create pill effect
  transition: 0.25s ease-out;
}

/////

.item-container {
  height: 100%;
  overflow: scroll;
  overflow-y: scroll;
  scroll-behavior: smooth;
}

.item-container::-webkit-scrollbar {
  display: none;
}

.button-container {
  display: flex;
  justify-content: center;
}

.total {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.totalup {
  transition: 0.5s;
}

.up {
  transform: translateY(-500px);
  transition: 0.5s;
}

.down {
  transform: translateY(180px);
  transition: 0.5s;
}

.slide2-enter-active,
.slide2-leave-active {
  transition: all 0.5s ease;
}

.slide2-enter-from,
.slide2-leave-to {
  transform: translateY(1000px);
  //opacity: 0;
}

.quant {
  display: flex;
  align-items: baseline;
}

.cart-name {
  height: 20px;
  padding: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 22px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.6), 0 -2px 3px rgba(255, 255, 255, 1);
  z-index: 1;
}

.cart-items {
  display: flex;
  align-items: center;
  padding: 5px 15px 5px 15px;
  margin: 15px;
  border-radius: 20px;
  box-shadow: 0 5px 7px rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(35px);
  background-color: rgba(253, 253, 253, 0.5);
  z-index: 2;
}

.item-name {
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.4), 0 -2px 3px rgba(255, 255, 255, 1);
  height: 30px;
  display: flex;
  align-items: center;
}

.round-btn {
  width: 25px;
  height: 25px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 10px 0 10px;
}

.sum {
  width: 80%;
  height: 70px;
  display: flex;
  flex-direction: column;
}

.numbers {
  height: 50%;
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.productImage {
  height: 75px;
}

button {
  width: 80%;
  height: 44px;
  margin: 10px;
  border: none;
  font-size: 18px;
  font-family: Verdana, Geneva, Tahoma, sans-serif;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.6), 0 -2px 3px rgba(255, 255, 255, 1);
  border-radius: 25px;
  backdrop-filter: blur(35px);
  background-color: rgba(253, 253, 253, 0.8);
  box-shadow: 0px 5px 7px rgba(0, 0, 0, 0.3), inset 0px 0px 0px rgba(0, 0, 0, 0);
  transition: 0.3s;
  backdrop-filter: blur(0px);
  transition: 1s;
}

button:hover {
  transition: 0.3s;
  box-shadow: 0px 1px 1px rgba(0, 0, 0, 0.3), inset 0px 0px 0px rgba(0, 0, 0, 0);
}

button:active {
  box-shadow: 0px 0px 0px rgba(0, 0, 0, 0.3),
    inset 0px 3px 5px rgba(0, 0, 0, 0.3);
  transition: 0.3s;
}

.edit-modal {
  width: 100%;
  margin: 25px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;

  input {
    width: 300px;
    border-radius: 25px;
    border: none;
    margin: 5px;
    padding: 7px;
    box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.5);
  }
}

.spinner-container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.spinner-border {
  width: 10px;
  height: 10px;
  border: 0.25em solid currentColor;
  border-right-color: transparent;
  border-radius: 50%;
  animation: spinner-border-animation 1.5s linear infinite;
}

@keyframes spinner-border-animation {
  to {
    transform: rotate(360deg);
  }
}

.dropdown {
  position: relative;
}
</style>
