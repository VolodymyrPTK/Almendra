<template>
  <div class="cartContainer">
    <div class="navButton" @click="toggleModal">
      <img style="height: 21px;" src="../assets/cart.png" alt="cartlogo" />
      <div> {{ total }}</div>
      <div>грн</div>
    </div>

    <Transition name="slide">
      <div v-if="isVisible" class="cart">
        <div class="cart-name">{{ show ? 'Оформлення замовлення' : 'Кошик' }}</div>

        <div v-if="!show" class="cart-container">
          <div class="cart-items-container">
            <div class="cart-items" v-for="item in items" :key="item.id">
              <img inert :src="item.itemImage" />
              <div>
                <div>{{ item.name }}</div>
                <div>
                  <div>{{ item.price }} грн</div>
                  <div style="display: flex; align-items: center;">
                    <div class="round-btn" @click="reduceQuantity(item.id)">-</div>
                    <div>{{ item.quantity }} шт</div>
                    <div class="round-btn" @click="addQuantity(item.id)">+</div>
                  </div>
                  <div>{{ item.price * item.quantity }} грн</div>
                </div>
              </div>
              <div id="trash" @click="deleteProduct(item.id)">
                <img src="../assets/imgs/icons/trash.svg" alt="">
              </div>
            </div>
          </div>
          <div class="button-container">
            <div>
              <div class="cart-name">До сплати</div>
              <div class="cart-name">{{ total }} грн</div>
            </div>
            <button style="width: 40%;" class="btn-primary" @click="saveCart()">Оформити</button>
            <button class="btn-secondary" @click="closeCart()">Закрити</button>
          </div>
        </div>

        <div v-else="show" class="data-container">
          <div class="cart-name">До сплати {{ total }} грн</div>

          <div class="profile">
            <div class="user-name" v-if="!showModalFlag">
              <div class="headers">Дані отримувача</div>
              <div class="names">
                <div>
                  <div><b>Ім'я:</b> {{ profile.firstName }} {{ profile.secondName }}</div>
                  <div><b>Телефон:</b> {{ formattedPhoneNumber }}</div>
                </div>
                <div style="cursor: pointer;" v-on:click="showModal()" :title="'Редагувати'">
                  <img src="../assets/edit.png" alt="edit">
                </div>
              </div>
            </div>

            <div class="edit-modal" v-if="showModalFlag">
              <div class="edit-inputs">
                <input type="text" id="name" v-model="profile.secondName" placeholder="Призвіще" />
                <input type="text" id="name" v-model="profile.firstName" placeholder="Ім'я" />
                <input type="text" id="phone" v-model="profile.phone" placeholder="Телефон" />
              </div>
              <div class="edit-inputs">
                <button class="btn-primary" @click="updateData()" :disabled="loading">
                  <div class="spinner-container" v-if="loading">
                    <div class="spinner-border" role="status"></div>
                  </div>
                  <div v-else>Зберегти</div>
                </button>
                <button class="btn-secondary" @click="closeModal()">Назад</button>
              </div>
            </div>
          </div>

          <div class="adress">
            <div class="headers" v-if="!expandedNovaPoshta && !expandedUkrPoshta">Адреса Доставки</div>
            <div class="delivery-adress" v-if="!expandedNovaPoshta && !expandedUkrPoshta">
              <div v-if="profile.deliveryOption === 'novaPoshta'">
                <div style="text-align: center;"><b>Нова Пошта</b></div>
                <div><b>Місто:</b> {{ profile.city }}</div>
                <div v-if="profile.postType === 'Warehouse'"><b>Віділення:</b> {{ profile.warehouse }}</div>
                <div v-else-if="profile.postType === 'Postomat'"><b>Поштомат:</b> {{ profile.warehouse }}</div>
              </div>

              <div v-else-if="profile.deliveryOption === 'ukrPoshta'">
                <div style="text-align: center;"><b>УкрПошта</b></div>
                <div><b>Місто:</b> {{ profile.city }}</div>
                <div><b>Індекс:</b> {{ profile.cityIndex }}</div>
              </div>

              <div v-else>
                <div style="font-size: 2vh; font-weight: bold; margin: 5px">Виберіть перевізника</div>
              </div>
            </div>

            <div style="display: flex; flex-direction: column; align-items: center;"
              v-if="!expandedNovaPoshta && !expandedUkrPoshta">

              <div style="font-weight: bold; font-size: 2vh;; margin: 5px 0;"
                v-if="profile.deliveryOption === 'ukrPoshta' || profile.deliveryOption === 'novaPoshta'">Вибрати іншу
                адресу
              </div>

              <div class="delivery-options">
                <div class="box" @click="onNovaPoshtaClick" v-if="!expandedNovaPoshta && !expandedUkrPoshta">
                  <img :title="messageNP" class="cart-img" src="../assets/novaposhta.jpg" alt="Нова Пошта">

                </div>
                <div class="box" @click="onUkrPoshtaClick" v-if="!expandedNovaPoshta && !expandedUkrPoshta">
                  <img :title="messageUP" class="cart-img" src="../assets/ukrposhta.png" alt="УкрПошта">
                </div>
              </div>
            </div>

            <div class="poshta" v-if="expandedNovaPoshta">
              <div>Нова Пошта</div>
              <input placeholder="Місто" type="text" v-model="search" @input="searchCities"
                @input.debounce="showDropdown = true" />
              <ul id="ul-1" v-if="showDropdown">
                <li v-for="city in cities" @click="selectCity(city)">
                  {{ city.Description }}
                </li>
              </ul>

              <div class="radio-container">
                <div class="radio-tabs">
                  <input type="radio" id="radio-1" name="tabs" value="Warehouse" v-model="selectedCategory">
                  <label class="tab" for="radio-1">Віділення</label>
                  <input type="radio" id="radio-2" name="tabs" value="Postomat" v-model="selectedCategory">
                  <label class="tab" for="radio-2">Поштомат</label>
                  <span class="glider2"></span>
                </div>
              </div>

              <input :placeholder="placeholderText" type="text" v-model="searchWarehouse" @input="filterWarehouses"
                @input.debounce="showDropdownW = true" />
              <ul id="ul-2" v-if="showDropdownW">
                <li
                  v-for="warehouse in filteredWarehouses.filter(warehouse => warehouse.Number.startsWith(searchWarehouse))"
                  @click="selectWarehouse(warehouse)">
                  {{ warehouse.Description }}
                </li>
              </ul>
              <div style="display: flex; align-items: center;">
                <button class="btn-primary" @click="updateUserData">Зберегти</button>
                <button class="btn-secondary" @click="reset">Назад</button>
              </div>
            </div>

            <div class="poshta" v-if="expandedUkrPoshta">
              <div style="font-weight: bold; font-size: 21px; margin: 5px 0;">УкрПошта</div>
              <input placeholder="Місто" type="text" v-model="search" @input="searchCities"
                @input.debounce="showDropdown = true" />
              <ul id="ul-1" v-if="showDropdown">
                <li v-for="city in cities" @click="selectCity(city)">
                  {{ city.Description }}
                </li>
              </ul>
              <input placeholder="Індекс" type="text" v-model="profile.cityIndex">
              <div style="display: flex; align-items: center;">
                <button class="btn-primary" @click="updateUserDataUP">Зберегти</button>
                <button class="btn-secondary" @click="reset">Назад</button>
              </div>
            </div>
          </div>

          <div class="radio-container2">
            <div class="headers">Оплата</div>
            <div class="pay-tabs">
              <input type="radio" id="radio-p1" name="paytabs" value="payNow" v-model="payment" />
              <label class="pay-tab" for="radio-p1">За реквізитами</label>
              <input type="radio" id="radio-p2" name="paytabs" value="payLater" v-model="payment" />
              <label class="pay-tab" for="radio-p2">Післяплата</label>
              <span class="glider"></span>
            </div>
          </div>

          <div class="button-container">
            <button style="width: 50%;" class="btn-primary" @click="createOrder()">Оформити</button>
            <button class="btn-secondary" @click="closeConfirm()">Назад</button>
          </div>
        </div>

        <div class="order-confiramtion" v-if="orderConfirmed">
          <img src="../assets/imgs/icons/done.png" alt="">
          <h3>Дякуємо за замовлення</h3>
          <div>Ваше замовлення в процесі обробки.</div>
          <div>Буде відправлено протягом наступних 48 годин і ви зможете його відстежувати в особистому кабінеті.</div>
          <RouterLink class="btn-primary" to="/user" @click="closeCart()">Переглянути замовлення</RouterLink>
        </div>
      </div>
    </Transition>

  </div>
