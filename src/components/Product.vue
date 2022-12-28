<template>
    <div class="container" v-for="product in products">
        <div class="cards">
            <img class="productImage" :src="product.image">
            <h2> {{ product.price }} грн </h2>
            <AddToCart :product-id="product.id" :price="product.price" :name="product.name">
            </AddToCart>
        </div>
        <div id="card-2" class="cards">
            <div>
                <h1> {{ product.name }} </h1>
                <h2> {{ product.detail }}</h2>
                <h2> {{ product.brand }} </h2>
                <p> {{ product.description }} </p>
                <p> {{ product.sklad }} </p>
                <div class="lables-row">
                    <img class="diet-lable" v-if="product.freeGluten == true"
                        src="https://firebasestorage.googleapis.com/v0/b/almendra-a411d.appspot.com/o/icons%2Fgluten.png?alt=media&token=9440b903-9314-404e-86b0-1f173ce75460"
                        alt="без глютену">
                    <img class="diet-lable" v-if="product.freeSugar == true"
                        src="https://firebasestorage.googleapis.com/v0/b/almendra-a411d.appspot.com/o/icons%2Fsugar.png?alt=media&token=397d0c8c-db6e-45ba-8e40-4080175c4cde"
                        alt="без цукру">
                    <img class="diet-lable" v-if="product.freeLactosa == true"
                        src="https://firebasestorage.googleapis.com/v0/b/almendra-a411d.appspot.com/o/icons%2Flacto.png?alt=media&token=9b56de62-5fb1-4b2f-8a97-ecc1adbfbb9c"
                        alt="без лактози">
                    <img class="diet-lable" v-if="product.vegan == true"
                        src="https://firebasestorage.googleapis.com/v0/b/almendra-a411d.appspot.com/o/icons%2Fvegan.png?alt=media&token=95204665-ddb2-457e-b785-b1d062f3cdd5"
                        alt="веган">
                    <img class="diet-lable" v-if="product.raw == true"
                        src="https://firebasestorage.googleapis.com/v0/b/almendra-a411d.appspot.com/o/icons%2Fraw.png?alt=media&token=6c35501b-5854-4f0f-8155-e3a7d08f8740"
                        alt="raw">
                </div>
            </div>
        </div>
        <div id="card-3" class="cards">
            <h2>Характеристики</h2>
            <div class="kcal">
                <div class="kcal-items">
                    <p>Вага:</p>
                    <p>{{ product.detail }}</p>
                </div>
                <div class="kcal-items">
                    <p>Кілокалорії:</p>
                    <p>{{ product.kcal }}</p>
                </div>
                <div class="kcal-items">
                    <p>Вуглеводи:</p>
                    <p>{{ product.carbo }}</p>
                </div>
                <div class="kcal-items">
                    <p>Білки:</p>
                    <p>{{ product.protein }}</p>
                </div>
                <div class="kcal-items">
                    <p>Жири:</p>
                    <p>{{ product.fat }}</p>
                </div>
                <div class="kcal-items">
                    <p>Країна походження:</p>
                    <p>{{ product.madeIn }}</p>
                </div>
                <div class="kcal-items">
                    <p>Вітаміни:</p>
                    <p>{{ product.vitamins }}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { dataBase } from '../main';
import { doc, getDoc } from "firebase/firestore";
import AddToCart from '../components/AddToCart.vue';

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
                sklad: '',
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
    },
    components: { AddToCart }
}
</script>

<style scoped lang="scss">
.container {
    display: flex;
    align-items: stretch;
}

.cards {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    background-color: #f0f0f0;
    border-radius: 25px;
    margin: 10px;
    box-shadow: 0 15px 15px rgba(0, 0, 0, 0.4), 0 -1px 20px rgba(0, 0, 0, 0.2);
    background-color: rgba(253, 253, 253, 0.75);
    border: 1px solid rgba(255, 255, 255, 0.125);
}

#card-1 {
    width: 30%;
}

#card-2 {
    padding: 0 50px 0 50px;
    width: 50%;
}

#card-3 {
    height: 50%;
    padding: 10px;
    width: 20%;
}

.productImage {
    height: 550px;
    filter: drop-shadow(0 55px 40px rgba(0, 0, 0, 0.75));
}

.kcal {
    display: flex;
    flex-direction: column;
}

.kcal-items {
    display: flex;
    justify-content: space-between;
}

.diet-lable {
    height: 200px;
    margin: 10px;
}

.lables-row {
    display: flex;
    justify-content: end;
}

p {
    font-size: 24px;
    font-family: Arial, Helvetica, sans-serif;
    margin: 10px;
    color: rgba(40, 72, 49, 1);
}
</style>