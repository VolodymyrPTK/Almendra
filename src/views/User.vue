<template>
  <div class="body">
    <div class="orders"></div>
    <div class="user">
      <div class="profile">
        <img class="profilePic" src="../assets/Logo.png" alt="profilePic" />
        <div class="edit-modal" v-if="!showModalFlag">
          <h3>Вітаємо!</h3>
          <div class="names">
            <h2>{{ profile.firstName }}&nbsp;</h2>
            <h2>{{ profile.secondName }}</h2>
          </div>
          <h3>{{ profile.email }}</h3>
          <h3>{{ formattedPhoneNumber }}</h3>
          <button class="btn" v-on:click="showModal()">
            Редагувати
          </button>
        </div>

        <div class="edit-modal" v-if="showModalFlag">
          <label for="name">Призвіще</label>
          <input type="text" id="name" v-model="profile.secondName" />
          <label for="name">Ім'я</label>
          <input type="text" id="name" v-model="profile.firstName" />
          <label for="phone">Телефон</label>
          <input type="text" id="phone" v-model="profile.phone" />
          <div style="display: flex ;">
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
        <h3 v-if="!expandedNovaPoshta && !expandedUkrPoshta">Адреса Доставки
        </h3>

        <div class="delivery-adress" v-if="!expandedNovaPoshta && !expandedUkrPoshta">
          <div class="expanded" v-if="profile.deliveryOption === 'novaPoshta'">
            <div>Місто: {{ profile.city }}</div>
            <div>Віділеня: {{ profile.warehouse }}</div>
          </div>

          <div class="expanded" v-else-if="profile.deliveryOption === 'ukrPoshta'">
            <div>Місто: {{ profile.city }}</div>
            <div>Індекс: {{ profile.cityIndex }}</div>
          </div>

          <div v-else>
            <div>Виберіть перевізника</div>
          </div>
        </div>

        <div style="display: flex; flex-direction: column; align-items: center;"
          v-if="!expandedNovaPoshta && !expandedUkrPoshta">
          <h3 v-if="profile.deliveryOption === 'novaPoshta' && 'ukrPoshta'">Або виберіть іншу</h3>
          <div class="delivery-options">
            <div class="box" @click="onNovaPoshtaClick" v-if="!expandedNovaPoshta && !expandedUkrPoshta">
              <img class="cart-img" src="../assets/novaposhta.jpg" alt="Нова Пошта">
            </div>
            <div class="box" @click="onUkrPoshtaClick" v-if="!expandedNovaPoshta && !expandedUkrPoshta">
              <img class="cart-img" src="../assets/ukrposhta.png" alt="УкрПошта">
            </div>
          </div>
        </div>

        <div class="poshta" v-if="expandedNovaPoshta">
          <h2>Нова Пошта</h2>
          <input placeholder="Місто" type="text" v-model="search" @input="searchCities"
            @input.debounce="showDropdown = true" />
          <ul v-if="showDropdown">
            <li v-for="city in cities" @click="selectCity(city)">
              {{ city.Description }}
            </li>
          </ul>

          <input placeholder="Віділення" type="text" v-model="searchWarehouse" @input="filterWarehouses"
            @input.debounce="showDropdownW = true" />
          <ul v-if="showDropdownW">
            <li v-for="warehouse in filteredWarehouses" @click="selectWarehouse(warehouse)">
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
          <ul v-if="showDropdown">
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
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { profileReg, db } from "../main";
import { ref } from 'vue';

