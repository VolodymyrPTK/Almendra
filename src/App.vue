<template>
  <div class="mainPage">
    <NavBar class="navbar-comp">
      <template v-slot:cart>
        <Cart />
      </template>
    </NavBar>
    <div class="home">
      <RouterView :key="$route.fullPath" />
    </div>
  </div>
</template>

<script>
import { RouterView } from "vue-router";
import NavBar from "./components/NavBar.vue";
import Cart from "./components/Cart.vue"

export default {
  components: {
    RouterView,
    NavBar,
    Cart
  },
};
</script>

<style lang="scss">
body {
  background: linear-gradient(to right, #fff6eb, #dfd1c5);
  font-family: "roboto", sans-serif;
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  overflow-x: hidden;
}

.navbar-comp {
  z-index: 10;
}

.mainPage {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.home {
  width: 95%;
  height: 100%;
}
</style>
