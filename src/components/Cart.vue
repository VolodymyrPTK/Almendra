<template>
  <div class="cart">
    <div class="cart-name"><b>Кошик</b></div>

    <div class="item-container" :class="{ up: show }">
      <div class="cart-items" v-for="item in items" :key="item.id">
        <img class="productImage" :src="item.itemImage" />
        <div class="sum">
          <div class="item-name">
            <b>{{ item.name }}</b>
          </div>
          <div class="numbers">
            <div>{{ item.price }} грн</div>
            <div class="quant">
              <button class="round-btn" @click="reduceQuantity(item.id)">
                -
              </button>
              <div>{{ item.quantity }} шт</div>
              <button class="round-btn" @click="addQuantity(item.id)">+</button>
            </div>
          </div>
        </div>
        <div style="font-size: 18px; width: 20%">
          <b>{{ item.price * item.quantity }} грн</b>
        </div>
        <button class="round-btn" @click="deleteProduct(item.id)">X</button>
      </div>
    </div>

    <div class="total" :class="{ totalup: show }">
      <h3>До сплати {{ total }} грн</h3>
    </div>

    <transition name="slide2">
      <div v-if="show" class="box">
        <div class="button-container">
          <button @click="confirmPurchase()">Сплатити</button>
          <button @click="closeConfirm()">Назад</button>
        </div>
      </div>
    </transition>

    <div class="button-container" :class="{ down: show }">
      <button @click="saveCart()">Оформити</button>
      <button @click="closeCart()">Закрити</button>
    </div>
  </div>
</template>

<script>
import { getAuth } from "firebase/auth";
import {
  doc,
  getDoc,
  getDocs,
  query,
  where,
  onSnapshot,
  increment,
  collection,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { profileReg, cartReg, dataBase } from "../main";

export default {
  name: "Cart",
  props: {
    msg: String,
  },
  data() {
    return {
      products: [],
      product: {},
      profiles: [],
      profile: {},
      cartProducts: [],
      items: [],
      item: {
        itemId: "",
      },
      cartId: "",
      show: false,
    };
  },
  methods: {
    async saveCart() {
      this.show = !this.show;
    },
    async closeCart() {
      this.$emit("close");
    },
    async closeConfirm() {
      this.show = !this.show;
    },
    async addQuantity(id) {
      try {
        const auth = getAuth();
        const user = auth.currentUser;
        if (user) {
          this.profile.uid = user.uid;
          const docRef = doc(cartReg, this.cartId, "cartProducts", id);
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
          const docRef = doc(cartReg, this.cartId, "cartProducts", id);
          const docSnap = await getDoc(docRef);
          const quantity = docSnap.data().quantity;
          if (quantity > 1) {
            await updateDoc(docRef, { quantity: increment(-1) });
          } else {
            await deleteDoc(docRef);
          }
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
          const docRef = doc(cartReg, this.cartId, "cartProducts", id);
          await deleteDoc(docRef);
        }
      } catch (error) {
        console.error("Error deleting product", error);
      }
    },
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
      getDoc(docRef).then((doc) => {
        this.profiles.push({ ...doc.data(), id: doc.id });
      });
      const q = query(
        cartReg,
        where("uid", "==", this.profile.uid),
        where("finalized", "==", false)
      );
      const querySnapshot = await getDocs(q);
      this.cartId = querySnapshot.docs[0].id;
      const cartData = collection(cartReg, this.cartId, "cartProducts");
      onSnapshot(cartData, (snapshot) => {
        this.items = [];
        snapshot.docs.forEach((doc) => {
          this.items.push({ ...doc.data(), id: doc.id });
        });
      });
    }
  },
  computed: {
    total() {
      let total = 0;
      this.items.forEach((item) => {
        total += item.price * item.quantity;
      });
      return total;
    },
  },
};
</script>

<style scoped lang="scss">
.cart {
  overflow: hidden;
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
  position: fixed;
  right: 25px;
  transition: 0.5s;
}

.item-container {
  height: 100%;
  overflow: scroll;
  overflow-y: scroll;
  scroll-behavior: smooth;
  // background-color: aqua;
}

.item-container::-webkit-scrollbar {
  display: none;
}

.button-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.total {
  display: flex;
  justify-content: center;
}

.totalup {
  transform: translateY(-550px);
  transition: 0.5s;
}

.box {
  display: flex;
  justify-content: center;
  width: 100%;
  background-color: aquamarine;
}

.up {
  transform: translateX(-600px);
  transition: 0.5s;
}

.down {
  transform: translateY(200px);
  transition: 0.5s;
}

.slide2-enter-active,
.slide2-leave-active {
  transition: all 0.5s ease;
}

.slide2-enter-from,
.slide2-leave-to {
  transform: translateY(100px);
  //opacity: 0;
}

.quant {
  display: flex;
  align-items: baseline;
}

.cart-name {
  height: 20px;
  padding: 15px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 22px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.6), 0 -2px 3px rgba(255, 255, 255, 1);
  z-index: 1;
}

.cart-items {
  display: flex;
  align-items: center;
  padding: 5px 15px 5px 15px;
  margin: 15px;
  border-radius: 20px;
  box-shadow: 0 5px 7px rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(35px);
  background-color: rgba(253, 253, 253, 0.5);
  z-index: 2;
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
  height: 44px;
  margin: 10px;
  border: none;
  font-size: 18px;
  font-family: Verdana, Geneva, Tahoma, sans-serif;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.6), 0 -2px 3px rgba(255, 255, 255, 1);
  border-radius: 25px;
  backdrop-filter: blur(35px);
  background-color: rgba(253, 253, 253, 0.8);
  box-shadow: 0px 5px 7px rgba(0, 0, 0, 0.3), inset 0px 0px 0px rgba(0, 0, 0, 0);
  transition: 0.3s;
  backdrop-filter: blur(0px);
  transition: 1s;
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
</style>
