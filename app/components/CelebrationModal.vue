<script setup lang="ts">
import { usePills } from '~/composables/usePills'
import { useTodayCat } from '~/composables/useTodayCat'

const { celebrationOpen, closeCelebration } = usePills()
const { selectedDate } = usePills()
const { src } = useTodayCat(selectedDate)

const modalRef = ref<HTMLElement | null>(null)
const closeBtn = ref<HTMLButtonElement | null>(null)
let lastFocused: HTMLElement | null = null

function trapTab(e: KeyboardEvent) {
  if (e.key !== 'Tab') return
  const modal = modalRef.value
  if (!modal) return
  const focusables = modal.querySelectorAll<HTMLElement>(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
  )
  if (focusables.length === 0) return
  const first = focusables[0]
  const last = focusables[focusables.length - 1]
  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault()
    last.focus()
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault()
    first.focus()
  }
}

watch(celebrationOpen, async (open) => {
  if (open) {
    lastFocused = document.activeElement as HTMLElement | null
    await nextTick()
    closeBtn.value?.focus()
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', trapTab)
  } else {
    document.removeEventListener('keydown', trapTab)
    document.body.style.overflow = ''
    lastFocused?.focus?.()
  }
})

onUnmounted(() => {
  document.removeEventListener('keydown', trapTab)
  document.body.style.overflow = ''
})
</script>

<template>
  <div
    v-if="celebrationOpen"
    class="modal-overlay"
    role="dialog"
    aria-modal="true"
    aria-labelledby="celebration-title"
    aria-describedby="celebration-subtext"
    @click.self="closeCelebration"
    @keydown.esc="closeCelebration"
  >
    <div ref="modalRef" class="modal">
      <h2 id="celebration-title" class="modal__headline">
        <AppIcon name="check-circle" :size="36" hidden />
        Умница!
      </h2>
      <p id="celebration-subtext" class="modal__subtext">
        Вы приняли все таблетки на сегодня.
      </p>
      <img class="modal__cat" :src="src" alt="Кот-победитель" />
      <button ref="closeBtn" class="btn btn--block" @click="closeCelebration">
        Закрыть
      </button>
    </div>
  </div>
</template>