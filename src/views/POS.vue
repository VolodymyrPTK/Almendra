<template>
    <div class="pos-container">
        <div class="products-section">
            <div class="search-container">
                <input type="text" v-model="searchQuery" placeholder="Search products..." class="search-input">
            </div>

            <div class="products-grid">
                <div v-for="product in filteredProducts" :key="product.id" class="product-card"
                    @click="addToCart(product)">
                    <h3>{{ product.name }}</h3>
                    <p>${{ product.sellPrice }}</p>
                </div>
            </div>
        </div>

        <div class="cart-section">
            <div class="cart-header">
                <div class="cart-header-buttons">
                    <button @click="newCart" class="neo-button new-cart-btn">
                        New Cart
                    </button>
                    <button @click="showSavedCarts = true" class="neo-button view-saved-btn">
                        View Saved Carts
                    </button>
                    <button @click="generateInvoice" class="neo-button invoice-btn">
                        Generate Invoice
                    </button>
                </div>
            </div>
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
                <div class="cart-actions">
                    <button @click="saveCart" class="neo-button save-btn">Save Cart</button>
                    <button @click="checkout" class="neo-button checkout-btn">Checkout</button>
                </div>
            </div>
        </div>

        <!-- Saved Carts Modal -->
        <div v-if="showSavedCarts" class="modal-overlay">
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Saved Carts</h2>
                    <button @click="showSavedCarts = false" class="neo-button close-btn">×</button>
                </div>
                <div class="saved-carts-list">
                    <div v-for="cart in savedCarts" :key="cart.id" class="saved-cart-item">
                        <div class="cart-info">
                            <p>Created: {{ new Date(cart.created_at).toLocaleString() }}</p>
                            <p>Total: ${{ cart.total }}</p>
                        </div>
                        <div class="cart-items-preview">
                            <div v-for="item in cart.items" :key="item.product_name" class="preview-item">
                                <span>{{ item.product_name }}</span>
                                <span>x{{ item.quantity }}</span>
                                <span>${{ item.price }}</span>
                            </div>
                        </div>
                        <button @click="loadSavedCart(cart)" class="neo-button load-btn">Load Cart</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { collection, getDocs } from 'firebase/firestore'
import { db } from "../main";
import { useCartStore } from '../stores/cart'
import { supabase } from '../api/supabase'
import html2canvas from 'html2canvas';

const products = ref([])
const cartStore = useCartStore()
const showSavedCarts = ref(false)
const savedCarts = ref([])
const searchQuery = ref('')

const filteredProducts = computed(() => {
    if (!searchQuery.value) return products.value

    return products.value.filter(product => {
        if (!product.name) return false
        return product.name.toLowerCase().includes(searchQuery.value.toLowerCase().trim())
    })
})

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

const saveCart = async () => {
    try {
        if (cartStore.items.length === 0) {
            alert('Cart is empty!')
            return
        }

        const formattedItems = cartStore.items.map(item => ({
            product_name: item.name,
            price: item.sellPrice,
            quantity: item.quantity,
        }))

        console.log('Saving items:', formattedItems)

        const { data, error } = await supabase
            .from('saved_carts')
            .insert([
                {
                    items: formattedItems,
                    total: cartStore.total,
                    status: 'saved',
                    created_at: new Date().toISOString()
                }
            ])

        if (error) throw error

        alert('Cart saved successfully!')
        cartStore.items = [];
    } catch (error) {
        console.error('Error saving cart:', error)
        alert('Failed to save cart')
    }
}

const fetchSavedCarts = async () => {
    try {
        const { data, error } = await supabase
            .from('saved_carts')
            .select('*')
            .order('created_at', { ascending: false })

        if (error) throw error
        savedCarts.value = data
    } catch (error) {
        console.error('Error fetching saved carts:', error)
    }
}

const loadSavedCart = (savedCart) => {
    cartStore.clearCart()
    console.log('Loading saved cart items:', savedCart.items)
    savedCart.items.forEach(item => {
        const productToAdd = {
            id: Date.now() + Math.random(),
            name: item.product_name,
            sellPrice: item.price,
            quantity: item.quantity
        }
        cartStore.addToCart(productToAdd)
    })

    showSavedCarts.value = false
}

watch(showSavedCarts, (newValue) => {
    if (newValue) {
        fetchSavedCarts()
    }
})

const newCart = () => {
    if (cartStore.items.length > 0) {
        if (confirm('Are you sure you want to clear the current cart?')) {
            cartStore.clearCart()
        }
    }
}

const generateInvoice = async () => {
    if (cartStore.items.length === 0) {
        alert('Cart is empty!')
        return
    }

    // Create a temporary div for the invoice
    const invoiceDiv = document.createElement('div')
    invoiceDiv.style.padding = '20px'
    invoiceDiv.style.background = 'white'
    invoiceDiv.style.width = '500px'
    invoiceDiv.style.position = 'absolute'
    invoiceDiv.style.left = '-9999px'

    // Generate invoice HTML
    invoiceDiv.innerHTML = `
        <h2 style="text-align: center; margin-bottom: 20px;">Invoice</h2>
        <p>Date: ${new Date().toLocaleString()}</p>
        <hr>
        <table style="width: 100%; margin: 20px 0;">
            <tr>
                <th style="text-align: left;">Item</th>
                <th style="text-align: right;">Quantity</th>
                <th style="text-align: right;">Price</th>
                <th style="text-align: right;">Total</th>
            </tr>
            ${cartStore.items.map(item => `
                <tr>
                    <td>${item.name}</td>
                    <td style="text-align: right;">${item.quantity}</td>
                    <td style="text-align: right;">$${item.sellPrice}</td>
                    <td style="text-align: right;">$${(item.quantity * item.sellPrice).toFixed(2)}</td>
                </tr>
            `).join('')}
        </table>
        <hr>
        <h3 style="text-align: right; margin-top: 20px;">Total: $${cartStore.total}</h3>
    `

    // Add the div to the document
    document.body.appendChild(invoiceDiv)

    try {
        // Convert the div to canvas
        const canvas = await html2canvas(invoiceDiv)

        canvas.toBlob((blob) => {
            const url = URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.download = `invoice-${Date.now()}.png`
            link.href = url
            link.click()
            URL.revokeObjectURL(url)
        })
    } catch (error) {
        console.error('Error generating invoice:', error)
        alert('Failed to generate invoice')
    } finally {
        // Remove the temporary div
        document.body.removeChild(invoiceDiv)
    }
}

