import { initialDecks, getDeckByID, renderDecks } from "./decks.js";
import { getDeckIdFromHash, renderCarouselView } from "./carousel.js";
import { renderDeckView } from "./deck-view.js";

const decks = initialDecks;
let currentDeck = null;

const mainContentEl = document.querySelector("#main-content");
const pageEl = document.querySelector(".page");
const homeSection = document.querySelector("#home");
const deckViewSection = document.querySelector("#deck-view");
const carouselSection = document.querySelector("#carousel");
const notFoundSection = document.querySelector("#not-found");
const practiceBtn = deckViewSection.querySelector(".gallery__practice-btn");
const newDeckSection = document.querySelector("#new-deck-view");
const newDeckBtn = document.querySelector("#home .gallery__new-card-btn");

newDeckBtn.addEventListener("click", () => {
  window.location.hash = "#new-deck";
});

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

  pageEl.classList.remove("page_no-mobile-bar");
  pageEl.classList.remove("page_location_carousel");

  newDeckSection.style.display = "none";
  newDeckSection.setAttribute("hidden", "");

  renderDecks(decks);
}

function renderDeckPageView(deck) {
  currentDeck = deck;

  homeSection.style.display = "none";
  homeSection.setAttribute("hidden", "");

  deckViewSection.style.display = "block";
  deckViewSection.removeAttribute("hidden");

  carouselSection.style.display = "none";
  carouselSection.setAttribute("hidden", "");

  notFoundSection.style.display = "none";
  notFoundSection.setAttribute("hidden", "");

  mainContentEl.classList.remove("page__main-content_type_carousel");

  pageEl.classList.remove("page_no-mobile-bar");
  pageEl.classList.remove("page_location_carousel");

  newDeckSection.style.display = "none";
  newDeckSection.setAttribute("hidden", "");

  renderDeckView(currentDeck);
}

function renderCarouselPageView(deck) {
  homeSection.style.display = "none";
  homeSection.setAttribute("hidden", "");

  deckViewSection.style.display = "none";
  deckViewSection.setAttribute("hidden", "");

  carouselSection.style.display = "flex";
  carouselSection.removeAttribute("hidden");

  notFoundSection.style.display = "none";
  notFoundSection.setAttribute("hidden", "");

  mainContentEl.classList.add("page__main-content_type_carousel");

  pageEl.classList.add("page_no-mobile-bar");
  pageEl.classList.add("page_location_carousel");

  newDeckSection.style.display = "none";
  newDeckSection.setAttribute("hidden", "");

  renderCarouselView(deck);
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

  mainContentEl.classList.remove("page__main-content_type_carousel");

  pageEl.classList.add("page_no-mobile-bar");
  pageEl.classList.remove("page_location_carousel");

  newDeckSection.style.display = "none";
  newDeckSection.setAttribute("hidden", "");
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
      renderDeckPageView(deck);
      return;
    }
  }

  if (hash.startsWith("#carousel/")) {
    const deckId = getDeckIdFromHash(hash);
    const deck = getDeckByID(decks, deckId);

    if (deck) {
      renderCarouselPageView(deck);
      return;
    }
  }

  if (hash == "new-deck-view") {
    homeSection.style.display = "none";
    homeSection.setAttribute("hidden", "");

    deckViewSection.style.display = "none";
    deckViewSection.setAttribute("hidden", "");

    carouselSection.style.display = "none";
    carouselSection.setAttribute("hidden", "");

    notFoundSection.style.display = "none";
    notFoundSection.setAttribute("hidden", "");

    newDeckSection.style.display = "block";
    newDeckSection.removeAttribute("hidden");

    pageEl.classList.remove("page_no-mobile-bar");
    pageEl.classList.remove("page_location_carousel");

    return; 
  }

  renderNotFoundView();
}

console.log("Decks data:", decks);

window.addEventListener("hashchange", renderRoute);
renderRoute();
