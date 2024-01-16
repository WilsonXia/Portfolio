// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
// TODO: Add SDKs for Firebase products that you want to use
import { getDatabase, ref, set, push, onValue, get } from  "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyD8BliWFlytOG2M1UuRO8jUj7zYsk764RA",
    authDomain: "portfolio-709ad.firebaseapp.com",
    projectId: "portfolio-709ad",
    storageBucket: "portfolio-709ad.appspot.com",
    messagingSenderId: "467433329933",
    appId: "1:467433329933:web:e4f10c857c1fba37e08c44"
  };
// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getDatabase();
const projectsRef = ref(db, 'projects');

const projectsChanged = (snapshot) => {
    let html =  "";
    snapshot.forEach(project => {
        const childData = project.val(); // obtains that reference's value
        // Build a Card
        let buttonHTML = "";
        let githubHTML = "";
        if(childData.pageURL){
            buttonHTML = `
            <a class="button" href="${childData.pageURL}">View Project</a>`;
        }
        if(childData.gitHubURL){
          githubHTML = `<a class="button" href="https://github.com/WilsonXia/Portfolio" target="_blank">
          <span class="icon"><i class="fa-brands fa-github fa-2xl"></i></span></a>`;
        }
        
        html += `
        <div class="grow">
        <div class="card project-card slide-in delay-1">
          <div class="card-image">
            <figure class="image is-2by1">
              <img src="${childData.coverImage}" alt="${childData.title} screenshot">
            </figure>
          </div>
          <div class="card-content">
            <h2 class="title has-text-centered dark-color">${childData.title}</h2>
            <h2 class="subtitle has-text-centered dark-color">${childData.flavor}</h2>
          </div>
          <div class="container pb-2 is-flex is-justify-content-space-evenly">
          ${buttonHTML}
          ${githubHTML}
          </div>
        </div>
        </div>`;
    })
    document.querySelector("#card-holder").innerHTML = html;
}

const featuredChanged = (snapshot) => {
  let html =  "";
  snapshot.forEach(project => {
      const childData = project.val(); // obtains that reference's value
      // Build a Card if the project is featured
      if(childData.featured){
        let buttonHTML = "";
        let gitHubHTML = "";
        if(childData.pageURL){
          buttonHTML = `
          <a class="button" href="${childData.pageURL}">View Project</a>`;
        }
        if(childData.gitHubURL){
          gitHubHTML = `<a class="box" href="https://github.com/WilsonXia/Portfolio" target="_blank">
          <span class="icon"><i class="fa-brands fa-github fa-2xl"></i></span></a>`;
        }
        html += `
        <div class="swiper-slide">
        <div class="card">
            <div class="card-image">
                <figure class="image is-2by1">
                    <img src="${childData.coverImage}" alt="${childData.title}">
                </figure>
                <div class="card-content is-flex is-flex-wrap-wrap is-justify-content-space-between">
                    <div>
                        <h2 class="title highlight">${childData.title}</h2>
                        <h2 class="subtitle dark-color">${childData.flavor}</h2>
                    </div>
                    ${buttonHTML}
                    ${gitHubHTML}
                </div>
            </div>
        </div>
        </div>`;
      }
  })
  document.querySelector("#wrapper").innerHTML = html;
}

const writeProjectData = ({title, flavor, coverImage, pageURL}) => {
    const db = getDatabase();
    set(ref(db, 'projects/' + title), {
        title,
        flavor,
        coverImage,
        pageURL
    });
};

const setUpProjectsPage = () => {
    onValue(projectsRef,projectsChanged);
}

const setUpHomePage = () => {
  onValue(projectsRef,featuredChanged);
}

const setUpBuildPage = () => {
    // Debug Button
    let submitBtn = document.querySelector("#submit-btn");
    // submitBtn.onclick = () => {
    //     console.log(`
    //     Title: ${document.querySelector("#input-title").value}\n
    //     Flavor: ${document.querySelector("#input-flavor").value}\n
    //     URL: ${document.querySelector("#input-pageURL").value}\n
    //     File Submitted: ${document.querySelector("#input-coverImage").value}`);
    // }
    // Save Button
    submitBtn.onclick = () => {
        writeProjectData({
            title: document.querySelector("#input-title").value,
            flavor: document.querySelector("#input-flavor").value,
            coverImage: `images/screenshots/${document.querySelector("#input-coverImage").value.replace(`C:\\fakepath\\`, ``)}`,
            pageURL: document.querySelector("#input-pageURL").value,
            gitHubURL: document.querySelector("#input-gitHubURL").value
        });
    };

    setUpProjectsPage();
}

export {setUpBuildPage, setUpProjectsPage, setUpHomePage}

  
// const scoresChanged = (snapshot) => {
//     let html = "";
//     snapshot.forEach(score => {
//       const childKey = score.key;
//       const childData = score.val();
//       console.log(childKey,childData);

//       html += `<li>${childData.name} - ${childData.game} - ${childData.score}</li>`;
//     });
//     document.querySelector("#scoresList").innerHTML = html;
// }
