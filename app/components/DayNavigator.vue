<script setup lang="ts">
import { usePills } from '~/composables/usePills'

const { isToday, formatSelectedDate, goPrevDay, goNextDay, goToday } =
  usePills()
</script>

<template>
  <nav class="daynav" aria-label="Навигация по дням">
    <button
      class="daynav__arrow icon-btn"
      aria-label="Предыдущий день"
      @click="goPrevDay"
    >
      <AppIcon name="chevron-left" :size="24" hidden />
    </button>

    <button
      class="daynav__center"
      :aria-label="isToday ? 'Сегодняшний день' : 'Вернуться к сегодняшнему дню'"
      @click="goToday"
    >
      <span class="daynav__date" :class="{ 'daynav__date--today': isToday }">
        {{ formatSelectedDate }}
      </span>
      <span v-if="!isToday" class="daynav__hint">
        <AppIcon name="calendar" :size="14" hidden />
        Сегодня
      </span>
    </button>

    <button
      class="daynav__arrow icon-btn"
      aria-label="Следующий день"
      @click="goNextDay"
    >
      <AppIcon name="chevron-right" :size="24" hidden />
    </button>
  </nav>
</template>