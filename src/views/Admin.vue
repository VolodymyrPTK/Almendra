<script>
import { RouterView, RouterLink } from "vue-router";

export default {
  data() {
    return {
      showMenu: false,
    };
  },
  computed: {
    isDesktop() {
      return window.innerWidth >= 550;
    },
  },
};
</script>

<template>
  <div class="admin">
    <div class="menu" v-if="isDesktop">
      <RouterLink class="navButton" to="/admin/overview">Огляд</RouterLink>
      <RouterLink class="navButton" to="/admin/products">Продукти</RouterLink>
      <RouterLink class="navButton" to="/admin/inventory">Iнвентар</RouterLink>
      <RouterLink class="navButton" to="/admin/clients">Кліенти</RouterLink>
      <RouterLink class="navButton" to="/admin/orders">Замовлення</RouterLink>
      <RouterLink class="navButton" to="/admin/novaposhta">Нова Пошта</RouterLink>
    </div>
    <div v-else>
      <button class="menu-btn" @click="showMenu = !showMenu"><img src="../assets/imgs/icons/menu.svg" alt=""></button>
      <div class="menu" v-if="showMenu">
        <RouterLink class="navButton" to="/admin/overview">Огляд</RouterLink>
        <RouterLink class="navButton" to="/admin/products">Продукти</RouterLink>
        <RouterLink class="navButton" to="/admin/inventory">Iнвентар</RouterLink>
        <RouterLink class="navButton" to="/admin/clients">Кліенти</RouterLink>
        <RouterLink class="navButton" to="/admin/orders">Замовлення</RouterLink>
        <RouterLink class="navButton" to="/admin/novaposhta">Нова Пошта</RouterLink>
      </div>
    </div>
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
  gap: 15px;
}

.menu {
  display: flex;
  flex-direction: column;
  height: 80vh;
  width: 10%;
  margin: 0;
  text-align: center;
  border-radius: 25px;
  box-shadow: 0 15px 15px rgba(0, 0, 0, 0.4), 0 -1px 20px rgba(0, 0, 0, 0.2);
  background-color: rgb(255, 255, 255);
}

.admincontent {
  width: 90%;
  height: 80vh;
  border-radius: 25px;
  background-color: rgba(253, 253, 253, 1);
  box-shadow: 0 15px 15px rgba(0, 0, 0, 0.4), 0 -1px 20px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.125);
  overflow-y: scroll;

  &::-webkit-scrollbar {
    display: none;
  }
}

.navButton {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 75%;
  padding: 0.5vw;
  margin: 0.5vw;
  color: black;
  font-size: 1.8vh;
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

.menu-btn {
  position: absolute;
  bottom: 0.4vh;
  left: 10%;
  transform: translate(-50%, -50%);
  border-radius: 50px;
  height: 7vh;
  width: 7vh;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
  border: none;
  box-shadow: 0px 5px 9px rgba(0, 0, 0, 0.2), inset 0 0 0 rgba(0, 0, 0, 0.3);

}

@media (max-width: 550px) {
  .admin {
    flex-direction: column;
    margin-top: 0vh;
  }

  .menu {
    position: absolute;
    width: 80%;
    height: 60%;
    top: 55%;
    left: 50%;
    transform: translate(-50%, -50%);
    align-items: center;
    justify-content: center;
  }

  .navButton {
    height: 6vh;
    font-size: 2.5vh;
    margin: 1vh;
  }

  .admincontent {
    width: 95vw;
    height: 85vh;
  }
}
</style>
