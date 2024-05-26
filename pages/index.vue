<template>
  <div>
    <div class="text-center mt-10">
      <!-- Preview Mode Demo -->
      <NuxtLink
        :to="{ name: 'preview-mode', query: { preview: 'true' } }"
        class="mr-4"
      >
        <UButton class="text-lg">Go to the posts page</UButton>
      </NuxtLink>
      <!-- Store Locator Demo -->
      <NuxtLink to="/branches">
        <UButton class="text-lg">Explore nearby stores</UButton>
      </NuxtLink>
    </div>
    <!-- Access token UI -->
    <section>
      <!-- ENTER TOKEN FORM -->
      <form
        class="max-w-sm p-8 my-10 mx-auto border border-gray-700 rounded-md shadow-md space-y-8"
        @submit.prevent="devStore.logIn"
      >
        <UFormGroup
          size="xl"
          label="Enter Access Token If Already Have"
          :error="
            devStore.accessError.tokenError &&
            `${devStore.accessError.tokenError} token`
          "
          name="token"
        >
          <UInput
            :value="devStore.accessToken"
            @input="($event: Event) => devStore.setToken(($event.target as HTMLInputElement).value)"
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
        @submit.prevent="devStore.getToken"
      >
        <UFormGroup
          size="xl"
          label="Email"
          name="email"
          :error="
            devStore.accessError.mailError && 'enter a valid mail address'
          "
        >
          <UInput size="lg" placeholder="enter your mail ID" required />
        </UFormGroup>

        <UButton type="submit" size="lg"> Get Token </UButton>
      </form>
    </section>

    <!-- Layered Cards -->
    <section
      class="mx-auto my-10 max-w-md p-5 border border-red-700"
    >
      <CardStacked>
        <template #back>
          <div class="p-2">
            <h3 class="text-lg font-semibold font-sans text-center">Card-1</h3>
            <!-- <img class="object-cover object-center" src="https://images.unsplash.com/photo-1714547808419-dcee89c7d508?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" width="420" height="300" alt="back image"> -->
            <p class="text-sm">
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Suscipit
              illum recusandae quia vel fugit? Voluptas nam cupiditate illum
              esse quaerat, eos autem! Deserunt aliquid nemo distinctio iste,
              quod facere fuga consectetur sit laudantium dignissimos reiciendis
              mollitia, beatae libero fugit! Hic architecto incidunt aliquid
              corporis eos id nobis nostrum dignissimos perferendis
            </p>
          </div>
        </template>

        <template #front>
          <div class="rounded-md bg-gray-800 border-2 border-pink-700 p-2 mt-4">
            <h3 class="text-lg font-semibold font-sans text-center">Card-2</h3>
            <p class="text-sm">
              Lorem, ipsum dolor sit amet consectetur adipisicing elit. Voluptas
              neque harum numquam omnis soluta ea maiores sapiente velit
              delectus inventore assumenda culpa magni dicta dolores aut ex,
              animi accusantium cupiditate corporis minus ipsam explicabo
              exercitationem earum. Explicabo, atque. Quibusdam ullam,
              accusantium adipisci, optio consectetur repellendus pariatur
              voluptatibus voluptas vero ea ratione officia impedit quae! Culpa
              voluptatum dolorum accusamus quidem numquam.
            </p>
          </div>
        </template>
      </CardStacked>
    </section>
  </div>
</template>

<script lang="ts" setup>
const devStore = useDevStore();

const tokenVisible = ref(true);
</script>
