<template>
    <transition name="modal-animation">
        <div v-show="modalActive" class="modal">
            <transition name="content-animation">
                <div class="modalContent">
                    <div class="inputs">
                        <input type="text" placeholder="Назва товару">
                        <input type="text" placeholder="Деталі">
                        <input type="number" placeholder="Ціна">
                    </div>
                    <textarea type="text" placeholder="Опис"></textarea>
                    <div class="inputs">
                        <div>
                            <input type="text" placeholder="КБЖУ">
                            <select>
                                <option disabled value="">Бренд</option>
                                <option>Bebig</option>
                                <option>Holms</option>
                                <option>Gullon</option>
                            </select>
                            <select class="menus">
                                <option disabled value="">Категорія</option>
                                <option>Паста</option>
                                <option>Снеки</option>
                                <option>Напої</option>
                            </select>
                        </div>
                        <div class="file-upload">
                            <input type="file" @change="uploadImage" />
                            <img class="btnimg" src="../assets/btnimg.png" alt="icon">
                        </div>
                    </div>
                    <div class="chekBoxes">
                        <input type="checkbox" class="checkbox" id="checkbox" />
                        <label for="checkbox">Free gluten</label>
                        <input type="checkbox" class="checkbox" id="checkbox" />
                        <label for="checkbox">Free sugar</label>
                        <input type="checkbox" class="checkbox" id="checkbox" />
                        <label for="checkbox">Free lactosa</label>
                        <input type="checkbox" class="checkbox" id="checkbox" />
                        <label for="checkbox">Vegan</label>
                    </div>
                    <div>
                        <button class="productbutton" @click="close">Зберегти</button>
                        <button class="productbutton" @click="close">Закрити</button>
                    </div>
                </div>
            </transition>
        </div>
    </transition>
</template>

<script>
export default {
    props: ['modalActive'],
    setup(props, { emit }) {
        const close = () => {
            emit("close");
        };
        return { close };
    },
};


    //async editProduct(id) {
    //  const refDoc = doc(db, "products", id);
     // await updateDoc(refDoc, { name: this.product.name, brand: this.product.brand }); //not woorking
   // },

</script>

<style lang="scss" scoped>
.modal-animation-enter-active,
.modal-animation-leave-active {
    transition: opacity 0.5s cubic-bezier(0.075, 0.82, 0.165, 1);
}

.modal-animation-enter-from,
.modal-animation-leave-to {
    opacity: 0;
}

.modal {
    position: absolute;
    display: flex;
    left: 0;
    top: 0;
    background-color: rgba(0, 0, 0, 0.3);
    height: 100%;
    width: 100%;
    justify-content: center;
    align-items: center;
    backdrop-filter: blur(15px);
}

.modalContent {
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: #f0f0f0;
    border-radius: 25px;
    height: 700px;
    width: 700px;
    box-shadow: 0 15px 50px rgb(107, 107, 107);
}

.chekBoxes {
    display: flex;
}

.checkbox {
    height: 15px;
    width: 15px;
}

.file-upload {
    height: 40px;
    width: 40px;
    border-radius: 25px;
    border: none;
    box-shadow: 4px 4px 4px rgb(200, 200, 200), -4px -4px 4px rgb(255, 255, 255);
    background-color: transparent;
    margin: 0 5px 0 5px;
    display: flex;
    align-items: center;
    justify-content: center;

    input[type='file'] {
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

.inputs {
    justify-content: space-around;
    display: flex;
    width: 95%;
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
    margin: 0 5px 0 5px;
}

select {
    text-align: center;
    height: 40px;
    width: 30%;
    border-radius: 25px;
    border: none;
    box-shadow: 4px 4px 4px rgb(200, 200, 200) inset, -4px -4px 4px rgb(255, 255, 255) inset;
    background-color: transparent;
    margin: 0 5px 0 5px;
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
    margin: 50px;
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