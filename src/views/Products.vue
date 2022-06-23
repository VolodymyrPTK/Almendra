<template>
  <div class="addproduct">
    <div class="inputs">
      <input type="text" v-model="name" placeholder="Назва товару">
      <input type="text" v-model="detail" placeholder="Деталі">
      <input type="number" v-model="price" placeholder="Ціна">
    </div>
    <textarea type="text" v-model="description" placeholder="Опис"></textarea>
    <div class="inputs">
      <input type="text" v-model="kcal" placeholder="КБЖУ">
      <input type="text" v-model="brand" placeholder="Бренд">
      <input type="text" v-model="category" placeholder="Категорія">
    </div>
    <button class="productbutton" @click="saveData">Зберегти</button>
  </div>
</template>

<script>
import { dataBase } from '../main';
import { addDoc } from "firebase/firestore";

export default {
  name: "Products",
  props: {
    msg: String
  },
  data() {
    return {
      name: '',
      detail: '',
      price: '',
      description: '',
      kcal: '',
      brand: '',
      category: ''
    }
  },
  methods: {
    saveData() {
      try {
        const docRef = addDoc(dataBase, this.$data);
        console.log("Document written with ID: ", docRef.id);
        this.reset();
      } catch (e) {
        console.error("Error adding document: ", e);
      }
    },
    reset() {
      Object.assign(this.$data, this.$options.data.apply(this));
    }
  }
};

</script>

<style scoped>
.addproduct {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.inputs {
  justify-content: space-around;
  display: flex;
  width: 500px;
  margin: 20px 0 20px 0;
}

input {
  text-align: center;
  height: 40px;
  width: 150px;
  border-radius: 25px;
  border: none;
  box-shadow: 4px 4px 4px rgb(200, 200, 200) inset, -4px -4px 4px rgb(255, 255, 255) inset;
  background-color: transparent;
}

textarea {
  text-align: center;
  width: 500px;
  height: 100px;
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
  box-shadow: 0px 0px 0px rgba(0, 0, 0, 0.3), inset 0px 3px 5px rgba(0, 0, 0, 0.3);
  transition: 0.1s;
}
</style>