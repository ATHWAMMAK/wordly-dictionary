
// =========================
// DOM Elements
// =========================

const searchForm = document.getElementById("search-form");
const wordInput = document.getElementById("word-input");
const messageSection = document.getElementById("message-section");
const statusMessage = document.getElementById("status-message");
const resultSection = document.getElementById("result-section");
const searchHistoryList = document.getElementById("search-history");
const loadingIndicator = document.getElementById("loading-indicator");
const clearSearchButton = document.getElementById("clear-search-button");

let searchHistory = [];
let activeController = null;


// =========================
// Search Form
// =========================

searchForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const word = wordInput.value.trim();

    if (word === "") {
        statusMessage.textContent = "Please enter a word to search.";
        resultSection.replaceChildren();
        return;
    }

    performSearch(word);
});


// =========================
// Clear Search
// =========================

clearSearchButton.addEventListener("click", function () {
    // Cancel an ongoing search, if there is one.
    if (activeController) {
        activeController.abort();
        activeController = null;
    }

    wordInput.value = "";
    resultSection.replaceChildren();
    statusMessage.textContent = "";

    loadingIndicator.hidden = true;
    messageSection.setAttribute("aria-busy", "false");

    searchForm.querySelector('button[type="submit"]').disabled = false;

    wordInput.focus();
});


// =========================
// Search and Update History
// =========================

function performSearch(word) {
    // Remove an existing occurrence so the latest search goes first.
    searchHistory = searchHistory.filter(
        historyWord => historyWord.toLowerCase() !== word.toLowerCase()
    );

    searchHistory.unshift(word);

    // Keep only the five most recent searches.
    searchHistory = searchHistory.slice(0, 5);

    displaySearchHistory();
    searchWord(word);
}


// =========================
// Fetch Dictionary Data
// =========================

async function searchWord(word) {
    // Cancel any previous request.
    if (activeController) {
        activeController.abort();
    }

    const controller = new AbortController();
    activeController = controller;

    statusMessage.textContent = "";
    loadingIndicator.hidden = false;
    messageSection.setAttribute("aria-busy", "true");

    searchForm.querySelector('button[type="submit"]').disabled = true;
    resultSection.replaceChildren();

    try {
        const response = await fetch(
            "https://api.dictionaryapi.dev/api/v2/entries/en/" + encodeURIComponent(word),
            { signal: controller.signal }
        );

        if (!response.ok) {
            if (response.status === 404) {
                throw new Error("Word not found. Please try another word.");
            }

            throw new Error(
                "Unable to retrieve the word. Please try again."
            );
        }

        const data = await response.json();

        if (!Array.isArray(data) || data.length === 0) {
            throw new Error("No dictionary definitions were found.");
        }

        displayWord(data[0]);

    } catch (error) {
        // Ignore requests that were intentionally cancelled.
        if (error.name === "AbortError") {
            return;
        }

        console.error("Dictionary error:", error);

        if (error instanceof TypeError) {
            statusMessage.textContent =
                "Network error. Please check your internet connection and try again.";
        } else {
            statusMessage.textContent =
                error.message || "Something went wrong. Please try again.";
        }

    } finally {
        // Only the latest request should update the loading state.
        if (activeController === controller) {
            loadingIndicator.hidden = true;
            messageSection.setAttribute("aria-busy", "false");

            searchForm.querySelector('button[type="submit"]').disabled = false;

            activeController = null;
        }
    }
}


// =========================
// Display Dictionary Entry
// =========================

function displayWord(entry) {
    const resultCard = document.createElement("article");
    resultCard.className = "result-card";

    const wordHeading = document.createElement("h2");
    wordHeading.textContent = entry.word;

    resultCard.appendChild(wordHeading);

    // Display pronunciation text.
    if (entry.phonetic) {
        const pronunciation = document.createElement("p");
        pronunciation.textContent = "Pronunciation: " + entry.phonetic;

        resultCard.appendChild(pronunciation);
    }

    // Find available pronunciation audio.
    if (entry.phonetics && entry.phonetics.length > 0) {
        const audioSource = entry.phonetics.find(phonetic => {
            return (
                phonetic.audio &&
                phonetic.audio.trim() !== "" &&
                /^https?:\/\//i.test(phonetic.audio)
            );
        });

        if (audioSource) {
            const pronunciationAudio = new Audio();

            pronunciationAudio.preload = "none";
            pronunciationAudio.src = audioSource.audio;

            const listenButton = document.createElement("button");

            listenButton.textContent = "🔊 Listen";
            listenButton.className = "listen-button";
            listenButton.type = "button";

            listenButton.addEventListener("click", async function () {
                try {
                    statusMessage.textContent = "Loading pronunciation...";

                    pronunciationAudio.currentTime = 0;

                    await pronunciationAudio.play();

                    statusMessage.textContent = "";

                } catch (error) {
                    console.error("Audio playback error:", error);

                    statusMessage.textContent =
                        "Pronunciation audio is temporarily unavailable. Please try again later.";
                }
            });

            resultCard.appendChild(listenButton);
        }
    }

    // Display meanings and definitions.
    if (Array.isArray(entry.meanings)) {
        entry.meanings.forEach(meaning => {
            const partOfSpeech = document.createElement("h3");

            partOfSpeech.textContent = meaning.partOfSpeech;

            resultCard.appendChild(partOfSpeech);

            if (Array.isArray(meaning.definitions)) {
                meaning.definitions.forEach(definition => {
                    const definitionText = document.createElement("p");

                    definitionText.textContent =
                        "Definition: " + definition.definition;

                    resultCard.appendChild(definitionText);

                    if (definition.example) {
                        const exampleText = document.createElement("p");

                        exampleText.textContent =
                            'Example: "' + definition.example + '"';

                        resultCard.appendChild(exampleText);
                    }
                });
            }
        });
    }

    resultSection.replaceChildren(resultCard);
}


// =========================
// Display Recent Searches
// =========================

function displaySearchHistory() {
    searchHistoryList.replaceChildren();

    searchHistory.forEach(function (word) {
        const listItem = document.createElement("li");
        const historyButton = document.createElement("button");

        historyButton.textContent = word;
        historyButton.type = "button";
        historyButton.className = "history-button";

        historyButton.addEventListener("click", function () {
            wordInput.value = word;
            performSearch(word);
        });

        listItem.appendChild(historyButton);
        searchHistoryList.appendChild(listItem);
    });
}

