<template>
  <div
    class="min-h-screen bg-[#09090B] flex flex-col items-center justify-center p-0 lg:p-6 relative overflow-hidden selection:bg-primary-500/30"
  >
    <!-- Starfield/Atmosphere Background -->
    <div class="absolute inset-0 pointer-events-none overflow-hidden">
      <div
        class="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,220,130,0.03)_0%,transparent_70%)]"
      />
      <div
        class="stars-container absolute inset-0 opacity-30"
        :class="{ 'animate-slow-rotate': !prefersReducedMotion }"
      >
        <div v-for="(style, index) in starStyles" :key="index" class="star" :style="style" />
      </div>
    </div>

    <!-- Main Container -->
    <UContainer class="w-full max-w-7xl relative z-10 my-0 lg:my-12 px-0 lg:px-6">
      <div
        class="grid lg:grid-cols-12 rounded-none lg:rounded-[3.5rem] floating-card-base grain-overlay overflow-hidden border-white/10 shadow-2xl min-h-screen lg:min-h-[720px]"
      >
        <!-- Left: Digital Twin Sidecar -->
        <div
          class="hidden lg:flex lg:col-span-5 relative bg-black/40 p-10 sm:p-14 flex-col justify-between overflow-hidden border-t lg:border-t-0 lg:border-r border-white/5 min-h-[600px] lg:min-h-[720px] lg:aspect-[5/6] order-2 lg:order-1"
        >
          <!-- Dynamic Content -->
          <div class="relative z-10 h-full flex flex-col">
            <div class="mb-8 flex items-center gap-3">
              <div
                class="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 shadow-[0_0_30px_rgba(0,0,0,0.2)] backdrop-blur-xl"
              >
                <div
                  class="w-8 h-8 rounded-xl bg-primary-500/15 flex items-center justify-center border border-primary-500/20"
                >
                  <UIcon name="i-heroicons-sparkles-solid" class="w-4 h-4 text-primary-500" />
                </div>
                <span class="text-xs font-black uppercase tracking-[0.15em] text-white/85"
                  >Coach Watts</span
                >
                <span
                  class="rounded-full border border-[#00C16A]/40 bg-[#00C16A]/15 px-2.5 py-1 text-xs font-black uppercase italic tracking-[0.15em] text-[#00C16A] shadow-[0_0_20px_rgba(0,193,106,0.2)]"
                >
                  Free
                </span>
              </div>
            </div>

            <h2
              class="text-3xl sm:text-4xl font-black font-athletic uppercase leading-[0.9] mb-4 tracking-tight text-white mb-8 mt-4"
            >
              ELIMINATE THE <br />
              <span class="text-primary-500">GUESSWORK</span>
            </h2>

            <p
              class="text-zinc-500 text-xs font-black uppercase tracking-[0.2em] mb-12 flex items-center gap-2"
            >
              <span class="w-8 h-px bg-white/10" />
              {{ joinTagline }}
            </p>

            <!-- Chat Simulation -->
            <div
              class="space-y-6 flex-grow overflow-y-auto min-h-[360px] max-h-[400px] scrollbar-hide py-4 flex flex-col justify-start"
            >
              <!-- User Message -->
              <motion.div
                :initial="{ opacity: 0, y: 10 }"
                :animate="{ opacity: 1, y: 0 }"
                :transition="{ delay: 0.2, duration: 0.6 }"
                class="flex justify-end"
              >
                <div
                  class="bg-white/[0.03] backdrop-blur-xl rounded-2xl rounded-tr-sm px-5 py-3 text-sm text-zinc-300 max-w-[85%] border border-white/5 shadow-2xl italic font-medium"
                >
                  “{{ userInquiry }}”
                </div>
              </motion.div>

              <!-- AI Response -->
              <motion.div
                :initial="{ opacity: 0, y: 10 }"
                :animate="{ opacity: 1, y: 0 }"
                :transition="{ delay: 0.8, duration: 0.6 }"
                class="flex justify-start items-end gap-4 mt-8"
              >
                <div
                  class="w-10 h-10 rounded-xl bg-primary-500/20 flex items-center justify-center shrink-0 border border-primary-500/30 shadow-[0_0_20px_rgba(34,197,94,0.15)] relative group"
                >
                  <UIcon
                    name="i-heroicons-sparkles-solid"
                    class="w-5 h-5 text-primary-500 relative z-10"
                  />
                  <!-- Breathing Glow Effect -->
                  <div
                    v-if="!prefersReducedMotion"
                    class="absolute inset-0 rounded-xl bg-primary-500/40 animate-pulse-slow blur-md opacity-30"
                  />
                  <div
                    v-if="!prefersReducedMotion"
                    class="absolute -inset-1 rounded-xl border border-primary-500/20 animate-ping-slow opacity-20"
                  />
                </div>

                <div class="flex flex-col gap-2 max-w-[85%]">
                  <!-- Muted Coach Label Above Bubble -->
                  <div class="text-xs font-black uppercase tracking-[0.15em] text-zinc-500/70 ml-1">
                    Coach Watts System // Verified Output
                  </div>

                  <div
                    class="bg-white/5 backdrop-blur-[24px] rounded-2xl rounded-tl-sm px-6 py-5 text-sm text-white border border-white/10 shadow-2xl relative min-w-[200px] min-h-[148px] sm:min-h-[164px]"
                  >
                    <!-- Skeleton/Ghost State -->
                    <div v-if="isTyping" class="space-y-3 pt-1 animate-pulse">
                      <div
                        class="h-3 w-24 rounded-full bg-[#00C16A]/20 shadow-[0_0_20px_rgba(0,193,106,0.08)]"
                      />
                      <div class="h-3 w-full rounded-full bg-white/5" />
                      <div class="h-3 w-[92%] rounded-full bg-white/5" />
                      <div class="h-3 w-[68%] rounded-full bg-white/5" />
                      <!-- Typing dots inside skeleton -->
                      <div class="flex items-center gap-1.5 mt-4">
                        <div
                          class="w-1.5 h-1.5 bg-primary-500 rounded-full animate-bounce [animation-delay:-0.3s]"
                        />
                        <div
                          class="w-1.5 h-1.5 bg-primary-500 rounded-full animate-bounce [animation-delay:-0.15s]"
                        />
                        <div class="w-1.5 h-1.5 bg-primary-500 rounded-full animate-bounce" />
                      </div>
                    </div>

                    <!-- Content State -->
                    <div v-else class="animate-in fade-in slide-in-from-bottom-2 duration-1000">
                      <div class="relative z-10 leading-relaxed font-medium">
                        <p class="mb-3 text-zinc-200">
                          <span v-html="aiGreeting" />
                        </p>
                        <p class="text-white" v-html="aiAdvice" />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        <!-- 2. The Signup Container -->
        <div
          class="lg:col-span-7 flex flex-col justify-center p-10 sm:p-14 lg:p-24 bg-black relative order-1 lg:order-2"
        >
          <!-- Inner Glow -->
          <div
            class="absolute inset-0 bg-[radial-gradient(circle_at_right,rgba(0,220,130,0.02)_0%,transparent_70%)]"
          />

          <div class="max-w-md mx-auto w-full relative z-10">
            <div class="mb-10 text-center lg:text-left">
              <h2 class="sr-only">{{ joinFormTitle }}</h2>
              <h1
                class="text-4xl sm:text-6xl font-black font-athletic uppercase text-white leading-[0.85] mb-6 tracking-tighter"
              >
                {{ joinTitle }} <br class="hidden sm:block" />
                <span class="text-primary-500">{{ joinSubtitle }}</span>
              </h1>
              <p class="text-zinc-400 text-sm sm:text-lg max-w-md mx-auto lg:mx-0 font-medium pb-2">
                {{ joinFormSubtitle }}
              </p>
            </div>

            <div class="space-y-4">
              <!-- Magnetic Google Button -->
              <div
                class="relative transition-transform duration-200"
                :style="
                  prefersReducedMotion
                    ? undefined
                    : { transform: `translate(${buttonX}px, ${buttonY}px)` }
                "
                @mousemove="onButtonMouseMove"
                @mouseleave="onButtonMouseLeave"
              >
                <UButton
                  block
                  size="xl"
                  icon="i-simple-icons-google"
                  color="primary"
                  variant="solid"
                  class="relative overflow-hidden group shadow-[0_0_30px_rgba(0,220,130,0.1)] py-5 rounded-2xl h-14 min-w-full"
                  :loading="loading"
                  @click="
                    () => {
                      void handleGoogleLogin()
                    }
                  "
                >
                  <span class="relative z-10 font-black uppercase tracking-[0.2em] text-xs">{{
                    joinGoogle
                  }}</span>
                  <div
                    v-if="!prefersReducedMotion"
                    class="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"
                  />
                </UButton>
              </div>

              <!-- Strava Button -->
              <UButton
                block
                size="xl"
                color="neutral"
                variant="outline"
                class="relative overflow-hidden group border-white/10 hover:border-white/20 py-5 rounded-2xl h-14 min-w-full"
                :loading="loadingStrava"
                @click="
                  () => {
                    void handleStravaLogin()
                  }
                "
              >
                <template #leading>
                  <UIcon name="i-simple-icons-strava" class="w-5 h-5 text-[#FC4C02]" />
                </template>
                <span
                  class="relative z-10 font-black uppercase tracking-[0.15em] text-xs text-white"
                >
                  {{ joinStrava }}
                </span>
              </UButton>

              <!-- Intervals.icu Button -->
              <UButton
                block
                size="xl"
                color="neutral"
                variant="outline"
                class="relative overflow-hidden group border-white/10 hover:border-white/20 py-5 rounded-2xl h-14 min-w-full"
                :loading="loadingIntervals"
                @click="
                  () => {
                    void handleIntervalsLogin()
                  }
                "
              >
                <template #leading>
                  <img src="/images/logos/intervals.png" alt="Intervals.icu Logo" class="w-5 h-5" />
                </template>
                <span
                  class="relative z-10 font-black uppercase tracking-[0.15em] text-xs text-white"
                >
                  {{ joinIntervals }}
                </span>
              </UButton>

              <p
                class="text-center lg:text-left text-xs font-black italic uppercase tracking-[0.15em] text-primary-500"
              >
                {{ joinFreeForeverNote }}
              </p>

              <div class="relative">
                <div class="absolute inset-0 flex items-center">
                  <span class="w-full border-t border-white/5" />
                </div>
                <div class="relative flex justify-center text-xs">
                  <span
                    class="bg-[#09090B] px-4 font-black uppercase tracking-[0.2em] text-zinc-600"
                    >{{ joinSecureOAuth }}</span
                  >
                </div>
              </div>

              <!-- Trust Signals -->
              <div class="flex flex-col items-center gap-6 pt-4">
                <div class="text-center space-y-6">
                  <p class="text-xs text-zinc-500 font-medium">
                    {{ joinAlreadyAccount }}
                    <NuxtLink
                      :to="
                        callbackUrl === '/dashboard'
                          ? '/login'
                          : `/login?callbackUrl=${encodeURIComponent(callbackUrl)}`
                      "
                      class="text-primary-500 hover:text-primary-400 transition-colors font-black uppercase tracking-widest text-xs ml-2"
                      >{{ joinLogin }}
                    </NuxtLink>
                  </p>

                  <p
                    class="text-xs text-zinc-500/80 leading-relaxed font-medium max-w-[300px] mx-auto"
                  >
                    {{ joinTermsAgree }}
                    <NuxtLink
                      to="/terms"
                      class="text-zinc-500 hover:text-white transition-colors border-b border-white/10"
                      >{{ joinTerms }}</NuxtLink
                    >
                    {{ joinAnd }}
                    <NuxtLink
                      to="/privacy"
                      class="text-zinc-500 hover:text-white transition-colors border-b border-white/10"
                      >{{ joinPrivacy }} </NuxtLink
                    >.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </UContainer>
  </div>
