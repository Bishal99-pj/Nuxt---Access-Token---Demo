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
  modules: ["@nuxt/ui", "@pinia/nuxt"],
});
