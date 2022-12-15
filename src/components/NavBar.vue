<template>
  <div class="navbar-body">
    <div class="navBar">
      <RouterLink to="/">
        <img alt="Almendra logo" class="logo" src="@/assets/logoNav.png" />
      </RouterLink>
      <div>
        <input class="searchInput" placeholder="Шукати" />
        <button class="searchButton">O</button>
      </div>
      <div>
        <RouterLink class="navButton" to="/store">Крамниця</RouterLink>
        <RouterLink class="navButton" to="/user">User</RouterLink>
        <RouterLink class="navButton" to="/admin/overview">Admin</RouterLink>
        <RouterLink class="navButton" to="/" @click="handSignOut" v-if="isLoggedIn">Вийти</RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { RouterLink, useRouter } from "vue-router";
import { onMounted, ref } from "vue";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";

const router = useRouter();
const isLoggedIn = ref(false);

let auth;
onMounted(() => {
  auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    if (user) {
      isLoggedIn.value = true;
    } else {
      isLoggedIn.value = false;
    }
  });
});

const handSignOut = () => {
  signOut(auth).then(() => {
    router.push("/");
  });
};
</script>

<style scoped>
.navbar-body {
  height: 100px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: flex-end;
}

.navBar {
  height: 80px;
  width: 90%;
  border-radius: 50px;
  position: fixed;
  display: inline-flex;
  justify-content: space-around;
  align-items: center;
  box-shadow: 0 15px 15px rgba(0, 0, 0, 0.4), 0 -1px 20px rgba(0, 0, 0, 0.2);
  background-color: rgba(253, 253, 253, 0.75);
  border: 1px solid rgba(255, 255, 255, 0.125);

}

.navBar:before {
  backdrop-filter: blur(40px);
  content: "";
  border-radius: 50px;
  height: 100%;
  width: 100%;
  position: absolute;
  left: 0;
  top: 0;
}

.logo {
  height: 75px;
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
