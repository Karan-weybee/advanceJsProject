const peopleApi = "https://swapi.dev/api/people";
const images = $('#images');
const nextPage=$('#next-slide');
const prevPage=$('#prev-slide');
const pageLoader=$('#page-loading');
var count = 1;
let singleData;

// for mapping images with name and pass data onclick
async function renderImages(count) {

    const res = await fetch(peopleApi + `/?page=${count}`); 
    const data = await res.json();
    res.status == 404 ? alert("Data Not available...") || nextPage.hide() : nextPage.show();

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
    defaultModel();
    $('#model-content').hide();
    $('#model-loading').show();
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
            console.log(modelInfo)
            updateSingleModel(modelInfo);
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

// fill the API data into the default model
function updateSingleModel(modelInfo) {

    $('#People-name').html(`${modelInfo.name}`);
    $('#image-data').attr('src', `https://starwars-visualguide.com/assets/img/characters/${modelInfo.id}.jpg`);
    $('#People-Gender').html(`Gender :- ${modelInfo.gender}`);
    $('#People-Birth').html(`Birthday year:- ${modelInfo.birthYear}`);
    $('#People-Homeworld').html(`Homeworld :- ${modelInfo.homeworld}`);
    modelInfo.speciesNames.length == 0 ? $('#People-Species').html(`Species:- Unknown`) : $('#People-Species').html(`Species:- ${modelInfo.speciesNames.join(' , ')}`);
    modelInfo.filmTitles.length == 0 ? $('#People-films').html(`films :- Unknown`) : $('#People-films').html(`films :- ${modelInfo.filmTitles.join(' , ')}`);

    $('#model-content').show();
    $('#model-loading').hide();
}

// for empty model
function defaultModel() {
    const modelData = `<div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content" id="model-content">
            <div class="modal-header">
                <h3 class="modal-title" id="People-name"></h3>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">×</span>
                </button>
            </div>
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
                <img src="https://media.giphy.com/media/5AtXMjjrTMwvK/giphy.gif" alt="" srcset="">
            </div>
        </div>
    </div>
</div>
`;
    $('body').append(modelData);
}

// render page
function renderApp(count) {
    count == 1 ? prevPage.hide() : prevPage.show();
    images.html(" ");
    pageLoader.show();
    renderImages(count);
}

function nextSlide() {
    renderApp(++count);
}
prevPage.on('click', function (e) {
    e.preventDefault();
    renderApp(--count);
});

renderApp(count);
