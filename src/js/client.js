import "./../css/client.css";
import ExcursionsAPI from "./modules/ExcursionsAPI";
import { ShopingCart } from "./modules/cart";
import { renderExcursions } from "./modules/renderExcursions";
import { renderShoppingCart } from "./modules/renderShoppingCart";
import { handlingOrder } from "./modules/handlingOrder";

const excursionsApi = new ExcursionsAPI();
const shoppingCart = new ShopingCart();

console.log("client");
document.addEventListener("DOMContentLoaded", init);

function init() {
  initExcursions();
  initShoppingCart();
  initOrder();
}

async function initExcursions() {
  try {
    const excursions = await excursionsApi.fetchExcursions();
    shoppingCart.saveExcursions(excursions);
    renderExcursions(shoppingCart);
  } catch (error) {
    console.error(error);
  } finally {
    console.info("loadExcursionsFromAPI() -> End");
  }
}

function initShoppingCart() {
  renderShoppingCart(shoppingCart);
}
function initOrder() {
  handlingOrder(shoppingCart, excursionsApi);
}
