<template>
  <div class="navbar-body">
    <div class="navBar">
      <RouterLink to="/">
        <img alt="Almendra logo" class="logo" src="@/assets/logoNav.png" />
      </RouterLink>
      <div class="search-container">
        <input class="searchInput" v-model="searchTerm" @input="handleSearchInput" placeholder="Шукати" />
        <div v-if="showResults" class="searchResults">
          <RouterLink class="rlink" v-for="(product, index) in filteredProducts" :key="index"
            :to="('/product/' + product.id)" @click="hideResults">
            <img class="productImage" :src="product.image">
            <div>{{ product.name }}</div>
          </RouterLink>
        </div>
      </div>
      <div class="buttons">
        <RouterLink class="navButton" to="/store">Крамниця</RouterLink>
        <RouterLink class="navButton" to="/user">User</RouterLink>
        <RouterLink class="navButton" to="/admin/overview">Admin</RouterLink>
        <div v-if="isLoggedIn" class="navButton" @click="toggleModal">
          <img style="height: 21px; margin: 0;" src="../assets/cart.png" alt="cartlogo">
        </div>
        <RouterLink class="navButton" to="/" @click="handSignOut" v-if="isLoggedIn">Вийти</RouterLink>
      </div>
    </div>
    <Transition name="slide">
      <Cart v-if="isVisible" @close="isVisible = false" class="cart-comp" />
    </Transition>
  </div>
</template>

<script>
import { RouterLink } from "vue-router";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import Cart from "../components/Cart.vue";
import { dataBase } from "../main";
import { onSnapshot } from "@firebase/firestore";

export default {
  components: {
    Cart
  },
  props: {
    msg: String
  },
  data() {
    return {
      isLoggedIn: false,
      auth: null,
      isVisible: false,
      searchTerm: '',
      products: [],
      showResults: false
    };
  },
  methods: {
    toggleModal() {
      this.isVisible = !this.isVisible;
    },
    hideResults() {
      this.searchTerm = '';
      this.showResults = false;
    },
    handSignOut() {
      signOut(this.auth).then(() => {
        this.$router.push("/");
      });
    },
    handleSearchInput() {
      if (this.searchTerm.length >= 2) {
        this.showResults = true;
      } else {
        this.showResults = false;
      }
    }
  },
  created() {
    this.auth = getAuth();
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        this.isLoggedIn = true;
      } else {
        this.isLoggedIn = false;
      }
    });
    onSnapshot(dataBase, (snapshot) => {
      this.products = [];
      snapshot.docs.forEach((doc) => {
        this.products.push({ ...doc.data(), id: doc.id })
      });
    });
  },
  computed: {
    total() {
      let total = 0;
      this.items.forEach(item => {
        total += item.price * item.quantity;
      });
      return total;
    },
    filteredProducts() {
      return this.products.filter(product => {
        return product.name.toLowerCase().includes(this.searchTerm.toLowerCase())
      })
    }
  }
};
</script>

<style scoped lang="scss">
.productImage {
  width: 40px;
}

.search-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.searchResults {
  margin: 65px;
  position: absolute;
  display: flex;
  flex-direction: column;
  width: 350px;
  background-color: white;
  max-height: 500px;
  overflow-y: scroll;
  border-radius: 25px;
  padding: 10px;
  box-shadow: 0 15px 15px rgba(0, 0, 0, 0.4), 0 -1px 20px rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(35px);
  background-color: rgba(253, 253, 253, 0.5);

  a {
    text-decoration: none;
    color: inherit;
  }
}

.searchResults::-webkit-scrollbar {
  display: none;
}

.rlink {
  display: flex;
  align-items: center;
  border-radius: 20px;
  padding: 10px;
  margin: 5px;
  height: 50px;
  cursor: pointer;
  transition: 0.75s;
  background-color: white;
  box-shadow: 0 5px 7px rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(35px);
  background-color: rgba(253, 253, 253, 0.5);
}

.rlink:hover {
  background-color: #dfdfdf;
  box-shadow: 0 2px 2px rgba(0, 0, 0, 0.2);
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.75s;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
}

.navbar-body {
  height: 100px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: flex-end;

}

.cart-comp {
  top: 130px;

}

.navBar {
  height: 80px;
  width: 90%;
  border-radius: 25px;
  position: fixed;
  display: inline-flex;
  justify-content: space-around;
  align-items: center;
  box-shadow: 0 15px 15px rgba(0, 0, 0, 0.4), 0 -1px 20px rgba(0, 0, 0, 0.2);
  background-color: rgba(253, 253, 253, 0.75);
  border: 1px solid rgba(255, 255, 255, 0.125);

}

.navBar:before {
  backdrop-filter: blur(40px);
  content: "";
  border-radius: 25px;
  height: 100%;
  width: 100%;
  position: absolute;
  left: 0;
  top: 0;
}

.logo {
  height: 75px;
  backdrop-filter: blur(0px);
}

.buttons {
  display: flex;
}

.navButton {
  width: 80px;
  max-height: 45px;
  border: none;
  padding: 13px 13px 13px 13px;
  margin: 0 0.5em 0 0.5rem;
  display: inline-block;
  text-align: center;
  text-decoration: none;
  font-family: Verdana, Geneva, Tahoma, sans-serif;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.6), 0 -2px 3px rgba(255, 255, 255, 1);
  border-radius: 25px;
  background: white;
  box-shadow: 0px 5px 5px rgba(0, 0, 0, 0.3),
    inset 0px 0px 0px rgba(0, 0, 0, 0.0);
  transition: 0.3s;
  backdrop-filter: blur(0px);
  color: black;
  cursor: pointer;
}

.navButton:hover {
  transition: 0.3s;
  box-shadow: 0px 1px 1px rgba(0, 0, 0, 0.3),
    inset 0px 0px 0px rgba(0, 0, 0, 0.0);
}

.navButton:active {
  box-shadow: 0px 0px 0px rgba(0, 0, 0, 0.3),
    inset 0px 3px 5px rgba(0, 0, 0, 0.3);
  transition: 0.3s;
}

.searchInput {
  border-radius: 25px;
  text-align: center;
  box-shadow: 0px 3px 5px rgba(0, 0, 0, 0.3);
  transition: 0.5s;
  border: none;
  padding: 13px 13px 13px 13px;
  backdrop-filter: blur(0px);
}

.searchButton {
  border-radius: 0 25px 25px 0;
  text-align: center;
  box-shadow: 0px 3px 5px rgba(0, 0, 0, 0.3);
  border: none;
  padding: 13px 13px 13px 13px;
  background-color: white;
  backdrop-filter: blur(0px);
  cursor: pointer;
}

.searchButton:hover {
  transition: 0.3s;
  box-shadow: 0px 1px 1px rgba(0, 0, 0, 0.3);
}

.searchButton:active {
  box-shadow: 0px 0px 0px rgba(0, 0, 0, 0.3),
    inset 0px 3px 5px rgba(0, 0, 0, 0.3);
  transition: 0.1s;
}
</style>
