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
      <li v-for="brand in brands" :key="brand.id">
        {{ brand.id }} - {{ brand.name }}
        <button @click="openEditModal(brand)">Edit</button>
        <button @click="deleteBrand(brand.id)">Delete</button>
      </li>
    </ul>

    <div v-if="editingBrand" class="modal">
      <form @submit.prevent="editBrand">
        <label for="editBrandName">Edit Brand Name:</label>
        <input type="text" id="editBrandName" v-model="editedBrandName" />
        <button type="submit">Save</button>
      </form>
      <button @click="closeEditModal">Cancel</button>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import supabase from '../supabaseClient';

export default {
  setup() {
    const brands = ref([]);
    const newBrandName = ref('');
    const editingBrand = ref(null);
    const editedBrandName = ref('');

    async function getBrands() {
      const { data } = await supabase.from('brands').select();
      brands.value = data;
    }

    async function addBrand() {
      await supabase.from('brands').insert({ name: newBrandName.value });
      newBrandName.value = '';
      await getBrands();
    }

    function openEditModal(brand) {
      editingBrand.value = brand;
      editedBrandName.value = brand.name;
    }

    async function editBrand() {
      if (editingBrand.value) {
        await supabase
          .from('brands')
          .update({ name: editedBrandName.value })
          .eq('id', editingBrand.value.id);
        closeEditModal();
        await getBrands();
      }
    }

    function closeEditModal() {
      editingBrand.value = null;
      editedBrandName.value = '';
    }

    async function deleteBrand(brandId) {
      await supabase.from('brands').delete().eq('id', brandId);
      await getBrands();
    }

    getBrands();

    return {
      brands,
      newBrandName,
      addBrand,
      openEditModal,
      editingBrand,
      editedBrandName,
      editBrand,
      closeEditModal,
      deleteBrand,
    };
  },
};
</script>

<style>
/* Add your modal styles here */
.modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  padding: 20px;
  z-index: 999;
}
</style>
