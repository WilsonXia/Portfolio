const loadJson = (url, callbackFunction) => {
    let xhr = new XMLHttpRequest();
    xhr.onerror = e => console.log("Failed to load...");
    xhr.onload = e => callbackFunction(e.target.responseText);
    xhr.open("GET",url);
    xhr.send();
}

export{loadJson}