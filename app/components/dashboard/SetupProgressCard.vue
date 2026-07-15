<template>
  <UCard v-if="status" class="border border-primary-500/20 bg-primary-50/40 dark:bg-primary-950/20">
    <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div class="space-y-2">
        <div class="flex items-center gap-2">
          <UIcon
            v-if="status.importState === 'importing'"
            name="i-heroicons-arrow-path"
            class="w-5 h-5 text-primary-500 animate-spin"
          />
          <UIcon
            v-else-if="status.importState === 'failed'"
            name="i-heroicons-exclamation-triangle"
            class="w-5 h-5 text-red-500"
          />
          <UIcon v-else name="i-heroicons-sparkles" class="w-5 h-5 text-primary-500" />
          <h2 class="font-bold text-gray-900 dark:text-white">{{ headline }}</h2>
        </div>
        <p class="text-sm text-gray-600 dark:text-gray-300">{{ description }}</p>
        <p v-if="status.workoutCount > 0 || status.wellnessCount > 0" class="text-xs text-gray-500">
          {{
            t('setup_progress_data_summary', {
              workouts: status.workoutCount,
              wellness: status.wellnessCount
            })
          }}
        </p>
      </div>

      <div class="flex flex-wrap gap-2 shrink-0">
        <UButton
          v-if="status.importState === 'failed'"
          color="primary"
          variant="solid"
          size="sm"
          icon="i-heroicons-arrow-path"
          @click="emit('sync')"
        >
          {{ t('setup_progress_retry_sync') }}
        </UButton>
        <UButton
          v-if="status.hasFirstInsight && !status.activationComplete"
          color="primary"
          variant="solid"
          size="sm"
          @click="emit('complete')"
        >
          {{ t('setup_progress_view_insight') }}
        </UButton>
        <UButton
          v-if="!status.hasIntegration"
          color="neutral"
          variant="outline"
          size="sm"
          to="/settings/apps"
        >
          {{ t('setup_progress_connect_apps') }}
        </UButton>
        <UButton
          v-if="!status.activationComplete"
          color="neutral"
          variant="ghost"
          size="sm"
          icon="i-heroicons-x-mark"
          aria-label="Dismiss setup progress"
          @click="emit('dismiss')"
        />
      </div>
    </div>
  </UCard>
</template>

<script setup lang="ts">
  import { useTranslate } from '@tolgee/vue'
  import type { OnboardingStatus } from '../../../shared/onboarding-status'

  const props = defineProps<{
    status: OnboardingStatus | null
  }>()

  const emit = defineEmits<{
    sync: []
    complete: []
    dismiss: []
  }>()

  const { t } = useTranslate('onboarding')

  const headline = computed(() => {
    if (!props.status) return ''
    if (props.status.importState === 'importing') return t.value('setup_progress_importing_title')
    if (props.status.importState === 'failed') return t.value('setup_progress_failed_title')
    if (props.status.importState === 'empty') return t.value('setup_progress_empty_title')
    if (props.status.hasFirstInsight) return t.value('setup_progress_insight_ready_title')
    if (props.status.hasUsableData) return t.value('setup_progress_analysis_title')
    if (props.status.hasIntegration) return t.value('setup_progress_connected_title')
    return t.value('setup_progress_connect_title')
  })

  const description = computed(() => {
    if (!props.status) return ''
    if (props.status.importErrorMessage) return props.status.importErrorMessage
    if (props.status.importState === 'importing') {
      return t.value('setup_progress_importing_desc')
    }
    if (props.status.importState === 'empty') {
      return t.value('setup_progress_empty_desc')
    }
    if (props.status.hasFirstInsight) {
      return t.value('setup_progress_insight_ready_desc')
    }
    if (props.status.hasUsableData) {
      return t.value('setup_progress_analysis_desc')
    }
    if (props.status.hasIntegration) {
      return t.value('setup_progress_connected_desc')
    }
    return t.value('setup_progress_connect_desc')
  })
</script>
