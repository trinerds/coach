<script setup lang="ts">
  import { useTranslate } from '@tolgee/vue'

  const { t } = useTranslate('integrations')

  const integrations = [
    {
      name: 'Garmin',
      src: '/images/logos/Garmin_Connect_app_1024x1024.png',
      statusKey: 'status_auto_import',
      color: '#007cc3'
    },
    {
      name: 'Strava',
      src: '/images/logos/strava.svg',
      statusKey: 'status_two_way_sync',
      color: '#FC6100'
    },
    {
      name: 'Rouvy',
      src: '/images/logos/rouvy-symbol-rgb.svg',
      statusKey: 'status_two_way_sync',
      color: '#E01E26'
    },
    {
      name: 'Intervals.icu',
      src: '/images/logos/intervals.png',
      statusKey: 'status_two_way_sync',
      color: '#00DC82'
    },
    {
      name: 'WHOOP',
      src: '/images/logos/whoop_square.svg',
      statusKey: 'status_two_way_sync',
      color: '#000000'
    },
    {
      name: 'Oura',
      src: '/images/logos/oura.svg',
      statusKey: 'status_two_way_sync',
      color: '#FFFFFF'
    }
  ]
</script>

<template>
  <section class="relative overflow-hidden isolate">
    <UContainer>
      <div class="relative z-10 mb-12 max-w-2xl text-left">
        <h2
          class="font-athletic text-4xl font-bold uppercase leading-[0.9] tracking-tight text-white sm:text-5xl"
        >
          {{ t('landing_title') }}
          <span class="text-primary-400">{{ t('landing_title_accent') }}</span>
        </h2>
        <p class="mt-5 max-w-xl text-lg font-medium leading-relaxed text-gray-400">
          {{ t('landing_description') }}
        </p>
      </div>

      <div class="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
        <div
          v-for="integ in integrations"
          :key="integ.name"
          class="flex flex-col items-center rounded-2xl border border-white/10 bg-[oklch(16%_0.02_155)] p-5 transition-[border-color] duration-200 hover:border-white/20"
        >
          <div class="mb-3 flex h-14 w-14 items-center justify-center">
            <img
              :src="integ.src"
              :alt="integ.name"
              class="h-full w-full object-contain opacity-80"
              :class="{ invert: integ.color === '#000000' }"
            />
          </div>
          <p class="text-center text-sm font-bold uppercase tracking-wide text-white">
            {{ integ.name }}
          </p>
          <span
            class="mt-2 text-center text-xs font-bold uppercase tracking-widest text-primary-400"
            >{{ t(integ.statusKey) }}</span
          >
        </div>
      </div>

      <div class="mt-12 text-left">
        <UButton
          to="/works-with"
          color="primary"
          variant="link"
          size="xl"
          class="group font-bold uppercase tracking-[0.15em]"
        >
          {{ t('landing_cta') }}
          <UIcon
            name="i-heroicons-arrow-right-20-solid"
            class="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1"
          />
        </UButton>
      </div>
    </UContainer>
  </section>
</template>
