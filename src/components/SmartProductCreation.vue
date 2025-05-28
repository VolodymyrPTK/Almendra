<template>
    <div class="smart-product-container">
        <!-- Modal -->
        <div class="modal" v-if="modalOpen">
            <div class="modal-content">
                <h2>Resultado del Webhook</h2>
                <div class="modal-body">
                    <div v-if="loading" class="loading">
                        <div class="spinner-ring"></div>
                        <p>Cargando datos...</p>
                    </div>
                    <div v-else-if="productInfo" class="webhook-form">
                        <div class="form-layout">
                            <div class="image-section">
                                <div v-if="imageUrl" class="image-preview">
                                    <img :src="imageUrl" alt="Imagen del producto" />
                                </div>
                            </div>
                            <div class="form-section">
                                <div class="nutritional-info">
                                    <div class="form-row">
                                        <div class="form-group">
                                            <label>Kcal</label>
                                            <input v-model="productInfo.kcal" type="text" />
                                        </div>
                                        <div class="form-group">
                                            <label>Grasa</label>
                                            <input v-model="productInfo.fat" type="text" />
                                        </div>
                                    </div>
                                    <div class="form-row">
                                        <div class="form-group">
                                            <label>Carbohidratos</label>
                                            <input v-model="productInfo.carbo" type="text" />
                                        </div>
                                        <div class="form-group">
                                            <label>Proteína</label>
                                            <input v-model="productInfo.protein" type="text" />
                                        </div>
                                    </div>
                                </div>
                                <div class="form-group ingredients">
                                    <label>Ingredientes</label>
                                    <textarea v-model="productInfo.sklad"></textarea>
                                </div>
                                <div class="checkbox-grid">
                                    <label><input type="checkbox" v-model="productInfo.freeGluten" /> Sin Gluten</label>
                                    <label><input type="checkbox" v-model="productInfo.freeSugar" /> Sin Azúcar</label>
                                    <label><input type="checkbox" v-model="productInfo.freeLactose" /> Sin
                                        Lactosa</label>
                                    <label><input type="checkbox" v-model="productInfo.proteinic" /> Proteico</label>
                                    <label><input type="checkbox" v-model="productInfo.lowCarbo" /> Bajo en
                                        Carbohidratos</label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div v-else class="webhook-data">
                        <pre>{{ webhookData }}</pre>
                    </div>
                </div>
                <button class="btn" @click="closeModal">Cerrar</button>
            </div>
        </div>

        <!-- Formulario inicial -->
        <form @submit.prevent="submitForm" enctype="multipart/form-data" class="product-form">
            <h2>Crear Nuevo Producto</h2>
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
const imageUrl = ref(null);

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

        const arrayData = data["json "] || data.json || data;
        if (Array.isArray(arrayData)) {
            for (const item of arrayData) {
                if (item.imageUrl) imageUrl.value = item.imageUrl;
                else if (item.kcal) productInfo.value = { ...item };
            }
        }
    } catch (error) {
        webhookData.value = { error: 'Error al enviar el formulario o procesar la respuesta.' };
        productInfo.value = null;
        imageUrl.value = null;
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
$primary-color: #ffffff;
$secondary-color: #f8f9fa;
$accent-color: #007bff;
$text-color: #2c3e50;
$border-color: #dee2e6;
$success-color: #28a745;
$shadow-color: rgba(0, 0, 0, 0.1);

.smart-product-container {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 90%;
    max-width: 1200px;
    background: $primary-color;
    border-radius: 15px;
    box-shadow: 0 5px 15px $shadow-color;
    padding: 2rem;
    z-index: 1000;
}

.product-form {
    max-width: 500px;
    margin: 0 auto;
    padding: 2rem;
    background: $primary-color;
    border-radius: 10px;

    h2 {
        text-align: center;
        color: $text-color;
        margin-bottom: 2rem;
    }

    .form-group {
        margin-bottom: 1.5rem;

        input[type="text"] {
            width: 100%;
            padding: 0.75rem 1rem;
            border: 1px solid $border-color;
            border-radius: 8px;
            font-size: 1rem;
            transition: border-color 0.3s;

            &:focus {
                outline: none;
                border-color: $accent-color;
            }
        }
    }
}

.file-input {
    display: block;
    padding: 1rem;
    text-align: center;
    background: $secondary-color;
    border: 2px dashed $border-color;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s;

    &:hover {
        border-color: $accent-color;
        background: lighten($secondary-color, 2%);
    }

    input[type="file"] {
        display: none;
    }
}

.modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1100;

    .modal-content {
        width: 90%;
        max-width: 1000px;
        background: $primary-color;
        border-radius: 15px;
        padding: 2rem;

        h2 {
            text-align: center;
            color: $text-color;
            margin-bottom: 1.5rem;
        }
    }
}

.form-layout {
    display: grid;
    grid-template-columns: 300px 1fr;
    gap: 2rem;
    margin-bottom: 2rem;
}

.image-section {
    .image-preview {
        width: 100%;
        height: 300px;
        border-radius: 10px;
        overflow: hidden;
        box-shadow: 0 3px 10px $shadow-color;

        img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
    }
}

.form-section {
    .nutritional-info {
        margin-bottom: 2rem;
    }

    .form-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
        margin-bottom: 1rem;
    }

    .form-group {
        label {
            display: block;
            margin-bottom: 0.5rem;
            color: $text-color;
        }

        input[type="text"] {
            width: 100%;
            padding: 0.75rem;
            border: 1px solid $border-color;
            border-radius: 8px;
        }

        &.ingredients {
            textarea {
                width: 100%;
                height: 100px;
                padding: 0.75rem;
                border: 1px solid $border-color;
                border-radius: 8px;
                resize: vertical;
            }
        }
    }
}

.checkbox-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
    margin-top: 1.5rem;

    label {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        color: $text-color;

        input[type="checkbox"] {
            width: 18px;
            height: 18px;
        }
    }
}

.btn {
    width: 100%;
    padding: 0.75rem 1.5rem;
    background: $accent-color;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.3s;

    &:hover {
        background: darken($accent-color, 5%);
    }
}

.loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 2rem;

    .spinner-ring {
        width: 40px;
        height: 40px;
        border: 3px solid $border-color;
        border-top-color: $accent-color;
        border-radius: 50%;
        animation: spin 1s linear infinite;
    }
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}
</style>
