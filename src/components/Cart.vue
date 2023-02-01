<template>
  <div class="cart">
    <h2>Кошик</h2>
    <div class="cart-items" v-for="item in items" :key="item.id">
      <h3>{{ item.name }}</h3>
      <p>{{ item.price }}</p>
      <p>{{ item.quantity }}</p>
    </div>
  </div>
</template>

<script>
import { getAuth } from "firebase/auth";
import { doc, getDoc, getDocs, query, where, onSnapshot, collection } from "firebase/firestore";
import { profileReg, cartReg } from "../main";

export default {
  name: "Cart",
  props: {
    msg: String
  },
  data() {
    return {
      profiles: [],
      profile: {
        firstName: '',
        secondName: '',
        phone: '',
        city: ''
      },
      cartProducts: [],
      items: {}

    }
  },
  async created() {

    const auth = getAuth();
    const user = auth.currentUser;
    this.profile.uid = user.uid;
    const docRef = doc(profileReg, this.profile.uid);
    getDoc(docRef)
      .then((doc) => {
        this.profiles.push({ ...doc.data(), id: doc.id });
      });

    // get cart
    const q = query(cartReg, where("uid", "==", this.profile.uid), where("finalized", "==", false));
    const querySnapshot = await getDocs(q);
    const cartId = querySnapshot.docs[0].id;
    const cartData = collection(cartReg, cartId, "cartProducts");
    onSnapshot(cartData, (snapshot) => {
      this.items = [];
      snapshot.docs.forEach((doc) => {
        this.items.push({ ...doc.data(), id: doc.id })
      })
    });
  }
};
</script>

<style scoped lang="scss">
.cart {
  display: flex;
  flex-direction: column;
  width: 400px;
  height: 400px;
  background-color: white;
  border-radius: 25px;
  box-shadow: -15px 0 25px rgba(0, 0, 0, 0.6);
}

.cart-items {
  display: flex;
  align-items: center;
}
</style>
