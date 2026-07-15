<template>
  <UAlert
    color="warning"
    variant="soft"
    icon="i-heroicons-exclamation-triangle"
    :title="t('missing_fields_guide_title')"
    :close="
      dismissible
        ? { color: 'warning', variant: 'link', label: t('missing_fields_guide_dismiss') }
        : false
    "
    @update:open="handleDismiss"
  >
    <template #description>
      <p class="text-sm text-amber-800/90 dark:text-amber-200/90">
        {{ t('missing_fields_guide_description') }}
      </p>

      <ul class="mt-4 space-y-3">
        <li
          v-for="item in guideItems"
          :key="item.field"
          class="rounded-xl border border-amber-200/80 bg-white/70 p-3 dark:border-amber-800/60 dark:bg-amber-950/20"
        >
          <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div class="min-w-0 space-y-1">
              <p class="text-sm font-semibold text-amber-950 dark:text-amber-100">
                {{ t(item.guide.titleKey) }}
              </p>
              <p class="text-sm leading-relaxed text-amber-800/90 dark:text-amber-200/80">
                {{ t(item.guide.descriptionKey) }}
              </p>
            </div>

            <UButton
              color="warning"
              variant="soft"
              size="sm"
              class="shrink-0 self-start"
              icon="i-heroicons-arrow-right"
              trailing
              :label="t('missing_fields_guide_show_me')"
              @click="emit('focus', item.guide.sectionId, item.guide.tab)"
            />
          </div>
        </li>
      </ul>
    </template>
  </UAlert>
</template>

<script setup lang="ts">
  import { useTranslate } from '@tolgee/vue'
  import {
    resolveMissingFieldGuides,
    type MissingProfileSectionId
  } from '~/utils/missing-profile-fields'

  const { t } = useTranslate('profile')

  const props = defineProps<{
    missingFields: string[]
    dismissible?: boolean
  }>()

  const emit = defineEmits<{
    focus: [sectionId: MissingProfileSectionId, tab: 'basic' | 'sports']
    dismiss: []
  }>()

  const guideItems = computed(() => resolveMissingFieldGuides(props.missingFields))

  function handleDismiss(open: boolean) {
    if (!open) emit('dismiss')
  }
</script>
