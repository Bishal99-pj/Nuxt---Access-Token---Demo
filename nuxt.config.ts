// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  routeRules: {
    '/': {
      appMiddleware: {
        'ts-auth-env': false
      }
    },
    '/branches': {
      security: {
        headers: {
          permissionsPolicy: {
            geolocation: "self"
          },
          crossOriginEmbedderPolicy: 'unsafe-none',
          crossOriginResourcePolicy: 'same-origin'
        }
      }
    }
  },

  experimental: {
    typedPages: true,
    componentIslands: true
  },

  typescript: {
    strict: true,
  },

  nitro: {
    storage: {
      signup: {
        driver: 'fs',
        base: 'registration'
      }
    }
  },

  runtimeConfig: {
    public: {
      basePostsUrl: '',
      woosmapKey: ''
    }
  },

  security: {
    headers: {
      contentSecurityPolicy: {
        'img-src': false
      },
    }
  },

  modules: [
    "@nuxt/ui",
    "@pinia/nuxt",
    '@vueuse/nuxt',
    'nuxt-security',
    '@nuxt/image',
    '@formkit/auto-animate',
  ],

  compatibilityDate: '2024-08-11',
});