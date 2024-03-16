<template>
  <section>
    <form
      class="max-w-sm p-8 mt-20 mb-10 mx-auto border border-gray-700 rounded-md shadow-md space-y-8"
    >
      <UFormGroup label="Enter Access Token If Already Have" name="token">
        <UInput
          v-model="form.token"
          placeholder="access token"
          class="mt-2"
          :type="tokenVisible ? 'text' : 'password'"
        >
          <template #trailing>
            <Icon
              :name="
                tokenVisible
                  ? 'fluent:eye-off-24-filled'
                  : 'fluent:eye-24-filled'
              "
              @click="tokenVisible = !tokenVisible"
            />
          </template>
        </UInput>
      </UFormGroup>
    </form>
    <p class="text-center underline underline-offset-8">OR</p>
    <form
      class="max-w-sm p-8 mt-10 mx-auto border border-gray-700 rounded-md shadow-md space-y-8"
      @submit.prevent="getToken"
    >
      <UFormGroup label="Email" name="email">
        <UInput v-model="form.email" required />
      </UFormGroup>

      <UButton type="submit"> Get Token </UButton>
    </form>
  </section>
</template>

<script lang="ts" setup>
type Form = {
  email: string;
  token: string;
};

const form = ref<Form>({
  email: "",
  token: "",
});

const tokenVisible = ref(false);

async function getToken(event: any) {
  console.log(event);
}
</script>

<style></style>
