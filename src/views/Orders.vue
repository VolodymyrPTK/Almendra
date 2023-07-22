<template>
    <div class="main">
        <div class="orders">
            <div class="order-container" v-for="order in orders" :key="order.id">
                <div @click="showDetails(order)" class="order-row">
                    <div>{{ order.orderId }}</div>
                    <div>{{ order.time }}</div>
                    <div>{{ order.orderStatus }}</div>
                    <div>{{ order.total }}</div>
                </div>
                <div v-if="orderDetails === order.id">
                    <div style="display: flex; justify-content: space-between;" v-for="user in order.userData">
                        <div>{{ user.firstName }}</div>
                        <div>{{ user.secondName }}</div>
                        <div>{{ user.phone }}</div>
                        <div v-if="user.deliveryOption === 'novaPoshta'">Нова Пошта</div>
                        <div v-if="user.deliveryOption === 'ukrPoshta'">УкрПошта</div>
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th>Назва</th>
                                <th>Ціна</th>
                                <th>Кількість</th>
                                <th>Сума</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="item in order.items">
                                <td>{{ item.id }}</td>
                                <td>{{ item.price }}</td>
                                <td>{{ item.quantity }}</td>
                                <td>{{ item.quantity * item.price }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>
  
<script>
import { onSnapshot } from "firebase/firestore";
import { orderReg } from "../main";

export default {
    name: "Orders",
    props: {
        msg: String,
    },
    data() {
        return {
            profiles: [],
            profile: {
                firstName: "",
                secondName: "",
                phone: "",
                city: "",
                warehouse: "",
                cityIndex: ""
            },
            orderDetails: null,
            orders: [],
            order: {
                orderId: ""
            },

        };
    },
    methods: {
        showDetails(order) {
            if (this.orderDetails === order.id) {
                this.orderDetails = null;
            } else {
                this.orderDetails = order.id;
            }
        },
    },
    async created() {
        onSnapshot(orderReg, (snapshot) => {
            this.orders = [];
            snapshot.docs.forEach((doc) => {
                this.orders.push({ ...doc.data(), id: doc.id });
            });
            this.orders.sort((b, a) => a.orderId - b.orderId);
        });
    },
};
</script>
  
<style scoped lang="scss">
.main {
    height: 100%;
    width: 100%;
    border-radius: 25px;
    box-shadow: 0 15px 15px rgba(0, 0, 0, 0.4), 0 -1px 20px rgba(0, 0, 0, 0.2);
    background-color: rgba(253, 253, 253, 0.75);
    border: 1px solid rgba(255, 255, 255, 0.125);
}

.order-container {
    border-radius: 25px;
    box-shadow: 0px 5px 7px rgba(0, 0, 0, 0.3), inset 0px 0px 0px rgba(0, 0, 0, 0);
    padding: 1vw;
    cursor: pointer;
    margin: 1vw;
    background-color: rgb(255, 228, 188);

}

.order-row {
    display: flex;
    justify-content: space-between;
}

tr,
th,
td {
    border: none;
}
</style>


