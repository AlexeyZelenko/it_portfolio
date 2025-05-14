<script setup>
import { defineProps } from 'vue';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import SelectButton from 'primevue/selectbutton';
import './language-selector.css';
defineProps({
  form: {
    type: Object,
    required: true
  }
});

const languages = [
  { name: 'English', value: 'en' },
  { name: 'Ukrainian', value: 'uk' },
];
</script>

<template>
  <div class="flex flex-col space-y-4 gap-4">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="field">
        <label for="title" class="block mb-2 font-medium">Title*</label>
        <InputText
            id="title"
            v-model="form.title"
            class="w-full"
            required
        />
      </div>

      <div class="field">
        <label for="subtitle" class="block mb-2 font-medium">Subtitle</label>
        <InputText id="subtitle" v-model="form.subtitle" class="w-full" />
      </div>
    </div>

    <div class="field">
      <label for="description" class="block mb-2 font-medium">Description*</label>
      <Textarea
          id="description"
          v-model="form.description"
          rows="5"
          class="w-full"
          required
      />
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="field">
        <label for="category" class="block mb-2 font-medium">Category</label>
        <InputText id="category" v-model="form.category" class="w-full" />
      </div>

      <div class="field">
        <label for="client" class="block mb-2 font-medium">Client</label>
        <InputText id="client" v-model="form.client" class="w-full" />
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="field">
        <label for="date" class="block mb-2 font-medium">Date</label>
        <InputText id="date" v-model="form.date" class="w-full" />
      </div>

      <div class="field">
        <label for="technologies" class="block mb-2 font-medium">Technologies</label>
        <InputText
            id="technologies"
            v-model="form.technologies"
            class="w-full"
            placeholder="Comma separated values"
        />
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="field">
        <label for="liveUrl" class="block mb-2 font-medium">Live URL</label>
        <InputText id="liveUrl" v-model="form.liveUrl" class="w-full" />
      </div>

      <div class="field">
        <label for="sourceUrl" class="block mb-2 font-medium">Source URL</label>
        <InputText id="sourceUrl" v-model="form.sourceUrl" class="w-full" />
      </div>
    </div>

    <div class="field my-4">
        <label for="projectLanguage" class="block mb-2 font-medium">Language</label>
        <SelectButton
            id="projectLanguage"
            v-model="form.language"
            :options="languages"
            optionLabel="name"
            optionValue="value"
            class="w-full"
        >
          <template #option="{ option, index }">
            <div class="flex items-center">
              <span class="flag-icon mr-2">{{ option.value === 'en' ? '🇬🇧' : '🇺🇦' }}</span>
              <span>{{ option.name }}</span>
            </div>
          </template>
        </SelectButton>
        <div class="language-indicator" v-if="form.language">
          <div class="flex items-center">
            <span class="flag-icon mr-2">{{ form.language === 'en' ? '🇬🇧' : '🇺🇦' }}</span>
            <span>{{ form.language === 'en' ? 'English content will be displayed' : 'Украинский контент будет отображаться' }}</span>
          </div>
        </div>
      </div>
  </div>
</template>