<script setup>
import { ref, onMounted, computed } from "vue";
import { dataBase, db } from "../main";
import { deleteDoc, onSnapshot, doc, setDoc } from "firebase/firestore";


const products = ref([]);
const product = ref({
  name: "",
  detail: "",
  sellPrice: "",
  buyPrice: "",
  description: "",
  sklad: "",
  kcal: "",
  protein: "",
  carbo: "",
  fat: "",
  brand: "",
  category: "",
  country: "",
  image: "",
  weight: "",
  vitamins: [],
  freeGluten: false,
  freeSugar: false,
  freeLactosa: false,
  vegan: false,
  proteinik: false,
  liquid: false,
  popular: false,
  new: false,
  barCode: 0
});
const isVisible = ref(false);
const searchTerm = ref("");
const editVisible = ref(false);


const editModal = (id) => {
  const selectedProduct = products.value.find(product => product.id === id);
  if (selectedProduct) {
    product.value = { ...selectedProduct };
  }
  editVisible.value = true;
};

const closeModal = () => {
  editVisible.value = !editVisible.value;
};

const updateData = async () => {
  try {
    const refDoc = doc(db, "products", product.value.id);
    await setDoc(refDoc, product.value, { merge: true });
  } catch (error) {
    console.error(error);
  }
  editVisible.value = !editVisible.value;
  product.value = {};
};



const deleteProduct = async (id) => {
  if (confirm("Видалити ?")) {
    await deleteDoc(doc(dataBase, id));
    products.value = products.value.filter((product) => product.id !== id);
  }
};


const fetchProducts = async () => {
  onSnapshot(dataBase, (snapshot) => {
    products.value = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
  });
};

const currentProduct = computed(() => {
  return products.value.find((product) => product.id === currentProduct.value);
});

const filteredProducts = computed(() => {
  return products.value.filter((product) => {
    const searchTerms = searchTerm.value.toLowerCase().split(' ');
    return searchTerms.every((term) => {
      const searchTermLowerCase = term.toLowerCase();
      return (
        product.name.toLowerCase().includes(searchTermLowerCase) ||
        product.detail.toLowerCase().includes(searchTermLowerCase) ||
        product.brand.toLowerCase().includes(searchTermLowerCase) ||
        (product.barCode && product.barCode.toString().includes(searchTermLowerCase))
      );
    });

  });
});

const markUpPercent = computed(() => {
  const markupPercent = ((product.value.sellPrice - product.value.buyPrice) / product.value.buyPrice) * 100;
  return markupPercent.toFixed(2);
});

onMounted(async () => {
  await fetchProducts();

});


</script>

<template>

  <div class="products">

    <div v-if="editVisible || isVisible" class="addproduct">
      <div class="top-inputs">
        <h3>{{ product.name }} {{ product.brand }}</h3>

        <div id="group3">
          <input type="number" v-model="product.buyPrice" placeholder="Ціна Купівлі" />
          <input type="number" v-model="product.sellPrice" placeholder="Ціна Продажу" />

          <div class="markUp"> Націнка: {{ markUpPercent }}%</div>
        </div>
        <input type="number" v-model="product.barCode" placeholder="Штрих код" />
      </div>

      <div>
        <button v-if="editVisible" @click="updateData">Оновити</button>
        <button v-if="editVisible" @click="closeModal">Закрити</button>
      </div>
    </div>

    <div class="productlist">
      <div class="list-header">
        <input class="searchInput" v-model="searchTerm" placeholder="Пошук" />
      </div>
      <table class="fixed_headers">
        <thead>
          <tr>
            <th></th>
            <th>Назва</th>
            <th>Бренд</th>
            <th>Штрихкод</th>
            <th>Купівля</th>
            <th>Продаж</th>
            <th>Зміни</th>
          </tr>
        </thead>
        <tbody>
          <tr class="tableline" @dblclick="editModal(product.id)" v-for=" product in filteredProducts "
            :key="product.id">
            <td>
              <img class="productImage" :src="product.image" />
            </td>
            <td v-bind:title="product.name">{{ product.name }}</td>
            <td v-bind:title="product.brand">{{ product.brand }}</td>
            <td v-bind:title="product.brand">{{ product.barCode }}</td>
            <td class="hiden-for-mobiles" v-bind:title="product.buyPrice">{{ product.sellPrice }}</td>
            <td class="hiden-for-mobiles" v-bind:title="product.sellPrice">{{ product.sellPrice }}</td>
            <td>
              <div style="display: inline-flex;">


                <div class="deleteButton" @click="deleteProduct(product.id)">
                  <img src="../assets/imgs/icons/delete.svg" alt="">
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>


