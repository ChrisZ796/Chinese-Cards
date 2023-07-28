// declaring and initializing variable for stat
let startButton = document.getElementById("start");
let statPage = document.getElementById("stats");
let currentTrack = new Audio("Castlevania-VampireKiller.ogg");
let numHighScore = Number(sessionStorage.getItem("numHighScore"));
let numAttempt = Number(sessionStorage.getItem("attempts"));
let pipeGap = 300;

let distanceStat = document.getElementById("distance");
let coinsStat = document.getElementById("coins");
let attemptsStat = document.getElementById("attempts");

let colorDefine = 0;

localStorage.setItem("attempts", Number(numAttempt));

distanceStat.textContent = numHighScore;
attemptsStat.textContent = numAttempt;
// event listener for the start button to go to the game mode
startButton.addEventListener("click", hideElements, false);
statPage.addEventListener("click", openStats, false);
// event listener for the stat page to go back to main
document.getElementById("statHeader").addEventListener("click", backToMain, false);
// event listener for going to the credit page
let creditsButton = document.getElementById("credits");

creditsButton.addEventListener("click", hideElements, false);
creditsButton.addEventListener("click", showCredits, false);
// event listener for going to the setting page or heading back from the setting page.
document.getElementById("settings").addEventListener("click", openSettings, false);

document.getElementById("settingTitle").addEventListener("click", backToMain, false);

let currentPlanet = "EARTH";
document.getElementById("EARTH").addEventListener("click", changePlanets("EARTH"), false);
document.getElementById("MOON").addEventListener("click", changePlanets("MOON"), false);
document.getElementById("ARGONIA").addEventListener("click", changePlanets("ARGONIA"), false);
document.getElementById("JUBILEE").addEventListener("click", changePlanets("JUBILEE"), false);

localStorage.setItem("currentPlanet", currentPlanet);

document.getElementById("trackON").style.display = "none";

let Earth = {
    gravStrength: "Normal",
    windSpeed: "Normal",
    hasOxygen: "Yes"
  };

let Moon = {
    gravStrength: "Low",
    windSpeed: "Normal",
    hasOxygen: "Yes"
  };

let Argonia = {
    gravStrength: "High",
    windSpeed: "Slow",
    hasOxygen: "No"
  };

  let Jubilee = {
    gravStrength: "Low",
    windSpeed: "Fast",
    hasOxygen: "Yes"
  };
// this hide the elements on the page
function hideElements()
{
    raiseUpElementbyID("mainContainer");
    document.getElementById("mainContainer").style.display = "none";
}
// show the page of stats
function openStats()
{  
    raiseUpElementbyID("mainContainer");
    document.getElementById("mainContainer").style.display = "none";
    document.getElementById("statContainer").style.display = "block";
    dropInElementbyID("statContainer");
}
// head back to main from different pages
function backToMain()
{
    raiseUpElementbyID("statContainer");
    raiseUpElementbyID("settingsBar");
    raiseUpElementbyID("Credits");
    document.getElementById("mainContainer").style.display = "block";
    document.getElementById("statContainer").style.display = "none";
    document.getElementById("settingsBar").style.display = "none";
    document.getElementById("Credits").style.display = "none";
    dropInElementbyID("mainContainer");
}
// show the credit page
function showCredits()
{
    let creditsPage = document.getElementById("Credits");
    creditsPage.style.display = "block";
    dropInElementbyID("Credits");
    document.getElementById("creditsHeader").addEventListener("click", backToMain, false);
}
// show the setting page
function openSettings()
{
    document.getElementById("settingsBar").style.display = "grid";
    dropInElementbyID("settingsBar");
    hideElements();
}

function dropInElementbyID(elementID) {
    let element = document.getElementById(elementID);
    element.style.position = "relative";
    element.style.bottom = "1000px";
    let pos = 1000;
    let movement = setInterval(moveDown, 3);
    function moveDown() {
        if (pos <= 0) {
            clearInterval(movement);
        } else {
            pos -= 10;
            element.style.bottom = pos + "px";
        }
    }
}
function raiseUpElementbyID(elementID) {
    let element = document.getElementById(elementID);
    element.style.position = "relative";
    let pos = 0;
    let movement = setInterval(moveUp, 3);
    function moveUp() {
        if (pos > 1000)
        {
            clearInterval(movement);
        }
        else
        {
            pos += 10;
            element.style.bottom = pos + "px";
        }
    }
}

function changePlanets(planet)
{
    document.getElementById(currentPlanet).className = "";
    document.getElementById(planet).className = "selected";
}

