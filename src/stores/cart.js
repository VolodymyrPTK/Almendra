import { defineStore } from 'pinia'

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: JSON.parse(localStorage.getItem('cart')) || []
  }),
  
  actions: {
    addToCart(product) {
      const existingItem = this.items.find(item => item.id === product.id)
      if (existingItem) {
        existingItem.quantity++
      } else {
        this.items.push({
          ...product,
          quantity: 1
        })
      }
      this.saveToLocalStorage()
    },

    increaseQuantity(item) {
      const cartItem = this.items.find(i => i.id === item.id)
      if (cartItem) {
        cartItem.quantity++
        this.saveToLocalStorage()
      }
    },

    decreaseQuantity(item) {
      const cartItem = this.items.find(i => i.id === item.id)
      if (cartItem) {
        if (cartItem.quantity > 1) {
          cartItem.quantity--
        } else {
          this.items = this.items.filter(i => i.id !== item.id)
        }
        this.saveToLocalStorage()
      }
    },

    clearCart() {
      this.items = []
      this.saveToLocalStorage()
    },

    saveToLocalStorage() {
      localStorage.setItem('cart', JSON.stringify(this.items))
    }
  },

  getters: {
    total: (state) => {
      return state.items.reduce((sum, item) => sum + (item.sellPrice * item.quantity), 0)
    }
  }
})