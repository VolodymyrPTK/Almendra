<template>
  <div>
    <div class="filter-buttons">
      <label @click="resetFilter(category.id)">
        <input type="radio" name="radio" checked />
        <span>Всі товари</span>
      </label>
      <label
        v-for="category in categories"
        :key="category"
        @click="filterProducts(category.id)"
      >
        <input type="radio" name="radio" />
        <span>{{ category.id }}</span>
      </label>
    </div>
    <section class="products" v-if="products.length > 0">
      <div class="productCard" v-for="product in products" :key="product.id">
        <RouterLink :to="'/product/' + product.id">
          <img class="productImage" :src="product.image" />
          <h3 style="height: 44px">{{ product.name }}</h3>
          <h3>₴ {{ product.sellPrice }}.00</h3>
        </RouterLink>
        <AddToCart
          :product-id="product.id"
          :sellPrice="product.sellPrice"
          :image="product.image"
          :name="product.name"
        >
        </AddToCart>
      </div>
    </section>
  </div>
</template>

<script>
import { dataBase, categoryReg } from "../main";
import { onSnapshot } from "firebase/firestore";
import { RouterLink } from "vue-router";
import AddToCart from "./AddToCart.vue";

export default {
  name: "Vegan",
  props: {
    msg: String,
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
        raw: false,
      },
    };
  },
  methods: {
    filterProducts(category) {
      this.products = this.originalProducts;
      this.products = this.products.filter(
        (product) => product.category === category
      );
    },
    resetFilter() {
      this.products = this.originalProducts;
    },
  },
  created() {
    onSnapshot(dataBase, (snapshot) => {
      snapshot.docs.forEach((doc) => {
        const product = doc.data();
        if (product.vegan === true) {
          this.products.push({ ...product, id: doc.id });
        }
      });
    });
    onSnapshot(categoryReg, (snapshot) => {
      this.categories = [];
      snapshot.docs.forEach((doc) => {
        this.categories.push({ ...doc.data(), id: doc.id });
      });
    });
    this.originalProducts = this.products;
  },
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
  flex-wrap: wrap;
  margin: 0 0 25px 0;
  justify-content: center;
  align-items: center;
  height: 50px;
}

input[type="radio"] {
  height: 1px;
  overflow: hidden;
  position: absolute;
  white-space: nowrap;
  width: 1px;

  &:checked + span {
    transition: 0.3s;
    color: #000000;
    font-size: 25px;
    max-width: 250px;
    text-shadow: 0 2px 5px rgba(0, 0, 0, 0.6), 0 -2px 3px rgba(255, 255, 255, 1);
  }

  &:hover + span {
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
    padding: 0.375em 0.75em;
    margin-left: 0.0625em;
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
  box-shadow: rgba(0, 0, 0, 0.4) 0px 2px 4px,
    rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset;
  // border: 2px solid rgba(22, 10, 10, 0.25);
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
