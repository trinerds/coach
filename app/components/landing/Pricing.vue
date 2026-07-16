<template>
  <div id="pricing" class="bg-[oklch(14%_0.018_155)]">
    <div class="mx-auto max-w-7xl px-6 lg:px-8">
      <div class="mx-auto mb-12 max-w-2xl text-left sm:mb-14 lg:mx-0">
        <p class="font-athletic text-3xl font-bold uppercase tracking-tight text-white sm:text-4xl">
          {{ t('headline') }}
        </p>
        <p class="mt-5 text-lg leading-8 text-gray-400">
          {{ t('description') }}
        </p>
      </div>

      <div>
        <LandingPricingPlans />

        <div v-if="subscriptionsEnabled" class="mx-auto mt-12 max-w-2xl text-left lg:mx-0">
          <p class="text-sm text-gray-500">{{ t('guarantee') }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useTranslate } from '@tolgee/vue'

  const { t } = useTranslate('pricing')
  const config = useRuntimeConfig()
  const subscriptionsEnabled = computed(() => config.public.subscriptionsEnabled)
</script>
