<template>
  <div class="overview">
    <button popovertarget="foo">Toggle the popover</button>
    <div id="foo" popover>Popover content</div>
    <img src="../assets/facebook.png" alt="" inert>
    <p inert>Using the details tag in HTML</p>
    <details>
      <summary>Click here to see more details</summary>
      <p>The details tag can contain any HTML content, such as text, images, links, etc.</p>

    </details>
    <button popovertarget="my-popover" class="trigger-btn"> Open Popover </button>

    <div id="my-popover" popover=manual>
      <button class="close-btn" popovertarget="my-popover" popovertargetaction="hide">
        <span aria-hidden=”true”>❌</span>
        <span class="sr-only">Close</span>
      </button>
      <p>I am a popover with more information.
      </p>
    </div>
    <h3>Total Value: {{ totalValue }}</h3>
    <h3>Number of Products: {{ productCount }}</h3>
    <input type="text" v-model="name" @keyup.enter="saveBrand" placeholder="firz">
    <ul>
      <li v-for="(brand, index) in brands" :key="index">{{ brand.name }}</li>
    </ul>
  </div>
</template>

<script>
import supabase from '../supabaseClient';
import { dataBase } from "../main";
import { onSnapshot } from "firebase/firestore";

export default {
  name: 'Overview',
  props: {
    msg: String,
  },
  data() {
    return {
      products: [],
      brands: [],
      name: '',
      errorMessage: '',
    };
  },
  methods: {
    async saveBrand() {
      try {
        const { data, error } = await supabase
          .from('brands')
          .insert([
            { name: this.name, },
          ]);
        if (error) {
          this.errorMessage = 'Error storing data: ' + error.message;
        } else {
          console.log('Data stored successfully:', data);
          this.name = '';
        }
      } catch (error) {
        this.errorMessage = 'Error: ' + error.message;
      }
    },
    async fetchBrands() {
      try {
        const { data, error } = await supabase.from('brands').select('name');
        if (error) {
          console.error('Error fetching data:', error);
        } else {
          this.brands = data;
        }
      } catch (error) {
        console.error('Error:', error.message);
      }
    },
  },
  mounted() {
    this.fetchBrands();
    supabase.auth.onAuthStateChange(() => {
      this.fetchBrands();
    });
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
      const uniqueProductIds = new Set();
      this.products.forEach((product) => {
        uniqueProductIds.add(product.id);
      });
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
