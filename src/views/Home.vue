<template>
  <div>
    <header>
      <div class="container">
        <div class="items" id="item1">
          <h1 class="inside">SARATSELLI</h1>
        </div>
        <div class="items" id="item2"></div>
        <div class="items" id="item3"></div>
        <div class="items" id="item4"></div>
        <div class="items" id="item5"></div>
        <div class="items" id="item6"></div>
        <div class="items" id="item6"></div>
        <div class="items" id="item6"></div>
      </div>
    </header>
  </div>
</template>

<style lang="scss" scoped>
.container {
  width: 90%;
  height: 500px;
  margin: auto;
  margin-top: -150px;
  padding-top: 150px;
  display: flex;
}

.items {
  flex: 1;
  height: 100%;
  border-radius: 50px;
  margin: 10px;
  box-shadow: 0px 10px 15px #5a5a5a;
  transition: 1s;
  background-size: cover;
  background-position: center;
  writing-mode: vertical-rl;
  text-orientation: upright;
  color: white;
  display: flex;
  flex-direction: column-reverse;
  justify-content: space-between;
  align-items: center;
  font-size: 20px;

  &:hover {
    flex: 5;
  }
}

#item1 {
  background-image: url("../assets/slide1.jpg");

}

#item2 {
  background-image: url("../assets/slide2.jpg");
}

#item3 {
  background-image: url("../assets/slide3.jpg");
}

#item4 {
  background-image: url("../assets/slide4.jpg");
}

#item5 {
  background-image: url("../assets/slide5.jpg");
}

#item6 {
  background-image: url("../assets/slide6.jpg");
}

h1 {
  color: white;
}
</style>
