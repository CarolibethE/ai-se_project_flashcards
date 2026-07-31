import {
  hexToString,
  removeColorClasses,
} from "./decks.js";

/**
 * Extract the deck id from a carousel hash route.
 *
 * @param {string} hash - The URL hash string.
 * @returns {string|undefined} The extracted deck id.
 */
function getDeckIdFromHash(hash) {
  const [, deckId] = hash.split("/");
  return deckId;
}

/**
 * Build the carousel title string for the current card.
 *
 * @param {Object} deck - The deck containing cards.
 * @param {number} currentIndex - The index of the current card.
 * @returns {string} The formatted title.
 */
function getCarouselTitleString(deck, currentIndex) {
  return `${deck.name} — Card ${currentIndex + 1} of ${
    deck.cards.length
  }`;
}

/**
 * Render the carousel view for a deck and wire its controls.
 *
 * @param {Object} deck - The deck to display.
 * @returns {void}
 */
function renderCarouselView(deck) {
  const carouselSection = document.querySelector("#carousel");

  const sectionTitleEl = carouselSection.querySelector(
    ".carousel__title"
  );

  const cardEl = carouselSection.querySelector(
    ".carousel__card"
  );

  const cardTextEl = carouselSection.querySelector(
    ".carousel__card-text"
  );

  const prevBtn = carouselSection.querySelector(
    ".carousel__btn_type_left"
  );

  const nextBtn = carouselSection.querySelector(
    ".carousel__btn_type_right"
  );

  const flipBtn = carouselSection.querySelector(
    ".carousel__btn_type_flip"
  );

  let currentIndex = 0;
  let showingQuestion = true;

  /**
   * Update the carousel card display and button states.
   *
   * @returns {void}
   */
  function updateDisplay() {
    const hasCards = deck.cards.length>0;

    if (!hasCards) {
      sectionTitleEl.textContent = `${deck.name} — No cards`;
      cardTextEl.textContent = "This deck has no cards yet.";
      prevBtn.disabled = true;
      nextBtn.disabled = true;
      flipBtn.disabled = true;
      return;
    }

    const currentCard = deck.cards[currentIndex];
    const color = hexToString(deck.color) || "default";

    sectionTitleEl.textContent = getCarouselTitleString(
      deck,
      currentIndex
    );

    removeColorClasses(cardEl);

    if (showingQuestion) {
      cardTextEl.textContent = currentCard.question;
      cardEl.classList.add(`carousel__card_color_${color}`);
    } else {
      cardTextEl.textContent = currentCard.answer;
      cardEl.classList.add("carousel__card_color_white");
    }

    prevBtn.disabled = currentIndex === 0;
    nextBtn.disabled = currentIndex === deck.cards.length - 1;
    flipBtn.disabled = false;
  }

  prevBtn.onclick = () => {
    if (currentIndex > 0) {
      currentIndex -= 1;
      showingQuestion = true;
      updateDisplay();
    }
  };

  nextBtn.onclick = () => {
    if (currentIndex < deck.cards.length - 1) {
      currentIndex += 1;
      showingQuestion = true;
      updateDisplay();
    }
  };

  flipBtn.onclick = () => {
    if (deck.cards.length === 0) {
      return;
    }

    showingQuestion = !showingQuestion;
    updateDisplay();
  };

  updateDisplay();
}

export {
  getDeckIdFromHash,
  getCarouselTitleString,
  renderCarouselView,
};