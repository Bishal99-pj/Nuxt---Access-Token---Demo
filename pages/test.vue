<template>
  <section>
    <form
      class="max-w-sm p-8 mt-10 mx-auto border border-gray-700 rounded-md shadow-md space-y-4"
      @submit.prevent="store.register()"
    >
      <UFormGroup size="xl" label="Email" name="email">
        <UInput
          v-model="store.email"
          size="lg"
          placeholder="enter your mail ID"
          required
        />
        <p
          v-if="store.registrationError.length"
          class="text-red-600 dark:text-red-500 mt-1 text-sm"
        >
          {{ store.registrationError }}
        </p>
      </UFormGroup>
      <UFormGroup size="xl" label="Otp" name="otp">
        <UInput
          v-model="store.otp"
          type="number"
          size="lg"
          placeholder="enter the received otp"
          required
        />
      </UFormGroup>

      <UButton type="submit" size="lg"> Register </UButton>
    </form>
  </section>
</template>

<script setup lang="ts">
const store = useSignUpStore();
</script>

<style scoped></style>
