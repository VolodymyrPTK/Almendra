<template>
  <div class="container" v-for="product in products" :key="product.id">

    <div id="card-1" class="cards">
      <img inert class="productImage" :src="product.image" />
      <div class="product-buy">
        <div>{{ product.sellPrice }} грн</div>
        <AddToCart :product-id="product.id" :sellPrice="product.sellPrice" :image="product.image" :name="product.name" />
      </div>
    </div>

    <div id="card-2" class="cards">
      <div>{{ product.name }}</div>
      <h2>{{ product.detail }}</h2>
      <div>{{ product.description }}</div>
      <p><b>Склад:</b> {{ product.sklad }}</p>
      <div class="lables-row">
        <img class="diet-lable" v-if="product.freeGluten == true"
          src="https://firebasestorage.googleapis.com/v0/b/almendra-a411d.appspot.com/o/icons%2Fgluten.png?alt=media&token=9440b903-9314-404e-86b0-1f173ce75460"
          alt="без глютену" />
        <img class="diet-lable" v-if="product.freeSugar == true"
          src="https://firebasestorage.googleapis.com/v0/b/almendra-a411d.appspot.com/o/icons%2Fsugar.png?alt=media&token=397d0c8c-db6e-45ba-8e40-4080175c4cde"
          alt="без цукру" />
        <img class="diet-lable" v-if="product.freeLactosa == true"
          src="https://firebasestorage.googleapis.com/v0/b/almendra-a411d.appspot.com/o/icons%2Flacto.png?alt=media&token=9b56de62-5fb1-4b2f-8a97-ecc1adbfbb9c"
          alt="без лактози" />
        <img class="diet-lable" v-if="product.vegan == true"
          src="https://firebasestorage.googleapis.com/v0/b/almendra-a411d.appspot.com/o/icons%2Fvegan.png?alt=media&token=95204665-ddb2-457e-b785-b1d062f3cdd5"
          alt="веган" />
      </div>
    </div>

    <div id="card-3" class="cards">
      <h2>Характеристики</h2>
      <div class="kcal">
        <div v-if="product.liquid" class="kcal-items">
          <p>Об'єм:</p>
          <p>{{ product.weight }} мл</p>
        </div>
        <div v-else class="kcal-items">
          <p>Вага:</p>
          <p>{{ product.weight }} г</p>
        </div>
        <div class="kcal-items">
          <p>Калорійність:</p>
          <p>{{ product.kcal }} ккал</p>
        </div>
        <div class="kcal-items">
          <p>Вуглеводи:</p>
          <p>{{ product.carbo }} г</p>
        </div>
        <div class="kcal-items">
          <p>Білки:</p>
          <p>{{ product.protein }} г</p>
        </div>
        <div class="kcal-items">
          <p>Жири:</p>
          <p>{{ product.fat }} г</p>
        </div>
        <div class="kcal-items">
          <p>Виробник:</p>
          <p>{{ product.brand }}</p>
        </div>
        <div class="kcal-items">
          <p>Країна походження:</p>
          <p>{{ product.country }}</p>
        </div>
        <div class="vitamins">
          <p>Вітаміни та мінерали:</p>
          <p>{{ product.vitamins }}</p>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import { dataBase } from "../main";
import { doc, getDoc } from "firebase/firestore";
import AddToCart from "../components/AddToCart.vue";

export default {
  name: "Product",
  props: {
    msg: String,
  },
  data() {
    return {
      products: [],
      product: {
        name: "",
        id: this.$route.params.id,
        detail: "",
        sellPrice: 0,
        description: "",
        sklad: "",
        kcal: "",
        protein: "",
        carbo: "",
        fat: "",
        madeIn: "",
        brand: "",
        category: "",
        image: "",
        freeGluten: false,
        freeSugar: false,
        freeLactosa: false,
        vegan: false,
        raw: false,
        proteinik: false,
        showFullDescription: false,
      },
    };
  },
  created() {
    const docRef = doc(dataBase, this.product.id);
    getDoc(docRef).then((doc) => {
      this.products.push({ ...doc.data(), id: doc.id });
    });
  },
  components: { AddToCart },
};
</script>

