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
}

export default ExcursionsAPI;