const apiKey = "0fe8dfcca7f61242d252e83fd715eaf2";
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
        cityIndex: ""
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
      deliveryOption: ""
    };
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
  methods: {
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
          FindByString: searchNumber,
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
      } catch (error) {
        console.error(error);
      }
    },
    async updateUserData() {
      const userRef = doc(db, "profiles", this.profile.uid);
      await updateDoc(userRef, {
        city: this.selectedCity.Description,
        deliveryOption: this.selectedOption,
        warehouse: this.selectedWarehouse.Number,
      });
      this.reset();
    },
    reset() {
      this.expandedNovaPoshta = false;
      this.expandedUkrPoshta = false;
    },
    async updateUserDataUP() {
      const userRef = doc(db, "profiles", this.profile.uid);
      await updateDoc(userRef, {
        city: this.selectedCity.Description,
        deliveryOption: this.selectedOption,
        cityIndex: this.profile.cityIndex,
      });
    },
  },
  async created() {
    const auth = getAuth();
    const user = auth.currentUser;
    this.profile.email = user.email;
    this.profile.uid = user.uid;
    const docRef = doc(profileReg, this.profile.uid);
    getDoc(docRef).then((doc) => {
      this.profiles.push({ ...doc.data(), id: doc.id });
      this.profile.firstName = doc.data().firstName;
      this.profile.secondName = doc.data().secondName;
      this.profile.city = doc.data().city;
      this.profile.warehouse = doc.data().warehouse;
      this.profile.cityIndex = doc.data().cityIndex;
      this.profile.phone = doc.data().phone;
      this.profile.deliveryOption = doc.data().deliveryOption;
    });
  },
  computed: {
    formattedPhoneNumber() {
      const phoneNumber = this.profile.phone;
      const numericPhoneNumber = phoneNumber.replace(/\D/g, '');
      const formattedPhoneNumber = `(${numericPhoneNumber.slice(0, 3)})-${numericPhoneNumber.slice(3, 6)}-${numericPhoneNumber.slice(6)}`;
      return formattedPhoneNumber;
    }
  }
};
</script>

<style scoped lang="scss">
.poshta {
  display: flex;
  flex-direction: column;
  align-items: center;
}

input,
select {
  height: 25px;
  border: 1px solid #ccc;
  border-radius: 25px;
  border: none;
  padding: 0 10px;
  margin: 10px;
  font-size: 16px;
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

li {
  cursor: pointer;
  padding: 10px;
}

li:hover {
  background-color: #eee;
}

ul {
  position: absolute;
  margin-top: 55px;
  overflow-y: hidden;
}

h2,
h3 {
  margin: 10px 0 10px 0;
}

.body {
  display: flex;
  height: 100%;
  justify-content: center;
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

.delivery-options {
  display: flex;
  width: 100%;
  height: 100%;
  margin: 10px;
}

.cart-img {
  height: 100px;
  border-radius: 25px;
  cursor: pointer;
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.3), 0 -1px 20px rgba(0, 0, 0, 0.2);
}

.orders {
  width: 100%;
  border-radius: 25px;
  box-shadow: 0 15px 15px rgba(0, 0, 0, 0.4), 0 -1px 20px rgba(0, 0, 0, 0.2);
  background-color: rgba(253, 253, 253, 0.75);
  border: 1px solid rgba(255, 255, 255, 0.125);
  margin: 10px;
  padding: 25px;
}

.user {
  margin: 10px;
}

.names {
  display: flex;
  justify-content: space-around;
}

.profile {
  height: 400px;
  width: 275px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 25px;
  box-shadow: 0 15px 15px rgba(0, 0, 0, 0.4), 0 -1px 20px rgba(0, 0, 0, 0.2);
  background-color: rgba(253, 253, 253, 0.75);
  border: 1px solid rgba(255, 255, 255, 0.125);
}

.adress {
  height: 300px;
  width: 275px;
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 25px;
  box-shadow: 0 15px 15px rgba(0, 0, 0, 0.4), 0 -1px 20px rgba(0, 0, 0, 0.2);
  background-color: rgba(253, 253, 253, 0.75);
}

.delivery-adress {
  background-color: #fff;
  border-radius: 25px;
  border: 2px solid rgba(78, 78, 78, 0.15);
  font-size: 18px;
}

.profilePic {
  height: 100px;
  width: 100px;
  border-radius: 100px;
  border: 5px solid white;
  box-shadow: 0 15px 15px rgba(0, 0, 0, 0.4);
}

.btn {
  display: inline-block;
  text-align: center;
  border: none;
  border-radius: 25px;
  width: 100px;
  padding: 13px 13px 13px 13px;
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

  input {
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
</style>