</template>

<script setup lang="ts">
  import { useTranslate } from '@tolgee/vue'
  import { motion } from 'motion-v'
  import { buildAcquisitionContext } from '#shared/analytics-events'

  const { t } = useTranslate('auth')
  const { signIn } = useAuth()
  const route = useRoute()
  const toast = useToast()
  const { trackSignupStarted, trackSignupFailed } = useAnalytics()

  const acquisitionContext = computed(() => buildAcquisitionContext(route.query, 'join'))

  definePageMeta({
    layout: 'home',
    middleware: ['guest'],
    auth: false
  })

  const callbackUrl = (route.query.callbackUrl as string) || '/dashboard'

  useSeoMeta({
    title: 'Initialize Your Digital Twin',
    ogTitle: 'Join Coach Watts - AI Endurance Coaching',
    description:
      'Start your evolution today. Create your Coach Watts account and access personalized AI training, recovery analytics, and daily coaching insights.',
    ogDescription:
      'Start your evolution today. Create your Coach Watts account and access personalized AI training, recovery analytics, and daily coaching insights.',
    ogImage: '/images/og-image.png',
    twitterCard: 'summary_large_image',
    twitterTitle: 'Join Coach Watts - AI Endurance Coaching',
    twitterDescription:
      'Start your evolution today. Create your Coach Watts account and access personalized AI training, recovery analytics, and daily coaching insights.',
    twitterImage: '/images/og-image.png'
  })

  const loading = ref(false)
  const loadingStrava = ref(false)
  const loadingIntervals = ref(false)
  const isTyping = ref(true)
  const starStyles = ref<any[]>([])
  const prefersReducedMotion = ref(false)

  const translateOrFallback = (key: string, fallback: string, invalidValues: string[] = []) =>
    computed(() => {
      const translated = t.value(key)
      return translated === key || invalidValues.includes(translated) ? fallback : translated
    })

  const joinTitle = translateOrFallback('join.title', 'Initialize Your')
  const joinSubtitle = translateOrFallback('join.subtitle', 'Digital Twin')
  const joinTagline = translateOrFallback('join.tagline', 'Start your evolution today')
  const joinFormTitle = translateOrFallback('join.form_title', 'Get Started')
  const joinFormSubtitle = translateOrFallback(
    'join.form_subtitle',
    'Start free with a 14-day full-access trial. No credit card required.',
    ['Create your Coach Watts account. No credit card required.']
  )
  const joinSecureOAuth = translateOrFallback('login.secure_oauth', 'Secure OAuth Login')
  const joinErrorTitle = translateOrFallback('join.error_title', 'Signup failed')
  const joinErrorGoogle = translateOrFallback(
    'join.error_google',
    'Could not start Google signup. Please try again.'
  )
  const joinErrorStrava = translateOrFallback(
    'join.error_strava',
    'Could not start Strava signup. Please try again.'
  )
  const joinErrorIntervals = translateOrFallback(
    'join.error_intervals',
    'Could not start Intervals signup. Please try again.'
  )
  const joinGoogle = translateOrFallback('join.google', 'Create Account with Google')
  const joinStrava = translateOrFallback('join.strava', 'Create Account with Strava')
  const joinIntervals = translateOrFallback('join.intervals', 'Create Account with Intervals.icu')
  const joinFreeForeverNote = translateOrFallback(
    'join.free_forever_note',
    'Free forever with optional upgrades. Your 14-day trial starts at signup.'
  )
  const joinAlreadyAccount = translateOrFallback('join.already_account', 'Already have an account?')
  const joinLogin = translateOrFallback('join.login', 'Log in')
  const joinTermsAgree = translateOrFallback('join.terms_agree', 'By continuing, you agree to our')
  const joinTerms = translateOrFallback('join.terms', 'Terms of Service')
  const joinAnd = translateOrFallback('join.and', 'and')
  const joinPrivacy = translateOrFallback('join.privacy', 'Privacy Policy')

  // Dynamic Chat Content
  const referral = computed(() => (route.query.ref as string) || '')

  const userInquiry = computed(() => {
    if (referral.value === 'hall-of-fame') {
      return 'I want to break my 5K personal best. Can you help?'
    }
    return t.value('join.user_message')
  })

  const aiGreeting = computed(() => {
    if (referral.value === 'hall-of-fame') {
      return 'Absolutely. I see your current best is 18:42 from last June.'
    }
    return "I noticed your <span class='text-action-green font-bold'>HRV</span> dropped to 28ms overnight. 📉"
  })

  const aiAdvice = computed(() => {
    if (referral.value === 'hall-of-fame') {
      return "Based on your current fatigue profile, we need to focus on <span class='font-bold text-action-green bg-action-green/10 px-1.5 py-0.5 rounded'>Threshold Intervals</span> this week to push that ceiling."
    }
    return "Let's swap your intervals for a <span class='font-bold text-action-green bg-action-green/10 px-1.5 py-0.5 rounded'>Zone 2 Recovery Ride</span>. We'll get back to intensity tomorrow."
  })

  onMounted(() => {
    prefersReducedMotion.value =
      import.meta.client && window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (prefersReducedMotion.value) {
      isTyping.value = false
      return
    }

    // Generate star styles on client to avoid hydration mismatch
    starStyles.value = Array.from({ length: 30 }).map(() => ({
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      opacity: Math.random() * 0.7 + 0.3,
      animationDelay: `${Math.random() * 5}s`,
      animationDuration: `${Math.random() * 3 + 2}s`
    }))

    setTimeout(() => {
      isTyping.value = false
    }, 800)
  })

  // Magnetic Button Logic
  const buttonX = ref(0)
  const buttonY = ref(0)
  const handleMouseMove = (e: MouseEvent) => {
    const btn = e.currentTarget as HTMLElement
    const rect = btn.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2
    buttonX.value = x * 0.2
    buttonY.value = y * 0.2
  }
  const resetPosition = () => {
    buttonX.value = 0
    buttonY.value = 0
  }

  function onButtonMouseMove(e: MouseEvent) {
    if (prefersReducedMotion.value) return
    handleMouseMove(e)
  }

  function onButtonMouseLeave() {
    if (prefersReducedMotion.value) return
    resetPosition()
  }

  function showSignupError(
    description: string,
    error: unknown,
    provider: 'google' | 'strava' | 'intervals'
  ) {
    console.error(`${provider} signup error:`, error)
    toast.add({
      title: joinErrorTitle.value,
      description: error instanceof Error ? error.message : description,
      color: 'error'
    })
  }

  function signupFailureCode(error: unknown) {
    if (error instanceof Error && error.message) {
      return error.message.slice(0, 64)
    }
    return 'unknown_error'
  }

  async function handleGoogleLogin() {
    trackSignupStarted('google', acquisitionContext.value)
    loading.value = true
    try {
      await signIn('google', { callbackUrl })
    } catch (error: unknown) {
      showSignupError(joinErrorGoogle.value, error, 'google')
      trackSignupFailed('google', 'oauth_start', signupFailureCode(error), acquisitionContext.value)
      loading.value = false
    }
  }

  async function handleStravaLogin() {
    trackSignupStarted('strava', acquisitionContext.value)
    loadingStrava.value = true
    try {
      await signIn('strava', { callbackUrl })
    } catch (error: unknown) {
      showSignupError(joinErrorStrava.value, error, 'strava')
      trackSignupFailed('strava', 'oauth_start', signupFailureCode(error), acquisitionContext.value)
      loadingStrava.value = false
    }
  }

  async function handleIntervalsLogin() {
    trackSignupStarted('intervals', acquisitionContext.value)
    loadingIntervals.value = true
    try {
      await signIn('intervals', { callbackUrl })
    } catch (error: unknown) {
      showSignupError(joinErrorIntervals.value, error, 'intervals')
      trackSignupFailed(
        'intervals',
        'oauth_start',
        signupFailureCode(error),
        acquisitionContext.value
      )
      loadingIntervals.value = false
    }
  }
