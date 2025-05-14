<script setup>
import { defineProps, defineEmits } from 'vue';
import FileUpload from 'primevue/fileupload';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';

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

const handleImageUpload = (event, index) => {
  if (event.files?.length) {
    const newImages = [...props.images];
    console.log(newImages);
    newImages[index].file = event.files[0];
    emit('update:images', newImages);
  }
};

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
      <div v-for="(imageInfo, index) in images" :key="index" class="mb-4">
        <div v-if="imageInfo.isExisting" class="flex items-center mb-2">
          <img
              :src="imageInfo.url"
              alt="Existing Image"
              class="w-20 h-20 object-cover mr-2 rounded"
          />
          <InputText
              :modelValue="imageInfo.description"
              @update:modelValue="val => updateDescription(index, val)"
              placeholder="Image description"
              class="w-full mr-2"
          />
          <Button
              icon="pi pi-trash"
              class="p-button-danger p-button-sm"
              @click="removeImage(index)"
          />
        </div>
        <div v-else class="mb-2">
          <FileUpload
              mode="basic"
              accept="image/*"
              :maxFileSize="1000000"
              @select="(event) => handleImageUpload(event, index)"
              :auto="false"
              chooseLabel="Browse Image"
              class="mb-2"
          />
          <InputText
              :modelValue="imageInfo.description"
              @update:modelValue="val => updateDescription(index, val)"
              placeholder="Image description"
              class="w-full"
          />
          <Button
              icon="pi pi-trash"
              class="p-button-danger p-button-sm mt-2"
              @click="removeImage(index)"
          />
        </div>
      </div>
      <Button
          label="Add More Images"
          icon="pi pi-plus"
          class="p-button-secondary p-button-sm mt-2"
          @click="$emit('add-image')"
      />
      <small class="text-gray-500 block mt-1">
        You can upload multiple images with descriptions.
      </small>
    </div>
  </div>
</template>