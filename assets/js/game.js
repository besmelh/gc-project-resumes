// Simple Dino Jump Game for 404 page
document.addEventListener("DOMContentLoaded", () => {
  const dino = document.getElementById("dino");
  const cactus = document.getElementById("cactus");
  const startBtn = document.getElementById("startBtn");
  let gameRunning = false;
  let gameLoop;

  function jump() {
    if (!gameRunning) return; // don't allow jumping before start
    if (!dino.classList.contains("jump")) {
      dino.classList.add("jump");
      setTimeout(() => dino.classList.remove("jump"), 500);
    }
  }

  // Start game
  startBtn.addEventListener("click", () => {
    if (gameRunning) return;
    gameRunning = true;

    // Resume cactus animation
    cactus.style.animationPlayState = "running";

    // Start collision detection
    gameLoop = setInterval(() => {
      const dinoBottom = parseInt(getComputedStyle(dino).getPropertyValue("bottom"), 10);
      const cactusLeft = parseInt(getComputedStyle(cactus).getPropertyValue("left"), 10);

      if (cactusLeft < 60 && cactusLeft > 0 && dinoBottom <= 20) {
        clearInterval(gameLoop);
        alert("Game over! Refresh or press Start to play again.");
        gameRunning = false;
        cactus.style.animationPlayState = "paused";
        cactus.style.right = "-30px"; // reset cactus position
      }
    }, 20);
  });

  // Controls: Space / ArrowUp
  document.addEventListener("keydown", e => {
    if (e.code === "Space" || e.code === "ArrowUp") jump();
  });

  // Allow click/tap inside game box
  document.getElementById("game").addEventListener("click", jump);
});
