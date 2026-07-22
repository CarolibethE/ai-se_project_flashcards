const baseUrl = "https://se-flashcards-api.en.tripleten-services.com/v1";

const headers = {
  "Content-Type": "application/json",
  Authorization: "019f7d65-27da-76db-b414-86982e4034d9",
};

function checkResponse(response) {
  if (response.ok) {
    if (response.status === 204) {
      return Promise.resolve();
    }

    return response.json();
  }

  return Promise.reject(`Error: ${response.status}`);
}

function getDecks() {
  return fetch(`${baseUrl}/decks`, { headers }).then(checkResponse);
}

function deleteDeck(deckId) {
  return fetch(`${baseUrl}/decks/${deckId}`, {
    method: "DELETE",
    headers,
  }).then(checkResponse);
}

export { getDecks, deleteDeck };