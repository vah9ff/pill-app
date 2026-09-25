<script setup lang="ts">
import { usePills } from '~/composables/usePills'

const { weekdayStats, totalTaken } = usePills()

const open = ref(false)
</script>

<template>
  <div class="stats">
    <button
      class="btn btn--ghost btn--block"
      :aria-expanded="open"
      @click="open = !open"
    >
      <AppIcon name="chart" :size="18" hidden />
      Статистика
    </button>

    <div v-if="open" class="card stats__panel">
      <p v-if="totalTaken === 0" class="stats__empty">
        Пока нет данных — отмечайте принятые таблетки, и статистика появится
        здесь.
      </p>
      <template v-else>
        <div
          v-for="s in weekdayStats"
          :key="s.index"
          class="stats__row"
          role="img"
          :aria-label="`${s.label}: ${s.count} таблеток, ${s.percent}%`"
        >
          <span class="stats__label" :title="s.label">{{ s.short }}</span>
          <div class="stats__bar">
            <div class="stats__fill" :style="{ width: `${s.width}%` }" />
          </div>
          <span class="stats__value">{{ s.count }} · {{ s.percent }}%</span>
        </div>
      </template>
    </div>
  </div>
</template>