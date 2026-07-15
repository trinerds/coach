<template>
  <div class="relative pl-2 space-y-6">
    <div class="absolute left-[15px] top-2 bottom-2 w-0.5 bg-gray-200 dark:bg-gray-700" />

    <div v-for="(step, index) in steps" :key="step.id" class="relative flex items-start gap-4">
      <div
        class="relative z-10 w-7 h-7 rounded-full flex items-center justify-center border-2 border-white dark:border-gray-900"
        :class="stepIndicatorClass(step.status)"
      >
        <UIcon
          v-if="step.status === 'complete'"
          name="i-heroicons-check"
          class="w-4 h-4 text-green-600 dark:text-green-400"
        />
        <UIcon
          v-else-if="step.status === 'failed'"
          name="i-heroicons-exclamation-triangle"
          class="w-4 h-4 text-red-600 dark:text-red-400"
        />
        <div
          v-else-if="step.status === 'active'"
          class="w-2.5 h-2.5 rounded-full bg-primary-500 animate-pulse"
        />
        <span v-else class="text-[10px] font-bold text-gray-500">{{ index + 1 }}</span>
      </div>
      <div :class="step.status === 'pending' ? 'opacity-50' : ''">
        <p class="font-bold text-sm text-gray-900 dark:text-white">
          {{ t(stepTitleKey(step.id)) }}
        </p>
        <p class="text-xs text-gray-500">{{ t(stepDescriptionKey(step.id)) }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useTranslate } from '@tolgee/vue'
  import type { OnboardingStep, OnboardingStepId } from '#shared/onboarding-status'

  defineProps<{
    steps: OnboardingStep[]
  }>()

  const { t } = useTranslate('onboarding')

  function stepTitleKey(stepId: OnboardingStepId) {
    const keys: Record<OnboardingStepId, string> = {
      account_ready: 'step_account_ready_title',
      connect_data: 'step_connect_data_title',
      import_data: 'step_import_data_title',
      analysis: 'step_analysis_title',
      first_value: 'step_report_title'
    }
    return keys[stepId]
  }

  function stepDescriptionKey(stepId: OnboardingStepId) {
    const keys: Record<OnboardingStepId, string> = {
      account_ready: 'step_account_ready_desc',
      connect_data: 'step_connect_data_desc',
      import_data: 'step_import_data_desc',
      analysis: 'step_analysis_desc',
      first_value: 'step_report_desc'
    }
    return keys[stepId]
  }

  function stepIndicatorClass(status: OnboardingStep['status']) {
    if (status === 'complete') {
      return 'bg-green-100 dark:bg-green-900'
    }
    if (status === 'failed') {
      return 'bg-red-100 dark:bg-red-900 border-red-300 dark:border-red-700'
    }
    if (status === 'active') {
      return 'bg-white dark:bg-gray-800 border-primary-500'
    }
    return 'bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600'
  }
</script>
