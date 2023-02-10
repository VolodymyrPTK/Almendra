<template>
    <div class="modal" v-if="visible">
        <div class="modal-container">
            <div class="inputs">
                <h3> {{ product.name }}</h3>
                <h5>Загальні затрати: {{ spent }}</h5>
                <h5>Загальна вартість: {{ value }}</h5>
                <label for="buy">Ціна Купівлі</label>
                <input id="buy" type="number" v-model="product.buyPrice" placeholder="Ціна Купівлі"><br>
                <label for="sell">Ціна Продажу</label>
                <input id="sell" type="number" v-model="product.sellPrice" placeholder="Ціна Продажу"><br>
                <h3>Націнка: {{ markup }} %</h3>
                <label for="quantity">Кількість</label>
                <input id="quantity" type="number" v-model="product.quantity" placeholder="Кількість"><br>
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
        buyPrice: Number,
        sellPrice: Number
    },
    methods: {
        async updateData() {
            try {
                const refDoc = doc(db, "products", this.product.id);
                await updateDoc(refDoc, {
                    name: this.product.name,
                    sellPrice: this.product.sellPrice,
                    buyPrice: this.product.buyPrice,
                    quantity: this.product.quantity,
                    brand: this.product.brand
                });
            } catch (error) {
                console.error(error);
            };
            this.$emit('close');
        },
        close() {
            this.$emit('close');
        }
    },
    computed: {
        value() {
            return this.product.sellPrice * this.product.quantity.toFixed(2)
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
</style>