<template>
  <div class="body">
    <div class="orders">
      <h3 style="text-align: center;">Замовлення</h3>
      <div class="order-container" v-for="order in orders" :key="order.id">
        <div class="order-row">
          <div><b>Замовлення:</b> {{ order.orderId }}</div>
          <div><b>Сума:</b> ₴ {{ order.total }}</div>
          <div><b>Дата:</b> {{ order.time }}</div>
          <td class="select-container">
            <div :class="{ 'active': order.orderStatus === 'Processing' }" :title="'Обробляється'"><img
                src="../assets/imgs/icons/processing.svg" alt="Обробляється"></div>
            <div :class="{ 'active': order.orderStatus === 'Preparing' }" :title="'Комплектується'"><img
                src="../assets/imgs/icons/boxing.svg" alt="Комплектується"></div>
            <div :class="{ 'active': order.orderStatus === 'Prepared' }" :title="'Комплектовано'"><img
                src="../assets/imgs/icons/boxed.svg" alt="Комплектовано"></div>
            <div :class="{ 'active': order.orderStatus === 'Shipped' }" :title="'Відправлено'"><img
                src="../assets/imgs/icons/shipping.svg" alt="Відправлено"></div>
            <div :class="{ 'active': order.orderStatus === 'Received' }" :title="'Отримано'"><img
                src="../assets/imgs/icons/delivered.svg" alt="Отримано"></div>
          </td>
          <div class="button" @click="showDetails(order)"><img src="../assets/imgs/icons/expand.svg" alt=""> </div>
        </div>
        <table v-if="orderDetails === order.id">
          <thead>
            <tr>
              <th>Назва</th>
              <th>Ціна</th>
              <th>Кількість</th>
              <th>Сума</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in order.items">
              <td>{{ item.id }}</td>
              <td>{{ item.price }}</td>
              <td>{{ item.quantity }}</td>
              <td>{{ item.quantity * item.price }}</td>
            </tr>
          </tbody>
        </table>

      </div>
    </div>

    <div class="user">

      <div class="profile">
        <img class="profilePic" src="../assets/Logo.png" alt="profilePic" />
        <div class="edit-modal" v-if="!showModalFlag">
          <h3>Вітаємо!</h3>
          <h3>{{ profile.firstName }} {{ profile.secondName }}</h3>
          <div class="user-data" style="align-items: center;">
            <div>{{ profile.email }}</div>
            <div v-if="profile.phone">{{ formattedPhoneNumber }}</div>
            <div style="cursor: pointer; color: blueviolet;" v-else v-on:click="showModal()">Додати телефон</div>
          </div>
          <button class="btn" v-on:click="showModal()">Редагувати</button>
        </div>

        <div class="edit-modal" v-if="showModalFlag">
          <input placeholder="Ім'я" type="text" id="name" v-model="profile.secondName" />
          <input placeholder="Призвіще" type="text" id="surename" v-model="profile.firstName" />
          <input placeholder="Телефон" type="text" id="phone" v-model="profile.phone" />
          <div style="display: flex; align-items: center; justify-content: center;">
            <button class="btn" @click="updateData()" :disabled="loading">
              <div class="spinner-container" v-if="loading">
                <div class="spinner-border" role="status"></div>
              </div>
              <div v-else>Зберегти</div>
            </button>
            <button class="btn" v-on:click="hideModal()">Назад</button>
          </div>
        </div>
      </div>

      <div class="adress">
        <h3 v-if="!expandedNovaPoshta && !expandedUkrPoshta">Адреса Доставки</h3>

        <div class="delivery-adress" v-if="!expandedNovaPoshta && !expandedUkrPoshta">
          <div class="expanded" v-if="profile.deliveryOption === 'novaPoshta'">
            <div style="font-weight: bold; text-align: center; font-size: 2vh; margin-bottom: 5px;">Нова Пошта</div>
            <div><b>Місто:</b> {{ profile.city }}</div>
            <div v-if="profile.postType === 'Warehouse'"><b>Віділення:</b> {{ profile.warehouse }}</div>
            <div v-else-if="profile.postType === 'Postomat'"><b>Поштомат:</b> {{ profile.warehouse }}</div>
          </div>

          <div class="expanded" v-else-if="profile.deliveryOption === 'ukrPoshta'">
            <div style="font-weight: bold; text-align: center; font-size: 2vh; margin-bottom: 5px;">УкрПошта</div>
            <div><b>Місто:</b> {{ profile.city }}</div>
            <div><b>Індекс:</b> {{ profile.cityIndex }}</div>
          </div>

          <div v-else>
            <div style="font-size: 2vh; font-weight: bold; margin: 5px">Виберіть перевізника</div>
          </div>
        </div>

        <div style="display: flex; flex-direction: column; align-items: center;"
          v-if="!expandedNovaPoshta && !expandedUkrPoshta">
          <div style="font-weight: bold; text-align: center; font-size: 2vр; margin: 5px 0;"
            v-if="profile.deliveryOption === 'ukrPoshta' || profile.deliveryOption === 'novaPoshta'">або виберіть іншу
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
          <h2>Нова Пошта</h2>
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
              <span class="glider"></span>
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
          <div>
            <button class="btn" @click="updateUserData">Зберегти</button>
            <button class="btn" @click="reset">Назад</button>
          </div>
        </div>

        <div class="poshta" v-if="expandedUkrPoshta">
          <h2>УкрПошта</h2>
          <input placeholder="Місто" type="text" v-model="search" @input="searchCities"
            @input.debounce="showDropdown = true" />
          <ul id="ul-1" v-if="showDropdown">
            <li v-for="city in cities" @click="selectCity(city)">
              {{ city.Description }}
            </li>
          </ul>
          <input placeholder="Індекс" type="text" v-model="profile.cityIndex">
          <div>
            <button class="btn" @click="updateUserDataUP">Зберегти</button>
            <button class="btn" @click="reset">Назад</button>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import { getAuth } from "firebase/auth";
