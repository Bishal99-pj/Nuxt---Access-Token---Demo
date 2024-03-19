import { defineStore } from "pinia";
import type { DevType, envAccessErrorType } from "~/types/DevType.type";

export const useDevStore = defineStore("access-point-store", () => {
  // states
  const dev = ref<DevType | undefined>({
    email: "",
  });

  const accessToken = ref("");

  const accessError = ref<envAccessErrorType>({
    mailError: "",
    tokenError: "",
  });

  // getters or setters
  function setDev(data: DevType) {
    dev.value = data;
  }
  function setToken(data: string) {
    accessToken.value = data;
  }

  // actions
  const getToken = async () => {};
  const validateToken = async () => {};
  const logIn = async () => {};

  return {
    dev,
    accessToken,
    accessError,
    setDev,
    setToken,
    getToken,
    validateToken,
    logIn,
  };
});
