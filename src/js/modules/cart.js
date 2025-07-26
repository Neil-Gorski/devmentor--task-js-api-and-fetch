import { generateId } from "./utils";
export class ShopingCart {
  constructor() {
    this.checkOutPrice = 0;
    this.orders = [];
    this.excursions;
    this._updateCheckOutPrice();
  }
  saveExcursions(arr) {
    this.excursions = [...arr];
  }

  addOrder(form) {
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
      id: generateId(),
      excursionId: +excursionId,
      adults: +formData.adults,
      children: +formData.children,
    };

    this.orders.push(order);
    this._updateCheckOutPrice();
    console.log("add order", order);
  }

  removeOrder(id) {
    console.log("removeOrder");
    const index = this.orders.findIndex((order) => order.id === id);
    if (index !== -1) {
      this.orders.splice(index, 1);
    }
    this._updateCheckOutPrice();
  }

  _updateCheckOutPrice() {
    this.checkOutPrice = this.orders.reduce((acc, order) => {
      const excursion = this.getExcursionById(order.excursionId);
      return acc + this.getPriceByOrder(excursion, order);
    }, 0);
    document.querySelector(
      ".order__total-price-value"
    ).textContent = `${this.checkOutPrice}PLN`;
  }

  getExcursionById(id) {
    return this.excursions.find((excursion) => +excursion.id === id);
  }

  getPriceByOrder(excursion, order) {
    return (
      +excursion.price_adult * +order.adults +
      +excursion.price_child * +order.children
    );
  }
  resetOrders() {
    this.orders.length = 0;
    this._updateCheckOutPrice();
  }
}
