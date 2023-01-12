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
    width: 290px;
    font-family: Verdana, Geneva, Tahoma, sans-serif;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.6), 0 -2px 3px rgba(255, 255, 255, 1);
    font-size: 24px;
    border-radius: 25px;
    background-color: rgb(255, 255, 255);
    box-shadow: inset 0 0 0 rgba(0, 0, 0, 0.4), 0 15px 15px rgba(0, 0, 0, 0.4), 0 -1px 20px rgba(0, 0, 0, 0.2);
    border: none;
    transition: 0.3s;
}

.buy-button:hover {
    box-shadow: inset 0 0 0 rgba(0, 0, 0, 0.4), 0 0 0 rgba(0, 0, 0, 0.4), 0 1px 5px rgba(0, 0, 0, 0.2);
    transition: 0.3s;
}

.buy-button:active {
    box-shadow: inset 0 7px 10px rgba(0, 0, 0, 0.4), 0 1px 5px rgba(0, 0, 0, 0.2);
    transition: 0.3s;
}
</style>