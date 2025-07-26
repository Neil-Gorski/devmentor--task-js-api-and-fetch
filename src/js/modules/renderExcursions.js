import { validateFormData } from "./validateFormData";
import { renderShoppingCart } from "./renderShoppingCart";
export function renderExcursions(shoppingCart) {
  const excursionsUl = document.querySelector(".excursions");
  const excursionsPrototype = excursionsUl.querySelector(
    ".excursions__item--prototype"
  );
  shoppingCart.excursions.forEach((excursion) => {
    const li = createExcursionLi(excursion, excursionsPrototype);
    initExcursionForm(li, shoppingCart);
    li.querySelector("form");
    excursionsUl.appendChild(li);
  });
}

function createExcursionLi(excursion, prototype) {
  const li = prototype.cloneNode(true);
  li.dataset.id = excursion.id;
  li.querySelector(".excursions__title").textContent = excursion.title;
  li.querySelector(".excursions__description").textContent =
    excursion.description;
  updateLabelAdultChild(li, true, excursion);
  updateLabelAdultChild(li, false, excursion);
  li.classList.remove("excursions__item--prototype");

  return li;
}

function updateLabelAdultChild(el, adult = true, excursionData) {
  const lable = el
    .querySelector(`input[name='${adult ? "adults" : "children"}']`)
    .closest("label").firstChild;
  const string = `${adult ? "Dorosły" : "Dziecko"}: ${
    adult ? excursionData.price_adult : excursionData.price_child
  }PLN x `;
  lable.textContent = string;
}

function initExcursionForm(el, shoppingCart) {
  const form = el.querySelector(".excursions__form");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const form = e.target;
    if (validateFormData(form)) {
      shoppingCart.addOrder(form);
      renderShoppingCart(shoppingCart);
      form.reset();
    }
  });
}
