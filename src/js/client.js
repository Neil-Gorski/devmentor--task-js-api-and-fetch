import "./../css/client.css";
import ExcursionsAPI from "./ExcursionsAPI";

const excursionsApi = new ExcursionsAPI();
const shoppingCart = [];
console.log("client");
document.addEventListener("DOMContentLoaded", init);

function init() {
  loadExcursionsFromAPI();
}

async function loadExcursionsFromAPI() {
  const excursionsUl = document.querySelector(".excursions");
  const excursionsPrototype = excursionsUl.querySelector(
    ".excursions__item--prototype"
  );
  try {
    const excursionList = await excursionsApi.fetchExcursions();
    excursionList.forEach((excursion) => {
      const excursionItem = createExcursionFromPrototype(
        excursion,
        excursionsPrototype
      );
      excursionItem.querySelector("form");
      excursionsUl.appendChild(excursionItem);
    });
  } catch (error) {
    console.error(error);
  } finally {
    console.info("loadExcursionsFromAPI() -> End");
  }
}

function createExcursionFromPrototype(excursionData, excursionPrototype) {
  const newExcursion = excursionPrototype.cloneNode(true);
  newExcursion.dataset.id = excursionData.id;
  newExcursion.querySelector(".excursions__title").textContent =
    excursionData.title;
  newExcursion.querySelector(".excursions__description").textContent =
    excursionData.description;
  updateLabelAdult(newExcursion, true, excursionData);
  updateLabelAdult(newExcursion, false, excursionData);
  newExcursion.classList.remove("excursions__item--prototype");
  initExcursionFormEvents(newExcursion);

  return newExcursion;
}

function updateLabelAdult(el, adult = true, excursionData) {
  const lable = el
    .querySelector(`input[name='${adult ? "adults" : "children"}']`)
    .closest("label").firstChild;
  const string = `${adult ? "Dorosły" : "Dziecko"}: ${
    adult ? excursionData.price_adult : excursionData.price_child
  }PLN x `;
  lable.textContent = string;
}

function initExcursionFormEvents(el) {
  const form = el.querySelector(".excursions__form");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const form = e.target;
    if (validateFormData(form)) {
      addToShoppingCart(form);
      form.reset();
    }
  });
}

function validateFormData(form) {
  let isFormValid = true;
  const data = new FormData(form);
  const inputData = Object.fromEntries(data.entries());

  for (const [key, value] of Object.entries(inputData)) {
    const currentInput = form.querySelector(`input[name="${key}"]`);
    switch (key) {
      case "adults":
      case "children":
        if (!validateNumber(currentInput)) {
          isFormValid = false;
        }
        break;
      case "name":
        if (!validateName(currentInput)) {
          isFormValid = false;
        }
        break;
      case "email":
        if (!validateEmail(currentInput)) {
          isFormValid = false;
        }
        break;
    }
  }
  return isFormValid;
}

function validateNumber(input) {
  const value = Number(input.value);
  if (!isNaN(value) && value > -1 && value < 100) {
    return removeInputError(input);
  }
  return displayInputError(input, "Enter valid 0-99");
}

function validateName(input) {
  const name = input.value.trim();
  if (name.length > 2) {
    return removeInputError(input);
  }
  return displayInputError(input, "Enter valid name");
}

function validateEmail(input) {
  const email = input.value.trim();
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (emailPattern.test(email)) {
    return removeInputError(input);
  }
  return displayInputError(input, "Enter valid email");
}

function displayInputError(input, msg) {
  input.value = "";
  input.placeholder = msg;
  input.classList.add("input--error");
  return false;
}
function removeInputError(input) {
  input.classList.remove("input--error");
  input.placeholder = "";
  return true;
}

function addToShoppingCart(form) {
  const data = new FormData(form);
  const formData = Object.fromEntries(data.entries());
  const excursionId = form.closest("li").dataset.id;
  const order = {
    id: +excursionId,
    adults: +formData.adults,
    childern: +formData.children,
  };

  shoppingCart.push(order);
  console.log("new order", order);
}
