<template>
  <div class="products">
    <div class="productlist">
      <div class="list-header">
        <input class="searchInput" v-model="searchTerm" placeholder="Шукати" />
      </div>
      <table class="fixed_headers">
        <thead>
          <tr>
            <th></th>
            <th>Назва</th>
            <th>Бренд</th>
            <th>Кількість</th>
            <th>Ціна купівлі</th>
            <th>Ціна Продажу</th>
          </tr>
        </thead>
        <tbody>
          <tr class="tableline" v-for="product in filteredProducts" :key="product.id">
            <td>
              <img class="productImage" :src="product.image" />
            </td>
            <td v-bind:title="product.name">{{ product.name }}</td>
            <td v-bind:title="product.brand">{{ product.brand }}</td>
            <td v-bind:title="product.quantity">{{ product.quantity }}</td>
            <td v-bind:title="product.buyPrice">{{ product.buyPrice }}</td>
            <td v-bind:title="product.sellPrice">{{ product.sellPrice }}</td>
          </tr>
        </tbody>
      </table>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { onSnapshot } from 'firebase/firestore';
import { dataBase, dataReg } from '../main';

const msg = defineProps({
  msg: String
});

const products = ref([]);
const product = ref({
  name: '',
  brand: '',
  buyPrice: 0,
  sellPrice: 0,
  quantity: 0,
});
const searchTerm = ref('');
const brands = ref([]);

const filteredProducts = computed(() =>
  products.value.filter(product =>
    product.name.toLowerCase().includes(searchTerm.value.toLowerCase())
  )
);

onMounted(() => {
  onSnapshot(dataBase, (snapshot) => {
    products.value = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
  });
  onSnapshot(dataReg, 'brands', (snapshot) => {
    brands.value = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
  });
});
</script>

<style scoped lang="scss">
.products {
  display: flex;
  width: 100%;
  padding: 1vw;
}

.productlist {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.list-header {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
}

.searchInput {
  width: 400px;
  border-radius: 25px;
  text-align: center;
  box-shadow: 0px 5px 5px rgba(0, 0, 0, 0.3), inset 0px 0px 0px rgba(0, 0, 0, 0);
  transition: 0.5s;
  border: none;
  background-color: white;
  backdrop-filter: blur(0px);
}

.productImage {
  height: 45px;
}

input {
  text-align: center;
  height: 40px;
  width: 40%;
  border-radius: 25px;
  border: none;
  box-shadow: 4px 4px 4px rgb(200, 200, 200) inset,
    -4px -4px 4px rgb(255, 255, 255) inset;
  background-color: transparent;
  margin: 0 5px 0 5px;
}

select {
  text-align: center;
  height: 40px;
  width: 30%;
  border-radius: 25px;
  border: none;
  box-shadow: 4px 4px 4px rgb(200, 200, 200) inset,
    -4px -4px 4px rgb(255, 255, 255) inset;
  background-color: transparent;
  margin: 0 5px 0 5px;
}

.fixed_headers {
  display: inline-block;
  width: 90%;
  height: 90%;
  border-collapse: collapse;

  th,
  td {
    padding: 5px;
    text-align: left;
  }

  td:nth-child(1),
  th:nth-child(1) {
    width: 15%;
  }

  td:nth-child(2),
  th:nth-child(2) {
    width: 40%;
  }

  td:nth-child(3),
  th:nth-child(3) {
    width: 15%;
  }

  td:nth-child(4),
  th:nth-child(4) {
    width: 10%;
  }

  td:nth-child(5),
  th:nth-child(5) {
    width: 10%;
  }

  td:nth-child(6),
  th:nth-child(6) {
    width: 7%;
  }

  thead {
    background-color: rgb(177, 177, 177);
    color: #fdfdfd;
  }

  .tableline {
    font-size: 18px;
    height: 25px;
  }

  .tableline:hover {
    transition: 0.1s;
    background-color: rgb(212, 212, 212);
  }

  tbody {
    height: 100%;

    tr:nth-child(even) {
      background-color: rgb(228, 228, 228);
    }
  }
}
</style>
