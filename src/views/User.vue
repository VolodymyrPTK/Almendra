<template>
  <div class="body">
    <div class="orders"></div>
    <div class="user">
      <div class="profile">
        <img class="profilePic" src="../assets/Logo.png" alt="profilePic">
        <div class="names">
          <h2 v-if="!showModalFlag">{{ profile.firstName }}&nbsp;</h2>
          <h2 v-if="!showModalFlag">{{ profile.secondName }}</h2>
        </div>
        <h3 v-if="!showModalFlag">{{ profile.email }}</h3>
        <h3 v-if="!showModalFlag">{{ profile.phone }}</h3>
        <button v-if="!showModalFlag" class="btn" v-on:click="showModal()">Редагувати</button>
        <div class="edit-modal" v-if="showModalFlag">
          <label for="name">Призвіще</label>
          <input type="text" id="name" v-model="profile.secondName">
          <label for="name">Ім'я</label>
          <input type="text" id="name" v-model="profile.firstName">
          <label for="phone">Телефон</label>
          <input type="text" id="phone" v-model="profile.phone">
          <button class="btn" @click="updateData()" :disabled="loading">
            <div class="spinner-container" v-if="loading">
              <div class="spinner-border" role="status"></div>
            </div>
            <div v-else>Зберегти</div>
          </button>
        </div>
      </div>
      <div class="adress">
        <label for="city">Місто</label>
        <h3>{{ profile.city }}</h3>
        <input type="text" v-model="search" @input="searchCities" @focus="showDropdown = true"
          @blur="showDropdown = false" />
        <ul v-if="showDropdown">
          <li v-for="city in cities" @click="selectCity(city)">{{ city.Description }}</li>
        </ul>


        <button @click="updateUserData">Update Data</button>
      </div>
    </div>
  </div>
</template>

<script>
import { getAuth } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { profileReg, db } from "../main";

const apiKey = '0fe8dfcca7f61242d252e83fd715eaf2';
const endpointRef = 'https://api.novaposhta.ua/v2.0/json/';

export default {
  name: "User",
  props: {
    msg: String
  },
  data() {
    return {
      showModalFlag: false,
      profiles: [],
      profile: {
        firstName: '',
        secondName: '',
        phone: '',
        city: ''
      },
      loading: false,
      search: '',
      cities: []
    }
  },
  methods: {
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
          phone: this.profile.phone
        });
        console.log('Data updated successfully');
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
          FindByString: this.search
        }
      };
      await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      })
        .then(response => response.json())
        .then(data => {
          this.cities = data.data;
        })
        .catch(error => {
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
        city: this.selectedCity.Description
      });
    }
  },
  async created() {
    const auth = getAuth();
    const user = auth.currentUser;
    this.profile.email = user.email;
    this.profile.uid = user.uid;
    const docRef = doc(profileReg, this.profile.uid);
    getDoc(docRef)
      .then((doc) => {
        this.profiles.push({ ...doc.data(), id: doc.id });
        this.profile.firstName = doc.data().firstName;
        this.profile.secondName = doc.data().secondName;
        this.profile.city = doc.data().city;
        this.profile.phone = doc.data().phone;
      })
  }
};
</script>

<style lang="scss" scoped>
input {
  width: 200px;
  height: 25px;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 0 10px;
  font-size: 16px;
}

ul {
  list-style: none;
  margin: 0;
  padding: 10px;
  border-top: none;
  background-color: white;
  height: 200px;
  width: 300px;
  overflow-y: scroll;
  box-shadow: 0 15px 15px rgba(0, 0, 0, 0.2);
}

li {
  cursor: pointer;
  padding: 10px;
}

li:hover {
  background-color: #eee;
}

.body {
  display: flex;
  height: 800px;
  justify-content: center;
}

.orders {
  width: 75%;
  border-radius: 25px;
  box-shadow: 0 15px 15px rgba(0, 0, 0, 0.4), 0 -1px 20px rgba(0, 0, 0, 0.2);
  background-color: rgba(253, 253, 253, 0.75);
  border: 1px solid rgba(255, 255, 255, 0.125);
  margin: 10px;
}

.user {
  width: 25%;
  margin: 10px;
}

.names {
  display: flex;
  justify-content: space-around;
}

.profile {
  height: 480px;
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
  height: 280px;
  margin-top: 20px;
  border-radius: 25px;
  box-shadow: 0 15px 15px rgba(0, 0, 0, 0.4), 0 -1px 20px rgba(0, 0, 0, 0.2);
  background-color: rgba(253, 253, 253, 0.75);
  border: 1px solid rgba(255, 255, 255, 0.125);
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
  width: 200px;
  padding: 13px 13px 13px 13px;
  margin: 10px;
  box-shadow: 0px 5px 15px rgb(0, 0, 0, 0.5);
  background-color: white;
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