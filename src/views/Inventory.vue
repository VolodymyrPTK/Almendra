<script setup>
import { ref, onMounted, computed } from "vue";
import { dataBase, db } from "../main";
import { deleteDoc, onSnapshot, doc, setDoc } from "firebase/firestore";
import { supabase } from "../api/supabase"; // Add this import


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
const deliveryModal = ref(false);
const showProviderModal = ref(false);
const provider = ref({
  name: '',
  products: []
});
const providers = ref([]);
const selectedProducts = ref([]);
const selectedProvider = ref(null);

// Add new ref for controlling views
const deliveryView = ref('providers') // 'providers' or 'newProvider'

// Add new ref for product search
const providerProductSearch = ref('')

const openDelivetyModal = () => {
  deliveryModal.value = !deliveryModal.value;
}

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

const openProviderModal = () => {
  deliveryView.value = 'newProvider'
};

const backToProviders = () => {
  deliveryView.value = 'providers'
  provider.value = { name: '', products: [] }
  selectedProducts.value = []
}

const createProvider = async () => {
  try {
    const { data, error } = await supabase
      .from('providers')
      .insert([{
        name: provider.value.name,
        products: selectedProducts.value.map(product => ({
          product_id: product.id,
          name: product.name,
          brand: product.brand
        }))
      }]);

    if (error) throw error;

    await fetchProviders();
    showProviderModal.value = false;
    provider.value = { name: '', products: [] };
    selectedProducts.value = [];
  } catch (error) {
    console.error('Error creating provider:', error);
  }
};

const fetchProviders = async () => {
  try {
    const { data, error } = await supabase
      .from('providers')
      .select('*');

    if (error) throw error;
    providers.value = data;
  } catch (error) {
    console.error('Error fetching providers:', error);
  }
};

const toggleProductSelection = (product) => {
  const index = selectedProducts.value.findIndex(p => p.id === product.id);
  if (index === -1) {
    selectedProducts.value.push(product);
  } else {
    selectedProducts.value.splice(index, 1);
  }
};

// Add computed property for filtered products in provider form
const filteredProviderProducts = computed(() => {
  if (!providerProductSearch.value) return products.value

  const searchTerms = providerProductSearch.value.toLowerCase().split(' ')
  return products.value.filter(product => {
    return searchTerms.every(term => {
      const searchTerm = term.toLowerCase()
      return (
        product.name.toLowerCase().includes(searchTerm) ||
        product.brand.toLowerCase().includes(searchTerm) ||
        (product.barCode && product.barCode.toString().includes(searchTerm))
      )
    })
  })
})

const editProvider = (provider) => {
  selectedProducts.value = provider.products.map(p => ({
    id: p.product_id,
    name: p.name,
    brand: p.brand
  }));
  provider.value = {
    name: provider.name,
    id: provider.id,
    products: provider.products
  };
  deliveryView.value = 'newProvider';
};

onMounted(async () => {
  await fetchProducts();
  await fetchProviders();
});


</script>

