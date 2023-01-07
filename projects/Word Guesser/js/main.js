// We will use `strict mode`, which helps us by having the browser catch many common JS mistakes
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode

// https://www.wordsapi.com/docs/#random-words
"use strict";
const app = new PIXI.Application({
    width: 900,
    height: 600,
    backgroundColor: 0xE7F9E1
});
document.querySelector("#canvas").appendChild(app.view);

// constants
const sceneWidth = app.view.width;
const sceneHeight = app.view.height;

// pre-load the images
app.loader.add([
    "images/Table.png",
    "images/Plants/BonsaiB.png",
    "images/Plants/WildGrassB.png",
    "images/Plants/ShrubTreeB.png",
    "images/Plants/LeafyBoiB.png"
]);
app.loader.onProgress.add(e => { console.log(`progress=${e.progress}`) });
app.loader.onComplete.add(setup);
app.loader.load();

// aliases
let stage;

// game variables
let startScene, difficultySelect;
let instructionsScene;
let gameScene, scoreLabel, triesLabel, placeholderText, wordsGuessedLabel, timerLabel, prevLabel;
let gameOverScene, finalScoreLabel, highscoreLabel, lastWordLabel;

let easyMode = false;
let score;
let highscore = 0;
let tries;
let timer;
let hiddenWord;
let prevWord;
let placeholder;
let guess;
let guessList;
let wordList;
let hardWordList;
// The original hardmode
//let wordList = ["chicken","mice","distraught","house","plant","run","elementary","mustache","sword","game","word","challenge","east","treasure","planet","utopia","celestial","unrelenting","brain","vehicle", "igloo", "shoe", "jump", "book", "fire", "water", "cheese", "castle", "fermentation", "idealistic", "rudimentary", "pilot", "sing", "dictionary", "meme", "war", "endocrine", "liberation", "damnation", "exfoliate", "first", "man", "cholesterol", "development", "paradox", "weather", "wisdom", "wrinkle", "wacky", "wasteland", "whimsical", "dinosaur", "dapper", "dauntless", "debacle", "determination", "strangulation", "sanctimonious", "savant", "sanguine", "savy", "simple", "father", "fathom", "fickle", "finicky", "flaccid", "funny", "fraternity", "ironic", "indiscriminate", "involuntary", "illicit", "incarcerate", "imposter", "impervious", "understand", "ubiquitous", "unanimous", "ultimatum", "umbrella", "umpire", "underwear", "undergarments", "uncle", "love", "loser", "lethargic", "ludicrous", "lexicon", "legitmate", "language", "languid", "laser", "lack", "laboratory", "zoo", "zealous", "zesty", "random", "rejection", "rebuttal", "rambunctious", "ramification", "rapper", "rage", "reason", "rhetorical", "rapid", "rhythm", "gregarious", "monetary", "mother", "misery", "miasma", "mature", "maelstrom", "maestro", "magnitude", "magnificence", "milkshake", "medical", "magazine", "delivery", "dad", "drugs", "alphabet", "apparation", "abhorent", "abrasive", "abhor", "accompany", "alcoholic", "addiction", "affection", "appraisal", "adventure", "chisel", "cohort", "chorus", "convulsion", "coy", "complete", "chemistry", "correct", "cistern", "cycle", "juggernaut", "jealousy", "judicial", "jeapardize", "jubilation", "jobs", "jolly", "kleptomaniac", "kindred", "knoll", "kudos", "knight", "kale", "karaoke", "kidnap", "kindergarten", "keyboard", "wrong", "omittence", "omnious", "oasis", "obedience", "obligation", "objective", "oblique", "occult", "omnipotent", "omnivore", "xylophone", "xanthic"];
let easyWordList = ["additional", "agreeable", "argue", "arrange", "assist", "attract", "careless", "cause", "climate", "coast", "compare","construct","continent","contrast","credit","culture","dangle","defend","details","develop","peer","division","prank","purpose","event","examine","example","experience","fatal","flexible","furious","gathered","gist","infer","intelligent","invitation","irritate","marine","mend","multiply","nervous","occur","opposite","passage","patient","disappointed","pleasant","elect","endangered","region","repair","ridiculous","scar","scatter","shiver","signal","similar","slumber","solution","starve","stumble","tackle","tentacle","typical","unite","unusual","valuable","vehicle","volunteer","diagram","persuade","effect","predict","recognize","amaze","amusing","analyze","annoy","arranged","avoid","cause","classify","data","detail","discover","edit","energy","enormous","escape","famous","flock","friendly","gust","helpful","include","insist","investigate","label","moist","noticed","opinion","plan","poke","predict","prefer","publish","revise","separate","steaming","shivered","sum","suppose","sway","stormy","swoop","treasure","vanish","volunteer"];
let levelNum = 1;
let paused = true;

