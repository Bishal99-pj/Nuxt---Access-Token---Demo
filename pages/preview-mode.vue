<template>
  <div class="grid place-items-center">
    enabled : <UBadge>{{ enabled }}</UBadge> state :
    <UBadge>{{ state }}</UBadge>

    <pre class="max-w-full overflow-auto shadow bg-gray-950 rounded p-2">
        {{ posts }}
    </pre>

    <!-- {{ route.query }} -->

    <UCheckbox v-model="enabled" label="Toggle preview mode" />
  </div>
</template>

<script setup lang="ts">
const route = useRoute();

const { enabled, state } = usePreviewMode();

const { data: posts, status, error, refresh } = await useFetch("/api/posts");
</script>

<style scoped></style>
