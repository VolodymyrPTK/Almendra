<template>
    <div class="pos-container">
        <div class="products-section">
            <div class="search-container">
                <input type="text" v-model="searchQuery" placeholder="Search products..." class="search-input"
                    @keydown.enter.prevent="addSelectedResult" @keydown.down.prevent="selectNextResult"
                    @keydown.up.prevent="selectPreviousResult">
                <div v-if="searchQuery && filteredProducts.length > 0" class="search-results-dropdown">
                    <div v-for="(product, index) in filteredProducts" :key="product.id" class="search-result-item"
                        :class="{ 'selected': selectedIndex === index }" @click="addToCart(product)">
                        <span>{{ product.name }}</span>
                        <span>${{ product.sellPrice }}</span>
                    </div>
                </div>
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
                        Новий
                    </button>
                    <button @click="saveCart" class="neo-button save-btn">
                        Зберегти
                    </button>
                    <button @click="showSavedCarts = true" class="neo-button view-saved-btn">
                        Збережені
                    </button>
                    <button @click="generateInvoice" class="neo-button invoice-btn">
                        Рахунок
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
                    <button @click="checkout('cash')" class="neo-button payment-btn">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor">
                            <rect x="2" y="6" width="20" height="12" rx="2" />
                            <circle cx="12" cy="12" r="2" />
                            <path d="M6 12h.01M18 12h.01" />
                        </svg>
                        Cash
                    </button>
                    <button @click="checkout('card')" class="neo-button payment-btn">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor">
                            <rect x="2" y="5" width="20" height="14" rx="2" />
                            <line x1="2" y1="10" x2="22" y2="10" />
                        </svg>
                        Card
                    </button>
                    <button @click="checkout('split')" class="neo-button payment-btn">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor">
                            <line x1="12" y1="4" x2="12" y2="20" />
                            <polyline points="8 8 4 12 8 16" />
                            <polyline points="16 16 20 12 16 8" />
                        </svg>
                        Split
                    </button>
                    <button @click="checkout('online')" class="neo-button payment-btn">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor">
                            <circle cx="12" cy="12" r="10" />
                            <path d="M2 12h20" />
                            <path
                                d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                        </svg>
                        Online
                    </button>
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

        <!-- Cash Payment Modal -->
        <div v-if="showCashModal" class="modal-overlay">
            <div class="modal-content cash-modal">
                <div class="modal-header">
                    <h2>Cash Payment</h2>
                    <button @click="showCashModal = false" class="neo-button close-btn">×</button>
                </div>
                <div class="cash-payment-form">
                    <div class="amount-row">
                        <span>Total: ${{ cartStore.total }}</span>
                        <button @click="exactAmount" class="neo-button">Без Решти</button>
                    </div>
                    <div class="input-group">
                        <label>Amount Received:</label>
                        <input type="number" v-model="amountReceived" class="neo-input" @input="calculateChange">
                    </div>
                    <div class="change-display">
                        <label>Change:</label>
                        <span>${{ change }}</span>
                    </div>
                    <button @click="completeCashPayment" class="neo-button complete-btn" :disabled="!isValidPayment">
                        Complete Payment
                    </button>
                </div>
            </div>
        </div>

        <!-- Split Payment Modal -->
        <div v-if="showSplitModal" class="modal-overlay">
            <div class="modal-content split-modal">
                <div class="modal-header">
                    <h2>Split Payment</h2>
                    <button @click="showSplitModal = false" class="neo-button close-btn">×</button>
                </div>
                <div class="split-payment-form">
                    <div class="amount-row">
                        <span>Total: ${{ cartStore.total }}</span>
                    </div>
                    <div class="input-group">
                        <label>Card Amount:</label>
                        <input type="number" v-model="cardAmount" class="neo-input" @input="calculateCashAmount">
                    </div>
                    <div class="input-group">
                        <label>Cash Amount:</label>
                        <input type="number" v-model="cashAmount" class="neo-input" readonly>
                    </div>
                    <div class="input-group" v-if="cashAmount > 0">
                        <label>Cash Received:</label>
                        <input type="number" v-model="cashReceived" class="neo-input" @input="calculateSplitChange">
                        <div class="change-display" v-if="cashReceived > 0">
                            <label>Change:</label>
                            <span>${{ splitChange }}</span>
                        </div>
                    </div>
                    <button @click="completeSplitPayment" class="neo-button complete-btn"
                        :disabled="!isValidSplitPayment">
                        Complete Split Payment
                    </button>
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
const selectedIndex = ref(-1)
const showCashModal = ref(false)
const amountReceived = ref(0)
const change = ref(0)
const showSplitModal = ref(false)
const cardAmount = ref(0)
const cashAmount = ref(0)
const cashReceived = ref(0)
const splitChange = ref(0)

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

