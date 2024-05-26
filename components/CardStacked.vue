<template>
  <div :class="twMerge('card_container', props.containerClass)">
    <div :class="twMerge('back_card', props.backClass)">
      <slot name="back"> </slot>
    </div>

    <div :class="twMerge('front_card', props.frontClass)">
      <slot name="front"> </slot>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { twMerge } from "tailwind-merge";

type Props = {
  containerClass?: string;
  backClass?: string;
  frontClass?: string;
};
const props = withDefaults(defineProps<Props>(), {
  containerClass: "",
  backClass: "",
  frontClass: "",
});
</script>

<style scoped>
@tailwind components;

.card_container {
  @apply grid grid-rows-[repeat(3,auto)] grid-cols-[2rem_auto_2rem];
}
  
.back_card {
  @apply grid grid-rows-subgrid bg-gray-500 rounded-lg row-start-1 row-end-3 col-span-full;
}

.front_card {
  @apply z-10 row-start-2 row-end-5 col-start-2 col-end-3;
}
</style>
