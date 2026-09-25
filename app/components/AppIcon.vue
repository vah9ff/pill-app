<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    name:
      | 'plus'
      | 'check'
      | 'pencil'
      | 'trash'
      | 'x'
      | 'check-circle'
      | 'chevron-left'
      | 'chevron-right'
      | 'calendar'
      | 'chart'
      | 'copy'
    size?: number
    hidden?: boolean
  }>(),
  { size: 20, hidden: true },
)

const paths: Record<string, string[]> = {
  plus: ['M5 12h14', 'M12 5v14'],
  check: ['M20 6 9 17l-5-5'],
  pencil: [
    'M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z',
    'm15 5 4 4',
  ],
  trash: [
    'M3 6h18',
    'M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6',
    'M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2',
  ],
  x: ['M18 6 6 18', 'm6 6 12 12'],
  'check-circle': ['M22 11.08V12a10 10 0 1 1-5.93-9.14', 'm9 11 3 3L22 4'],
  'chevron-left': ['m15 18-6-6 6-6'],
  'chevron-right': ['m9 18 6-6-6-6'],
  calendar: [
    'M8 2v4',
    'M16 2v4',
    'M3 4h18a1 1 0 0 1 1 1v15a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1Z',
    'M3 10h18',
  ],
  chart: ['M12 20V10', 'M18 20V4', 'M6 20v-4'],
  copy: [
    'M20 9h-9a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2v-9a2 2 0 0 0-2-2Z',
    'M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1',
  ],
}
</script>

<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    :aria-hidden="hidden || undefined"
  >
    <path v-for="d in paths[name]" :key="d" :d="d" />
  </svg>
</template>