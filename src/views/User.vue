<template>
  <div class="body">
    <div class="orders"></div>
    <div class="user">
      <div class="profile">
        <div class="head">
          <img class="profilePic" src="../assets/Logo.png" alt="profilePic">
          <div class="names">
            <h2>User Name</h2>
            <div>{{ email }}</div>
            <div>(068) 835 29 74</div>
          </div>
        </div>
      </div>
      <div class="adress"></div>
      <div class="payment"></div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { getAuth } from "firebase/auth";

export default {
  name: "Clients",
  setup() {
    return { toggle: ref(false) };
  },
  data() {
    return {
      email: '',
    }
  },
  created() {
    const auth = getAuth();
    const user = auth.currentUser;
    this.email = user.email;
  }
};
</script>

<style lang="scss" scoped>
.body {
  display: flex;
  height: 800px;
  justify-content: center;
}

.orders {
  width: 70%;
  background-color: #f0f0f0;
  border-radius: 25px;
  box-shadow: 0 10px 10px grey;
}

.user {
  width: 30%;
}

* .profile {
  display: flex;
  align-items: center;
  height: 150px;
  margin: 0 0 20px 20px;
  background-color: #f0f0f0;
  border-radius: 25px;
  box-shadow: 0 10px 10px grey;
}

.head {
  display: flex;
  margin-left: 30px;
}

.profilePic {
  height: 100px;
  width: 100px;
  border-radius: 100px;
}

.names {
  margin-left: 40px;
}

.adress {
  height: 200px;
  margin: 0 0 20px 20px;
  background-color: #f0f0f0;
  border-radius: 25px;
  box-shadow: 0 10px 10px grey;
}

.payment {
  height: 200px;
  margin: 0 0 0 20px;
  background-color: #f0f0f0;
  border-radius: 25px;
  box-shadow: 0 10px 10px grey;
}
</style>