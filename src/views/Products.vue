<script>
import { ref, onMounted, computed } from "vue";
import { dataBase, storage, dataReg, db } from "../main";
import { addDoc, deleteDoc, onSnapshot, doc, setDoc, getDoc, updateDoc, deleteField } from "firebase/firestore";
import { ref as storageReference, uploadBytesResumable, getDownloadURL } from "firebase/storage";

export default {
  name: "Products",
  props: {
    msg: String,
  },
  setup() {
    const categories = ref([]);
    const category = ref("");
    const countries = ref([]);
    const country = ref("");
    const brands = ref([]);
    const brand = ref("");
    const products = ref([]);
    const product = ref({
      name: "",
      detail: "",
      sellPrice: "",
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
      weight: "",
      vitamins: [],
      freeGluten: false,
      freeSugar: false,
      freeLactosa: false,
      vegan: false,
      proteinik: "",
      liquid: false
    });
    const modalVisible = ref(false);
    const isVisible = ref(false);
    const searchTerm = ref("");
    const editVisible = ref(false);
    const brandsMenu = ref(false);
    const categoryMenu = ref(false);
    const countryMenu = ref(false);
    const isLoading = ref(false);
    const isLoaded = ref(false);
    const requiredFields = ref([
      "name", "detail", "sellPrice", "buyPrice", "description", "sklad", "kcal", "protein", "carbo", "fat", "brand", "category", "country", "image", "weight", "vitamins"
    ]);

    const showCategory = () => {
      categoryMenu.value = !categoryMenu.value;
    };

    const hideCategory = () => {
      categoryMenu.value = false;
    };

    const showBrands = () => {
      brandsMenu.value = !brandsMenu.value;
    };

    const showCountry = () => {
      countryMenu.value = !countryMenu.value;
    };

    const editModal = (id) => {
      const selectedProduct = products.value.find(product => product.id === id);
      if (selectedProduct) {
        product.value = { ...selectedProduct };
      }
      editVisible.value = true;
    };

    const openModal = (id) => {
      modalVisible.value = true;
      currentProduct.value = id;
      product.value = {};
    };

    const toggleModal = () => {
      isVisible.value = !isVisible.value;
      product.value = {};
    };

    const closeModal = () => {
      editVisible.value = !editVisible.value;
    };

    const saveData = async () => {
      try {
        await addDoc(dataBase, product.value);
      } catch (e) {
        console.error("Error adding document: ", e);
      }
      product.value = {};
      isLoaded.value = false;
    };

    const updateData = async () => {
      try {
        const refDoc = doc(db, "products", product.value.id);
        await setDoc(refDoc, product.value, { merge: true });
      } catch (error) {
        console.error(error);
      }
      editVisible.value = !editVisible.value;
      product.value = {};
    };

    const saveBrand = async () => {
      try {
        const brandsDocRef = doc(dataReg, 'brands');
        const brandsDocSnapshot = await getDoc(brandsDocRef);
        const brandsData = brandsDocSnapshot.exists() ? brandsDocSnapshot.data() : {};
        brandsData[brand.value] = {};
        await setDoc(brandsDocRef, brandsData);
        brand.value = "";
      } catch (e) {
        console.error("Error adding brand: ", e);
      }
    };

    const saveCountry = async () => {
      try {
        const countriesDocRef = doc(dataReg, 'countries');
        const countriesDocSnapshot = await getDoc(countriesDocRef);
        const countriesData = countriesDocSnapshot.exists() ? countriesDocSnapshot.data() : {};
        countriesData[country.value] = {};
        await setDoc(countriesDocRef, countriesData);
        country.value = "";
      } catch (e) {
        console.error("Error adding country: ", e);
      }
    };

    const saveCategory = async () => {
      try {
        const categoriesDocRef = doc(dataReg, 'categories');
        const categoriesDocSnapshot = await getDoc(categoriesDocRef);
        const categoriesData = categoriesDocSnapshot.exists() ? categoriesDocSnapshot.data() : {};
        categoriesData[category.value] = {};
        await setDoc(categoriesDocRef, categoriesData);
        category.value = "";
      } catch (e) {
        console.error("Error adding category: ", e);
      }
    };

    const deleteProduct = async (id) => {
      if (confirm("Видалити ?")) {
        await deleteDoc(doc(dataBase, id));
        products.value = products.value.filter((product) => product.id !== id);
      }
    };

    const deleteBrand = async (brandId) => {
      if (confirm("Видалити ?")) {
        try {
          const brandsDocRef = doc(dataReg, 'brands');
          await updateDoc(brandsDocRef, {
            [brandId]: deleteField()
          });
        } catch (e) {
          console.error("Error deleting brand: ", e);
        }
      }
    };

    const deleteCategory = async (categoryId) => {
      if (confirm("Видалити ?")) {
        try {
          const categoriesDocRef = doc(dataReg, 'categories');
          await updateDoc(categoriesDocRef, {
            [categoryId]: deleteField()
          });
        } catch (e) {
          console.error("Error deleting category: ", e);
        }
      }
    };

    const deleteCountry = async (countryId) => {
      if (confirm("Видалити ?")) {
        try {
          const countriesDocRef = doc(dataReg, 'countries');
          await updateDoc(countriesDocRef, {
            [countryId]: deleteField()
          });
        } catch (e) {
          console.error("Error deleting country: ", e);
        }
      }
    };

    const uploadImage = (e) => {
      isLoading.value = true;
      const file = e.target.files[0];
      const storageRef = storageReference(storage, `products/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        'state_changed',
        (snapshot) => { },
        (error) => { },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            isLoading.value = false;
            isLoaded.value = true;
            product.value.image = downloadURL;
          });
        }
      );
    };

    const fetchProducts = async () => {
      onSnapshot(dataBase, (snapshot) => {
        products.value = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      });
    };

    const fetchBrands = async () => {
      try {
        const brandsDocRef = doc(dataReg, 'brands');
        onSnapshot(brandsDocRef, (snapshot) => {
          const brandsData = snapshot.data();
          const brandsArray = Object.keys(brandsData).map((brandName) => ({
            id: brandName,
            ...brandsData[brandName],
          }));
          brands.value = brandsArray;
        });

      } catch (e) { console.error("Error fetching brands: ", e); }
    };

    const fetchCategories = async () => {
      try {
        const categoriesDocRef = doc(dataReg, 'categories');
        onSnapshot(categoriesDocRef, (snapshot) => {
          const categoriesData = snapshot.data();
          const categoriesArray = Object.keys(categoriesData).map((category) => ({
            id: category,
            ...categoriesData[category],
          }));
          categories.value = categoriesArray;
        });

      } catch (e) { console.error("Error fetching categories: ", e); }
    };

    const fetchCountries = async () => {
      try {
        const countriesDocRef = doc(dataReg, 'countries');
        onSnapshot(countriesDocRef, (snapshot) => {
          const countriesData = snapshot.data();
          const countriesArray = Object.keys(countriesData).map((country) => ({
            id: country,
            ...countriesData[country],
          }));
          countries.value = countriesArray;
        });

      } catch (e) { console.error("Error fetching countries: ", e); }
    };

    const isSubmitDisabled = computed(() => {
      return requiredFields.value.some((field) => !product.value[field]) || isLoading.value;
    });

    const currentProduct = computed(() => {
      return products.value.find((product) => product.id === currentProduct.value);
    });

    const filteredProducts = computed(() => {
      return products.value.filter((product) => {
        const searchTerms = searchTerm.value.toLowerCase().split(' ');
        return searchTerms.every((term) => {
          return (
            product.name.toLowerCase().includes(term) ||
            product.detail.toLowerCase().includes(term) ||
            product.brand.toLowerCase().includes(term)
          );
        });
      });
    });


    const markUpPercent = computed(() => {
      const markupPercent = ((product.value.sellPrice - product.value.buyPrice) / product.value.buyPrice) * 100;
      return markupPercent.toFixed(2);
    });

    onMounted(async () => {
      await fetchCategories();
      await fetchProducts();
      await fetchBrands();
      await fetchCountries();
    });

    return {
      categories,
      category,
      countries,
      country,
      brands,
      brand,
      products,
      product,
      modalVisible,
      isVisible,
      searchTerm,
      editVisible,
      brandsMenu,
      categoryMenu,
      countryMenu,
      isLoading,
      isLoaded,
      requiredFields,
      showCategory,
      hideCategory,
      showBrands,
      showCountry,
      editModal,
      openModal,
      toggleModal,
      closeModal,
      saveData,
      updateData,
      saveBrand,
      saveCountry,
      saveCategory,
      deleteProduct,
      deleteBrand,
      deleteCategory,
      deleteCountry,
      uploadImage,
      isSubmitDisabled,
      currentProduct,
      filteredProducts,
      markUpPercent,
    };
  },
};
</script>

<template>
  <div class="products">
    <div v-if="editVisible || isVisible" class="addproduct">
      <div class="top-inputs">
        <input type="text" v-model="product.name" placeholder="Назва товару" />
        <input type="text" v-model="product.detail" placeholder="Опис" />

        <div class="file-upload">
          <input type="file" @change="uploadImage" />
          <div :class="{ 'loading': isLoading, 'loaded': isLoaded }">
            <span v-if="isLoading">
              <div class="dot-spinner">
                <div class="dot-spinner__dot"></div>
                <div class="dot-spinner__dot"></div>
                <div class="dot-spinner__dot"></div>
                <div class="dot-spinner__dot"></div>
                <div class="dot-spinner__dot"></div>
                <div class="dot-spinner__dot"></div>
                <div class="dot-spinner__dot"></div>
                <div class="dot-spinner__dot"></div>
              </div>
            </span>
            <span v-else-if="isLoaded"><img class="btnimg" src="../assets/imgs/icons/done.svg" alt="icon" /></span>
            <span v-else><img class="btnimg" src="../assets/btnimg.png" alt="icon" /></span>
          </div>
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
        <input type="checkbox" id="liquid" name="liquid" v-model="product.liquid">
        <label for="liquid">Рідина</label>
        <input v-if="product.liquid" type="text" v-model="product.weight" placeholder="Об'єм" />
        <input v-else type="text" v-model="product.weight" placeholder="Вага" />
        <input type="number" v-model="product.kcal" placeholder="Kcal" />
        <input type="number" v-model="product.fat" placeholder="Жири" />
        <input type="number" v-model="product.carbo" placeholder="Вуглеводи" />
        <input type="number" v-model="product.protein" placeholder="Білки" />
      </div>
      <input style="width: 50vw;" type="text" v-model="product.vitamins" placeholder="Вітаміни" />
      <div>
        <select v-model="product.country">
          <option value="" disabled>Країна</option>
          <option v-for="country in countries">{{ country.id }}</option>
        </select>
        <select v-model="product.brand">
          <option disabled value="">Бренд</option>
          <option v-for=" brand  in  brands ">{{ brand.id }}</option>
        </select>
        <select class="menus" v-model="product.category">
          <option disabled value="">Категорія</option>
          <option v-for=" category  in  categories ">{{ category.id }}</option>
        </select>
      </div>
      <div>
        <input type="checkbox" class="checkbox" id="gluten" v-model="product.freeGluten" />
        <label for="gluten">Free gluten</label>
        <input type="checkbox" class="checkbox" id="sugar" v-model="product.freeSugar" />
        <label for="sugar">Free Sugar</label>
        <input type="checkbox" class="checkbox" id="lactosa" v-model="product.freeLactosa" />
        <label for="lactosa">Free lactosa</label>
        <input type="checkbox" class="checkbox" id="vegan" v-model="product.vegan" />
        <label for="vegan">Vegan</label>
        <input type="checkbox" class="checkbox" id="protein" v-model="product.proteinik" />
        <label for="protein">Protein</label>
      </div>
      <div>
        <button :disabled="isSubmitDisabled" v-if="isVisible" @click="saveData">Зберегти</button>
        <button v-if="isVisible" @click="toggleModal">Закрити</button>
        <button v-if="editVisible" @click="saveData">Дублювати</button>
        <button v-if="editVisible" @click="updateData">Оновити</button>
        <button v-if="editVisible" @click="closeModal">Закрити</button>
      </div>
    </div>

    <div v-if="brandsMenu">
      <div class="menu">
        <input type="text" v-model="brand" @keyup.enter="saveBrand()" placeholder="Новий Бренд" />
        <div class="menu-table">
          <div v-for=" brand  in  brands " :key="brand.id">
            <div> {{ brand.id }}
              <div class="deleteButton" @click="deleteBrand(brand.id)">
                <img src="../assets/imgs/icons/delete.svg" alt="">
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="menu-container" @click="showBrands">
      </div>
    </div>

    <div v-if="categoryMenu">
      <div class="menu">
        <input type="text" v-model="category" @keyup.enter="saveCategory()" placeholder="Нова Категорія" />
        <div class="menu-table">
          <div v-for=" category  in  categories " :key="category.id">
            <div> {{ category.id }}
              <div class="deleteButton" @click="deleteCategory(category.id)">
                <img src="../assets/imgs/icons/delete.svg" alt="">
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="menu-container" @click="showCategory"></div>
    </div>

    <div v-if="countryMenu">
      <div class="menu">
        <input type="text" v-model="country" @keyup.enter="saveCountry()" placeholder="Новий Країна" />
        <div class="menu-table">
          <div v-for=" country  in  countries ">
            <div> {{ country.id }}
              <div class="deleteButton" @click="deleteCountry(country.id)">
                <img src="../assets/imgs/icons/delete.svg" alt="">
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="menu-container" @click="showCountry"></div>
    </div>

    <div class="productlist">
      <div class="list-header">
        <button @click="toggleModal">Створити продукт</button>
        <div class="center-flex">
          <input class="searchInput" v-model="searchTerm" placeholder="Пошук" />
          <button @click="showBrands">Бренди</button>
          <button @click="showCategory">Категорії</button>
          <button @click="showCountry">Країни</button>
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
          <tr class="tableline" @dblclick="editModal(product.id)" v-for=" product  in  filteredProducts "
            :key="product.id">
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
  </div>
</template>


<style scoped lang="scss">
.products {
  display: flex;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.addproduct {
  align-self: center;
  position: absolute;
  padding: 0.5vw;
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
}

.list-header {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-evenly;

}

.searchInput {
  width: 20vh;
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
  align-items: center;

  input[type="checkbox"] {
    width: auto;
    height: auto;
  }

  input {
    width: 10vw;
  }
}

textarea {
  width: 35vw;
  height: 30vh;
  resize: none;
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

  &:hover {
    box-shadow: 0 3px 3px rgba(0, 0, 0, 0.3), inset 0 0 0 rgba(0, 0, 0, 0.3);
    transition: 0.3s;
  }

  &:active {
    box-shadow: 0 0 0 rgba(0, 0, 0, 0.3), inset 0 3px 3px rgba(0, 0, 0, 0.3);
    transition: 0.3s;
  }

  &:disabled {
    color: #9e9e9e;
    box-shadow: 0 0 0 rgba(0, 0, 0, 0.3), inset 0 0 0 rgba(0, 0, 0, 0.3);
    cursor: not-allowed;

    &:hover::before {
      content: "Заповніть всі поля";
      position: absolute;
      top: 87%;
      background-color: rgba(0, 0, 0, 0.8);
      color: #fff;
      padding: 5px;
      border-radius: 5px;
      font-size: 0.8rem;
      white-space: nowrap;
    }
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
  border-radius: 50px;
  border: none;
  box-shadow: 4px 4px 4px rgb(200, 200, 200), -4px -4px 4px rgb(255, 255, 255);
  display: flex;
  align-items: center;
  justify-content: center;

  input[type="file"] {
    height: 40px;
    width: 40px;
    position: absolute;
    opacity: 0;
  }

  button {
    border: none;
    cursor: pointer;
    transition: background-color 0.3s, transform 0.2s;
  }

  button.loading {
    cursor: not-allowed;
  }

  button.loaded {
    cursor: default;
  }
}

.file-upload:hover {
  transition: 0.3s;
  box-shadow: 0px 1px 1px rgba(0, 0, 0, 0.3);
}

.btnimg {
  height: 20px;
  width: 20px;
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
    overflow: hidden;
    overflow-y: scroll;
    scroll-behavior: smooth;

    tr:nth-child(even) {
      background-color: rgb(228, 228, 228);
    }
  }
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

.menu {
  display: flex;
  align-items: center;
  position: absolute;
  z-index: 5;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  height: 60vh;
  width: 25vw;
  background-color: rgb(255, 255, 255);
  display: flex;
  flex-direction: column;
  box-shadow: 0px 5px 7px rgba(0, 0, 0, 0.3), inset 0 0 0 rgba(0, 0, 0, 0.3);
  border-radius: 25px;
}

.menu-table {
  overflow: scroll;


  >div {
    width: 20vw;
    background-color: rgb(241, 239, 239);
    border-radius: 25px;
    padding: 5px 15px;
    margin: 3px;
    font-size: 2vh;

    >div {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  }

  &::-webkit-scrollbar {
    display: none;
  }

}

.dot-spinner {
  --uib-size: 1.3vw;
  --uib-speed: .9s;
  --uib-color: #183153;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  height: var(--uib-size);
  width: var(--uib-size);
}

.dot-spinner__dot {
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  height: 100%;
  width: 100%;
}

.dot-spinner__dot::before {
  content: '';
  height: 20%;
  width: 20%;
  border-radius: 50%;
  background-color: var(--uib-color);
  transform: scale(0);
  opacity: 0.5;
  animation: pulse0112 calc(var(--uib-speed) * 1.111) ease-in-out infinite;
  box-shadow: 0 0 20px rgba(18, 31, 53, 0.3);
}

.dot-spinner__dot:nth-child(2) {
  transform: rotate(45deg);
}

.dot-spinner__dot:nth-child(2)::before {
  animation-delay: calc(var(--uib-speed) * -0.875);
}

.dot-spinner__dot:nth-child(3) {
  transform: rotate(90deg);
}

.dot-spinner__dot:nth-child(3)::before {
  animation-delay: calc(var(--uib-speed) * -0.75);
}

.dot-spinner__dot:nth-child(4) {
  transform: rotate(135deg);
}

.dot-spinner__dot:nth-child(4)::before {
  animation-delay: calc(var(--uib-speed) * -0.625);
}

.dot-spinner__dot:nth-child(5) {
  transform: rotate(180deg);
}

.dot-spinner__dot:nth-child(5)::before {
  animation-delay: calc(var(--uib-speed) * -0.5);
}

.dot-spinner__dot:nth-child(6) {
  transform: rotate(225deg);
}

.dot-spinner__dot:nth-child(6)::before {
  animation-delay: calc(var(--uib-speed) * -0.375);
}

.dot-spinner__dot:nth-child(7) {
  transform: rotate(270deg);
}

.dot-spinner__dot:nth-child(7)::before {
  animation-delay: calc(var(--uib-speed) * -0.25);
}

.dot-spinner__dot:nth-child(8) {
  transform: rotate(315deg);
}

.dot-spinner__dot:nth-child(8)::before {
  animation-delay: calc(var(--uib-speed) * -0.125);
}

@keyframes pulse0112 {

  0%,
  100% {
    transform: scale(0);
    opacity: 0.5;
  }

  50% {
    transform: scale(1);
    opacity: 1;
  }
}
</style>
