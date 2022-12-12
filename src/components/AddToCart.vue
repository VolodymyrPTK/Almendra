<template>
    <div>
        <button class="buy-button">Купити</button>
    </div>
</template>


<script>
export default {
    name: "add-to-cart",
    props: {
        name: String,
        price: String,
        productId: String
    },
    data() {
        return {
            productName: this.name,
            productPrice: this.price,
            product_id: this.id
        }
    }
};
</script>


<style scoped lang="scss">
.buy-button {
    height: 50px;
    width: 120px;
    border-radius: 25px;
    background-color: rgb(255, 255, 255);
    box-shadow: inset 0 0px 0px grey, 0 5px 10px grey;
    border: none;
    transition: 0.5s;
}

.buy-button:hover {
    box-shadow: inset 0 0px 0px grey, 0 1px 5px grey;
    transition: 0.5s;
}

.buy-button:active {
    box-shadow: inset 0 5px 10px grey;
    transition: 0.5s;
}
</style>