const checkout = (method) => {
    if (method === 'cash') {
        showCashModal.value = true
        return
    }
    if (method === 'split') {
        showSplitModal.value = true
        cardAmount.value = 0
        cashAmount.value = cartStore.total
        return
    }
    console.log('Checkout:', cartStore.items, method)
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

const addSelectedResult = () => {
    if (filteredProducts.value.length > 0) {
        const indexToAdd = selectedIndex.value >= 0 ? selectedIndex.value : 0
        addToCart(filteredProducts.value[indexToAdd])
        searchQuery.value = '' // Clear search after adding
        selectedIndex.value = -1 // Reset selection
    }
}

const selectNextResult = () => {
    if (filteredProducts.value.length > 0) {
        selectedIndex.value = (selectedIndex.value + 1) % filteredProducts.value.length
    }
}

const selectPreviousResult = () => {
    if (filteredProducts.value.length > 0) {
        selectedIndex.value = selectedIndex.value <= 0
            ? filteredProducts.value.length - 1
            : selectedIndex.value - 1
    }
}

watch(searchQuery, () => {
    selectedIndex.value = -1
})

onMounted(() => {
    fetchProducts()
})

const isValidPayment = computed(() => {
    return amountReceived.value >= cartStore.total
})

const calculateChange = () => {
    change.value = (amountReceived.value - cartStore.total).toFixed(2)
}

const exactAmount = () => {
    amountReceived.value = cartStore.total
    calculateChange()
}

const completeCashPayment = () => {
    if (isValidPayment.value) {
        checkout('cash')
        showCashModal.value = false
        amountReceived.value = 0
        change.value = 0
    }
}

const isValidSplitPayment = computed(() => {
    // Convert values to numbers and round to 2 decimal places
    const cardAmountNum = Math.round(Number(cardAmount.value) * 100) / 100
    const cashAmountNum = Math.round(Number(cashAmount.value) * 100) / 100
    const cashReceivedNum = Math.round(Number(cashReceived.value) * 100) / 100
    const totalNum = Math.round(Number(cartStore.total) * 100) / 100

    // If there's a cash amount
    if (cashAmountNum > 0) {
        return (
            // Check if card + cash equals total (within 1 cent tolerance)
            Math.abs((cardAmountNum + cashAmountNum) - totalNum) < 0.01 &&
            // Check if cash received is sufficient
            cashReceivedNum >= cashAmountNum
        )
    }

    // If card only payment, check if card amount equals total
    return Math.abs(cardAmountNum - totalNum) < 0.01
})

const calculateCashAmount = () => {
    // Ensure cardAmount is not negative
    if (cardAmount.value < 0) {
        cardAmount.value = 0
    }
    // Ensure cardAmount doesn't exceed total
    if (cardAmount.value > cartStore.total) {
        cardAmount.value = cartStore.total
    }
    // Calculate cash amount and round to 2 decimal places
    cashAmount.value = Math.round((cartStore.total - cardAmount.value) * 100) / 100
    // Reset cash received and change
    cashReceived.value = 0
    splitChange.value = 0
}

const calculateSplitChange = () => {
    if (cashReceived.value < 0) {
        cashReceived.value = 0
    }
    // Calculate and round change to 2 decimal places
    splitChange.value = Math.round((cashReceived.value - cashAmount.value) * 100) / 100
}

const completeSplitPayment = () => {
    if (isValidSplitPayment.value) {
        console.log('Split payment completed:', {
            card: cardAmount.value,
            cash: cashAmount.value,
            cashReceived: cashReceived.value,
            change: splitChange.value
        })
        cartStore.clearCart()
        showSplitModal.value = false
        cardAmount.value = 0
        cashAmount.value = 0
        cashReceived.value = 0
        splitChange.value = 0
    }
}
</script>

<style scoped>
.pos-container {
    display: grid;
    grid-template-columns: 2.2fr 0.8fr;
    gap: 2rem;
    padding: 2rem;
    background-color: white;
    position: relative;
}

.products-section {
    padding-right: 1.8rem;
    padding-top: 3rem;
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
    background: white;
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
    background: white;
    box-shadow:
        inset 5px 5px 10px #a3b1c6,
        inset -5px -5px 10px #ffffff;
}

.neo-title {
    color: #2d3436;
    margin-bottom: 1.5rem;
    padding: 1rem;
    border-radius: 10px;
    background: white;
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
    background: white;
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
    background: white;
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

.cart-actions {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 0.8rem;
    margin-top: 1rem;
}

.save-btn,
.checkout-btn {
    flex: 1;
    padding: 1rem;
    font-size: 1.1rem;
    color: #2d3436;
}

.save-btn {
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
    white-space: nowrap;
    background: white;
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
    background: white;
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
    background: white;
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
    background: white;
    color: #2d3436;
}

.neo-title {
    margin-bottom: 0;
}

.cart-header-buttons {
    display: flex;
    gap: 0.8rem;
    width: 100%;
}

.new-cart-btn,
.save-btn,
.view-saved-btn,
.invoice-btn {
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
    white-space: nowrap;
    flex: 1;
}

.search-container {
    position: absolute;
    top: 0;
    left: 2rem;
    width: 300px;
    z-index: 100;
    margin-bottom: 1rem;
}

.search-input {
    width: 100%;
    padding: 0.8rem 1.2rem;
    border: none;
    border-radius: 12px;
    background: white;
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
    background: white;
}

.search-results-dropdown {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: white;
    border-radius: 12px;
    box-shadow:
        8px 8px 15px #a3b1c6,
        -8px -8px 15px #ffffff;
    max-height: 300px;
    overflow-y: auto;
    z-index: 1000;
}

.search-result-item {
    padding: 0.8rem 1.2rem;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
    transition: background-color 0.2s;
}

.search-result-item:hover {
    background-color: #f5f6fa;
}

.search-result-item.selected {
    background-color: #f0f2f5;
}

.payment-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    padding: 0.8rem;
    font-size: 0.9rem;
}

.payment-btn svg {
    stroke-width: 1.5;
}

.cash-modal {
    max-width: 400px;
}

.cash-payment-form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.amount-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 1.2rem;
    margin-bottom: 1rem;
}

.input-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.neo-input {
    padding: 0.8rem;
    border: none;
    border-radius: 8px;
    background: white;
    box-shadow: inset 5px 5px 10px #a3b1c6,
        inset -5px -5px 10px #ffffff;
    font-size: 1rem;
}

.change-display {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 1.2rem;
    padding: 1rem;
    border-radius: 8px;
    background: #f0f2f5;
}

.complete-btn {
    width: 100%;
    padding: 1rem;
    margin-top: 1rem;
}

.complete-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.split-modal {
    max-width: 400px;
}

.split-payment-form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.split-payment-form .amount-row {
    font-size: 1.2rem;
    margin-bottom: 1rem;
}

.split-payment-form .input-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.split-payment-form .neo-input {
    padding: 0.8rem;
    border: none;
    border-radius: 8px;
    background: white;
    box-shadow: inset 5px 5px 10px #a3b1c6,
        inset -5px -5px 10px #ffffff;
    font-size: 1rem;
}

.split-payment-form .complete-btn {
    width: 100%;
    padding: 1rem;
    margin-top: 1rem;
}

.split-payment-form .complete-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}
</style>
