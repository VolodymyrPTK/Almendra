<script setup>
import { ref, onMounted, computed, watch } from "vue";
import { dataBase, storage, dataReg, db } from "../main";
import { addDoc, deleteDoc, onSnapshot, doc, setDoc, getDoc, updateDoc, deleteField, getDocs, query, orderBy, limit, startAfter } from "firebase/firestore";
import { ref as storageReference, uploadBytesResumable, getDownloadURL, uploadString } from "firebase/storage";
import ImageEditor from "../components/ImageEditor.vue";

const currentCategory = ref("Категорія");
const categories = ref([]);
const subcategories = ref({});
const countries = ref([]);
const country = ref("");
const brands = ref([]);
const brand = ref("");
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
  outOfStock: false,
  noBarCode: false,
  hidden: false  // Add this line
});
const items = ref([]);
const isVisible = ref(false);
const newItemValue = ref("");
const categoryModal = ref(true);
const searchTerm = ref("");
const editVisible = ref(false);
const brandsMenu = ref(false);
const categoryMenu = ref(false);
const showSubCategory = ref(false);
const showDropdown = ref(false);
const countryMenu = ref(false);
const isLoading = ref(false);
const isLoaded = ref(false);
const lastDoc = ref(null);
const hasMore = ref(true);
const batchSize = 20; // Number of products to load per batch

const requiredFields = ref([
  "name", "detail", "sellPrice", "buyPrice", "description", "sklad", "kcal", "protein", "carbo", "fat", "brand", "country", "image", "weight", "vitamins"
]);

const fetchCategories = async () => {
  categoryModal.value = !categoryModal.value;
  try {
    const categoriesDocRef = doc(dataReg, 'categories');
    onSnapshot(categoriesDocRef, (snapshot) => {
      const categoriesData = snapshot.data();
      const categoriesArray = Object.keys(categoriesData).map((category) => ({
        id: category,
        ...categoriesData[category],
      }));
      categories.value = categoriesArray;
    });

  } catch (e) { console.error("Error fetching categories: ", e); }
};

const closeCategoryModal = () => {
  categoryModal.value = !categoryModal.value;
};

onMounted(async () => {
  await fetchCategories();
  await fetchSubcategories();
});

const fetchSubCategory = async (subcategory) => {
  const docRef = doc(dataReg, "categories");
  const docSnap = await getDoc(docRef);
  const data = docSnap.data();
  const arrayData = data[subcategory];
  items.value = arrayData;
  currentCategory.value = subcategory;
  showSubCategory.value = true;
};

const fetchSubcategories = async () => {
  try {
    const subcategoriesDocRef = doc(dataReg, 'categories');
    onSnapshot(subcategoriesDocRef, (snapshot) => {
      const subcategoriesData = snapshot.data();
      for (const category in subcategoriesData) {
        subcategories.value[category] = Object.values(subcategoriesData[category]);
      }
    });
  } catch (e) {
    console.error('Error fetching subcategories: ', e);
  }
};

const selectSubCategory = (subcategory) => {
  if (typeof product.value === 'object') {
    currentCategory.value = subcategory;
    product.value.category = subcategory;
    categoryModal.value = false;
  } else {
    console.error('product.value debe ser un objeto');
  }
};


const addItem = async (category) => {
  const valueToAdd = newItemValue.value.trim();
  if (valueToAdd !== '') {
    const docRef = doc(dataReg, 'categories');
    const docSnap = await getDoc(docRef);
    const data = docSnap.data();
    data[category].push(valueToAdd);
    await setDoc(docRef, data);
    items.value = data[category];
    newItemValue.value = '';
  }
};

const deleteItem = async (category, index) => {
  const docRef = doc(dataReg, 'categories');
  const docSnap = await getDoc(docRef);
  const data = docSnap.data();
  data[category].splice(index, 1);
  await setDoc(docRef, data);
  items.value = data[category];
};

const closeMenu = () => {
  showSubCategory.value = false;
  newItemValue.value = '';
};


const showCategory = () => {
  categoryMenu.value = !categoryMenu.value;
};

const showBrands = () => {
  brandsMenu.value = !brandsMenu.value;
};

const showCountry = () => {
  countryMenu.value = !countryMenu.value;
};

const editModal = async (id) => {
  let selectedProduct = filteredProducts.value.find(product => product.id === id);
  if (!selectedProduct && !searchTerm.value) {
    const docRef = doc(dataBase, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      selectedProduct = { ...docSnap.data(), id: docSnap.id };
    }
  }
  if (selectedProduct) {
    product.value = { ...selectedProduct };
    editVisible.value = true;
  }
};

const toggleModal = () => {
  isVisible.value = !isVisible.value;
  product.value = {};
  currentCategory.value = 'Категорія';
};

const closeModal = () => {
  editVisible.value = !editVisible.value;
};

