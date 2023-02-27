<template>
    <div class="mainPage">
        <NavBar class="navbar-comp" />
        <div class="home">
            <RouterView :key="$route.fullPath" />
        </div>
    </div>
</template>

<script>
import { RouterView } from "vue-router";
import NavBar from "./components/NavBar.vue";


export default {
    components: {
        RouterView,
        NavBar
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
    overflow: hidden;
}

.navbar-comp {
    z-index: 1;
}

.mainPage {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.home {
    margin-top: 40px;
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