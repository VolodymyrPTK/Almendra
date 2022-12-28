<template>
  <div class="body">
    <div class="orders"></div>
    <div class="user">
      <div class="profile">
        <div class="head">
          <img class="profilePic" src="../assets/Logo.png" alt="profilePic">
          <div class="names">
            <h2>{{ profile.name }}</h2>
            <div>{{ profile.email }}</div>
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
import { getAuth } from "firebase/auth";

export default {
  name: "User",
  props: {
    msg: String
  },
  data() {
    return {
      profiles: [],
      profile: {
        userName: '',
        email: ''
      }
    }
  },
  created() {
    const auth = getAuth();
    const user = auth.currentUser;
    this.profile.email = user.email;
    this.profile.uid = user.uid;
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
  border-radius: 25px;
  box-shadow: 0 15px 15px rgba(0, 0, 0, 0.4), 0 -1px 20px rgba(0, 0, 0, 0.2);
  background-color: rgba(253, 253, 253, 0.75);
  border: 1px solid rgba(255, 255, 255, 0.125);

}

.user {
  width: 30%;
}

.profile {
  display: flex;
  align-items: center;
  height: 150px;
  margin: 0 0 20px 20px;
  border-radius: 25px;
  box-shadow: 0 15px 15px rgba(0, 0, 0, 0.4), 0 -1px 20px rgba(0, 0, 0, 0.2);
  background-color: rgba(253, 253, 253, 0.75);
  border: 1px solid rgba(255, 255, 255, 0.125);

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
  border-radius: 25px;
  box-shadow: 0 15px 15px rgba(0, 0, 0, 0.4), 0 -1px 20px rgba(0, 0, 0, 0.2);
  background-color: rgba(253, 253, 253, 0.75);
  border: 1px solid rgba(255, 255, 255, 0.125);

}

.payment {
  height: 200px;
  margin: 0 0 0 20px;
  border-radius: 25px;
  box-shadow: 0 15px 15px rgba(0, 0, 0, 0.4), 0 -1px 20px rgba(0, 0, 0, 0.2);
  background-color: rgba(253, 253, 253, 0.75);
  border: 1px solid rgba(255, 255, 255, 0.125);
}
</style>