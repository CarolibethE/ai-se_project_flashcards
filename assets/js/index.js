import { initialDecks, getDeckByID, renderDecks } from "./decks.js";
import { getDeckIdFromHash, renderCarouselView } from "./carousel.js";

const decks = initialDecks;

const mainContentEl = document.querySelector("#main-content");
const homeSection = document.querySelector("#home");
const carouselSection = document.querySelector("#carousel");
const notFoundSection = document.querySelector("#not-found");


function renderHomeView() {
    homeSection.style.display = "block";
    carouselSection.style.display = "none";
    notFoundSection.style.display = "none";

    mainContentEl.classList.remove("page__main-content_type_carousel");

    renderDecks(decks);
}

function renderNotFoundView() {
    homeSection.style.display = "none";
    carouselSection.style.display = "none";
    notFoundSection.style.display = "flex";

    renderDecks(decks);

    mainContentEl.classList.remove("page__main-content_type_carousel");
}

function renderRoute() {
  const hash = window.location.hash || "#home";

  if (hash === "#home") {
    renderHomeView();
    return;
  }

  if (hash.startsWith("#carousel/")) {
    const deckId = getDeckIdFromHash(hash);
    const deck = getDeckByID(decks, deckId);

    if (deck) {
        homeSection.style.display = "none";
        carouselSection.style.display = "flex";
        notFoundSection.style.display = "none";
        
        renderCarouselView(deck);   
        return;
    }
  }

  renderNotFoundView();
}

window.addEventListener("hashchange", renderRoute);
renderRoute();