<style scoped lang="scss">
.container {
  font-family: Arial, Helvetica, sans-serif;
  display: flex;
  padding: 15px;
  margin-top: 1vh;
}

.cards {
  height: 40dvw;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  background-color: #f0f0f0;
  border-radius: 25px;
  box-shadow: 0 15px 15px rgba(0, 0, 0, 0.4), 0 -2px 20px rgba(255, 255, 255, 0.5);
  background-color: rgba(253, 253, 253, 0.75);
  border: 1px solid rgba(255, 255, 255, 0.125);
}

#card-1 {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 30%;
  margin-right: 15px;
  padding: 1vw;

}

#card-2 {
  padding: 1vw 2vw 1vw 2vw;
  width: 50%;
  margin-right: 15px;
  user-select: none;

  >div:nth-child(1) {
    font-size: 2vw;
    font-weight: bold;
  }

  >div:nth-child(2) {
    font-size: 1.5vw;
  }

  >div:nth-child(3) {
    font-size: 1.2vw;
  }

  >div:nth-child(4) {
    font-size: 1.2vw;
  }

  >div:nth-child(5) {
    font-size: 1.2vw;
  }
}

#card-3 {
  padding: 1vw;
  width: 22%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  user-select: none;
}

.productImage {
  height: 35vw;
  filter: drop-shadow(0 25px 25px rgba(0, 0, 0, 0.75));
  user-select: none;
  pointer-events: none;
}

.product-buy {
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  width: 100%;

  div:nth-child(1) {
    height: 5vh;
    display: flex;
    align-items: center;
    text-align: center;
    font-family: Verdana, Geneva, Tahoma, sans-serif;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.6), 0 -2px 3px rgba(255, 255, 255, 1);
    font-size: 2.8vh;
    background-color: white;
    border-radius: 25px;
    padding: 0 15px;
  }
}

.kcal {
  display: flex;
  flex-direction: column;
}

.kcal-items {
  display: flex;
  justify-content: space-between;

  p:first-of-type {
    font-weight: bold;
  }
}

.vitamins {

  p:first-of-type {
    font-weight: bold;
  }

  p:nth-child(2) {
    text-align: left;
  }
}

.diet-lable {
  height: 7vw;
  margin: 0 0.3vw;
}

.lables-row {
  display: flex;
  justify-content: end;
}

p {
  font-size: 1.2vw;
  font-family: Arial, Helvetica, sans-serif;
  margin: 10px;
  color: rgb(0, 0, 0);
  text-wrap: balance;
}

@media (max-width: 550px) {

  .container {
    flex-direction: column;
    align-items: center;
  }

  #card-1 {
    width: 100%;
    margin: 0;
    padding: 0;
    height: auto;
  }

  #card-2 {
    margin: 5vw 0;
    padding: 0;
    width: 100%;
    height: auto;
    display: flex;
    flex-direction: column;
    align-items: center;

    >div:nth-child(1) {
      margin-top: 3vw;
      font-size: 6vw;
      font-weight: bold;
      text-align: center;
    }

    >div:nth-child(3) {
      font-size: 4vw;
      background-color: white;
      border-radius: 25px;
      padding: 5px;
      margin: 10px;
    }

    >h2 {
      text-align: center;
      font-size: 4.5vw;
      margin: 2vw 5vh;
    }

    >p {
      font-size: 4vw;
      background-color: white;
      border-radius: 25px;
      padding: 5px;
    }

    >div:nth-child(5) {
      margin-bottom: 15px;

      >img {
        height: 10vh;
      }
    }
  }

  #card-3 {
    width: 100%;
    padding: 0;
    height: auto;

    p {
      font-size: 4vw;
    }
  }

  .productImage {
    height: 40vh;
  }

  .product-buy {
    padding: 3vw;


    div:nth-child(1) {
      height: 5vh;
      display: flex;
      align-items: center;
      text-align: center;
      font-family: Verdana, Geneva, Tahoma, sans-serif;
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.6), 0 -2px 3px rgba(255, 255, 255, 1);
      font-size: 2.8vh;
      background-color: white;
      border-radius: 25px;
      padding: 0 15px;
    }
  }
}
</style>