const saveData = async () => {
  try {
    const docRef = await addDoc(dataBase, product.value);
    const newProduct = { ...product.value, id: docRef.id };
    products.value.unshift(newProduct);
    if (searchTerm.value) {
      filteredProducts.value.unshift(newProduct);
    } else {
      filteredProducts.value = products.value;
    }
    currentCategory.value = 'Категорія';
  } catch (e) {
    console.error("Error adding document: ", e);
  }
  product.value = {};
  isLoaded.value = false;
};

const updateData = async () => {
  try {
    const refDoc = doc(db, "products", product.value.id);
    await setDoc(refDoc, product.value, { merge: true });
    const index = products.value.findIndex(p => p.id === product.value.id);
    if (index !== -1) {
      products.value[index] = { ...product.value };
    }
    const filteredIndex = filteredProducts.value.findIndex(p => p.id === product.value.id);
    if (filteredIndex !== -1) {
      filteredProducts.value[filteredIndex] = { ...product.value };
    }
  } catch (error) {
    console.error(error);
  }
  editVisible.value = false;
  product.value = {};
};

const saveBrand = async () => {
  try {
    const brandsDocRef = doc(dataReg, 'brands');
    const brandsDocSnapshot = await getDoc(brandsDocRef);
    const brandsData = brandsDocSnapshot.exists() ? brandsDocSnapshot.data() : {};
    brandsData[brand.value] = {};
    await setDoc(brandsDocRef, brandsData);
    brand.value = "";
  } catch (e) {
    console.error("Error adding brand: ", e);
  }
};

const saveCountry = async () => {
  try {
    const countriesDocRef = doc(dataReg, 'countries');
    const countriesDocSnapshot = await getDoc(countriesDocRef);
    const countriesData = countriesDocSnapshot.exists() ? countriesDocSnapshot.data() : {};
    countriesData[country.value] = {};
    await setDoc(countriesDocRef, countriesData);
    country.value = "";
  } catch (e) {
    console.error("Error adding country: ", e);
  }
};

const deleteProduct = async (id) => {
  if (confirm("Видалити ?")) {
    try {
      await deleteDoc(doc(dataBase, id));
      // Remove from both arrays
      products.value = products.value.filter((product) => product.id !== id);
      filteredProducts.value = filteredProducts.value.filter((product) => product.id !== id);
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  }
};

const deleteBrand = async (brandId) => {
  if (confirm("Видалити ?")) {
    try {
      const brandsDocRef = doc(dataReg, 'brands');
      await updateDoc(brandsDocRef, {
        [brandId]: deleteField()
      });
    } catch (e) {
      console.error("Error deleting brand: ", e);
    }
  }
};

const deleteCountry = async (countryId) => {
  if (confirm("Видалити ?")) {
    try {
      const countriesDocRef = doc(dataReg, 'countries');
      await updateDoc(countriesDocRef, {
        [countryId]: deleteField()
      });
    } catch (e) {
      console.error("Error deleting country: ", e);
    }
  }
};

const uploadImage = (e) => {
  isLoading.value = true;
  const file = e.target.files[0];
  const storageRef = storageReference(storage, `products/${file.name}`);
  const uploadTask = uploadBytesResumable(storageRef, file);

  uploadTask.on(
    'state_changed',
    (snapshot) => { },
    (error) => { },
    () => {
      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
        isLoading.value = false;
        isLoaded.value = true;
        product.value.image = downloadURL;
      });
    }
  );
};

const fetchProducts = async () => {
  if (isLoading.value || !hasMore.value || isFiltered.value) return;
  isLoading.value = true;
  try {
    let baseQuery = query(
      dataBase,
      orderBy('name'),
      limit(batchSize)
    );
    if (lastDoc.value) {
      baseQuery = query(
        dataBase,
        orderBy('name'),
        startAfter(lastDoc.value),
        limit(batchSize)
      );
    }
    const snapshot = await getDocs(baseQuery);
    if (snapshot.empty) {
      hasMore.value = false;
      isLoading.value = false;
      return;
    }
    lastDoc.value = snapshot.docs[snapshot.docs.length - 1];
    const newProducts = snapshot.docs.map(doc => ({
      ...doc.data(),
      id: doc.id
    }));
    products.value = [...products.value, ...newProducts];
    if (!searchTerm.value) {
      filteredProducts.value = products.value;
    }
    hasMore.value = snapshot.docs.length === batchSize;
  } catch (error) {
    console.error("Error fetching products:", error);
    hasMore.value = false;
  } finally {
    isLoading.value = false;
  }
};

const handleScroll = async (e) => {
  const element = e.target;
  const nearBottom = element.scrollHeight - element.scrollTop <= element.clientHeight * 1.5;
  if (nearBottom && !isLoading.value && hasMore.value && !isFiltered.value) {
    await fetchProducts();
  }
};

onMounted(async () => {
  lastDoc.value = null;
  hasMore.value = true;
  products.value = [];
  filteredProducts.value = [];
  await fetchProducts();
  await fetchBrands();
  await fetchCountries();
});

