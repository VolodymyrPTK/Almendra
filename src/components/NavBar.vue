<template>
  <div class="navbar-body">

    <div class="navBar">
      <RouterLink to="/">
        <img alt="Almendra logo" class="logo" src="../assets/logoNav.png" />
      </RouterLink>
      <div class="search-input" v-if="searchInput">
        <input type="text" v-model="searchTerm" @input="handleSearchInput" placeholder="Пошук">
        <div class="navButton" @click="toggleSearch"><img src="../assets/imgs/icons/close.svg" alt=""></div>
        <div v-if="showResults" class="searchResults">
          <RouterLink class="rlink" v-for="(product, index) in filteredProducts" :key="index"
            :to="'/product/' + product.id" @click="hideResults">
            <img class="productImage" :src="product.image" />
            <div>
              <div style="font-weight: bold;">{{ product.name }}</div>
              <div>{{ product.detail }}</div>
            </div>
          </RouterLink>
        </div>
      </div>



      <div class="buttons">
        <div class="navButton" @click="toggleSearch"><img src="../assets/imgs/icons/search.svg" alt=""></div>
        <RouterLink class="navButton" to="/store"><img src="../assets/imgs/icons/home.svg" alt=""></RouterLink>
        <slot name="cart" v-if="isLoggedIn" @close="isVisible = false" />
        <RouterLink v-if="!isLoggedIn" style="width: 15vw; color: black;" class="navButton" to="/user">Увійти</RouterLink>
        <div v-if="isLoggedIn" class="menu-container">
          <div class="navButton" @click="openMenu"><img src="../assets/imgs/icons/menu.svg" alt=""></div>
          <div v-if="menuDropdown" class="menu-dropdown">
            <img class="profilePic" src="../assets/Logo.png" alt="profilePic" />
            <h3>
              {{ profile.firstName }}
              {{ profile.secondName }}</h3>
            <RouterLink v-if="profile.userAdmin" class="menuButton" to="/admin/overview">Admin
            </RouterLink>
            <RouterLink class="menuButton" to="/user">Мій кабінет</RouterLink>
            <RouterLink class="menuButton" to="/" @click="handSignOut" v-if="isLoggedIn">Вийти
            </RouterLink>
          </div>
        </div>

      </div>
    </div>

  </div>
</template>

<script>
import { RouterLink } from "vue-router";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { dataBase, profileReg } from "../main";
import { doc, onSnapshot } from "firebase/firestore";
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
      profile: {
        firstName: "",
        secondName: "",
        phone: "",
        city: "",
        warehouse: "",
        cityIndex: "",
        email: "",
        uid: "",
      },
      profile: [],
      isLoggedIn: false,
      auth: null,
      isVisible: false,
      searchTerm: "",
      products: [],
      showResults: false,
      menuDropdown: false,
      searchInput: false
    };
  },
  methods: {
    toggleSearch() {
      this.searchInput = !this.searchInput;
      this.searchTerm = "";
      this.showResults = false;
    },
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

        // User is authenticated, you can now safely access their properties
        this.profile.email = user.email;
        this.profile.uid = user.uid;

        const docRef = doc(profileReg, this.profile.uid);
        onSnapshot(docRef, (doc) => {
          this.profile.firstName = doc.data().firstName;
          this.profile.secondName = doc.data().secondName;
          this.profile.city = doc.data().city;
          this.profile.userAdmin = doc.data().userAdmin;
          this.profile.phone = doc.data().phone ?? "";
        });
      } else {
        this.isLoggedIn = false;
      }
    });
    onSnapshot(dataBase, (snapshot) => {
      this.products = [];
      snapshot.docs.forEach((doc) => {
        this.products.push({ ...doc.data(), id: doc.id });
      });
    });
  },
  computed: {
    filteredProducts() {
      return this.products.filter((product) => {
        return (
          product.name
            .toLowerCase()
            .includes(this.searchTerm.toLowerCase()) ||
          product.description
            .toLowerCase()
            .includes(this.searchTerm.toLowerCase()) ||
          product.brand
            .toLowerCase()
            .includes(this.searchTerm.toLowerCase())
        );
      });
    }
  },
};
</script>

<style scoped lang="scss">
.navbar-body {
  height: 8vh;
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 1.5vh;
}

.navBar {
  border-radius: 20px;
  height: 8vh;
  width: 95%;
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
  align-items: center;
}

.menu-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.menu-dropdown {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 5vw;
  border-radius: 25px;
  padding: 10px;
  gap: 5px;
  background-color: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(35px);
  -webkit-backdrop-filter: blur(35px);
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

.search-input {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 25px;

  input {
    height: 3vh;
    padding: 0.6vw;
    margin: 0 0.5vh;
    width: 15vw;
    border: none;
    box-shadow: inset 0 3px 5px grey;
    border-radius: 25px;
  }
}

.productImage {
  width: 40px;
}

.searchResults {
  position: absolute;
  display: flex;
  flex-direction: column;
  margin-top: 60vh;
  border-radius: 25px;
  padding: 10px;
  max-height: 50vh;
  width: 20vw;
  overflow: hidden;
  overflow-y: scroll;
  background-color: rgba(255, 255, 255, 1);
  box-shadow: 0 15px 15px rgba(0, 0, 0, 0.4), 0 -1px 20px rgba(0, 0, 0, 0.2);
  animation-name: swing-in-top-fwd;
  animation-duration: 0.7s;
  animation-timing-function: ease;

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
  padding: 0.5vw;
  margin: 5px;
  height: auto;
  cursor: pointer;
  transition: 0.75s;
  font-size: 15px;
  background-color: white;
  box-shadow: 0 5px 7px grey;

}

.rlink:hover {
  background-color: #e9e9e9;
  box-shadow: 0 2px 2px rgba(0, 0, 0, 0.2);
}

.profilePic {
  height: 10vh;
  width: 10vh;
  border-radius: 100px;
  border: 5px solid white;
  box-shadow: 0 15px 15px rgba(0, 0, 0, 0.4);
}

.navButton {
  width: 3vh;
  height: 3vh;
  padding: 0.6vw;
  margin: 0 0.5vh;
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

.menuButton {
  width: 7.5vw;
  height: 2.3vh;
  padding: 0.6vw;
  margin: 0 1vh;
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

.menuButton:hover {
  transition: 0.3s;
  box-shadow: 0px 1px 1px rgba(0, 0, 0, 0.3), inset 0px 0px 0px rgba(0, 0, 0, 0);
}

.menuButton:active {
  box-shadow: 0px 0px 0px rgba(0, 0, 0, 0.3),
    inset 0px 3px 5px rgba(0, 0, 0, 0.3);
  transition: 0.3s;
}

@media (max-width: 550px) {
  .logo {
    height: 4.55vh;
  }

  .navBar {
    border-radius: 50px;
  }

  .search-input {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    background-color: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(35px);
    -webkit-backdrop-filter: blur(35px);
    border-radius: 25px;

    input {
      height: 4vh;
      width: 50vw;
      padding: 1vw 1vh;
    }
  }

  .searchResults {
    width: 80vw;
  }

  .navButton {
    height: 4vh;
    width: 4vh;
  }

  .menu-container {
    align-items: flex-end;
  }

  .menu-dropdown {
    margin-top: 15vw;
    width: 50vw;
  }

  .menuButton {
    width: 30vw;
    height: 4vh;
  }

}
</style>
