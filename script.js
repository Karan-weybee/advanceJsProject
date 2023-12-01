const peopleApi = "https://swapi.dev/api/people";
const images = $('#images');
const nextSlideBtn = $('#next-slide');
const prevSlideBtn = $('#prev-slide');
const pageLoader = $('#page-loading');
const modelLoader=$('#model-loading');

var count = 1;
let singleData;

var modalDetails = {
    peopleName: $('#People-name'),
    imageData: $('#image-data'),
    peopleGender: $('#People-Gender'),
    peopleBirth: $('#People-Birth'),
    Homeworld: $('#People-Homeworld'),
    peopleSpecies: $('#People-Species'),
    films: $('#People-films')
}


// for mapping images with name and pass data onclick
async function renderImages(count) {

    const res = await fetch(peopleApi + `/?page=${count}`);
    const data = await res.json();
    res.status == 404 ? alert("Data Not available...") || nextSlideBtn.hide() : nextSlideBtn.show();

    $.each(data.results, function (i, item) {
        const id = item.url.slice(29, item.url.length - 1);
        singleData = data.results;
        //console.log(singleData)
        const image = `<div class="image-name" id="image${id}"><img onclick="dataModel(${id},${i + 1})" class="image" src="https://starwars-visualguide.com/assets/img/characters/${id}.jpg" alt="" srcset="" data-toggle="modal" data-target="#exampleModal"><div class="name">${item.name}</div></div>`;
        images.append(image);
    });
    pageLoader.hide();
}

function dataModel(id, index) {

    $('#exampleModal').show();
    $('#model-content').hide();
    modelLoader.show();
    getModelInfo(singleData[index - 1], id);
}

// it gives all data of the model
function getModelInfo(data, id) {

    var allData = [[...data.films], [data.homeworld], [...data.species]];
    Promise.all(allData.map(ins => Promise.all(ins.map(i => getJSON(i))))).
        then(res => {
            const modelInfo = {
                "id": id,
                "name": data.name,
                "birthYear": data.birth_year,
                "gender": data.gender,
                "filmTitles": res[0].map(d => d.title),
                "speciesNames": res[2].map(d => d.name),
                "homeworld": res[1][0].name
            };
            //console.log(modelInfo)
            fillDataInModel(modelInfo);
        });
}

const getJSON = async (url) => {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok.');
        }
        return response.json();
    } catch (error) {
        throw new Error(`Fetch failed: ${error.message}`);
    }
};

// fill the API data into the model
function fillDataInModel(modelInfo) {

    modalDetails.peopleName.html(`${modelInfo.name}`);
    modalDetails.imageData.attr('src', `https://starwars-visualguide.com/assets/img/characters/${modelInfo.id}.jpg`);
    modalDetails.peopleGender.html(`Gender :- ${modelInfo.gender}`);
    modalDetails.peopleBirth.html(`Birthday year:- ${modelInfo.birthYear}`);
    modalDetails.Homeworld.html(`Homeworld :- ${modelInfo.homeworld}`);
    modelInfo.speciesNames.length == 0 ? modalDetails.peopleSpecies.html(`Species:- Unknown`) : modalDetails.peopleSpecies.html(`Species:- ${modelInfo.speciesNames.join(' , ')}`);
    modelInfo.filmTitles.length == 0 ? modalDetails.films.html(`films :- Unknown`) : modalDetails.films.html(`films :- ${modelInfo.filmTitles.join(' , ')}`);

    $('#model-content').show();
    modelLoader.hide();
}

// render page
function renderApp(count) {
    count == 1 ? prevSlideBtn.hide() : prevSlideBtn.show();
    images.html(" ");
    pageLoader.show();
    renderImages(count);
}

function nextSlide() {
    renderApp(++count);
}
prevSlideBtn.on('click', function (e) {
    e.preventDefault();
    renderApp(--count);
});

renderApp(count);
