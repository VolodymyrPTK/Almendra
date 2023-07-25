<template>
  <div class="modal" v-if="visible" :key="product.id">
    <div class="top-inputs">
      <input type="text" v-model="product.name" placeholder="Назва товару" />
      <input type="text" v-model="product.detail" placeholder="Опис" />

      <div class="file-upload">
        <input type="file" @change="uploadImage" />
        <img class="btnimg" src="../assets/btnimg.png" alt="icon" />
      </div>
      <input type="number" v-model="product.buyPrice" placeholder="Ціна Купівлі" />
      <input type="number" v-model="product.sellPrice" placeholder="Ціна Продажу" />
      <div class="markUp"> Націнка: {{ markUpPercent }}%</div>
    </div>
    <div style="display: flex;">
      <textarea type="text" v-model="product.description" placeholder="Опис"></textarea>
      <textarea type="text" v-model="product.sklad" placeholder="Склад"></textarea>
    </div>
    <div class="midle-inputs">
      <input type="text" v-model="product.weight" placeholder="Вага" />
      <input type="number" v-model="product.kcal" placeholder="Kcal" />
      <input type="number" v-model="product.fat" placeholder="Жири" />
      <input type="number" v-model="product.carbo" placeholder="Вуглеводи" />
      <input type="number" v-model="product.protein" placeholder="Білки" />
    </div>
    <input style="width: 50vw;" type="text" v-model="product.vitamins" placeholder="Вітаміни" />
    <div>
      <select v-model="product.country">
        <option disabled value="">Країна</option>
        <option v-for="country in countries">{{ country.id }}</option>
      </select>
      <select v-model="product.brand">
        <option disabled value="">Бренд</option>
        <option v-for="brand in brands">{{ brand.id }}</option>
      </select>
      <select class="menus" v-model="product.category">
        <option disabled value="">Категорія</option>
        <option v-for="category in categories">{{ category.id }}</option>
      </select>
    </div>
    <div>
      <div>
        <input type="checkbox" class="checkbox" v-model="product.freeGluten" />
        <label for="checkbox">Free gluten</label>
        <input type="checkbox" class="checkbox" v-model="product.freeSugar" />
        <label for="checkbox">Free sugar</label>

        <input type="checkbox" class="checkbox" v-model="product.freeLactosa" />
        <label for="checkbox">Free lactosa</label>
        <input type="checkbox" class="checkbox" v-model="product.vegan" />
        <label for="checkbox">Vegan</label>

        <input type="checkbox" class="checkbox" v-model="product.raw" />
        <label for="checkbox">Raw</label>
        <input type="checkbox" class="checkbox" v-model="product.protein" />
        <label for="checkbox">Protein</label>
      </div>
    </div>
    <div>
      <button @click="updateData">Зберегти</button>
      <button @click="close">Закрити</button>
    </div>
  </div>
</template>

<script>
import { updateDoc, doc } from "firebase/firestore";
import { db } from "../main";

export default {
  name: "Modal",
  props: {
    visible: Boolean,
    product: Object,
    brands: Array,
    categories: Array,
    countries: Array,
  },

  methods: {
    async updateData() {
      try {
        const refDoc = doc(db, "products", this.product.id);
        await updateDoc(refDoc, {
          name: this.product.name,
          detail: this.product.detail,
          sellPrice: this.product.sellPrice,
          description: this.product.description,
          sklad: this.product.sklad,
          kcal: this.product.kcal,
          protein: this.product.protein,
          carbo: this.product.carbo,
          fat: this.product.fat,
          brand: this.product.brand,
          category: this.product.category,
          country: this.product.country,
          image: this.product.image,
          vitamins: this.product.vitamins,
          freeGluten: this.product.freeGluten,
          freeSugar: this.product.freeSugar,
          freeLactosa: this.product.freeLactosa,
          vegan: this.product.vegan,
          raw: this.product.raw,
          protein: this.product.protein,
        });
      } catch (error) {
        console.error(error);
      }
      this.$emit("close");
    },
    close() {
      this.$emit("close");
    },
  },
};
</script>

<style lang="scss" scoped>
.modal {
  position: absolute;
  display: flex;
  flex-direction: column;
  padding: 1vw;
  margin: 1.5vw;
  width: 75%;
  height: 75%;
  justify-content: center;
  align-items: center;
  box-shadow: 0 15px 15px rgba(0, 0, 0, 0.4), 0 -1px 20px rgba(0, 0, 0, 0.2);
  background-color: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(15px);
  border-radius: 25px;
}


.top-inputs {
  display: flex;
  justify-content: space-around;
  align-items: center;

  input {
    &:first-child {
      width: 20vw;
    }
  }
}

.midle-inputs {
  display: flex;

  input {
    width: 10vw;
  }
}

textarea {
  width: 35vw;
  height: 30vh;
}

input,
textarea {
  border: none;
  padding: 0.5vw;
  margin: 0.5vw;
  color: black;
  font-size: 1vw;
  text-decoration: none;
  text-align: center;
  border-radius: 25px;
  box-shadow: inset 0px 5px 5px rgba(0, 0, 0, 0.3);
  background-color: rgb(255, 255, 255);
}

button,
select {
  border: none;
  padding: 0.5vw;
  margin: 0.5vw;
  color: black;
  font-size: 1vw;
  text-decoration: none;
  text-align: center;
  border-radius: 25px;
  box-shadow: 0px 5px 7px rgba(0, 0, 0, 0.3), inset 0 0 0 rgba(0, 0, 0, 0.3);
  background-color: rgb(255, 255, 255);

  :hover {
    box-shadow: 0 3px 3px rgba(0, 0, 0, 0.3), inset 0 0 0 rgba(0, 0, 0, 0.3);
    transition: 0.3s;
  }

  :active {
    box-shadow: 0 0 0 rgba(0, 0, 0, 0.3), inset 0 3px 3px rgba(0, 0, 0, 0.3);
    transition: 0.3s;
  }
}

.checkbox {
  height: 15px;
  width: 15px;
  box-shadow: none;
}

.file-upload {
  height: 40px;
  width: 40px;
  border-radius: 25px;
  border: none;
  box-shadow: 4px 4px 4px rgb(200, 200, 200), -4px -4px 4px rgb(255, 255, 255);
  margin: 0 5px 0 5px;
  display: flex;
  align-items: center;
  justify-content: center;

  input[type="file"] {
    height: 40px;
    width: 40px;
    position: absolute;
    opacity: 0;
  }
}

.file-upload:hover {
  transition: 0.3s;
  box-shadow: 0px 1px 1px rgba(0, 0, 0, 0.3);
}

.btnimg {
  height: 20px;
}

label {
  width: 50px;
  margin-right: 5px;
}

.markUp {
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  background-color: rgb(255, 255, 255);
  padding: 0.5vw;
  width: 5vw;
  border-radius: 25px;
}
</style>
