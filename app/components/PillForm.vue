<script setup lang="ts">
const props = defineProps<{
  initialName?: string
  initialNote?: string
  submitLabel: string
}>()

const emit = defineEmits<{
  save: [name: string, note: string]
  cancel: []
}>()

const name = ref(props.initialName ?? '')
const note = ref(props.initialNote ?? '')
const nameError = ref('')
const nameInput = ref<HTMLInputElement | null>(null)

function submit() {
  if (!name.value.trim()) {
    nameError.value = 'Введите название таблетки.'
    nextTick(() => nameInput.value?.focus())
    return
  }
  emit('save', name.value, note.value)
}

function onNameInput() {
  if (nameError.value) nameError.value = ''
}
</script>

<template>
  <form class="card form" novalidate @submit.prevent="submit">
    <div>
      <label class="field-label" for="pill-name">Название</label>
      <input
        id="pill-name"
        ref="nameInput"
        v-model="name"
        class="field"
        :class="{ 'field--error': nameError }"
        type="text"
        :aria-describedby="nameError ? 'pill-name-error' : undefined"
        :aria-invalid="nameError ? 'true' : 'false'"
        autocomplete="off"
        @input="onNameInput"
      />
      <p v-if="nameError" id="pill-name-error" class="field-error" role="alert">
        {{ nameError }}
      </p>
    </div>

    <div>
      <label class="field-label" for="pill-note">Заметка</label>
      <input
        id="pill-note"
        v-model="note"
        class="field"
        type="text"
        placeholder="Необязательно"
        autocomplete="off"
      />
    </div>

    <div class="form__actions">
      <button type="button" class="btn btn--ghost" @click="emit('cancel')">
        Отмена
      </button>
      <button type="submit" class="btn">{{ submitLabel }}</button>
    </div>
  </form>
</template>