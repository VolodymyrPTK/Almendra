<template>
  <div>
    <h2>Add a new brand</h2>
    <form @submit.prevent="addBrand">
      <label for="brandName">Brand name:</label>
      <input type="text" id="brandName" v-model="newBrandName" />
      <button type="submit">Add brand</button>
    </form>

    <h2>Brands</h2>
    <ul>
      <li v-for="brand in brands" :key="brand.id">{{ brand.name }}</li>
    </ul>
  </div>
</template>

<script>
import { ref } from 'vue'
import supabase from '../supabaseClient';

export default {
  setup() {

    const brands = ref([]);
    const newBrandName = ref('');

    async function getBrands() {
      const { data } = await supabase.from('brands').select();
      brands.value = data;
    }

    async function addBrand() {
      await supabase.from('brands').insert({ name: newBrandName.value });
      newBrandName.value = '';
      await getBrands();
    }

    getBrands();

    return {
      brands,
      newBrandName,
      addBrand,
    };
  },
};

</script>