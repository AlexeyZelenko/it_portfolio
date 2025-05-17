<script setup>
// Cleanup object URLs when component unmounts
import { defineProps, defineEmits, ref, computed, onBeforeUnmount } from 'vue';
import FileUpload from 'primevue/fileupload';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import OrderList from 'primevue/orderlist';

// Explicitly defining File type for type checking
const File = window.File;

// Track created URLs for cleanup
const createdObjectUrls = ref([]);

const props = defineProps({
  images: {
    type: Array,
    required: true
  }
});

const emit = defineEmits([
  'update:images',
  'add-image',
  'remove-image',
  'image-upload'
]);

// Local copy of props.images to use with OrderList
const localImages = computed({
  get: () => {
    // Ensure each image has a unique ID
    return ensureImageIds(props.images);
  },
  set: (value) => emit('update:images', value)
});

const handleImageUpload = (event, index) => {
  if (event.files?.length) {
    const newImages = [...props.images];
    newImages[index].file = event.files[0];
    emit('update:images', newImages);
  }
};

// Ensure each image has a unique ID
const ensureImageIds = (images) => {
  return images.map((img, index) => {
    if (!img.id) {
      return { ...img, id: `img_${Date.now()}_${index}` };
    }
    return img;
  });
};

const handleMultipleImageUpload = (event) => {
  if (event.files?.length) {
    const newImages = [...props.images];
    const existingCount = newImages.length;

    // Удаляем пустые поля для изображений
    const nonEmptyImages = newImages.filter(img => img.file || img.isExisting);

    // Добавляем новые изображения
    Array.from(event.files).forEach((file, idx) => {
      nonEmptyImages.push({
        id: `img_${Date.now()}_${idx}`,
        file: file,
        description: '',
        isExisting: false
      });
    });

    emit('update:images', nonEmptyImages);
  }
};

const reorderImages = (event) => {
  // Only emit if event.value exists
  if (event && event.value) {
    emit('update:images', event.value);
  }
};

// Helper function to safely create object URLs
const getImageUrl = (file) => {
  try {
    if (file && typeof URL !== 'undefined' && typeof URL.createObjectURL === 'function') {
      const url = URL.createObjectURL(file);
      createdObjectUrls.value.push(url);
      return url;
    }
    return '';
  } catch (error) {
    console.error('Error creating object URL:', error);
    return '';
  }
};

// Clean up object URLs when component unmounts
onBeforeUnmount(() => {
  createdObjectUrls.value.forEach(url => {
    try {
      if (typeof URL !== 'undefined' && typeof URL.revokeObjectURL === 'function') {
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Error revoking object URL:', error);
    }
  });
});

const removeImage = (index) => {
  const newImages = [...props.images];
  newImages.splice(index, 1);
  emit('update:images', newImages);
};

const updateDescription = (index, value) => {
  const newImages = [...props.images];
  newImages[index].description = value;
  emit('update:images', newImages);
};
</script>

<template>
  <div class="space-y-4 my-4">
    <div class="field">
      <label class="block mb-2 font-medium">Project Images</label>

      <!-- Загрузка нескольких изображений одновременно -->
      <div class="mb-4">
        <FileUpload
            mode="basic"
            accept="image/*"
            :multiple="true"
            :maxFileSize="1000000"
            @select="handleMultipleImageUpload"
            :auto="false"
            chooseLabel="Upload Multiple Images"
            class="mb-2 w-full"
        />
        <small class="text-gray-500 block mt-1 mb-4">
          Выберите несколько изображений одновременно (до 5 МБ каждое).
        </small>
      </div>

      <!-- Список изображений с возможностью перетаскивания -->
      <OrderList
          v-if="images && images.length > 0"
          v-model="localImages"
          dataKey="id"
          class="mb-4"
          listStyle="height:auto"
      >
        <template #header>
          <div class="flex justify-between items-center">
            <span>Изображения проекта</span>
            <Button
                label="Добавить еще"
                icon="pi pi-plus"
                class="p-button-secondary p-button-sm"
                @click="$emit('add-image')"
            />
          </div>
        </template>
        <template #item="slotProps">
          <div class="flex flex-col md:flex-row items-start md:items-center p-2 w-full" :key="slotProps.item.id">
            <div class="flex items-center mb-2 md:mb-0 mr-0 md:mr-4">
              <div class="flex-shrink-0 w-20 h-20 relative bg-gray-100 rounded flex items-center justify-center">
                <img
                    v-if="slotProps.item.isExisting || (slotProps.item.file && typeof File !== 'undefined' && slotProps.item.file instanceof File && slotProps.item.file.type && slotProps.item.file.type.startsWith('image/'))"
                    :src="slotProps.item.isExisting ? slotProps.item.url : getImageUrl(slotProps.item.file)"
                    alt="Project Image"
                    class="w-20 h-20 object-cover rounded"
                />
                <i v-else class="pi pi-image text-gray-400 text-2xl"></i>
              </div>
            </div>
            <div class="flex-grow">
              <div class="flex flex-col md:flex-row w-full gap-2">
                <div class="flex-grow">
                  <InputText
                      :modelValue="slotProps.item.description"
                      @update:modelValue="val => updateDescription(slotProps.index, val)"
                      placeholder="Описание изображения"
                      class="w-full"
                  />
                </div>
                <div v-if="!slotProps.item.isExisting && !slotProps.item.file" class="flex-shrink-0">
                  <FileUpload
                      mode="basic"
                      accept="image/*"
                      :maxFileSize="1000000"
                      @select="(event) => handleImageUpload(event, slotProps.index)"
                      :auto="false"
                      chooseLabel="Выбрать"
                      class="p-button-sm"
                  />
                </div>
                <Button
                    icon="pi pi-trash"
                    class="p-button-danger p-button-sm flex-shrink-0"
                    @click="removeImage(slotProps.index)"
                />
              </div>
              <small v-if="slotProps.item.file" class="text-gray-500 block mt-1">
                {{ slotProps.item.file.name }}
              </small>
            </div>
          </div>
        </template>
      </OrderList>

      <small class="text-gray-500 block mt-1">
        Перетащите изображения, чтобы изменить их порядок. Первое изображение будет использоваться как основное.
      </small>
    </div>
  </div>
</template>