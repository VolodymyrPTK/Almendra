<template>
  <div class="cart">
    <h2>Кошик</h2>
    <div class="cart-items" v-for="item in items" :key="item.id">
      <img class="productImage" :src="item.itemImage">
      <div>{{ item.name }}</div>
      <div>{{ item.quantity }} шт</div>
      <div>{{ item.price }} грн</div>
      <div>{{ item.price * item.quantity }} грн</div>
    </div>

    <h3>{{ total }}</h3>
  </div>
</template>

<script>
import { getAuth } from "firebase/auth";
import { doc, getDoc, getDocs, query, where, onSnapshot, collection } from "firebase/firestore";
import { profileReg, cartReg, dataBase } from "../main";


export default {
  name: "Cart",
  props: {
    msg: String
  },
  data() {
    return {
      products: [],
      product: {},
      profiles: [],
      profile: {
      },
      cartProducts: [],
      items: [],
      item: {
        itemId: ''
      }
    }
  },
  async created() {
    onSnapshot(dataBase, (snapshot) => {
      snapshot.docs.forEach((doc) => {
        this.products.push({ ...doc.data(), id: doc.id });
      });
    });

    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
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
  },
  computed: {
    total() {
      let total = 0;
      this.items.forEach(item => {
        total += item.price * item.quantity;
      });
      return total;

    }
  }
};
</script>

<style scoped lang="scss">
.cart {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 1000px;
  height: 400px;
  backdrop-filter: blur(35px);
  background-color: rgba(253, 253, 253, 0.1);
  border-radius: 25px;
  box-shadow: -15px 0 25px rgba(0, 0, 0, 0.6);
  border: 4px solid rgba(255, 255, 255, 0.25);
  position: absolute;
  top: 50%;
  right: 25px;

}

.cart-items {
  display: flex;
  align-items: center;
  background-color: white;
  padding: 5px;
  margin: 5px;
  border-radius: 25px;
}

.productImage {
  height: 100px;
}
</style>
