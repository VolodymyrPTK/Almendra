<template>
  <div>
    <button class="buy-button" @click="addToCart">Купити</button>
  </div>
</template>

<script>
import { getAuth } from "firebase/auth";
import { cartReg, db, profileReg } from "../main";
import { doc, setDoc, getDoc, query, where, getDocs, runTransaction } from "firebase/firestore";
import { ref, computed, onMounted } from "vue";

export default {
  name: "AddToCart",
  props: { product: Array, sellPrice: Number, name: String, productId: String, image: String, },
  setup(props) {
    const profiles = ref([]); const profile = ref({});
    const productName = ref(props.name); const productPrice = ref(props.sellPrice);
    const product_id = ref(props.productId); const productImage = ref(props.image);
    const quantity = ref(1);

    // use computed to create reactive getters
    const product = computed(() => ({
      name: productName.value,
      price: productPrice.value,
      itemId: product_id.value,
      quantity: quantity.value,
      itemImage: productImage.value,
    }));

    // use onMounted to execute code when the component is mounted
    onMounted(async () => {
      const auth = getAuth();
      const user = auth.currentUser;
      profile.value.uid = user.uid;
      const docRef = doc(profileReg, profile.value.uid);
      getDoc(docRef).then((doc) => {
        profiles.value.push({ ...doc.data(), id: doc.id });
      });
    });

    // use async functions to handle promises
    async function addToCart() {
      try {
        const q = query(cartReg, where("uid", "==", profile.value.uid), where("finalized", "==", false));
        const querySnapshot = await getDocs(q);

        let cartId;
        querySnapshot.forEach((doc) => {
          if (doc.data().finalized === false) {
            cartId = doc.id;
          }
        });
        const productRef = doc(db, "carts", cartId, "cartProducts", productName.value);
        try {
          await runTransaction(db, async (transaction) => {
            const newQ = await transaction.get(productRef);
            if (!newQ.exists()) {
              await setDoc(productRef, product.value);
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
    }

    // return the variables and functions that are needed in the template
    return {
      profiles,
      profile,
      productName,
      productPrice,
      product_id,
      productImage,
      quantity,
      addToCart
    };
  },
}; 
</script>
<style scoped lang="scss">
.buy-button {
  margin-top: 0vw;
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
  cursor: pointer;
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
