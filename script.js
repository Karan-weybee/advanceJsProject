const peopleApi = "https://swapi.dev/api/people";
const images = $('#images');
var count = 1;
let singleData;

// for mapping images with name and pass data
async function renderImages(count) {
    count == 1 ? $('#prev-slide').hide() : $('#prev-slide').show();

    images.html(" ");
    $('#page-loading').show();
    const res = await fetch(peopleApi + `/?page=${count}`);
    const data = await res.json();
    if (res.status == 404) {
        alert("Data Not available...")
        $('#next-slide').hide();
    } else {
        $('#next-slide').show();
    }

    $.each(data.results, function (i, item) {
        const id = item.url.slice(29, item.url.length - 1);
        singleData = data.results;
        //console.log(singleData)
        const image = `<div class="image-name" id="image${id}">
                            <img onclick="dataModel(${id},${i + 1})" class="image" src="https://starwars-visualguide.com/assets/img/characters/${id}.jpg" alt="" srcset="" data-toggle="modal" data-target="#exampleModal">
                            <div class="name">${item.name}</div>
                        </div>`;
        images.append(image);
    });
    $('#page-loading').hide();
}

function dataModel(id, index) {
    defaultModel();
    $('#model-content').hide();
    $('#model-loading').show();
    getModelInfo(singleData[index - 1], id);
}

// it gives all data of the model
async function getModelInfo(data, id) {
    const films = [...data.films];
    const species = [...data.species];
    const homeworld = await fetch(data.homeworld).then(res => res.json()).then(data => { return data; });

    const filmResponses = await Promise.all(films.map(url => fetch(url)));
    const filmObj = await Promise.all(filmResponses.map(response => response.json()));
    const filmTitles = filmObj.map(d => d.title);

    const speciesResponses = await Promise.all(species.map(url => fetch(url)));
    const speciesObj = await Promise.all(speciesResponses.map(response => response.json()));
    const speciesNames = speciesObj.map(d => d.name);

    const modelInfo = {
        "id": id,
        "name": data.name,
        "birthYear": data.birth_year,
        "gender": data.gender,
        "filmTitles": filmTitles,
        "speciesNames": speciesNames,
        "homeworld": homeworld.name
    };
    updateSingleModel(modelInfo);
}

// fill the API data into the default model
function updateSingleModel(modelInfo) {
    //console.log(modelInfo)
    $('#People-name').html(`${modelInfo.name}`);
    $('#image-data').attr('src', `https://starwars-visualguide.com/assets/img/characters/${modelInfo.id}.jpg`);
    $('#People-Gender').html(`Gender :- ${modelInfo.gender}`);
    $('#People-Birth').html(`Birthday year:- ${modelInfo.birthYear}`);
    $('#People-Homeworld').html(`Homeworld :- ${modelInfo.homeworld}`);
    const species = modelInfo.speciesNames.join(' , ');
    const films = modelInfo.filmTitles.join(' , ');
    //console.log(typeof species)

    species.length == 0 ? $('#People-Species').html(`Species:- Unknown`) : $('#People-Species').html(`Species:- ${species}`);
    films.length == 0 ? $('#People-films').html(`films :- Unknown`) : $('#People-films').html(`films :- ${films}`);


    $('#model-content').show();
    $('#model-loading').hide();
}

// for empty model
function defaultModel() {
    const modelData = `<div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                            <div class="modal-dialog" role="document">
                                <div class="modal-content" id="model-content">
                                    <!-- Modal heading -->
                                    <div class="modal-header">
                                        <h3 class="modal-title" id="People-name"></h3>
                                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                            <span aria-hidden="true">×</span>
                                        </button>
                                    </div>
                                    <!-- Modal body with image -->
                                    <div class="modal-body">
                                        <div class="contant">
                                            <img id="image-data" src="" />
                                        </div>
                                        <div class="detail">
                                            <ul>
                                                <li id="People-Birth"></li>
                                                <li id="People-Gender"></li>
                                                <li id="People-Species"></li>
                                                <li id="People-Homeworld"></li>
                                                <li id="People-films"></li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                                <div id="model-loading" style="cursor:pointer">
                                    <div class="loader">
                                    <!-- <span>Page</span> <span>Loading</span><span>...</span> -->
                                        <img src="https://media.giphy.com/media/5AtXMjjrTMwvK/giphy.gif" alt="" srcset="">
                                    </div>
                                </div>
                            </div>
                        </div>`;

    $('body').append(modelData);
}

// render page
function renderApp() {
    renderImages(count);
}

// for next page
function nextSlide() {
    renderImages(++count);
}

// for previous page
$('#prev-slide').on('click', function (e) {
    e.preventDefault();
    renderImages(--count);
});

renderApp();