const fetchBrands = async () => {
  try {
    const brandsDocRef = doc(dataReg, 'brands');
    onSnapshot(brandsDocRef, (snapshot) => {
      const brandsData = snapshot.data();
      const brandsArray = Object.keys(brandsData).map((brandName) => ({
        id: brandName,
        ...brandsData[brandName],
      }));
      brands.value = brandsArray;
    });
  } catch (e) { console.error("Error fetching brands: ", e); }
};

const fetchCountries = async () => {
  try {
    const countriesDocRef = doc(dataReg, 'countries');
    onSnapshot(countriesDocRef, (snapshot) => {
      const countriesData = snapshot.data();
      const countriesArray = Object.keys(countriesData).map((country) => ({
        id: country,
        ...countriesData[country],
      }));
      countries.value = countriesArray;
    });
  } catch (e) { console.error("Error fetching countries: ", e); }
};

const isSubmitDisabled = computed(() => {
  return requiredFields.value.some((field) => !product.value[field]) || isLoading.value;
});

const currentProduct = computed(() => {
  return products.value.find((product) => product.id === currentProduct.value);
});

const filteredProducts = ref([]);

// Add these new refs
const showNewOnly = ref(false);
const showHiddenOnly = ref(false);

// Add new ref for filtered mode
const isFiltered = ref(false);

// Update the computed property to correctly handle both isNew and hidden filters
const displayedProducts = computed(() => {
  if (!showNewOnly.value && !showHiddenOnly.value) {
    isFiltered.value = false;
    return products.value;
  }
  isFiltered.value = true;
  return filteredProducts.value;
});

// Add these toggle functions
const toggleNewFilter = async () => {
  showNewOnly.value = !showNewOnly.value;
  showHiddenOnly.value = false;

  if (showNewOnly.value) {
    isFiltered.value = true;
    isLoading.value = true;
    const allProducts = await fetchAllProducts();
    filteredProducts.value = allProducts.filter(p => p.isNew === true);
    isLoading.value = false;
  } else {
    isFiltered.value = false;
    filteredProducts.value = products.value;
  }
};

const toggleHiddenFilter = async () => {
  showHiddenOnly.value = !showHiddenOnly.value;
  showNewOnly.value = false;

  if (showHiddenOnly.value) {
    isFiltered.value = true;
    isLoading.value = true;
    const allProducts = await fetchAllProducts();
    filteredProducts.value = allProducts.filter(p => p.hidden === true);
    isLoading.value = false;
  } else {
    isFiltered.value = false;
    filteredProducts.value = products.value;
  }
};

// Add this new function
const fetchAllProducts = async () => {
  try {
    const q = query(dataBase);
    const querySnapshot = await getDocs(q);
    const allProducts = querySnapshot.docs.map(doc => ({
      ...doc.data(),
      id: doc.id
    }));
    return allProducts;
  } catch (error) {
    console.error("Error fetching all products:", error);
    return [];
  }
};

watch(searchTerm, async (newSearchTerm) => {
  if (!newSearchTerm) {
    await fetchProducts();
    filteredProducts.value = products.value;
    return;
  }
  const allProducts = await fetchAllProducts();
  const searchTerms = newSearchTerm.toLowerCase().split(' ');
  filteredProducts.value = allProducts.filter((product) => {
    return searchTerms.every((term) => {
      return (
        product.name.toLowerCase().includes(term) ||
        product.detail.toLowerCase().includes(term) ||
        product.brand.toLowerCase().includes(term)
      );
    });
  });
});

onMounted(async () => {
  await fetchProducts();
  filteredProducts.value = products.value;
  await fetchBrands();
  await fetchCountries();
});

const markUpPercent = computed(() => {
  const markupPercent = ((product.value.sellPrice - product.value.buyPrice) / product.value.buyPrice) * 100;
  return markupPercent.toFixed(2);
});

onMounted(async () => {
  await fetchProducts();
  await fetchBrands();
  await fetchCountries();
});


const togglePopular = async (productId) => {
  try {
    const productToUpdate = products.value.find(p => p.id === productId) ||
      filteredProducts.value.find(p => p.id === productId);
    if (productToUpdate) {
      const newPopularState = !productToUpdate.popular;
      await updateDoc(doc(dataBase, productId), { popular: newPopularState });
      const updateArrays = (arr) => {
        const index = arr.findIndex(p => p.id === productId);
        if (index !== -1) {
          arr[index] = { ...arr[index], popular: newPopularState };
        }
      };
      updateArrays(products.value);
      updateArrays(filteredProducts.value);
    }
  } catch (error) {
    console.error("Error updating product status:", error);
  }
};

const toggleNew = async (productId) => {
  try {
    const productToUpdate = products.value.find(p => p.id === productId) ||
      filteredProducts.value.find(p => p.id === productId);
    if (productToUpdate) {
      const newState = !productToUpdate.isNew;
      await updateDoc(doc(dataBase, productId), { isNew: newState });
      const updateArrays = (arr) => {
        const index = arr.findIndex(p => p.id === productId);
        if (index !== -1) {
          arr[index] = { ...arr[index], isNew: newState };
        }
      };
      updateArrays(products.value);
      updateArrays(filteredProducts.value);
    }
  } catch (error) {
    console.error("Error updating product status:", error);
  }
};