onMounted(() => {
    fetchProducts()
})
</script>

<style scoped>
.pos-container {
    display: grid;
    grid-template-columns: 2.2fr 0.8fr;
    gap: 2rem;
    padding: 2rem;
    background-color: rgba(214, 214, 214, 0.80);
}

.products-section {
    padding-right: 1.8rem;
}

.cart-section {
    position: fixed;
    right: 7rem;
    top: 7rem;
    bottom: 4rem;
    width: calc(25% - 3rem);
    display: flex;
    flex-direction: column;
    padding: 1.2rem;
    border-radius: 25px;
    background: #e0e5ec;
    box-shadow:
        inset 8px 8px 15px #a3b1c6,
        inset -8px -8px 15px #ffffff;
}

.cart-header {
    flex-shrink: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.2rem;
}

.cart-items {
    flex-grow: 1;
    overflow-y: auto;
    margin: -0.5rem;
    padding: 0.5rem;
    scroll-behavior: smooth;

    &::-webkit-scrollbar {
        display: none;
    }

    -ms-overflow-style: none;
    scrollbar-width: none;
}

.cart-summary {
    flex-shrink: 0;
    margin-top: 0.9rem;
    padding: 0.9rem;
    border-radius: 10px;
    background: #e0e5ec;
    box-shadow:
        inset 5px 5px 10px #a3b1c6,
        inset -5px -5px 10px #ffffff;
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
    background: #e0e0e0;
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

.cart-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.6rem 0.8rem;
    margin-bottom: 0.6rem;
    border-radius: 12px;
    background: #e0e5ec;
    box-shadow:
        5px 5px 10px #a3b1c6,
        -5px -5px 10px #ffffff;
}

.item-details {
    display: flex;
    align-items: center;
    gap: 1rem;
    flex: 1;
}

.item-details h4 {
    margin: 0;
    font-size: 0.9rem;
}

.item-details p {
    margin: 0;
    font-size: 0.9rem;
    color: #666;
}

.quantity-controls {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.quantity-controls button {
    padding: 0.3rem 0.6rem;
    font-size: 0.8rem;
}

.quantity-controls span {
    min-width: 1.5rem;
    text-align: center;
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

.cart-actions {
    display: flex;
    gap: 1rem;
    margin-top: 1rem;
}

.save-btn,
.checkout-btn {
    flex: 1;
    padding: 1rem;
    font-size: 1.1rem;
    font-weight: bold;
    color: #2d3436;
}

.save-btn {
    background: #e0e5ec;
}

.checkout-btn {
    width: auto;
}

.view-saved-btn {
    position: static;
    top: auto;
    right: auto;
    padding: 0.5rem 1rem;
}

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
    background: #e0e5ec;
    padding: 2rem;
    border-radius: 15px;
    width: 80%;
    max-width: 800px;
    max-height: 80vh;
    overflow-y: auto;
    box-shadow:
        8px 8px 15px #a3b1c6,
        -8px -8px 15px #ffffff;
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
}

.close-btn {
    font-size: 1.5rem;
    padding: 0.5rem 1rem;
}

.saved-cart-item {
    padding: 1rem;
    margin-bottom: 1rem;
    border-radius: 10px;
    background: #e0e5ec;
    box-shadow:
        5px 5px 10px #a3b1c6,
        -5px -5px 10px #ffffff;
}

.cart-info {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.5rem;
}

.cart-items-preview {
    margin: 1rem 0;
}

.preview-item {
    display: flex;
    justify-content: space-between;
    padding: 0.5rem;
    border-bottom: 1px solid #ccc;
}

.preview-item:last-child {
    border-bottom: none;
}

.load-btn {
    width: 100%;
    margin-top: 1rem;
    background: #e0e5ec;
    color: #2d3436;
}

.neo-title {
    margin-bottom: 0;
}

.cart-header-buttons {
    display: flex;
    gap: 0.8rem;
}

.new-cart-btn,
.view-saved-btn {
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
    white-space: nowrap;
}

.search-container {
    margin-bottom: 1.5rem;
}

.search-input {
    width: 100%;
    padding: 0.8rem 1.2rem;
    border: none;
    border-radius: 12px;
    background: #e0e5ec;
    box-shadow:
        inset 5px 5px 10px #a3b1c6,
        inset -5px -5px 10px #ffffff;
    font-size: 1rem;
    color: #2d3436;
    transition: all 0.3s ease;
}

.search-input:focus {
    outline: none;
    box-shadow:
        inset 6px 6px 12px #a3b1c6,
        inset -6px -6px 12px #ffffff;
}

.search-input::placeholder {
    color: #95a5a6;
}

.invoice-btn {
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
    white-space: nowrap;
    background: #e0e5ec;
}
</style>
