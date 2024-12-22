import { defineStore } from 'pinia'

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: []
  }),
  
  actions: {
    addToCart(product) {
      const existingItem = this.items.find(item => item.name === product.name)
      if (existingItem) {
        existingItem.quantity++
      } else {
        this.items.push({
          ...product,
          quantity: 1
        })
      }
    },

    increaseQuantity(item) {
      const existingItem = this.items.find(i => i.name === item.name)
      if (existingItem) {
        existingItem.quantity++
      }
    },

    decreaseQuantity(item) {
      const existingItem = this.items.find(i => i.name === item.name)
      if (existingItem) {
        if (existingItem.quantity > 1) {
          existingItem.quantity--
        } else {
          this.items = this.items.filter(i => i.name !== item.name)
        }
      }
    },

    clearCart() {
      this.items = []
    }
  },

  getters: {
    total: (state) => {
      return state.items.reduce((total, item) => {
        return total + (item.sellPrice * item.quantity)
      }, 0).toFixed(2)
    }
  }
})