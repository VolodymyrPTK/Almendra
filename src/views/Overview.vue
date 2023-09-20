<template>
  <div class="overview">
    <h3>Total Value: {{ totalValue }}</h3>
    <h3>Number of Products: {{ productCount }}</h3>
  </div>
</template>

<script>
import { dataBase } from "../main";
import { onSnapshot } from "firebase/firestore";

export default {
  name: "Overview",
  props: {
    msg: String,
  },
  data() {
    return {
      products: [],
    };
  },
  async created() {
    onSnapshot(dataBase, (snapshot) => {
      this.products = [];
      snapshot.docs.forEach((doc) => {
        this.products.push({ ...doc.data(), id: doc.id });
      });
    });
  },
  computed: {
    totalValue() {
      return this.products.reduce((total, product) => {
        return total + (product.sellPrice * product.quantity || 0);
      }, 0);
    },
    productCount() {
      // Use a Set to store unique product IDs
      const uniqueProductIds = new Set();

      // Loop through the products and add their IDs to the Set
      this.products.forEach((product) => {
        uniqueProductIds.add(product.id);
      });

      // Return the size of the Set, which is the count of unique products
      return uniqueProductIds.size;
    },
  },
};
</script>


<style scoped>
.overview {
  padding: 1vh;
  width: 100%;
}
</style>