import { doc, getDocs, query, where, onSnapshot, updateDoc } from "firebase/firestore";
import { orderReg, profileReg, db } from "../main";

const apiKey = "b78d2a5d64f6903591a12493aa852776";
const endpointRef = "https://api.novaposhta.ua/v2.0/json/";

export default {
  name: "User",
  props: {
    msg: String,
  },
  data() {
    return {
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
      orders: [],
      order: {
        orderId: ""
      },
      loading: false,
      search: "",
      searchWarehouse: "",
      cities: [],
      selectedCity: null,
      showModalFlag: false,
      showDropdown: false,
      showDropdownW: false,
      warehouses: [],
      selectedWarehouse: null,
      filteredWarehouses: [],
      deliveryOption: "",
      selectedCategory: "Warehouse",
      expandedNovaPoshta: false,
      expandedUkrPoshta: false,
      messageNP: 'Нова Пошта',
      messageUP: 'УкрПошта',
      orderDetails: null
    };
  },
  methods: {
    showDetails(order) {
      // If the clicked order is already expanded, then collapse it
      if (this.orderDetails === order.id) {
        this.orderDetails = null;
      } else {
        // Otherwise, show the details of the clicked order
        this.orderDetails = order.id;
      }
    },
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
    hideModal() {
      this.showModalFlag = false;
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
  },
  async created() {
    const auth = getAuth();
    const user = auth.currentUser;
    this.profile.email = user.email;
    this.profile.uid = user.uid;
    const docRef = doc(profileReg, this.profile.uid);
    onSnapshot(docRef, (doc) => {
      this.profiles.push({ ...doc.data(), id: doc.id });
      this.profile.firstName = doc.data().firstName;
      this.profile.secondName = doc.data().secondName;
      this.profile.city = doc.data().city;
      this.profile.warehouse = doc.data().warehouse;
      this.profile.cityIndex = doc.data().cityIndex;
      this.profile.phone = doc.data().phone ?? "";
      this.profile.deliveryOption = doc.data().deliveryOption;
      this.profile.postType = doc.data().postType;
    });
    const q = query(
      orderReg,
      where('uid', '==', this.profile.uid),
    );
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      this.orders = [];
      querySnapshot.docs.forEach((doc) => {
        this.orders.push({ ...doc.data(), id: doc.id });
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
.body {
  display: flex;
  height: 80vh;
  justify-content: center;
  margin-top: 2vw;
  gap: 20px;
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
  width: 90%;
  height: 100%;
}

.user-data {
  padding: 1vw 2vh;
  background-color: #fff;
  border-radius: 25px;
  border: 2px solid rgba(78, 78, 78, 0.15);
  font-size: 2vh;
  width: 90%;
}

.delivery-options {
  display: flex;
  width: 100%;
  height: 100%;
  margin: 10px;
}

.cart-img {
  height: 12vh;
  border-radius: 25px;
  cursor: pointer;
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.3), 0 -1px 20px rgba(0, 0, 0, 0.2);
}

.orders {
  width: 90%;
  height: 100%;
  overflow: scroll;
  overflow-y: scroll;
  scroll-behavior: smooth;
  border-radius: 25px;
  box-shadow: 0 15px 15px rgba(0, 0, 0, 0.4), 0 -1px 20px rgba(0, 0, 0, 0.2);
  background-color: rgba(253, 253, 253, 0.75);
  border: 1px solid rgba(255, 255, 255, 0.125);
  padding: 1vh;
}

.orders::-webkit-scrollbar {
  display: none;
}

.order-row {
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 100%;
}

.button {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 2vw;
  width: 2vw;
  border-radius: 50px;
  border: none;
  background-color: rgba(255, 255, 255, 1);
  box-shadow: 0 3px 5px rgba(0, 0, 0, 0.3);
  cursor: pointer;
  transition: 0.3s;


  img {
    height: 4vh;
  }

  &:hover {
    background-color: rgba(238, 238, 238, 1);
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  }
}

.profile {
  height: 50%;
  width: 20vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 25px;
  box-shadow: 0 15px 15px rgba(0, 0, 0, 0.4), 0 -1px 20px rgba(0, 0, 0, 0.2);
  background-color: rgba(253, 253, 253, 0.75);
  border: 1px solid rgba(255, 255, 255, 0.125);
  font-size: 2vh;
}

.adress {
  height: 50%;
  width: 20vw;
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 25px;
  box-shadow: 0 15px 15px rgba(0, 0, 0, 0.4), 0 -1px 20px rgba(0, 0, 0, 0.2);
  background-color: rgba(253, 253, 253, 0.75);
  font-size: 2vh;
}

.delivery-adress {
  padding: 0.5vw 0.5vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #fff;
  border-radius: 25px;
  border: 2px solid rgba(78, 78, 78, 0.15);
  font-size: 2vh;
  width: 90%;
}

.profilePic {
  height: 10vh;
  width: 10vh;
  border-radius: 100px;
  border: 5px solid white;
  box-shadow: 0 15px 15px rgba(0, 0, 0, 0.4);
}

.btn {
  display: inline-block;
  text-align: center;
  font-size: 2vh;
  border: none;
  border-radius: 25px;
  width: auto;
  height: 5vh;
  padding: 1.5vh 0.5vw;
  margin: 10px;
  box-shadow: 0px 5px 5px rgba(0, 0, 0, 0.3), inset 0px 0px 0px rgba(0, 0, 0, 0);
  background-color: white;
}

.btn:hover {
  transition: 0.3s;
  box-shadow: 0px 1px 1px rgba(0, 0, 0, 0.3), inset 0px 0px 0px rgba(0, 0, 0, 0);
}

.btn:active {
  box-shadow: 0px 0px 0px rgba(0, 0, 0, 0.3),
    inset 0px 3px 5px rgba(0, 0, 0, 0.3);
  transition: 0.3s;
}

.edit-modal {
  margin: 25px;
  height: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
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

///
.radio-container {
  display: flex;
  align-items: center;
  justify-content: center;
}

.radio-tabs {
  display: flex;
  align-items: center;
  height: 4vh;
  width: 230px;
  display: flex;
  position: relative;

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
  height: 25px;
  width: 200px;
  font-size: 1rem;
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
  height: 25px;
  width: 115px;
  background-color: #ffffff;
  box-shadow: 0 5px 7px rgba(0, 0, 0, 0.2);
  z-index: 1;
  border-radius: 20px; // just a high number to create pill effect
  transition: 0.25s ease-out;
}

.order-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 25px;
  box-shadow: 0px 5px 7px rgba(0, 0, 0, 0.3), inset 0px 0px 0px rgba(0, 0, 0, 0);
  margin: 0.5vw;
  background-color: #ffffff;
}

table td:nth-child(1) {
  text-align: left;
}

table td:nth-child(2) {
  text-align: center;
  width: 20%;
}

table td:nth-child(3) {
  text-align: center;
  width: 20%;
}

table td:nth-child(4) {
  text-align: center;
  width: 20%;
}

table {
  border-collapse: collapse;
  width: 95%;
  margin: 1vw 0 1vw 0;
}

th {
  background-color: rgb(231, 231, 231);
}

tr,
th,
td {
  border: none;
  padding: 0.2vw;
  text-align: center;
}

tr:nth-child(even) {
  background-color: rgb(231, 231, 231);
}

.poshta {
  display: flex;
  flex-direction: column;
  align-items: center;
}

input,
select {
  height: 4vh;
  width: 210px;
  border: 1px solid #ccc;
  border-radius: 25px;
  padding: 0 10px;
  font-size: 2vh;
}

ul,
option {
  list-style: none;
  margin: 0;
  padding: 10px;
  border-top: none;
  background-color: white;
  height: 200px;
  width: 300px;
  overflow-y: scroll;
  box-shadow: 0 15px 15px rgba(0, 0, 0, 0.2);
  position: relative;
}

ul::-webkit-scrollbar {
  display: none;
}

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
  z-index: 5;
  padding: 5px 0 5px 0;
  position: absolute;
  border-radius: 25px;
  transition: 0.75s;
  box-shadow: 0 15px 15px rgba(0, 0, 0, 0.4), 0 -1px 20px rgba(0, 0, 0, 0.2);
  background-color: rgba(253, 253, 253, 1);
  border: solid 15px rgba(253, 253, 253, 1);
}

#ul-1 {
  margin-top: 75px;
}

#ul-2 {
  margin-top: 135px;
  height: 150px;
}

h2,
h3,
h4 {
  margin: 5px 0 5px 0;
}

.select-container {
  display: flex;
  justify-content: center;
  align-items: center;

  >div {
    margin: 1vw;
  }
}

.active {
  display: flex;
  align-items: center;
  background-color: rgb(228, 228, 228);
  box-shadow: 0 3px 3px rgba(116, 116, 116, 0.5);
  border: solid 2px;
  border-radius: 25px;
  padding: 0.5vw;
}

@media (max-width: 550px) {

  .body {
    display: flex;
    flex-direction: column-reverse;
    justify-content: center;
    align-items: center;
    height: auto;
  }

  .orders {
    width: 90%;
  }

  .button {
    height: 5vh;
    width: 5vh;
  }

  .order-row {
    height: 25vw;
    flex-wrap: wrap;
    padding: 1vh;
  }

  table {
    margin: 2vh;
  }

  .user {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;

    >div {
      width: 95%;
    }
  }

  .btn {
    width: auto;
    height: auto;
    padding: 3vw;
  }

  .select-container {
    display: flex;
    justify-content: center;
    align-items: center;

    >div {
      margin: 2vw;
    }
  }

  .active {
    padding: 1.5vw;
  }

}
</style>
