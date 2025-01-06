/* 
  1. When user clicks the intro icon, hide the intro screen, show the matrix screen and start the matrix code rain.
  2. After 3-5 seconds, decide at random whether the user is the chosen one (5% chance) or not (95% chance).
  3. Display the result screen accordingly. If not chosen, redirect or kick off. If chosen, freeze with glowing text.
*/

/**********************************************
 *            DOM ELEMENTS & STATE
 **********************************************/
const introScreen = document.getElementById("intro-screen");
const matrixScreen = document.getElementById("matrix-screen");
const resultScreen = document.getElementById("result-screen");
const resultMessage = document.getElementById("result-message");
const clickIcon = document.getElementById("click-icon");

const matrixCanvas = document.getElementById("matrix-canvas");
const ctx = matrixCanvas.getContext("2d");

/**********************************************
 *          MATRIX ANIMATION SETUP
 **********************************************/
// Set canvas dimensions to full window
matrixCanvas.width = window.innerWidth;
matrixCanvas.height = window.innerHeight;

// You can choose any characters you like
const matrixChars = "アイウエオカキクケコシスセソabcdefghijklmnopqrstuvwxyz0123456789".split("");

// Column setup: each column will drop characters at different speeds
const fontSize = 16;
const columns = matrixCanvas.width / fontSize; 

// Track each column's drop position
let drops = [];
for (let i = 0; i < columns; i++) {
  drops[i] = Math.floor(Math.random() * -50); 
  // Start them randomly above the screen (negative)
}

/**********************************************
 *          MATRIX ANIMATION LOOP
 **********************************************/
let animationFrameId;

function drawMatrixRain() {
  // Slight transparent black background to create the trailing effect
  ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
  ctx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);

  // Set text color to green, font
  ctx.fillStyle = "#0F0";
  ctx.font = fontSize + "px monospace";

  // Draw each character
  for (let i = 0; i < drops.length; i++) {
    // Pick a random character from the array
    const text = matrixChars[Math.floor(Math.random() * matrixChars.length)];
    // x coordinate of the i-th column, y coordinate is drops[i]*fontSize
    ctx.fillText(text, i * fontSize, drops[i] * fontSize);

    // Move this column down one position
    drops[i]++;

    // If the drop is off screen, reset to a random position above
    if (drops[i] * fontSize > matrixCanvas.height) {
      drops[i] = Math.floor(Math.random() * -50);
    }
  }

  // Loop the animation
  animationFrameId = requestAnimationFrame(drawMatrixRain);
}

/**********************************************
 *           MAIN INTERACTIONS
 **********************************************/
clickIcon.addEventListener("click", () => {
  // 1. Hide intro screen
  introScreen.style.display = "none";
  // 2. Show matrix screen
  matrixScreen.style.display = "block";

  // Start the animation
  drawMatrixRain();

  // 3. After 3-5 seconds, decide the outcome
  //    We'll pick a random time between 3 and 5 seconds
  const randomDelay = Math.random() * 2000 + 3000; // 3000ms -> 5000ms
  setTimeout(determineFate, randomDelay);
});

/**********************************************
 *         DETERMINE THE USER'S FATE
 **********************************************/
function determineFate() {
  // Stop the matrix animation
  cancelAnimationFrame(animationFrameId);

  // Hide the matrix screen
  matrixScreen.style.display = "none";

  // Random chance: 5% "chosen", 95% "not chosen"
  const randomValue = Math.random(); 

  if (randomValue < 0.95) {
    // 95% chance - NOT chosen
    resultMessage.textContent = "You are not the chosen one.";
    resultScreen.style.display = "flex";

    // Kick off the site after 2 seconds, or immediately if you prefer
    setTimeout(() => {
      // Option 1: Redirect to a denial page
      // window.location.href = "https://example.com/denied";

      // Option 2: Hide everything (blank screen)
      document.body.innerHTML = "";
      document.body.style.backgroundColor = "black";
    }, 2000);
  } else {
    // 5% chance - Chosen
    resultMessage.textContent = "You are the chosen one.";
    // Add a glowing class for a more dramatic effect
    resultMessage.classList.add("chosen-glow");

    // Display result screen
    resultScreen.style.display = "flex";
    // No redirect; user sees the frozen message
  }
}

/**********************************************
 *      HANDLE WINDOW RESIZE (OPTIONAL)
 **********************************************/
window.addEventListener("resize", () => {
  // If you'd like the canvas to adapt to resizing:
  matrixCanvas.width = window.innerWidth;
  matrixCanvas.height = window.innerHeight;
});
