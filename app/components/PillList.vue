<script setup lang="ts">
import { usePills } from '~/composables/usePills'

const { pills, isToday, updatePill, removePill, togglePill } = usePills()

const editingId = ref<string | null>(null)
const confirmDeleteId = ref<string | null>(null)
</script>

<template>
  <div>
    <div v-if="pills.length === 0" class="empty card">
      {{
        isToday
          ? 'Пока нет ни одной таблетки. Добавьте первую!'
          : 'В этот день пока нет таблеток. Скопируйте из другого дня или добавьте.'
      }}
    </div>

    <div v-else class="pill-list">
      <div
        v-for="pill in pills"
        :key="pill.id"
        class="pill card"
        :class="{ 'pill--done': pill.taken }"
      >
        <PillForm
          v-if="editingId === pill.id"
          :initial-name="pill.name"
          :initial-note="pill.note"
          submit-label="Сохранить"
          @save="(name, note) => { updatePill(pill.id, name, note); editingId = null }"
          @cancel="editingId = null"
        />

        <div v-else-if="confirmDeleteId === pill.id" class="pill__confirm">
          <span>Удалить эту таблетку из списка?</span>
          <div class="form__actions">
            <button class="btn btn--ghost" @click="confirmDeleteId = null">
              Отмена
            </button>
            <button
              class="btn btn--danger"
              @click="removePill(pill.id); confirmDeleteId = null"
            >
              <AppIcon name="trash" :size="18" hidden />
              Удалить
            </button>
          </div>
        </div>

        <template v-else>
          <label class="pill__row">
            <input
              class="pill__checkbox"
              type="checkbox"
              :checked="pill.taken"
              @change="togglePill(pill.id)"
            />
            <span class="pill__check">
              <AppIcon name="check" :size="16" hidden />
            </span>
            <span class="pill__info">
              <span
                class="pill__name"
                :class="{ 'pill__name--done': pill.taken }"
              >
                {{ pill.name }}
              </span>
              <span v-if="pill.note" class="pill__note">{{ pill.note }}</span>
            </span>
          </label>
          <div class="pill__actions">
            <button class="icon-btn" @click="editingId = pill.id">
              <AppIcon name="pencil" :size="18" hidden />
              Изменить
            </button>
            <button
              class="icon-btn icon-btn--danger"
              @click="confirmDeleteId = pill.id"
            >
              <AppIcon name="trash" :size="18" hidden />
              Удалить
            </button>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>