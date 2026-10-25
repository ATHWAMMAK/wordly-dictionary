# Wordly Dictionary

## Description

Wordly Dictionary is a web application that allows users to search for English words and explore their meanings, definitions, examples, and pronunciation when audio is available.

The application uses the Free Dictionary API to retrieve dictionary information and presents the results in a simple, user-friendly interface.

## Features

- **Word Search:** Search for English words and retrieve their dictionary entries.
- **Definitions and Meanings:** View word definitions, parts of speech, and example sentences when available.
- **Pronunciation:** Listen to word pronunciation when audio is provided by the API.
- **Recent Searches:** View and revisit up to five recently searched words during the current session.
- **Clear Search:** Clear the current search input and displayed results.
- **Loading Indicator:** See when a dictionary search is in progress.
- **Error Handling:** Receive helpful messages when a word cannot be found or a request fails.
- **Responsive Design:** Use the application on desktop and mobile screens.

## Technologies Used

- HTML5
- CSS3
- JavaScript
- Free Dictionary API

## API

This project uses the Free Dictionary API:

https://dictionaryapi.dev/

## Getting Started

### Prerequisites

You need a modern web browser and an internet connection.

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/ATHWAMMAK/wordly-dictionary.git
   ```

2. Navigate to the project directory:

   ```bash
   cd wordly-dictionary
   ```

3. Open `index.html` in your web browser.

You can also use the Live Server extension in Visual Studio Code to run the application locally.

## How to Use

1. Open the Wordly Dictionary application.
2. Enter an English word in the search field.
3. Click **Search** to retrieve its dictionary entry.
4. Read the definitions, meanings, and examples displayed.
5. Click **Listen**, when available, to try the pronunciation audio.
6. Select a word under **Recent Searches** to search for it again.
7. Click **Clear Search** to clear the current search and results.

## Project Structure

```text
wordly-dictionary/
├── index.html
├── style.css
├── index.js
└── README.md
```

## Limitations

- An internet connection is required to retrieve dictionary entries.
- Pronunciation audio depends on availability from the external API.
- Recent searches are stored in memory and reset when the page is refreshed.

## Author

ATHWAMMAK

## License

This project was created for learning and educational purposes.
