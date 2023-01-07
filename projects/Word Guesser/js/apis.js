let apiURL = "https://random-word-api.herokuapp.com/word";
let data;

function getAWordList() {
    let url = apiURL;
    // Choose a random length based on difficulty
    // 3-5 letter words on easy
    // 4 or higher on hard
    let minLength = 4;
    let maxLength = 6;
    let number = 100;
    let length = getRandomInt(maxLength, minLength);
    url += `?lang=en&number=${number}`;
    // url += `&length=${length}`;
    getData(url);
}

const getData = (url) => {
    let xhr = new XMLHttpRequest();
    xhr.onload = dataLoaded;
    xhr.onerror = dataError;
    xhr.open("GET", url);
    xhr.send();
}

const dataError = (e) => {
    console.log("An error has occured");
    console.log(e.message);
}

const dataLoaded = (e) => {
    let xhr = e.target;
    let entry = JSON.parse(xhr.responseText);

    hardWordList = entry;
    // Set the hidden word equal to the entry
}