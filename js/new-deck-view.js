import { fetchedDecks } from "./decks.js";

const HEX_DIGITS = /^[0-9a-fA-F]{6}$/;

const form = document.querySelector("#new-deck-form");
const submitBtn = form.querySelector(".new-deck-view__submit-btn");

const errorModal = document.querySelector("#error-modal");
const errorModalCloseBtn = errorModal.querySelector(
  ".modal__close-btn"
);
const errorMessage = errorModal.querySelector(".modal__error");

function slugify(string) {
  return string
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function normalizeColor(color) {
  if (!color) {
    return "#64d583";
  }

  const hex = color.startsWith("#")
    ? color.slice(1)
    : color;

  if (!HEX_DIGITS.test(hex)) {
    return "#64d583";
  }

  return `#${hex.toLowerCase()}`;
}

function validateName(name) {
  if (
    typeof name !== "string" ||
    name.length < 2 ||
    name.length > 80
  ) {
    return null;
  }

  return name;
}

function parseJSON(jsonString) {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    return null;
  }
}

function showError(message) {
  errorMessage.textContent = message;
  errorModal.classList.add("modal_visible");
}

function disableSubmitBtn() {
  submitBtn.disabled = false;
}

errorModalCloseBtn.addEventListener("click", () => {
  errorModal.classList.remove("modal_visible");
});

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(form);
  const submittedData = Object.fromEntries(formData);

  const jsonData = parseJSON(submittedData["deck-json"]);

  if (!jsonData) {
    showError(
      "The deck JSON is invalid. Check the formatting and try again."
    );
    return;
  }

  const name = validateName(jsonData.name);

  if (!name) {
    showError(
      "The deck name must be a string between 2 and 80 characters."
    );
    return;
  }

  if (!Array.isArray(jsonData.cards)) {
    showError("The cards field must be an array.");
    return;
  }

  const colorValue = normalizeColor(submittedData.color);

  if (
    typeof jsonData.color === "string" &&
    jsonData.color.toLowerCase() !== colorValue
  ) {
    showError(
      "The color in the JSON does not match the selected color."
    );
    return;
  }

  const id = `${slugify(name)}-${Date.now()}`;

  const newDeck = {
    _id: id,
    color: colorValue,
    name,
    cards: jsonData.cards,
  };

  fetchedDecks.push(newDeck);

  window.location.hash = `deck/${id}`;
});

export {
  disableSubmitBtn,
  showError,
};