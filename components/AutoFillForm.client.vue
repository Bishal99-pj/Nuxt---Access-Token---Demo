<template>
  <form
    novalidate
    @submit.prevent=""
    class="max-w-md mx-auto mt-16 grid grid-cols-2 gap-4"
  >
    <UFormGroup
      v-for="field in nl_add_format"
      :key="field"
      :label="field"
      :required="nl_add_rules[field].includes('required')"
      :error="formErrors[field]"
    >
      <UInput
        :name="'address-' + field"
        v-model="addressFormValue[field]"
        size="lg"
      />
    </UFormGroup>
    <UButton
      type="submit"
      size="lg"
      class="col-span-2"
      :disabled="submitDisabled"
      block
    >
      Submit
    </UButton>

    <pre>
      previous - {{ previousFormValue }}
    </pre>
    <pre>
      current - {{ addressFormValue }}
    </pre>
  </form>
</template>

<script setup lang="ts">
const nl_add_format = [
  "line_3",
  "line_1",
  "line_2",
  "postcode",
  "town",
] as const;

type NLAddressField = (typeof nl_add_format)[number];

const nl_add_rules: Record<NLAddressField, string[]> = {
  line_1: ["required"],
  line_2: [],
  line_3: ["required"],
  town: ["required"],
  postcode: ["required", "regex:\/^[0-9]{4} ?[A-Z]{2}$\/", "min:6"],
} as const;

const defaultFormValue = {
  line_1: "",
  line_2: "",
  line_3: "",
  town: "",
  postcode: "",
} as const;

const addressFormValue = defineModel<Record<NLAddressField, string>>({
  required: true,
});

const formErrors = ref<Record<NLAddressField, string>>({ ...defaultFormValue });

const submitDisabled = ref(false);
const previousFormValue = reactive({ ...addressFormValue.value });
const skipWatcher = ref(false);

const unwatch = watch(
  addressFormValue,
  (updatedFormValue) => {
    // reset error
    formErrors.value = { ...defaultFormValue };

    // skip first render
    if (skipWatcher.value) {
      skipWatcher.value = false;
      Object.assign(previousFormValue, defaultFormValue);
      return;
    }

    // console.log(updatedFormValue, previousFormValue);

    // validate each field values
    for (const key in updatedFormValue) {
      const field = key as NLAddressField;
      if (updatedFormValue[field] === previousFormValue[field]) continue;
      validateField(field, nl_add_rules[field]);
    }

    Object.assign(previousFormValue, updatedFormValue);

    // update disabled state
    const hasError = Object.values(formErrors.value).some((error) => !!error);
    if (hasError) submitDisabled.value = true;
    else submitDisabled.value = false;
  },
  { deep: true }
);

function validateField(field: NLAddressField, rules: string[]) {
  console.log(field, rules);
}

onMounted(() => {
  formErrors.value = { ...defaultFormValue };
  skipWatcher.value = true;
});

onUnmounted(() => {
  unwatch();
});
</script>
