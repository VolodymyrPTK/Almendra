<template>
  <div class="login-body">
    <div class="login-container">
      <h2>Створити логін</h2>
      <div class="social-login">
        <div>
          <img @click="registerWithGoogle" src="../assets/google.png" alt="facebook login">
        </div>
        <div>
          <img @click="registerWithFacebook" src="../assets/facebook.png" alt="facebook login">
        </div>
      </div>
      <h4>або</h4>

      <input type="email" v-model="email" placeholder="Електронна пошта" />
      <input type="password" @keyup.enter="register" v-model="password" placeholder="Пароль" />
      <p v-if="errMsg">{{ errMsg }}</p>
      <div class="login-btns">
        <button @click="register">Реєстрація</button>
        <RouterLink class="regbtn" to="/login">Вхід</RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { doc, setDoc } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, FacebookAuthProvider } from "firebase/auth";
import { useRouter } from "vue-router";
import { db } from "../main";

const firstName = ref("");
const secondName = ref("");
const email = ref("");
const password = ref("");
const errMsg = ref();
const router = useRouter();

const register = () => {
  createUserWithEmailAndPassword(getAuth(), email.value, password.value)
    .then((data) => {
      setDoc(doc(db, "profiles", data.user.uid), {
        email: email.value,
      });
      router.push("/");
    })
    .catch((error) => {
      console.log(error.code);
      switch (error.code) {
        case "auth/email-already-in-use":
          errMsg.value = "Користувач з цією електронною поштою вже існує";
          break;
        case "auth/invalid-email":
          errMsg.value = "Користувач з цією електронною поштою вже існує";
          break;
        case "auth/auth/weak-password":
          errMsg.value = "Пароль надто слабкий";
          break;
      }
    });
};
const registerWithGoogle = () => {
  const provider = new GoogleAuthProvider();
  signInWithPopup(getAuth(), provider)
    .then((result) => {
      const user = result.user;
      setDoc(doc(db, "profiles", user.uid), {
        firstName: user.displayName.split(" ")[0],
        secondName: user.displayName.split(" ")[1],
        email: user.email,
      });
      router.push("/");
    })
    .catch((error) => {
      console.log(error.code);
    });
};

const registerWithFacebook = () => {
  const provider = new FacebookAuthProvider();
  signInWithPopup(getAuth(), provider)
    .then((result) => {
      const user = result.user;
      setDoc(doc(db, "profiles", user.uid), {
        firstName: user.displayName.split(" ")[0],
        secondName: user.displayName.split(" ")[1],
        email: user.email,
      });
      router.push("/");
    })
    .catch((error) => {
      console.log(error.code);
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
  height: 50vh;
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
  width: auto;
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
  width: auto;
  margin: 0.5vw;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  font-family: Verdana, Geneva, Tahoma, sans-serif;
  font-size: 2vh;
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
