<template>
  <div class="products">
    <div v-if="isVisible" class="addproduct">
      <div class="inputs">
        <input type="text" v-model="product.name" placeholder="Назва товару">
        <input type="text" v-model="product.detail" placeholder="Деталі">
        <input type="number" v-model="product.price" placeholder="Ціна">
      </div>
      <textarea type="text" v-model="product.description" placeholder="Опис"></textarea>
      <textarea type="text" v-model="product.sklad" placeholder="Склад"></textarea>
      <div class="inputs">
        <div>
          <div class="kcal">
            <input type="number" v-model="product.kcal" placeholder="kcal">
            <input type="number" v-model="product.fat" placeholder="жири">
            <input type="number" v-model="product.carbo" placeholder="вуглеводи">
            <input type="number" v-model="product.protein" placeholder="білки">
            <input type="text" v-model="product.vitamins" placeholder="вітаміни">
          </div>
          <div class="kcal">
            <input type="text" v-model="product.madeIn" placeholder="країна">
            <select v-model="product.brand">
              <option disabled value="">Бренд</option>
              <option>Bebig</option>
              <option>Frutex</option>
              <option>Only</option>
            </select>
            <select class="menus" v-model="product.category">
              <option disabled value="">Категорія</option>
              <option>Паста</option>
              <option>Каша</option>
              <option>Напої</option>
            </select>
            <div class="file-upload">
              <input type="file" @change="uploadImage" />
              <img class="btnimg" src="../assets/btnimg.png" alt="icon">
            </div>
          </div>
        </div>
      </div>
      <div class="chekBoxes">
        <input type="checkbox" class="checkbox" v-model="product.freeGluten" />
        <label for="checkbox">Free gluten</label>
        <input type="checkbox" class="checkbox" v-model="product.freeSugar" />
        <label for="checkbox">Free sugar</label>
        <input type="checkbox" class="checkbox" v-model="product.freeLactosa" />
        <label for="checkbox">Free lactosa</label>
        <input type="checkbox" class="checkbox" v-model="product.vegan" />
        <label for="checkbox">Vegan</label>
        <input type="checkbox" class="checkbox" v-model="product.raw" />
        <label for="checkbox">Raw</label>
      </div>
      <button class="productbutton" @click="saveData">Зберегти</button>
      <button class="productbutton" @click="toggleModal">Закрити</button>
    </div>
    <div class="productlist">
      <div class="list-header">
        <button class="productbutton" @click="toggleModal">Створити продукт</button>
        <div>
          <input class="searchInput" placeholder="Шукати" />
          <button class="searchButton">O</button>
        </div>
      </div>
      <table class="fixed_headers">
        <thead>
          <tr>
            <th></th>
            <th>Назва</th>
            <th>Бренд</th>
            <th>Категорія</th>
            <th>Ціна</th>
            <th>Зміни</th>
          </tr>
        </thead>
        <tbody>
          <tr class="tableline" @dblclick="openModal(product.id)" v-for="product in products" :key="product.id">
            <td>
              <img class="productImage" :src="product.image">
            </td>
            <td v-bind:title="product.name">{{ product.name }}</td>
            <td v-bind:title="product.brand">{{ product.brand }}</td>
            <td v-bind:title="product.category">{{ product.category }}</td>
            <td v-bind:title="product.price">{{ product.price }}</td>
            <td>
              <button class="deleteButton" @click="deleteProduct(product.id)">Видалити</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <Modal v-if="modalVisible" :visible="modalVisible" :product="currentProduct" @close="modalVisible = false" />
  </div>
</template>

