<template>
  <div class="login-body">
    <div class="login-container">
      <h2>Вхід</h2>
      <input type="email" v-model="email" placeholder="Електронна пошта" />
    <input type="password" @keyup.enter="login" v-model="password" placeholder="Пароль" />
    <p v-if="errMsg">{{ errMsg }}</p>
    <div>
      <button class="loginButton" @click="login">Увійти</button>
      <RouterLink class="regbtn" to="/register">Реєстрація</RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
const email = ref("");
const password = ref("");
const errMsg = ref();
const login = () => {
  signInWithEmailAndPassword(getAuth(), email.value, password.value)
  .then((data) => {
      console.log("Вхід успішний");
      router.push("/");
    })
    .catch((error) => {
      console.log(error.code);
      switch (error.code) {
        case "auth/invalid-email":
          errMsg.value = "Неправильна електронна пошта";
          break;
        case "auth/user-not-found":
          errMsg.value = "Користувача з цією електронною поштою не знайдено";
          break;
        case "auth/wrong-password":
          errMsg.value = "Неправильний пароль";
          break;        
      }
    });
};
</script>

<style scoped>
.login-body {
  display: flex;
  align-items: center;
  flex-direction: column;
  margin-top: 250px;
}
.login-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 500px;
  height: 300px;
  padding: 15px;
  background-color: #f0f0f0;
  border-radius: 25px;
  box-shadow: 0px 10px 10px 0 rgba(0, 0, 0, 0.3);
}
input {
  text-align: center;
  width: 70%;
  margin: 10px;
  height: 40px;
  border-radius: 25px;
  border: none;
  box-shadow: 4px 4px 4px rgb(200, 200, 200) inset,
    -4px -4px 4px rgb(255, 255, 255) inset;
  background-color: transparent;
}
.loginButton {
  font-family: "roboto", sans-serif;
  font-size: 15px;
  text-align: center;
  width: 200px;
  border: none;
  padding: 13px 13px 13px 13px;
  margin: 1em 0.5em 0 0.5rem;
  display: inline-block;
  border-radius: 25px;
  background-color: transparent;
  box-shadow: 4px 4px 4px rgb(200, 200, 200), -4px -4px 4px rgb(255, 255, 255);
  transition: 0.1s;
  backdrop-filter: blur(0px);
  text-decoration: none;
  color: black;
  cursor: pointer;
}
.loginButton:hover {
  transition: 0.3s;
  box-shadow: 0px 1px 1px rgba(0, 0, 0, 0.3);
}
.loginButton:active {
  box-shadow: 0px 0px 0px rgba(0, 0, 0, 0.3),
    inset 0px 3px 5px rgba(0, 0, 0, 0.3);
  transition: 0.1s;
}
.regbtn {
  text-align: center;
  width: 114px;
  height: 30px;
  padding: 13px 13px 0px 13px;
  margin-left: 10px;
  display: inline-block;
  border: none;
  border-radius: 25px;
  background-color: transparent;
  transition: 0.1s;
  text-decoration: none;
  color: black;
  cursor: pointer;
}
.regbtn:hover {
  border: none;
  box-shadow: 0px 7px 20px rgba(0, 0, 0, 0.25);
  transition: 0.5s;
}
.regbtn:active {
  border: none;
  box-shadow: 0px 1px 5px rgba(0, 0, 0, 0.25);
  transition: 0.35s;
}
</style>
