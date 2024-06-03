<template>
  <div class="store-container">

    <div class="filter-menus">
      <div>{{ selectedSubcategory }}</div>
      <label @click="resetFilter(category.id)">
        <input type="radio" name="radio" checked />
        <span>Всі Продукти</span>
      </label>

      <div v-for="category in categories" :key="category.id">
        <div @click="fetchSubCategory(category.id)">
          <div class="filter-btn" v-if="selectedSubcategories[category.id]">
            {{ selectedSubcategories[category.id][0] || category.id }}
          </div>
          <div class="filter-btn" v-else>{{ category.id }} </div>
          <div v-auto-animate class="subcategory-menu" @click="selectSubCategory(category.id, item)"
            v-show="showDropdown" v-if="selectedCategory === category.id" v-for="(item, index) in items" :key="index">
            <div>{{ item }}</div>
          </div>
        </div>
      </div>
    </div>

    <div>
      <div class="checkbox-wrapper-16">
        <!-- <label class="checkbox-wrapper">
          <input class="checkbox-input" type="checkbox" v-model="categoryF" id="category">
          <span class="checkbox-tile">
            <span class="checkbox-icon">
              <img src="../assets/imgs/icons/freegluten.png">
            </span>
            <span class="checkbox-label">cookies</span>
          </span>
        </label>-->
        <label class="checkbox-wrapper">
          <input class="checkbox-input" type="checkbox" v-model="freeGluten" id="freeGluten">
          <span class="checkbox-tile">
            <span class="checkbox-icon">
              <img src="../assets/imgs/icons/freegluten.png">
            </span>
            <span class="checkbox-label">Без Глютену</span>
          </span>
        </label>

        <label class="checkbox-wrapper">
          <input class="checkbox-input" type="checkbox" v-model="freeSugar" id="freeSugar">
          <span class="checkbox-tile">
            <span class="checkbox-icon">
              <img src="../assets/imgs/icons/freesugar.png">
            </span>
            <span class="checkbox-label">Без Цукру</span>
          </span>
        </label>

        <label class="checkbox-wrapper">
          <input class="checkbox-input" type="checkbox" v-model="freeLactosa" id="freeLactosa">
          <span class="checkbox-tile">
            <span class="checkbox-icon">
              <img src="../assets/imgs/icons/freelactose.png">
            </span>
            <span class="checkbox-label">Без Лактози</span>
          </span>
        </label>

        <label class="checkbox-wrapper">
          <input class="checkbox-input" type="checkbox" v-model="vegan" id="vegan">
          <span class="checkbox-tile">
            <span class="checkbox-icon">
              <img src="../assets/imgs/icons/veganbtn.png">
            </span>
            <span class="checkbox-label">Веган</span>
          </span>
        </label>
      </div>
    </div>

    <section class="products">
      <div class="productCard" v-for="product in products" :key="product.id">
        <RouterLink :to="'/product/' + product.id">
          <img class="productImage" :src="product.image" />
          <div class="product-name">{{ product.name }}</div>
          <div class="product-name">{{ product.brand }}</div>
          <div style="font-size: 2vh; margin: 5px">₴ {{ product.sellPrice }}.00</div>
        </RouterLink>
        <AddToCart class="add-to-cart" :product-id="product.id" :sellPrice="product.sellPrice" :image="product.image"
          :name="product.name">
        </AddToCart>
      </div>

    </section>
    <button @click="loadMore">Показати більше</button>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { collection, query, orderBy, startAfter, limit, getDocs, where, doc, onSnapshot, getDoc } from 'firebase/firestore';
import { db, dataReg, dataBase } from '../main';
import AddToCart from "../components/AddToCart.vue";
import { RouterLink } from "vue-router";


const products = ref([]);
let lastDoc = ref(null);
const categories = ref([]);
const category = ref({});
const categoryF = ref("");
const selectedSubcategory = ref("");
const freeGluten = ref(false);
const freeSugar = ref(false);
const freeLactosa = ref(false);
const vegan = ref(false);
const items = ref([]);
const showDropdown = ref(false);
const selectedSubcategories = ref({});
const selectedCategory = ref(null);

const fetchProducts = () => {
  let q = query(collection(db, 'products'));

  if (freeGluten.value) {
    q = query(q, where('freeGluten', '==', true));
  }
  if (freeSugar.value) {
    q = query(q, where('freeSugar', '==', true));
  }
  if (freeLactosa.value) {
    q = query(q, where('freeLactosa', '==', true));
  }
  if (vegan.value) {
    q = query(q, where('vegan', '==', true));
  }
  //if (category.value) {
  //q = query(q, where('category', '==', selectedSubcategory));
  //}

  q = query(q, limit(10));

  if (lastDoc) {
    q = query(q, startAfter(lastDoc));
  }

  onSnapshot(q, (snapshot) => {
    products.value = [...products.value, ...snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))];
    lastDoc = snapshot.docs[snapshot.docs.length - 1];
  });
};

