<template>
  <div class="products">
    <div class="addproduct">
      <div class="inputs">
        <input type="text" v-model="product.name" placeholder="Назва товару">
        <input type="text" v-model="product.detail" placeholder="Деталі">
        <input type="number" v-model="product.price" placeholder="Ціна">
      </div>
      <textarea type="text" v-model="product.description" placeholder="Опис"></textarea>
      <div class="inputs">
        <input type="text" v-model="product.kcal" placeholder="КБЖУ">
        <input type="text" v-model="product.brand" placeholder="Бренд">
        <input type="text" v-model="product.category" placeholder="Категорія">
      </div>
      <button class="productbutton" @click="saveData">Зберегти</button>
    </div>
    <div class="productlist">
      <table class="fixed_headers">
        <thead>
          <tr>
            <th>Назва</th>
            <th>Бренд</th>
            <th>Категорія</th>
            <th>Ціна</th>
            <th>Зміни</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product in products">
            <td>{{ product.name }}</td>
            <td>{{ product.brand }}</td>
            <td>{{ product.category }}</td>
            <td>₴ {{ product.price }}</td>
            <td class="tablebtns"><button class="editButton">≡</button>
              <button class="deleteButton" @click="deleteProduct(product)">X</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { dataBase } from '../main';
import { addDoc, onSnapshot } from "firebase/firestore";

export default {
  name: "Products",
  props: {
    msg: String
  },
  data() {
    return {
      products: [],
      product: {
        name: '',
        detail: '',
        price: '',
        description: '',
        kcal: '',
        brand: '',
        category: ''
      }
    }
  },
  methods: {
    saveData() {
      try {
        addDoc(dataBase, this.product).then((docRef) => {
          console.log("Document written with ID: ", docRef.id);
        });
      } catch (e) {
        console.error("Error adding document: ", e);
      }
    }
  },
  created() {
    onSnapshot(dataBase, (snapshot) => {
      snapshot.docs.forEach((doc) => {
        this.products.push({ ...doc.data(), id: doc.id })
      })
    });
  }
};
</script>

<style scoped lang="scss">
.products {
  display: flex;
  width: 100%;

}

.addproduct {
  width: 30%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  background-color: #f0f0f0;
  border-radius: 25px;
  box-shadow: 0 10px 10px grey;
}

.productlist {
  width: 70%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #f0f0f0;
  border-radius: 25px;
  box-shadow: 0 10px 10px grey;
  margin-left: 20px;
}

.inputs {
  justify-content: space-around;
  display: flex;
  width: 300px;
  margin: 20px 0 20px 0;
}

input {
  text-align: center;
  height: 40px;
  width: 30%;
  border-radius: 25px;
  border: none;
  box-shadow: 4px 4px 4px rgb(200, 200, 200) inset, -4px -4px 4px rgb(255, 255, 255) inset;
  background-color: transparent;
}

textarea {
  text-align: center;
  width: 90%;
  max-width: 90%;
  min-width: 50%;
  height: 400px;
  max-height: 550px;
  min-height: 300px;
  border-radius: 25px;
  border: none;
  box-shadow: 4px 4px 4px rgb(200, 200, 200) inset, -4px -4px 4px rgb(255, 255, 255) inset;
  background-color: transparent;
}

.productbutton {
  font-family: 'roboto', sans-serif;
  font-size: 15px;
  text-align: center;
  border: none;
  padding: 13px 13px 13px 13px;
  border-radius: 25px;
  background-color: transparent;
  box-shadow: 4px 4px 4px rgb(200, 200, 200), -4px -4px 4px rgb(255, 255, 255);
  transition: 0.1s;
  text-decoration: none;
  color: black;
  cursor: pointer;
}

.productbutton:hover {
  transition: 0.3s;
  box-shadow: 0px 1px 1px rgba(0, 0, 0, 0.3);
}

.productbutton:active {
  box-shadow: 0px 0px 0px rgba(0, 0, 0, 0.3), inset 0px 3px 5px rgba(0, 0, 0, 0.3);
  transition: 0.1s;
}

.editButton {
  background-color: rgb(255, 229, 143);
  border: none;
  border-radius: 50px;
}

.editButton:hover {
  background-color: rgb(255, 211, 68);
}

.editButton:active {
  background-color: rgb(253, 202, 36);
}

.deleteButton {
  background-color: rgb(255, 130, 72);
  border: none;
  border-radius: 50px;
}

.deleteButton:hover {
  background-color: rgb(252, 74, 74);
}

.deleteButton:active {
  background-color: rgb(255, 42, 42);
}

.fixed_headers {
  height: 90%;
  width: 90%;
  table-layout: fixed;
  border-collapse: collapse;

  th {
    text-decoration: underline;
  }

  th,
  td {
    padding: 5px;
    text-align: left;
  }

  td:nth-child(1),
  th:nth-child(1) {
    width: 40%;
  }

  td:nth-child(2),
  th:nth-child(2) {
    width: 25%;
  }

  td:nth-child(3),
  th:nth-child(3) {
    width: 25%;
  }

  td:nth-child(4),
  th:nth-child(4) {
    width: 10%;
  }

  td:nth-child(5),
  th:nth-child(5) {
    width: 10%;
  }

  thead {
    background-color: rgb(177, 177, 177);
    color: #FDFDFD;

    tr {
      display: block;
      position: relative;
    }
  }

  tbody {
    display: block;
    overflow: auto;
    width: 100%;
    height: 90%;

    tr:nth-child(even) {
      background-color: #DDD;
    }
  }
}

.tablebtns {
  display: flex;
}
</style>