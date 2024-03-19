import { defineStore } from "pinia";

export const useSignUpStore = defineStore("register", () => {
  const email = ref("");
  const otp = ref<number>();
  const registrationError = ref("");

  const register = async () => {
    try {
      const { error } = await $fetch("/api/signup", {
        method: "POST",
        body: JSON.stringify({
          email: email.value,
          otp: otp.value,
        }),
      });
      if(error.length) registrationError.value = error
    } catch (e) {
      console.error(e);
    }
  };

  return {
    email,
    otp,
    registrationError,
    register,
  };
});
