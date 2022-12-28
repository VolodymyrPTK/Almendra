<template>
    <div class="modal" v-if="visible">
        <div class="modal-overlay" @click="close"></div>
        <div class="modal-container">
            <form @submit.prevent="updateData">
                <label>
                    Name:
                    <input type="text" v-model="product.name" />
                </label>
                <br />
                <label>
                    Price:
                    <input type="number" v-model="product.price" />
                </label>
                <br />
                <button type="submit">Save</button>
            </form>
            <button @click="close">Close</button>
        </div>
    </div>
</template>

<script>
import { updateDoc } from '@firebase/firestore';
import { dataBase } from '../main';


export default {
    name: 'Modal',
    props: {
        visible: Boolean,
        product: Object
    },
    methods: {
        updateData() {
            const data = {
                name: this.product.name,
                price: this.product.price
            };
            updateDoc(dataBase, this.product.id, data).then(() => {
                console.log('Product data updated');
            }).catch((error) => {
                console.error('Error updating product data:', error);
            });
        },
        close() {
            this.$emit('close');
        }
    }
}
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