</template>

<script>
import { RouterLink } from "vue-router";
import { getAuth } from "firebase/auth";
import { addDoc, setDoc, doc, getDoc, getDocs, query, where, onSnapshot, increment, collection, deleteDoc, updateDoc, orderBy, limit } from "firebase/firestore";
import { profileReg, cartReg, dataBase, db, orderReg } from "../main";

const apiKey = "b78d2a5d64f6903591a12493aa852776";
const endpointRef = "https://api.novaposhta.ua/v2.0/json/";

export default {
  name: "Cart",
  props: {
    msg: String,
  },
  data() {
    return {
      products: [],
      product: {},
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
        warehouse: "",
        cityIndex: "",
        postType: ""
      },
      loading: false,
      search: "",
      searchWarehouse: "",
      cities: [],
      selectedCity: null,
      warehouses: [],
      selectedWarehouse: null,
      filteredWarehouses: [],
      selectedOption: null,
      deliveryOption: "",
      selectedCategory: "Warehouse",
      showDropdown: false,
      showDropdownW: false,
      expandedNovaPoshta: false,
      expandedUkrPoshta: false,
      messageNP: 'Нова Пошта',
      messageUP: 'УкрПошта',
      orderConfirmed: false,
      payment: "payNow",
      isVisible: false,
      cartId: null,
    };
  },
  methods: {
    toggleModal() {
      this.isVisible = !this.isVisible;
    },
    onNovaPoshtaClick() {
      this.selectedOption = 'novaPoshta';
      this.expandedNovaPoshta = true;
      console.log('novaposhta')
    },
    onUkrPoshtaClick() {
      this.selectedOption = 'ukrPoshta';
      this.expandedUkrPoshta = true;
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
      this.isVisible = !this.isVisible;
      this.orderConfirmed = false;
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
        modelName: 'Address',
        calledMethod: 'getCities',
        methodProperties: {
          FindByString: this.search,
        },
      };
      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        });
        const data = await response.json();
        this.cities = data.data;
      } catch (error) {
        console.error(error);
      }
    },
    selectCity(city) {
      this.search = city.Description;
      this.showDropdown = false;
      this.selectedCity = city;
      this.getWarehouses(city.Ref);
    },
    selectWarehouse(warehouse) {
      this.selectedWarehouse = warehouse;
      this.searchWarehouse = warehouse.Description;
      this.showDropdownW = false;
    },
    async getWarehouses(cityRef) {
      const endpoint = endpointRef;
      const body = {
        apiKey: apiKey,
        modelName: 'AddressGeneral',
        calledMethod: 'getWarehouses',
        methodProperties: {
          CityRef: cityRef,
        },
      };
      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        });

        const data = await response.json();
        this.warehouses = data.data;
        this.filteredWarehouses = this.warehouses;
        this.selectedWarehouse = data.data[0];
      } catch (error) {
        console.error(error);
      }
    },
    async filterWarehouses() {
      const searchNumber = parseInt(this.searchWarehouse.trim(), 10);
      const endpoint = endpointRef;
      const body = {
        apiKey: apiKey,
        modelName: "AddressGeneral",
        calledMethod: "getWarehouses",
        methodProperties: {
          CityRef: this.selectedCity.Ref,
          FindByString: parseInt(searchNumber, 10),
          CategoryOfWarehouse: this.selectedCategory
        },
      };
      try {
        const response = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        });
        const data = await response.json();
        this.filteredWarehouses = data.data;
        console.log(data.data)
      } catch (error) {
        console.log(error);
      }
    },
    async updateUserData() {
      const userRef = doc(db, "profiles", this.profile.uid);
      await updateDoc(userRef, {
        city: this.selectedCity.Description,
        deliveryOption: this.selectedOption,
        warehouse: this.selectedWarehouse.Number,
        postType: this.selectedCategory
      });
      this.expandedNovaPoshta = false;
    },
    async updateUserDataUP() {
      const userRef = doc(db, "profiles", this.profile.uid);
      await updateDoc(userRef, {
        city: this.selectedCity.Description,
        deliveryOption: this.selectedOption,
        cityIndex: this.profile.cityIndex,
      });
      this.expandedUkrPoshta = false;
    },
    reset() {
      this.expandedNovaPoshta = false;
      this.expandedUkrPoshta = false;
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
    async createOrder() {
      const cartId = this.cartId;
      const time = new Date().toLocaleString("en-US", {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
      });

      const queryD = query(orderReg, orderBy("orderId", "desc"), limit(1));
      const querySnapshot = await getDocs(queryD);
      let lastId = 0;
      querySnapshot.forEach((doc) => {
        lastId = doc.data().orderId;
      });
      const order = {
        orderId: lastId + 1,
        uid: this.profile.uid,
        firstName: this.profile.firstName,
        secondName: this.profile.secondName,
        city: this.profile.city,
        deliveryOption: this.profile.deliveryOption,
        warehouse: this.profile.warehouse || null,
        cityIndex: this.profile.cityIndex || null,
        phone: this.profile.phone,
        email: this.profile.email,
        items: this.items,
        postType: this.selectedCategory,
        orderStatus: "Processing",
        time: time,
        payment: this.payment,
        total: this.total
      };
      const orderRef = doc(orderReg);
      await setDoc(orderRef, order);

      // Mark the cart as finalized
      const cartRef = doc(cartReg, cartId);
      await setDoc(cartRef, { finalized: true });

      this.orderConfirmed = true;
      this.items = [];
    },
  },
  created() {
    const auth = getAuth();
    const user = auth.currentUser;
    this.profile.uid = user.uid
    const checkAndCreateCart = async () => {
      const q = query(cartReg, where("uid", "==", this.profile.uid), where("finalized", "==", false));
      const querySnapshot = await getDocs(q);
      if (querySnapshot.size > 0) {
        querySnapshot.forEach((doc) => {
          if (doc.data().finalized === false) {
            this.cartId = doc.id;
          }
        });
      } else {
        const cartInfo = {
          uid: this.profile.uid,
          finalized: false,
          time: new Date().toLocaleString("en-US", {
            day: "2-digit",
            month: "2-digit",
            year: "2-digit",
            hour12: false,
            hour: "2-digit",
            minute: "2-digit",
          }),
        };
        const cart = await addDoc(cartReg, cartInfo);
        this.cartId = cart.id;
      }
    };
    const fetchCartAndProducts = async () => {
      await checkAndCreateCart();
      if (this.cartId) {
        const cartData = collection(cartReg, this.cartId, "cartProducts");
        onSnapshot(cartData, (snapshot) => {
          this.items = [];
          snapshot.docs.forEach((doc) => {
            this.items.push({ ...doc.data(), id: doc.id });
          });
        });
      }
      onSnapshot(dataBase, (snapshot) => {
        this.products = [];
        snapshot.docs.forEach((doc) => {
          this.products.push({ ...doc.data(), id: doc.id });
        });
      });
    };
    if (user) {
      this.profile.email = user.email;
      this.profile.uid = user.uid;
      const docRef = doc(profileReg, this.profile.uid);
      onSnapshot(docRef, (doc) => {
        this.profiles = [];
        if (doc.exists()) {
          this.profiles.push({ ...doc.data(), id: doc.id });
          this.profile.firstName = doc.data().firstName;
          this.profile.secondName = doc.data().secondName;
          this.profile.city = doc.data().city;
          this.profile.warehouse = doc.data().warehouse;
          this.profile.cityIndex = doc.data().cityIndex;
          this.profile.phone = doc.data().phone ?? '';
          this.profile.deliveryOption = doc.data().deliveryOption;
          this.profile.postType = doc.data().postType;
        }
      });
      fetchCartAndProducts();
    }
  },
  computed: {
    formattedPhoneNumber() {
      const phoneNumber = this.profile.phone;
      const numericPhoneNumber = phoneNumber.replace(/\D/g, '');
      const formattedPhoneNumber = `(${numericPhoneNumber.slice(0, 3)})-${numericPhoneNumber.slice(3, 6)}-${numericPhoneNumber.slice(6)}`;
      return formattedPhoneNumber;
    },
    total() {
      let total = 0;
      this.items.forEach((item) => {
        total += item.price * item.quantity;
      });
      return total;
    },
    placeholderText() {
      if (this.selectedCategory === "Warehouse") {
        return "Номер віділення";
      } else if (this.selectedCategory === "Postomat") {
        return "Номер поштомату";
      } else {
        return "";
      }
    }
  }
};
</script>

