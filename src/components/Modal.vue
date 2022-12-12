<template>
    <div v-show="modalActive" class="modal" v-for="product in products">
        <div class="modalContent">
            <div class="inputs">
                <input type="text" v-model="product.name" placeholder="Назва товару">
                <button class="productbutton" @click="editProduct(id)">Зберегти</button>
                <button class="productbutton" @click="close">Закрити</button>
            </div>
        </div>
    </div>
</template>

<script>
import { onSnapshot, updateDoc, doc } from '@firebase/firestore';
import { dataBase } from '../main';

export default {
    props: ['modalActive'],
    setup(props, { emit }) {
        const close = () => {
            emit("close");
        };
        return { close };
    },
    data() {
        return {
            products: [],
            product: {
                name: ''
            }
        }
    },
    created() {
        onSnapshot(dataBase, (snapshot) => {
            snapshot.docs.forEach((doc) => {
                this.products.push({ ...doc.data(), id: doc.id })
            })
        })
    },
    async editProduct(id) {
        const docRef = doc(dataBase, this.product.id);
        await updateDoc(docRef, { name: this.product.name });
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
</style>