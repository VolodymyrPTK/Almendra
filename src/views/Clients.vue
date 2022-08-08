<template>
  <div class="overview">
    <button class="productbutton" @click="toggle = !toggle">Новий Користувач</button>
    <div v-if="toggle" to="body" class="modal">
      <div class="modalContent">
        <div class="inputs">
          <input type="text" placeholder="Назва товару">
          <input type="text" placeholder="Деталі">
          <input type="number" placeholder="Ціна">
        </div>
        <textarea type="text" placeholder="Опис"></textarea>
        <div class="inputs">
          <input type="text" placeholder="КБЖУ">
          <input type="text" placeholder="Бренд">
          <input type="text" placeholder="Категорія">
        </div>
        <div>
          <button class="productbutton" @click="toggle = !toggle">Зберегти</button>
          <button class="productbutton" @click="toggle = !toggle">Закрити</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { getAuth } from "firebase/auth";

export default {
  name: "Clients",
  setup() {
    return { toggle: ref(false) };
  },
  data() {
    return {
      email: ''
    }
  },
  created() {
    const auth = getAuth();
    const user = auth.currentUser;
    this.email = user.email;
  }
};
</script>

<style scoped>
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
  align-items: center;
  background-color: #f0f0f0;
  border-radius: 25px;
  height: 700px;
  width: 700px;
  box-shadow: 0 15px 50px rgb(107, 107, 107);
}

input {
  text-align: center;
  height: 40px;
  width: 30%;
  border-radius: 25px;
  border: none;
  box-shadow: 4px 4px 4px rgb(200, 200, 200) inset, -4px -4px 4px rgb(255, 255, 255) inset;
  background-color: transparent;
  margin: 0 5px 0 5px;
}

.inputs {
  justify-content: space-around;
  display: flex;
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
  box-shadow: 4px 4px 4px rgb(200, 200, 200) inset, -4px -4px 4px rgb(255, 255, 255) inset;
  background-color: transparent;
}

.productbutton {
  font-family: 'roboto', sans-serif;
  font-size: 15px;
  text-align: center;
  border: none;
  padding: 13px 13px 13px 13px;
  margin: 50px;
  border-radius: 25px;
  background-color: transparent;
  box-shadow: 4px 4px 4px rgb(200, 200, 200), -4px -4px 4px rgb(255, 255, 255);
  transition: 0.1s;
  text-decoration: none;
  color: black;
  cursor: pointer;
}
</style>
