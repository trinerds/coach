<template>
  <section id="nutrition-intelligence" class="relative overflow-hidden">
    <div class="relative mx-auto max-w-7xl px-6 lg:px-8">
      <div class="max-w-2xl text-left">
        <p class="font-athletic text-3xl font-bold uppercase tracking-tight text-white sm:text-4xl">
          {{ t('headline') }}
        </p>
        <p class="mt-5 text-lg leading-8 text-gray-400">
          {{ t('description') }}
        </p>
      </div>

      <!-- Asymmetric stack: lead card + two stacked, not 3 equal columns -->
      <div class="mt-12 grid gap-5 lg:grid-cols-12">
        <article
          class="rounded-2xl border border-white/10 bg-[oklch(16%_0.02_155)] p-6 lg:col-span-5 lg:row-span-2 lg:p-8"
        >
          <div class="flex items-center gap-3">
            <UIcon name="i-heroicons-battery-100" class="h-5 w-5 text-emerald-400" />
            <h3 class="text-lg font-semibold text-white">{{ t('card1_title') }}</h3>
          </div>
          <p class="mt-4 text-sm leading-6 text-gray-300">{{ t('card1_desc') }}</p>
          <p class="mt-3 text-xs text-gray-500">{{ t('card1_cue') }}</p>
        </article>

        <article
          class="rounded-2xl border border-white/10 bg-[oklch(16%_0.02_155)] p-6 lg:col-span-7"
        >
          <div class="flex items-center gap-3">
            <UIcon name="i-heroicons-chart-bar-square" class="h-5 w-5 text-sky-400" />
            <h3 class="text-lg font-semibold text-white">{{ t('card2_title') }}</h3>
          </div>
          <p class="mt-3 text-sm leading-6 text-gray-300">{{ t('card2_desc') }}</p>
          <p class="mt-2 text-xs text-gray-500">{{ t('card2_cue') }}</p>
        </article>

        <article
          class="rounded-2xl border border-white/10 bg-[oklch(16%_0.02_155)] p-6 lg:col-span-7"
        >
          <div class="flex items-center gap-3">
            <UIcon name="i-heroicons-clock" class="h-5 w-5 text-amber-400" />
            <h3 class="text-lg font-semibold text-white">{{ t('card3_title') }}</h3>
          </div>
          <p class="mt-3 text-sm leading-6 text-gray-300">{{ t('card3_desc') }}</p>
          <p class="mt-2 text-xs text-gray-500">{{ t('card3_cue') }}</p>
        </article>
      </div>

      <div class="mt-12 grid gap-5 lg:grid-cols-5">
        <div class="rounded-2xl border border-white/10 bg-[oklch(16%_0.02_155)] p-6 lg:col-span-3">
          <div class="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p class="text-sm font-semibold text-white">{{ t('demo_title') }}</p>
              <p class="text-xs text-gray-500">{{ t('demo_subtitle') }}</p>
            </div>
            <UBadge color="neutral" variant="subtle" size="sm" class="!text-xs">
              {{ t('scenario_label', { name: t('scenario.' + activeScenario.id + '.name') }) }}
            </UBadge>
          </div>

          <div class="mt-5 flex flex-wrap gap-2">
            <UButton
              v-for="scenario in scenarios"
              :key="scenario.id"
              size="sm"
              :color="selectedScenarioId === scenario.id ? 'primary' : 'neutral'"
              :variant="selectedScenarioId === scenario.id ? 'solid' : 'outline'"
              class="whitespace-nowrap"
              @click="
                () => {
                  selectedScenarioId = scenario.id
                }
              "
            >
              {{ t('scenario.' + scenario.id + '.name') }}
            </UButton>
          </div>

          <div class="mt-6 rounded-xl border border-white/8 bg-black/40 p-4">
            <svg viewBox="0 0 100 46" class="h-48 w-full" preserveAspectRatio="none">
              <line
                x1="4"
                y1="30"
                x2="96"
                y2="30"
                stroke="rgba(244,63,94,0.45)"
                stroke-dasharray="2 2"
              />
              <polyline
                :points="polylinePoints"
                fill="none"
                stroke="url(#fuel-gradient)"
                stroke-width="2.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <circle
                v-for="point in chartPoints"
                :key="point.x"
                :cx="point.x"
                :cy="point.y"
                r="1.25"
                fill="#34d399"
              />
              <line
                v-for="marker in eventMarkers"
                :key="marker.labelKey"
                :x1="marker.x"
                :x2="marker.x"
                y1="5"
                y2="41"
                stroke="rgba(148,163,184,0.35)"
                stroke-dasharray="1.5 2"
              />
              <defs>
                <linearGradient id="fuel-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stop-color="#f43f5e" />
                  <stop offset="45%" stop-color="#f59e0b" />
                  <stop offset="100%" stop-color="#10b981" />
                </linearGradient>
              </defs>
            </svg>
            <div class="mt-2 grid grid-cols-3 gap-2 text-xs text-gray-500 sm:grid-cols-6">
              <span v-for="label in timelineLabels" :key="label" class="text-center">{{
                label
              }}</span>
            </div>
          </div>

          <div class="mt-4 flex flex-wrap gap-3 text-xs text-gray-400">
            <span class="rounded-full border border-white/10 px-2.5 py-1">{{
              t('threshold_label')
            }}</span>
            <span
              v-for="marker in eventMarkers"
              :key="`${marker.labelKey}-legend`"
              class="rounded-full border border-white/10 px-2.5 py-1"
            >
              {{ t(marker.labelKey) }}
            </span>
          </div>
        </div>

        <div class="rounded-2xl border border-white/10 bg-[oklch(16%_0.02_155)] p-6 lg:col-span-2">
          <p class="text-sm font-semibold text-white">{{ t('outcome_title') }}</p>
          <p class="mt-1 text-xs text-gray-500">{{ t('outcome_subtitle') }}</p>

          <div class="mt-6 space-y-3">
            <div class="rounded-xl border border-white/8 bg-black/40 p-4">
              <p class="text-xs uppercase tracking-wide text-gray-500">{{ t('start_workout') }}</p>
              <p class="mt-1 text-2xl font-bold tabular-nums text-white">
                {{ activeScenario.startWorkout }}%
              </p>
            </div>
            <div class="rounded-xl border border-white/8 bg-black/40 p-4">
              <p class="text-xs uppercase tracking-wide text-gray-500">{{ t('end_workout') }}</p>
              <p class="mt-1 text-2xl font-bold tabular-nums text-white">
                {{ activeScenario.endWorkout }}%
              </p>
            </div>
            <div class="rounded-xl border border-white/8 bg-black/40 p-4">
              <p class="text-xs uppercase tracking-wide text-gray-500">
                {{ t('expected_quality') }}
              </p>
              <p class="mt-1 text-lg font-semibold text-emerald-300">
                {{ t('scenario.' + activeScenario.id + '.quality') }}
              </p>
            </div>
          </div>

          <p class="mt-5 text-sm leading-6 text-gray-400">
            {{ t('scenario.' + activeScenario.id + '.note') }}
          </p>

          <div class="mt-6 flex flex-wrap gap-3">
            <UButton to="/join" color="primary" size="lg" class="whitespace-nowrap">{{
              t('cta_primary')
            }}</UButton>
            <UButton
              to="#how-it-works"
              color="neutral"
              variant="ghost"
              size="lg"
              class="whitespace-nowrap"
              >{{ t('cta_secondary') }}</UButton
            >
          </div>
        </div>
      </div>

      <p class="mt-8 text-xs text-gray-500">
        {{ t('disclaimer') }}
      </p>
    </div>
  </section>