<template>

  <div class="products">
    <div class="delivery-modal-overlay" v-if="deliveryModal">
      <div class="delivery-modal">
        <div class="modal-header">
          <div class="header-left">
            <button v-if="deliveryView === 'newProvider'" @click="backToProviders" class="neo-button back-btn">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                stroke="currentColor">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
            </button>
            <h2>{{ deliveryView === 'providers' ? 'Нова Поставка' : 'Новий Постачальник' }}</h2>
            <div class="input-container provider-name-input">
              <input v-if="deliveryView === 'newProvider'" v-model="provider.name" type="text"
                placeholder="Назва постачальника" class="neo-input" />
            </div>

          </div>
          <div class="modal-actions">
            <button v-if="deliveryView === 'providers'" @click="openProviderModal" class="neo-button action-btn">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                stroke="currentColor">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <line x1="19" y1="8" x2="19" y2="14" />
                <line x1="22" y1="11" x2="16" y2="11" />
              </svg>
              Новий Постачальник
            </button>
            <button @click="openDelivetyModal" class="neo-button close-btn">×</button>
          </div>
        </div>

        <!-- Providers View -->
        <div v-if="deliveryView === 'providers'" class="modal-content">
          <div class="providers-section">
            <h3>Постачальники</h3>
            <div class="providers-list">
              <div v-for="p in providers" :key="p.id" class="provider-item"
                :class="{ active: selectedProvider?.id === p.id }" @click="selectedProvider = p">
                <div class="provider-info">
                  <span class="provider-name">{{ p.name }}</span>
                  <span class="product-count">{{ p.products.length }} товарів</span>
                </div>
                <div class="provider-actions">
                  <button class="action-icon edit-btn" @click.stop="editProvider(p)" title="Edit Provider">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                  </button>
                  <button class="action-icon" @click.stop="selectedProvider = p">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor">
                      <polygon points="5 3 19 12 5 21 5 3" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div v-if="selectedProvider" class="provider-products-section">
            <h3>{{ selectedProvider.name }} - Товари</h3>
            <div class="products-grid">
              <div v-for="product in selectedProvider.products" :key="product.product_id" class="product-card">
                <div class="product-card-content">
                  <h4>{{ product.name }}</h4>
                  <p>{{ product.brand }}</p>
                  <div class="product-actions">
                    <button class="action-btn">Додати</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- New Provider View -->
        <div v-if="deliveryView === 'newProvider'" class="modal-content provider-form-content">
          <div class="provider-form">

            <div class="products-selection-container">
              <div class="selection-header">
                <div class="selection-header-top">
                  <h3>Оберіть товари для постачальника</h3>
                  <input v-model="providerProductSearch" type="text" placeholder="Пошук товарів..."
                    class="neo-input search-input" />
                  <span class="selected-count">{{ selectedProducts.length }} обрано</span>
                </div>
                <div class="search-box">

                </div>
              </div>
              <div class="products-table-container">
                <table class="products-table">
                  <thead>
                    <tr>
                      <th>Назва</th>
                      <th>Бренд</th>
                      <th>Штрихкод</th>
                      <th>Вибрати</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="product in filteredProviderProducts" :key="product.id"
                      :class="{ selected: selectedProducts.some(p => p.id === product.id) }">
                      <td>{{ product.name }}</td>
                      <td>{{ product.brand }}</td>
                      <td>{{ product.barCode }}</td>
                      <td>
                        <button class="neo-button select-btn" @click="toggleProductSelection(product)">
                          {{selectedProducts.some(p => p.id === product.id) ? '✓' : '+'}}
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div class="modal-footer">
            <button @click="createProvider" class="neo-button create-btn"
              :disabled="!provider.name || selectedProducts.length === 0">
              Створити постачальника
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="editVisible || isVisible" class="addproduct">
      <div class="top-inputs">
        <h3>{{ product.name }} {{ product.brand }}</h3>

        <div id="group3">
          <p class="input-container">
            <input type="number" v-model="product.buyPrice" placeholder="Ціна Купівлі" class="input-field" />
            <label class="input-label">Ціна Купівлі</label>
          </p>
          <p class="input-container">
            <input type="number" v-model="product.sellPrice" placeholder="Ціна Продажу" class="input-field" />
            <label class="input-label">Ціна Продажу</label>
          </p>

          <div class="markUp"> Націнка: {{ markUpPercent }}%</div>
        </div>
        <p class="input-container">
          <input type="number" v-model="product.barCode" placeholder=" " class="input-field" />
          <label class="input-label">Штрих код</label>
        </p>
      </div>

      <div>
        <button v-if="editVisible" @click="updateData">Оновити</button>
        <button v-if="editVisible" @click="closeModal">Закрити</button>
      </div>
    </div>

    <div class="productlist">
      <div class="list-header">
        <button @click="openDelivetyModal">Нова Поставка</button>
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
          <tr class="tableline" @dblclick="editModal(product.id)" v-for="product in filteredProducts" :key="product.id">
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

.delivery-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.delivery-modal {
  position: relative;
  width: 80%;
  height: 80%;
  background: #f8f9fa;
  border-radius: 20px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.modal-header {
  padding: 1.5rem;
  background: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e9ecef;

  h2 {
    font-size: 1.5rem;
    color: #2d3436;
    margin: 0;
  }

  .modal-actions {
    display: flex;
    gap: 1rem;
  }

  .action-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    background: #e3f2fd;
    color: #1976d2;
    border-radius: 10px;
    transition: all 0.2s;

    &:hover {
      background: #bbdefb;
    }

    svg {
      stroke-width: 1.5;
    }
  }

  .close-btn {
    padding: 0.5rem;
    border-radius: 10px;

    &:hover {
      background: #fee2e2;
      color: #dc2626;
    }
  }
}

