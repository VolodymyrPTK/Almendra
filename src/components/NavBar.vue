<template>
  <header class="navBar">
    <div>
      <img alt="Almendra logo" class="logo" src="@/assets/logoNav.png" />
    </div>
    <div>
      <input class="searchInput" placeholder="Шукати" />
      <button class="searchButton">O</button>
    </div>
    <div>
      <RouterLink class="navButton" to="/">Головна</RouterLink>
      <RouterLink class="navButton" to="/store">Крамниця</RouterLink>
      <RouterLink
        class="navButton"
        to="/"
        @click="handSignOut"
        v-if="isLoggedIn"
        >Вийти</RouterLink
      >
      <RouterLink class="navButton" to="/user">User</RouterLink>
      <RouterLink class="navButton" to="/admin">Admin</RouterLink>
    </div>
  </header>
</template>

<style scoped>
.navBar {
  top: 0;
  height: 90px;
  width: 100%;
  position: fixed;
  display: inline-flex;
  justify-content: space-around;
  align-items: center;
  box-shadow: 0px 5px 5px 0 rgba(0, 0, 0, 0.3);
}
.navBar:before {
  backdrop-filter: blur(8px);
  content: "";
  height: 100%;
  width: 100%;
  position: absolute;
  left: 0;
  top: 0;
}

.logo {
  height: 80px;
  display: flex;
  backdrop-filter: blur(0px);
}
.navButton {
  text-align: center;
  width: 70px;
  border: none;
  padding: 13px 13px 13px 13px;
  margin: 0 0.5em 0 0.5rem;
  display: inline-block;
  text-decoration: none;
  border-radius: 25px;
  background: white;
  box-shadow: 0px 5px 5px rgba(0, 0, 0, 0.3);
  transition: 0.1s;
  backdrop-filter: blur(0px);
  text-decoration: none;
  color: black;
}
.navButton:hover {
  transition: 0.3s;
  box-shadow: 0px 1px 1px rgba(0, 0, 0, 0.3);
}
.navButton:active {
  box-shadow: 0px 0px 0px rgba(0, 0, 0, 0.3),
    inset 0px 3px 5px rgba(0, 0, 0, 0.3);
  transition: 0.1s;
}
.searchInput {
  border-radius: 25px 0 0 25px;
  text-align: center;
  box-shadow: 0px 3px 5px rgba(0, 0, 0, 0.3);
  transition: 0.5s;
  border: none;
  padding: 13px 13px 13px 13px;
  backdrop-filter: blur(0px);
}
.searchButton {
  border-radius: 0 25px 25px 0;
  text-align: center;
  box-shadow: 0px 3px 5px rgba(0, 0, 0, 0.3);
  border: none;
  padding: 13px 13px 13px 13px;
  background-color: white;
  backdrop-filter: blur(0px);
  cursor: pointer;
}
.searchButton:hover {
  transition: 0.3s;
  box-shadow: 0px 1px 1px rgba(0, 0, 0, 0.3);
}
.searchButton:active {
  box-shadow: 0px 0px 0px rgba(0, 0, 0, 0.3),
    inset 0px 3px 5px rgba(0, 0, 0, 0.3);
  transition: 0.1s;
}
</style>
