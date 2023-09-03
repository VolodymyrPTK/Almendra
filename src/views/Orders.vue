<template>
    <div>
        <table class="main">
            <tbody class="order-container" v-for="order in orders" :key="order.id">
                <tr class="order-row">
                    <button @click="showDetails(order)"><img src="../assets/imgs/icons/expand.svg" alt=""></button>
                    <td>Замовлення № <b>{{ order.orderId }}</b></td>
                    <td><b>{{ order.secondName }} {{ order.firstName }}</b></td>
                    <td>Оформлено <b>{{ order.time }}</b></td>

                    <td class="select-container">
                        <div :class="{ 'active': order.orderStatus === 'Processing' }"
                            @click="updateOrderStatus(order.id, 'Processing')">Processing</div>
                        <div :class="{ 'active': order.orderStatus === 'Preparing' }"
                            @click="updateOrderStatus(order.id, 'Preparing')">Preparing</div>
                        <div :class="{ 'active': order.orderStatus === 'Shipped' }"
                            @click="updateOrderStatus(order.id, 'Shipped')">Shipped</div>
                        <div :class="{ 'active': order.orderStatus === 'Received' }"
                            @click="updateOrderStatus(order.id, 'Received')">Received</div>
                    </td>
                    <td>Сума <b>{{ order.total }}</b></td>
                    <td v-if="order.payment === 'payLater'">Післяплата</td>
                    <td v-if="order.payment === 'payNow'">За Реквізитами</td>
                    <button @click="deleteOrder(order.id)"><img src="../assets/imgs/icons/delete.svg" alt=""></button>
                </tr>
                <div class="order-info" v-if="orderDetails === order.id">
                    <table>
                        <thead>
                            <tr>
                                <th></th>
                                <th>Назва</th>
                                <th>Ціна</th>
                                <th>Кількість</th>
                                <th>Сума</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="item in order.items">
                                <input type="checkbox">
                                <td>{{ item.id }}</td>
                                <td>{{ item.price }}</td>
                                <td>{{ item.quantity }}</td>
                                <td>{{ item.quantity * item.price }}</td>
                            </tr>
                        </tbody>
                    </table>
                    <div>
                        <div>
                            <div>{{ order.phone }}</div>
                            <div>{{ order.firstName }} {{ order.secondName }}</div>
                            <div v-if="order.deliveryOption === 'novaPoshta'">
                                <div>Нова Пошта <b>{{ order.city }}</b></div>
                                <div v-if="order.postType === 'Warehouse'">Віділення <b>{{ order.warehouse }}</b></div>
                                <div v-else-if="order.postType === 'Postomat'">Поштомат <b>{{ order.warehouse }}</b></div>
                                <div v-else></div>
                            </div>
                            <div v-if="order.deliveryOption === 'ukrPoshta'">
                                <div>УкрПошта <b>{{ order.city }}</b></div>
                                <div>Індекс <b>{{ order.cityIndex }}</b></div>
                            </div>
                        </div>
                    </div>
                </div>
            </tbody>
        </table>
    </div>
</template>
  

<script>
import { onSnapshot, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { orderReg } from "../main";
import { ref, onMounted } from "vue";

export default {
    name: "Orders",
    props: { msg: String, },
    setup() {
        const profiles = ref([]);
        const profile = ref({ firstName: "", secondName: "", phone: "", city: "", warehouse: "", cityIndex: "", postType: "" });
        const orderDetails = ref(null);
        const orders = ref([]);
        const order = ref({ orderId: "" });

        function showDetails(order) {
            if (orderDetails.value === order.id) {
                orderDetails.value = null;
            } else {
                orderDetails.value = order.id;
            }
        }

        async function deleteOrder(id) {
            if (confirm("Видалити ?")) {
                await deleteDoc(doc(orderReg, id));
                orders.value = orders.value.filter((order) => order.id !== id);
            } else {
            }
        }

        async function updateOrderStatus(id, newStatus) {
            try {
                await updateDoc(doc(orderReg, id), {
                    orderStatus: newStatus
                });
            } catch (error) {
                console.error("Error updating order status:", error);
            }
            this.order.orderStatus = newStatus;
        }

        onMounted(() => {
            onSnapshot(orderReg, (snapshot) => {
                orders.value = [];
                snapshot.docs.forEach((doc) => {
                    orders.value.push({ ...doc.data(), id: doc.id });
                });
                orders.value.sort((b, a) => a.orderId - b.orderId);
            });
        });

        return {
            profiles,
            profile,
            orderDetails,
            orders,
            order,
            showDetails,
            deleteOrder,
            updateOrderStatus
        };
    },
}; 
</script>
  
<style scoped lang="scss">
.select-container {
    display: flex;
    justify-content: center;
    align-items: center;

    >div {
        margin: 0.2vw;
        cursor: pointer;
    }
}

.active {
    background-color: rgb(228, 228, 228);
    box-shadow: 0 3px 3px rgba(116, 116, 116, 0.5);
    border-radius: 25px;
    padding: 0.3vw;
}

.main {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
    padding: 1vw;
    overflow: scroll;
    overflow-x: hidden;

    &::-webkit-scrollbar {
        display: none;
    }
}

.order-container {
    padding: 0.75vh;
    margin: 0.2vw;
    border-radius: 25px;
    box-shadow: 0px 5px 7px rgba(0, 0, 0, 0.3), inset 0px 0px 0px rgba(0, 0, 0, 0);
    //background-color: rgb(255, 228, 188);
}

.order-row {
    display: flex;
    align-items: center;

    td {
        padding: 0 2vh;
    }

    td:nth-child(2) {
        width: 15%;
    }

    td:nth-child(3) {
        width: 20%;
    }

    td:nth-child(4) {
        width: 15%;
    }

    td:nth-child(5) {
        width: 40%;
        text-align: center;
    }

    td:nth-child(6) {
        width: 10%;
    }

    td:nth-child(7) {
        width: 15%;
    }

    button {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 2vw;
        width: 2vw;
        border-radius: 50px;
        border: none;
        background-color: rgba(255, 255, 255, 1);
        box-shadow: 0 3px 5px rgba(0, 0, 0, 0.3);
        cursor: pointer;
        transition: 0.3s;

        img {
            height: 2vh;
        }

        &:hover {
            background-color: rgba(238, 238, 238, 1);
            box-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
        }
    }
}


.order-info {
    display: flex;
    margin-top: 1vw;
    justify-content: space-around;
    border: solid 2px rgb(179, 179, 179);
    border-radius: 25px;
    padding: 0.5vw;

    th {
        text-align: start;
    }

    td:nth-child(4) {
        width: 15%;
    }

    td:nth-child(5) {
        width: 15%;
    }

    table {
        width: 60%;
    }

    >div {
        div {
            margin-top: 0.5vh;
        }
    }
}

tr,
th,
td {
    border: none;
}
</style>


