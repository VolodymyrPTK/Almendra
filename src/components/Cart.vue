<template>
  <div class="cart">
    <div class="cart-name"><b>Кошик</b></div>
    <div>{{ this.cartId }}</div>

    <div class="item-container">
      <div class="cart-items" v-for="item in items" :key="item.id">
        <img class="productImage" :src="item.itemImage">
        <div class="sum">
          <div class="item-name"><b>{{ item.name }}</b></div>
          <div class="numbers">
            <div>{{ item.price }} грн</div>
            <div class="quant">
              <button class="round-btn" @click="reduceQuantity(item.id)">-</button>
              <div>{{ item.quantity }} шт</div>
              <button class="round-btn" @click="addQuantity(item.id)">+</button>
            </div>
          </div>
        </div>
        <div style="font-size: 18px; width: 20%;"><b>{{ item.price * item.quantity }} грн</b></div>
        <button class="round-btn" @click="deleteProduct(item.id)">X</button>
      </div>
    </div>

    <div style="display: flex; flex-direction: column; align-items: center;">
      <h3 style="display: flex; justify-content: end; margin-right: 25px;">Сума {{ total }} грн</h3>
      <button>Оформити</button>
    </div>

</div>
</template>

<script>
import { getAuth } from "firebase/auth";
import { doc, getDoc, getDocs, query, where, onSnapshot, increment, collection, deleteDoc, updateDoc } from "firebase/firestore";
import { profileReg, cartReg, dataBase, db } from "../main";

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
  methods: {
    async addQuantity(id) {
      try {
        const auth = getAuth();
        const user = auth.currentUser;
        if (user) {
          this.profile.uid = user.uid;
          const q = query(cartReg, where("uid", "==", this.profile.uid), where("finalized", "==", false));
          const querySnapshot = await getDocs(q);
          const cartId = querySnapshot.docs[0].id;
          const cartData = collection(cartReg, cartId, "cartProducts");
          const docRef = doc(cartData, id);
          await updateDoc(docRef, { quantity: increment(1) });
        }
      } catch (error) {
        console.error("Error adding product", error);
      }
    },
    async reduceQuantity(id) {
      try {
        const auth = getAuth();
        const user = auth.currentUser;
        if (user) {
          this.profile.uid = user.uid;
          const q = query(cartReg, where("uid", "==", this.profile.uid), where("finalized", "==", false));
          const querySnapshot = await getDocs(q);
          const cartId = querySnapshot.docs[0].id;
          const cartData = collection(cartReg, cartId, "cartProducts");
          const docRef = doc(cartData, id);
          await updateDoc(docRef, { quantity: increment(-1) });
        }
      } catch (error) {
        console.error("Error reducing product quantity", error);
      }
    },

    async deleteProduct(id) {
      try {
        const auth = getAuth();
        const user = auth.currentUser;
        if (user) {
          this.profile.uid = user.uid;
          const q = query(cartReg, where("uid", "==", this.profile.uid), where("finalized", "==", false));
          const querySnapshot = await getDocs(q);
          const cartId = querySnapshot.docs[0].id;
          const cartData = collection(cartReg, cartId, "cartProducts");
          const docRef = doc(cartData, id);
          await deleteDoc(docRef);
        }
      } catch (error) {
        console.error("Error deleting product", error);
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
  justify-content: space-between;
  width: 500px;
  height: 80%;
  backdrop-filter: blur(35px);
  background-color: rgba(253, 253, 253, 0.1);
  border-radius: 25px;
  box-shadow: -15px 0 25px rgba(0, 0, 0, 0.6);
  border: 4px solid rgba(255, 255, 255, 0.25);
  position: absolute;
  right: 25px;
}

.item-container {
  height: 85%;
}

.quant {
  display: flex;
  align-items: baseline;
}

.cart-name {
  display: flex;
  margin-top: 20px;
  justify-content: center;
  font-size: 22px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.6), 0 -2px 3px rgba(255, 255, 255, 1);
}

.cart-items {
  display: flex;
  align-items: center;
  background-color: white;
  padding: 5px 15px 5px 15px;
  margin: 15px;
  border-radius: 20px;
  box-shadow: 0 5px 7px rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(35px);
  background-color: rgba(253, 253, 253, 0.5);
}

.item-name {
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.4), 0 -2px 3px rgba(255, 255, 255, 1);
  height: 30px;
  display: flex;
  align-items: center;
}

.round-btn {
  width: 25px;
  height: 25px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 10px 0 10px;
}

.sum {
  width: 80%;
  height: 70px;
  display: flex;
  flex-direction: column;
}

.numbers {
  height: 50%;
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.productImage {
  height: 75px;
}

button {
  width: 80%;
  border: none;
  font-size: 18px;
  font-family: Verdana, Geneva, Tahoma, sans-serif;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.6), 0 -2px 3px rgba(255, 255, 255, 1);
  border-radius: 25px;
  backdrop-filter: blur(35px);
  background-color: rgba(253, 253, 253, 0.8);
  box-shadow: 0px 5px 7px rgba(0, 0, 0, 0.3),
    inset 0px 0px 0px rgba(0, 0, 0, 0.0);
  transition: 0.3s;
  backdrop-filter: blur(0px);
  transition: 1s;
}

button:hover {
  transition: 0.3s;
  box-shadow: 0px 1px 1px rgba(0, 0, 0, 0.3),
    inset 0px 0px 0px rgba(0, 0, 0, 0.0);
}

button:active {
  box-shadow: 0px 0px 0px rgba(0, 0, 0, 0.3),
    inset 0px 3px 5px rgba(0, 0, 0, 0.3);
  transition: 0.3s;
}
</style>
