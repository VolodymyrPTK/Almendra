<template>
  <div class="addproduct">
    <input type="text" placeholder="Назва товару">
    <input type="number" placeholder="Ціна">
    <button class="productbutton">Зберегти</button>
  </div>
</template>

<style scoped>
.addproduct {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

input {
  text-align: center;
  margin: 10px;
  height: 40px;
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
</style>