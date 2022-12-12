<template>
    <div class="container" v-for="product in products">
        <div class="cards">
            <img class="productImage" :src="product.image">
        </div>
        <div class="cards">
            <h1> {{ product.name }} </h1>
            <h1> {{ product.price }} </h1>
        </div>
        <div class="cards">
            <h3>Характеристики</h3>
            <div class="kcal">
                <ul>
                    <li>Кілокалорії</li>
                    <li>Вуглеводи</li>
                    <li>Білки</li>
                    <li>Жири</li>
                    <li>Країна походження</li>
                </ul>
                <ul>
                    <li>{{ product.kcal }}</li>
                    <li>{{ product.carbo }}</li>
                    <li>{{ product.protein }}</li>
                    <li>₴ {{ product.fat }}</li>
                    <li>₴ {{ product.madeIn }}</li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
import { dataBase } from '../main';
import { doc, getDoc } from "firebase/firestore";

export default {
    name: "Product",
    props: {
        msg: String
    },
    data() {
        return {
            products: [],
            product: {
                name: '',
                id: this.$route.params.id,
                detail: '',
                price: '',
                description: '',
                kcal: '',
                protein: '',
                carbo: '',
                fat: '',
                madeIn: '',
                brand: '',
                category: '',
                image: '',
                freeGluten: false,
                freeSugar: false,
                freeLactosa: false,
                vegan: false,
                raw: false
            }
        };
    },
    created() {
        const docRef = doc(dataBase, this.product.id);
        getDoc(docRef)
            .then((doc) => {
                this.products.push({ ...doc.data(), id: doc.id })
            })
    }
}
</script>

<style scoped lang="scss">
.container {
    display: flex;
}

.cards {
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: #f0f0f0;
    border-radius: 25px;
    margin: 10px;
    box-shadow: 0 10px 10px grey;
}

.productImage {
    height: 550px;
}

.kcal {
    display: flex;
}

ul {
    list-style-type: none;

}
</style>