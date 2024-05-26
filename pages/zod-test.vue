<template>
  <div>
    <form @submit.prevent="submitForm">
      <div>
        <label for="name">Name:</label>
        <input v-model="form.name" type="text" id="name" />
        <span v-if="errors.name">{{ errors.name }}</span>
      </div>
      <div>
        <label for="email">Email:</label>
        <input v-model="form.email" type="email" id="email" />
        <span v-if="errors.email">{{ errors.email }}</span>
      </div>
      <div>
        <label for="password">Password:</label>
        <input v-model="form.password" type="password" id="password" />
        <span v-if="errors.password">{{ errors.password }}</span>
      </div>
      <button type="submit">Register</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { z } from "zod";

// Define Zod schema for form validation
const schema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

const form = ref({
  name: "",
  email: "",
  password: "",
});

const errors = ref({});

// Function to validate form data
const validateForm = () => {
  const result = schema.safeParse(form.value);
  if (result.success) {
    errors.value = {};
    return true;
  } else {
    errors.value = {};
    result.error.errors.forEach((err) => {
      errors.value[err.path[0]] = err.message;
    });
    return false;
  }
};

// Function to handle form submission
const submitForm = () => {
  if (validateForm()) {
    // Form is valid, proceed with form submission (e.g., API call)
    alert("Form is valid!");
  } else {
    // Form is invalid, errors will be displayed
    alert("Form is invalid");
  }
};
</script>

<style scoped>
form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 300px;
  margin: 1rem auto;
}
div {
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;
}
label {
  margin-bottom: 5px;
}
input {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
button {
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  background-color: #007bff;
  color: white;
  cursor: pointer;
}
button:hover {
  background-color: #0056b3;
}
span {
  color: red;
  font-size: 12px;
}
</style>
