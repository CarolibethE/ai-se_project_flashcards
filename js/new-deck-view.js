import { fetchedDecks } from "./decks.js";
import { addDeck } from "./api.js";
import { showError } from "./modal.js"

const form = document.querySelector("#new-deck-form");
const submitBtn = form.querySelector(".new-deck-view__submit-btn");
const jsonTextarea = form.querySelector("#new-deck-json");

/**
 * Validate that a deck name is a string between 2 and 80 characters.
 * 
 * @param {*} name - The value to vailidate.
 * @returns {string|null} The trimmed name when valid, otherwise null.
 */
function validateName(name) {
  if (typeof name !=="string") {
    return null;
  }
  const trimmedName = name.trim();

  if (trimmedName.length < 2 || trimmedName.length > 80) {
    return null;
  }
  return trimmedName;
}

/**
 * Parse JSON text and return the resulting object.
 * 
 * @param {string} jsonString - The JSON string to parse.
 * @returns {Object|null} The parsed object, or null if parsing fails.
 */
function parseJSON(jsonString) {
  try {
    return JSON.parse(jsonString);
  } catch(error) {
    return null;
  }
}

/**
 * 
 * Check whether the current form contains valid deck JSON.
 * 
 * @returns {boolean} True when the JSON has a valid name and cards array.
 */
function isFormValid() {
  const jsonData = parseJSON(jsonTextarea.value);
  return Boolean(
    jsonData &&
    validateName (jsonData.name) &&
    Array.isArray(jsonData.cards)
  );
}

/**
 * Enable or disable the submit button on form validity.
 * 
 * @returns {void}
 */
function updateSubmitState() {
  submitBtn.disabled = !isFormValid();
}

/**
 * Reset the new deck form and restore its initial button state.
 * 
 * @returns {void}
 */
function resetNewDeckForm() {
  form.reset();
  updateSubmitState();
}

jsonTextarea.addEventListener("input", updateSubmitState);

form.addEventListener("submit", (event) => {
  event.preventDefualt();

  const formData = new FormData(form);
  const submittedData = Object.formEntries (formData);
  const jsonData = parseJSON(submittedData["deck-json"]);

  if (!jsonData) {
    showError("The deck json is invalid. Check the formatting and try again.");
    return;
  }
  const name = validateName(jsonData.name);

  if (!name) {
    showError("The deck must be between 2 and 80 characters.");
    return;
  }

  if (!Array.isArray(jsonData.cards)) {
    showError("The cards field must be an array.");
    return;
  }

  const color = submittedData["deck-color"];

  addDeck({
    name,
    color,
    cards: jsonData.cards,
  })
  .then((newDeck) => {
    fetchedDecks.push(newDeck);
    resetNewDeckForm();
    window.location.hash = `#deck/${newDeck._id}`;
  })
  .catch(() => {
    showError("Unable to create the deck. Please try again.");
  });
});

updateSubmitState();

export { validateName, parseJSON, isFormValid, updateSubmitState, resetNewDeckForm};