const toggleOutOfStock = async (productId) => {
  try {
    const productToUpdate = products.value.find(p => p.id === productId) ||
      filteredProducts.value.find(p => p.id === productId);
    if (productToUpdate) {
      const newState = !productToUpdate.outOfStock;
      await updateDoc(doc(dataBase, productId), { outOfStock: newState });
      const updateArrays = (arr) => {
        const index = arr.findIndex(p => p.id === productId);
        if (index !== -1) {
          arr[index] = { ...arr[index], outOfStock: newState };
        }
      };
      updateArrays(products.value);
      updateArrays(filteredProducts.value);
    }
  } catch (error) {
    console.error("Error updating product status:", error);
  }
};

const toggleNoBarCode = async (productId) => {
  try {
    const productToUpdate = products.value.find(p => p.id === productId) ||
      filteredProducts.value.find(p => p.id === productId);
    if (productToUpdate) {
      const newState = !productToUpdate.noBarCode;
      await updateDoc(doc(dataBase, productId), { noBarCode: newState });
      const updateArrays = (arr) => {
        const index = arr.findIndex(p => p.id === productId);
        if (index !== -1) {
          arr[index] = { ...arr[index], noBarCode: newState };
        }
      };
      updateArrays(products.value);
      updateArrays(filteredProducts.value);
    }
  } catch (error) {
    console.error("Error updating product status:", error);
  }
};

// Add this new function
const toggleHidden = async (productId) => {
  try {
    const productToUpdate = products.value.find(p => p.id === productId) ||
      filteredProducts.value.find(p => p.id === productId);
    if (productToUpdate) {
      const newState = !productToUpdate.hidden;
      await updateDoc(doc(dataBase, productId), { hidden: newState });
      const updateArrays = (arr) => {
        const index = arr.findIndex(p => p.id === productId);
        if (index !== -1) {
          arr[index] = { ...arr[index], hidden: newState };
        }
      };
      updateArrays(products.value);
      updateArrays(filteredProducts.value);
    }
  } catch (error) {
    console.error("Error updating product hidden status:", error);
  }
};

const selectedImage = ref("");
const imageEditorVisible = ref(false);
const selectedFileName = ref("");

const openImageEditor = (imageUrl) => {
  selectedImage.value = "";
  selectedFileName.value = "";
  imageEditorVisible.value = false;
  setTimeout(() => {
    const encodedPath = imageUrl.split('/').pop().split('?')[0];
    const originalFileName = decodeURIComponent(encodedPath.replace('products%2F', ''));
    selectedImage.value = imageUrl;
    selectedFileName.value = originalFileName;
    imageEditorVisible.value = true;
  }, 0);
};

const closeImageEditor = () => {
  imageEditorVisible.value = false;
  selectedImage.value = "";
};

const updateProductImage = async (imageBlob) => {
  try {
    isLoading.value = true;
    const imageRef = storageReference(storage, `products/${selectedFileName.value}`);
    const uploadTask = uploadBytesResumable(imageRef, imageBlob);
    uploadTask.on(
      'state_changed',
      null,
      (error) => {
        console.error('Error uploading:', error);
        isLoading.value = false;
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        const productToUpdate = products.value.find(p => p.image === selectedImage.value);
        if (productToUpdate) {
          await updateDoc(doc(dataBase, productToUpdate.id), {
            image: downloadURL
          });
          const updateArrays = (arr) => {
            const index = arr.findIndex(p => p.id === productToUpdate.id);
            if (index !== -1) {
              arr[index] = { ...arr[index], image: downloadURL };
            }
          };
          updateArrays(products.value);
          updateArrays(filteredProducts.value);
        }
        isLoading.value = false;
        imageEditorVisible.value = false;
      }
    );
  } catch (error) {
    console.error("Error updating image:", error);
    isLoading.value = false;
  }
};

const handleCroppedImage = async (croppedImageUrl) => {
  const response = await fetch(croppedImageUrl);
  const blob = await response.blob();
  uploadCroppedImage(blob);
};

const uploadCroppedImage = async (blob) => {
  try {
    isLoading.value = true;
    const filename = `products/${Date.now()}-${Math.random().toString(36).substring(7)}.jpg`;
    const storageRef = storageReference(storage, filename);
    const uploadTask = uploadBytesResumable(storageRef, blob);
    uploadTask.on(
      'state_changed',
      null,
      (error) => {
        console.error('Error uploading:', error);
        isLoading.value = false;
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        if (product.value.id) {
          await updateDoc(doc(dataBase, product.value.id), {
            image: downloadURL
          });
        }
        isLoading.value = false;
      }
    );
  } catch (error) {
    console.error("Error updating image:", error);
    isLoading.value = false;
  }
};

</script>

