export default class AdminExcursions {
  constructor(api) {
    this.api = api;
    this.panelExcursions;
    this.prototype;
    this.excursions;
  }

  laodExcursions(excursions) {
    this.excursions = excursions;
    console.log("Excursions loaded from API");
  }
  renderExcursions(container) {
    this.panelExcursions = container;
    if (!this.prototype) {
      this.prototype = this.panelExcursions.querySelector(
        ".excursions__item--prototype"
      );
    }

    this.excursions.forEach((element) => {
      const li = this.createExcursionLI(element);
      this.panelExcursions.appendChild(li);
    });
    this.hidePrototype();
  }

  createExcursionLI(excursionObj) {
    const li = this.prototype.cloneNode(true);
    const updateBtn = li.querySelector(".excursions__field-input--update");
    updateBtn.dataset.mode = "edit";
    li.classList.remove("excursions__item--prototype");
    li.style.display = "";
    li.dataset.id = excursionObj.id;
    for (const key in excursionObj) {
      if (key === "id") {
        continue;
      }
      li.querySelector(`.excursions__${key}`).innerText = excursionObj[key];
    }
    li.addEventListener("submit", (e) => {
      this.excursionEvents(e);
    });
    return li;
  }
  hidePrototype() {
    this.prototype.style.display = "none";
  }
  excursionEvents(e) {
    e.preventDefault();
    // debugger;
    const button = e.submitter;
    const mode = button.dataset.mode;
    if (mode === "edit") {
      button.dataset.mode = "save";
      e.submitter.value = "zapisz";
      this.contentEditableLi(e);
    } else if (mode === "save") {
      button.dataset.mode = "edit";
      button.value = "edytuj";
      this.contentEditableLi(e, false);
    }
  }
  contentEditableLi(e, editable = true) {
    const li = e.target.closest(".excursions__item");
    const excursionObj = this.excursions.find(
      (excursion) => excursion.id === li.dataset.id
    );
    console.log(excursionObj);
    for (const key in excursionObj) {
      if (key === "id") {
        continue;
      }
      const el = li.querySelector(`.excursions__${key}`);
      if (!el) {
        console.log(`element wiht .excursions__${key} not found!`);
        continue;
      }
      el.contentEditable = editable;
      if (!editable) {
        excursionObj[key] = el.innerText;
      }
    }
    if (!editable) {
      this.updateExcursion(excursionObj);
    }
  }
  async updateExcursion(excursion) {
    await this.api.patchExcursion(excursion);
    const updatedExcursions = await this.api.fetchExcursions();
    const prototype = this.prototype;
    this.panelExcursions.innerHTML = "";
    this.panelExcursions.appendChild(prototype);
    this.laodExcursions(updatedExcursions);
    this.renderExcursions(this.panelExcursions);
  }
}
