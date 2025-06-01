<template>
    <div class="overlay">
        <div class="smart-product-container">
            <!-- Modal -->
            <div class="modal" v-if="modalOpen">
                <div class="modal-content">
                    <h2>Новий Продукт</h2>
                    <div class="modal-body">
                        <div v-if="loading" class="loading">
                            <div class="spinner-ring"></div>
                            <p>Завантаження...</p>
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
                                                <label>Жири</label>
                                                <input v-model="productInfo.fat" type="text" />
                                            </div>
                                        </div>
                                        <div class="form-row">
                                            <div class="form-group">
                                                <label>Вуглеводи</label>
                                                <input v-model="productInfo.carbo" type="text" />
                                            </div>
                                            <div class="form-group">
                                                <label>Білки</label>
                                                <input v-model="productInfo.protein" type="text" />
                                            </div>
                                        </div>
                                    </div>
                                    <div class="form-group ingredients">
                                        <label>Склад</label>
                                        <textarea v-model="productInfo.sklad"></textarea>
                                    </div>
                                    <div class="form-group ingredients">
                                        <label>Вітаміни</label>
                                        <textarea v-model="productInfo.vitamins"></textarea>
                                    </div>
                                    <div class="checkbox-grid">
                                        <label><input type="checkbox" v-model="productInfo.freeGluten" /> Без
                                            Глютену</label>
                                        <label><input type="checkbox" v-model="productInfo.freeSugar" />Без
                                            Цукру</label>
                                        <label><input type="checkbox" v-model="productInfo.freeLactose" />Без
                                            Лактози</label>
                                        <label><input type="checkbox"
                                                v-model="productInfo.proteinic" />Протеїнове</label>
                                        <label><input type="checkbox" v-model="productInfo.lowCarbo" />Кето</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div v-else class="webhook-data">
                            <pre>{{ webhookData }}</pre>
                        </div>
                    </div>
                    <button class="btn primary-btn" @click="closeModal">Зберегти</button>
                    <button class="btn secondary-btn" @click="closeModal">Закрити</button>
                </div>
            </div>

            <!-- Formulario inicial -->
            <form @submit.prevent="submitForm" enctype="multipart/form-data" class="product-form">
                <h2>Створити новий продукт</h2>
                <div class="form-group">
                    <input type="text" v-model="productName" placeholder="Nombre del producto" required />
                </div>
                <div class="form-group">
                    <label class="file-input">
                        <input type="file" @change="handleFileUpload" accept="image/png" required />
                        <span>Вибрати зображення</span>
                    </label>
                </div>
                <button type="submit" class="btn">Почати</button>
            </form>
        </div>
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
                if (item.imageUrl) {
                    imageUrl.value = item.imageUrl;
                } else if (item.kcal) {
                    productInfo.value = { ...item };
                } else if (item.vitamins) {
                    // Ініціалізувати, якщо ще не створений
                    if (!productInfo.value) productInfo.value = {};
                    productInfo.value.vitamins = item.vitamins.response || '';
                }
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

.overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
}

.smart-product-container {
    position: relative; // Change from fixed to relative
    width: 90%;
    max-width: 1200px;
    background: $primary-color;
    border-radius: 15px;
    box-shadow: 0 5px 15px $shadow-color;
    padding: 2rem;
    margin: 0; // Add explicit margin reset
    transform: none; // Remove transform

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
        right: 0;
        bottom: 0;
        width: 100vw;
        height: 100vh;
        background: rgba(41, 41, 41, 0.6);
        backdrop-filter: blur(5px);
        -webkit-backdrop-filter: blur(5px);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1100;
        overflow: hidden;

        .modal-content {
            width: 90%;
            max-width: 1000px;
            background: $primary-color;
            border-radius: 15px;
            padding: 2rem;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);

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
                width: 70%;
                padding: 0.75rem;
                border: 1px solid $border-color;
                border-radius: 18px;
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
        align-self: center;
        border: none;
        padding: 0.5vw;
        margin: 0.5vw;
        color: black;
        font-size: 2vh;
        text-decoration: none;
        text-align: center;
        border-radius: 25px;

        &:hover {
            box-shadow: 0 3px 3px rgba(0, 0, 0, 0.3), inset 0 0 0 rgba(0, 0, 0, 0.3);
            transition: 0.3s;
        }
    }

    .primary-btn {
        width: 30%;
        background-color: rgb(255, 255, 255);
        box-shadow: 0px 5px 7px rgba(0, 0, 0, 0.3), inset 0 0 0 rgba(0, 0, 0, 0.3);
    }

    .secondary-btn {
        background-color: rgb(255, 255, 255);
        box-shadow: 0px 3px 5px rgba(0, 0, 0, 0.3), inset 0 0 0 rgba(0, 0, 0, 0.3);
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
}
</style>
