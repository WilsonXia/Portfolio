import { loadJson } from "./utils.js";

const loadProjects = (text) => {
    let json;
        try{
            json = JSON.parse(text);
        }
        catch{
            console.log("Parse failed...");
            return;
        }

    const projectArray = json.projects;
    let html = "";
    for(let i = 0; i < projectArray.length; i++){
        let project = projectArray[i];
        let imgHtml = "";
        let projectHtml = "";
        if(project.images){
            imgHtml = `<img src=${project.images} alt="screenshot of project">`;
        }
        if(project.href){
            projectHtml = `<a href=${project.href}>${project.title}</a>`;
        }
        else{
            projectHtml = `<a>${project.title}</a>`;
        }
        projectHtml += `<p>${project.description}</p><a href="${project.git}">Check Code</a>`
        
        if(i % 2 == 0){
            projectHtml = `<li class="leftside projectBox"><div class="project">${projectHtml}</div>${imgHtml}</li>`;
        }
        else{
            projectHtml = `<li class="rightside projectBox">${imgHtml}<div class="project">${projectHtml}</div></li>`;
        }
        html += projectHtml;
    }
    document.querySelector("#project-list").innerHTML = html;
}

loadJson("data/projects.json", loadProjects);