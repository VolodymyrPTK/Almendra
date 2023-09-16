<script setup>
import { RouterView } from "vue-router";
</script>

<template>
  <div class="admin">
    <ul class="menu">
      <li>
        <RouterLink class="navButton" to="/admin/overview">Огляд</RouterLink>
      </li>
      <li>
        <RouterLink class="navButton" to="/admin/products">Продукти</RouterLink>
      </li>
      <li>
        <RouterLink class="navButton" to="/admin/inventory">Iнвентар</RouterLink>
      </li>
      <li>
        <RouterLink class="navButton" to="/admin/clients">Кліенти</RouterLink>
      </li>
      <li>
        <RouterLink class="navButton" to="/admin/orders">Замовлення</RouterLink>
      </li>
      <li>
        <RouterLink class="navButton" to="/admin/novaposhta">Нова Пошта</RouterLink>
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
  align-items: center;
  margin-top: 3vh;
}

.menu {
  display: flex;
  flex-direction: column;
  height: 43vw;
  width: 10%;
  margin: 0;
  text-align: center;
  border-radius: 25px;
  box-shadow: 0 15px 15px rgba(0, 0, 0, 0.4), 0 -1px 20px rgba(0, 0, 0, 0.2);
  background-color: rgb(255, 255, 255);
}

.admincontent {

  width: 90%;
  height: 43vw;
  margin-left: 15px;
  border-radius: 25px;
  background-color: rgba(253, 253, 253, 1);
  box-shadow: 0 15px 15px rgba(0, 0, 0, 0.4), 0 -1px 20px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.125);
}

.navButton {
  display: inline-block;
  width: 75%;
  padding: 0.5vw;
  margin: 0.5vw;
  color: black;
  font-size: 1vw;
  text-decoration: none;
  border-radius: 25px;
  box-shadow: 0px 5px 7px rgba(0, 0, 0, 0.3), inset 0 0 0 rgba(0, 0, 0, 0.3);
  transition: 0.3s;
}

.navButton:hover {
  box-shadow: 0 3px 3px rgba(0, 0, 0, 0.3), inset 0 0 0 rgba(0, 0, 0, 0.3);
  transition: 0.3s;
}

.navButton:active {
  box-shadow: 0 0 0 rgba(0, 0, 0, 0.3), inset 0 3px 3px rgba(0, 0, 0, 0.3);
  transition: 0.3s;
}

ul {
  list-style-type: none;
  padding: 0;
}
</style>
