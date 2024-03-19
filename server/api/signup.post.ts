import { ref } from "vue";

export default defineEventHandler(async (e) => {
  const storage = useStorage("registration");
  let error = "";
  const body = await readBody(e);
  // if email is validated
  const keys = await storage.getKeys();
  // if email is already in storage
  if (!keys.includes(body.email)) storage.setItem(body.email, body.email);
  else error = "email ID already exists";

  return { error };
});
