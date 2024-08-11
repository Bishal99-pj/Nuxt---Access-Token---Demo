import type { Ref, Reactive, ComputedRef } from 'vue'
import { ZodSchema, z } from 'zod'

type UseFormOptions<T extends ZodSchema> = {
  validationSchema: T;
  watch?: boolean;
}

export type UseFormReturn<T extends ZodSchema> = {
  formFields: Reactive<z.infer<T>>;
  errors: Reactive<Record<keyof z.infer<T>, { message: string, cause?: string } | null>>;
  pending: Ref<boolean>;
  isValid: ComputedRef<boolean>;
  validateFormField: (field: keyof z.infer<T>) => void;
  validateForm: () => boolean;
  onSubmit: (submitterMethod: (data: z.infer<T>) => any) => () => any;
  reset: () => void;  // New reset method
}

export function useForm<T extends ZodSchema>(formOptions: UseFormOptions<T>): UseFormReturn<T> {
  type FormFields = z.infer<T>
  type FormErrors = Record<keyof FormFields, { message: string, cause?: string } | null>
  const initialFormFields = reactive({} as FormFields)  // Store the initial state
  const formFields = reactive({} as FormFields)
  const errors = reactive({} as FormErrors)
  const pending = ref<boolean>(false)

  // Deep copy the initial state to formFields
  function reset() {
    Object.keys(formFields).forEach(field => {
      formFields[field] = initialFormFields[field]
    });
    Object.keys(errors).forEach(field => {
      //@ts-ignore
      errors[field] = null
    });
  }

  const isValid = computed<boolean>(() => Object.values(errors).every(error => error === null))

  function validateFormField(field: keyof FormFields) {
    nextTick(() => {

      if (!(formOptions.validationSchema instanceof z.ZodObject)) {
        console.error('please provide a Zod object schema for field validation');
        return;
      }

      const fieldSchema = formOptions.validationSchema.shape[field as string] as z.ZodTypeAny;
      const fieldValue = formFields[field];

      if (!fieldValue) {
        //@ts-ignore
        errors[field] = null;
        return;
      }

      try {
        fieldSchema.parse(fieldValue);
        //@ts-ignore
        errors[field] = null;
      } catch (error) {
        if (error instanceof z.ZodError) {
          //@ts-ignore
          errors[field] = { message: error.errors[0].message };
        }
      }
    });
  }

  function validateForm() {
    try {
      formOptions.validationSchema.parse(formFields)
      //@ts-ignore
      Object.keys(errors).forEach(key => errors[key as keyof FormFields] = null)
      return true
    } catch (error) {
      if (error instanceof z.ZodError) {
        error.errors.forEach(err => {
          const field = err.path[0]
          //@ts-ignore
          errors[field] = { message: err.message }
        })
      }
      return false
    }
  }

  function onSubmit(submitterMethod: (data: FormFields) => any) {
    return async () => {
      pending.value = true
      if (validateForm()) {
        try {
          await submitterMethod(formFields)
        } catch (err) {
          if (err instanceof Error)
            console.error('Form submission error: ', err)
        }
      }
      pending.value = false
    }
  }

  
  let unwatch = () => { }
  if (formOptions.watch) {
    // Reactive objects are deep watched by default
    watch(formFields, () => {
      Object.keys(formFields).forEach(field => { 
        validateFormField(field)
      })
    })
  } else unwatch()

  return {
    formFields,
    errors,
    pending,
    isValid,
    validateFormField,
    validateForm,
    onSubmit,
    reset
  }
}
