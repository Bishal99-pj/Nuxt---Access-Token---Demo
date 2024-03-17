export type DevType = {
  email: string;
  id?: string | number;
  currentEnv?: string;
};

export type envAccessErrorType = {
  mailError?: string;
  tokenError?: string;
};
