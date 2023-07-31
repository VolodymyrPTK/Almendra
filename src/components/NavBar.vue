<template>
  <div class="navbar-body">

    <div class="navBar">
      <RouterLink to="/">
        <img alt="Almendra logo" class="logo" src="../assets/logoNav.png" />
      </RouterLink>

      <div class="search-container">
        <input class="searchInput" v-model="searchTerm" @input="handleSearchInput" placeholder="Пошук" />
        <div v-if="showResults" class="searchResults">
          <RouterLink class="rlink" v-for="(product, index) in filteredProducts" :key="index"
            :to="'/product/' + product.id" @click="hideResults">
            <img class="productImage" :src="product.image" />
            <div>{{ product.name }}</div>
          </RouterLink>
        </div>
      </div>

      <div class="buttons">
        <RouterLink class="navButton" to="/store">Крамниця</RouterLink>
        <RouterLink class="navButton" to="/admin/overview">Admin</RouterLink>
        <!--  <div v-if="isLoggedIn" class="navButton" @click="toggleModal">
          <img style="height: 21px; margin: 0" src="../assets/cart.png" alt="cartlogo" />
        </div>-->
        <slot name="cart" v-if="isLoggedIn" @close="isVisible = false" class="cart-comp" />
        <!-- <Cart v-if="isLoggedIn" @close="isVisible = false" class="cart-comp" />-->
        <div class="menu-container">
          <div class="menu-button" @click="openMenu"><img src="../assets/imgs/icons/menu.svg" alt=""></div>
          <div v-if="menuDropdown" class="menu-dropdown">
            <RouterLink style="margin: 0.2vw;" class="navButton" to="/user">Мій кабінет</RouterLink>
            <RouterLink style="margin: 0.2vw;" class="navButton" to="/" @click="handSignOut" v-if="isLoggedIn">Вийти
            </RouterLink>
          </div>
        </div>

      </div>
    </div>

    <Transition name="slide">
    </Transition>
  </div>
</template>

<script>
import { RouterLink } from "vue-router";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import Cart from "./Cart.vue";

export default {
  components: {
    Cart,
  },
  props: {
    msg: String,
  },
  data() {
    return {
      isLoggedIn: false,
      auth: null,
      isVisible: false,
      searchTerm: "",
      products: [],
      showResults: false,
      menuDropdown: false
    };
  },
  methods: {

    openMenu() {
      this.menuDropdown = !this.menuDropdown;
    },
    hideResults() {
      this.searchTerm = "";
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
    },
  },
  async created() {
    this.auth = getAuth();
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        this.isLoggedIn = true;
      } else {
        this.isLoggedIn = false;
      }
    });

  },
  computed: {
    filteredProducts() {
      return this.products.filter((product) => {
        return product.name
          .toLowerCase()
          .includes(this.searchTerm.toLowerCase());
      });
    },
  },
};
</script>

<style scoped lang="scss">
.cart-comp {
  top: 130px;
}

.navbar-body {
  height: 100px;
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 1.5vh;
}

.navBar {
  border-radius: 20px;
  height: 8vh;
  width: 90%;
  position: fixed;
  display: inline-flex;
  justify-content: space-around;
  align-items: center;
  box-shadow: 0 15px 15px rgba(0, 0, 0, 0.4), 0 -1px 20px rgba(0, 0, 0, 0.2);
  background-color: rgba(255, 255, 255, 0.3);

  &::before {
    border-radius: 20px;
    content: "";
    position: absolute;
    z-index: -1;
    -webkit-backdrop-filter: blur(25px);
    backdrop-filter: blur(25px);
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }
}

.logo {
  height: 7vh;
}

.buttons {
  display: flex;
}