.modal-content {
  flex: 1;
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 1rem;
  padding: 1.5rem;
  overflow: hidden;
}

.providers-section {
  background: white;
  border-radius: 15px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;

  h3 {
    margin: 0;
    color: #2d3436;
  }
}

.providers-list {
  overflow-y: auto;
  flex: 1;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 4px;
  }
}

.provider-item {
  padding: 1rem;
  margin-bottom: 0.5rem;
  border-radius: 10px;
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  justify-content: space-between;
  align-items: center;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  &.active {
    background: #e3f2fd;
    border-left: 4px solid #1976d2;
  }

  .provider-info {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .provider-name {
    font-weight: 500;
    color: #2d3436;
  }

  .product-count {
    font-size: 0.875rem;
    color: #64748b;
  }

  .action-icon {
    padding: 0.5rem;
    border-radius: 8px;
    color: #64748b;

    &:hover {
      background: #f1f5f9;
      color: #1976d2;
    }

    &.edit-btn:hover {
      background: #e3f2fd;
      color: #1976d2;
    }
  }
}

.provider-products-section {
  background: white;
  border-radius: 15px;
  padding: 1.5rem;
  overflow-y: auto;

  h3 {
    margin: 0 0 1rem 0;
    color: #2d3436;
  }

  .products-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1rem;
  }

  .product-card {
    background: white;
    border-radius: 12px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    transition: all 0.2s;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .product-card-content {
      padding: 1rem;

      h4 {
        margin: 0 0 0.5rem 0;
        color: #2d3436;
      }

      p {
        margin: 0;
        color: #64748b;
        font-size: 0.875rem;
      }

      .product-actions {
        margin-top: 1rem;

        .action-btn {
          width: 100%;
          padding: 0.5rem;
          background: #e3f2fd;
          color: #1976d2;
          border-radius: 8px;

          &:hover {
            background: #bbdefb;
          }
        }
      }
    }
  }
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

.input-container {
  --c-text: rgb(50, 50, 80);
  --c-bg: rgb(252, 252, 252);
  --c-outline: rgb(55, 45, 190);
  display: grid;
  gap: 1ch;
  position: relative;
  max-width: 190px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: black;
  margin: 0.5vw;
}

.input-field {
  padding: 0.5em 0.75em;
  border-radius: 25px;
  border: 1px solid var(--c-border, currentColor);
  color: var(--c-text);
  font-size: 1rem;
  letter-spacing: 0.1ch;
  width: 100%;
  box-shadow: inset 0px 5px 5px rgba(0, 0, 0, 0.3);
  background-color: rgb(255, 255, 255);
}

.input-field:not(:placeholder-shown)+.input-label {
  transform: translateY(-220%);
  opacity: 1;
}

.input-field:invalid {
  --c-border: rgb(230, 85, 60);
  --c-text: rgb(230, 85, 60);
  --c-outline: rgb(230, 85, 60);
}

.input-field:is(:disabled, :read-only) {
  --c-border: rgb(150, 150, 150);
  --c-text: rgb(170, 170, 170);
}

.input-field:is(:focus, :focus-visible) {
  outline: 2px solid var(--c-outline);
  outline-offset: 2px;
}

.input-label {
  --timing: 200ms ease-in;
  position: absolute;
  left: 0.75em;
  top: 50%;
  transition: transform var(--timing),
    opacity var(--timing);
  transform: translateY(-50%);
  opacity: 0;
  color: var(--c-text);
  font-weight: 500;
}

.searchInput {
  width: 20vw;
  text-align: center;
  box-shadow: 0px 5px 5px rgba(0, 0, 0, 0.3), inset 0px 0px 0px rgba(0, 0, 0, 0);
  transition: 0.5s;
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
    align-items: center;

    .input-container {
      margin: 0 0.5vw;
    }
  }
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

.provider-modal {
  max-width: 800px;
  height: auto;
}

.provider-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.products-selection {
  max-height: 400px;
  overflow-y: auto;
}

.product-card.selected {
  background: #e3f2fd;
  box-shadow: inset 5px 5px 10px #a3b1c6,
    inset -5px -5px 10px #ffffff;
}

.providers-list {
  margin: 1rem 0;
  max-height: 200px;
  overflow-y: auto;
}

.provider-item {
  display: flex;
  justify-content: space-between;
  padding: 0.8rem 1rem;
  margin-bottom: 0.5rem;
  border-radius: 8px;
  background: white;
  box-shadow: 5px 5px 10px #a3b1c6,
    -5px -5px 10px #ffffff;
  cursor: pointer;
  transition: all 0.2s;

  &.active {
    background: #e3f2fd;
    box-shadow: inset 5px 5px 10px #a3b1c6,
      inset -5px -5px 10px #ffffff;
  }

  &:hover {
    transform: translateY(-2px);
  }
}

.provider-products {
  margin-top: 1.5rem;
}

.create-btn {
  align-self: center;
  width: auto;
  padding: 0.8rem 2rem;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.back-btn {
  padding: 0.5rem;
  color: #64748b;

  &:hover {
    color: #1976d2;
  }

  svg {
    display: block;
    stroke-width: 1.5;
  }
}

.provider-form-content {
  display: flex;
  flex-direction: column;
  height: calc(100% - 70px);
  padding: 1.5rem;
}

.provider-form {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  overflow: hidden;
}

.provider-name-input {
  width: 100%;
  max-width: 400px;
  margin-left: 200px;

  .neo-input {
    width: 100%;
    padding: 0.8rem 1.2rem;
    border: none;
    border-radius: 12px;
    background: white;
    box-shadow: inset 5px 5px 10px #a3b1c6,
      inset -5px -5px 10px #ffffff;
    font-size: 1rem;
    color: #2d3436;
    transition: all 0.3s ease;

    &:focus {
      outline: none;
      box-shadow: inset 6px 6px 12px #a3b1c6,
        inset -6px -6px 12px #ffffff;
    }

    &::placeholder {
      color: #95a5a6;
    }
  }
}

.products-selection-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  overflow: hidden;
}

.selection-header {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1rem;

  .selection-header-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}

.search-box {
  width: 100%;

  .search-input {
    width: 100%;
    padding: 0.8rem 1.2rem;
    border: none;
    border-radius: 12px;
    background: white;
    box-shadow: inset 3px 3px 7px #a3b1c6,
      inset -3px -3px 7px #ffffff;
    font-size: 1rem;
    color: #2d3436;
    transition: all 0.3s ease;

    &:focus {
      outline: none;
      box-shadow: inset 4px 4px 8px #a3b1c6,
        inset -4px -4px 8px #ffffff;
    }

    &::placeholder {
      color: #95a5a6;
    }
  }
}

.products-table-container {
  flex: 1;
  overflow-y: auto;
  border-radius: 12px;
  background: white;
  box-shadow: inset 3px 3px 7px #a3b1c6,
    inset -3px -3px 7px #ffffff;
  padding: 1rem;
}

.products-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;

  thead {
    position: sticky;
    top: 0;
    background: white;
    z-index: 1;

    th {
      padding: 1rem;
      text-align: left;
      font-weight: 500;
      color: #64748b;
      border-bottom: 2px solid #e2e8f0;
    }
  }

  tbody {
    tr {
      border-bottom: 1px solid #e2e8f0;
      transition: background-color 0.2s;

      &:hover {
        background-color: #f8fafc;
      }

      &.selected {
        background-color: #e3f2fd;
      }
    }

    td {
      padding: 1rem;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  // Fixed column widths
  th:nth-child(1),
  td:nth-child(1) {
    width: 40%;
    max-width: 300px;
  }

  th:nth-child(2),
  td:nth-child(2) {
    width: 25%;
    max-width: 200px;
  }

  th:nth-child(3),
  td:nth-child(3) {
    width: 20%;
    max-width: 150px;
  }

  th:nth-child(4),
  td:nth-child(4) {
    width: 15%;
    text-align: center;
  }
}

.select-btn {
  width: 32px;
  height: 32px;
  padding: 0;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
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

      .input-container {
        margin: 0 0.5vw;
      }

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
