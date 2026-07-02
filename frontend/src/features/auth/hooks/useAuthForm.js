import { useState } from "react";

export function useAuthForm(initialValues) {
  const [values, setValues] = useState(initialValues);
  const [showPassword, setShowPassword] = useState(false);

  function updateField(fieldName, fieldValue) {
    setValues((currentValues) => ({
      ...currentValues,
      [fieldName]: fieldValue,
    }));
  }

  function togglePasswordVisibility() {
    setShowPassword((currentValue) => !currentValue);
  }

  return {
    values,
    showPassword,
    updateField,
    togglePasswordVisibility,
  };
}
