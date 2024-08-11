<template>
  <form class="max-w-sm flex flex-col gap-5 mx-auto mt-16" @submit.prevent="handleSubmit">
    <fieldset v-auto-animate>
      <label for="email">Email:</label>
      <UInput
        autocomplete="email"
        type="email" 
        id="email"
        v-model="formFields.email"
      />
      <span v-if="errors.email" class="text-red-500 text-sm lowercase">{{ errors.email.message }}</span>
    </fieldset>

    <fieldset v-auto-animate>
      <label for="password">Password:</label>
      <UInput
        autocomplete="password" 
        id="password"
        type="password"
        v-model="formFields.password"
      />
      <span v-if="errors.password" class="text-red-500 text-sm lowercase">{{ errors.password.message }}</span>
    </fieldset>

    <UButton type="submit" :loading="pending" :disabled="!isValid || pending" size="lg">
      {{ pending ? 'Submitting...' : 'Submit' }}
    </UButton>
  </form>
</template>

<script setup lang="ts">
import * as z from 'zod'

const formSchema = z.object({
  email: z.string().email('invalid email address'),
  password: z.string().min(8, 'password must be at least 8 characters')
})

const { formFields, errors, pending, isValid, validateFormField, onSubmit, reset } = useForm({
  validationSchema: formSchema,
  watch: true
})

const handleSubmit = onSubmit(async (data) => {
  console.log('Form submitted with:', 'email ->' , data.email, 'password ->', data.password)
  await new Promise(resolve => setTimeout(resolve, 1000))
  alert('Form submitted successfully!!!')
  reset()
})
</script>