<template>

  <div class="products">

    <ImageEditor :image-url="selectedImage" :file-name="selectedFileName" :is-visible="imageEditorVisible"
      @close="closeImageEditor" @update="updateProductImage" @crop="handleCroppedImage" />

    <div v-if="editVisible || isVisible" class="addproduct">
      <div class="top-inputs">
        <div id="group2">
          <div id="group1">
            <input type="text" v-model="product.name" placeholder="Назва товару" />
            <input type="text" v-model="product.detail" placeholder="Опис" />
          </div>

          <div class="file-upload">
            <input type="file" @change="uploadImage" />
            <div :class="{ 'loading': isLoading, 'loaded': isLoaded }">
              <span v-if="isLoading">
                <div class="dot-spinner">
                  <div class="dot-spinner__dot"></div>
                  <div class="dot-spinner__dot"></div>
                  <div class="dot-spinner__dot"></div>
                  <div class="dot-spinner__dot"></div>
                  <div class="dot-spinner__dot"></div>
                  <div class="dot-spinner__dot"></div>
                  <div class="dot-spinner__dot"></div>
                  <div class="dot-spinner__dot"></div>
                </div>
              </span>
              <span v-else-if="isLoaded"><img class="btnimg" src="../assets/imgs/icons/done.svg" alt="icon" /></span>
              <span v-else><img class="btnimg" src="../assets/btnimg.png" alt="icon" /></span>
            </div>
          </div>
        </div>

        <div id="group3">
          <input type="number" v-model="product.buyPrice" placeholder="Ціна Купівлі" />
          <input type="number" v-model="product.sellPrice" placeholder="Ціна Продажу" />
          <div class="markUp"> Націнка: {{ markUpPercent }}%</div>
        </div>
      </div>

      <div class="textareas">
        <textarea type="text" v-model="product.description" placeholder="Опис"></textarea>
        <textarea type="text" v-model="product.sklad" placeholder="Склад"></textarea>
      </div>
      <div class="midle-inputs">
        <input type="checkbox" id="liquid" name="liquid" v-model="product.liquid">
        <label for="liquid">Рідина</label>
        <input v-if="product.liquid" type="text" v-model="product.weight" placeholder="Об'єм" />
        <input v-else type="text" v-model="product.weight" placeholder="Вага" />
        <input type="number" v-model="product.kcal" placeholder="Kcal" />
        <input type="number" v-model="product.fat" placeholder="Жири" />
        <input type="number" v-model="product.carbo" placeholder="Вуглеводи" />
        <input type="number" v-model="product.protein" placeholder="Білки" />
      </div>
      <input style="width: 70vw;" type="text" v-model="product.vitamins" placeholder="Вітаміни" />
      <div class="selects">
        <form>
          <input v-model="product.country" placeholder="Країна" list="countries" name="country" id="country">
          <datalist id="countries">
            <option v-for="country in countries" :value="country.id">{{ country.id }}</option>
          </datalist>
        </form>

        <form>
          <input v-model="product.brand" placeholder="Бренд" list="brands" name="brand" id="brand">
          <datalist id="brands">
            <option v-for="brand in brands" :value="brand.id">{{ brand.id }}</option>
          </datalist>
        </form>

        <div class="button" @click="fetchCategories">
          <div>{{ product.category || currentCategory }}</div>
        </div>
        <div v-if="categoryModal" class="categoryModal">
          <div>
            <div v-for="category in categories" :key="category.id">
              {{ category.id }}
              <div v-for="(subcategory, index) in subcategories[category.id]" :key="index"
                @click="() => selectSubCategory(subcategory)">
                {{ subcategory }}
              </div>
            </div>
          </div>
          <button style="width: 200px; height: 50px" @click="closeCategoryModal">Закрити</button>
        </div>
      </div>
      <div>
        <input type="checkbox" class="checkbox" id="gluten" v-model="product.freeGluten" />
        <label for="gluten">Free gluten</label>
        <input type="checkbox" class="checkbox" id="sugar" v-model="product.freeSugar" />
        <label for="sugar">Free Sugar</label>
        <input type="checkbox" class="checkbox" id="lactosa" v-model="product.freeLactosa" />
        <label for="lactosa">Free lactosa</label>
        <input type="checkbox" class="checkbox" id="vegan" v-model="product.vegan" />
        <label for="vegan">Vegan</label>
        <input type="checkbox" class="checkbox" id="protein" v-model="product.proteinik" />
        <label for="protein">Protein</label>
      </div>
      <div>
        <button :disabled="isSubmitDisabled" v-if="isVisible" @click="saveData">Зберегти</button>
        <button v-if="isVisible" @click="toggleModal">Закрити</button>
        <button v-if="editVisible" @click="saveData">Дублювати</button>
        <button v-if="editVisible" @click="updateData">Оновити</button>
        <button v-if="editVisible" @click="closeModal">Закрити</button>
      </div>
    </div>

    <div v-if="brandsMenu">
      <div class="menu">
        <input type="text" v-model="brand" @keyup.enter="saveBrand()" placeholder="Новий Бренд" />
        <div class="menu-table">
          <div v-for="brand in brands" :key="brand.id">
            <div> {{ brand.id }}
              <div class="deleteButton" @click="deleteBrand(brand.id)">
                <img src="../assets/imgs/icons/delete.svg" alt="">
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="menu-container" @click="showBrands">
      </div>
    </div>

    <div v-if="categoryMenu">
      <div class="menu">
        <ul v-for="category in categories" :key="category">
          <li @click="fetchSubCategory(category.id)">{{ category.id }}</li>
        </ul>
        <div class="sub-category-menu" v-if="showSubCategory">
          <input placeholder="Нова суб-категорія" type="text" v-model="newItemValue"
            @keyup.enter="addItem(currentCategory, newItemValue)">
          <div>
            <div v-for="(item, index) in items" :key="index"> {{ item }}
              <div class="deleteButton" @click="deleteItem(currentCategory, index)"><img
                  src="../assets/imgs/icons/delete.svg" alt=""></div>
            </div>
          </div>
          <button @click="closeMenu()">Закрити</button>
        </div>
      </div>
      <div class="menu-container" @click="showCategory"></div>
    </div>

    <div v-if="countryMenu">
      <div class="menu">
        <input type="text" v-model="country" @keyup.enter="saveCountry()" placeholder="Новий Країна" />
        <div class="menu-table">
          <div v-for="country in countries">
            <div> {{ country.id }}
              <div class="deleteButton" @click="deleteCountry(country.id)">
                <img src="../assets/imgs/icons/delete.svg" alt="">
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="menu-container" @click="showCountry"></div>
    </div>

    <div class="productlist">
      <div class="list-header">
        <button @click="toggleModal">Створити</button>
        <div class="center-flex">
          <button class="filter-button" :class="{ 'active': showNewOnly }" @click="toggleNewFilter">
            Нові
          </button>
          <button class="filter-button" :class="{ 'active': showHiddenOnly }" @click="toggleHiddenFilter">
            Приховані
          </button>
          <input class="searchInput" v-model="searchTerm" placeholder="Пошук" />
          <button class="hiden-for-mobiles" @click="showBrands">Бренди</button>
          <button class="hiden-for-mobiles" @click="showCategory">Категорії</button>
          <button class="hiden-for-mobiles" @click="showCountry">Країни</button>
        </div>
      </div>
      <table class="fixed_headers">
        <thead>
          <tr>
            <th></th>
            <th>Назва</th>
            <th>Бренд</th>
            <th>Категорія</th>
            <th>Ціна</th>
            <th>Зміни</th>
          </tr>
        </thead>
        <tbody @scroll="handleScroll">
          <tr class="tableline" @dblclick="editModal(product.id)" v-for="product in displayedProducts" :key="product.id"
            :class="{ 'hidden-product': product.hidden }">
            <td>
              <img class="productImage" :src="product.image" @click="openImageEditor(product.image)" />
            </td>
            <td v-bind:title="product.name">{{ product.name }}</td>
            <td v-bind:title="product.brand">{{ product.brand }}</td>
            <td class="hiden-for-mobiles" v-bind:title="product.category">{{ product.category }}</td>
            <td class="hiden-for-mobiles" v-bind:title="product.sellPrice">{{ product.sellPrice }}</td>
            <td>
              <div style="display: inline-flex;">
                <div class="status-button" :class="{ 'active': product.isNew }" @click="toggleNew(product.id)"
                  :title="'top'">New</div>
                <div class="status-button" :class="{ 'active': product.popular }" @click="togglePopular(product.id)"
                  :title="'top'">Top</div>
                <div class="status-button" :class="{ 'active': product.outOfStock }"
                  @click="toggleOutOfStock(product.id)" :title="'stock'">Stock</div>
                <div class="status-button" :class="{ 'active': product.noBarCode }" @click="toggleNoBarCode(product.id)"
                  :title="'barcode'">POS</div>
                <div class="status-button" :class="{ 'active': product.hidden }" @click="toggleHidden(product.id)"
                  :title="'hidden'">Hide</div>
                <div class="deleteButton" @click="deleteProduct(product.id)">
                  <img src="../assets/imgs/icons/delete.svg" alt="">
                </div>
              </div>
            </td>
          </tr>
          <tr v-if="isLoading">
            <td colspan="6" style="text-align: center;">
              <div class="dot-spinner">
                <div class="dot-spinner__dot"></div>
                <div class="dot-spinner__dot"></div>
                <div class="dot-spinner__dot"></div>
                <div class="dot-spinner__dot"></div>
                <div class="dot-spinner__dot"></div>
                <div class="dot-spinner__dot"></div>
                <div class="dot-spinner__dot"></div>
                <div class="dot-spinner__dot"></div>
              </div>
            </td>
          </tr>
          <tr v-if="!hasMore && products.length > 0">
            <td colspan="6" style="text-align: center;">
              No more products to load
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>