// Input
let controller = document.body.querySelector("#controller").style;
let searchbar = document.body.querySelector("#controller input");
let guessButton = document.body.querySelector("#controller button");

function setup() {
    stage = app.stage;
    // #1 - Create the `start` scene
    startScene = new PIXI.Container();
    stage.addChild(startScene);

    // #2 - Create the main `game` scene and make it invisible
    gameScene = new PIXI.Container();
    gameScene.visible = false;
    controller.display = "none";
    stage.addChild(gameScene);

    // #3 - Create the `gameOver` scene and make it invisible
    gameOverScene = new PIXI.Container();
    gameOverScene.visible = false;
    stage.addChild(gameOverScene);

    // #4 - Create 'instructionsScene' scene and make it invisible
    instructionsScene = new PIXI.Container();
    instructionsScene.visible = false;
    stage.addChild(instructionsScene);

    // #5 - Create labels for all scenes
    createLabelsAndButtons();
    createSprites();

    // #6 - Game Setup
    changeDifficulty();
    getAWordList();

    // #7 - Start update loop
    app.ticker.add(gameLoop);

    // #8 - Start listening for click events on the canvas
    //app.view.onclick = fireBullet;
    guessButton.onclick = checkGuess;
}

function createLabelsAndButtons() {
    let buttonStyle = new PIXI.TextStyle({
        fill: 0x5AA9E6,
        fontSize: 48,
        fontFamily: 'Roboto Mono',
    });

    let mainStyle = new PIXI.TextStyle({
        fill: 0x000000,
        fontSize: 48,
        fontFamily: 'Roboto Mono',
    })

    let smallTextStyle = new PIXI.TextStyle({
        fill: 0x000000,
        fontSize: 16,
        fontFamily: 'Roboto Mono',
        align: "center"
    });

    let UITextStyle = new PIXI.TextStyle({
        fill: 0x00000,
        fontSize: 21,
        fontFamily: 'Roboto Mono',
        align: "center"
    })

    let paragraphStyle = new PIXI.TextStyle({
        fill: 0x000000,
        fontSize: 30,
        fontFamily: 'Roboto Mono',
        align: "left",
        wordWrap: true,
        wordWrapWidth: sceneWidth * 0.7
    });

    //#region A - Set up 'startScene'
    // Title
    let startTitle = new PIXI.Text("W O R D   G U E S S E R");
    startTitle.style = mainStyle;
    startTitle.anchor.set(0.5);
    startTitle.x = sceneWidth * 0.5;
    startTitle.y = sceneHeight * 0.2;
    startScene.addChild(startTitle);

    // start button
    let startButton = new PIXI.Text("Start Game");
    startButton.anchor.set(0.5);
    startButton.x = sceneWidth * 0.5;
    startButton.y = sceneHeight * 0.6;

    makeButton(startButton, buttonStyle, startGame);
    startScene.addChild(startButton);

    // How To Play Button
    let startHowToPlay = new PIXI.Text("How To Play");
    startHowToPlay.anchor.set(0.5);
    startHowToPlay.x = sceneWidth * 0.5;
    startHowToPlay.y = sceneHeight * 0.7;

    makeButton(startHowToPlay, buttonStyle, showInstructions);
    startScene.addChild(startHowToPlay);

    // Difficulty Select
    difficultySelect = new PIXI.Text();
    difficultySelect.anchor.set(0.5);
    difficultySelect.x = sceneWidth * 0.5;
    difficultySelect.y = sceneHeight * 0.8;

    makeButton(difficultySelect, buttonStyle, changeDifficulty);
    startScene.addChild(difficultySelect);
    //#endregion

    //#region B - Set up 'gameScene'
    // Timer
    timerLabel = new PIXI.Text(timer);
    timerLabel.style = mainStyle;
    timerLabel.anchor.set(0.5);
    timerLabel.x = sceneWidth * 0.5;
    timerLabel.y = sceneHeight * 0.12;
    gameScene.addChild(timerLabel);

    // Instruction
    let gameMessage = new PIXI.Text("Guess the Word!");
    gameMessage.style = mainStyle;
    gameMessage.anchor.set(0.5);
    gameMessage.x = sceneWidth * 0.5;
    gameMessage.y = sceneHeight * 0.24;
    gameScene.addChild(gameMessage);

    // Hidden Word
    placeholderText = new PIXI.Text(placeholder);
    placeholderText.style = mainStyle;
    placeholderText.style.fontSize = 60;
    placeholderText.anchor.set(0.5);
    placeholderText.x = sceneWidth * 0.5;
    placeholderText.y = sceneHeight * 0.42;
    gameScene.addChild(placeholderText);

    // Words Guessed
    wordsGuessedLabel = new PIXI.Text();
    wordsGuessedLabel.style = UITextStyle;
    wordsGuessedLabel.anchor.set(0.5, 0);
    wordsGuessedLabel.x = sceneWidth * 0.5;
    wordsGuessedLabel.y = placeholderText.y + 100;
    gameScene.addChild(wordsGuessedLabel);
    
    // Score Label
    scoreLabel = new PIXI.Text("Score\n"+score);
    scoreLabel.style = UITextStyle;
    scoreLabel.anchor.set(0.5);
    scoreLabel.x = sceneWidth * 0.08;
    scoreLabel.y = sceneHeight * 0.9;
    gameScene.addChild(scoreLabel);

    // Tries Label
    triesLabel = new PIXI.Text("Tries\n"+tries);
    triesLabel.style = UITextStyle;
    triesLabel.anchor.set(0.5);
    triesLabel.x = scoreLabel.x + scoreLabel.width * 1.5;
    triesLabel.y = scoreLabel.y;
    gameScene.addChild(triesLabel);

    // Previous Word Label
    prevLabel = new PIXI.Text("Previous Word:\n" + prevWord);
    prevLabel.style = smallTextStyle;
    prevLabel.anchor.set(0.5);
    prevLabel.x = sceneWidth * 0.84;
    prevLabel.y = sceneHeight * 0.84;
    gameScene.addChild(prevLabel);
    //#endregion

    //#region C - Set up 'gameOverScene'
    // GameOver Text
    let gameOverLabel1 = new PIXI.Text("G a m e   O v e r...");
    gameOverLabel1.style = mainStyle;
    gameOverLabel1.anchor.set(0.5);
    gameOverLabel1.x = sceneWidth * 0.5;
    gameOverLabel1.y = sceneHeight * 0.3;
    gameOverScene.addChild(gameOverLabel1);

    // Final Score 
    finalScoreLabel = new PIXI.Text();
    finalScoreLabel.style = paragraphStyle;
    finalScoreLabel.anchor.set(0.5);
    finalScoreLabel.x = gameOverLabel1.x;
    finalScoreLabel.y = gameOverLabel1.y + 100;
    gameOverScene.addChild(finalScoreLabel);
    
    // Last Word Label
    lastWordLabel = new PIXI.Text();
    lastWordLabel.style = paragraphStyle;
    lastWordLabel.anchor.set(0.5);
    lastWordLabel.x = finalScoreLabel.x;
    lastWordLabel.y = finalScoreLabel.y + 100;
    gameOverScene.addChild(lastWordLabel);

    // Highscore
    highscoreLabel = new PIXI.Text("High Score: " + highscore);
    highscoreLabel.style = smallTextStyle;
    highscoreLabel.anchor.set(0.5);
    highscoreLabel.x = sceneWidth * 0.08;
    highscoreLabel.y = sceneHeight * 0.9;
    gameOverScene.addChild(highscoreLabel);

    // Play Again Button
    let playAgainButton = new PIXI.Text("Play Again");
    playAgainButton.anchor.set(0.5);
    playAgainButton.x = sceneWidth * 0.5;
    playAgainButton.y = sceneHeight * 0.8;

    makeButton(playAgainButton, buttonStyle, startGame);
    gameOverScene.addChild(playAgainButton);

    // Exit Button
    let exitButton = new PIXI.Text("Exit to Main Menu");
    exitButton.anchor.set(0.5);
    exitButton.x = sceneWidth * 0.5;
    exitButton.y = sceneHeight * 0.9;

    makeButton(exitButton, buttonStyle, returnToTitle);
    gameOverScene.addChild(exitButton);
    //#endregion

    //#region D - Set up Instructions Scene
    // Title
    let instructTitle = new PIXI.Text("How To Play");
    instructTitle.style = mainStyle;
    instructTitle.anchor.set(0.5);
    instructTitle.x = sceneWidth * 0.5;
    instructTitle.y = sceneHeight * 0.2;
    instructionsScene.addChild(instructTitle);

    // Paragraph 1
    let instructP1 = new PIXI.Text("Type in as many words you know that fit the hints provided!\n\nTry to guess as many words as possible!");
    instructP1.text += "\n\nMake sure to type the hidden word correctly to score points.";
    instructP1.style = paragraphStyle;
    instructP1.anchor.set(0.5);
    instructP1.x = sceneWidth * 0.5;
    instructP1.y = sceneHeight * 0.5;
    instructionsScene.addChild(instructP1);

    // Return Button
    let instructReturnToTitle = new PIXI.Text("Back to Title");
    instructReturnToTitle.x = sceneWidth * 0.3;
    instructReturnToTitle.y = sceneHeight * 0.9;

    makeButton(instructReturnToTitle, buttonStyle, returnToTitle);
    instructionsScene.addChild(instructReturnToTitle);
    //#endregion
}

