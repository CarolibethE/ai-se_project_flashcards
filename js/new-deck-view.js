import { fetchedDecks, renderDecks } from "./decks.js";
import { addDeck, updateDeck } from "./api.js";
import { showError } from "./modal.js";

const form = document.querySelector("#new-deck-form");
const submitBtn = form.querySelector(".new-deck-view__submit-btn");
const jsonTextarea = form.querySelector("#new-deck-json");
const formTitle = document.querySelector(".new-deck-view__title");

let formMode = "deck";
let activeDeck = null;

/**
 * Validate that a deck name is a string between 2 and 80 characters.
 *
 * @param {*} name - The value to validate.
 * @returns {string|null} The trimmed name when valid, otherwise null.
 */
function validateName(name) {
  if (typeof name !== "string") {
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
  } catch (error) {
    return null;
  }
}

/**
 * Check whether the current form contains valid deck JSON.
 *
 * @returns {boolean} True when the JSON has a valid name and cards array.
 */
function getFormMode() {
  return window.location.hash.startsWith("#new-card/") ? "card" : formMode;
}

function getPendingDeckId() {
  if (window.location.hash.startsWith("#new-card/")) {
    return window.location.hash.replace("#new-card/", "");
  }

  return activeDeck?._id || null;
}

function isFormValid() {
  const jsonData = parseJSON(jsonTextarea.value);

  if (getFormMode() === "card") {
    if (!jsonData || typeof jsonData !== "object" || Array.isArray(jsonData)) {
      return false;
    }

    return Boolean(
      typeof jsonData.question === "string" &&
        jsonData.question.trim().length > 0 &&
        typeof jsonData.answer === "string" &&
        jsonData.answer.trim().length > 0
    );
  }

  return Boolean(
    jsonData && validateName(jsonData.name) && Array.isArray(jsonData.cards)
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

function seedDefaultDeckData() {
  if (jsonTextarea.value.trim()) {
    return;
  }

  if (getFormMode() === "card") {
    jsonTextarea.value = JSON.stringify(
      {
        question: "What is the new card question?",
        answer: "What is the new card answer?",
      },
      null,
      2
    );
  } else {
    jsonTextarea.value = JSON.stringify(
      {
        name: "My New Deck",
        cards: [
          {
            question: "What is this deck about?",
            answer: "Study and practice your cards.",
          },
        ],
      },
      null,
      2
    );
  }

  updateSubmitState();
}

/**
 * Reset the new deck form and restore its initial button state.
 *
 * @returns {void}
 */
function resetNewDeckForm(mode = null, deck = null) {
  const effectiveMode = mode || (window.location.hash.startsWith("#new-card/") ? "card" : "deck");
  const effectiveDeck = deck || (effectiveMode === "card" ? fetchedDecks.find((item) => item._id === getPendingDeckId()) : null);

  formMode = effectiveMode;
  activeDeck = effectiveDeck;
  form.reset();
  formTitle.textContent = effectiveMode === "card" ? "Add Card" : "New Deck";
  submitBtn.textContent = effectiveMode === "card" ? "Add Card" : "Create the Deck";
  seedDefaultDeckData();
  updateSubmitState();
}

jsonTextarea.addEventListener("input", updateSubmitState);

function bindFormHandlers() {
  form.addEventListener("submit", (event) => {
    event.preventDefault();

  const formData = new FormData(form);
  const submittedData = Object.fromEntries(formData.entries());
  const rawJson = jsonTextarea.value || submittedData["deck-json"] || "";
  const jsonData = parseJSON(rawJson);

  if (!jsonData) {
    showError("The deck json is invalid. Check the formatting and try again.");
    return;
  }

  const currentMode = window.location.hash.startsWith("#new-card/") ? "card" : "deck";

  if (currentMode === "card") {
    const cardPayload = Array.isArray(jsonData) ? jsonData[0] : jsonData;

    if (
      !cardPayload ||
      typeof cardPayload.question !== "string" ||
      cardPayload.question.trim().length === 0 ||
      typeof cardPayload.answer !== "string" ||
      cardPayload.answer.trim().length === 0
    ) {
      showError("Please enter a question and an answer for the card.");
      return;
    }

    const deckId = getPendingDeckId();
    const targetDeck = fetchedDecks.find((deck) => deck._id === deckId);

    if (!targetDeck) {
      showError("Unable to find the open deck. Please try again.");
      return;
    }

    targetDeck.cards.push({
      question: cardPayload.question.trim(),
      answer: cardPayload.answer.trim(),
    });

    renderDecks(fetchedDecks, () => {});
    window.location.hash = `#deck/${targetDeck._id}`;

    updateDeck(targetDeck._id, { cards: targetDeck.cards }).catch(() => {
      // Keep the UI update local when the API call fails.
    });

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
      renderDecks(fetchedDecks, () => {});
      resetNewDeckForm();
      window.location.hash = `#deck/${newDeck._id}`;
    })
    .catch(() => {
      showError("Unable to create the deck. Please try again.");
    });
  });
}

bindFormHandlers();
updateSubmitState();
seedDefaultDeckData();

export { validateName, parseJSON, isFormValid, updateSubmitState, resetNewDeckForm };
