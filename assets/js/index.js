import { initialDecks, getDeckByID, renderDecks } from "./decks.js";
import { getDeckIdFromHash, renderCarouselView } from "./carousel.js";
import { renderDeckView } from "./deck-view.js";

const decks = initialDecks;
let currentDeck = null;

const mainContentEl = document.querySelector("#main-content");
const homeSection = document.querySelector("#home");
const deckViewSection = document.querySelector("#deck-view");
const carouselSection = document.querySelector("#carousel");
const notFoundSection = document.querySelector("#not-found");
const practiceBtn = deckViewSection.querySelector(".gallery__practice-btn");

practiceBtn.addEventListener("click", () => {
  if (currentDeck) {
    window.location.hash = `#carousel/${currentDeck.id}`;
  }
});

function renderHomeView() {
    homeSection.style.display = "flex";
    homeSection.removeAttribute("hidden");
    carouselSection.style.display = "none";
    carouselSection.setAttribute("hidden", "");
    notFoundSection.style.display = "none";
    notFoundSection.setAttribute("hidden", "");
    deckViewSection.style.display = "none";
    deckViewSection.setAttribute("hidden", "");

    mainContentEl.classList.remove("page__main-content_type_carousel");

    renderDecks(decks);
}

function renderNotFoundView() {
    homeSection.style.display = "none";
    homeSection.setAttribute("hidden", "");
    deckViewSection.style.display = "none";
    deckViewSection.setAttribute("hidden", "");
    carouselSection.style.display = "none";
    carouselSection.setAttribute("hidden", "");
    notFoundSection.style.display = "flex";
    notFoundSection.removeAttribute("hidden");

    renderDecks(decks);

    mainContentEl.classList.remove("page__main-content_type_carousel");
}

function renderRoute() {
  const hash = window.location.hash || "#home";

  if (hash === "#home") {
    renderHomeView();
    return;
  }

  if (hash.startsWith("#deck/")) {
    const deckId = hash.split("/")[1];
    const deck = getDeckByID(decks, deckId);

    if (deck) {
      currentDeck = deck;
      homeSection.style.display = "none";
      homeSection.setAttribute("hidden", "");
      deckViewSection.style.display = "block";
      deckViewSection.removeAttribute("hidden");
      carouselSection.style.display = "none";
      carouselSection.setAttribute("hidden", "");
      notFoundSection.style.display = "none";
      notFoundSection.setAttribute("hidden", "");

      mainContentEl.classList.remove(
        "page__main-content_type_carousel"
      );

      renderDeckView(currentDeck);
      return;
    }
  }

  if (hash.startsWith("#carousel/")) {
    const deckId = getDeckIdFromHash(hash);
    const deck = getDeckByID(decks, deckId);

    if (deck) {
        homeSection.style.display = "none";
        homeSection.setAttribute("hidden", "");
        carouselSection.style.display = "flex";
        carouselSection.removeAttribute("hidden");
        notFoundSection.style.display = "none";
        notFoundSection.setAttribute("hidden", "");
        deckViewSection.style.display = "none";
        deckViewSection.setAttribute("hidden", "");
        
        renderCarouselView(deck);   
        return;
    }
  }

  renderNotFoundView();
}

window.addEventListener("hashchange", renderRoute);
renderRoute();
