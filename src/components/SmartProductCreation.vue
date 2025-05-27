<template>
    <div class="smart-product-container">
        <!-- Modal -->
        <div class="modal" v-if="modalOpen">
            <div class="modal-content">
                <h2>Resultado del Webhook</h2>
                <div class="modal-body">
                    <div v-if="loading" class="loading">Cargando datos...</div>
                    <div v-else-if="productInfo" class="webhook-form">
                        <div class="form-group">
                            <label>Kcal</label>
                            <input v-model="productInfo.kcal" type="text" />
                        </div>
                        <div class="form-group">
                            <label>Grasa</label>
                            <input v-model="productInfo.fat" type="text" />
                        </div>
                        <div class="form-group">
                            <label>Carbohidratos</label>
                            <input v-model="productInfo.carbo" type="text" />
                        </div>
                        <div class="form-group">
                            <label>Proteína</label>
                            <input v-model="productInfo.protein" type="text" />
                        </div>
                        <div class="form-group">
                            <label>Ingredientes</label>
                            <textarea v-model="productInfo.sklad"></textarea>
                        </div>
                        <div class="form-group">
                            <label><input type="checkbox" v-model="productInfo.freeGluten" /> Sin Gluten</label>
                        </div>
                        <div class="form-group">
                            <label><input type="checkbox" v-model="productInfo.freeSugar" /> Sin Azúcar</label>
                        </div>
                        <div class="form-group">
                            <label><input type="checkbox" v-model="productInfo.freeLactose" /> Sin Lactosa</label>
                        </div>
                        <div class="form-group">
                            <label><input type="checkbox" v-model="productInfo.proteinic" /> Proteico</label>
                        </div>
                        <div class="form-group">
                            <label><input type="checkbox" v-model="productInfo.lowCarbo" /> Bajo en
                                Carbohidratos</label>
                        </div>
                    </div>
                    <div v-else class="webhook-data">
                        <pre>{{ webhookData }}</pre>
                    </div>
                </div>
                <button class="btn" @click="closeModal">Cerrar</button>
            </div>
        </div>

        <!-- Formulario -->
        <form @submit.prevent="submitForm" enctype="multipart/form-data" class="product-form">
            <div class="form-group">
                <input type="text" v-model="productName" placeholder="Nombre del producto" required />
            </div>
            <div class="form-group">
                <label class="file-input">
                    <input type="file" @change="handleFileUpload" accept="image/png" required />
                    <span>Seleccionar imagen PNG</span>
                </label>
            </div>
            <button type="submit" class="btn">Enviar</button>
        </form>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const productName = ref('');
const imageFile = ref(null);
const loading = ref(false);
const modalOpen = ref(false);
const webhookData = ref(null);
const productInfo = ref(null);

const handleFileUpload = (event) => {
    imageFile.value = event.target.files[0];
};

const submitForm = async () => {
    if (!imageFile.value) return;

    const formData = new FormData();
    formData.append('productName', productName.value);
    formData.append('image', imageFile.value);

    loading.value = true;
    modalOpen.value = true;

    try {
        const response = await fetch('http://localhost:5678/webhook-test/cb664c56-5f12-46d8-b10f-40a7af891817', {
            method: 'POST',
            body: formData,
        });

        const data = await response.json();
        webhookData.value = data;

        const arrayData = data["json "] || data.json || [];
        productInfo.value = Array.isArray(arrayData) && arrayData.length > 0 ? { ...arrayData[0] } : null;
    } catch (error) {
        webhookData.value = { error: 'Error al enviar el formulario o procesar la respuesta.' };
        productInfo.value = null;
        console.error(error);
    } finally {
        loading.value = false;
    }
};

const closeModal = () => {
    modalOpen.value = false;
};
</script>


<style lang="scss" scoped>
$primary-color: #e0e5ec;
$shadow-dark: #a3b1c6;
$shadow-light: #ffffff;
$text-color: #4a5568;

.smart-product-container {
    position: fixed; // Change from absolute to fixed
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 500px;
    height: auto;
    min-height: 400px;
    background: $primary-color;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    border-radius: 20px;
    box-shadow: 20px 20px 60px $shadow-dark,
        -20px -20px 60px $shadow-light;
    z-index: 10000; // Add high z-index
}

.product-form {
    width: 100%;
    max-width: 400px;
    background: $primary-color;
    padding: 2rem;
    border-radius: 20px;

    .form-group {
        margin-bottom: 1.5rem;
    }

    input[type="text"] {
        width: 100%;
        padding: 1rem;
        border: none;
        border-radius: 12px;
        background: $primary-color;
        box-shadow: inset 5px 5px 10px $shadow-dark,
            inset -5px -5px 10px $shadow-light;
        color: $text-color;
        font-size: 1rem;

        &:focus {
            outline: none;
            box-shadow: inset 3px 3px 5px $shadow-dark,
                inset -3px -3px 5px $shadow-light;
        }
    }
}

.file-input {
    display: block;
    padding: 1rem;
    border-radius: 12px;
    background: $primary-color;
    box-shadow: 8px 8px 15px $shadow-dark,
        -8px -8px 15px $shadow-light;
    cursor: pointer;
    text-align: center;
    color: $text-color;
    transition: all 0.3s ease;

    &:active {
        box-shadow: inset 5px 5px 10px $shadow-dark,
            inset -5px -5px 10px $shadow-light;
    }

    input[type="file"] {
        display: none;
    }
}

.btn {
    width: 100%;
    padding: 1rem;
    border: none;
    border-radius: 12px;
    background: $primary-color;
    box-shadow: 8px 8px 15px $shadow-dark,
        -8px -8px 15px $shadow-light;
    color: $text-color;
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.3s ease;

    &:active {
        box-shadow: inset 5px 5px 10px $shadow-dark,
            inset -5px -5px 10px $shadow-light;
    }
}

.modal {
    position: fixed;
    z-index: 10001; // Increase z-index to be higher than container
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(224, 229, 236, 0.95);
    display: flex;
    align-items: center;
    justify-content: center;

    .modal-content {
        position: relative;
        width: 500px;
        height: auto;
        min-height: 300px;
        background: $primary-color;
        padding: 2rem;
        border-radius: 20px;
        box-shadow: 8px 8px 15px $shadow-dark,
            -8px -8px 15px $shadow-light;

        h2 {
            color: $text-color;
            margin-bottom: 1.5rem;
            text-align: center;
        }

        .modal-body {
            padding: 1rem;
            border-radius: 12px;
            background: $primary-color;
            box-shadow: inset 5px 5px 10px $shadow-dark,
                inset -5px -5px 10px $shadow-light;
            margin-bottom: 1.5rem;

            pre {
                white-space: pre-wrap;
                word-wrap: break-word;
                color: $text-color;
            }
        }

        .loading {
            text-align: center;
            color: $text-color;
        }
    }
}
</style>
