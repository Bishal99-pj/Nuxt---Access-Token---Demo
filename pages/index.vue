<template>
  <section>
    <!-- ENTER TOKEN FORM -->
    <form
      class="max-w-sm p-8 mt-20 mb-10 mx-auto border border-gray-700 rounded-md shadow-md space-y-8"
      @submit.prevent="logIn"
    >
      <UFormGroup
        size="xl"
        label="Enter Access Token If Already Have"
        :error="accessError.tokenError && `${accessError.tokenError} token`"
        name="token"
      >
        <UInput
          :value="accessToken"
          @input="($event: Event) => setToken(($event.target as HTMLInputElement).value)"
          placeholder="access token"
          class="mt-2"
          :type="tokenVisible ? 'text' : 'password'"
          size="lg"
        >
          <template #trailing>
            <Icon
              :name="
                tokenVisible
                  ? 'fluent:eye-off-24-filled'
                  : 'fluent:eye-24-filled'
              "
              @click.stop="tokenVisible = !tokenVisible"
            />
          </template>
        </UInput>
      </UFormGroup>
    </form>
    <p class="text-center underline underline-offset-8">OR</p>
    <!-- GET TOKEN FORM -->
    <form
      class="max-w-sm p-8 mt-10 mx-auto border border-gray-700 rounded-md shadow-md space-y-4"
      @submit.prevent="getToken"
    >
      <UFormGroup
        size="xl"
        label="Email"
        name="email"
        :error="accessError.mailError && 'enter a valid mail address'"
      >
        <UInput size="lg" placeholder="enter your mail ID" required />
      </UFormGroup>

      <UButton type="submit" size="lg"> Get Token </UButton>
    </form>
  </section>
</template>

<script lang="ts" setup>
const {
  dev,
  accessToken,
  setDev,
  setToken,
  getToken,
  validateToken,
  logIn,
  accessError,
} = useDevStore();

const tokenVisible = ref(true);
</script>

<style></style>
