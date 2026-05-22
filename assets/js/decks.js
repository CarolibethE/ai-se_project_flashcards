import { hexToString, removeColorClasses } from "./colorMap.js";

const initialDecks = [
    {
        id: "html",
        name: "Basic HTML Tags",
        color: "#64d583",
        cards: [
            { question: "<h1>", answer: "Main heading" },
            { question: "<p>", answer: "Paragraph" },
            { question: "<a>", answer: "Anchor (link)" },
        ],      
    },
    {
        id: "git",
        name: "Git Commands",
        color: "#91a8f9",
        cards: [
            { question: "git status", answer: "shows current status" },
            { question: "git add .", answer: "Stage all changes" },
            { question: "git commit -m", answer: "Creates commit" },
        ],
    },
    {
        id: "agile",
        name: "Agile Development Terminology",
        color: "#ee92d7",
        cards: [
            { question: "Sprint", answer: "Short development cycle"},
            { question: "Backlog", answer: "List of tasks/features"},
        ],
    },
    {
        id: "spanish",
        name: "Spanish Words",
        color: "#aa8ef0",
        cards: [
            { question: "Hola", answer: "Hello" },
            { question: "Adiós", answer: "Goodbye" },
            { question: "Gracias", answer: "Thank you" },
            { question: "por favor", answer: "please" },
        ],
    },
    {
        id: "physics",
        name: "Physics Terminology",
        color: "#ee955e",
        cards: [
            { question: "Force", answer: "Push or pull"},
            { question: "Velocity", answer: "Speed with direction"},
        ],
    },
    {
        id: "social-studies",
        name: "Social Studies Exam",
        color: "#f5d770",
        cards: [
            { question: "Democracy", answer: "Rule by the people"},
            { question: "Constitution", answer: "Framework of government"},
            {question: "Citizen", answer: "Member of a country"},
        ],
    },
];

export { initialDecks };

function getDeckByID(decks, id) {
  return decks.find((deck) => deck.id === id);
}

const deckTemplate = document.querySelector("#deck-template");
const deckList = document.querySelector(".gallery__list");

function createDeckEl(deckObj) {
  const deckEl = deckTemplate.content
    .querySelector(".card")
    .cloneNode(true);

  const linkEl = deckEl.querySelector(".card__link");
  const titleEl = deckEl.querySelector(".card__title");
  const countEl = deckEl.querySelector(".card__count");
  const deleteBtn = deckEl.querySelector(".card__delete-btn");

  linkEl.href = `#deck/${deckObj.id}`;
  titleEl.textContent = deckObj.name;

  const cardCount = deckObj.cards.length;
  countEl.textContent = `${cardCount} ${cardCount === 1 ? "card" : "cards"}`;

  const color = hexToString(deckObj.color) || "default";
  removeColorClasses(deckEl);
  deckEl.classList.add(`card_color_${color}`);

  deleteBtn.addEventListener("click", (evt) => {
    evt.preventDefault();
    evt.stopPropagation();
    deckEl.remove();
  });

  return deckEl;
}

function renderDeckEl(deckObj) {
  const deckEl = createDeckEl(deckObj);
  deckList.append(deckEl);
}

function clearDecks() {
  deckList.innerHTML = "";
}

function renderDecks(decks) {
  clearDecks();
  decks.forEach(renderDeckEl);
}

export {
  hexToString,
  removeColorClasses,
  getDeckByID,
  createDeckEl,
  renderDeckEl,
  renderDecks,
};