<style scoped>
/* Base container styling */
.products-container {
  padding: 2rem;
  background-color: white;
}

/* Card styling */
.product-card {
  padding: 1rem;
  border-radius: 15px;
  background: white;
  box-shadow:
    8px 8px 15px #a3b1c6,
    -8px -8px 15px #ffffff;
  transition: transform 0.2s;
}

.product-card:hover {
  transform: translateY(-5px);
}

/* Button styling */
.neo-button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 8px;
  background: white;
  box-shadow:
    5px 5px 10px #a3b1c6,
    -5px -5px 10px #ffffff;
  cursor: pointer;
  transition: all 0.2s;
}

.neo-button:active {
  box-shadow:
    inset 5px 5px 10px #a3b1c6,
    inset -5px -5px 10px #ffffff;
}

/* Input styling */
.neo-input {
  padding: 0.8rem;
  border: none;
  border-radius: 8px;
  background: white;
  box-shadow:
    inset 5px 5px 10px #a3b1c6,
    inset -5px -5px 10px #ffffff;
  font-size: 1rem;
}

/* Modal styling */
.modal-overlay {
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

.modal-content {
  background: white;
  border-radius: 25px;
  padding: 2rem;
  width: 500px;
  max-width: 90%;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

/* Delete button styling */
.delete-btn {
  padding: 0.5rem;
  background: #fff0f0;
  color: #dc3545;
  transition: all 0.2s;
}

.delete-btn:hover {
  background: #ffe0e0;
}

/* Form group styling */
.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
}

/* Grid layout */
.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1.5rem;
}

