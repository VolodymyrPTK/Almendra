<template>
  <div class="cart">

    <div class="cart-name">{{ show ? 'Оформлення замовлення' : 'Кошик' }}</div>

    <div v-if="!show" class="cart-container">
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
        <button class="round-btn" @click="deleteProduct(item.id)">x</button>
      </div>
    </div>

    <div v-else="show" class="data-container">
      <div class="cart-name">До сплати {{ total }} грн</div>

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

      <div class="profile">
        <div class="user-name" v-if="!showModalFlag">
          <div class="headers">Дані для відправки</div>
          <div style="display: flex; width: 90%; align-items: center; justify-content: space-around;">
            <div>
              <div style="margin-bottom: 7px;"><b>Ім'я:</b> {{ profile.firstName }} {{ profile.secondName }}</div>
              <div style="margin-bottom: 7px;"><b>Телефон:</b>{{ formattedPhoneNumber }}</div>
            </div>
            <div v-on:click="showModal()"><img src="../assets/edit.png" alt="edit"></div>
          </div>
        </div>

        <div class="edit-modal" v-if="showModalFlag">
          <div class="edit-inputs">
            <input type="text" id="name" v-model="profile.secondName" placeholder="Призвіще" />
            <input type="text" id="name" v-model="profile.firstName" placeholder="Ім'я" />
            <input type="text" id="phone" v-model="profile.phone" placeholder="Телефон" />
          </div>
          <div class="edit-buttons">
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
        <div style="font-weight: bold; font-size: 21px; margin: 5px 0;" v-if="!expandedNovaPoshta && !expandedUkrPoshta">
          Адреса Доставки</div>

        <div class="delivery-adress" v-if="!expandedNovaPoshta && !expandedUkrPoshta">
          <div class="expanded" v-if="profile.deliveryOption === 'novaPoshta'">
            <div style="font-weight: bold; font-size: 21px; margin-bottom: 5px;">Нова Пошта</div>
            <div><b>Місто:</b> {{ profile.city }}</div>
            <div><b>Віділеня:</b> {{ profile.warehouse }}</div>
          </div>

          <div class="expanded" v-else-if="profile.deliveryOption === 'ukrPoshta'">
            <div style="font-weight: bold; font-size: 21px; margin-bottom: 5px;">УкрПошта</div>
            <div><b>Місто:</b> {{ profile.city }}</div>
            <div><b>Індекс:</b> {{ profile.cityIndex }}</div>
          </div>

          <div v-else>
            <div style="font-size: 20px; font-weight: bold; margin: 5px">Виберіть перевізника</div>
          </div>
        </div>

        <div style="display: flex; flex-direction: column; align-items: center;"
          v-if="!expandedNovaPoshta && !expandedUkrPoshta">

          <div style="font-weight: bold; font-size: 21px; margin: 5px 0;"
            v-if="profile.deliveryOption === 'ukrPoshta' || profile.deliveryOption === 'novaPoshta'">Вибрати іншу адресу
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
          <div style="font-weight: bold; font-size: 21px; margin: 5px 0;">Нова Пошта</div>
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
            <li v-for="warehouse in filteredWarehouses.filter(warehouse => warehouse.Number.startsWith(searchWarehouse))"
              @click="selectWarehouse(warehouse)">
              {{ warehouse.Description }}
            </li>
          </ul>
          <div style="display: flex;">
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
          <div>
            <button class="btn-primary" @click="updateUserDataUP">Зберегти</button>
            <button class="btn-secondary" @click="reset">Назад</button>
          </div>
        </div>
      </div>

      <div class="button-container">
        <button style="width: 50%;" class="btn-primary" @click="createOrder()">Оформити</button>
        <button class="btn-secondary" @click="closeConfirm()">Назад</button>
      </div>
    </div>

    <div class="button-container" :class="{ down: show }">
      <div class="cart-name">До сплати {{ total }} грн</div>
      <button class="btn-primary" @click="saveCart()">Сплатити</button>
      <button class="btn-secondary" @click="closeCart()">Закрити</button>
    </div>

    <div class="order-confiramtion" v-if="orderConfirmed">
      <img src="../assets/imgs/icons/done.png" alt="">
      <h2>Дякуємо за замовлення</h2>
      <RouterLink class="view-order" to="/user" @click="closeCart()">Переглянути замовлення</RouterLink>
    </div>
  </div>
</template>