watch([freeGluten, freeSugar, freeLactosa, vegan, categoryF], () => {
  lastDoc = null;
  products.value = [];
  fetchProducts();
}, { immediate: true })

const loadMore = () => {
  fetchProducts(true)
}

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

onMounted(async () => {
  await fetchCategories();
});

const fetchSubCategory = async (category) => {
  const docRef = doc(db, "data", "categories");
  const docSnap = await getDoc(docRef);
  const data = docSnap.data();
  const arrayData = data[category];
  items.value = arrayData;
  selectedCategory.value = category;
  showDropdown.value = !showDropdown.value;
};

const selectSubCategory = (categoryID, item) => {
  // Desseleccionar la subcategoría anterior
  if (selectedSubcategories.value[selectedCategory.value]) {
    selectedSubcategories.value[selectedCategory.value] = [];
  }

  // Seleccionar la nueva subcategoría
  selectedSubcategories.value[categoryID] = [item];
  selectedCategory.value = categoryID;
  const selectedSubcategory = selectedSubcategories.value[categoryID][0];
  console.log('Subcategoría seleccionada:', selectedSubcategory);
};


</script>

<style scoped lang="scss">
.store-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

input[type="radio"] {
  height: 1px;
  overflow: hidden;
  position: absolute;
  white-space: nowrap;
  width: 1px;

  &:checked+span {
    transition: 0.3s;
    color: #000000;
    max-width: 250px;
    padding: 5px 50px;
    height: 5vh;
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.7);
    text-shadow: 0 2px 5px rgba(0, 0, 0, 0.6), 0 -2px 3px rgba(255, 255, 255, 1);
  }

  &:hover+span {
    transition: 0.3s;
    max-width: 250px;
  }
}

.filter-menus {
  position: absolute;
  display: flex;
  font-size: 25px;
  margin-top: 30px;
  gap: 10px;
  z-index: 2;

  .filter-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    letter-spacing: 0.05em;
    font-size: 20px;
    text-align: center;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.6), 0 -2px 3px rgba(255, 255, 255, 1);
    padding: 5px 20px;
    width: 8vw;
    height: 5vh;
    color: #777;
    background-color: #fff;
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.3);
    transition: 0.3s;
    cursor: pointer;
    border-radius: 25px;
  }

  .subcategory-menu {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 0.2vw;
    border-radius: 25px;
    padding: 10px;
    background-color: rgba(255, 255, 255, 0.7);
    backdrop-filter: blur(25px);
    -webkit-backdrop-filter: blur(25px);
    box-shadow: 0 5px 7px rgba(0, 0, 0, 0.5), 0 -1px 20px rgba(0, 0, 0, 0.2);
    cursor: pointer;
  }

  label {

    span {
      display: flex;
      align-items: center;
      justify-content: center;
      letter-spacing: 0.05em;
      font-size: 20px;
      text-align: center;
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.6), 0 -2px 3px rgba(255, 255, 255, 1);
      padding: 5px 20px;
      width: 8vw;
      height: 5vh;
      color: #777;
      background-color: #fff;
      box-shadow: 0 5px 10px rgba(0, 0, 0, 0.3);
      transition: 0.3s;
      cursor: pointer;
      border-radius: 25px;
    }
  }
}

.products {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  justify-content: center;
  margin-top: 120px;
}

.productCard {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 15vw;
  height: 38vh;
  margin: 0vh 0.5vw 10vh 0.5vw;
  background-color: #fff;
  border-radius: 3vh;
  box-shadow: rgba(0, 0, 0, 0.4) 0px 2px 4px,
    rgba(0, 0, 0, 0.3) 0px 7px 13px -3px,
    rgba(0, 0, 0, 0.2) 0px -3px 0px inset;
  transition: 0.5s;

  a {
    text-decoration: none;
    color: inherit;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
}

.productCard:hover {
  box-shadow: 0 15px 55px rgba(0, 0, 0, 0.4), 0 -1px 20px rgba(0, 0, 0, 0.2);
  transform: scale(1.03);
  transition: 0.5s;
}

.productImage {
  height: 30vh;
  filter: drop-shadow(0 0.7vw 0.5vw rgba(0, 0, 0, 0.7));
  margin-top: -3vh;
  pointer-events: none;
  user-select: none;
}

.product-name {
  text-wrap: balance;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2vh;
  font-weight: bold;
  height: 4vh;
  width: 14vw;
}

.add-to-cart {
  margin-top: 1.5vh;

}

img {
  height: 1.5vh;
}

button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 35vw;
  height: 4vh;
  border: none;
  margin: 0.5vw 0 2.5vw 0;
  padding: 1.5vw;
  background-color: #fff;
  color: #000;
  cursor: pointer;
  border-radius: 50px;
  box-shadow: rgba(0, 0, 0, 0.4) 0px 2px 4px,
    rgba(0, 0, 0, 0.3) 0px 7px 13px -3px,
    rgba(0, 0, 0, 0.2) 0px -3px 0px inset;
  font-size: 3vh;
}

