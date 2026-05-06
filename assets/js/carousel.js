import { hexToString, removeColorClasses } from "./decks.js";

function getDeckIdFromHash(hash) {
  const [, deckId] = hash.split("/");
  return deckId;
}

function getCarouselTitleString(deck, currentIndex) {
  return `${deck.name} — Card ${currentIndex + 1} of ${deck.cards.length}`;
}

function renderCarouselView(deck) {
  const carouselSection = document.querySelector("#carousel");
  const sectionTitleEl = carouselSection.querySelector(".carousel__title");
  const cardEl = carouselSection.querySelector(".carousel__card");
  const cardTextEl = carouselSection.querySelector(".carousel__card-text");
  const prevBtn = carouselSection.querySelector(".carousel__btn_type_left");
  const nextBtn = carouselSection.querySelector(".carousel__btn_type_right");
  const flipBtn = carouselSection.querySelector(".carousel__btn_type_flip");

  let currentIndex = 0;
  let showingQuestion = true;

  function updateDisplay() {
    const currentCard = deck.cards[currentIndex];

    sectionTitleEl.textContent = getCarouselTitleString(deck, currentIndex);

    removeColorClasses(cardEl);
    cardEl.classList.remove("carousel__card_color_white");

    const color = hexToString(deck.color) || "default";
    cardEl.classList.add(`carousel__card_color_${color}`);

    if (showingQuestion) {
      cardTextEl.textContent = currentCard.question;
      cardEl.classList.remove("carousel__card_color_white");
    } else {
      cardTextEl.textContent = currentCard.answer;
      cardEl.classList.add("carousel__card_color_white");
    }

    prevBtn.classList.toggle("carousel__btn_disabled", currentIndex === 0);
    nextBtn.classList.toggle(
      "carousel__btn_disabled",
      currentIndex === deck.cards.length - 1
    );
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
    showingQuestion = !showingQuestion;
    updateDisplay();
  };

  carouselSection.hidden = false;
  updateDisplay();
}

export { getDeckIdFromHash, getCarouselTitleString, renderCarouselView };