function createSprites(){
    // Start Scene
    let plantSprite = new PIXI.Sprite(app.loader.resources["images/Plants/WildGrassB.png"].texture);
    makeSprite(plantSprite);
    plantSprite.x = sceneWidth * 0.85;
    plantSprite.y = sceneHeight * 0.75;
    startScene.addChild(plantSprite);

    let tableSprite = new PIXI.Sprite(app.loader.resources["images/Table.png"].texture);
    makeSprite(tableSprite);
    tableSprite.x = sceneWidth * 0.15;
    tableSprite.y = sceneHeight * 0.75;
    startScene.addChild(tableSprite);

    let bonsaiSprite = new PIXI.Sprite(app.loader.resources["images/Plants/BonsaiB.png"].texture);
    makeSprite(bonsaiSprite);
    bonsaiSprite.x = tableSprite.x;
    bonsaiSprite.y = tableSprite.y - tableSprite.height +5;
    startScene.addChild(bonsaiSprite);
    //#endregion

    //#region Game Scene
    let gamePlant = new PIXI.Sprite(app.loader.resources["images/Plants/LeafyBoiB.png"].texture);
    makeSprite(gamePlant);
    gamePlant.x = sceneWidth * 0.84;
    gamePlant.y = sceneHeight * 0.75;
    gameScene.addChild(gamePlant);

    let gamePlant2 = new PIXI.Sprite(app.loader.resources["images/Plants/ShrubTreeB.png"].texture);
    makeSprite(gamePlant2);
    gamePlant2.x = sceneWidth * 0.16;
    gamePlant2.y = sceneHeight * 0.75;
    gameScene.addChild(gamePlant2);
    //#endregion
}

