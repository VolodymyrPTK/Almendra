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

    <section class="products" v-if="products.length > 0">
      <div class="productCard" v-for="product in products" :key="product.id">

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

  </div>
</template>


<script setup>
import { ref, reactive, watch, onMounted } from "vue";
import { dataBase, categoryReg, dataReg } from "../main";
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

const filterProducts = (categoryFilter) => {
  products.value = originalProducts.value.filter(
    (product) => product.category === categoryFilter
  );
};

const resetFilter = () => {
  products.value = originalProducts.value;
};

onSnapshot(dataBase, (snapshot) => {
  originalProducts.value = [];
  snapshot.docs.forEach((doc) => {
    originalProducts.value.push({ ...doc.data(), id: doc.id });
  });
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

@media (max-width: 550px) {
  .productCard {
    width: 40vw;
    height: 27vh;
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
}
</style>
