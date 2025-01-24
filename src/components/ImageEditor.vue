<script setup>
import { ref, watch } from 'vue';
import { Cropper } from 'vue-advanced-cropper';
import 'vue-advanced-cropper/dist/style.css';

const props = defineProps({
    imageUrl: {
        type: String,
        required: true,
    },
    isVisible: {
        type: Boolean,
        required: true,
    },
    fileName: {
        type: String,
        required: false,
        default: 'image.png'
    }
});

const emit = defineEmits(['close', 'update']);

const cropperRef = ref(null);
const croppedImage = ref(null);
const isCropping = ref(false);
const hasPreview = ref(false);
const isLoading = ref(false);

const startCropping = () => {
    isCropping.value = true;
    hasPreview.value = false;
};

const saveCroppedImage = async () => {
    if (!cropperRef.value) return;
    const result = cropperRef.value.getResult();
    if (result) {
        const { coordinates, canvas } = result;
        const outputCanvas = document.createElement('canvas');
        const ctx = outputCanvas.getContext('2d');
        outputCanvas.width = coordinates.width;
        outputCanvas.height = coordinates.height;
        ctx.drawImage(
            canvas,
            coordinates.left,
            coordinates.top,
            coordinates.width,
            coordinates.height,
            0,
            0,
            coordinates.width,
            coordinates.height
        );

        // Determine MIME type from original file extension
        let mimeType = 'image/png';
        if (props.fileName.toLowerCase().endsWith('.jpg') ||
            props.fileName.toLowerCase().endsWith('.jpeg')) {
            mimeType = 'image/jpeg';
        }

        const blob = await new Promise((resolve) => {
            outputCanvas.toBlob((blob) => resolve(blob), mimeType);
        });

        const file = new File([blob], props.fileName, { type: mimeType });

        if (croppedImage.value && croppedImage.value.startsWith('blob:')) {
            URL.revokeObjectURL(croppedImage.value);
        }
        croppedImage.value = URL.createObjectURL(file);
        isCropping.value = false;
        hasPreview.value = true;
    }
};

const confirmAndSave = () => {
    if (!croppedImage.value) return;

    fetch(croppedImage.value)
        .then(res => res.blob())
        .then(blob => {
            // Create new blob with original MIME type
            const mimeType = props.fileName.toLowerCase().endsWith('.jpg') ||
                props.fileName.toLowerCase().endsWith('.jpeg')
                ? 'image/jpeg' : 'image/png';

            const processedBlob = new Blob([blob], { type: mimeType });
            emit('update', processedBlob);
            hasPreview.value = false;
        });
};

const cancelCropping = () => {
    isCropping.value = false;
    if (hasPreview.value) {
        hasPreview.value = false;
        croppedImage.value = null;
    }
};

const closeModal = () => {
    emit('close');
};

// Add this watch to reset state when imageUrl changes
watch(() => props.imageUrl, () => {
    croppedImage.value = null;
    isCropping.value = false;
    hasPreview.value = false;
});
</script>

<template>
    <div v-if="isVisible" class="modal-overlay" @click.self="closeModal">
        <div class="modal-content">
            <div class="modal-header">
                <h3>Image Editor</h3>
                <button @click="closeModal" class="close-btn">×</button>
            </div>

            <!-- Imagen o Cropper -->
            <div v-if="!isCropping" class="image-container">
                <img :src="croppedImage || imageUrl" alt="Selected Image" class="image-preview" />
                <p v-if="!croppedImage && !imageUrl">Cargando imagen...</p>
            </div>
            <div v-else class="cropper-container">
                <Cropper ref="cropperRef" :src="imageUrl"
                    :stencil-props="{ aspectRatio: null, movable: true, resizable: true }" :background="true"
                    :transitions="true" />
            </div>

            <!-- Botones -->
            <div class="modal-footer">
                <template v-if="!isCropping">
                    <button v-if="!hasPreview" @click="startCropping" class="action-btn">
                        Recortar Imagen
                    </button>
                    <template v-else>
                        <button @click="confirmAndSave" class="save-btn">
                            Guardar Cambios
                        </button>
                        <button @click="cancelCropping" class="cancel-btn">
                            Descartar Cambios
                        </button>
                    </template>
                </template>
                <template v-else>
                    <button @click="saveCroppedImage" class="save-btn">
                        Previsualizar Recorte
                    </button>
                    <button @click="cancelCropping" class="cancel-btn">
                        Cancelar
                    </button>
                </template>
            </div>
        </div>
    </div>
</template>


<style scoped>
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.modal-content {
    background: #1e1e1e;
    padding: 20px;
    border-radius: 8px;
    width: 90vw;
    max-width: 800px;
    color: white;
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
}

.close-btn {
    background: none;
    border: none;
    color: white;
    font-size: 1.5rem;
    cursor: pointer;
}

.image-container {
    display: flex;
    justify-content: center;
    align-items: center;
    background: #2c2c2c;
    border-radius: 4px;
    overflow: hidden;
    height: 60vh;
}

.image-preview {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
}

.cropper-container {
    height: 60vh;
    background: #2c2c2c;
    border: 1px solid #444;
    border-radius: 4px;
    overflow: hidden;
}

.modal-footer {
    margin-top: 15px;
    display: flex;
    justify-content: flex-end;
    gap: 10px;
}

button {
    padding: 8px 12px;
    border: none;
    border-radius: 4px;
    font-weight: bold;
    cursor: pointer;
}

.action-btn {
    background: #007bff;
    color: white;
}

.action-btn:hover {
    background: #0056b3;
}

.save-btn {
    background: #28a745;
    color: white;
}

.save-btn:hover {
    background: #218838;
}

.cancel-btn {
    background: #dc3545;
    color: white;
}

.cancel-btn:hover {
    background: #c82333;
}
</style>
