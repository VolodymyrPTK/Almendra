<template>
  <div>
    <button class="buy-button" @click="addToCart">Купити</button>
  </div>
</template>

<script>
import { getAuth } from "firebase/auth";
import { cartReg, db, profileReg } from "../main";
import { addDoc, doc, setDoc, getDoc, query, where, getDocs, runTransaction } from "firebase/firestore";

export default {
  name: "AddToCart",
  props: {
    product: Array,
    sellPrice: Number,
    name: String,
    productId: String,
    image: String,
  },
  data() {
    return {
      profiles: [],
      profile: {},
      productName: this.name,
      productPrice: this.sellPrice,
      product_id: this.productId,
      productImage: this.image,
      quantity: 1,
    };
  },
  methods: {
    async addToCart() {
      try {
        const product = {
          name: this.productName,
          price: this.productPrice,
          itemId: this.product_id,
          quantity: this.quantity,
          itemImage: this.productImage,
        };

        const cartInfo = {
          uid: this.profile.uid,
          finalized: false,
        };
        const q = query(cartReg, where("uid", "==", this.profile.uid), where("finalized", "==", false));
        const querySnapshot = await getDocs(q);


        let cartId;
        querySnapshot.forEach((doc) => {
          if (doc.data().finalized === false) {
            cartId = doc.id;
          }
        });
        const productRef = doc(db, "carts", cartId, "cartProducts", this.productName);
        try {
          await runTransaction(db, async (transaction) => {
            const newQ = await transaction.get(productRef);
            if (!newQ.exists()) {
              await setDoc(productRef, product);
            }
            const newQuant = newQ.data().quantity + 1;
            transaction.update(productRef, { quantity: newQuant });
          });
          console.log("Transaction successfully committed!");
        } catch (e) {
          console.log("Transaction failed: ", e);
        }

      } catch (error) {
        console.error("Error adding product to cart: ", error);
      }
    },
  },
  async created() {
    const auth = getAuth();
    const user = auth.currentUser;
    this.profile.uid = user.uid;
    const docRef = doc(profileReg, this.profile.uid);
    getDoc(docRef).then((doc) => {
      this.profiles.push({ ...doc.data(), id: doc.id });
    });
  },
};
</script>

<style scoped lang="scss">
.buy-button {
  margin-top: 5px;
  height: 2.5vw;
  width: 15vw;
  font-family: Verdana, Geneva, Tahoma, sans-serif;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.6), 0 -2px 3px rgba(255, 255, 255, 1);
  font-size: 1.4vw;
  border-radius: 25px;
  background-color: rgb(255, 255, 255);
  box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.4);
  border: none;
  transition: 0.2s;
  color: black;
}

.buy-button:hover {
  box-shadow: rgba(0, 0, 0, 0.4) 0px 15px 15px,
    rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset;
  transition: 0.2s;
}

.buy-button:active {
  box-shadow: rgba(0, 0, 0, 0.4) 0px 5px 5px,
    rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset;
  transition: 0.2s;
}
</style>
