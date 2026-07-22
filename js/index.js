import {
  fetchedDecks,
  getDeckByID,
  renderDecks,
} from "./decks.js";

import {
  getDeckIdFromHash,
  renderCarouselView,
} from "./carousel.js";

import { renderDeckView } from "./deck-view.js";

import {
  disableSubmitBtn,
  showError,
} from "./new-deck-view.js";

import { getDecks, deleteDeck } from "./api.js";

let currentDeck = null;

const mainContentEl = document.querySelector("#main-content");
const pageEl = document.querySelector(".page");
const homeSection = document.querySelector("#home");
const deckViewSection = document.querySelector("#deck-view");
const carouselSection = document.querySelector("#carousel");
const notFoundSection = document.querySelector("#not-found");
const newDeckSection = document.querySelector("#new-deck-view");

const practiceBtn = deckViewSection.querySelector(
  ".gallery__practice-btn"
);

const newDeckBtn = document.querySelector(
  "#home .gallery__new-card-btn"
);

newDeckBtn.addEventListener("click", () => {
  window.location.hash = "#new-deck-view";
});

practiceBtn.addEventListener("click", () => {
  if (currentDeck) {
    window.location.hash = `#carousel/${currentDeck._id}`;
  }
});

/**
 * Deletes a deck from the server, shared array, and page.
 *
 * @param {Object} deck - The deck being deleted.
 * @param {HTMLElement} deckEl - The rendered deck element.
 */
function handleDeleteDeck(deck, deckEl) {
  deleteDeck(deck._id)
    .then(() => {
      deckEl.remove();

      const deckIndex = fetchedDecks.findIndex(
        (fetchedDeck) => fetchedDeck._id === deck._id
      );

      if (deckIndex !== -1) {
        fetchedDecks.splice(deckIndex, 1);
      }
    })
    .catch(() => {
      showError("Unable to delete the deck. Please try again.");
    });
}

function renderHomeView() {
  homeSection.style.display = "flex";
  homeSection.removeAttribute("hidden");

  deckViewSection.style.display = "none";
  deckViewSection.setAttribute("hidden", "");

  carouselSection.style.display = "none";
  carouselSection.setAttribute("hidden", "");

  notFoundSection.style.display = "none";
  notFoundSection.setAttribute("hidden", "");

  newDeckSection.style.display = "none";
  newDeckSection.setAttribute("hidden", "");

  mainContentEl.classList.remove(
    "page__main-content_type_carousel"
  );

  pageEl.classList.remove("page_no-mobile-bar");
  pageEl.classList.remove("page_location_carousel");
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

  newDeckSection.style.display = "none";
  newDeckSection.setAttribute("hidden", "");

  mainContentEl.classList.remove(
    "page__main-content_type_carousel"
  );

  pageEl.classList.remove("page_no-mobile-bar");
  pageEl.classList.remove("page_location_carousel");

  renderDeckView(deck);
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

  newDeckSection.style.display = "none";
  newDeckSection.setAttribute("hidden", "");

  mainContentEl.classList.add(
    "page__main-content_type_carousel"
  );

  pageEl.classList.add("page_no-mobile-bar");
  pageEl.classList.add("page_location_carousel");

  renderCarouselView(deck);
}

function renderNewDeckView() {
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

  mainContentEl.classList.remove(
    "page__main-content_type_carousel"
  );

  pageEl.classList.remove("page_no-mobile-bar");
  pageEl.classList.remove("page_location_carousel");

  disableSubmitBtn();
}

function renderNotFoundView() {
  homeSection.style.display = "none";
  homeSection.setAttribute("hidden", "");

  deckViewSection.style.display = "none";
  deckViewSection.setAttribute("hidden", "");

  carouselSection.style.display = "none";
  carouselSection.setAttribute("hidden", "");

  newDeckSection.style.display = "none";
  newDeckSection.setAttribute("hidden", "");

  notFoundSection.style.display = "flex";
  notFoundSection.removeAttribute("hidden");

  mainContentEl.classList.remove(
    "page__main-content_type_carousel"
  );

  pageEl.classList.add("page_no-mobile-bar");
  pageEl.classList.remove("page_location_carousel");
}

function router() {
  const hash = window.location.hash || "#home";

  if (hash === "#home") {
    renderHomeView();
    return;
  }

  if (hash === "#new-deck-view" || hash === "#new-deck") {
    renderNewDeckView();
    return;
  }

  if (hash.startsWith("#deck/")) {
    const deckId = hash.split("/")[1];
    const deck = getDeckByID(deckId);

    if (deck) {
      renderDeckPageView(deck);
      return;
    }
  }

  if (hash.startsWith("#carousel/")) {
    const deckId = getDeckIdFromHash(hash);
    const deck = getDeckByID(deckId);

    if (deck) {
      renderCarouselPageView(deck);
      return;
    }
  }

  renderNotFoundView();
}

window.addEventListener("hashchange", router);

document.addEventListener("DOMContentLoaded", () => {
  getDecks()
    .then((decks) => {
      fetchedDecks.push(...decks);
      renderDecks(decks, handleDeleteDeck);
    })
    .catch(() => {
      showError("Can't fetch decks");
    })
    .finally(() => {
      router();
    });
});