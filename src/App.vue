<script setup>
import { RouterView } from "vue-router";
import NavBar from "./components/NavBar.vue";
</script>

<template>
    <div class="mainPage">
        <NavBar />
        <div class="home">
            <RouterView />
        </div>
    </div>
</template>

<style lang="scss">
body {
    background: linear-gradient(to right, #fff6eb, #DFD1C5);
    font-family: 'roboto', sans-serif;
    box-sizing: border-box;
    margin: 0;
    padding: 0;
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
</style>