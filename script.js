const canvas= document.getElementById("game");
const ctx= canvas.getContext("2d");

const box= 14;
const cols= canvas.width/box;
const rows= canvas.height/box;
const scoreText= document.getElementById("score")
const highScoreText= document.getElementById("highScore")

const map = new Image();
map.src = "MAP.jpg"

const mkanan = new Image();
mkanan.src = "MAKANAN.jpg"

const kepala = new Image ();
kepala.src = "KEPALA.jpg"

const tubuh = new Image ();
tubuh.src = "Badan.jpg"

let imagesLoaded = 0;
const totalImages = 4;

function checkImagesLoaded(){
  imagesLoaded++;
  if (imagesLoaded === totalImages) {
    resetGame();
  }
}

map.onload = checkImagesLoaded;
mkanan.onload = checkImagesLoaded;
kepala.onload = checkImagesLoaded;
tubuh.onload = checkImagesLoaded;

let ular = [{ x: 10 * box, y: 10 * box, arah: "RIGHT" }];
let makanan = spawnFood();
let arah= null;
let game;
let score= 0;
let speed= 150;
const minSpeed = 100;
const speedStep = 5;
let highScore = localStorage.getItem("HighScoreUlar") || 0;

function resetGame() {
  ular = [{ x: 10 * box, y: 10 * box, arah: "RIGHT"}];
  makanan = spawnFood();
  arah = null;
  score = 0;
  speed = 150;
  
  scoreText.textContent = "Score: " + score;
  highScoreText.textContent = "HighScore:  " + highScore;

  clearInterval(game);
  game = setInterval(draw, speed);
}

//tombol arah atau wasd
document.addEventListener("keydown", setDirectionKey);

function setDirectionKey(event) {
  if((event.key === "ArrowUp" || event.key === "w") && arah !== "DOWN") {
    arah = "UP" ;
  } else if((event.key === "ArrowDown" || event.key === "s") && arah !== "UP") {
    arah = "DOWN" ;
  } else if((event.key === "ArrowLeft" || event.key === "a") && arah !== "RIGHT") {
    arah = "LEFT" ;
  } else if((event.key === "ArrowRight" || event.key === "d") && arah !== "LEFT") {
    arah = "RIGHT" ;
  }
}

//tombol dpad
function setDirection(arahUlar) {
  if(arahUlar === "UP" && arah !== "DOWN")arah="UP"
  if(arahUlar === "DOWN" && arah !== "UP")arah= "DOWN"
  if(arahUlar === "LEFT" && arah !== "RIGHT")arah= "LEFT"
  if(arahUlar === "RIGHT" && arah !== "LEFT")arah= "RIGHT"
}

function spawnFood() {
  let newFood;
  let conflict;

  do {
    conflict = false;
    newFood = {
      x: Math.floor(Math.random() * cols) * box,
      y: Math.floor(Math.random() * rows) * box
    };

    for (let i = 0; i < ular.length; i++) {
      if (newFood.x === ular[i].x && newFood.y === ular[i].y) {
        conflict = true;
        break;
      }
    }
  } while (conflict);

  return newFood;
}

function collisions(head, array) {
  for (let i = 1; i < array.length; i++) {
    if (head.x === array [i].x && head.y === array[i].y) {
      return true;
    }
  }
  return false
}

function draw() {
  ctx.drawImage(map, 0, 0, canvas.width, canvas.height);

  for (let i = 0; i < ular.length; i++) {
  ctx.save();
  ctx.translate(ular[i].x + box / 2, ular[i].y + box / 2);

  if (ular[i].arah === "UP") ctx.rotate(-Math.PI / 2);
  if (ular[i].arah === "DOWN") ctx.rotate(Math.PI / 2);
  if (ular[i].arah === "LEFT") ctx.rotate(Math.PI);

  if (i === 0) {
    ctx.drawImage(kepala, -box / 2, -box / 2, box, box);
  } else {
    ctx.drawImage(tubuh, -box / 2, -box / 2, box, box);
  }

  ctx.restore();
}

  ctx.drawImage(mkanan, makanan.x, makanan.y, box, box);
  
  if (arah === null) return;
  
  let ularX = ular[0].x;
  let ularY = ular[0].y;
  
  if (arah==="LEFT")ularX -=box;
  if (arah==="UP")ularY -=box;
  if (arah==="RIGHT")ularX +=box;
  if (arah==="DOWN")ularY +=box;
  
  if (ularX === makanan.x && ularY === makanan.y) {
    score++;
    scoreText.textContent = "Score:"+ score;
    makanan = spawnFood()
  
  if (score > highScore) {
    highScore = score;
    localStorage.setItem("HighScoreUlar", highScore);
  }
  highScoreText.textContent = "HighScore:" + highScore;
  
  if (speed > minSpeed) {
    speed -= speedStep;
    clearInterval(game)
    game = setInterval(draw, speed);
  }
 }else {
  ular.pop();
}
let newHead = {
  x: ularX, y: ularY, arah: arah || ular[0].arah
};

if (ularX < 0 ||
  ularY < 0 ||
  ularX >= cols*box ||
  ularY >= rows*box ||
  collisions(newHead, ular)){
  
  clearInterval(game)
  setTimeout(()=>{
    alert("Yahaha Eleh ! Belajar Lagi Kids Skor: "+ score);
    resetGame();
  })
  return;
  }
  ular.unshift(newHead);
    }
