<template>
  <div class="relative overflow-hidden bg-[oklch(11%_0.014_155)]">
    <div class="mx-auto max-w-7xl px-6 lg:px-8">
      <div class="mx-auto max-w-2xl text-left lg:mx-0">
        <p class="font-athletic text-3xl font-bold uppercase tracking-tight text-white sm:text-4xl">
          {{ t('headline') }}
        </p>
        <p class="mt-5 text-lg leading-8 text-gray-400">
          {{ t('description') }}
        </p>
      </div>

      <!-- Irregular spans, not four equal icon tiles -->
      <div
        class="mx-auto mt-12 grid max-w-2xl grid-cols-1 gap-4 sm:mt-14 lg:mx-0 lg:max-w-none lg:grid-cols-12"
      >
        <div class="rounded-2xl border border-white/10 bg-[oklch(16%_0.02_155)] p-7 lg:col-span-5">
          <div class="flex items-center gap-x-3">
            <UIcon name="i-heroicons-calendar" class="h-5 w-5 text-violet-400" />
            <h3 class="font-semibold text-white">{{ t('event_title') }}</h3>
          </div>
          <p class="mt-4 text-sm text-gray-400">
            “{{ t('event_example') }}” <br />
            <span class="text-xs text-gray-500">{{ t('event_sub') }}</span>
          </p>
          <div class="mt-4 flex gap-2">
            <UBadge color="neutral" variant="subtle" size="sm" class="!text-xs">{{
              t('event_badge')
            }}</UBadge>
            <UBadge color="primary" variant="subtle" size="sm" class="!text-xs">{{
              t('event_priority')
            }}</UBadge>
          </div>
        </div>

        <div class="rounded-2xl border border-white/10 bg-[oklch(16%_0.02_155)] p-7 lg:col-span-7">
          <div class="flex items-center gap-x-3">
            <UIcon name="i-heroicons-bolt" class="h-5 w-5 text-amber-400" />
            <h3 class="font-semibold text-white">{{ t('perf_title') }}</h3>
          </div>
          <p class="mt-4 text-sm text-gray-400">
            “{{ t('perf_example') }}” <br />
            <span class="text-xs text-gray-500">{{ t('perf_sub') }}</span>
          </p>
          <div class="mt-4 flex items-center gap-3">
            <UBadge color="neutral" variant="subtle" size="sm" class="!text-xs">{{
              t('perf_badge')
            }}</UBadge>
            <div class="h-2 w-28 overflow-hidden rounded-full bg-white/10">
              <div class="h-full w-3/4 bg-amber-500" />
            </div>
          </div>
        </div>

        <div class="rounded-2xl border border-white/10 bg-[oklch(16%_0.02_155)] p-7 lg:col-span-4">
          <div class="flex items-center gap-x-3">
            <UIcon name="i-heroicons-scale" class="h-5 w-5 text-sky-400" />
            <h3 class="font-semibold text-white">{{ t('weight_title') }}</h3>
          </div>
          <p class="mt-4 text-sm text-gray-400">
            “{{ t('weight_example') }}” <br />
            <span class="text-xs text-gray-500">{{ t('weight_sub') }}</span>
          </p>
          <div class="mt-4">
            <UBadge color="neutral" variant="subtle" size="sm" class="!text-xs">{{
              t('weight_badge')
            }}</UBadge>
          </div>
        </div>

        <div class="rounded-2xl border border-white/10 bg-[oklch(16%_0.02_155)] p-7 lg:col-span-8">
          <div class="flex items-center gap-x-3">
            <UIcon name="i-heroicons-arrow-path" class="h-5 w-5 text-emerald-400" />
            <h3 class="font-semibold text-white">
              {{ t('consistency_title') }}
            </h3>
          </div>
          <p class="mt-4 text-sm text-gray-400">
            “{{ t('consistency_example') }}” <br />
            <span class="text-xs text-gray-500">{{ t('consistency_sub') }}</span>
          </p>
          <div class="mt-4 flex gap-1.5">
            <div class="h-2.5 w-2.5 rounded-full bg-emerald-500" />
            <div class="h-2.5 w-2.5 rounded-full bg-emerald-500" />
            <div class="h-2.5 w-2.5 rounded-full bg-emerald-500" />
            <div class="h-2.5 w-2.5 rounded-full bg-white/15" />
            <div class="h-2.5 w-2.5 rounded-full bg-emerald-500" />
          </div>
        </div>
      </div>

      <div class="mt-10 flex justify-start">
        <UButton
          to="/join"
          size="lg"
          icon="i-heroicons-arrow-right"
          trailing
          class="whitespace-nowrap"
          >{{ t('cta') }}</UButton
        >
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useTranslate } from '@tolgee/vue'
  const { t } = useTranslate('goals')
</script>