<script>
import { dataBase, storage } from '../main';
import { addDoc, deleteDoc, onSnapshot, doc } from "firebase/firestore";
import { ref as storageReference, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import Modal from "../components/Modal.vue";

export default {
  name: "Products",
  components: {
    Modal
  },
  props: {
    msg: String
  },
  data() {
    return {
      products: [],
      product: {
        name: '',
        detail: '',
        price: '',
        description: '',
        sklad: '',
        kcal: '',
        protein: '',
        carbo: '',
        fat: '',
        brand: '',
        category: '',
        madeIn: '',
        image: '',
        vitamins: [],
        freeGluten: false,
        freeSugar: false,
        freeLactosa: false,
        vegan: false,
        raw: false
      },
      modalVisible: false,
      isVisible: false
    }
  },
  computed: {
    currentProduct() {
      return this.products.find(product => product.id === this.currentProductId);
    }
  },
  methods: {
    openModal(id) {
      this.modalVisible = true;
      this.currentProductId = id;
    },
    toggleModal() {
      this.isVisible = !this.isVisible;
    },
    async saveData() {
      try {
        await addDoc(dataBase, this.product);
      } catch (e) {
        console.error("Error adding document: ", e);
      } this.product = {
      }
    },
    async deleteProduct(id) {
      if (confirm('Видалити ?')) {
        await deleteDoc(doc(dataBase, id));
        this.products = this.products.filter(product => product.id !== id);
      } else {
      }
    },
    uploadImage(e) {
      const file = e.target.files[0];
      const storageRef = storageReference(storage, `products/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on('state_changed', (snapshot) => {
      },
        (error) => {
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            this.product.image = downloadURL;
          });
        }
      );
    }
  },
  async created() {
    onSnapshot(dataBase, (snapshot) => {
      this.products = [];
      snapshot.docs.forEach((doc) => {
        this.products.push({ ...doc.data(), id: doc.id })
      })
    })
  }
};
</script>

<style scoped lang="scss">
.products {
  display: flex;
  width: 100%;
}

.addproduct {
  width: 30%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  border-radius: 25px;
  box-shadow: 0 15px 15px rgba(0, 0, 0, 0.4), 0 -1px 20px rgba(0, 0, 0, 0.2);
  background-color: rgba(253, 253, 253, 0.75);
  border: 1px solid rgba(255, 255, 255, 0.125);
}

.productlist {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 25px;
  background-color: rgba(253, 253, 253, 0.75);
  box-shadow: 0 15px 15px rgba(0, 0, 0, 0.4), 0 -1px 20px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.125);
  margin-left: 20px;
}

.list-header {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
}

.searchInput {
  width: 200px;
  border-radius: 25px 0 0 25px;
  text-align: center;
  box-shadow: 0px 5px 5px rgba(0, 0, 0, 0.3),
    inset 0px 0px 0px rgba(0, 0, 0, 0.0);
  transition: 0.5s;
  border: none;
  background-color: white;
  backdrop-filter: blur(0px);
}

.searchButton {
  border-radius: 0 25px 25px 0;
  text-align: center;
  box-shadow: 0px 5px 5px rgba(0, 0, 0, 0.3),
    inset 0px 0px 0px rgba(0, 0, 0, 0.0);
  border: none;
  padding: 13px 13px 13px 13px;
  background-color: white;
  backdrop-filter: blur(0px);
  cursor: pointer;
}

.searchButton:hover {
  transition: 0.3s;
  box-shadow: 0px 1px 1px rgba(0, 0, 0, 0.3),
    inset 0px 0px 0px rgba(0, 0, 0, 0.0);
}

.searchButton:active {
  box-shadow: 0px 0px 0px rgba(0, 0, 0, 0.3),
    inset 0px 3px 5px rgba(0, 0, 0, 0.3);
  transition: 0.1s;
}

.productImage {
  width: 40px;
}

.inputs {
  justify-content: space-around;
  display: flex;
  width: 95%;
  margin: 20px 0 20px 0;
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

select {
  text-align: center;
  height: 40px;
  width: 30%;
  border-radius: 25px;
  border: none;
  box-shadow: 4px 4px 4px rgb(200, 200, 200) inset, -4px -4px 4px rgb(255, 255, 255) inset;
  background-color: transparent;
  margin: 0 5px 0 5px;
}

textarea {
  text-align: center;
  width: 90%;
  max-width: 90%;
  min-width: 50%;
  height: 200px;
  max-height: 300px;
  min-height: 200px;
  border-radius: 25px;
  border: none;
  box-shadow: 4px 4px 4px rgb(200, 200, 200) inset, -4px -4px 4px rgb(255, 255, 255) inset;
  background-color: transparent;
}

.productbutton {
  max-width: 300px;
  font-family: 'roboto', sans-serif;
  font-size: 15px;
  text-align: center;
  border: none;
  border-radius: 25px;
  width: 50%;
  padding: 13px 13px 13px 13px;
  margin: 10px;
  background-color: transparent;
  box-shadow: 4px 4px 4px rgb(200, 200, 200), -4px -4px 4px rgb(255, 255, 255);
  transition: 0.3s;
  text-decoration: none;
  background-color: white;
  color: black;
  cursor: pointer;
}

.productbutton:hover {
  transition: 0.3s;
  box-shadow: 0px 1px 1px rgba(0, 0, 0, 0.3), inset 0px 0px 0px rgba(0, 0, 0, 0.3);
}

.productbutton:active {
  box-shadow: 0px 0px 0px rgba(0, 0, 0, 0.3), inset 0px 3px 5px rgba(0, 0, 0, 0.3);
  transition: 0.1s;
}

.deleteButton {
  width: 90px;
  height: 30px;
  border: none;
  border-radius: 50px;
  font-size: 15px;
}

.deleteButton:hover {
  background-color: rgb(250, 108, 108);
  transition: 0.5s;
}

.deleteButton:active {
  background-color: rgb(255, 42, 42);
  transition: 0.5s;
}

.fixed_headers {
  width: 90%;
  height: 90%;
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
    width: 15%;
  }

  td:nth-child(2),
  th:nth-child(2) {
    width: 35%;
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

  td:nth-child(6),
  th:nth-child(6) {
    width: 7%;
  }

  thead {
    background-color: rgb(177, 177, 177);
    color: #FDFDFD;

    tr {
      display: flex;
    }
  }

  .tableline {
    font-size: 18px;
  }

  .tableline:hover {
    transition: 0.1s;
    background-color: rgb(212, 212, 212);
  }

  tbody {
    display: flex;
    flex-direction: column;
    height: 100%;

    tr:nth-child(even) {
      background-color: rgb(228, 228, 228);
    }
  }
}

.chekBoxes {
  display: flex;
}

.checkbox {
  height: 15px;
  width: 15px;
  box-shadow: none;
}

.file-upload {
  height: 40px;
  width: 40px;
  border-radius: 25px;
  border: none;
  box-shadow: 4px 4px 4px rgb(200, 200, 200), -4px -4px 4px rgb(255, 255, 255);
  margin: 0 5px 0 5px;
  display: flex;
  align-items: center;
  justify-content: center;

  input[type='file'] {
    height: 40px;
    width: 40px;
    position: absolute;
    opacity: 0;
  }
}

.file-upload:hover {
  transition: 0.3s;
  box-shadow: 0px 1px 1px rgba(0, 0, 0, 0.3);
}

.btnimg {
  height: 20px;
}

label {
  width: 60px;
}

.kcal {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 10px;
}
</style>