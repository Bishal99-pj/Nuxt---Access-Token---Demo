import type { Ref, Reactive, ComputedRef } from 'vue'
import { ZodSchema, z } from 'zod'

type UseFormOptions<T extends ZodSchema> = {
  validationSchema: T;
  watch?: boolean;
}

type UseFormReturn<T extends ZodSchema> = {
  formFields: Reactive<z.infer<T>>;
  errors: Reactive<Record<keyof z.infer<T>, { message: string, cause?: string } | null>>;
  pending: Ref<boolean>;
  isValid: ComputedRef<boolean>;
  validateField: (field: keyof z.infer<T>) => void;
  validateForm: () => boolean;
  onSubmit: (submitterMethod: (data: z.infer<T>) => any) => () => any;
}

export function useForm<T extends ZodSchema>(formOptions: UseFormOptions<T>): UseFormReturn<T> {
  type FormFields = z.infer<T>
  type FormErrors = Record<keyof FormFields, { message: string } | null>
  const formFields = reactive({} as FormFields)
  const errors = reactive({} as FormErrors)
  const pending = ref<boolean>(false)

  const isValid = computed<boolean>(() => Object.values(errors).every(error => error === null))

  function validateField(field: keyof FormFields) {

    if (!(formOptions.validationSchema instanceof z.ZodObject)) {
      console.error('please provide a zod object schema for field validation')
      return
    }

    const fieldSchema = formOptions.validationSchema.shape[field as string] as z.ZodTypeAny
    const fieldValue = formFields[field]

    if (!fieldValue) {
      //@ts-ignore
      errors[field] = null
      return
    }

    try {
      fieldSchema.parse(fieldValue)
      //@ts-ignore
      errors[field] = null
    } catch (error) {
      if (error instanceof z.ZodError) {
        //@ts-ignore
        errors[field] = { message: error.errors[0].message }
      }
    }
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
          const field = err.path[0] as keyof FormFields
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

  if (formOptions.watch) {
    watch(formFields, (newValues: z.infer<T>, oldValues: z.infer<T>) => {
      Object.keys(newValues).forEach(key => {
        if (newValues[key] !== oldValues[key]) {
          validateField(key)
        }
      })
    }, { deep: true })
  }

  return {
    formFields,
    errors,
    pending,
    isValid,
    validateField,
    validateForm,
    onSubmit
  }
}