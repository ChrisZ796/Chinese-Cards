let canvas = document.getElementById("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let ctx = canvas.getContext("2d");
document.addEventListener("keydown",jump,false);
let isGameOver = false;
let gravity = 0.05;
let windSpeed = 0;
let hasOxygen = true;
let raf;
let endgame = document.getElementById("endGame");
endgame.style.display = "none";
let text = document.getElementById("text");
//New Bird Mechanics
let velocity = 0;
let gameIsRunning = false;
let pipeGap = 300;
let soundCount = 0;
let musicCount = 0;
let scoreElement = document.getElementById("score");
let score = 0;
let oxygenElement = document.getElementById("oxygenValue"); // Select the oxygen display element
let oxygen = 100;

pipeGap = Number(localStorage.getItem("pipeGap"));
let setColor = Number(localStorage.getItem("colorChange"));
let colorCollection = document.getElementsByTagName("h2");

const oxygenDecreaseRate = 0.07; // Adjust this value to control the oxygen decrease rate
const oxygenReplenishAmount = 40; // Adjust this value to control how much oxygen is replenished when the bird passes through a gap
scoreElement.textContent = score;
let highScore = 0;
let attempts = Number(localStorage.getItem("attempts"));
let currentPlanet = localStorage.getItem("currentPlanet");
scoreElement.textContent = score;
attempts++;
sessionStorage.setItem("attempts", attempts);
let oxygenRegen = 0.07;

class Bird {
    get hitbox() {
        return {
            x: this.x + 15,
            y: this.y + 10,
            width: this.width - 30,
            height: this.height - 20
        };
    }
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.dy = 0;
        this.width = width;
        this.height = height;
        this.rotation = 0; // New property to store rotation angle
    }
    draw() {
        ctx.save(); // Save the current canvas state
        ctx.translate(this.x + this.width / 2, this.y + this.height / 2); // Translate to the center of the bird
        ctx.rotate(this.rotation); // Apply rotation
        ctx.drawImage(birdImage, -this.width / 2, -this.height / 2, this.width, this.height); // Draw the bird
        ctx.restore(); // Restore the previous canvas state
    }
    reset(){
        this.x = 10;
        this.y = 300;
        this.dy = 0;
        isGameOver = false;
    }
}

class PipeUp
{
    get hitbox() {
        return {
            x: this.x + 10,
            y: this.y,
            width: this.width - 20,
            height: this.height
        }; 
    }
    constructor(x,y,width,height)
    {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
    draw()
    {
        ctx.beginPath();
        ctx.drawImage(pipeImage, this.x, this.y, this.width, this.height);
    }
}

class PipeDown
{
    get hitbox() {
        return {
            x: this.x + 10,
            y: this.y + 50,
            width: this.width - 20,
            height: this.height - 50
        };
    }
    constructor(x,y,width,height)
    {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
    draw()
    {
        ctx.beginPath();
        ctx.drawImage(downPipeImage, this.x, this.y, this.width, this.height);
    }
}

class Foreground
{
    constructor(x,y,width,height)
    {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
    draw()
    {
        ctx.beginPath();
        ctx.drawImage(foregroundPicture, this.x, this.y, this.width, this.height);
    }
}

class Bubble
{
    constructor(x,y,width,height)
    {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
    draw()
    {
        ctx.beginPath();
        ctx.drawImage(oxyBubble, this.x, this.y, this.width, this.height);
    }
}
function checkCollision(bird, pipes) {
    // Get the hitbox of the bird
    const birdHitbox = bird.hitbox;

    // Check for collision with each pipe
    for (const pipe of pipes) {
        const pipeHitbox = pipe.hitbox;

        // Perform the collision check
        if (
            birdHitbox.x < pipeHitbox.x + pipeHitbox.width &&
            birdHitbox.x + birdHitbox.width > pipeHitbox.x &&
            birdHitbox.y < pipeHitbox.y + pipeHitbox.height &&
            birdHitbox.y + birdHitbox.height > pipeHitbox.y
        ) {
            // Collision detected
            return true;
        }
    }

    // No collision detected
    return false;
}
function jump(event) {
    gameIsRunning = true;
    ctx.clearRect(0,0,canvas.width,canvas.height);
    let key = event.key;
    if (key == "ArrowUp"){
        if (musicCount == 0){
            document.getElementById("musicTrack").play();
            musicCount++;
        }
        new Audio(src = "Flap.mp3").play();
        bird.rotation = -1;
        birdDrop();
        text.style.display = "none";
    }
    if (key == "e"){
        document.getElementById("musicTrack").play();
        isGameOver = false;
        gameIsRunning = false;
        bird.reset();
        resetPipe();
        attempts++;
        sessionStorage.setItem("attempts", attempts);
        soundCount = 0;
        musicCount = 0;
        foreground.draw();
        score = 0;
        scoreElement.textContent = 0;
        endgame.style.display =  "none";
        text.style.display = "block";
        attempts++;
        sessionStorage.setItem("attempts", attempts);
        oxygen = 100;
    }
}

function resetPipe(){
    firstPipeGoingUp.x = Math.random() * 800 + 300;
    firstPipeGoingUp.y = Math.random() * 800 + 100;
    firstPipeGoingDown.x = firstPipeGoingUp.x;
    firstPipeGoingDown.y = firstPipeGoingUp.y - 800 - pipeGap;
    secondPipeGoingUp.x = Math.random() * 400 + 400 + firstPipeGoingUp.x;
    secondPipeGoingUp.y = Math.random() * 500 + 500;
    secondPipeGoingDown.x = secondPipeGoingUp.x;
    secondPipeGoingDown.y = secondPipeGoingUp.y - 800 - pipeGap;
    firstOxygenBubble.x = firstPipeGoingUp.x;
    firstOxygenBubble.y = firstPipeGoingUp.y - (Math.random() * 200 + 100);
    secondOxygenBubble.x = secondPipeGoingUp.x;
    secondOxygenBubble.y = secondPipeGoingUp.y - (Math.random() * 200 + 100);
    if(secondPipeGoingUp.x >= canvas.width)
    {
        resetPipe();
    }
}


function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (!isGameOver && gameIsRunning) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        bird.x += 2 + score/5 + windSpeed;
        oxygen -= oxygenDecreaseRate;

