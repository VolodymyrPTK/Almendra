<template>
    <div class="main">
        <div>
            <div class="child"></div>
            <div class="child"></div>
        </div>
        <div class="child2"></div>
    </div>
</template>
  
<script>
import { ref } from 'vue';

export default {
    data() {
        return {
            showModal: false,
            input1: '',
            input2: '',
        };
    },
    methods: {
        openModal() {
            this.showModal = true;
        },
        submit() {
            // Handle the submit action here
            // For example, you can access the input values using this.input1 and this.input2
            console.log('Input 1:', this.input1);
            console.log('Input 2:', this.input2);

            // Close the modal after submitting
            this.showModal = false;
        },
    },
};
</script>
  
<style>
.main {
    justify-content: space-around;
    background-color: aqua;
    height: 100%;
    width: 100%;
    display: flex;
}

.child {
    background-color: rgb(31, 54, 54);
    height: 500px;
    width: 500px;
    border-radius: 25px;
}

.child2 {
    background-color: rgb(54, 31, 43);
    height: 100%;
    width: 50%;
}
</style>


