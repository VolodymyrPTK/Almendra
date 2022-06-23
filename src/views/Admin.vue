<script setup>
import { RouterLink } from "vue-router";
</script>

<template>
  <div class="admin">
    <ul class="menu">
      <li>
        <RouterLink class="navButton" to="/admin">Admin</RouterLink>
      </li>
      <li>
        <RouterLink class="navButton" to="/admin/overview">Огляд</RouterLink>
      </li>
      <li>
        <RouterLink class="navButton" to="/admin/products">Продукти</RouterLink>
      </li>
      <li>
        <RouterLink class="navButton" to="/admin/orders">Замовлення</RouterLink>
      </li>
    </ul>
    <div class="admincontent">
      <RouterView />
    </div>
  </div>
</template>

<style scoped>
.admin {
  display: flex;
  border-radius: 25px;
}

.menu {
  text-align: center;
  display: flex;
  flex-direction: column;
  height: 800px;
  width: 12%;
  background-color: #f0f0f0;
  border-radius: 25px;
  box-shadow: 0 10px 10px grey;
  margin: 0;
}

.admincontent {
  display: flex;
  justify-content: center;
  width: 90%;
  height: 800px;
  margin-left: 20px;
}

.navButton {
  text-align: center;
  width: 75%;
  border: none;
  padding: 13px 13px 13px 13px;
  margin: 15px 0 0 0;
  display: inline-block;
  text-decoration: none;
  border-radius: 25px;
  background: linear-gradient(white, rgb(233, 233, 233));
  box-shadow: 0px 5px 7px rgba(0, 0, 0, 0.3);
  text-decoration: none;
  color: black;
  transition: ease-in-out 0.5s;
}

.navButton:hover {
  box-shadow: 0 3px 3px rgba(0, 0, 0, 0.3);
}

.navButton:active {
  box-shadow: inset 0 3px 3px rgba(0, 0, 0, 0.3);
  background: linear-gradient(rgb(233, 233, 233), white);
}

ul {
  list-style-type: none;
  padding: 0;
}
</style>
