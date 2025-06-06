<script setup>
import { ref, computed } from "vue";
import { storage } from "../main";
import { ref as storageReference, uploadBytesResumable, getDownloadURL } from "firebase/storage";

const props = defineProps({
    product: {
        type: Object,
        required: true
    },
    isVisible: {
        type: Boolean,
        required: true
    },
    editVisible: {
        type: Boolean,
        required: true
    },
    currentCategory: {
        type: String,
        required: true
    },
    categories: {
        type: Array,
        required: true
    },
    subcategories: {
        type: Object,
        required: true
    }
});

const emit = defineEmits(['update:product', 'save', 'update', 'close', 'toggle', 'fetch-categories']);

const isLoading = ref(false);
const isLoaded = ref(false);

const requiredFields = ref([
    "name", "detail", "sellPrice", "buyPrice", "description", "sklad", "kcal",
    "protein", "carbo", "fat", "brand", "country", "image", "weight", "vitamins"
]);

const isSubmitDisabled = computed(() => {
    return requiredFields.value.some((field) => !props.product[field]) || isLoading.value;
});

const markUpPercent = computed(() => {
    const markupPercent = ((props.product.sellPrice - props.product.buyPrice) / props.product.buyPrice) * 100;
    return markupPercent.toFixed(2);
});

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
                emit('update:product', { ...props.product, image: downloadURL });
            });
        }
    );
};

const categoryModal = ref(false);

const toggleCategoryModal = () => {
    categoryModal.value = !categoryModal.value;
};

const selectSubCategory = (subcategory) => {
    emit('update:product', { ...props.product, category: subcategory });
    categoryModal.value = false;
};
</script>

<template>
    <div class="addproduct">
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
                        <span v-else-if="isLoaded"><img class="btnimg" src="../assets/imgs/icons/done.svg"
                                alt="icon" /></span>
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
            <textarea v-model="product.description" placeholder="Опис"></textarea>
            <textarea v-model="product.sklad" placeholder="Склад"></textarea>
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

        <div style="display: flex;">
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

            <div class="button" @click="toggleCategoryModal">
                <div>{{ product.category || currentCategory }}</div>
            </div>

            <div v-if="categoryModal" class="categoryModal">
                <div>
                    <div v-for="category in categories" :key="category.id">
                        {{ category.id }}
                        <div v-for="(subcategory, index) in subcategories[category.id]" :key="index"
                            @click="selectSubCategory(subcategory)">
                            {{ subcategory }}
                        </div>
                    </div>
                </div>
                <button style="width: 200px; height: 50px" @click="toggleCategoryModal">Закрити</button>
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
            <button :disabled="isSubmitDisabled" v-if="isVisible" @click="$emit('save')">Зберегти</button>
            <button v-if="isVisible" @click="$emit('toggle')">Закрити</button>
            <button v-if="editVisible" @click="$emit('save')">Дублювати</button>
            <button v-if="editVisible" @click="$emit('update')">Оновити</button>
            <button v-if="editVisible" @click="$emit('close')">Закрити</button>
        </div>
    </div>
</template>

<style scoped>
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
    z-index: 9999;
    /* High z-index for the add product modal */
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
</style>