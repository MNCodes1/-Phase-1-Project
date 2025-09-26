const startBtn = document.getElementById('start-btn');
const pauseBtn = document.getElementById('pause-btn');
const resetBtn = document.getElementById('reset-btn');
const timerDisplay = document.getElementById('timer-display');
const quadrantDisplay = document.getElementById('quadrant-display');
const themeToggle = document.getElementById('theme-toggle');
const nameInput = document.getElementById('name-input');
const saveNameBtn = document.getElementById('save-name-btn');
const welcomeMessage = document.getElementById('welcome-message');

const quadrants = ["Top Left", "Top Right", "Bottom Left", "Bottom Right"];

let timeLeft = 120;
let quadrantIndex = 0;
let countdown = null;
let isRunning = false;
let isPaused = false;

startBtn.addEventListener('click', () => {
  if (!isRunning) {
    startBrushingSession();
    startBtn.textContent = "Stop";
  } else {
    stopBrushingSession();
    startBtn.textContent = "Start";
  }
  isRunning = !isRunning;
});

pauseBtn.addEventListener('click', () => {
  isPaused = !isPaused;
  pauseBtn.textContent = isPaused ? "Resume" : "Pause";
});

resetBtn.addEventListener('click', () => {
  clearInterval(countdown);
  countdown = null;
  timeLeft = 120;
  quadrantIndex = 0;
  isRunning = false;
  isPaused = false;
  startBtn.textContent = "Start";
  pauseBtn.textContent = "Pause";
  timerDisplay.textContent = "2:00 remaining";
  quadrantDisplay.textContent = "Ready to brush!";
  highlightQuadrant(-1);
});

themeToggle.addEventListener('change', () => {
  document.body.classList.toggle('dark-mode');
});

quadrantDisplay.addEventListener('mouseover', () => {
  quadrantDisplay.textContent += " – Use gentle circular motions!";
});

saveNameBtn.addEventListener('click', () => {
  const name = nameInput.value.trim();
  if (name) {
    fetch('http://localhost:3000/users/1', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name })
    })
    .then(() => {
      displayWelcome(name);
    });
  }
});

function loadUserName() {
  fetch('http://localhost:3000/users/1')
    .then(res => res.json())
    .then(user => {
      if (user.name) {
        displayWelcome(user.name);
        nameInput.value = user.name;
      }
    });
}

function displayWelcome(name) {
  welcomeMessage.textContent = `Welcome back, ${name}!`;
}

function startBrushingSession() {
  highlightQuadrant(quadrantIndex);
  updateCountdownDisplay();

  countdown = setInterval(() => {
    if (!isPaused) {
      timeLeft--;
      updateCountdownDisplay();

      if (timeLeft % 30 === 0 && timeLeft !== 0) {
        quadrantIndex++;
        highlightQuadrant(quadrantIndex);
      }

      if (timeLeft === 0) {
        stopBrushingSession();
        notifyCompletion();
        saveSession();
        updateStreak();
      }
    }
  }, 1000);
}

function stopBrushingSession() {
  clearInterval(countdown);
  countdown = null;
  isRunning = false;
  startBtn.textContent = "Start";
}

function updateCountdownDisplay() {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  timerDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, '0')} remaining`;
}

function highlightQuadrant(index) {
  document.querySelectorAll('.quadrant').forEach((q, i) => {
    q.classList.toggle('active', i === index);
  });
  if (index >= 0) {
    quadrantDisplay.textContent = `Brush: ${quadrants[index]}`;
  }
}

function notifyCompletion() {
  const tips = [
    "Great job! Your smile just got brighter ",
    "Brushing complete! Remember: flossing is just as important ",
    "Well done! Consistency is key to a healthy mouth 🦷",
    "Awesome work! Your teeth thank you ",
    "You're crushing it! Keep up the daily brushing streak "
  ];
  const randomTip = tips[Math.floor(Math.random() * tips.length)];
  alert(`Brushing complete!\n\n${randomTip}`);
}

function saveSession() {
  fetch('http://localhost:3000/sessions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userId: 1,
      date: new Date().toISOString().split('T')[0],
      duration: 120,
      quadrants: [...quadrants]
    })
  });
}

function updateStreak() {
  fetch('http://localhost:3000/users/1')
    .then(res => res.json())
    .then(user => {
      const newStreak = user.streak + 1;
      fetch('http://localhost:3000/users/1', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ streak: newStreak })
      });
    });
}

loadUserName();
