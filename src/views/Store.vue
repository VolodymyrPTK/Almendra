<template>
  <div class="store-container">
    <div class="filter-buttons">
      <label @click="resetFilter(category.id)">
        <input type="radio" name="radio" checked />
        <span>Всі товари</span>
      </label>
      <label v-for="category in categories" :key="category" @click="filterProducts(category.id)">
        <input type="radio" name="radio" />
        <span>{{ category.id }}</span>
      </label>
    </div>

    <section class="products" v-if="paginatedProducts.length > 0">
      <div class="productCard" v-for="product in paginatedProducts" :key="product.id">

        <RouterLink :to="'/product/' + product.id">
          <img class="productImage" :src="product.image" />
          <div class="product-name">{{ product.name }}</div>
          <div class="product-name">{{ product.brand }}</div>
          <div style="font-size:2vh; margin 5px">₴ {{ product.sellPrice }}.00</div>
        </RouterLink>

        <AddToCart class="add-to-cart" :product-id="product.id" :sellPrice="product.sellPrice" :image="product.image"
          :name="product.name">
        </AddToCart>
      </div>
    </section>
    <div class="pagination">
      <button @click="prevPage" :class="{ 'disabled': currentPage === 1 }"><img src="../assets/imgs/icons/left-arrow.png"
          alt=""></button>
      <button @click="goToPage(pageNumber)" v-for="pageNumber in totalPages" :key="pageNumber"
        :class="{ active: pageNumber === currentPage }">{{ pageNumber }}</button>
      <button @click="nextPage" :class="{ 'disabled': currentPage === totalPages }"><img
          src="../assets/imgs/icons/right-arrow.png" alt=""></button>
    </div>

  </div>
</template>


<script setup>
import { ref, reactive, watch, onMounted, computed } from "vue";
import { dataBase, dataReg } from "../main";
import { onSnapshot, doc } from "firebase/firestore";
import { RouterLink } from "vue-router";
import AddToCart from "../components/AddToCart.vue";

const originalProducts = ref([]);
const categories = ref([]);
const category = ref({});
const products = ref([]);
const product = reactive({
  productId: "",
  name: "",
  detail: "",
  sellPrice: 0,
  brand: "",
  category: "",
  image: "",
  freeGluten: false,
  freeSugar: false,
  freeLactosa: false,
  vegan: false,
  raw: false,
});
const currentPage = ref(1);
const productsPerPage = 15;
const totalProducts = ref(1);
const currentCategory = ref(null);
const paginatedProducts = computed(() => {
  const startIndex = (currentPage.value - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  return products.value.slice(startIndex, endIndex);
});

const goToPage = (pageNumber) => {
  if (pageNumber >= 1 && pageNumber <= totalPages.value) {
    currentPage.value = pageNumber;
    scrollToTop();
  }
};

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
    scrollToTop();
  }
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
    scrollToTop();
  }
};

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth', // Optional: Adds smooth scrolling animation
  });
};

// Calculate total pages based on total products and products per page
const totalPages = computed(() => {
  return Math.ceil(totalProducts.value / productsPerPage);
});

const filterProducts = (categoryFilter) => {
  currentCategory.value = categoryFilter;
  currentPage.value = 1; // Reset to the first page

  if (categoryFilter === null) {
    // If categoryFilter is null, show all products
    products.value = [...originalProducts.value];
  } else {
    // Filter products by category
    products.value = originalProducts.value.filter(
      (product) => product.category === categoryFilter
    );
  }

  totalProducts.value = products.value.length; // Update totalProducts
};


const resetFilter = () => {
  currentCategory.value = null; // Reset the category filter
  currentPage.value = 1; // Reset to the first page

  // Update the products to show all products or the filtered products
  if (currentCategory.value === null) {
    products.value = [...originalProducts.value];
  } else {
    products.value = originalProducts.value.filter(
      (product) => product.category === currentCategory.value
    );
  }

  totalProducts.value = products.value.length; // Update totalProducts
};

onSnapshot(dataBase, (snapshot) => {
  originalProducts.value = [];
  snapshot.docs.forEach((doc) => {
    originalProducts.value.push({ ...doc.data(), id: doc.id });
  });

  // Update totalProducts
  totalProducts.value = originalProducts.value.length;
});

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

watch(originalProducts, () => {
  products.value = originalProducts.value;
});
</script>

<style scoped lang="scss">
.store-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.filter-buttons {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  height: 10vh;
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
    font-size: 25px;
    max-width: 250px;
    text-shadow: 0 2px 5px rgba(0, 0, 0, 0.6), 0 -2px 3px rgba(255, 255, 255, 1);
  }

  &:hover+span {
    font-size: 25px;
    transition: 0.3s;
    max-width: 250px;
    text-shadow: 0 2px 5px rgba(0, 0, 0, 0.6), 0 -2px 3px rgba(255, 255, 255, 1);
  }
}

label {
  span {
    display: block;
    cursor: pointer;
    background-color: transparent;
    padding: 0 1.5vh;
    gap: 0.1vw;
    letter-spacing: 0.05em;
    color: #3e4963;
    font-size: 20px;
    text-align: center;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.6), 0 -2px 3px rgba(255, 255, 255, 1);
    transition: 0.3s;
  }

  &:first-child {
    span {
      border-radius: 25px 0 0 25px;
    }
  }

  &:last-child {
    span {
      border-radius: 0 25px 25px 0;
    }
  }
}

.products {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  justify-content: center;
}

.productCard {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 15vw;
  height: 38vh;
  margin: 0vh 0.5vw 10vh 0.5vw;
  background: #ffffff;
  border-radius: 25px;
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
}

.product-name {
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

.pagination {
  margin: 0 0 5vh 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

img {
  height: 1.5vh;
}

button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: auto;
  height: 4vh;
  border: none;
  margin: 0.6vw;
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
