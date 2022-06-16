<script setup>
import { RouterView } from "vue-router";
import NavBar from "./components/NavBar.vue";
</script>

<template>
<div class="mainPage">
    <div class="mainItem"><NavBar /></div>  
    <div class="home"><RouterView /></div>
</div>  
</template>

<style>
@import "@/assets/base.css";
</style>