<style scoped lang="scss">
.cartContainer {
  display: flex;
  flex-direction: column;
}

.cart {
  position: absolute;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  top: 10vh;
  right: 0;
  width: 30vw;
  height: 85vh;
  backdrop-filter: blur(25px);
  -webkit-backdrop-filter: blur(25px);
  background-color: rgba(255, 255, 255, 0.3);
  box-shadow: -15px 0 25px rgba(0, 0, 0, 0.6);
  border-radius: 25px;
  transition: 0.5s;
}

.cart-container {
  height: 95%;
  display: flex;
  flex-direction: column;
}

.cart-items-container {
  height: 90%;
  overflow: hidden;
  overflow-y: scroll;
  scroll-behavior: smooth;

  &::-webkit-scrollbar {
    background-color: #ffffff00;
    width: 0.2vvw;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #c2c2c2;
    border-radius: 25px;
    width: 0.2vw;
  }
}

.cart-items {
  display: flex;
  align-items: center;
  padding: 5px 15px;
  margin: 15px;
  border-radius: 20px;
  box-shadow: 0 5px 7px rgba(0, 0, 0, 0.2);
  font-size: 2vh;
  backdrop-filter: blur(35px);
  background-color: rgba(253, 253, 253, 0.5);
  z-index: 2;
  height: 9vh;

  >img {
    width: 4vw;
  }


  >div:nth-child(2) {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    border-radius: 3vh;
    width: 100%;
    height: 7vh;
    padding: 1vh;

    >div:nth-child(1) {
      font-weight: bold;
      text-align: center;
    }

    >div:nth-child(2) {
      display: flex;
      justify-content: space-around;
      align-items: center;
    }

  }
}