        // Calculate rotation angle based on bird's velocity
        //bird.rotation = Math.atan2(bird.dy, 2) + Math.PI / 2;
        //bird.x = bird.x % canvas.width;
        bird.dy = bird.dy + gravity;
        bird.y = bird.y + bird.dy;
        if(bird.rotation < 1)
        {
            bird.rotation += 0.01;
        }
        bird.draw();
        firstPipeGoingUp.draw();
        firstPipeGoingDown.draw();
        secondPipeGoingUp.draw();
        secondPipeGoingDown.draw();
        foreground.draw();
        if(hasOxygen)
        {
            oxygen = 100;
            firstOxygenBubble.x = -500;
            secondOxygenBubble.x = -500;
        }
        else(!hasOxygen)
        {
            firstOxygenBubble.draw();
            secondOxygenBubble.draw();
        }
        if (bird.x >= firstOxygenBubble.x && bird.x <= firstOxygenBubble.x + firstOxygenBubble.width) {
            if(bird.y >= firstOxygenBubble.y && bird.y <= firstOxygenBubble.y + firstOxygenBubble.width)
            {
                oxygen += oxygenReplenishAmount;
            }
        }
        else if (bird.x >= secondOxygenBubble.x && bird.x <= secondOxygenBubble.x + secondOxygenBubble.width) {
            if(bird.y >= secondOxygenBubble.y && bird.y <= secondOxygenBubble.y + firstOxygenBubble.width)
            {
                oxygen += oxygenReplenishAmount;
            }
        }
        else
        {
            firstPipeGoingDown.isPassed = false;
            secondPipeGoingUp.isPassed = false;
        }
        oxygen = Math.max(0, Math.min(100, oxygen));
        oxygenElement.textContent = Math.round(oxygen);
        if (oxygen <= 0) {
          isGameOver = true;
          endgame.style.display = "block";
          window.cancelAnimationFrame(raf);
          if (soundCount == 0) {
            new Audio(src = "Death.mp3").play();
            soundCount++;
            }
          }
          if (bird.x >= canvas.width) {
            new Audio(src = "Point.mp3").play();
            resetPipe();
            bird.x = 0;
            score++;
            scoreElement.textContent = score;
          }
        }
        if (bird.x >= canvas.width)
        {
            new Audio(src = "Point.mp3").play();
            resetPipe();
            bird.x = 0;
            score++;
            scoreElement.textContent = score;
        }
        if (bird.y >= 930 || inDanger()) {
            isGameOver = true;
            endgame.style.display = "block";
            window.cancelAnimationFrame(raf);
            document.getElementById("musicTrack").pause();
            if(score > highScore)
            {
                highScore = score;
                sessionStorage.setItem("numHighScore", highScore);
            }
            if(soundCount == 0)
            {
                new Audio(src = "Death.mp3").play();
                soundCount++;
            }
        }
        raf = window.requestAnimationFrame(gameLoop);
    }
    



function birdDrop(){
    bird.dy = -3;
}

function checkColor(){
    if (setColor == 0){
        colorCollection[0].style.color = "black";
        document.getElementById("oxygen").style.color = "black";
    }
    else if (setColor == 1){
        colorCollection[0].style.color = "white";
        document.getElementById("oxygen").style.color = "white";
    }
}

function inDanger()
{
    //Check the first set of pipes
    if(bird.x > firstPipeGoingUp.x - 50 && bird.x < firstPipeGoingUp.x + 100)
    {
        if(bird.y > firstPipeGoingUp.y - 50 || bird.y < firstPipeGoingDown.y + 760)
        {
            return true;
        }
    }
    //Check the second set of pipes
    else if(bird.x > secondPipeGoingUp.x - 50 && bird.x < secondPipeGoingUp.x + 100)
    {
        if(bird.y > secondPipeGoingUp.y - 50 || bird.y < secondPipeGoingDown.y + 760)
        {
            return true;
        }
    }
    else
    {
        return false;
    }
    if (bird.x > firstPipeGoingUp.x - 50 && bird.x < firstPipeGoingUp.x + 100 &&
        bird.y > firstPipeGoingUp.y - 50 && bird.y < firstPipeGoingUp.y + 800 - pipeGap) {
            firstPipeGoingUp.isPassed = true;
        }
    
    if (bird.x > secondPipeGoingUp.x - 50 && bird.x < secondPipeGoingUp.x + 100 &&
        bird.y > secondPipeGoingUp.y - 50 && bird.y < secondPipeGoingUp.y + 800 - pipeGap) {
            secondPipeGoingUp.isPassed = true;
        }
}

function initGame()
{
    let background;
    if(currentPlanet == "EARTH")
    {
        pipeImage.src = "birdPipe.png";
        downPipeImage.src = "birdPipeGoingDown.png";
        document.getElementById("musicTrack").pause();
        document.getElementById("musicTrack").currentTime = 0;
        document.getElementById("musicSource").src = "Castlevania-VampireKiller.ogg";
        document.getElementById("musicTrack").load();
        document.getElementById("canvas").style.backgroundImage = "url('earthBackdrop.jpg')";
        gravity = 0.05;
        windSpeed = 0;
        oxygenRegen = 1;
        hasOxygen = true;
        pipeGap = 300;
        foregroundPicture.src = "foregroundEarth.jpg";
    }
    else if(currentPlanet == "MOON")
    {
        pipeImage.src = "GrayUpPipe.png";
        downPipeImage.src = "GrayDownPipe.png";
        document.getElementById("musicTrack").pause();
        document.getElementById("musicTrack").currentTime = 0;
        document.getElementById("musicSource").src = "MoonTheme.ogg";
        document.getElementById("musicTrack").load();
        document.getElementById("canvas").style.backgroundImage = "url('Moon Landscape.png')";
        gravity = 0.02;
        windSpeed = -0.5;
        hasOxygen = false;
        pipeGap = 500;
        foregroundPicture.src = "moonForeground.png";
    }
    else if(currentPlanet == "ARGONIA")
    {
        pipeImage.src = "PurpleUpPipe.png";
        downPipeImage.src = "PurpleDownPipe.png";
        document.getElementById("musicTrack").pause();
        document.getElementById("musicTrack").currentTime = 0;
        document.getElementById("musicSource").src = "ArgoniaTheme.ogg";
        document.getElementById("musicTrack").load();
        document.getElementById("canvas").style.backgroundImage = "url('Argonia Landscape.jpg')";
        gravity = 0.1;
        windSpeed = 4;
        hasOxygen = false;
        pipeGap = 700;
        foregroundPicture.src = "argoniaForeground.png";
    }

    else if(currentPlanet == "JUBILEE")
    {
        pipeImage.src = "HazelUpPipe.png";
        downPipeImage.src = "HazelDownPipe.png";
        document.getElementById("musicTrack").pause();
        document.getElementById("musicTrack").currentTime = 0;
        document.getElementById("musicSource").src = "JubileeTheme.ogg";
        document.getElementById("musicTrack").load();
        document.getElementById("canvas").style.backgroundImage = "url('Jubilee Landscape.jpg')";
        gravity = 0.04;
        windSpeed = 2;
        hasOxygen = true;
        pipeGap = 400;
        foregroundPicture.src = "jubileeForeground.png";
    }
}

let foregroundPicture = new Image();

let birdImage = new Image();
birdImage.src = "icon.png";

let pipeImage = new Image();
pipeImage.src = "birdPipe.png";

let downPipeImage = new Image();
downPipeImage.src = "birdPipeGoingDown.png";

let oxyBubble = new Image();
oxyBubble.src = "Oxy Bubble.gif";

let bird = new Bird(10,300,80,80);
bird.draw();

initGame();

let firstPipeGoingUp = new PipeUp(Math.random() * 800 + 300, Math.random() * 800 + 100, 100, 800);
let firstPipeGoingDown = new PipeDown(firstPipeGoingUp.x, firstPipeGoingUp.y - 800 - pipeGap, 100, 800);

let secondPipeGoingUp = new PipeUp(Math.random() * 400 + 400 + firstPipeGoingUp.x, Math.random() * 500 + 500, 100, 800);
let secondPipeGoingDown = new PipeDown(secondPipeGoingUp.x, secondPipeGoingUp.y - 800 - pipeGap, 100, 800);

let firstOxygenBubble = new Bubble(firstPipeGoingUp.x, firstPipeGoingUp.y - 100, 100, 100);
let secondOxygenBubble = new Bubble(secondPipeGoingUp.x, secondPipeGoingUp.y - 100, 100, 100);
if(hasOxygen)
{
    firstOxygenBubble.x = -100;
    firstOxygenBubble.y = -100;
    secondOxygenBubble.x = -100;
    secondOxygenBubble.y = -100;
    firstOxygenBubble.draw();
    secondOxygenBubble.draw();
}
if(secondPipeGoingUp.x >= canvas.width)
{
    resetPipe();
}

let foreground = new Foreground(0, 930, 2000, 100);
foreground.draw();

checkColor();
initGame();
gameLoop();