import {
  fetchedDecks,
  getDeckByID,
  renderDecks,
} from "./decks.js";

import {
  getDeckIdFromHash,
  renderCarouselView,
} from "./carousel.js";

import {
  renderDeckView 
} from "./deck-view.js";

import {
  resetNewDeckForm,
} from "./new-deck-view.js";

import {
   getDecks, 
   deleteDeck 
  } from "./api.js";

  import {
    showError,
    showConfirmation
  } from "./modal.js";

let currentDeck = null;

const mainContentEl = document.querySelector("#main-content");
const pageEl = document.querySelector(".page");
const homeSection = document.querySelector("#home");
const deckViewSection = document.querySelector("#deck-view");
const carouselSection = document.querySelector("#carousel");
const notFoundSection = document.querySelector("#not-found");
const newDeckSection = document.querySelector("#new-deck-view");
const aboutSection = document.querySelector("#about");

const allSections = [
  homeSection,
  deckViewSection,
  carouselSection,
  newDeckSection,
  aboutSection,
  notFoundSection,
];

const practiceBtn = deckViewSection.querySelector(
  ".gallery__practice-btn"
);

const newDeckBtn = document.querySelector(
  "#home .gallery__new-card-btn"
);
const addCardBtn = deckViewSection.querySelector(
  ".gallery__new-card-btn"
);

/**
 * Show one application section and hide all other routed sections.
 * 
 * @param {HTMLElement} currentSection  - The section to make visible.
 * @param {string} display - The display value to apply to the visble section.
 * @returns {void}
 */
function showView(currentSection, display) {
  allSections.forEach((section) => {
  section.style.display = "none";
  section.setAttribute("hidden", "");
  });
  currentSection.style.display = display;
  currentSection.removeAttribute("hidden");
}

/**
 * Remove carousel-specific layout classes from the page.
 * 
 * @returns {void}
 */
function resetPageLayout() {
  mainContentEl.classList.remove(
    "page__main-content_type_carousel"
  );
  pageEl.classList.remove("page_location_carousel");
}
 
/**
 * Delete a deck through the API and remove it from the local cache.
 * 
 * @param {Object} deck - The deck to delete.
 * @param {string} deck._id - The id of the deck.
 * @returns {Promise<void>} A promise that resolves when deletion completes.
 * @param {HTMLElemnent} deckEl - The rendered deck element to remove from the page.  
 * @returns {void}
 */
function handleDeleteDeck(deck, deckEl) {
  showConfirmation(`Delete "${deck.name}"?`, () => {
    deleteDeck(deck._id)
      .then(() => {
        const deckIndex = fetchedDecks.findIndex(
          (fetchedDeck) => fetchedDeck._id === deck._id
        );

        if (deckIndex !== -1) {
          fetchedDecks.splice(deckIndex, 1);
        }

        deckEl.remove();
      })
      .catch(() => {
        showError("Unable to delete the deck. Please try again.");
      });
  });
}

/**
 * Render the home view.
 *
 * @returns {void}
 */
function renderHomeView() {
  currentDeck = null;
  showView(homeSection, "flex");
  resetPageLayout();
  pageEl.classList.remove("page_no-mobile-bar");
  renderDecks(fetchedDecks, handleDeleteDeck);
}

/**
 * Render the selected open deck view.
 *
 * @param {Object} deck - The deck to render.
 * @returns {void}
 */
function renderDeckPageView(deck) {
  currentDeck = deck;

  showView(deckViewSection, "flex");
  resetPageLayout();
  pageEl.classList.remove("page_no-mobile-bar");

  renderDeckView(deck);
}

/**
 * Render the practice carousel for a deck.
 *
 * @param {Object} deck - The deck to render.
 * @returns {void}
 */
function renderCarouselPageView(deck) {
  currentDeck = deck;

  showView(carouselSection, "flex");
  mainContentEl.classList.add("page__main-content_type_carousel");
  pageEl.classList.add("page_no-mobile-bar", "page_location_carousel");
  renderCarouselView(deck);
}

/**
 * Render the new deck view.
 *
 * @returns {void}
 */
function renderNewDeckView(mode = "deck", deck = null) {
  const activeDeck = deck || null;

  currentDeck = activeDeck;
  showView(newDeckSection, "flex");
  resetNewDeckForm(mode, activeDeck);
}

/**
 * Render the about view.
 *
 * @returns {void}
 */
function renderAboutView() {
  currentDeck = null;
  showView(aboutSection, "block");
  resetPageLayout();
  pageEl.classList.add("page_no-mobile-bar");
}

/**
 * Render the 404 not found view.
 *
 * @returns {void}
 */
function renderNotFoundView() {
  currentDeck = null;
  showView(notFoundSection, "flex");
  resetPageLayout();
  pageEl.classList.add("page_no-mobile-bar");
}

/**
 * Route the application based on current URL hash.
 * 
 * @returns {void}
 */
function router() {
  const hash = window.location.hash || "#home";
  
  if (hash === "#home") {
    renderHomeView();
    return;
  }

  if (hash === "#about") {
    renderAboutView();
    return;
  }

  if (hash === "#new-deck") {
    renderNewDeckView("deck");
    return;
  }

  if (hash.startsWith("#new-card/")) {
    const deckId = hash.replace("#new-card/", "");
    const deck = getDeckByID(deckId);

    if (deck) {
      renderNewDeckView("card", deck);
      return;
    }
  }

  if (hash.startsWith("#deck/")) {
    const deckId = hash.replace("#deck/", "");
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

newDeckBtn.addEventListener("click", () => {
  window.location.hash = "#new-deck";
});

addCardBtn.addEventListener("click", (event) => {
  event.preventDefault();
  event.stopPropagation();

  const deckId = currentDeck?._id || window.location.hash.replace("#deck/", "");

  if (!deckId) {
    showError("Open a deck first before adding a card.");
    return;
  }

  window.location.hash = `#new-card/${deckId}`;
});

practiceBtn.addEventListener("click", (event) => {
  event.preventDefault();

  const deckId = currentDeck?._id || window.location.hash.split("/")[1];

  if (deckId) {
    window.location.hash = `#carousel/${deckId}`;
  }
});

window.addEventListener("hashchange", router);

document.addEventListener("DOMContentLoaded", () => {
  getDecks()
  .then((decks) => {
    fetchedDecks.splice(0, fetchedDecks.length, ...decks);
    renderDecks(fetchedDecks, handleDeleteDeck);
  })
  .catch(() => {
    showError("Unable to load decks from the server.");
  })
  .finally(router);
});

export {
  showView,
  resetPageLayout,
  handleDeleteDeck,
  renderHomeView,
  renderDeckPageView,
  renderCarouselPageView,
  renderNewDeckView,
  renderAboutView,
  renderNotFoundView,
  router,
};
