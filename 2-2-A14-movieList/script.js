// 串接API
const BASE_URL = "https://movie-list.alphacamp.io";
const INDEX_URL = BASE_URL + "/api/v1/movies/";
const POSTER_URL = BASE_URL + "/posters/";
const movies = [];

const dataPanel = document.querySelector("#data-panel");
const searchForm = document.querySelector("#search-form");
const searchInput = document.querySelector("#search-input");
const paginator = document.querySelector("#paginator");
const changeMode = document.querySelector("#change-mode");
const movieModal = document.querySelector("#movie-modal");

const MOVIES_PER_PAGE = 12;
let currentPage = 1;
let moviesFilter = [];

//組合data panel
function renderMovieList(movies) {
  if (dataPanel.dataset.mode === "card-mode") {
    let rawHTML = "";
    movies.forEach((movie) => {
      rawHTML += `
        <div class="col-sm-3">
          <div class="m-2">
            <div class="card">
              <img
                src="${POSTER_URL + movie.image}"
                class="card-img-top"
                alt="Movie poster"
              />
              <div class="card-body">
                <h5 class="card-title">${movie.title}</h5>
              </div>
              <div class="card-footer">
                <button
                  class="btn btn-primary btn-show-movie"
                  data-bs-toggle="modal"
                  data-bs-target="#Movie-Modal" data-id="${movie.id}"
                >
                  More
                </button>
                <button class="btn btn-info btn-add-favorite" data-id="${
                  movie.id
                }">+</button>
              </div>
            </div>
          </div>
        </div>
      `;
    });
    dataPanel.innerHTML = rawHTML;
  } else if (dataPanel.dataset.mode === "list-mode") {
    let rawHTML = '<ul class="list-group">';
    movies.forEach((movie) => {
      rawHTML += `<li class="list-group-item d-flex align-items-center m-2">
            <span class="m-0 col-10 ms-2">${movie.title}</span>
            <span class="button-group">
              <button
                class="btn btn-primary btn-show-movie btn-sm"
                data-bs-toggle="modal"
                data-bs-target="#Movie-Modal"
                data-id="${movie.id}"
              >
                More
              </button>
              <button
                class="btn btn-info btn-add-favorite btn-sm"
                data-id="${movie.id}"
              >
                +
              </button>
            </span>
          </li>`;
    });
    rawHTML += "</ul>";
    dataPanel.innerHTML = rawHTML;
  }
}

function showMovieModal(id) {
  const movieModalTitle = document.querySelector("#movie-modal-title");
  const movieModalImage = document.querySelector("#movie-modal-image");
  const movieModalDate = document.querySelector("#movie-modal-date");
  const movieModalDescription = document.querySelector(
    "#movie-modal-description"
  );
  const btnAddFavoriteModal = document.querySelector("#btn-add-favorite-modal");

  axios.get(INDEX_URL + id).then((response) => {
    const data = response.data.results;
    movieModalTitle.innerText = data.title;
    movieModalDate.innerText = "Release Date:" + data.release_date;
    movieModalDescription.innerText = data.description;
    btnAddFavoriteModal.dataset.id = `${data.id}`;
    movieModalImage.innerHTML = `<img src="${
      POSTER_URL + data.image
    }" alt="movie poster" class="img-fluid">`;
  });
}

// movieModal.addEventListener("click", function onmovieModalClicked(event) {
//   let target = event.target;
//   if (target.matches(".btn-add-favorite")) {
//     addToFavorite(Number(event.target.dataset.id));
//   }
// });

dataPanel.addEventListener("click", function onPanelClicked(event) {
  let target = event.target;
  if (target.matches(".btn-show-movie")) {
    showMovieModal(Number(target.dataset.id));
  } else if (target.matches(".btn-add-favorite")) {
    addToFavorite(Number(event.target.dataset.id));
  }
});

function addToFavorite(id) {
  const list = JSON.parse(localStorage.getItem("favoriteMovies")) || [];
  const movie = movies.find((movie) => movie.id === id);
  if (list.some((movie) => movie.id === id)) {
    return alert("此電影已經在收藏清單中！");
  }
  list.push(movie);
  localStorage.setItem("favoriteMovies", JSON.stringify(list));
}

axios
  .get(INDEX_URL)
  .then((response) => {
    movies.push(...response.data.results);
    console.log(movies);
    renderPaginator(movies.length);
    renderMovieList(getMoviesByPage(currentPage));
  })
  .catch((err) => console.log(err));

searchForm.addEventListener("submit", function onSearchFormSubmitted(event) {
  event.preventDefault();
  const keyword = searchInput.value.trim().toLowerCase();
  console.log(keyword);
  if (!keyword.length) {
    return alert("請輸入有效字串!");
  }
  moviesFilter = movies.filter((movie) =>
    movie.title.toLowerCase().includes(keyword)
  );
  console.log(moviesFilter);
  if (moviesFilter.length === 0) {
    return alert(`您輸入的關鍵字：${keyword} 沒有符合條件的電影`);
  }
  currentPage = 1;
  renderMovieList(getMoviesByPage(currentPage));
  renderPaginator(moviesFilter.length);
});

function getMoviesByPage(page) {
  const data = moviesFilter.length ? moviesFilter : movies;
  const startIndex = (page - 1) * MOVIES_PER_PAGE;
  return data.slice(startIndex, startIndex + MOVIES_PER_PAGE);
}

function renderPaginator(amount) {
  const numberOfPage = Math.ceil(amount / MOVIES_PER_PAGE);
  let rawHTML = "";
  for (let i = 1; i <= numberOfPage; i++) {
    rawHTML += `<li class="page-item">
        <a class="page-link" href="#" data-page="${i}">
          ${i}
        </a>
      </li>`;
  }
  paginator.innerHTML = rawHTML;
}

paginator.addEventListener("click", (event) => {
  let target = event.target;
  if (target.tagName !== "A") return;
  let page = Number(target.dataset.page);
  currentPage = page;
  renderMovieList(getMoviesByPage(currentPage));
});

// changeMode
function changeDataModel(changeMode) {
  if (dataPanel.dataset.mode === changeMode) {
    return;
  } else {
    dataPanel.dataset.mode = changeMode;
  }
}

changeMode.addEventListener("click", function OnchangeModeClicked(event) {
  let target = event.target;
  if (target.matches("#card-mode-button")) {
    changeDataModel("card-mode");
    renderMovieList(getMoviesByPage(currentPage));
  } else if (target.matches("#list-mode-button")) {
    changeDataModel("list-mode");
    renderMovieList(getMoviesByPage(currentPage));
  }
});