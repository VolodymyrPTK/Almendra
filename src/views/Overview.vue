<template>
  <div class="overview">
    <input type="text" v-model="brandname" @keyup.enter="saveBrand">
    <ul>
      <li v-for="(brand, index) in brands" :key="index">{{ brand.brandname }}</li>
    </ul>
  </div>
</template>

<script>
import supabase from '../supabaseClient';

export default {
  name: 'Overview',
  props: {
    msg: String,
  },
  data() {
    return {
      brands: [],
      brandname: '',
      errorMessage: '',
    };
  },
  methods: {
    async saveBrand() {
      try {
        const { data, error } = await supabase
          .from('brands')
          .insert([
            {
              brandname: this.brandname,
            },
          ]);

        if (error) {
          this.errorMessage = 'Error storing data: ' + error.message;
        } else {
          console.log('Data stored successfully:', data);
          this.brandname = ''; // Clear the input field
        }
      } catch (error) {
        this.errorMessage = 'Error: ' + error.message;
      }
    },
    async fetchBrands() {
      try {
        const { data, error } = await supabase.from('brands').select('brandname');

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

    // Subscribe to changes in the user's authentication state
    supabase.auth.onAuthStateChange(() => {
      this.fetchBrands();
    });
  },
};
</script>
  



<style scoped>
.overview {
  padding: 1vh;
  width: 100%;
}
</style>
