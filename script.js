//Required Variables.
const foodSound = new Audio("music/foodSound.wav");
const gameOverSound = new Audio("music/gameOverSound.wav");
gameOverSound.volume = 0.1;
foodSound.volume = 0.5;

let snakeDirection = { x: 0, y: 0 };
let snakePositionArray = [{ x: 13, y: 10 }];
let foodPosition = { x: 8, y: 10 };
let gameSpeed = 10;
let lastPaintTime = 0;
let currentScore = 0;
let highestScore = 0;

//Required Functions.
const setSpeed = (desiredSpeed) => {
  gameSpeed = desiredSpeed;
};

const main = (ctime) => {
  window.requestAnimationFrame(main);
  //Controlling the game FPS.
  if ((ctime - lastPaintTime) / 1000 < 1 / gameSpeed) {
    return;
  }
  lastPaintTime = ctime;
  startGame();
};

const isCollapsed = () => {
  //If Snake gets collapsed within its body.
  for (let index = 1; index < snakePositionArray.length; index++) {
    if (
      snakePositionArray[index].x === snakePositionArray[0].x &&
      snakePositionArray[index].y === snakePositionArray[0].y
    ) {
      return true;
    }
  }
  //Snake collapses with the walls of play area.
  if (
    snakePositionArray[0].x > 20 ||
    snakePositionArray[0].x <= 0 ||
    snakePositionArray[0].y > 20 ||
    snakePositionArray[0].y <= 0
  ) {
    return true;
  } else {
    return false;
  }
};

const startGame = () => {
  //Part|: Updating the position array of Snake of Food.
  //Part|(a) What happens if snake gets collided.
  if (isCollapsed(snakePositionArray)) {
    snakeDirection = { x: 0, y: 0 };
    snakePositionArray = [{ x: 13, y: 10 }];
    currentScore = 0;
    foodPosition = { x: 8, y: 10 };
    document.querySelector(".scoreBoard").innerHTML =
      "Your Score: " + currentScore;
    gameOverSound.play();
  }
  //Part|(b) What happens if snake eats food.
  //Generate food at new position.
  if (
    snakePositionArray[0].x === foodPosition.x &&
    snakePositionArray[0].y === foodPosition.y
  ) {
    snakePositionArray.unshift({
      x: snakePositionArray[0].x + snakeDirection.x,
      y: snakePositionArray[0].y + snakeDirection.y,
    });
    currentScore++;
    document.querySelector(".scoreBoard").innerHTML =
      "Your Score: " + currentScore;

    //Checking if the HighScore is less than currentGameScore.
    if (currentScore > highestScore) {
      highestScore = currentScore;
      localStorage.setItem("highestScore", JSON.stringify(highestScore));
      document.querySelector(".hiScoreBoard").innerHTML =
        "Highest Score: " + highestScore;
    }
    foodSound.play();
    console.log(snakePositionArray);

    let startingPosition = 1;
    let endingPosition = 19;
    let onDifferentPosition = false;

    //Generating food at random place again.
    do {
      foodPosition = {
        x: Math.round(
          startingPosition + (endingPosition - startingPosition) * Math.random()
        ),
        y: Math.round(
          startingPosition + (endingPosition - startingPosition) * Math.random()
        ),
      };

      for (let index = 0; index < snakePositionArray.length; index++) {
        if (
          snakePositionArray[index].x === foodPosition.x &&
          snakePositionArray[index].y === foodPosition.y
        ) {
          onDifferentPosition = false;
          break;
        } else {
          onDifferentPosition = true;
        }
      }
    } while (onDifferentPosition == false);
  }

  //Move the snake.
  for (let index = snakePositionArray.length - 2; index >= 0; index--) {
    snakePositionArray[index + 1] = { ...snakePositionArray[index] };
  }
  snakePositionArray[0].x += snakeDirection.x;
  snakePositionArray[0].y += snakeDirection.y;

  //Part||: Display the food and Snake.
  //Part||(a) Displaying the Snake.
  let gameBoard = document.querySelector(".gameBoard");
  gameBoard.innerHTML = "";
  snakePositionArray.forEach((element, index) => {
    let snakeElement = document.createElement("div");
    snakeElement.style.gridRowStart = element.y;
    snakeElement.style.gridColumnStart = element.x;
    //Painting the head of snake with different color.
    if (index === 0) {
      snakeElement.classList.add("snakeHead");
    } else {
      snakeElement.classList.add("snakeBody");
    }
    gameBoard.appendChild(snakeElement);
  });

  //Part||(b) Displaying the Food.
  let foodElement = document.createElement("div");
  foodElement.style.gridRowStart = foodPosition.y;
  foodElement.style.gridColumnStart = foodPosition.x;
  foodElement.classList.add("snakeFood");
  gameBoard.appendChild(foodElement);
};

//Game Logic.
window.requestAnimationFrame(main);
window.addEventListener("keydown", (e) => {
  snakeDirection = { x: 0, y: 1 };
  //Updating the board with respect to user input.
  switch (e.key) {
    case "ArrowUp":
      snakeDirection.x = 0;
      snakeDirection.y = -1;
      break;
    case "ArrowDown":
      snakeDirection.x = 0;
      snakeDirection.y = 1;
      break;

    case "ArrowRight":
      snakeDirection.x = 1;
      snakeDirection.y = 0;
      break;

    case "ArrowLeft":
      snakeDirection.x = -1;
      snakeDirection.y = 0;
      break;
  }
});

//Setting hiScore.
let hiScore = localStorage.getItem("highestScore");

if (hiScore === null) {
  localStorage.setItem("highestScore", JSON.stringify(highestScore));
} else {
  highestScore = JSON.parse(hiScore);
  document.querySelector(".hiScoreBoard").innerHTML =
    "Highest Score: " + hiScore;
}
