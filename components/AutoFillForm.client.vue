<template>
  <form
    novalidate
    @submit.prevent=""
    class="max-w-2xl mx-auto mt-16 grid grid-cols-2 gap-4"
  >
    <UFormGroup
      v-for="field in nl_add_format"
      :key="field"
      :label="field"
      :required="
        nl_add_rules[field] ? nl_add_rules[field].includes('required') : false
      "
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
      class="col-span-2 max-w-sm mx-auto"
      :disabled="submitDisabled"
      block
    >
      Submit
    </UButton>
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

    // debug code
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
  if (!rules || !rules.length) return;

  // Reset any existing error for this field
  formErrors.value[field] = "";

  const fieldValue = (addressFormValue.value[field] || "").trim(); // Trim the field value

  // Clear all the field error if there's no input
  if (!fieldValue && rules.includes("required")) {
    formErrors.value[
      field
    ] = `${field} cannot be empty or consist of only spaces`;
    return;
  }

  for (const rule of rules) {
    if (rule.startsWith("regex:")) {
      const regexParts = rule.match(/^regex:\/(.+)\/([a-z]*)$/);
      if (!regexParts) return;

      const regexPattern = new RegExp(regexParts[1], regexParts[2]);

      if (!regexPattern.test(fieldValue)) {
        formErrors.value[field] = `${field} is invalid`;
        return;
      }
    }

    if (rule.startsWith("min")) {
      const minLength = parseInt(rule.split(":")[1], 10);
      if (addressFormValue.value[field].length < minLength) {
        formErrors.value[
          field
        ] = `${field} must be min. ${minLength} characters long`;
        return;
      }
    }

    if (fieldValue.length > 32) {
      let maxLength = 32; // @todo: get from backend
      if (rule.startsWith("max")) maxLength = parseInt(rule.split(":")[1], 10);
      formErrors.value[field] = `${field} must be max. ${maxLength} characters long`;
      return;
    }
  }
  // If all validations pass, clear any existing error for this field
  formErrors.value[field] = "";
}

onMounted(() => {
  formErrors.value = { ...defaultFormValue };
  skipWatcher.value = true;
});

onUnmounted(() => {
  unwatch();
});
</script>
