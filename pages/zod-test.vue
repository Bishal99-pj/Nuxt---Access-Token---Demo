<template>
  <UContainer>
  <form class="max-w-sm flex flex-col gap-5 mx-auto mt-16" @submit.prevent="handleSubmit">
    <fieldset v-auto-animate>
      <label for="email">Email:</label>
      <UInput
        type="email" 
        id="email"
        v-model="formFields.email"
        @blur="validateField('email')"
      />
      <span v-if="errors.email" class="text-red-600">{{ errors.email.message }}</span>
    </fieldset>

    <fieldset v-auto-animate>
      <label for="password">Password:</label>
      <UInput 
        id="password"
        type="password"
        v-model="formFields.password"
        @blur="validateField('password')"
      />
      <span v-if="errors.password" class="text-red-600">{{ errors.password.message }}</span>
    </fieldset>

    <UButton type="submit" :disabled="!isValid || pending">
      {{ pending ? 'Submitting...' : 'Submit' }}
    </UButton>
  </form>
</UContainer>

</template>

<script setup lang="ts">
import * as z from 'zod'

const formSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters')
})

const { formFields, errors, pending, isValid, validateField, onSubmit } = useForm({
  validationSchema: formSchema,
  watch: true
})

const handleSubmit = onSubmit(async (data) => {
  console.log('Form submitted with:', data)
  await new Promise(resolve => setTimeout(resolve, 1000))
  alert('Form submitted successfully!')
})
</script>