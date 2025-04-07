<template>
    <div class="kanban-container">
        <div class="columns-container">
            <div v-for="(column, columnIndex) in columns" :key="columnIndex" class="column" @dragover.prevent
                @drop="dropOrder($event, column.status)">
                <h2>{{ column.title }}</h2>
                <div class="tasks">
                    <div v-for="order in getOrdersByStatus(column.status)" :key="order.id" class="task" draggable="true"
                        @dragstart="dragOrder($event, order)">
                        <div class="order-header">
                            <span>Замовлення № {{ order.orderId }}</span>
                            <span>{{ order.total }} грн</span>
                        </div>
                        <div class="order-details">
                            <div>{{ order.secondName }} {{ order.firstName }}</div>
                            <div>{{ order.time }}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { onSnapshot, updateDoc, doc } from "firebase/firestore";
import { orderReg } from "../main";

const orders = ref([]);
const draggedOrder = ref(null);

const columns = reactive([
    { title: 'Обробляється', status: 'Processing' },
    { title: 'Комплектується', status: 'Preparing' },
    { title: 'Комплектовано', status: 'Prepared' },
    { title: 'Відправлено', status: 'Shipped' },
    { title: 'Отримано', status: 'Received' }
]);

const getOrdersByStatus = (status) => {
    return orders.value.filter(order => order.orderStatus === status);
};

const dragOrder = (event, order) => {
    draggedOrder.value = order;
    event.dataTransfer.effectAllowed = 'move';
};

const dropOrder = async (event, newStatus) => {
    if (draggedOrder.value && draggedOrder.value.orderStatus !== newStatus) {
        try {
            await updateDoc(doc(orderReg, draggedOrder.value.id), {
                orderStatus: newStatus
            });
        } catch (error) {
            console.error("Error updating order status:", error);
        }
    }
};

onSnapshot(orderReg, (snapshot) => {
    orders.value = [];
    snapshot.docs.forEach((doc) => {
        orders.value.push({ ...doc.data(), id: doc.id });
    });
    orders.value.sort((b, a) => a.orderId - b.orderId);
});
</script>

<style lang="scss" scoped>
.kanban-container {
    height: 90%;
    padding: 2rem;
    font-family: 'Arial', sans-serif;

    .columns-container {
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        gap: 20px;
        height: 100%; // Added height: 100%
        min-height: calc(80vh - 4rem); // Account for padding

        .column {
            height: 100%; // Changed from height: 100 to height: 100%
            padding: 1rem;
            border-radius: 25px;
            background: rgba(255, 255, 255, 0.15);
            backdrop-filter: blur(12px);
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
            display: flex;
            flex-direction: column;

            h2 {
                margin-top: 0;
                color: #333;
                font-size: 18px;
                padding-bottom: 12px;
                border-bottom: 1px solid rgba(0, 0, 0, 0.1);
            }

            .tasks {
                flex: 1;
                display: flex;
                flex-direction: column;
                gap: 12px;
                margin-top: 12px;
                overflow-y: auto; // Add scrollbar only when needed
                min-height: 0; // This is crucial for enabling proper flex scrolling
                padding-right: 8px; // Add some padding for the scrollbar

                &::-webkit-scrollbar {
                    width: 6px;
                }

                &::-webkit-scrollbar-track {
                    background: rgba(0, 0, 0, 0.05);
                    border-radius: 3px;
                }

                &::-webkit-scrollbar-thumb {
                    background: rgba(0, 0, 0, 0.15);
                    border-radius: 3px;
                }

                .task {
                    padding: 16px;
                    border-radius: 8px;
                    background: rgba(255, 255, 255, 0.65);
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.3);
                    cursor: grab;
                    transition: all 0.2s ease;

                    .order-header {
                        display: flex;
                        justify-content: space-between;
                        font-weight: bold;
                        margin-bottom: 8px;
                    }

                    .order-details {
                        color: #666;
                        font-size: 0.9em;
                    }

                    &:hover {
                        transform: translateY(-2px);
                        box-shadow: 0 6px 12px rgba(0, 0, 0, 0.08);
                    }

                    &:active {
                        cursor: grabbing;
                    }
                }
            }
        }
    }
}

@media (max-width: 1024px) {
    .columns-container {
        grid-template-columns: repeat(2, 1fr);
    }
}

@media (max-width: 640px) {
    .columns-container {
        grid-template-columns: 1fr;
    }
}
</style>