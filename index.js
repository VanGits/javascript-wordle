let popUpOpen = false;

var messageArray = [

  "hey u! it's vealy here. i'm gonna be changing my artist name soon! see if u can figure it b4 I officially announce it. lil surprise at the end if u crack it ;)"
];
var textPosition = 0;
var speed = 45;


typewriter = () => {
  document.querySelector("#message").innerHTML =
  
    messageArray[0].substring(0, textPosition) + "<span>\u25ae</span>";
  if (textPosition++ != messageArray[0].length) {
    setTimeout(typewriter, speed);
  }
};

window.addEventListener("load", typewriter);

function popUp() {
  var popUpNoti = document.getElementsByClassName("popUp");
  if (popUpOpen) {
    popUpOpen = false;
    popUpNoti.remove();
  }
  popUpOpen = true;
  popUpNoti = true;
}
function closePopUp() {
  var popUpNoti = document.getElementById("popUp");
  if (popUpNoti.style.display === "none") {
    popUpNoti.style.display = "flex";
  } else {
    popUpNoti.style.display = "none";
  }
}

function closePopSuccess() {
  var popUpSuccess = document.getElementById("congratulations__wrapper");
  if (popUpSuccess.style.visibility === "visible"){
    return popUpSuccess.style.display = "none"
  }
}

function popSuccess() {
  var popUpSuccess = document.getElementById("congratulations__wrapper");
  setInterval(() => {
      popUpSuccess.style.visibility = "visible";
  }, 3000)
    
  
}

document.addEventListener("DOMContentLoaded", () => {
  createSquares();

  let guessedWords = [[]];
  let availableSpace = 1;

  let word = "lotti";

  let guessedWordCount = 0;
  const keys = document.querySelectorAll(".keyboard__row button");
  const container = document.querySelector(".fireworks-container");
  const fireworks = new Fireworks(container);

  function getCurrentWordArr() {
    const numberOfGuessedWords = guessedWords.length;
    return guessedWords[numberOfGuessedWords - 1];
  }

  function updateGuessedWords(letter) {
    const currentWordArr = getCurrentWordArr();
   
    if (currentWordArr && currentWordArr.length < 5) {
      currentWordArr.push(letter);

      const availableSpaceEl = document.getElementById(String(availableSpace));
      availableSpace = availableSpace + 1;

      availableSpaceEl.textContent = letter;
    }
  }

  function getTileColor(letter, index) {
    const isCorrectLetter = word.includes(letter);

    if (!isCorrectLetter) {
      return "rgb(58,58,60)";
    }

    const letterInPosition = word.charAt(index);
    const correctPosition = letter === letterInPosition;

    if (correctPosition) {
      return "rgb(83,141,78)";
    }

    return "rgb(255, 209, 0)";
  }

  function handleSubmitWord() {
    const currentWordArr = getCurrentWordArr();
    if (currentWordArr.length !== 5) {
      window.alert("Not enough letters");
      window.location.reload();
    }

    const currentWord = currentWordArr.join("");
    const options = {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": "7b5f172a15msh2887b38ae5f7231p1d9364jsn52e4b84e8a6c",
        "X-RapidAPI-Host": "wordsapiv1.p.rapidapi.com",
      },
    };

    fetch(`https://wordsapiv1.p.rapidapi.com/words/${currentWord}`, options)
      .then((response) => {
        if (!response.ok && word !== currentWord) {
          throw Error();
        }

        const firstLetterId = guessedWordCount * 5 + 1;

        const interval = 500;

        currentWord.length === 5 &&
          currentWordArr.forEach((letter, index) => {
            setTimeout(() => {
              const tileColor = getTileColor(letter, index);

              const letterId = firstLetterId + index;
              const letterEl = document.getElementById(letterId);
              letterEl.classList.add("animate__flipInX");
              letterEl.style = `background-color:${tileColor};border-color:${tileColor}`;
              const keyboardEl = document.querySelector(`[data-key=${letter}]`);
              keyboardEl.style = `background-color:${tileColor};border-color:${tileColor};color:white;`;
            }, interval * index);
          });

        guessedWordCount += 1;

        if (guessedWords.length === 6 && currentWord !== word) {
          window.alert("You have lost, try again next time.");
          window.location.reload();
        }
        guessedWords.push([]);
      })
      .catch(() => {
        window.alert("Word is not recognized!");
      });
    if (currentWord === word) {
      popSuccess();
      fireworks.start();
      
    }
  
  }
  function createSquares() {
    const gameBoard = document.getElementById("board");

    for (let index = 0; index < 30; index++) {
      let square = document.createElement("div");
      square.classList.add("square");
      square.classList.add("animate__animated");
      square.setAttribute("id", index + 1);
      gameBoard.appendChild(square);
    }
  }

  function handleDeleteLetter() {
    const currentWordArr = getCurrentWordArr();
    if (currentWordArr.length > 0) {
      const removedLetter = currentWordArr.pop();
      const lastLetterEl = document.getElementById(String(availableSpace - 1));
      lastLetterEl.textContent = "";
      availableSpace = availableSpace - 1;
    }
  }

  for (let i = 0; i < keys.length; i++) {
    keys[i].onclick = ({ target }) => {
      const letter = target.getAttribute("data-key");

      if (letter === "enter") {
        handleSubmitWord();
        return;
      }

      if (letter === "del") {
        handleDeleteLetter();
        return;
      }
      updateGuessedWords(letter);
    };
    function logKey(e) {
      const allowedKeys = /^[a-zA-Z]$/;
      const alpha = e.key;
    
      if (alpha === "Enter") {
        e.preventDefault();
        handleSubmitWord();
        return;
      }
    
      if (alpha === "Backspace") {
        e.preventDefault();
        handleDeleteLetter();
        return;
      }
    
      if (!allowedKeys.test(alpha)) {
        e.preventDefault();
        return;
      }
    
      updateGuessedWords(alpha.toLowerCase()); // Convert to lowercase to handle both uppercase and lowercase letters
    }
  }
  document.addEventListener("keydown", logKey);
});

