import { loadJson } from "./utils.js";

const loadAboutMe = (text) => {
    let json;
        try{
            json = JSON.parse(text);
        }
        catch{
            console.log("Parse failed...");
            return;
        }
    
    let skills = json.skills;
    let languages = json.languages;
    let softwares = json.softwares;
    // let frameworks = json.frameworks;
    const mapJson = (array) => {
        return array.map((word)=>`<li class="box"><p>${word}</p></li>`).join();
    }
    console.log(softwares);
    document.querySelector("#skillList").innerHTML = mapJson(skills);
    document.querySelector("#languageList").innerHTML = mapJson(languages);
    document.querySelector("#softwareList").innerHTML = mapJson(softwares);
}

loadJson("data/aboutMe.json", loadAboutMe);