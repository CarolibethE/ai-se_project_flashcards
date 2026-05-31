import { hexToString, removeColorClasses } from "./colorMap.js";

function renderDeckView(deck) {
  const deckViewSection = document.querySelector("#deck-view");
  const deckTitle = deckViewSection.querySelector(".gallery__title");
  const cardList = deckViewSection.querySelector(".gallery__list");
  const cardTemplate = document.querySelector("#card-template");

  deckTitle.textContent = deck.name;
  cardList.innerHTML = "";

  function createCard(cardData) {
    const cardEl = cardTemplate.content.querySelector(".card").cloneNode(true);

    const cardTitle = cardEl.querySelector(".card__title");
    const flipBtn = cardEl.querySelector(".card__btn_type_flip");
    const deleteBtn = cardEl.querySelector(".card__btn_type_delete");

    const color = hexToString(deck.color) || "default";
    let isFlipped = false;

    cardTitle.textContent = cardData.question;

    removeColorClasses(cardEl);
    cardEl.classList.add(`card_color_${color}`);

    flipBtn.addEventListener("click", () => {
      isFlipped = !isFlipped;

      cardTitle.textContent = isFlipped ? cardData.answer : cardData.question;

      if (isFlipped) {
        removeColorClasses(cardEl);
        cardEl.classList.add("card_color_white");
      } else {
        removeColorClasses(cardEl);
        cardEl.classList.add(`card_color_${color}`);
      }
    });

    deleteBtn.addEventListener("click", () => {
      cardEl.remove();
    });

    return cardEl;
  }

  function renderCard(cardData) {
    const cardEl = createCard(cardData);
    cardList.append(cardEl);
  }

  deck.cards.forEach(renderCard);
}

pageEl.classList.remove("page_no-mobile-bar");

export { renderDeckView };