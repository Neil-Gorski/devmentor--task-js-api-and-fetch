import { validateFormData } from "./validateFormData";
import { generateId } from "./utils";
import { renderShoppingCart } from "./renderShoppingCart";

export function handlingOrder(shoppingCart, excursionsApi) {
  const form = document.querySelector(".order");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (validateFormData(form)) {
      if (shoppingCart.checkOutPrice == 0) {
        alert(`Twój koszyk jest jeszcze pusty.
          Najpierw dodaj produkt do koszyka.`);
        return;
      }
      const user = getUserData(form);
      sendOrder(user, shoppingCart, excursionsApi);
      form.reset();
    }
  });
}

function getUserData(form) {
  const data = new FormData(form);
  const inputData = Object.fromEntries(data.entries());
  return inputData;
}

async function sendOrder(user, shoppingCart, excursionsApi) {
  const orderObjToApi = {
    id: generateId(),
    user: user,
    totalPrice: shoppingCart.checkOutPrice,
    subOrders: shoppingCart.orders,
  };

  try {
    const result = await excursionsApi.postOrder(orderObjToApi);
    console.log("Zamówienie zostało pomyślnie wysłane:", result);

    shoppingCart.resetOrders();
    renderShoppingCart(shoppingCart);
    alert("Dziękujemy za zamówienie!");
  } catch (error) {
    console.error("Błąd podczas wysyłania zamówienia:", error);
    alert("Wystąpił błąd podczas składania zamówienia.");
  }
}
