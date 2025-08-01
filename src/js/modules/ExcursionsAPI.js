class ExcursionsAPI {
  constructor() {
    this.apiUrlExcursoions = "http://localhost:3000/excursions";
    this.apiUrlOrders = "http://localhost:3000/orders";
  }
  async fetchExcursions() {
    const response = await fetch(this.apiUrlExcursoions);
    const excursions = await response.json();
    return excursions;
  }
  async postOrder(orderData) {
    const obj = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderData),
    };
    const response = await fetch(this.apiUrlOrders, obj);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  }
  async patchExcursion(excursion) {
    const obj = {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(excursion),
    };
    try {
      await fetch(`${this.apiUrlExcursoions}/${excursion.id}`, obj);
    } catch (error) {
      console.error("Upload faild:", error);
    }
  }
}

export default ExcursionsAPI;
