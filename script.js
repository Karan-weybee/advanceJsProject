const peopleApi = "https://swapi.dev/api/people";
const Model = document.getElementsByClassName('image-name');
var count = 1;

async function renderImages(count) {

    const res = await fetch(peopleApi + `/?page=${count}`);
    const data = await res.json();
    document.getElementById('images').innerHTML = " ";
    for (let i = 1; i < data.results.length + 1; i++) {

        var detail = new Array();
        detail = data.results;
        var id = detail[i - 1].url.slice(29, detail[i - 1].url.length-1);
      //  var id = ids.slice(0, ids.length - 1);
        console.log(id)
        console.log(detail)
        var image = `<div class="image-name" id="image${id}"><img onclick="dataModel(${id})" class="image" src="https://starwars-visualguide.com/assets/img/characters/${id}.jpg" alt="" srcset="" data-toggle="modal" data-target="#exampleModal"><div class="name">${data.results[i - 1].name}</div></div>`
        document.getElementById('images').insertAdjacentHTML('beforeend', image);


    }
}

function dataModel(id) {
    defaultModel();
    document.getElementById('model-content').style.display = 'none';
    document.getElementById('model-loading').style.display = 'block';


    fetch(peopleApi + `/${id}`)
        .then(res => res.json())  // Parse the response as JSON
        .then(data => {
            getModelInfo(data, id)
        });


}
async function getModelInfo(data, id) {

    var films = [...data.films];
    var filmTitles = [];
    var species = [...data.species]
    var speciesNames = [];

    var homeworld = await fetch(data.homeworld).then(res => res.json()).then(data => { return data })
    //for find file title
    const filmResponses =
        await Promise.all(films.map(url => fetch(url)));

    var filmObj = await
        Promise.all(filmResponses.map(response => response.json()));
    filmTitles = filmObj.map(d => d.title);
    console.log(filmObj.map(d => d.title))

    //for find species name
    const speciesResponses =
        await Promise.all(species.map(url => fetch(url)));

    var speciesObj = await
        Promise.all(speciesResponses.map(response => response.json()));
    speciesNames = speciesObj.map(d => d.name);
    console.log(speciesNames)

    //console.log(homeworld.name)

    var modelInfo = {
        "id": id,
        "name": data.name,
        "birthYear": data.birth_year,
        "gender": data.gender,
        "filmTitles": filmTitles,
        "speciesNames": speciesNames,
        "homeworld": homeworld.name
    }
    updateSingleModel(modelInfo)
}


function updateSingleModel(modelInfo) {
    console.log(modelInfo)
    document.getElementById('People-name').innerHTML = `${modelInfo.name}`
    document.getElementById('image-data').src = `https://starwars-visualguide.com/assets/img/characters/${modelInfo.id}.jpg`
    document.getElementById('People-Gender').innerHTML = `Gender :- ${modelInfo.gender}`
    document.getElementById('People-Birth').innerHTML = `Birthday year:- ${modelInfo.birthYear}`
    document.getElementById('People-Homeworld').innerHTML = `Homeworld :- ${modelInfo.homeworld}`
    const species = modelInfo.speciesNames.map(obj => obj).join(' , ');
    const films = modelInfo.filmTitles.map(obj => obj).join(' , ');
    if (species != null) {
        document.getElementById('People-Species').innerHTML = `Species:- ${species}`
    }
    if (films != null) {
        document.getElementById('People-films').innerHTML = `films :- ${films}`
    }
    document.getElementById('model-loading').style.display = 'none';
    document.getElementById('model-content').style.display = 'block';
}


function defaultModel() {
    var modelData = ` <div class="modal fade" id="exampleModal" tabindex="-1"
    role="dialog" aria-labelledby="exampleModalLabel"
    aria-hidden="true">  <div class="modal-dialog" role="document">
    <div class="modal-content" id="model-content">
        <!-- Modal heading -->
        <div class="modal-header">
        <h3 class="modal-title" id="People-name">
        
    </h3>
            <button type="button" class="close"
                data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">
                    ×
                </span>
            </button>
        </div>
        <!-- Modal body with image -->
        <div class="modal-body">
            <div class="contant" >
                <img id="image-data" src="" />
            </div>
          <div class="detail">
            <ul>
                <li id=People-Birth></li>
                <li id=People-Gender ></li>
                <li id=People-Species ></li>
                <li id=People-Homeworld ></li>
                <li id=People-films > </li>
            </ul>
          </div>

        </div>
    </div>
    <div id=model-loading style="cursor:pointer"><span>Loading...</span></div>
</div></div>`;

    //  document.getElementById('exampleModal').innerHTML = '';
    document.querySelector('body').insertAdjacentHTML('beforeend', modelData);

}


function renderApp() {
    renderImages(count);
}

renderApp();
function nextSlide() {

    console.log(`next slide`)
    renderImages(++count);
}
document.getElementById('prev-slide').addEventListener('click', function (e) {
    e.preventDefault();
    console.log(`previous slide`)
    if (count > 1) {
        renderImages(--count);
    }
    else {
        alert("Prev slide data not available...")
    }
});