</script>

<style scoped>
  .stars-container {
    position: absolute;
    inset: 0;
  }
  .star {
    position: absolute;
    width: 2px;
    height: 2px;
    background-color: white;
    border-radius: 50%;
    animation: twinkle linear infinite;
  }
  @keyframes twinkle {
    0%,
    100% {
      opacity: 0.3;
      transform: scale(1);
    }
    50% {
      opacity: 1;
      transform: scale(1.5);
    }
  }

  @keyframes slowRotate {
    0% {
      transform: rotate(0deg) scale(1.2);
    }
    100% {
      transform: rotate(360deg) scale(1.2);
    }
  }

  .animate-slow-rotate {
    animation: slowRotate 240s linear infinite;
  }

  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  .animate-pulse-slow {
    animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }

  .animate-ping-slow {
    animation: ping 3s cubic-bezier(0, 0, 0.2, 1) infinite;
  }

  .text-action-green {
    color: #00c16a;
  }

  .bg-action-green\/10 {
    background-color: rgba(0, 193, 106, 0.1);
  }

  @keyframes pulse {
    0%,
    100% {
      opacity: 0.1;
      transform: scale(0.8);
    }
    50% {
      opacity: 0.4;
      transform: scale(1.2);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .animate-slow-rotate,
    .animate-pulse-slow,
    .animate-ping-slow,
    .star {
      animation: none !important;
    }
  }
</style>
