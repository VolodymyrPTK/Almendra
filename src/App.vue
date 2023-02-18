<template>
    <div class="mainPage">
        <NavBar />
        <div class="home">
            <RouterView />
        </div>
        <Cart class="cart-comp" />
</div>
</template>

<script>
import { RouterView } from "vue-router";
import NavBar from "./components/NavBar.vue";
import Cart from "./components/Cart.vue";

export default {
    data() {
        return {
            showMenu: true,
        };
    },
    components: {
        RouterView,
        NavBar,
        Cart
    }
};
</script>

<style lang="scss">
body {
    background: linear-gradient(to right, #fff6eb, #DFD1C5);
    font-family: 'roboto', sans-serif;
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}

.cart-comp {
    margin-top: 120px;
}

.mainPage {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.home {
    margin-top: 30px;
    width: 90%;
}

h1,
h2,
h3,
h4 {
    color: rgb(1, 37, 46);
}

.main-cart {
    margin-top: 150px;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.5s;
}

.fade-enter,
.fade-leave-to {
    opacity: 0;
}
</style>