<script>
import { RouterLink } from "vue-router";
import { getAuth } from "firebase/auth";
import { setDoc, doc, getDoc, getDocs, query, where, onSnapshot, increment, collection, deleteDoc, updateDoc, orderBy, limit } from "firebase/firestore";
import { profileReg, cartReg, dataBase, db, orderReg } from "../main";

const apiKey = "0fe8dfcca7f61242d252e83fd715eaf2";
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
        cityIndex: ""
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
      payment: "payLater",
    };
  },
  methods: {
    onNovaPoshtaClick() {
      this.selectedOption = 'novaPoshta';
      this.expandedNovaPoshta = true;
      console.log('novaposhta')
    },
    onUkrPoshtaClick() {
      this.selectedOption = 'ukrPoshta';
      this.expandedUkrPoshta = true;
      this.profile.cityIndex = "";
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
    async createOrder() {
      const cartId = this.cartId;
      console.log(cartId)
      const items = this.items;
      const userData = this.profiles;
      const time = new Date().toLocaleString("en-US", {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
      });

      // Get the last order document
      const queryD = query(orderReg, orderBy("orderId", "desc"), limit(1));
      const querySnapshot = await getDocs(queryD);
      let lastId = 0;
      querySnapshot.forEach((doc) => {
        // Get the id of the last order
        lastId = doc.data().orderId;
      });
      // Create a new order document with id = lastId + 1
      const order = {
        orderId: lastId + 1,
        uid: this.profile.uid,
        items,
        userData,
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
    },
  },
  async created() {
    const auth = getAuth();
    const user = auth.currentUser;
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
        }
      });
      // Fetch cart
      const q = query(
        cartReg,
        where('uid', '==', this.profile.uid),
        where('finalized', '==', false)
      );
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        this.cartId = querySnapshot.docs[0].id;
        const cartData = collection(cartReg, this.cartId, 'cartProducts');
        onSnapshot(cartData, (snapshot) => {
          this.items = [];
          snapshot.docs.forEach((doc) => {
            this.items.push({ ...doc.data(), id: doc.id });
          });
        });
      }

      // Fetch products
      onSnapshot(dataBase, (snapshot) => {
        this.products = [];
        snapshot.docs.forEach((doc) => {
          this.products.push({ ...doc.data(), id: doc.id });
        });
      });
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
  },
};
</script>

<style scoped lang="scss">
li {
  cursor: pointer;
  padding: 10px;
  margin: 7px;
  transition: 0.75s;
  background-color: white;
  box-shadow: 0 5px 7px rgba(0, 0, 0, 0.2);
  border-radius: 20px;
}

li:hover {
  transition: 0.5s;
  background-color: #e9e9e9;
  box-shadow: 0 2px 2px rgba(0, 0, 0, 0.2);
}

ul {
  position: absolute;
  height: 200px;
  width: 300px;
  z-index: 10;
  list-style: none;
  padding: 5px 0 5px 0;
  border-radius: 25px;
  box-shadow: 0 15px 15px rgba(0, 0, 0, 0.4), 0 -1px 20px rgba(0, 0, 0, 0.2);
  background-color: rgba(253, 253, 253, 1);
  border: solid 15px rgba(253, 253, 253, 1);
  overflow-y: scroll;
  transition: 0.75s;
}

ul::-webkit-scrollbar {
  display: none;
}

#ul-1 {
  margin-top: -205px;
}

#ul-2 {
  margin-top: -65px;
  height: 150px;
}

h2,
h3 {
  margin: 5px 0 5px 0;
}

.button-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 25px;
  margin-top: 20px;
  position: relative;
  z-index: 1;
}

.cart {
  overflow: hidden;
  display: flex;
  position: fixed;
  flex-direction: column;
  justify-content: space-between;
  width: 500px;
  height: 80%;
  backdrop-filter: blur(35px);
  -webkit-backdrop-filter: blur(35px);
  background-color: rgba(253, 253, 253, 0.1);
  border-radius: 25px;
  box-shadow: -15px 0 25px rgba(0, 0, 0, 0.6);
  right: 25px;
  transition: 0.5s;
}

