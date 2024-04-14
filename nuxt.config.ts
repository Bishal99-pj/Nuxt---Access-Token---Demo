// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  routeRules : {
    '/' : {
      appMiddleware : {
        'ts-auth-env' : false
      }
    }
  },
  experimental: {
    typedPages: true, 
    componentIslands: true
  },
  typescript: {
    typeCheck: true,
    strict: true,
  },
  nitro : {
    storage : {
      signup : {
        driver : 'fs',
        base: 'registration'
      }
    }
  },
  runtimeConfig : {
    public : {
      basePostsUrl : ''
    }
  },
  modules: [
    "@nuxt/ui",
    "@pinia/nuxt",
    '@vueuse/nuxt',
    'nuxt-security',
  ],
});