.menu-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.menu-button {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 1.2vw;
  height: 1.2vw;
  padding: 1.2vh;
  margin: 0 0.25em 0 0.25rem;
  border-radius: 25px;
  background: white;
  box-shadow: 0px 5px 5px rgba(0, 0, 0, 0.3), inset 0px 0px 0px rgba(0, 0, 0, 0);
  transition: 0.3s;
  cursor: pointer;

  &:hover {
    transition: 0.3s;
    box-shadow: 0px 1px 1px rgba(0, 0, 0, 0.3), inset 0px 0px 0px rgba(0, 0, 0, 0);
  }

  &:active {
    box-shadow: 0px 0px 0px rgba(0, 0, 0, 0.3),
      inset 0px 3px 5px rgba(0, 0, 0, 0.3);
    transition: 0.3s;
  }
}

.menu-dropdown {
  position: absolute;
  display: flex;
  flex-direction: column;
  margin-top: 3.5vw;
  border-radius: 25px;
  padding: 10px;
  background-color: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(35px);
  -webkit-backdrop-filter: blur(15px);
  box-shadow: 0 15px 15px rgba(0, 0, 0, 0.4), 0 -1px 20px rgba(0, 0, 0, 0.2);
  animation-name: swing-in-top-fwd;
  animation-duration: 0.7s;
  animation-timing-function: ease;
}

@-webkit-keyframes swing-in-top-fwd {
  0% {
    -webkit-transform: rotateX(-100deg);
    transform: rotateX(-100deg);
    -webkit-transform-origin: top;
    transform-origin: top;
    opacity: 0
  }

  100% {
    -webkit-transform: rotateX(0deg);
    transform: rotateX(0deg);
    -webkit-transform-origin: top;
    transform-origin: top;
    opacity: 1
  }
}

@keyframes swing-in-top-fwd {
  0% {
    -webkit-transform: rotateX(-100deg);
    transform: rotateX(-100deg);
    -webkit-transform-origin: top;
    transform-origin: top;
    opacity: 0
  }

  100% {
    -webkit-transform: rotateX(0deg);
    transform: rotateX(0deg);
    -webkit-transform-origin: top;
    transform-origin: top;
    opacity: 1
  }
}

.productImage {
  width: 40px;
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
  -webkit-backdrop-filter: blur(35px);
}

.rlink:hover {
  background-color: #e9e9e9;
  box-shadow: 0 2px 2px rgba(0, 0, 0, 0.2);
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.75s;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(110%);
}

.navButton {
  width: 7vw;
  height: 1.2vw;
  padding: 1.2vh;
  margin: 0 0.25em 0 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  font-family: Verdana, Geneva, Tahoma, sans-serif;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.6), 0 -2px 3px rgba(255, 255, 255, 1);
  border-radius: 25px;
  background: white;
  box-shadow: 0px 5px 5px rgba(0, 0, 0, 0.3), inset 0px 0px 0px rgba(0, 0, 0, 0);
  transition: 0.3s;
  color: black;
  cursor: pointer;
}

.navButton:hover {
  transition: 0.3s;
  box-shadow: 0px 1px 1px rgba(0, 0, 0, 0.3), inset 0px 0px 0px rgba(0, 0, 0, 0);
}

.navButton:active {
  box-shadow: 0px 0px 0px rgba(0, 0, 0, 0.3),
    inset 0px 3px 5px rgba(0, 0, 0, 0.3);
  transition: 0.3s;
}

.searchInput {
  width: 10vw;
  height: 1.2vw;
  border-radius: 25px;
  text-align: center;
  box-shadow: inset 0px 3px 5px rgba(0, 0, 0, 0.3);
  transition: 0.5s;
  border: none;
  padding: 1.2vh;
}


.search-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.searchResults {
  margin-top: 3.3vw;
  position: absolute;
  display: flex;
  flex-direction: column;
  width: 350px;
  max-height: 500px;
  overflow-y: scroll;
  border-radius: 25px;
  padding: 10px;
  box-shadow: 0 15px 15px rgba(0, 0, 0, 0.4), 0 -1px 20px rgba(0, 0, 0, 0.2);
  background-color: rgba(253, 253, 253, 0.7);
  animation-name: swing-in-top-fwd;
  animation-duration: 1s;
  animation-timing-function: ease;

  a {
    text-decoration: none;
    color: inherit;
  }
}

.searchResults::-webkit-scrollbar {
  display: none;
}
</style>
