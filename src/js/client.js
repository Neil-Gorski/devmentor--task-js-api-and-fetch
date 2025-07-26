import "./../css/client.css";
import ExcursionsAPI from "./ExcursionsAPI";

const excursionsApi = new ExcursionsAPI();
const shoppingCart = [];
const excursionList = [];
let globalOrderTotalPrice = 0;
console.log("client");
document.addEventListener("DOMContentLoaded", init);

function init() {
  loadExcursionsFromAPI();
  renderShopingCart();
  initOrder();
}

async function loadExcursionsFromAPI() {
  const excursionsUl = document.querySelector(".excursions");
  const excursionsPrototype = excursionsUl.querySelector(
    ".excursions__item--prototype"
  );
  try {
    const excursionListFetchd = await excursionsApi.fetchExcursions();
    excursionList.splice(0, excursionList.length, ...excursionListFetchd);
    excursionListFetchd.forEach((excursion) => {
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
    console.log(excursionList);
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
  const words = name.split(/\s+/);
  const isValid = words.length === 2 && words.every((word) => word.length >= 3);
  if (isValid) {
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

  const adults = +formData.adults;
  const children = +formData.children;

  if (adults === 0 && children === 0) {
    alert("Proszę podać co najmniej jeden bilet (dla dorosłych lub dzieci).");
    return;
  }

  const excursionId = form.closest("li").dataset.id;
  const order = {
    id: generateOrderId(),
    excursionId: +excursionId,
    adults: +formData.adults,
    children: +formData.children,
  };

  shoppingCart.push(order);
  console.log("new order", order);
  renderShopingCart();
}
function generateOrderId() {
  return Date.now().toString(36);
}
// todo: display shopingcart

function renderShopingCart() {
  const summaryUl = document.querySelector(".summary");
  const summaryPrototype = summaryUl.querySelector(".summary__item--prototype");
  clearSummaryUl(summaryUl);
  console.log(shoppingCart);
  for (const order of shoppingCart) {
    const summaryLi = createSummaryFromPrototype(summaryPrototype, order);
    summaryUl.appendChild(summaryLi);
  }
  console.log(shoppingCart);
  updateOrderTotalPrice();
}

function createSummaryFromPrototype(prototype, order) {
  const excursion = getExcursionFromList(order.excursionId);
  const summaryLi = prototype.cloneNode(true);
  summaryLi.classList.remove("summary__item--prototype");
  const name = summaryLi.querySelector(".summary__name");
  name.textContent = excursion.title;
  const totalPrice = summaryLi.querySelector(".summary__total-price");
  totalPrice.textContent = `${getTotalPrice(excursion, order)}PLN`;
  const removeBtn = summaryLi.querySelector(".summary__btn-remove");
  removeBtn.addEventListener("click", (e) => {
    e.preventDefault();
    removeOrder(order.id);
  });
  const summaryPrices = summaryLi.querySelector(".summary__prices");
  summaryPrices.textContent = `${getPriceSummary(excursion, order)}`;
  return summaryLi;
}
function getExcursionFromList(excursionId) {
  return excursionList.find((excursion) => +excursion.id === +excursionId);
}
function getTotalPrice(excursion, order) {
  return (
    +excursion.price_adult * +order.adults +
    +excursion.price_child * +order.children
  );
}
function getPriceSummary(excursion, order) {
  return `dorośli: ${order.adults} x ${excursion.price_adult}PLN, dzieci: ${order.children} x ${excursion.price_child}PLN`;
}
function removeOrder(id) {
  const index = shoppingCart.findIndex((order) => order.id === id);
  if (index !== -1) {
    shoppingCart.splice(index, 1);
    renderShopingCart();
  }
}
function clearSummaryUl(summaryUl) {
  summaryUl
    .querySelectorAll(".summary__item:not(.summary__item--prototype)")
    .forEach((el) => el.remove());
}

function updateOrderTotalPrice() {
  const totalPrice = shoppingCart.reduce((acc, order) => {
    const excursion = getExcursionFromList(order.excursionId);
    return acc + getTotalPrice(excursion, order);
  }, 0);
  const orderTotalPriceSpan = document.querySelector(
    ".order__total-price-value"
  );
  orderTotalPriceSpan.textContent = `${totalPrice}PLN`;
  globalOrderTotalPrice = totalPrice;
}

function initOrder() {
  const form = document.querySelector(".order");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (validateFormData(form)) {
      if (globalOrderTotalPrice == 0) {
        alert(`Twój koszyk jest jeszcze pusty.
          Najpierw dodaj produkt do koszyka.`);
        return;
      }
      const user = getUserData(form);
      sendOrder(user);
    }
  });
}

function getUserData(form) {
  const data = new FormData(form);
  const inputData = Object.fromEntries(data.entries());
  return inputData;
}

async function sendOrder(user) {
  const orderObjToApi = {
    id: generateOrderId(),
    user: user,
    totalPrice: globalOrderTotalPrice,
    subOrders: shoppingCart,
  };

  try {
    const result = await excursionsApi.postOrder(orderObjToApi);
    console.log("Zamówienie zostało pomyślnie wysłane:", result);

    shoppingCart.length = 0;
    renderShopingCart();
    alert("Dziękujemy za zamówienie!");
  } catch (error) {
    console.error("Błąd podczas wysyłania zamówienia:", error);
    alert("Wystąpił błąd podczas składania zamówienia.");
  }
}