<style scoped lang="scss">
.products {
  display: flex;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.addproduct {
  align-self: center;
  position: absolute;
  padding: 0.5vw;
  margin: 1.5vw;
  width: 75%;
  height: 75%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  border-radius: 25px;
  box-shadow: 0 15px 15px rgba(0, 0, 0, 0.4), 0 -1px 20px rgba(0, 0, 0, 0.2);
  background-color: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
}

.productlist {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.list-header {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
}

.searchInput {
  width: 20vw;
  border-radius: 25px;
  text-align: center;
  box-shadow: 0px 5px 5px rgba(0, 0, 0, 0.3), inset 0px 0px 0px rgba(0, 0, 0, 0);
  transition: 0.5s;
  border: none;
  background-color: white;
}

.productImage {
  width: 40px;
}

.top-inputs {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  #group3 {
    display: flex;

    input {
      width: 10vw;
    }
  }
}

input,
textarea {
  border: none;
  padding: 0.5vw;
  margin: 0.5vw;
  color: black;
  font-size: 2vh;
  text-decoration: none;
  text-align: center;
  border-radius: 25px;
  box-shadow: inset 0px 5px 5px rgba(0, 0, 0, 0.3);
  background-color: rgb(255, 255, 255);
}

button {
  border: none;
  padding: 0.5vw;
  margin: 0.5vw;
  color: black;
  font-size: 2vh;
  text-decoration: none;
  text-align: center;
  border-radius: 25px;
  box-shadow: 0px 5px 7px rgba(0, 0, 0, 0.3), inset 0 0 0 rgba(0, 0, 0, 0.3);
  background-color: rgb(255, 255, 255);

  &:hover {
    box-shadow: 0 3px 3px rgba(0, 0, 0, 0.3), inset 0 0 0 rgba(0, 0, 0, 0.3);
    transition: 0.3s;
  }

  &:active {
    box-shadow: 0 0 0 rgba(0, 0, 0, 0.3), inset 0 3px 3px rgba(0, 0, 0, 0.3);
    transition: 0.3s;
  }

  &:disabled {
    color: #9e9e9e;
    box-shadow: 0 0 0 rgba(0, 0, 0, 0.3), inset 0 0 0 rgba(0, 0, 0, 0.3);
    cursor: not-allowed;

    &:hover::before {
      content: "Заповніть всі поля";
      position: absolute;
      top: 87%;
      background-color: rgba(0, 0, 0, 0.8);
      color: #fff;
      padding: 5px;
      border-radius: 5px;
      font-size: 0.8rem;
      white-space: nowrap;
    }
  }
}

.deleteButton {
  width: 2vw;
  height: 2vw;
  border: none;
  border-radius: 50px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: rgb(250, 108, 108);
    transition: 0.5s;
  }

  &:active {
    background-color: rgb(255, 42, 42);
    transition: 0.5s;
  }
}

.markUp {
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  background-color: rgb(255, 255, 255);
  padding: 0.5vw;
  width: 5vw;
  border-radius: 25px;
}

.fixed_headers {
  width: 90%;
  height: 90%;
  border-collapse: collapse;

  th {
    text-decoration: underline;
  }

  th,
  td {
    padding: 5px;
    text-align: left;
    vertical-align: middle;
  }

  td:nth-child(1),
  th:nth-child(1) {
    width: 5%;
  }

  td:nth-child(2),
  th:nth-child(2) {
    width: 35%;
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
    width: 5%;
  }

  td:nth-child(7),
  th:nth-child(7) {
    width: 10%;
    height: 3vh;
    display: flex;
    justify-content: space-between;
    align-items: center;

    div {
      margin: 2px;
    }
  }

  thead {
    background-color: rgb(177, 177, 177);
    color: #fdfdfd;
  }

  tr {
    display: flex;
    justify-content: space-between;
  }

  .tableline {
    font-size: 18px;
  }

  .tableline:hover {
    transition: 0.1s;
    background-color: rgb(212, 212, 212);
  }

  tbody {
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: hidden;
    overflow-y: scroll;
    scroll-behavior: smooth;

    tr:nth-child(even) {
      background-color: rgb(228, 228, 228);
    }
  }
}

@media (max-width: 550px) {
  .addproduct {
    z-index: 100;
    top: 0;
    position: absolute;
    height: 100%;
    width: 100%;
  }

  .top-inputs {
    flex-direction: column;

    #group3 {
      display: flex;

      input {
        width: 30vw;
        margin: 1vh;
      }
    }
  }

  .hiden-for-mobiles {
    display: none;
  }

  .searchInput {
    width: 40vw;
    height: 4vh;
    font-size: 2vh;
  }

  .markUp {
    width: 20vw;
  }

  button {
    height: 4vh;
  }
}
</style>
