export const catByWeekday: Record<number, string> = {
  0: 'sunday.jpg',
  1: 'monday.jpg',
  2: 'tuesday.jpg',
  3: 'wednesday.jpg',
  4: 'thursday.jpg',
  5: 'friday.jpg',
  6: 'saturday.jpg',
}

export function useTodayCat(day?: MaybeRef<Date>) {
  const config = useRuntimeConfig()
  const baseURL = config.app.baseURL || '/'
  const weekday = computed(() =>
    (unref(day) ?? new Date()).getDay(),
  )
  const src = computed(() => `${baseURL}images/cats/${catByWeekday[weekday.value]}`)
  return { src, weekday }
}