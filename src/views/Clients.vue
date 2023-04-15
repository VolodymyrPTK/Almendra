<template>
  <div class="overview">
    <div class="menuButtons">
      <div>
        <input class="searchInput" placeholder="Шукати" />
        <button class="productbutton">O</button>
      </div>
      <button class="productbutton" @click="toggle = !toggle">
        Новий Користувач
      </button>
    </div>
    <div v-if="toggle" to="body" class="modal">
      <div class="modalContent">
        <div>
          <input type="text" v-model="profile.firstName" placeholder="ім'я" />
          <input
            type="text"
            v-model="profile.sureName"
            placeholder="Призвіще"
          />
        </div>
        <input
          type="mail"
          v-model="profile.email"
          placeholder="Електрона пошта"
        />
        <input type="text" v-model="profile.phone" placeholder="Телефон" />
        <div>
          <input type="text" v-model="profile.city" placeholder="Місто" />
          <input type="text" v-model="profile.province" placeholder="Область" />
          <input
            class="np"
            type="number"
            v-model="profile.delivery"
            placeholder="Вітділ пошти"
          />
        </div>
        <button class="productbutton" @click="saveData">Зберегти</button>
        <button class="productbutton" @click="toggle = !toggle">Закрити</button>
      </div>
    </div>
    <div class="productlist">
      <table class="fixed_headers">
        <thead>
          <tr>
            <th>Ім'я</th>
            <th>Призвіще</th>
            <th>Мейл</th>
            <th>Телефон</th>
            <th>Місто</th>
            <th>Вітділ</th>
          </tr>
        </thead>
        <tbody>
          <tr class="tableline" v-for="profile in profiles">
            <td>{{ profile.firstName }}</td>
            <td>{{ profile.secondName }}</td>
            <td>{{ profile.email }}</td>
            <td>{{ profile.phone }}</td>
            <td>{{ profile.city }}</td>
            <td>{{ profile.delivery }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { profileReg } from "../main";
import { addDoc, onSnapshot } from "firebase/firestore";
import { ref } from "vue";

export default {
  name: "Clients",
  setup() {
    return { toggle: ref(false) };
  },
  data() {
    return {
      profiles: [],
      profile: {
        firstName: "",
        secondName: "",
        email: "",
        phone: "",
        profileImage: "",
        city: "",
        province: "",
        delivery: "",
      },
    };
  },
  methods: {
    saveData() {
      try {
        addDoc(profileReg, this.profile).then((docRef) => {
          console.log("Document written with ID: ", docRef.id);
          location.reload();
        });
      } catch (e) {
        console.error("Error adding document: ", e);
      }
    },
  },
  created() {
    onSnapshot(profileReg, (snapshot) => {
      snapshot.docs.forEach((doc) => {
        this.profiles.push({ ...doc.data(), id: doc.id });
      });
    });
  },
};
</script>

<style scoped lang="scss">
.overview {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  background-color: #f0f0f0;
  border-radius: 25px;
  box-shadow: 0 10px 10px grey;
}

.modal {
  position: absolute;
  display: flex;
  left: 0;
  top: 0;
  background-color: rgba(0, 0, 0, 0.3);
  height: 100%;
  width: 100%;
  justify-content: center;
  align-items: center;
  backdrop-filter: blur(8px);
}

.modalContent {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #f0f0f0;
  border-radius: 25px;
  padding: 25px;
  box-shadow: 0 15px 50px rgb(107, 107, 107);
}

input {
  text-align: center;
  height: 40px;
  border-radius: 25px;
  border: none;
  box-shadow: 4px 4px 4px rgb(200, 200, 200) inset,
    -4px -4px 4px rgb(255, 255, 255) inset;
  background-color: transparent;
  margin: 10px;
}

.inputs {
  justify-content: space-around;
  width: 95%;
  margin: 20px 0 20px 0;
}

textarea {
  text-align: center;
  width: 90%;
  max-width: 90%;
  min-width: 50%;
  height: 400px;
  max-height: 550px;
  min-height: 300px;
  border-radius: 25px;
  border: none;
  box-shadow: 4px 4px 4px rgb(200, 200, 200) inset,
    -4px -4px 4px rgb(255, 255, 255) inset;
  background-color: transparent;
}

.productbutton {
  font-family: "roboto", sans-serif;
  font-size: 15px;
  text-align: center;
  border: none;
  padding: 13px 13px 13px 13px;
  margin: 10px;
  border-radius: 25px;
  background-color: transparent;
  box-shadow: 4px 4px 4px rgb(200, 200, 200), -4px -4px 4px rgb(255, 255, 255);
  transition: 0.1s;
  text-decoration: none;
  color: black;
  cursor: pointer;
}

.productbutton:hover {
  transition: 0.3s;
  box-shadow: 0px 1px 1px rgba(0, 0, 0, 0.3);
}

.productbutton:active {
  box-shadow: 0px 0px 0px rgba(0, 0, 0, 0.3),
    inset 0px 3px 5px rgba(0, 0, 0, 0.3);
  transition: 0.1s;
}

.np {
  width: 50px;
}

.productlist {
  width: 90%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #f0f0f0;
}

.fixed_headers {
  height: 90%;
  width: 100%;
  table-layout: fixed;
  border-collapse: collapse;

  th {
    text-decoration: underline;
  }

  th,
  td {
    padding: 5px;
    text-align: left;
  }

  td:nth-child(1),
  th:nth-child(1) {
    width: 40%;
  }

  td:nth-child(2),
  th:nth-child(2) {
    width: 25%;
  }

  td:nth-child(3),
  th:nth-child(3) {
    width: 25%;
  }

  td:nth-child(4),
  th:nth-child(4) {
    width: 10%;
  }

  td:nth-child(5),
  th:nth-child(5) {
    width: 10%;
  }

  thead {
    background-color: rgb(177, 177, 177);
    color: #fdfdfd;

    tr {
      display: block;
    }
  }

  .tableline:hover {
    transition: 0.1s;
    background-color: rgb(212, 212, 212);
  }

  tbody {
    display: block;
    width: 100%;
    height: 100%;

    tr:nth-child(even) {
      background-color: rgb(228, 228, 228);
    }
  }
}

.menuButtons {
  display: flex;
  width: 90%;
  justify-content: space-between;
}
</style>
