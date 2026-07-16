<template>
  <div
    id="architecture"
    class="relative overflow-hidden border-t border-white/8 bg-[oklch(12%_0.015_155)]"
  >
    <div class="mx-auto max-w-7xl px-6 lg:px-8">
      <div class="mx-auto max-w-2xl text-left lg:mx-0">
        <p class="font-athletic text-3xl font-bold uppercase tracking-tight text-white sm:text-4xl">
          {{ t('headline') }}
        </p>
        <p class="mt-5 text-lg leading-8 text-gray-400">{{ t('description') }}</p>
      </div>

      <div class="mt-14 grid grid-cols-1 items-start gap-12 lg:grid-cols-2 lg:gap-16">
        <div>
          <h3 class="text-xl font-semibold tracking-tight text-white">{{ t('context_title') }}</h3>
          <p class="mt-3 text-base leading-7 text-gray-400">{{ t('context_desc') }}</p>
          <dl class="mt-8 max-w-xl space-y-6 text-base leading-7 text-gray-400">
            <div class="relative pl-8">
              <dt class="inline font-semibold text-white">
                <UIcon
                  name="i-heroicons-arrow-down-tray"
                  class="absolute left-0 top-1 h-5 w-5 text-primary-400"
                />
                {{ t('feat1_title') }}
              </dt>
              <dd class="inline">{{ t('feat1_desc') }}</dd>
            </div>
            <div class="relative pl-8">
              <dt class="inline font-semibold text-white">
                <UIcon
                  name="i-heroicons-cpu-chip"
                  class="absolute left-0 top-1 h-5 w-5 text-primary-400"
                />
                {{ t('feat2_title') }}
              </dt>
              <dd class="inline">{{ t('feat2_desc') }}</dd>
            </div>
            <div class="relative pl-8">
              <dt class="inline font-semibold text-white">
                <UIcon
                  name="i-heroicons-user-circle"
                  class="absolute left-0 top-1 h-5 w-5 text-primary-400"
                />
                {{ t('feat3_title') }}
              </dt>
              <dd class="inline">{{ t('feat3_desc') }}</dd>
            </div>
            <div class="relative pl-8">
              <dt class="inline font-semibold text-white">
                <UIcon
                  name="i-heroicons-chat-bubble-bottom-center-text"
                  class="absolute left-0 top-1 h-5 w-5 text-primary-400"
                />
                {{ t('feat4_title') }}
              </dt>
              <dd class="inline">{{ t('feat4_desc') }}</dd>
            </div>
          </dl>
        </div>

        <div class="rounded-2xl border border-white/10 bg-[oklch(16%_0.02_155)] p-8">
          <div class="space-y-4">
            <div class="flex justify-center gap-2">
              <div
                class="rounded border border-white/10 bg-black/30 px-3 py-1 text-xs text-gray-400"
              >
                {{ t('data_workouts') }}
              </div>
              <div
                class="rounded border border-white/10 bg-black/30 px-3 py-1 text-xs text-gray-400"
              >
                {{ t('data_wellness') }}
              </div>
              <div
                class="rounded border border-white/10 bg-black/30 px-3 py-1 text-xs text-gray-400"
              >
                {{ t('data_nutrition') }}
              </div>
            </div>

            <div class="flex h-6 justify-center">
              <div class="w-px bg-white/15" />
            </div>

            <div class="rounded-xl border border-white/10 bg-black/30 p-5 text-center">
              <div class="font-mono text-sm uppercase tracking-widest text-primary-400">
                {{ t('engine') }}
              </div>
              <div class="mt-1 text-xs font-bold uppercase tracking-widest text-gray-500">
                {{ t('engine_sub') }}
              </div>
            </div>

            <div class="flex h-6 justify-center">
              <div class="w-px bg-white/15" />
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div class="rounded border border-white/10 bg-black/30 p-3 text-center">
                <div class="font-mono text-xs text-gray-300">{{ t('workout_analysis') }}</div>
              </div>
              <div class="rounded border border-white/10 bg-black/30 p-3 text-center">
                <div class="font-mono text-xs text-gray-300">{{ t('nutrition_analysis') }}</div>
              </div>
            </div>

            <div class="flex h-6 justify-center text-xs text-gray-500">{{ t('updating') }}</div>

            <div class="rounded-2xl border border-white/10 bg-black/40 p-6 text-center">
              <UIcon
                name="i-heroicons-user-solid"
                class="mx-auto mb-3 h-12 w-12 text-primary-400"
              />
              <div class="font-athletic text-xl font-bold uppercase tracking-tight text-white">
                {{ t('twin_title') }}
              </div>
              <div class="mt-4 space-y-2 text-xs font-bold uppercase tracking-widest text-gray-500">
                <p class="flex items-center justify-center gap-2">
                  <span class="h-1 w-1 rounded-full bg-primary-500" /> {{ t('twin_fitness') }}
                </p>
                <p class="flex items-center justify-center gap-2">
                  <span class="h-1 w-1 rounded-full bg-primary-500" /> {{ t('twin_fatigue') }}
                </p>
                <p class="flex items-center justify-center gap-2">
                  <span class="h-1 w-1 rounded-full bg-primary-500" /> {{ t('twin_trend') }}
                </p>
              </div>
            </div>

            <div class="flex h-6 justify-center">
              <div class="w-px bg-white/15" />
            </div>

            <div class="rounded-lg border border-white/10 bg-white/5 p-4">
              <div class="flex gap-3">
                <div
                  class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-500"
                >
                  <UIcon name="i-heroicons-chat-bubble-left" class="h-4 w-4 text-black" />
                </div>
                <div class="text-sm text-gray-300">{{ t('coach_output') }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useTranslate } from '@tolgee/vue'
  const { t } = useTranslate('architecture')
</script>
