export default defineNuxtConfig({
  routeRules: {},

  extends: [
    './layers/proposals', // Proposals module
    './layers/portal', // Client portal module
  ],

  components: [
    // Disable prefixing base components with `Base`
    { path: '~/components/base', pathPrefix: false },
    // Auto import components from `~/components`
    '~/components',
  ],

  css: ['~/assets/css/tailwind.css', '~/assets/css/main.css'],

  future: {
    compatibilityVersion: 4,
  },

  modules: [
    '@nuxt/ui', // https://ui.nuxt.com (includes @nuxt/icon and @nuxt/fonts)
    '@nuxt/image', // https://image.nuxt.com
    '@nuxtjs/seo', // https://nuxtseo.com
    '@formkit/auto-animate/nuxt',
    'motion-v/nuxt', // https://motion.dev
    '@vueuse/nuxt', // https://vueuse.org/
  ],

  experimental: {
    componentIslands: true,
    asyncContext: true,
  },

  runtimeConfig: {
    public: {
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    },
  },

  // Directus Configuration
  directus: {
    rest: {
      baseUrl: process.env.DIRECTUS_URL || 'http://localhost:8055',
      nuxtBaseUrl: process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    },
    auth: {
      enabled: true,
      enableGlobalAuthMiddleware: false,
      userFields: ['*', { contacts: ['*'] }],
      redirect: {
        login: '/auth/signin',
        logout: '/',
        home: '/portal',
        resetPassword: '/auth/reset-password',
        callback: '/auth/callback',
      },
    },
  },

  devtools: { enabled: true },

  // Image Configuration - https://image.nuxt.com/providers/directus
  image: {
    provider: 'directus',
    directus: {
      baseURL: `${process.env.DIRECTUS_URL}/assets/`,
    },
  },

  // Font Configuration - handled by @nuxt/fonts (bundled with @nuxt/ui)
  fonts: {
    families: [
      { name: 'Inter', provider: 'google' },
      { name: 'Fira Code', provider: 'google' },
      { name: 'Poppins', provider: 'google', weights: [400, 500, 600, 700, 800, 900] },
      { name: 'Nothing You Could Do', provider: 'google' },
    ],
  },

  // OG Image Configuration - https://nuxtseo.com/og-image/getting-started/installation
  ogImage: {
    defaults: {
      component: 'OgImageTemplate',
      width: 1200,
      height: 630,
    },
  },

  // Sitemap Configuration
  sitemap: {
    sources: ['/api/_sitemap-urls'],
  },

  build: {
    transpile: ['v-perfect-signature'],
  },

  compatibilityDate: '2025-03-01',
});
