<template>
  <div class="products">

    <div v-if="editVisible || isVisible" class="addproduct">
      <div class="top-inputs">
        <input type="text" v-model="product.name" placeholder="Назва товару" />
        <input type="text" v-model="product.detail" placeholder="Опис" />

        <div class="file-upload">
          <input type="file" @change="uploadImage" />
          <img class="btnimg" src="../assets/btnimg.png" alt="icon" />
        </div>
        <input type="number" v-model="product.buyPrice" placeholder="Ціна Купівлі" />
        <input type="number" v-model="product.sellPrice" placeholder="Ціна Продажу" />
        <div class="markUp"> Націнка: {{ markUpPercent }}%</div>
      </div>
      <div style="display: flex;">
        <textarea type="text" v-model="product.description" placeholder="Опис"></textarea>
        <textarea type="text" v-model="product.sklad" placeholder="Склад"></textarea>
      </div>
      <div class="midle-inputs">
        <input type="text" v-model="product.weight" placeholder="Вага" />
        <input type="number" v-model="product.kcal" placeholder="Kcal" />
        <input type="number" v-model="product.fat" placeholder="Жири" />
        <input type="number" v-model="product.carbo" placeholder="Вуглеводи" />
        <input type="number" v-model="product.protein" placeholder="Білки" />
      </div>
      <input style="width: 50vw;" type="text" v-model="product.vitamins" placeholder="Вітаміни" />
      <div>
        <select v-model="product.country">
          <option disabled value="">Країна</option>
          <option v-for="country in countries">{{ country.id }}</option>
        </select>
        <select v-model="product.brand">
          <option disabled value="">Бренд</option>
          <option v-for="brand in brands">{{ brand.id }}</option>
        </select>
        <select class="menus" v-model="product.category">
          <option disabled value="">Категорія</option>
          <option v-for="category in categories">{{ category.id }}</option>
        </select>
      </div>
      <div>
        <div>
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
          <input type="checkbox" class="checkbox" v-model="product.protein" />
          <label for="checkbox">Protein</label>
        </div>
      </div>
      <div>
        <button @click="saveData">Зберегти</button>
        <button @click="toggleModal">Закрити</button>
      </div>
    </div>

    <div class="productlist">
      <div class="list-header">
        <button @click="toggleModal"> Створити продукт </button>
        <div class="center-flex">
          <input class="searchInput" v-model="searchTerm" placeholder="Пошук" />
          <input type="text" v-model="category" @keyup.enter="saveCategory()" placeholder="Нова Категорія" />
          <input type="text" v-model="brand" @keyup.enter="saveBrand()" placeholder="Новий Бренд" />
          <input type="text" v-model="country" @keyup.enter="saveCountry()" placeholder="Новий Країна" />
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
          <tr class="tableline" @dblclick="editModal(product.id)" v-for="product in filteredProducts" :key="product.id">
            <td>
              <img class="productImage" :src="product.image" />
            </td>
            <td v-bind:title="product.name">{{ product.name }}</td>
            <td v-bind:title="product.brand">{{ product.brand }}</td>
            <td v-bind:title="product.category">{{ product.category }}</td>
            <td v-bind:title="product.sellPrice">{{ product.sellPrice }}</td>
            <td>
              <div class="deleteButton" @click="deleteProduct(product.id)">
                <img src="../assets/imgs/icons/delete.svg" alt="">
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <Modal v-if="modalVisible" :visible="modalVisible" :product="currentProduct" :categories="categories" :brands="brands"
      :countries="countries" @close="modalVisible = false" />
  </div>
</template>

