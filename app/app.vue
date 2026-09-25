<script setup lang="ts">
import { usePills } from '~/composables/usePills'

const { pills, takenCount, addPill } = usePills()

const showAddForm = ref(false)

const progressPercent = computed(() =>
  pills.value.length === 0
    ? 0
    : Math.round((takenCount.value / pills.value.length) * 100),
)
</script>

<template>
  <div class="app">
    <h1 class="app__title">Мои таблетки</h1>

    <DayNavigator />

    <div v-if="pills.length > 0" class="progress card" role="status">
      <div
        class="progress__bar"
        role="progressbar"
        aria-valuemin="0"
        aria-valuemax="100"
        :aria-valuenow="progressPercent"
        :aria-label="`Принято ${takenCount} из ${pills.length} таблеток`"
      >
        <div class="progress__fill" :style="{ width: `${progressPercent}%` }" />
      </div>
      <span class="progress__label">{{ takenCount }}/{{ pills.length }}</span>
    </div>

    <PillList />

    <CopyPills />

    <button
      v-if="!showAddForm"
      class="btn btn--block"
      @click="showAddForm = true"
    >
      <AppIcon name="plus" :size="20" hidden />
      Добавить таблетку
    </button>
    <PillForm
      v-else
      submit-label="Сохранить"
      @save="(name, note) => { addPill(name, note); showAddForm = false }"
      @cancel="showAddForm = false"
    />

    <StatsPanel />

    <CelebrationModal />
  </div>
</template>