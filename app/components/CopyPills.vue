<script setup lang="ts">
import { usePills } from '~/composables/usePills'

const { selectedDateKey, copyPills, formatSelectedDate } = usePills()

const open = ref(false)
const sourceDate = ref('')
const message = ref('')

function yesterdayKey(): string {
  const d = new Date()
  d.setDate(d.getDate() - 1)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function toggle() {
  open.value = !open.value
  if (open.value) {
    sourceDate.value = yesterdayKey()
    message.value = ''
  }
}

function onCopy() {
  if (!sourceDate.value) return
  const copied = copyPills(sourceDate.value, selectedDateKey.value)
  message.value =
    copied > 0
      ? `Скопировано таблеток: ${copied}.`
      : 'В этом дне нет новых таблеток для копирования.'
}
</script>

<template>
  <div class="copy">
    <button
      class="btn btn--ghost btn--block"
      :aria-expanded="open"
      @click="toggle"
    >
      <AppIcon name="copy" :size="18" hidden />
      Скопировать из другого дня
    </button>

    <form v-if="open" class="card copy__form" @submit.prevent="onCopy">
      <p class="copy__desc">
        Таблетки из выбранного дня будут добавлены в&nbsp;день:
        <strong>{{ formatSelectedDate }}</strong>
      </p>
      <div>
        <label class="field-label" for="copy-source">День-источник</label>
        <input
          id="copy-source"
          v-model="sourceDate"
          class="field"
          type="date"
          required
        />
      </div>
      <p v-if="message" class="copy__msg" role="status">{{ message }}</p>
      <div class="form__actions">
        <button type="button" class="btn btn--ghost" @click="open = false">
          Закрыть
        </button>
        <button type="submit" class="btn">Скопировать</button>
      </div>
    </form>
  </div>
</template>