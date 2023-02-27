<template>
  <div>
    <div class="filter-buttons">
      <button class="filter-button" @click="resetFilter(category.id)">
        Всі товари
      </button>
      <button class="filter-button" v-for="category in categories" :key="category" @click="filterProducts(category.id)">
        {{ category.id }}
      </button>
    </div>
    <section class="products" v-if="products.length > 0">
      <div class="productCard" v-for="product in products" :key="product.id">
        <RouterLink :to="('/product/' + product.id)">
          <img class="productImage" :src="product.image">
          <h3 style="height: 44px;">{{ product.name }}</h3>
          <h3>₴ {{ product.sellPrice }}.00</h3>
        </RouterLink>
        <AddToCart :product-id="product.id" :sellPrice="product.sellPrice" :image="product.image" :name="product.name">
        </AddToCart>
      </div>
    </section>
  </div>
</template>

<script>
import { dataBase, categoryReg } from '../main';
import { onSnapshot } from "firebase/firestore";
import { RouterLink } from 'vue-router';
import AddToCart from '../components/AddToCart.vue';

export default {
  name: "Store",
  props: {
    msg: String
  },
  components: { AddToCart, RouterLink },
  data() {
    return {
      originalProducts: [],
      categories: [],
      category: {},
      products: [],
      product: {
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
        raw: false
      }
    };
  },
  methods: {
    filterProducts(category) {
      this.products = this.originalProducts;
      this.products = this.products.filter(product => product.category === category);
    },
    resetFilter() {
      this.products = this.originalProducts;
    },
    filteredProducts() {

    }
  },
  created() {
    onSnapshot(dataBase, (snapshot) => {
      snapshot.docs.forEach((doc) => {
        this.products.push({ ...doc.data(), id: doc.id });
      });
    });
    onSnapshot(categoryReg, (snapshot) => {
      this.categories = [];
      snapshot.docs.forEach((doc) => {
        this.categories.push({ ...doc.data(), id: doc.id })
      })
    });
    this.originalProducts = this.products;
  }
};
</script>

<style scoped lang="scss">
.products {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  justify-content: center;
}

.filter-buttons {
  display: flex;
  widows: 90%;
  height: 50px;
  margin-bottom: 15px;
}

.filter-button {
  width: 15%;
  background-color: transparent;
  border-top: none;
  border-bottom: none;
  border-right: 1px solid rgba(73, 73, 73, 0.795);
  border-left: 1px solid rgba(73, 73, 73, 0.795);
  transition: 1s;
  font-size: 20px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.6), 0 -2px 3px rgba(255, 255, 255, 1);
}

.filter-button:hover {
  width: 25%;
  transition: 0.5s;
  font-size: 25px;
}

.productCard {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  text-decoration: none;
  width: 290px;
  height: 350px;
  margin: 40px 10px 50px 10px;
  background: #f0f0f0;
  border-radius: 25px;
  box-shadow: 0 25px 15px rgba(0, 0, 0, 0.4), 0 -1px 20px rgba(0, 0, 0, 0.2);
  border: 2px solid rgba(22, 10, 10, 0.25);
  transition: 0.5s;

  a {
    text-decoration: none;
    color: inherit;
  }
}

.productCard:hover {
  box-shadow: 0 15px 55px rgba(0, 0, 0, 0.4), 0 -1px 20px rgba(0, 0, 0, 0.2);
  transition: 1s;
}

.productImage {
  height: 280px;
  filter: drop-shadow(0 25px 20px rgba(0, 0, 0, 0.5));
  margin-top: -50px;
}
</style>