function startGame() {
    // Initial Scenes
    startScene.visible = false;
    gameOverScene.visible = false;
    gameScene.visible = true;
    instructionsScene.visible = false;
    showController(true);

    // Initialize Variables
    score = 0;
    tries = 3;
    timer = 90;
    hiddenWord = "";
    prevWord = "";
    guess = "";
    guessList = [];
    wordList = [];
    levelNum = 1;
    paused = false;

    // Load Word List
    loadWordList();
    // Give a small buffer
    loadLevel();
}

function gameLoop() {
    if (paused) return;

    // #1 - Calculate "delta time"
    let dt = 1 / app.ticker.FPS;
    if (dt > 1 / 12) dt = 1 / 12;

    // #2 - Update the timer
    timer -= dt;
    timerLabel.text = Math.floor(timer);

    // #3 - Is game over?
    if (timer < 0) {
        finalScoreLabel.text = "Your Score: " + score;
        lastWordLabel.text = `The last word was: ${hiddenWord}`;
        end();
        return; // return here so we skip #8 below
    }

    // #4 - Load next level
    if (guess == hiddenWord || tries <= 0) {
        // if the word has been guessed, tell user
        // then proceed with a new level
        if(guess == hiddenWord)
        {
            score++;
        }
        loadLevel();
    }
}

function loadLevel() {
    // Save the previous word
    prevWord = hiddenWord;
    // Picks a new word
    hiddenWord = getAWord(); 
    // Reset the guesses as well
    guess = "";
    guessList = [];
    tries = 3;
    // Set up the placeholder
    makeHint();
    // Update Text
    triesLabel.text = "Tries\n"+tries;
    placeholderText.text = placeholder;
    scoreLabel.text = "Score\n"+score;
    prevLabel.text = "Previous Word:\n" + prevWord;
    createGuessedLabel();
}

function end() {
    paused = true;
    // Check for high score
    if(score > highscore){
        highscore = score;
        highscoreLabel.text = "Highscore:\n" + highscore;
    }

    // Switch scenes
    gameOverScene.visible = true;
    showController(false);
    gameScene.visible = false;
}

function returnToTitle(){
    startScene.visible = true;
    gameOverScene.visible = false;
    gameScene.visible = false;
    instructionsScene.visible = false;
}

function showController(visible) {
    if (visible) {
        controller.display = "block";
    } else {
        controller.display = "none";
    }
    searchbar.value = "";
}

