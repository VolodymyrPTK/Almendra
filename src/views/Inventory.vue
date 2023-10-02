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
          <tr class="tableline" @click="openModal(product.id)" v-for="product in filteredProducts" :key="product.id">
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
    <InventoryModal v-if="modalVisible" :visible="modalVisible" :product="currentProduct" :categories="categories"
      :brands="brands" :countries="countries" @close="modalVisible = false" />
  </div>
</template>

<script>
import { dataBase } from "../main";
import { onSnapshot } from "firebase/firestore";
import InventoryModal from "../components/InventoryModal.vue";

export default {
  name: "Inventory",
  components: {
    InventoryModal,
  },
  props: {
    msg: String,
  },
  data() {
    return {
      products: [],
      product: {
        name: "",
        brand: "",
        buyPrice: 0,
        sellPrice: 0,
        quantity: 0,
      },
      modalVisible: false,
      isVisible: false,
      searchTerm: "",
    };
  },
  computed: {
    currentProduct() {
      return this.products.find(
        (product) => product.id === this.currentProductId
      );
    },
    filteredProducts() {
      return this.products.filter((product) =>
        product.name.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    },
  },
  methods: {
    openModal(id) {
      this.modalVisible = true;
      this.currentProductId = id;
    },
    toggleModal() {
      this.isVisible = !this.isVisible;
    },
  },
  async created() {
    onSnapshot(dataBase, (snapshot) => {
      this.products = [];
      snapshot.docs.forEach((doc) => {
        this.products.push({ ...doc.data(), id: doc.id });
      });
    });
    onSnapshot(brandReg, (snapshot) => {
      this.brands = [];
      snapshot.docs.forEach((doc) => {
        this.brands.push({ ...doc.data(), id: doc.id });
      });
    });
  },
};
</script>

<style scoped lang="scss">
.products {
  display: flex;
  width: 100%;
}

.productlist {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 25px;
  background-color: rgba(253, 253, 253, 0.75);
  box-shadow: 0 15px 15px rgba(0, 0, 0, 0.4), 0 -1px 20px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.125);
  margin-left: 20px;
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
