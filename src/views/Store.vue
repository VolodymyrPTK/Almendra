<template>
  <div class="products">
    <RouterLink class="productCard" :to="('/product/' + product.id)" v-for="product in products">
      <div>
        <img class="productImage" :src="product.image">
      </div>
      <h3>{{ product.name }}</h3>
      <div class="details">
        <h5>{{ product.detail }}</h5>
        <h5>{{ product.brand }}</h5>
      </div>
      <div class="buy">
        <h2 class="price">₴{{ product.price }}.00</h2>
        <AddToCart :product-id="product.id" :price="product.price" :name="product.name">
        </AddToCart>
      </div>
    </RouterLink>
  </div>
</template>

<script>
import { dataBase, storage } from '../main';
import { addDoc, deleteDoc, onSnapshot, doc } from "firebase/firestore";
import { ref as storageReference, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { ref } from 'vue';
import AddToCart from '../components/AddToCart.vue';
import { RouterLink } from 'vue-router';

export default {
  name: "Products",
  props: {
    msg: String
  },
  data() {
    return {
      products: [],
      product: {
        name: "",
        detail: "",
        price: "",
        description: "",
        kcal: "",
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
  created() {
    onSnapshot(dataBase, (snapshot) => {
      snapshot.docs.forEach((doc) => {
        this.products.push({ ...doc.data(), id: doc.id });
      });
    });
  },
  components: { AddToCart, RouterLink }
};
</script>

<style scoped lang="scss">
.products {
  display: flex;
  width: 100%;
  justify-content: center;
}

.productCard {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  width: 300px;
  height: 450px;
  margin: 10px;
  background-color: #f0f0f0;
  border-radius: 25px;
  box-shadow: 0 10px 10px grey;
}

.productImage {
  height: 250px;
}

h3 {
  height: 44px;
  width: 300px;
  margin-bottom: 0;
}

.buy {
  width: 90%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.price {
  margin: 0 0 0 25px;
}

.details {
  width: 70%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>