.button-container {
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  padding: 0 25px;
  z-index: 1;
}

//user data container
.data-container {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: space-between;
  padding: 0.5vh 2vw;
  height: 100%;
}

.radio-container2 {
  width: 100%;
  height: 10vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 25px;
  box-shadow: 0 5px 7px rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(35px);
  background-color: rgba(253, 253, 253, 0.5);
}

.pay-tabs {
  width: 90%;
  display: flex;
  position: relative;
}

.pay-tab {
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 3;
  height: 4vh;
  width: 50%;
  font-size: 2vh;
  font-weight: 500;
  cursor: pointer;
  transition: color 0.15s ease-in;
  color: #5f5f5f;
}

.glider {
  position: absolute;
  display: flex;
  height: 4vh;
  width: 50%;
  background-color: #ffffff;
  box-shadow: 0 5px 7px rgba(0, 0, 0, 0.2);
  z-index: 1;
  border-radius: 20px; // just a high number to create pill effect
  transition: 0.25s ease-out;
}

//user data //////////////////////////////////////
.profile {
  width: 100%;
  height: 15vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 25px;
  box-shadow: 0 5px 7px rgba(0, 0, 0, 0.2);
  background-color: rgba(253, 253, 253, 0.5);
}

.user-name {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  font-size: 1.8vh;
  height: 12vh;
}

