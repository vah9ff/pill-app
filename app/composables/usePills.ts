export interface DayPill {
  id: string
  name: string
  note: string
  taken: boolean
}

type DaysMap = Record<string, DayPill[]>

interface StoredState {
  days: DaysMap
  celebratedForDate: string | null
}

interface OldStoredState {
  pills: Array<{ id: string; name: string; note: string; takenToday: boolean }>
  lastOpenedDate: string | null
  celebratedForDate: string | null
}

const STORAGE_KEY = 'pillReminderState'

export const ruWeekdays = [
  'Воскресенье',
  'Понедельник',
  'Вторник',
  'Среда',
  'Четверг',
  'Пятница',
  'Суббота',
]

const ruWeekdaysShort = [
  'Вс',
  'Пн',
  'Вт',
  'Ср',
  'Чт',
  'Пт',
  'Сб',
]

const ruMonths = [
  'января',
  'февраля',
  'марта',
  'апреля',
  'мая',
  'июня',
  'июля',
  'августа',
  'сентября',
  'октября',
  'ноября',
  'декабря',
]

function toKey(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function todayKey(): string {
  return toKey(new Date())
}

export function fromKey(key: string): Date {
  return new Date(+key.slice(0, 4), +key.slice(5, 7) - 1, +key.slice(8, 10))
}

export function formatRuDate(d: Date = new Date()): string {
  return `${ruWeekdays[d.getDay()]}, ${d.getDate()} ${ruMonths[d.getMonth()]}`
}

export function formatDateKey(key: string): string {
  return formatRuDate(fromKey(key))
}

const days = ref<DaysMap>({})
const selectedDate = ref<Date>(new Date())
const celebratedForDate = ref<string | null>(null)
const celebrationOpen = ref(false)
let loaded = false

function save() {
  if (!import.meta.client) return
  const state: StoredState = {
    days: days.value,
    celebratedForDate: celebratedForDate.value,
  }
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // storage unavailable (private mode / disabled) — keep in-memory state only
  }
}

function load() {
  if (loaded) return
  loaded = true
  if (!import.meta.client) return

  let parsed: StoredState | OldStoredState | null = null
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (raw) parsed = JSON.parse(raw)
  } catch {
    parsed = null
  }

  if (parsed && !('days' in parsed) && Array.isArray(parsed.pills)) {
    // legacy format: single list of pills with a takenToday flag
    const old = parsed as OldStoredState
    const migrated: DaysMap = {}
    const key = old.lastOpenedDate ?? todayKey()
    migrated[key] = old.pills.map((p) => ({
      id: p.id,
      name: p.name,
      note: p.note,
      taken: !!p.takenToday,
    }))
    days.value = migrated
    celebratedForDate.value = old.celebratedForDate ?? null
  } else if (parsed && typeof (parsed as StoredState).days === 'object') {
    days.value = (parsed as StoredState).days
    celebratedForDate.value = (parsed as StoredState).celebratedForDate ?? null
  }

  save()
}

const selectedDateKey = computed(() => toKey(selectedDate.value))
const isToday = computed(() => selectedDateKey.value === todayKey())
const formatSelectedDate = computed(() => formatRuDate(selectedDate.value))

const pills = computed<DayPill[]>(() => days.value[selectedDateKey.value] ?? [])

const allTaken = computed(
  () => pills.value.length > 0 && pills.value.every((p) => p.taken),
)

const takenCount = computed(() => pills.value.filter((p) => p.taken).length)

function dayPills(key: string): DayPill[] {
  if (!days.value[key]) days.value[key] = []
  return days.value[key]
}

function addPill(name: string, note: string) {
  dayPills(selectedDateKey.value).push({
    id: crypto.randomUUID(),
    name: name.trim(),
    note: note.trim(),
    taken: false,
  })
  save()
}

function updatePill(id: string, name: string, note: string) {
  const pill = dayPills(selectedDateKey.value).find((p) => p.id === id)
  if (pill) {
    pill.name = name.trim()
    pill.note = note.trim()
    save()
  }
}

function removePill(id: string) {
  days.value[selectedDateKey.value] = dayPills(selectedDateKey.value).filter(
    (p) => p.id !== id,
  )
  save()
}

function togglePill(id: string) {
  const pill = dayPills(selectedDateKey.value).find((p) => p.id === id)
  if (!pill) return
  pill.taken = !pill.taken
  save()
  checkCelebration()
}

function checkCelebration() {
  if (allTaken.value) {
    celebrationOpen.value = true
  }
}

function closeCelebration() {
  celebrationOpen.value = false
}

function goPrevDay() {
  selectedDate.value = new Date(
    selectedDate.value.getFullYear(),
    selectedDate.value.getMonth(),
    selectedDate.value.getDate() - 1,
  )
}

function goNextDay() {
  selectedDate.value = new Date(
    selectedDate.value.getFullYear(),
    selectedDate.value.getMonth(),
    selectedDate.value.getDate() + 1,
  )
}

function goToday() {
  selectedDate.value = new Date()
}

function copyPills(fromKey: string, toKey: string): number {
  const src = days.value[fromKey] ?? []
  if (src.length === 0) return 0
  const existing = new Set(dayPills(toKey).map((p) => p.name.trim().toLowerCase()))
  const toCopy = src.filter((p) => !existing.has(p.name.trim().toLowerCase()))
  dayPills(toKey).push(
    ...toCopy.map((p) => ({
      id: crypto.randomUUID(),
      name: p.name,
      note: p.note,
      taken: false,
    })),
  )
  save()
  return toCopy.length
}

interface WeekdayStat {
  index: number
  label: string
  short: string
  count: number
  percent: number
  width: number
}

const weekdayStats = computed<WeekdayStat[]>(() => {
  const totals = [0, 0, 0, 0, 0, 0, 0]
  for (const [key, list] of Object.entries(days.value)) {
    totals[fromKey(key).getDay()] += list.filter((p) => p.taken).length
  }
  const grand = totals.reduce((a, b) => a + b, 0)
  const max = Math.max(...totals, 1)
  // display order Mon..Sun
  return [1, 2, 3, 4, 5, 6, 0].map((idx) => ({
    index: idx,
    label: ruWeekdays[idx],
    short: ruWeekdaysShort[idx],
    count: totals[idx],
    percent: grand === 0 ? 0 : Math.round((totals[idx] / grand) * 100),
    width: Math.round((totals[idx] / max) * 100),
  }))
})

const totalTaken = computed(() =>
  Object.values(days.value).reduce(
    (sum, list) => sum + list.filter((p) => p.taken).length,
    0,
  ),
)

export function usePills() {
  load()
  return {
    pills,
    allTaken,
    takenCount,
    celebrationOpen,
    selectedDate,
    selectedDateKey,
    isToday,
    formatSelectedDate,
    addPill,
    updatePill,
    removePill,
    togglePill,
    closeCelebration,
    goPrevDay,
    goNextDay,
    goToday,
    copyPills,
    weekdayStats,
    totalTaken,
    formatRuDate,
    formatDateKey,
  }
}