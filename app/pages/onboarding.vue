<template>
  <div>
    <div class="mb-10 text-center">
      <div class="flex justify-center mb-8">
        <img
          src="/media/logo_with_text_cropped.webp"
          alt="Coach Watts Logo"
          class="w-full max-h-60 object-contain"
        />
      </div>

      <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-3">
        Welcome to the Future of Training
      </h1>
      <p class="text-gray-500 dark:text-gray-400 text-lg max-w-sm mx-auto">
        You're just a few clicks away from AI-powered coaching insights. Let's get your account set
        up for success.
      </p>
    </div>

    <form class="space-y-6" @submit.prevent="submitConsent">
      <div class="space-y-4">
        <div
          class="rounded-xl border-2 p-4 transition-all duration-200"
          :class="
            acceptedTerms
              ? 'border-primary-500 bg-primary-50/50 dark:bg-primary-900/10'
              : 'border-gray-200 dark:border-gray-700'
          "
        >
          <UFormField label="Accept Legal Terms" required>
            <UCheckbox v-model="acceptedTerms" name="terms" aria-required="true">
              <template #label>
                <span class="font-medium text-gray-900 dark:text-white">Accept Legal Terms</span>
              </template>
            </UCheckbox>
            <template #help>
              <span class="text-gray-500 dark:text-gray-400">
                I agree to the
                <a
                  href="/terms"
                  target="_blank"
                  class="text-primary-600 hover:text-primary-500 font-semibold underline decoration-dotted decoration-primary-500/50 underline-offset-4"
                  >Terms of Service</a
                >
                and
                <a
                  href="/privacy"
                  target="_blank"
                  class="text-primary-600 hover:text-primary-500 font-semibold underline decoration-dotted decoration-primary-500/50 underline-offset-4"
                  >Privacy Policy</a
                >.
              </span>
            </template>
          </UFormField>
        </div>

        <div
          class="rounded-xl border-2 p-4 transition-all duration-200"
          :class="
            acceptedHealth
              ? 'border-primary-500 bg-primary-50/50 dark:bg-primary-900/10'
              : 'border-gray-200 dark:border-gray-700'
          "
        >
          <UFormField label="Health data consent (required)" required>
            <UCheckbox v-model="acceptedHealth" name="health" aria-required="true">
              <template #label>
                <span class="font-medium text-gray-900 dark:text-white">
                  Consent to health data processing (required)
                </span>
              </template>
            </UCheckbox>
            <template #help>
              <span class="text-gray-500 dark:text-gray-400">
                I explicitly consent to the processing of my health and biometric data (HR, power,
                location) so Coach Watts can generate personalized AI coaching.
              </span>
            </template>
          </UFormField>
        </div>
      </div>

      <p v-if="!isValid" class="text-sm text-muted" role="status">
        Both required consent checkboxes must be selected before you can continue.
      </p>

      <UButton
        type="submit"
        block
        size="xl"
        :color="isValid ? 'primary' : 'neutral'"
        :variant="isValid ? 'solid' : 'soft'"
        :disabled="!isValid"
        :loading="loading"
        class="shadow-sm transition-all py-4 font-bold rounded-xl"
      >
        {{ isValid ? "Let's Go! 🚀" : 'Accept required consent to continue' }}
      </UButton>
    </form>
  </div>
</template>

<script setup lang="ts">
  definePageMeta({
    layout: 'simple',
    middleware: 'auth' // Ensure user is logged in (but specific onboarding middleware handles the redirection logic)
  })

  useHead({
    title: 'Welcome',
    meta: [{ name: 'robots', content: 'noindex' }]
  })

  const { data: session, refresh } = useAuth()
  const toast = useToast()
  const { trackOnboardingView, trackOnboardingComplete } = useAnalytics()
  const acceptedTerms = ref(false)
  const acceptedHealth = ref(false)
  const loading = ref(false)

  const isValid = computed(() => acceptedTerms.value && acceptedHealth.value)

  // Constants for policy versions
  const TOS_VERSION = '1.0' // TODO: Move to a shared config if needed
  const PRIVACY_VERSION = '1.0'

  onMounted(() => {
    trackOnboardingView()
  })

  async function submitConsent() {
    if (!isValid.value) return

    loading.value = true
    try {
      await $fetch('/api/user/consent', {
        method: 'POST',
        body: {
          termsVersion: TOS_VERSION,
          privacyPolicyVersion: PRIVACY_VERSION,
          healthConsentAccepted: true
        }
      })

      // Refresh session to update termsAcceptedAt locally if possible,
      // though usually a page reload or full session refresh is needed.
      // For now, we rely on the redirect to work.
      // Force a session reload might be tricky without a plugin,
      // but the next navigation check should ideally query the updated state or allow through based on the client-side knowledge.

      // Simplest approach: Update session manually if the library allows, or just redirect.
      // Since our middleware checks the session, we might need to reload the page or trigger a session refetch.
      await refresh()

      trackOnboardingComplete()
      navigateTo('/dashboard')
    } catch (error: any) {
      console.error('Failed to save consent:', error)
      toast.add({
        title: 'Failed to save consent',
        description: error?.data?.message || 'Please try again.',
        color: 'error'
      })
    } finally {
      loading.value = false
    }
  }
</script>