.names {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #fff;
  border-radius: 20px;
  border: 2px solid rgba(78, 78, 78, 0.15);
  width: 70%;
  padding: 10px;
}

.edit-modal {
  display: flex;
  align-items: center;
  justify-content: center;
}

.edit-inputs {
  display: flex;
  flex-direction: column;
  align-items: center;
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

///adress style
.adress {
  width: 100%;
  height: 35vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 25px;
  box-shadow: 0 5px 7px rgba(0, 0, 0, 0.2);
  background-color: rgba(253, 253, 253, 0.5);
  font-size: 1.8vh;
}

.delivery-adress {
  background-color: #fff;
  border-radius: 20px;
  border: 2px solid rgba(78, 78, 78, 0.15);
  width: 70%;
  padding: 10px;
}

.delivery-options {
  display: flex;
  width: 100%;
  height: 100%;
  margin: 10px;
}

.poshta {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 15vw;

  >div:nth-child(1) {
    font-weight: bold;
    font-size: 2vh;
    text-align: center;
    margin: 5px 0;
    width: 30vh;
  }

}

.radio-container {
  display: flex;
  align-items: center;
  justify-content: center;
}

.radio-tabs {
  width: 230px;
  display: flex;
  position: relative;
  margin: 2vh;

  * {
    z-index: 2;
  }
}

.tab {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 25px;
  width: 200px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: color 0.15s ease-in;
  color: #5f5f5f;
}

.glider2 {
  position: absolute;
  display: flex;
  height: 27px;
  width: 113px;
  background-color: #ffffff;
  box-shadow: 0 5px 7px rgba(0, 0, 0, 0.2);
  z-index: 1;
  border-radius: 20px; // just a high number to create pill effect
  transition: 0.25s ease-out;
}

.navButton {
  height: 3vh;
  padding: 0.6vw;
  margin: 0 0.25em 0 0.25rem;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  text-decoration: none;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.6), 0 -2px 3px rgba(255, 255, 255, 1);
  font-family: Verdana, Geneva, Tahoma, sans-serif;
  border-radius: 25px;
  background: white;
  box-shadow: 0px 5px 5px rgba(0, 0, 0, 0.3), inset 0px 0px 0px rgba(0, 0, 0, 0);
  transition: 0.3s;
  color: black;
  cursor: pointer;

  &>* {
    margin: 0 0.3vh;
  }
}