.box {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.expanded {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  margin: 10px;
}

.cart-img {
  height: 100px;
  border-radius: 25px;
  cursor: pointer;
}


///adress style
.adress {
  width: 424px;
  height: 290px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 25px;
  box-shadow: 0 5px 7px rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(35px);
  -webkit-backdrop-filter: blur(35px);
  background-color: rgba(253, 253, 253, 0.5);
}

.delivery-adress {
  background-color: #fff;
  border-radius: 25px;
  border: 2px solid rgba(78, 78, 78, 0.15);
  font-size: 18px;
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
  width: 280px;

  input {
    margin: 10px 0;
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

  * {
    z-index: 2;
  }
}

.profile {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 25px;
  box-shadow: 0 5px 7px rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(35px);
  -webkit-backdrop-filter: blur(35px);
  background-color: rgba(253, 253, 253, 0.5);

}

input[type="radio"] {
  display: none;
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

.cart-container {
  height: 100%;
  overflow: scroll;
  overflow-y: scroll;
  scroll-behavior: smooth;
  transform: scale(1.00);
}

.cart-container>div:hover {
  transform: scale(1.02);
  transition: 0.5s;
}


.cart-container::-webkit-scrollbar {
  display: none;
}


.data-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  height: 100vh;

  >div {
    margin: 9px 0;
  }
}

.down {
  transform: translateY(180px);
  transition: 0.5s;
  z-index: 1;
}

.quant {
  display: flex;
  align-items: baseline;
}

.cart-name {
  margin-top: 10px;
  height: 20px;
  padding: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 22px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.6), 0 -2px 3px rgba(255, 255, 255, 1);
  z-index: 1;
}

.headers {
  height: 20px;
  padding: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;
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
  margin: 0 10px;
  border: none;
  border-radius: 25px;
  backdrop-filter: blur(35px);
  -webkit-backdrop-filter: blur(35px);
  background-color: rgba(253, 253, 253, 0.8);
  box-shadow: 0px 3px 5px rgba(0, 0, 0, 0.75), inset 0px 0px 0px rgba(0, 0, 0, 0);
  font-size: 20px;
  transition: 0.3s;
}

.round-btn:hover {
  box-shadow: 0px 1px 5px rgba(0, 0, 0, 0.5), inset 0px 0px 0px rgba(0, 0, 0, 0);
  transition: 0.3s;
}

.round-btn:active {
  box-shadow: 0px 0px 0px rgba(0, 0, 0, 0.5), inset 0px 3px 3px rgba(0, 0, 0, 0.5);
  transition: 0.3s;
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

.btn-primary {
  width: 100px;
  height: 44px;
  margin: 10px;
  border: none;
  font-size: 18px;
  font-family: Verdana, Geneva, Tahoma, sans-serif;
  border-radius: 25px;
  backdrop-filter: blur(35px);
  -webkit-backdrop-filter: blur(35px);
  background-color: rgba(253, 253, 253, 0.8);
  box-shadow: 0px 5px 7px rgba(0, 0, 0, 0.3), inset 0px 0px 0px rgba(0, 0, 0, 0);
  transition: 0.3s;
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
  width: 100px;
  height: 44px;
  margin: 10px;
  border: none;
  font-size: 18px;
  font-family: Verdana, Geneva, Tahoma, sans-serif;
  border-radius: 25px;
  backdrop-filter: blur(35px);
  -webkit-backdrop-filter: blur(35px);
  background-color: rgba(253, 253, 253, 0.2);
  box-shadow: 0px 0px 0px rgba(0, 0, 0, 0.3), inset 0px 0px 0px rgba(0, 0, 0, 0);
  transition: 0.3s;
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

.user-name {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  width: 424px;
  height: 142px;
}

.edit-modal {
  width: 404px;
  height: 122px;
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  input {
    border-radius: 25px;
    border: none;
    margin: 5px 25px;
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

.radio-container2 {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0.75rem;
  border-radius: 25px;
  box-shadow: 0 5px 7px rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(35px);
  background-color: rgba(253, 253, 253, 0.5);
}

.pay-tabs {
  display: flex;
  position: relative;
}

.pay-tab {
  z-index: 3;
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

input {
  border-radius: 25px;
  border: none;
  margin: 5px 25px;
  padding: 7px;
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.5);
  width: 80%;
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
  width: 100%;
  height: 100%;
  background-color: rgb(255, 255, 255);

  img {
    height: 12vw;
  }
}

.view-order {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 17vw;
  height: 4vw;
  border: none;
  font-size: 20px;
  font-family: Verdana, Geneva, Tahoma, sans-serif;
  border-radius: 10vw;
  background-color: rgba(253, 253, 253, 0.8);
  box-shadow: 0px 5px 7px rgba(0, 0, 0, 0.3), 0px -1px 5px rgba(0, 0, 0, 0.1), inset 0px 0px 0px rgba(0, 0, 0, 0);
  transition: 0.3s;
  margin-top: 2vw;
}

a {
  text-decoration: none;
  color: inherit;
}
</style>