<script>
import { dataBase, storage, categoryReg, brandReg, countryReg } from "../main";
import { addDoc, deleteDoc, onSnapshot, doc, setDoc } from "firebase/firestore";
import {
  ref as storageReference,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import Modal from "../components/Modal.vue";

export default {
  name: "Products",
  components: {
    Modal,
  },
  props: {
    msg: String,
  },
  data() {
    return {
      categories: [],
      category: "",
      countries: [],
      country: "",
      brands: [],
      brand: "",
      products: [],
      product: {
        name: "",
        detail: "",
        sellPrice: "  ",
        buyPrice: "",
        description: "",
        sklad: "",
        kcal: "",
        protein: "",
        carbo: "",
        fat: "",
        brand: "",
        category: "",
        country: "",
        image: "",
        vitamins: [],
        freeGluten: false,
        freeSugar: false,
        freeLactosa: false,
        vegan: false,
        raw: false,
        protein: false,
        weight: ""
      },
      modalVisible: false,
      isVisible: false,
      searchTerm: "",
      editVisible: false
    };
  },
  methods: {
    editModal(id) {
      // Buscar el producto en el array de productos
      let product = this.products.find(product => product.id === id);
      // Si existe el producto, asignar sus valores a this.product
      if (product) {
        this.product = { ...product };
      }
      // Mostrar el modal
      this.editVisible = true;
    },
    openModal(id) {
      this.modalVisible = true;
      this.currentProductId = id;
      this.product = {};
    },
    toggleModal() {
      this.editVisible = !this.editVisible;
      this.product = {};
    },
    closeModal() {
      this.isVisible = !this.isVisible;
    },
    async saveData() {
      try {
        await addDoc(dataBase, this.product);
      } catch (e) {
        console.error("Error adding document: ", e);
      }
      this.product = {};
    },
    async saveCategory() {
      try {
        await setDoc(doc(categoryReg, this.category), { name: this.category });
        this.category = "";
      } catch (e) {
        console.error("Error adding document: ", e);
      }
    },
    async saveBrand() {
      try {
        await setDoc(doc(brandReg, this.brand), { name: this.brand });
        this.brand = "";
      } catch (e) {
        console.error("Error adding document: ", e);
      }
    },
    async saveCountry() {
      try {
        await setDoc(doc(countryReg, this.country), { name: this.country });
        this.country = "";
      } catch (e) {
        console.error("Error adding document: ", e);
      }
    },
    async deleteProduct(id) {
      if (confirm("Видалити ?")) {
        await deleteDoc(doc(dataBase, id));
        this.products = this.products.filter((product) => product.id !== id);
      } else {
      }
    },
    uploadImage(e) {
      const file = e.target.files[0];
      const storageRef = storageReference(storage, `products/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => { },
        (error) => { },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            this.product.image = downloadURL;
          });
        }
      );
    },
  },
  async created() {
    onSnapshot(dataBase, (snapshot) => {
      this.products = [];
      snapshot.docs.forEach((doc) => {
        this.products.push({ ...doc.data(), id: doc.id });
      });
    });
    onSnapshot(categoryReg, (snapshot) => {
      this.categories = [];
      snapshot.docs.forEach((doc) => {
        this.categories.push({ ...doc.data(), id: doc.id });
      });
    });
    onSnapshot(brandReg, (snapshot) => {
      this.brands = [];
      snapshot.docs.forEach((doc) => {
        this.brands.push({ ...doc.data(), id: doc.id });
      });
    });
    onSnapshot(countryReg, (snapshot) => {
      this.countries = [];
      snapshot.docs.forEach((doc) => {
        this.countries.push({ ...doc.data(), id: doc.id });
      });
    });
  },
  computed: {
    currentProduct() {
      return this.products.find(
        (product) => product.id === this.currentProductId
      );
    },
    filteredProducts() {
      return this.products.filter((product) =>
        product.name.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    },
    markUpPercent() {
      const markupPercent = ((this.product.sellPrice - this.product.buyPrice) / this.product.buyPrice) * 100;
      return markupPercent.toFixed(2);
    },
  },
};
</script>

<style scoped lang="scss">
.products {
  display: flex;
  width: 100%;
}

.addproduct {
  align-self: center;
  position: absolute;
  padding: 1vw;
  margin: 1.5vw;
  width: 75%;
  height: 75%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  border-radius: 25px;
  box-shadow: 0 15px 15px rgba(0, 0, 0, 0.4), 0 -1px 20px rgba(0, 0, 0, 0.2);
  background-color: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
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
}

.list-header {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
}

.searchInput {
  width: 400px;
  border-radius: 25px;
  text-align: center;
  box-shadow: 0px 5px 5px rgba(0, 0, 0, 0.3), inset 0px 0px 0px rgba(0, 0, 0, 0);
  transition: 0.5s;
  border: none;
  background-color: white;
}

.productImage {
  width: 40px;
}

.top-inputs {
  display: flex;
  justify-content: space-around;
  align-items: center;

  input {
    &:first-child {
      width: 20vw;
    }
  }
}

.midle-inputs {
  display: flex;

  input {
    width: 10vw;
  }
}

textarea {
  width: 35vw;
  height: 30vh;
}

input,
textarea {
  border: none;
  padding: 0.5vw;
  margin: 0.5vw;
  color: black;
  font-size: 1vw;
  text-decoration: none;
  text-align: center;
  border-radius: 25px;
  box-shadow: inset 0px 5px 5px rgba(0, 0, 0, 0.3);
  background-color: rgb(255, 255, 255);
}

button,
select {
  border: none;
  padding: 0.5vw;
  margin: 0.5vw;
  color: black;
  font-size: 1vw;
  text-decoration: none;
  text-align: center;
  border-radius: 25px;
  box-shadow: 0px 5px 7px rgba(0, 0, 0, 0.3), inset 0 0 0 rgba(0, 0, 0, 0.3);
  background-color: rgb(255, 255, 255);

  :hover {
    box-shadow: 0 3px 3px rgba(0, 0, 0, 0.3), inset 0 0 0 rgba(0, 0, 0, 0.3);
    transition: 0.3s;
  }

  :active {
    box-shadow: 0 0 0 rgba(0, 0, 0, 0.3), inset 0 3px 3px rgba(0, 0, 0, 0.3);
    transition: 0.3s;
  }
}

.deleteButton {
  width: 2vw;
  height: 2vw;
  border: none;
  border-radius: 50px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: rgb(250, 108, 108);
    transition: 0.5s;
  }

  &:active {
    background-color: rgb(255, 42, 42);
    transition: 0.5s;
  }
}

.center-flex {
  display: flex;
  align-items: center;
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

  input[type="file"] {
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
  width: 50px;
  margin-right: 5px;
}

.markUp {
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  background-color: rgb(255, 255, 255);
  padding: 0.5vw;
  width: 5vw;
  border-radius: 25px;
}

//table

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
    vertical-align: middle;
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
    width: 5vw;
  }

  thead {
    background-color: rgb(177, 177, 177);
    color: #fdfdfd;

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
</style>