.navButton:hover {
  transition: 0.3s;
  box-shadow: 0px 1px 1px rgba(0, 0, 0, 0.3), inset 0px 0px 0px rgba(0, 0, 0, 0);
}

.navButton:active {
  box-shadow: 0px 0px 0px rgba(0, 0, 0, 0.3),
    inset 0px 3px 5px rgba(0, 0, 0, 0.3);
  transition: 0.3s;
}

.box {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.cart-img {
  height: 12vh;
  border-radius: 25px;
  cursor: pointer;
}

input[type="radio"] {
  display: none;
}

.cart-name {
  margin: 1vh 0;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2.2vh;
  z-index: 1;
  font-weight: bold;
}

.headers {
  padding: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2vh;
  font-weight: bold;
  z-index: 1;
}

#trash {
  height: 6vh;
  width: 3vw;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 1.5vh;
  background-color: rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: background-color 0.5s;

  &:hover {
    background-color: rgba(255, 105, 105, 0.452);
  }
}

.round-btn {
  width: 25px;
  height: 25px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 10px;
  border: none;
  border-radius: 25px;
  backdrop-filter: blur(35px);
  -webkit-backdrop-filter: blur(35px);
  background-color: rgba(253, 253, 253, 0.8);
  box-shadow: 0px 3px 5px rgba(0, 0, 0, 0.75), inset 0px 0px 0px rgba(0, 0, 0, 0);
  font-size: 20px;
  transition: 0.3s;
  cursor: pointer;
}

