<template>
  <div class="login-body">
    <div v-if="!loginProblem" class="login-container">
      <h2>Вхід</h2>
      <div class="social-login">
        <div @click="loginWithGoogle">
          <img src="../assets/google.png" alt="google login">
        </div>
        <div @click="loginWithFacebook">
          <img src="../assets/facebook.png" alt="facebook login">
        </div>
      </div>
      <h4>або</h4>
      <input type="email" v-model="email" placeholder="Електронна пошта" />
      <input type="password" @keyup.enter="login" v-model="password" placeholder="Пароль" />
      <p v-if="errMsg">{{ errMsg }}</p>
      <div class="login-btns">
        <button @click="login">Увійти</button>
        <RouterLink class="regbtn" to="/register">Реєстрація</RouterLink>
      </div>
      <p class="forgot" @click="toggleModal">Забули пароль?</p>
    </div>
    <div v-if="loginProblem" class="login-container">
      <h2>Відновлення паролі</h2>
      <h3>Вам буде надіслано листа на вашу електрону пошту</h3>
      <div style="display: flex;">
        <button style="width: auto;" @click="resetPassword">Відновити пароль</button>
        <button @click="toggleModal">Скасувати</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { getAuth, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, FacebookAuthProvider, sendPasswordResetEmail } from "firebase/auth";
import { useRouter } from "vue-router";

const email = ref("");
const password = ref("");
const errMsg = ref();
const router = useRouter();
const loginProblem = ref(false);

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

const loginWithGoogle = () => {
  const provider = new GoogleAuthProvider();
  signInWithPopup(getAuth(), provider)
    .then((result) => {
      console.log("Вхід успішний");
      router.push("/");
    })
    .catch((error) => {
      console.log(error.code);
    });
};

const loginWithFacebook = () => {
  const provider = new FacebookAuthProvider();
  signInWithPopup(getAuth(), provider)
    .then((result) => {
      console.log("Вхід успішний");
      router.push("/");
    })
    .catch((error) => {
      console.log(error.code);
    });
};

function toggleModal() {
  loginProblem.value = !loginProblem.value;
  console.log("ok")
};

const resetPassword = () => {
  sendPasswordResetEmail(getAuth(), email.value)
    .then(() => {
      console.log("Password reset email sent");
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
      }
    });
};


</script>

<style scoped lang="scss">
.login-body {
  height: 80vh;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
}


.login-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 35vw;
  height: 30vw;
  padding: 15px;
  border-radius: 25px;
  box-shadow: 0 15px 15px rgba(0, 0, 0, 0.4), 0 -1px 20px rgba(0, 0, 0, 0.2);
  background-color: rgba(255, 255, 255, 0.5);
}

.social-login {
  display: flex;
  gap: 3vh;

  div {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 3vh;
    width: 12vh;
    padding: 1vh;
    margin: 0.5vw;
    background: white;
    border-radius: 50px;
    box-shadow: 0px 5px 5px rgba(0, 0, 0, 0.3), inset 0px 0px 0px rgba(0, 0, 0, 0);
    cursor: pointer;
  }

  img {
    height: 3vh;
  }
}

input {
  width: calc(200px + 10%);
  height: 5vh;
  border-radius: 25px;
  margin: 1vh;
  text-align: center;
  box-shadow: inset 0px 3px 5px rgba(0, 0, 0, 0.3);
  transition: 0.5s;
  border: none;
}

button {
  border: none;
  height: 5vh;
  width: 8vw;
  margin: 0.5vw;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  font-family: Verdana, Geneva, Tahoma, sans-serif;
  font-size: 2vh;
  border-radius: 25px;
  background: white;
  box-shadow: 0px 5px 5px rgba(0, 0, 0, 0.3), inset 0px 0px 0px rgba(0, 0, 0, 0);
  transition: 0.3s;
  color: black;
  cursor: pointer;
}

button:hover {
  transition: 0.3s;
  box-shadow: 0px 1px 1px rgba(0, 0, 0, 0.3), inset 0px 0px 0px rgba(0, 0, 0, 0);
}

button:active {
  box-shadow: 0px 0px 0px rgba(0, 0, 0, 0.3),
    inset 0px 3px 5px rgba(0, 0, 0, 0.3);
  transition: 0.3s;
}

.login-btns {
  display: flex;
  align-items: center;
}


.regbtn {
  border: none;
  height: 5vh;
  width: 8vw;
  margin: 0.5vw;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  font-family: Verdana, Geneva, Tahoma, sans-serif;
  font-size: 1.5vh;
  border-radius: 25px;
  transition: 0.3s;
  color: black;
  cursor: pointer;
  background-color: transparent;
}

.regbtn:hover {
  border: none;
  box-shadow: 0px 7px 20px rgba(0, 0, 0, 0.25);
  background-color: white;
  transition: 0.5s;
}

.regbtn:active {
  border: none;
  box-shadow: 0px 1px 5px rgba(0, 0, 0, 0.25);
  transition: 0.35s;
}

.login-problem {
  position: relative;
  z-index: 1;
  height: 100%;
  width: 100%;
  background-color: aquamarine;
}

.forgot {
  cursor: pointer;
}

@media (max-width: 550px) {
  .login-container {
    width: 70vw;
    height: 50vh;
  }

  button {
    width: 25vw;
  }

  .regbtn {
    width: 25vw;
  }
}
</style>