function checkGuess() {
    let matchingLetters = [];
    let newPlaceholder = [];
    // Reduce tries
    tries--;
    // Retrieve the guess and add it to the guessList
    guess = searchbar.value.trim().toLowerCase();
    guessList.push(guess);
    // Create new placeholder
    for(let char of placeholder){
        if(char == '*'){
            newPlaceholder.push('*');
        }
        else{
            newPlaceholder.push(char);
        }
    }
    // Check if the guess has any matching letters
    for (let char of guess) {
        if (hiddenWord.includes(char) && !matchingLetters.includes(char)) {
            matchingLetters.push(char);
        }
    }
    // Check the matching letters
    if (matchingLetters.length > 0) {
        for (let letter of matchingLetters) {
            for (let i = 0; i < hiddenWord.length; i++) {
                // If the matching letter is in that index
                if (letter == hiddenWord[i]) {
                    // change the values at that index
                    newPlaceholder[i] = letter;
                }
            }
        }
    }
    // Update the text
    placeholder = "";
    for (let char of newPlaceholder){
        placeholder += char;
    }
    placeholderText.text = placeholder;
    triesLabel.text = "Tries\n"+tries;
    searchbar.value = "";
    createGuessedLabel();
}

// Helper Function
function getRandomInt(max, min = 0){
    return Math.floor(Math.random() * max) + min;
}

function loadWordList(){
    if(easyMode){
        wordList = easyWordList;
    }
    else{
        // Gather a selection of 20 words from
        // the hardword list
        let list = [];
        let word;
        for(let i = 0; i < 20; i++){
            let word = hardWordList[getRandomInt(hardWordList.length)];
            // Make sure they are differnet words
            while(list.includes(word))
            {
                word = hardWordList[getRandomInt(hardWordList.length)];
            }
            list.push(word);
        }
        wordList = list;
    }
}

function getAWord(){
    let word;
    do{
        let index = getRandomInt(wordList.length);
        word = wordList[index];
    }
    while(word == prevWord);
    return word;
}

function makeHint(){
    placeholder = "";
    placeholder += hiddenWord[0];
    let indicies = [];
    // Keep track of indicies to reveal
    if(hiddenWord.length > 3){
        // Reveal as many times as its divisible by 3
        for(let i = 0; i < hiddenWord.length / 3; i++){
            let index;
            // Find a new index 
            do{
                index = getRandomInt(hiddenWord.length, 1);
            }
            while(indicies.includes(index));
            indicies.push(index);
        }
    }
    if(hiddenWord.length > 5){
        // Check if the endpoint is not in the list
        if(!indicies.includes(hiddenWord.length - 1)){
            indicies.push(hiddenWord.length - 1);
        }
    }
    // Then if at that index, reveal it. Otherwise, place a *.
    for(let i = 1; i < hiddenWord.length; i++){
        // Check each index
        for(let index of indicies){
            // At that matching index
            if(i == index){
                // Reveal the letter at that place
                placeholder += hiddenWord[i];
            }
        }
        // Checks if we added a letter
        // If not, we add a placeholder
        if(placeholder.length != i+1){
            placeholder += "*";
        }
    }
}

// Helper Function
function makeButton(e, style, method)
{
    // Sets the defaults for a button
    e.style = style;
    e.anchor.set(0.5);
    e.interactive = true;
    e.buttonMode = true;
    e.on("pointerup", method);
    e.on('pointerover', e => e.target.alpha = 0.7);
    e.on('pointerout', e => e.currentTarget.alpha = 1.0);
}

function makeSprite(sprite){
    // Sets the defaults for a Sprite
    sprite.anchor.set(0.5, 1);
    sprite.width *= 0.5;
    sprite.height *= 0.5;
}

function changeDifficulty(){
    easyMode = !easyMode;
    // Set up the difficulty text
    let phrase = "";
    if(easyMode){
        phrase = "Easy";
    } 
    else{
        phrase = "Hard";
    }
    difficultySelect.text = "Difficulty: " + phrase;
}

function showInstructions(){
    instructionsScene.visible = true;
    gameScene.visible = false;
    startScene.visible = false;
}

function createGuessedLabel(){
    //Formats the guessList into the Label
    wordsGuessedLabel.text = "Guessed:\n";
    for(let word of guessList){
        wordsGuessedLabel.text += `${word}\n`;
    }
}

// Reads if enter has been pressed
window.onkeydown = (e) => {
    if(gameScene.visible && !paused){
        // Check if enter is being pressed
        if(e.keyCode == 13){
            if(searchbar.value)
            checkGuess();
        }
    }
}