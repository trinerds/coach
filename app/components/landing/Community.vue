<template>
  <div class="relative overflow-hidden">
    <div class="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
      <div class="mx-auto max-w-2xl text-left lg:mx-0">
        <p
          class="font-athletic text-4xl font-bold uppercase leading-[0.9] tracking-tight text-white sm:text-5xl"
        >
          {{ t('headline') }}
        </p>
      </div>

      <!-- Lead quote + two supporting — not three equal cards -->
      <div class="mx-auto mt-12 grid grid-cols-1 gap-5 lg:mx-0 lg:grid-cols-12">
        <article class="floating-card-base rounded-2xl p-8 sm:p-10 lg:col-span-7">
          <div class="mb-6 flex items-center gap-x-4">
            <UAvatar
              :alt="t('t1_author')"
              class="h-12 w-12 rounded-xl border border-white/10 object-cover"
            />
            <div>
              <div class="font-athletic text-lg font-bold uppercase tracking-tight text-white">
                {{ t('t1_author') }}
              </div>
              <div class="mt-0.5 text-xs font-bold uppercase tracking-widest text-slate-500">
                {{ t('t1_role') }}
              </div>
            </div>
          </div>
          <p class="text-lg font-medium leading-relaxed text-gray-300">“{{ t('t1_quote') }}”</p>
        </article>

        <div class="flex flex-col gap-5 lg:col-span-5">
          <article class="floating-card-base flex-1 rounded-2xl p-7">
            <div class="mb-4 flex items-center gap-x-3">
              <UAvatar
                :alt="t('t2_author')"
                class="h-10 w-10 rounded-lg border border-white/10 object-cover"
              />
              <div>
                <div class="text-sm font-bold uppercase tracking-tight text-white">
                  {{ t('t2_author') }}
                </div>
                <div class="text-xs font-bold uppercase tracking-widest text-slate-500">
                  {{ t('t2_role') }}
                </div>
              </div>
            </div>
            <p class="text-base font-medium leading-relaxed text-gray-400">“{{ t('t2_quote') }}”</p>
          </article>

          <article class="floating-card-base flex-1 rounded-2xl p-7">
            <div class="mb-4 flex items-center gap-x-3">
              <UAvatar
                :alt="t('t3_author')"
                class="h-10 w-10 rounded-lg border border-white/10 object-cover"
              />
              <div>
                <div class="text-sm font-bold uppercase tracking-tight text-white">
                  {{ t('t3_author') }}
                </div>
                <div class="text-xs font-bold uppercase tracking-widest text-slate-500">
                  {{ t('t3_role') }}
                </div>
              </div>
            </div>
            <p class="text-base font-medium leading-relaxed text-gray-400">“{{ t('t3_quote') }}”</p>
          </article>
        </div>
      </div>

      <div class="mt-12 flex justify-start">
        <UButton
          to="https://discord.gg/dPYkzg49T9"
          target="_blank"
          color="neutral"
          variant="link"
          size="xl"
          class="group font-bold uppercase tracking-[0.15em] text-slate-400 hover:text-white"
        >
          {{ t('discord_cta') }} <span class="ml-2 text-primary-400">Discord</span>
          <UIcon
            name="i-heroicons-arrow-right"
            class="ml-2 h-5 w-5 transition-transform duration-200 group-hover:translate-x-1"
          />
        </UButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useTranslate } from '@tolgee/vue'
  const { t } = useTranslate('community')
</script>
