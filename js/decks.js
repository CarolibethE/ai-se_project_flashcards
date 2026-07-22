const colorMap = {
  green: "#64d583",
  blue: "#91a8f9",
  orange: "#ee955e",
  pink: "#ee92d7",
  purple: "#aa8ef0",
  yellow: "#f5d770",
  default: "#64d583",
};

const fetchedDecks = [];

function stringToHex(colorName) {
  return colorMap[colorName] || colorMap.default;
}

function hexToString(hexValue) {
  const colorName = Object.keys(colorMap).find((key) => {
    return colorMap[key] === hexValue;
  });

  return colorName || null;
}

function removeColorClasses(element) {
  [...element.classList].forEach((className) => {
    if (className.includes("_color_")) {
      element.classList.remove(className);
    }
  });
}

function getDeckByID(deckId) {
  return fetchedDecks.find((deck) => deck._id === deckId);
}

const deckTemplate = document.querySelector("#deck-template");
const deckList = document.querySelector(".gallery__list");

/**
 * Creates a deck element.
 *
 * @param {Object} deckData - The deck data.
 * @param {string} deckData._id - The deck's database ID.
 * @param {string} deckData.name - The deck name.
 * @param {string} deckData.color - The deck color.
 * @param {Object[]} deckData.cards - The deck's cards.
 * @param {Function} handleDelete - Called when the delete button is clicked.
 * @returns {HTMLElement} The completed deck element.
 */
function createDeckEl(deckData, handleDelete) {
  const deckEl = deckTemplate.content
    .querySelector(".card")
    .cloneNode(true);

  const linkEl = deckEl.querySelector(".card__link");
  const titleEl = deckEl.querySelector(".card__title");
  const countEl = deckEl.querySelector(".card__count");
  const deleteBtn = deckEl.querySelector(".card__delete-btn");

  linkEl.href = `#deck/${deckData._id}`;
  titleEl.textContent = deckData.name;

  const cardCount = deckData.cards.length;

  countEl.textContent = `${cardCount} ${
    cardCount === 1 ? "card" : "cards"
  }`;

  const colorName = hexToString(deckData.color) || "default";

  removeColorClasses(deckEl);
  deckEl.classList.add(`card_color_${colorName}`);

  deleteBtn.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();

    handleDelete(deckData, deckEl);
  });

  return deckEl;
}

function renderDeckEl(deckData, handleDelete) {
  const deckEl = createDeckEl(deckData, handleDelete);
  deckList.append(deckEl);
}

function clearDecks() {
  deckList.innerHTML = "";
}

function renderDecks(decks, handleDelete) {
  clearDecks();

  decks.forEach((deck) => {
    renderDeckEl(deck, handleDelete);
  });
}

export {
  fetchedDecks,
  stringToHex,
  hexToString,
  removeColorClasses,
  getDeckByID,
  createDeckEl,
  renderDeckEl,
  renderDecks,
};