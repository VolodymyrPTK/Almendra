<template>
    <div class="modal" v-if="visible">
        <div class="modal-container">
            <div class="inputs">
                <input type="text" v-model="product.name" placeholder="Назва товару">
                <input type="text" v-model="product.detail" placeholder="Деталі">
                <input type="number" v-model="product.sellPrice" placeholder="Ціна">
            </div>
            <textarea type="text" v-model="product.description" placeholder="Опис"></textarea>
            <textarea type="text" v-model="product.sklad" placeholder="Склад"></textarea>
            <div class="inputs">
                <div>
                    <div class="kcal">
                        <input type="number" v-model="product.kcal" placeholder="kcal">
                        <input type="number" v-model="product.fat" placeholder="жири">
                        <input type="number" v-model="product.carbo" placeholder="вуглеводи">
                        <input type="number" v-model="product.protein" placeholder="білки">
                        <input type="text" v-model="product.vitamins" placeholder="вітаміни">
                    </div>
                    <div class="kcal">
                        <select v-model="product.country">
                            <option disabled value="">Країна</option>
                            <option v-for="country in countries" :value="country.id">{{ country.id }}</option>
                        </select>
                        <select v-model="product.brand">
                            <option disabled value="">Бренд</option>
                            <option v-for="brand in brands" :value="brand.id">{{ brand.id }}</option>
                        </select>
                        <select class="menus" v-model="product.category">
                            <option disabled value="">Категорія</option>
                            <option v-for="category in categories" :value="category.id">{{ category.id }}</option>
                        </select>
                        <div class="file-upload">
                            <input type="file" @change="uploadImage" />
                            <img class="btnimg" src="../assets/btnimg.png" alt="icon">
                        </div>
                    </div>
                </div>
            </div>
            <div class="chekBoxes">
                <input type="checkbox" class="checkbox" v-model="product.freeGluten" />
                <label for="checkbox">Free gluten</label>
                <input type="checkbox" class="checkbox" v-model="product.freeSugar" />
                <label for="checkbox">Free sugar</label>
                <input type="checkbox" class="checkbox" v-model="product.freeLactosa" />
                <label for="checkbox">Free lactosa</label>
                <input type="checkbox" class="checkbox" v-model="product.vegan" />
                <label for="checkbox">Vegan</label>
                <input type="checkbox" class="checkbox" v-model="product.raw" />
                <label for="checkbox">Raw</label>
                <input type="checkbox" class="checkbox" v-model="product.protein" />
                <label for="checkbox">Protein</label>
            </div>
            <div class="modal-buttons">
                <button class="productbutton" @click="updateData()">Зберегти</button>
                <button class="productbutton" @click="close">Close</button>
            </div>
        </div>
    </div>
</template>

<script>
import { updateDoc, doc } from "firebase/firestore";
import { db } from '../main';

export default {
    name: 'Modal',
    props: {
        visible: Boolean,
        product: Object,
        brands: Array,
        categories: Array,
        countries: Array
    },
    methods: {
        async updateData() {
            try {
                const refDoc = doc(db, "products", this.product.id);
                await updateDoc(refDoc, {
                    name: this.product.name,
                    detail: this.product.detail,
                    sellPrice: this.product.sellPrice,
                    description: this.product.description,
                    sklad: this.product.sklad,
                    kcal: this.product.kcal,
                    protein: this.product.protein,
                    carbo: this.product.carbo,
                    fat: this.product.fat,
                    brand: this.product.brand,
                    category: this.product.category,
                    country: this.product.country,
                    image: this.product.image,
                    vitamins: this.product.vitamins,
                    freeGluten: this.product.freeGluten,
                    freeSugar: this.product.freeSugar,
                    freeLactosa: this.product.freeLactosa,
                    vegan: this.product.vegan,
                    raw: this.product.raw,
                    protein: this.product.protein
                });
            } catch (error) {
                console.error(error);
            };
            this.$emit('close');
        },
        close() {
            this.$emit('close');
        }
    }
};
</script>

<style lang="scss" scoped>
.modal {
    position: absolute;
    display: flex;
    left: 0;
    top: 0;
    background-color: rgba(0, 0, 0, 0.3);
    height: 100%;
    width: 100%;
    justify-content: center;
    align-items: center;
    backdrop-filter: blur(15px);
}

.modal-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: rgba(255, 238, 217, 0.5);
    padding: 15px;
    border-radius: 25px;
    box-shadow: 0 15px 15px rgba(0, 0, 0, 0.4),
        0 -1px 20px rgba(0, 0, 0, 0.2);
}

.modal-buttons {
    display: flex;
}

input {
    border-radius: 25px;
    border: none;
    margin: 5px;
    padding: 7px;
    box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.5);
}

select {
    border-radius: 25px;
    border: none;
    margin: 5px;
    padding: 7px;
    box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.5);
}

textarea {
    text-align: center;
    font-family: 'roboto', sans-serif;
    width: 90%;
    max-width: 90%;
    min-width: 50%;
    height: 200px;
    padding: 15px;
    margin: 10px;
    max-height: 300px;
    min-height: 200px;
    border-radius: 25px;
    border: none;
    box-shadow: 4px 4px 4px rgb(200, 200, 200) inset, -4px -4px 4px rgb(255, 255, 255) inset;
}

.productbutton {
    font-family: 'roboto', sans-serif;
    font-size: 15px;
    text-align: center;
    border: none;
    border-radius: 25px;
    width: 200px;
    padding: 13px 13px 13px 13px;
    margin: 10px;
    box-shadow: 0px 5px 15px rgb(0, 0, 0, 0.5);
    background-color: white;
    transition: 0.3s;
    text-decoration: none;
    color: black;
    cursor: pointer;
}

.productbutton:hover {
    transition: 0.3s;
    box-shadow: 0px 1px 1px rgba(0, 0, 0, 0.3), inset 0px 0px 0px rgba(0, 0, 0, 0.3);
}

.productbutton:active {
    box-shadow: 0px 0px 0px rgba(0, 0, 0, 0.3), inset 0px 3px 5px rgba(0, 0, 0, 0.3);
    transition: 0.1s;
}

.chekBoxes {
    display: flex;
}

.checkbox {
    height: 15px;
    width: 15px;
    box-shadow: none;
}

.file-upload {
    height: 40px;
    width: 40px;
    border-radius: 25px;
    border: none;
    box-shadow: 0px 5px 5px rgb(0, 0, 0, 0.5);
    background-color: white;
    margin: 0 5px 0 5px;
    display: flex;
    align-items: center;
    justify-content: center;

    input[type='file'] {
        height: 40px;
        width: 40px;
        position: absolute;
        opacity: 0;
    }
}

.file-upload:hover {
    transition: 0.3s;
    box-shadow: 0px 1px 1px rgba(0, 0, 0, 0.3);
}

.btnimg {
    height: 20px;
}

label {
    width: 60px;
}

.kcal {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 10px;
}
</style>