/* Close button */
.close-btn {
  font-size: 1.5rem;
  padding: 0.5rem 1rem;
}

/* Action buttons container */
.action-buttons {
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
  margin-top: 1rem;
}

.status-button {
  display: flex;
  align-items: center;
  background-color: rgb(245, 245, 245);
  box-shadow: 0 3px 3px rgba(116, 116, 116, 0.5);
  border: solid 0px;
  border-radius: 25px;
  padding: 0.3vw;
  cursor: pointer;
}

.active {
  display: flex;
  align-items: center;
  background-color: rgb(228, 228, 228);
  box-shadow: 0 3px 3px rgba(116, 116, 116, 0.5);
  border: solid 2px;
  border-radius: 25px;
  padding: 0.3vw;
}

.categoryModal {
  position: absolute;
  z-index: 20;
  height: 500px;
  width: 500px;
  background-color: #ffffff;
  border: solid 3px rgb(168, 168, 168);
  border-radius: 25px;
  padding: 4vh;
  gap: 2vw;
  top: 15%;
  left: 25%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  background-color: rgb(245, 245, 245);

  >div {
    align-content: space-between;
    justify-content: center;
    display: flex;
    flex-wrap: wrap;
    gap: 15px;

    >div {
      font-weight: bold;
      background-color: #fff;
      padding: 10px;
      text-align: center;
      border-radius: 25px;


      >div {
        font-weight: normal;
        margin: 5px;
        color: #183153;
        cursor: pointer;
        width: 150px;
        transition: 0.5s;
        text-align: center;

        &:hover {
          background-color: antiquewhite;
          border-radius: 25px;
        }
      }
    }
  }
}

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
  z-index: 1000;
  /* Add this line */
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

  #group1 {
    input {
      &:first-child {
        width: 20vw;
      }
    }
  }

  #group2 {
    display: flex;
    align-items: center;
  }


  #group3 {
    display: flex;

    input {
      width: 10vw;
    }
  }
}

.midle-inputs {
  display: flex;
  align-items: center;

  input[type="checkbox"] {
    width: auto;
    height: auto;
  }

  input {
    width: 10vw;
  }
}