function toggleSoundIcon()
{
    if(document.getElementById("trackON").style.display == "none")
    {
        document.getElementById("trackON").style.display = "inline";
        document.getElementById("trackOFF").style.display = "none";
        document.getElementById("musicTrack").play();
    }
    else if(document.getElementById("trackON").style.display == "inline")
    {
        document.getElementById("trackON").style.display = "none";
        document.getElementById("trackOFF").style.display = "inline";
        document.getElementById("musicTrack").pause();
    }
}
function changeEarth() {
    document.getElementById("musicTrack").pause();
    document.getElementById("musicTrack").currentTime = 0;
    document.getElementById("musicSource").src = "Castlevania-VampireKiller.ogg";
    document.getElementById("musicTrack").load();
    document.getElementById("musicTrack").play();
    currentPlanet = "EARTH";
    pipeGap = 300;
    localStorage.setItem("pipeGap", pipeGap);
    localStorage.setItem("currentPlanet", currentPlanet);
    document.getElementById("EARTH").style.backgroundColor = 'unset';
    document.getElementById("MOON").style.backgroundColor = 'unset';
    document.getElementById("JUBILEE").style.backgroundColor = 'unset';
    document.getElementById("ARGONIA").style.backgroundColor = 'unset';
    document.getElementById("EARTH").style.backgroundColor = 'gray';
    document.body.style.backgroundImage = "url('earthBackdrop.jpg')";
    document.body.style.color = "black";
    colorDefine = 0;
    localStorage.setItem("colorChange",colorDefine);
}

function changeMoon() {
    document.getElementById("musicTrack").pause();
    document.getElementById("musicTrack").currentTime = 0;
    document.getElementById("musicSource").src = "MoonTheme.ogg";
    document.getElementById("musicTrack").load();
    document.getElementById("musicTrack").play();
    currentPlanet = "MOON";
    pipeGap = 400;
    localStorage.setItem("pipeGap", pipeGap);
    localStorage.setItem("currentPlanet", currentPlanet);
    document.getElementById("EARTH").style.backgroundColor = 'unset';
    document.getElementById("MOON").style.backgroundColor = 'unset';
    document.getElementById("JUBILEE").style.backgroundColor = 'unset';
    document.getElementById("ARGONIA").style.backgroundColor = 'unset';
    document.getElementById("MOON").style.backgroundColor = 'gray';
    document.body.style.backgroundImage = "url('Moon Landscape.png')";
    document.body.style.color = "white";
    colorDefine = 1;
    localStorage.setItem("colorChange",colorDefine);
}

function changeJubilee() {
    document.getElementById("musicTrack").pause();
    document.getElementById("musicTrack").currentTime = 0;
    document.getElementById("musicSource").src = "JubileeTheme.ogg";
    document.getElementById("musicTrack").load();
    document.getElementById("musicTrack").play();
    currentPlanet = "JUBILEE";
    pipeGap = 500;
    localStorage.setItem("pipeGap", pipeGap);
    localStorage.setItem("currentPlanet", currentPlanet);
    document.getElementById("EARTH").style.backgroundColor = 'unset';
    document.getElementById("MOON").style.backgroundColor = 'unset';
    document.getElementById("JUBILEE").style.backgroundColor = 'unset';
    document.getElementById("ARGONIA").style.backgroundColor = 'unset';
    document.getElementById("JUBILEE").style.backgroundColor = 'gray';
    document.body.style.backgroundImage = "url('Jubilee Landscape.jpg')";
    document.body.style.color = "black";
    colorDefine = 0;
    localStorage.setItem("colorChange",colorDefine);
}

function changeArgonia() {
    document.getElementById("musicTrack").pause();
    document.getElementById("musicTrack").currentTime = 0;
    document.getElementById("musicSource").src = "ArgoniaTheme.ogg";
    document.getElementById("musicTrack").load();
    document.getElementById("musicTrack").play();
    currentPlanet = "ARGONIA";
    pipeGap = 100;
    localStorage.setItem("pipeGap", pipeGap);
    localStorage.setItem("currentPlanet", currentPlanet);
    document.getElementById("EARTH").style.backgroundColor = 'unset';
    document.getElementById("MOON").style.backgroundColor = 'unset';
    document.getElementById("JUBILEE").style.backgroundColor = 'unset';
    document.getElementById("ARGONIA").style.backgroundColor = 'unset';
    document.getElementById("ARGONIA").style.backgroundColor = 'gray';
    document.body.style.backgroundImage = "url('Argonia Landscape.jpg')";
    document.body.style.color = "white";
    colorDefine = 1;
    localStorage.setItem("colorChange",colorDefine);
}