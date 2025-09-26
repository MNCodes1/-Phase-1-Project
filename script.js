let timeLeft = 120; // seconds
let timerInterval;
const quadrants = ["Top Left", "Top Right", "Bottom Left", "Bottom Right"];
let currentQuadrant = 0;

const startBtn = document.getElementById("start-btn");
const timerDisplay = document.getElementById("timer");
const quadrantDisplay = document.getElementById("quadrant");
const completionMessage = document.getElementById("completion-message");

startBtn.addEventListener("click", startBrushing);

function startBrushing() {
  timeLeft = 120;
  currentQuadrant = 0;
  completionMessage.classList.add("hidden");
  updateTimerDisplay();
  updateQuadrant();

  timerInterval = setInterval(() => {
    timeLeft--;
    updateTimerDisplay();

    if (timeLeft % 30 === 0 && timeLeft !== 0) {
      currentQuadrant++;
      updateQuadrant();
    }

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      showCompletion();
    }
  }, 1000);
}

function updateTimerDisplay() {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  timerDisplay.textContent = '${minutes}:${seconds.toString().padStart(2, '0')}';
}

function updateQuadrant() {
  quadrantDisplay.textContent = Brush: ${quadrants[currentQuadrant]};
}

function showCompletion() {
  quadrantDisplay.textContent = "";
  completionMessage.classList.remove("hidden");
}