.round-btn:hover {
  box-shadow: 0px 1px 5px rgba(0, 0, 0, 0.5), inset 0px 0px 0px rgba(0, 0, 0, 0);
  transition: 0.3s;
}

.round-btn:active {
  box-shadow: 0px 0px 0px rgba(0, 0, 0, 0.5), inset 0px 3px 3px rgba(0, 0, 0, 0.5);
  transition: 0.3s;
}

.btn-primary {
  width: auto;
  height: 5vh;
  border: none;
  padding: 0 1vw;
  font-size: 1.8vh;
  font-family: Verdana, Geneva, Tahoma, sans-serif;
  border-radius: 25px;
  background-color: rgba(253, 253, 253, 1);
  box-shadow: 0px 5px 7px rgba(0, 0, 0, 0.3), inset 0px 0px 0px rgba(0, 0, 0, 0);
  transition: 0.3s;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-primary:hover {
  transition: 0.3s;
  box-shadow: 0px 1px 1px rgba(0, 0, 0, 0.3), inset 0px 0px 0px rgba(0, 0, 0, 0);
}

.btn-primary:active {
  box-shadow: 0px 0px 0px rgba(0, 0, 0, 0.3),
    inset 0px 3px 5px rgba(0, 0, 0, 0.3);
  transition: 0.1s;
}

.btn-secondary {
  width: auto;
  height: 5vh;
  margin: 10px;
  padding: 0 1vw;
  border: none;
  font-size: 1.8vh;
  font-family: Verdana, Geneva, Tahoma, sans-serif;
  border-radius: 25px;
  background-color: rgba(253, 253, 253, 0.2);
  box-shadow: 0px 0px 0px rgba(0, 0, 0, 0.3), inset 0px 0px 0px rgba(0, 0, 0, 0);
  transition: 0.3s;
  cursor: pointer;
}

.btn-secondary:hover {
  transition: 0.3s;
  box-shadow: 0px 1px 1px rgba(0, 0, 0, 0.3), inset 0px 3px 5px rgba(0, 0, 0, 0.3);
}

.btn-secondary:active {
  box-shadow: 0px 0px 0px rgba(0, 0, 0, 0.3),
    inset 0px 3px 5px rgba(0, 0, 0, 0.3);
  transition: 0.1s;
}

input {
  border-radius: 25px;
  border: none;
  margin: 0.3vh 25px;
  padding: 5px 10px;
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.5);
  height: 3vh;
  width: 12dvw;
  font-size: 1.8vh;
}

input[type="radio"] {
  display: none;
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
    &~.glider2 {
      transform: translateX(0);
    }
  }
}

input[id="radio-2"] {
  &:checked {
    &~.glider2 {
      transform: translateX(100%);
    }
  }
}

input[id="radio-p1"] {
  &:checked {
    &~.glider {
      transform: translateX(0);
    }
  }
}

input[id="radio-p2"] {
  &:checked {
    &~.glider {
      transform: translateX(100%);
    }
  }
}

.order-confiramtion {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: absolute;
  z-index: 100;
  height: 90%;
  background-color: rgb(255, 255, 255);
  text-align: center;
  font-size: 2vh;
  gap: 2vh;
  padding: 5vh;
  font-family: Verdana, Geneva, Tahoma, sans-serif;

  img {
    height: 20vh;
  }
}

a {
  text-decoration: none;
  color: inherit;
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.75s;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(120%);
}

.menu-container {
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  width: 100%;
  height: 100%;
}

@media (max-width: 550px) {

  #trash {
    width: 12vw;
  }

  .cart {
    width: 100%;
  }

  .cart-items {
    height: 10vh;
    backdrop-filter: none;
    background-color: rgba(253, 253, 253, 1);
    padding: 5px 15px 5px 0;

    >img {
      width: 10dvh;

    }
  }

  input {
    width: 50vw;
  }

  .navButton {
    height: 4vh;
  }
}
</style>
