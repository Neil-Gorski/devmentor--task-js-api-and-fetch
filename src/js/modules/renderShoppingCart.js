export function renderShoppingCart(shoppingCart) {
  const summaryUl = document.querySelector(".summary");
  const summaryPrototype = summaryUl.querySelector(".summary__item--prototype");
  clearSummaryUl(summaryUl);
  for (const order of shoppingCart.orders) {
    const summaryLi = createSummaryFromPrototype(
      summaryPrototype,
      order,
      shoppingCart
    );
    summaryUl.appendChild(summaryLi);
  }
}

function createSummaryFromPrototype(prototype, order, shoppingCart) {
  const excursion = shoppingCart.getExcursionById(order.excursionId);
  const summaryLi = prototype.cloneNode(true);
  summaryLi.classList.remove("summary__item--prototype");
  const name = summaryLi.querySelector(".summary__name");
  name.textContent = excursion.title;
  const totalPrice = summaryLi.querySelector(".summary__total-price");
  totalPrice.textContent = `${shoppingCart.getPriceByOrder(
    excursion,
    order
  )}PLN`;
  const removeBtn = summaryLi.querySelector(".summary__btn-remove");
  removeBtn.addEventListener("click", (e) => {
    e.preventDefault();
    shoppingCart.removeOrder(order.id);
    renderShoppingCart(shoppingCart);
  });
  const summaryPrices = summaryLi.querySelector(".summary__prices");
  summaryPrices.textContent = `${getPriceSummary(excursion, order)}`;
  return summaryLi;
}

function getPriceSummary(excursion, order) {
  return `dorośli: ${order.adults} x ${excursion.price_adult}PLN, dzieci: ${order.children} x ${excursion.price_child}PLN`;
}

function clearSummaryUl(summaryUl) {
  summaryUl
    .querySelectorAll(".summary__item:not(.summary__item--prototype)")
    .forEach((el) => el.remove());
}