textarea {
  width: 35vw;
  height: 30vh;
  resize: none;
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

button,
.button,
select {
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

.center-flex {
  display: flex;
  align-items: center;
}

.checkbox {
  height: 15px;
  width: 15px;
  box-shadow: none;
}

.file-upload {
  height: 40px;
  width: 40px;
  border-radius: 50px;
  border: none;
  box-shadow: 4px 4px 4px rgb(200, 200, 200), -4px -4px 4px rgb(255, 255, 255);
  display: flex;
  align-items: center;
  justify-content: center;

  input[type="file"] {
    height: 40px;
    width: 40px;
    position: absolute;
    opacity: 0;
  }

  button {
    border: none;
    cursor: pointer;
    transition: background-color 0.3s, transform 0.2s;
  }

  button.loading {
    cursor: not-allowed;
  }

  button.loaded {
    cursor: default;
  }
}

.file-upload:hover {
  transition: 0.3s;
  box-shadow: 0px 1px 1px rgba(0, 0, 0, 0.3);
}

.btnimg {
  height: 20px;
  width: 20px;
}

label {
  width: 50px;
  margin-right: 5px;
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
  position: relative;
  /* Add this line */
  z-index: 1;
  /* Add this line */
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
    width: 30%;
  }

  td:nth-child(3),
  th:nth-child(3) {
    width: 10%;
  }

  td:nth-child(4),
  th:nth-child(4) {
    width: 10%;
  }

  td:nth-child(5),
  th:nth-child(5) {
    width: 5%;
  }

  td:nth-child(6),
  th:nth-child(6) {
    width: 20%;
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

.hidden-product {
  opacity: 0.5;
  position: relative;
  /* Add this line */
  z-index: 1;
  /* Add this line */
}

.menu-container {
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  width: 100%;
  height: 100%;
}

.menu {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 5;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  height: 70vh;
  width: 25vw;
  background-color: rgb(255, 255, 255);
  box-shadow: 0px 5px 7px rgba(0, 0, 0, 0.3), inset 0 0 0 rgba(0, 0, 0, 0.3);
  border-radius: 25px;

  ul {
    list-style-type: none;
    padding-left: 0;
  }

  li {
    width: 20vw;
    height: 6vh;
    box-shadow: 0px 5px 7px rgba(0, 0, 0, 0.3), inset 0 0 0 rgba(0, 0, 0, 0.3);
    border-radius: 25px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: 2.2vh;
  }
}

.sub-category-menu {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  background-color: #fff;
  height: 70vh;
  width: 25vw;
  border-radius: 25px;
  border: none;

  >div {
    height: 60vh;
    width: 23vw;

    >div {
      display: flex;
      align-items: center;
      justify-content: space-between;
      background-color: #dbdbdb;
      margin: 2px;
      padding: 2px 20px;
      border-radius: 25px;
    }
  }
}

.menu-table {
  overflow: scroll;


  >div {
    width: 20vw;
    background-color: rgb(241, 239, 239);
    border-radius: 25px;
    padding: 5px 15px;
    margin: 3px;
    font-size: 2vh;

    >div {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  }

  &::-webkit-scrollbar {
    display: none;
  }

}

.dot-spinner {
  --uib-size: 1.3vw;
  --uib-speed: .9s;
  --uib-color: #183153;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  height: var(--uib-size);
  width: var(--uib-size);
}

.dot-spinner__dot {
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  height: 100%;
  width: 100%;
}

.dot-spinner__dot::before {
  content: '';
  height: 20%;
  width: 20%;
  border-radius: 50%;
  background-color: var(--uib-color);
  transform: scale(0);
  opacity: 0.5;
  animation: pulse0112 calc(var(--uib-speed) * 1.111) ease-in-out infinite;
  box-shadow: 0 0 20px rgba(18, 31, 53, 0.3);
}

.dot-spinner__dot:nth-child(2) {
  transform: rotate(45deg);
}

.dot-spinner__dot:nth-child(2)::before {
  animation-delay: calc(var(--uib-speed) * -0.875);
}

.dot-spinner__dot:nth-child(3) {
  transform: rotate(90deg);
}

.dot-spinner__dot:nth-child(3)::before {
  animation-delay: calc(var(--uib-speed) * -0.75);
}

.dot-spinner__dot:nth-child(4) {
  transform: rotate(135deg);
}

.dot-spinner__dot:nth-child(4)::before {
  animation-delay: calc(var(--uib-speed) * -0.625);
}

.dot-spinner__dot:nth-child(5) {
  transform: rotate(180deg);
}

.dot-spinner__dot:nth-child(5)::before {
  animation-delay: calc(var(--uib-speed) * -0.5);
}

.dot-spinner__dot:nth-child(6) {
  transform: rotate(225deg);
}

.dot-spinner__dot:nth-child(6)::before {
  animation-delay: calc(var(--uib-speed) * -0.375);
}

.dot-spinner__dot:nth-child(7) {
  transform: rotate(270deg);
}

.dot-spinner__dot:nth-child(7)::before {
  animation-delay: calc(var(--uib-speed) * -0.25);
}

.dot-spinner__dot:nth-child(8) {
  transform: rotate(315deg);
}

.dot-spinner__dot:nth-child(8)::before {
  animation-delay: calc(var(--uib-speed) * -0.125);
}

@keyframes pulse0112 {

  0%,
  100% {
    transform: scale(0);
    opacity: 0.5;
  }

  50% {
    transform: scale(1);
    opacity: 1;
  }
}

.selects {
  display: flex;
}

.filter-button {
  min-width: 100px;
  margin: 0 5px;
  padding: 5px 10px;
  background-color: rgb(245, 245, 245);
  transition: all 0.3s ease;
}

.filter-button.active {
  background-color: #183153;
  color: white;
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

    #group1 {
      display: flex;
      flex-direction: column;

      input {
        width: 60vw;
        height: 3vh;

        &:first-child {
          width: 60vw;
        }
      }
    }

    #group3 {
      display: flex;

      input {
        width: 30vw;
        margin: 1vh;
      }
    }

    #group2 {
      display: flex;
      align-items: center;
      justify-content: space-around;
      width: 100%;
    }
  }

  .midle-inputs {
    display: flex;
    justify-content: space-around;
    width: 100%;

    input {
      width: 20%;
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

  .textareas {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;

    textarea {
      width: 95%;
    }

    textarea:last-child {
      height: 15vh;
    }
  }

  .selects {
    display: flex;
    justify-content: space-between;
    width: 100%;

    select {
      width: 30%;
    }
  }
}
</style>