.active {
  box-shadow: rgba(0, 0, 0, 0.4) 0px 6px 7px,
    rgba(0, 0, 0, 0.3) 0px 7px 13px -3px,
    rgba(0, 0, 0, 0.2) 0px -3px 0px inset;
  transform: scale(1.4);
}

.disabled {
  background-color: rgba(185, 185, 185, 0.3);
  cursor: unset;
  box-shadow: rgba(0, 0, 0, 0.4) 0px 1px 1px,
    rgba(0, 0, 0, 0.3) 0px 1px 1px -3px,
    rgba(0, 0, 0, 0.2) 0px -1px 0px inset;
}

.checkbox-wrapper-16 {
  position: fixed;
  left: 2vw;
  margin-top: 60px;
  display: flex;
  flex-direction: column;
  gap: 0.51vw;
}

.checkbox-wrapper-16 .checkbox-input {
  -webkit-clip-path: inset(100%);
  clip-path: inset(100%);
  height: 1px;
  overflow: hidden;
  position: absolute;
  white-space: nowrap;
  width: 1px;

}

.checkbox-wrapper-16 .checkbox-input:checked+.checkbox-tile {
  border-color: #777777;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.6), 0 -2px 3px rgba(255, 255, 255, 1);
  box-shadow: rgba(0, 0, 0, 0.4) 0px 4px 5px,
    rgba(0, 0, 0, 0.3) 0px 7px 13px -3px,
    rgba(0, 0, 0, 0.2) 0px -3px 0px inset;
}


.checkbox-wrapper-16 .checkbox-input:checked+.checkbox-tile .checkbox-icon,
.checkbox-wrapper-16 .checkbox-input:checked+.checkbox-tile .checkbox-label {
  color: #000000;

  img {
    filter: drop-shadow(0 2px 5px rgba(0, 0, 0, 1));
    transition: 0.5s;
  }
}

.checkbox-wrapper-16 .checkbox-input:focus+.checkbox-tile {
  box-shadow: rgba(0, 0, 0, 0.4) 0px 2px 4px;
}

.checkbox-wrapper-16 .checkbox-input:focus+.checkbox-tile:before {
  transform: scale(1);
  opacity: 1;
}

.checkbox-wrapper-16 .checkbox-tile {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  width: 5dvw;
  height: 6dvw;
  padding: 1vw;
  border-radius: 3vh;
  background-color: #fff;
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.3);
  transition: 0.15s ease;
  cursor: pointer;
  position: relative;

}

.checkbox-wrapper-16 .checkbox-tile:hover {
  border-color: #646464;

  img {
    filter: drop-shadow(0 2px 2px rgba(0, 0, 0, 0.7));
    transition: 0.5s;
  }
}

.checkbox-wrapper-16 .checkbox-tile:hover:before {
  transform: scale(1);
  opacity: 1;
}

.checkbox-wrapper-16 .checkbox-icon {
  transition: 0.375s;
  color: #494949;

  img {
    height: 3vw;
    filter: drop-shadow(0 2px 5px rgba(0, 0, 0, 0.5));
  }
}

.checkbox-wrapper-16 .checkbox-label {
  color: #707070;
  transition: 0.375s ease;
  text-align: center;
}

@media (max-width: 550px) {
  .productCard {
    width: 42vw;
    height: 31vh;
    margin: 1vh 2vw 8vh 2vw;
  }

  .product-name {
    font-size: 1.5vh;
    height: 2vh;
    width: 38vw;
    text-align: center;
    margin: 1vh 0;
  }

  .filter-buttons {
    height: 15vh;
    margin: 2vh 0;
  }

  .add-to-cart {
    margin-top: 1vh;
  }

  .productImage {
    height: 23vh;
  }

  .pagination {
    margin: 1vh 0 5vh 0;
    width: 90%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  button {
    width: 4vh;
    height: 4vh;
    margin: 2vw;
    padding: 0.6vw;
    background-color: #fff;
    color: #000;
    cursor: pointer;
    border-radius: 50px;
    box-shadow: rgba(0, 0, 0, 0.4) 0px 2px 4px,
      rgba(0, 0, 0, 0.3) 0px 7px 13px -3px,
      rgba(0, 0, 0, 0.2) 0px -3px 0px inset;
    font-size: 2vh;
  }

}
</style>
