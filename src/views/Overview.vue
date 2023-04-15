<template>
  <div class="overview">
    <div>Total Value: {{ totalValue }}</div>
  </div>
</template>

<script>
import { dataBase } from "../main";
import { onSnapshot } from "firebase/firestore";

export default {
  name: "Overwiev",
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
  },
};
</script>

<style scoped>
.overview {
  box-shadow: 0 15px 15px rgba(0, 0, 0, 0.4), 0 -1px 20px rgba(0, 0, 0, 0.2);
  background-color: rgba(253, 253, 253, 0.75);
  border: 1px solid rgba(255, 255, 255, 0.125);
  width: 100%;
  border-radius: 25px;
}
</style>
