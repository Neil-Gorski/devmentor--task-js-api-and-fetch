export function validateNumber(input) {
  const value = Number(input.value);
  if (!isNaN(value) && value > -1 && value < 100) {
    return removeInputError(input);
  }
  return displayInputError(input, "Enter valid 0-99");
}

export function validateName(input) {
  const name = input.value.trim();
  const words = name.split(/\s+/);
  const isValid = words.length === 2 && words.every((word) => word.length >= 3);
  if (isValid) {
    return removeInputError(input);
  }
  return displayInputError(input, "Enter valid name");
}

export function validateEmail(input) {
  const email = input.value.trim();
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (emailPattern.test(email)) {
    return removeInputError(input);
  }
  return displayInputError(input, "Enter valid email");
}

export function displayInputError(input, msg) {
  input.value = "";
  input.placeholder = msg;
  input.classList.add("input--error");
  return false;
}
export function removeInputError(input) {
  input.classList.remove("input--error");
  input.placeholder = "";
  return true;
}
