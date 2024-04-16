<template>
  <section class="my-10 flex flex-col space-y-3">
    <div class="flex items-center gap-x-14">
      <span>
        enabled : <UBadge>{{ enabled }}</UBadge>
      </span>
      <span>
        state : <UBadge>{{ state }}</UBadge>
      </span>
      <UCheckbox v-model="enabled" label="Toggle preview mode" size="lg" />
    </div>


    <section class="
        grid grid-cols-1
        sm:grid-cols-2
        gap-4 sm:gap-5
        max-w-full
        shadow
        bg-gray-950
        rounded
        p-2
      ">
      <div v-for="post in postData?.data" :key="post.id">
        <NuxtLink to="#" class="
            flex flex-col
            items-center
            bg-white
            border border-gray-200
            rounded-lg
            shadow
            md:flex-row md:max-w-xl
            hover:bg-gray-100
            dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700
          ">
          <NuxtImg class="
              object-cover
              w-full
              rounded-t-lg
              h-96
              md:h-auto md:w-48 md:rounded-none md:rounded-s-lg
            "
            src="https://images.unsplash.com/photo-1713211460724-7d7f608528a8?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            :alt="post.title" />
          <div class="flex flex-col justify-between p-4 leading-normal">
            <h5 class="
                mb-2
                text-2xl
                font-bold
                tracking-tight
                text-gray-900
                dark:text-white
              ">
              {{ post.title }}
            </h5>
            <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">
              {{ post.body }}
            </p>
          </div>
        </NuxtLink>
      </div>
    </section>

  </section>
</template>

<script setup lang="ts">
const route = useRoute();

// by passes client side cache
const { enabled, state } = usePreviewMode();

const {
  data: postData,
  status,
  error,
  refresh,
} = await useFetch("/api/posts", {
  getCachedData(key, nuxtApp) {
    // if payload has not arrived yet then check static cache
    return nuxtApp.payload.data[key] || nuxtApp.static.data[key]
  },
});
</script>

<style scoped></style>
