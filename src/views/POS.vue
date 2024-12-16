<template>
    <div class="pos-container">
        <!-- Products Section -->
        <div class="products-section">
            <h2 class="neo-title">Products</h2>
            <div class="products-grid">
                <div v-for="product in products" :key="product.id" class="product-card" @click="addToCart(product)">
                    <h3>{{ product.name }}</h3>
                    <p>${{ product.sellPrice }}</p>
                </div>
            </div>
        </div>

        <!-- Cart Section -->
        <div class="cart-section">
            <h2 class="neo-title">Cart</h2>
            <div class="cart-items">
                <div v-for="item in cartStore.items" :key="item.id" class="cart-item">
                    <div class="item-details">
                        <h4>{{ item.name }}</h4>
                        <p>${{ item.sellPrice }}</p>
                    </div>
                    <div class="quantity-controls">
                        <button @click="decreaseQuantity(item)" class="neo-button">-</button>
                        <span>{{ item.quantity }}</span>
                        <button @click="increaseQuantity(item)" class="neo-button">+</button>
                    </div>
                </div>
            </div>

            <div class="cart-summary">
                <h3>Total: ${{ cartStore.total }}</h3>
                <button @click="checkout" class="neo-button checkout-btn">Checkout</button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { collection, getDocs } from 'firebase/firestore'
import { db } from "../main";
import { useCartStore } from '../stores/cart'

const products = ref([])
const cartStore = useCartStore()

// Fetch products from Firebase
const fetchProducts = async () => {
    try {
        const querySnapshot = await getDocs(collection(db, 'products'))
        products.value = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }))
    } catch (error) {
        console.error('Error fetching products:', error)
    }
}

// Use store operations
const addToCart = (product) => {
    cartStore.addToCart(product)
}

const increaseQuantity = (item) => {
    cartStore.increaseQuantity(item)
}

const decreaseQuantity = (item) => {
    cartStore.decreaseQuantity(item)
}

const checkout = () => {
    console.log('Checkout:', cartStore.items)
    cartStore.clearCart()
}

onMounted(() => {
    fetchProducts()
})
</script>

<style scoped>
.pos-container {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 2rem;
    padding: 2rem;
    background-color: #e0e5ec;
    min-height: 100vh;
}

.neo-title {
    color: #2d3436;
    margin-bottom: 1.5rem;
    padding: 1rem;
    border-radius: 10px;
    background: #e0e5ec;
    box-shadow:
        8px 8px 15px #a3b1c6,
        -8px -8px 15px #ffffff;
}

.products-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1.5rem;
}

.product-card {
    padding: 1rem;
    border-radius: 15px;
    background: #e0e5ec;
    box-shadow:
        8px 8px 15px #a3b1c6,
        -8px -8px 15px #ffffff;
    cursor: pointer;
    transition: transform 0.2s;
}

.product-card:hover {
    transform: translateY(-5px);
}

.product-image {
    width: 100%;
    height: 150px;
    object-fit: cover;
    border-radius: 10px;
}

.cart-section {
    padding: 1.5rem;
    border-radius: 20px;
    background: #e0e5ec;
    box-shadow:
        inset 8px 8px 15px #a3b1c6,
        inset -8px -8px 15px #ffffff;
}

.cart-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    margin-bottom: 1rem;
    border-radius: 10px;
    background: #e0e5ec;
    box-shadow:
        5px 5px 10px #a3b1c6,
        -5px -5px 10px #ffffff;
}

.quantity-controls {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.neo-button {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 8px;
    background: #e0e5ec;
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

.checkout-btn {
    width: 100%;
    padding: 1rem;
    margin-top: 1rem;
    font-size: 1.1rem;
    font-weight: bold;
    color: #2d3436;
}

.cart-summary {
    margin-top: 2rem;
    padding: 1rem;
    border-radius: 10px;
    background: #e0e5ec;
    box-shadow:
        inset 5px 5px 10px #a3b1c6,
        inset -5px -5px 10px #ffffff;
}
</style>
