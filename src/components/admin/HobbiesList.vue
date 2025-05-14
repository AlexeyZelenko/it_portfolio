<script setup lang="ts">
import { useHobbiesStore } from '../../stores/hobbies';
import { useToast } from 'primevue/usetoast';
import { ref } from 'vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';

// Определение интерфейса для объекта Hobby (соответствует структуре в store)
interface Hobby {
  id?: string;
  title: string;
  description: string;
  type: 'music' | 'fishing' | 'sport' | 'art' | 'other' | string;
  equipment: string[];
  photos: string[];
}

// Emits
interface Emits {
  (event: 'edit', hobby: Hobby): void;
  (event: 'delete'): void;
}

defineProps({
  hobbies: {
    type: Array as () => Hobby[] | undefined,
    default: () => []
  },
  isLoading: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits<Emits>();

const hobbiesStore = useHobbiesStore();
const toast = useToast();
const isDeleting = ref(false);

const deleteHobby = async (hobby: Hobby) => {
  if (isDeleting.value) return;

  isDeleting.value = true;
  try {
    if (hobby.id) {
      await hobbiesStore.deleteHobby(hobby.id);
      toast.add({ severity: 'success', summary: 'Успех', detail: 'Хобби удалено', life: 3000 });
      emit('delete');
    } else {
      toast.add({ severity: 'warn', summary: 'Предупреждение', detail: 'ID хобби не определен', life: 3000 });
    }
  } catch (error: any) {
    console.error('Ошибка при удалении хобби:', error);
    toast.add({ severity: 'error', summary: 'Ошибка', detail: `Не удалось удалить хобби: ${error?.message || 'Неизвестная ошибка'}`, life: 3000 });
  } finally {
    isDeleting.value = false;
  }
};

const getHobbyTypeName = (type: Hobby['type']): string => {
  const types: Record<Hobby['type'], string> = {
    'music': 'Музыка',
    'fishing': 'Рыбалка',
    'sport': 'Спорт',
    'art': 'Искусство',
    'other': 'Другое'
  };
  return types[type] || type;
};
</script>

<template>
  <DataTable
      :value="hobbies"
      :loading="isLoading"
      class="p-datatable-sm"
  >
    <Column field="title" header="Название" />
    <Column field="type" header="Тип">
      <template #body="slotProps">
        {{ getHobbyTypeName(slotProps.data.type) }}
      </template>
    </Column>
    <Column field="equipment" header="Оборудование">
      <template #body="slotProps">
        <div class="flex flex-wrap gap-1">
          <span
              v-for="(item, index) in slotProps.data.equipment"
              :key="index"
              class="px-2 py-1 bg-primary-100 text-primary-900 rounded-md text-xs"
          >
            {{ item }}
          </span>
        </div>
      </template>
    </Column>
    <Column field="photos" header="Фото">
      <template #body="slotProps">
        {{ slotProps.data.photos?.length || 0 }} фото
      </template>
    </Column>
    <Column header="Действия">
      <template #body="slotProps">
        <Button
            icon="pi pi-pencil"
            class="p-button-rounded p-button-sm mr-2"
            @click="emit('edit', slotProps.data)"
        />
        <Button
            icon="pi pi-trash"
            class="p-button-rounded p-button-sm p-button-danger"
            :disabled="isDeleting"
            @click="deleteHobby(slotProps.data)"
        />
      </template>
    </Column>
  </DataTable>
</template>