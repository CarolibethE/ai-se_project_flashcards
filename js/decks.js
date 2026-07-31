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
const deckTemplate = document.querySelector("#deck-template");
const deckList = document.querySelector("#home .gallery__list");

/**
 * Convert a named deck color into a hex string.
 *
 * @param {string} colorName - The named color key.
 * @returns {string} The corresponding hex color.
 */
function stringToHex(colorName) {
  return colorMap[colorName] || colorMap.default;
}

/**
 * Look up the name of a color from its hex value.
 *
 * @param {string} hexValue - The hex color code.
 * @returns {string|null} The color name or null if not found.
 */
function hexToString(hexValue) {
  const normalizeedHex = hexValue.toLowerCase();
  const colorName = Object.keys(colorMap).find((key) => colorMap[key].toLowerCase() === normalizeedHex
);

    return colorName || null;
  }

  return colorName || null;


/**
 * Remove color-related modifier classes from an element.
 *
 * @param {HTMLElement} element - The element to update.
 * @returns {void}
 */
function removeColorClasses(element) {
  [...element.classList].forEach((className) => {
    if (className.includes("color")) {
      element.classList.remove(className);
    }
  });
}

/**
 * Find a deck in the cached deck list by its id.
 *
 * @param {string} deckId - The id of the deck to find.
 * @returns {Object|undefined} The matching deck or undefined if not found.
 */
function getDeckByID(deckId) {
  return fetchedDecks.find((deck) => deck._id === deckId);
}

/**
 * Create a home-view deck element.
 * 
 * @param {Object} deckData - The deck data.
 * @param {Function} handleDelete - A callback for delete actions.
 * @returns {HTMLElement} The completed deck element.
 */
  function createDeckEl(deckData, handleDelete) {
    const deckEl = deckTemplate.content.querSelector(".card").cloneNode(true);
    
    const linkEl = deckEl.querySelector(".card__link");
    const titleEl = deckEl.querySelector(".card__title");
    const countEl = deckEl.querySelector(".card__count");
    const deleteBtn = deckEl.querySelector(".card__delete-btn");
    const cardCount = deckData.cards.length;
    const colrName =hexToString(deckData.color) || "default";

    linkEl.href = `#deck/${deckData._id}`;
    titleEl.textContent = deckData.name;
    countEl.textContent = `${cardCount} ${cardCount === 1 ? "card" : "cards"}`;
    deckEl.classList.add(`card_color_${colorName}`);

    deleteBtn.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();

      handleDelete(deckData, deckEl);
    });

    return deckEl;
  }


/**
 * Render one deck into the home deck list.
 *
 * @param {Object} deckData - The deck to render.
 * @param {Function} handleDelete - A callback for delete actions.
 * @returns {void}
 */
function renderDeckEl(deckData, handleDelete) {
  deckList.append(createDeckEl(deckData,handleDelete));
}

/**
 * Clear all decks from the home deck list.
 */
function clearDecks() {
  deckList.innerHTML = "";
}

/**
 * Render all decks into the home view.
 *
 * @param {Array<Object>} decks - The decks to render.
 * @param {Function} handleDelete - A callback for delete actions.
 * @returns {void}
 */
function renderDecks(decks, handleDelete) {
  clearDecks();
  decks.forEach((deck) => renderDeckEl(deck,handleDelete));
}

export {
  fetchedDecks,
  stringToHex,
  hexToString,
  removeColorClasses,
  getDeckByID,
  createDeckEl,
  renderDeckEl,
  clearDecks,
  renderDecks,
};
