import { hexToString, removeColorClasses } from "./decks.js";
import { showConfirmation } from "./modal.js";

const deckViewSection = document.querySelector("#deck-view");
const deckTitle = deckViewSection.querySelector(".gallery__title");
const cardList = deckViewSection.querySelector(".gallery__list");
const cardTemplate = document.querySelector("#card-template");


/**
 * Create one card element for the open deck view.
 *
 * @param {Object} cardData - The card data to render.
 * @param {string} cardData.question -  The card question.
 * @param {string} cardData.answer -  The card answer.
 * @param {Object} deck - The deck containing the card.
 * @returns {HTMLElement} The completed card element.
 */
function createCardElement(cardData, deck) {
  const cardEl = cardTemplate.textContent
  .querySelector (".card")
  .cloneNode(true);

  const titleEl = cardEl.querySelector(".card__title");
  const flipBtn = cardEl.querySelector(".card__btn_type_flip");
  const deleteBtn = cardEl.querySelector(".card__btn_type_delete");
  const colorName = hexToString(deck.color) || "default";
  let showingQuestion = true;

  titleEl.textContent = cardData.question;
  cardEl.classList.add(`card_color_${colorName}`);

  flipBtn.addEventListener("click", () => {
    showingQuestion = !showingQuestion;
    titleEl.textContent = showingQuestion
      ? cardData.question
      : cardData.answer;

      removeColorClasses(cardEl);
      cardEl.classList.add(
        showingQuestion ? `card_color_${colorName}` : `card_color_white`
      );
    });
    
  deleteBtn.addEventListener("click", () => { 
   showConfirmation("Delete this card?",() => {
    const cardIndex = deck.cards.indexOf(cardData);
    if (cardIndex !== -1) {
      deck.cards.splice(cardIndex, 1);
    }
    cardEl.remove();
   });
  });
  return cardEl;
}

/**
 * Render the selected deck and all of its cards in the open deck view.
 *
 * @param {Object} deck - The deck to render.
 * @param {string} deck.name - The deck name.
 * @param {Array<Object>} deck.cards - The deck cards array.
 * @returns {void}
 */
  function renderDeckView(deck) {
    deckTitle.textContent = deck.name;
    cardList.innerHTML = "";

deck.cards.forEach((card) => {
  cardList.append(createCardEl(card,deck));
});
  }

  export { createCardEl, renderDeckView};