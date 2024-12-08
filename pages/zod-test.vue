<template>
  <UContainer>
    <!-- <ZodForm /> -->
    <NuxtLink to="/web-home" class="my-8 text-blue-500 underline"
      >Home page</NuxtLink
    >
    <AutoFillForm v-model="addressFormValue" />
  </UContainer>
</template>

<script setup lang="ts">
const initialValue = {
  line_1: "",
  line_2: "",
  line_3: "",
  town: "",
  postcode: "",
};

const addressFormValue = ref({
  line_1: "parent line-1",
  line_2: "parent line-2",
  line_3: "parent line-3",
  town: "amsterdam",
  postcode: "1100 AD",
});

function resetForm()  {
  addressFormValue.value = { ...initialValue };
}

onMounted(() => {
  resetForm();
});
</script>