</template>

<script setup lang="ts">
  import { useTranslate } from '@tolgee/vue'

  const { t } = useTranslate('nutrition')

  type Scenario = {
    id: string
    name: string
    points: number[]
    startWorkout: number
    endWorkout: number
    quality: string
    note: string
  }

  const scenarios: Scenario[] = [
    {
      id: 'no-fuel',
      name: 'No Pre-Fuel',
      points: [54, 46, 39, 33, 27, 22],
      startWorkout: 33,
      endWorkout: 22,
      quality: 'Low and unstable',
      note: 'Without targeted carbs before the session, you enter the workout near the low-fuel zone and fade early.'
    },
    {
      id: 'pre-60',
      name: '+60g Pre',
      points: [54, 52, 58, 52, 45, 41],
      startWorkout: 58,
      endWorkout: 41,
      quality: 'Stable execution',
      note: 'A pre-session carb hit lifts your starting fuel and helps sustain quality through the main set.'
    },
    {
      id: 'pre-plus-intra',
      name: '+60g Pre +30g Intra',
      points: [54, 53, 61, 60, 57, 55],
      startWorkout: 61,
      endWorkout: 55,
      quality: 'High quality throughout',
      note: 'Combining pre and intra fueling gives the smoothest curve and the strongest finish for hard work.'
    }
  ]

  const selectedScenarioId = ref(scenarios[1]?.id ?? 'pre-60')

  const activeScenario = computed<Scenario>(() => {
    return scenarios.find((scenario) => scenario.id === selectedScenarioId.value) || scenarios[0]!
  })

  const timelineLabels = ['06:00', '09:00', '12:00', '15:00', '18:00', '21:00']

  const chartPoints = computed(() => {
    const values = activeScenario.value.points
    const min = 10
    const max = 100
    const left = 4
    const right = 96
    const top = 5
    const bottom = 41

    return values.map((value, index) => {
      const x = left + (index * (right - left)) / (values.length - 1)
      const normalized = (value - min) / (max - min)
      const y = bottom - normalized * (bottom - top)
      return {
        x: Number(x.toFixed(2)),
        y: Number(y.toFixed(2)),
        value
      }
    })
  })

  const polylinePoints = computed(() => {
    return chartPoints.value.map((point) => `${point.x},${point.y}`).join(' ')
  })

  const eventMarkers = computed(() => {
    const points = chartPoints.value
    return [
      { labelKey: 'marker.pre_workout', x: points[2]?.x ?? 40 },
      { labelKey: 'marker.workout_start', x: points[3]?.x ?? 58 },
      { labelKey: 'marker.workout_end', x: points[5]?.x ?? 96 }
    ]
  })
</script>
