import "./../css/admin.css";

import ExcursionsAPI from "./modules/ExcursionsAPI";
import AdminExcursions from "./modules/AdminExcursions";

console.log("admin");
const excursionsApi = new ExcursionsAPI();
const adminExcursions = new AdminExcursions(excursionsApi);
document.addEventListener("DOMContentLoaded", init);

function init() {
  initPanelExcursions();
}

async function initPanelExcursions() {
  try {
    const exursions = await excursionsApi.fetchExcursions();
    adminExcursions.laodExcursions(exursions);
    adminExcursions.renderExcursions(
      document.querySelector(".panel__excursions")
    );
  } catch (error) {
    console.error(error);
  }
}
