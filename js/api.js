const baseUrl = "https://se-flashcards-api.en.tripleten-services.com/v1";

const headers = {
  "Content-Type": "application/json",
  Authorization: "019f7d65-27da-76db-b414-86982e4034d9",
};

/**
 * Validate an HTTP response and parse JSON when appropriate.
 *
 * @param {Response} response - The fetch response to check.
 * @returns {Promise<any|void>} A parsed JSON payload, empty promise for 204, or rejected promise on error.
 */
function checkResponse(response) {
  if (!response.ok) {
    return Promise.reject(new Error(`Request failed: ${response.status}`));
  }

  if (response.status === 204) {
    return Promise.resolve();
  }

  return response.json();
}

/**
 * Fetch all decks from the API.
 *
 * @returns {Promise<any<Object>>} A promise that resolves to the list of decks.
 */
function getDecks() {
  return fetch(`${baseUrl}/decks`, {
    headers,
  }).then(checkResponse);
}

/**
 * Create a new deck through the API.
 *
 * @param {Object} deck - The deck data to create.
 * @param {string} deck.name - The deck name.
 * @param {string} deck.color - The deck color.
 * @param {Array<Object>} deck.cards - The deck cards array.
 * @returns {Promise<Object>} A promise resolving with the created deck.
 */
function addDeck({ name, color, cards }) {
  return fetch(`${baseUrl}/decks`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      name,
      color,
      cards,
    }),
  }).then(checkResponse);
}

/**
 * Delete a deck through the  remote API.
 *
 * @param {string} deckId - The id of the deck to delete.
 * @returns {Promise<void>} A promise that resolves when deletion completes.
 */
function deleteDeck(deckId) {
  return fetch(`${baseUrl}/decks/${deckId}`, {
    method: "DELETE",
    headers,
  }).then(checkResponse);
}

export {
  getDecks,
  addDeck,
  deleteDeck,
};