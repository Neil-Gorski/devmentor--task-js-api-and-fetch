import {
  validateName,
  validateNumber,
  validateEmail,
} from "./formInputValidation";

export function validateFormData(form) {
  let valid = true;
  const data = new FormData(form);
  const inputData = Object.fromEntries(data.entries());

  for (const [key, value] of Object.entries(inputData)) {
    const currentInput = form.querySelector(`input[name="${key}"]`);
    switch (key) {
      case "adults":
      case "children":
        if (!validateNumber(currentInput)) {
          valid = false;
        }
        break;
      case "name":
        if (!validateName(currentInput)) {
          valid = false;
        }
        break;
      case "email":
        if (!validateEmail(currentInput)) {
          valid = false;
        }
        break;
    }
  }
  return valid;
}
