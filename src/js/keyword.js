import axios from 'axios';
import { Notify } from 'notiflix';

const apiKey = 'd7be37f171d8123214539749ff0838e8';
const baseUrl = 'https://api.themoviedb.org/3';
const imgUrl = 'https://image.tmdb.org/t/p/w500';
const form = document.querySelector('.form');
const main = document.querySelector('#main');
const inputEl = document.querySelector('.form-input');
const loadMore = document.querySelector('.load-more');
const pagination = document.querySelector('.pagination');

const genres = [
  { id: 28, name: 'Action' },
  { id: 12, name: 'Adventure' },
  { id: 16, name: 'Animation' },
  { id: 35, name: 'Comedy' },
  { id: 80, name: 'Crime' },
  { id: 99, name: 'Documentary' },
  { id: 18, name: 'Drama' },
  { id: 10751, name: 'Family' },
  { id: 14, name: 'Fantasy' },
  { id: 36, name: 'History' },
  { id: 27, name: 'Horror' },
  { id: 10402, name: 'Music' },
  { id: 9648, name: 'Mystery' },
  { id: 10749, name: 'Romance' },
  { id: 878, name: 'Science Fiction' },
  { id: 10770, name: 'TV Movie' },
  { id: 53, name: 'Thriller' },
  { id: 10752, name: 'War' },
  { id: 37, name: 'Western' },
];

let searchQueryValue;
let page;
form.addEventListener('submit', onSearch);

function onSearch(e) {
  e.preventDefault();
  searchQueryValue = e.currentTarget.elements.searchQuery.value.trim();
  page = 1;
  renderContainer(searchQueryValue, page);
  loadMore.classList.remove('is-hidden');
  pagination.classList.add('is-hidden');
}

loadMore.addEventListener('click', onloadMore);

function onloadMore() {
  page += 1;
  main.scrollIntoView({ behavior: 'smooth' });
  renderContainer(searchQueryValue, page);
}

async function searchFormApi(text, page) {
  const response = await axios.get(
    `${baseUrl}/search/movie?api_key=${apiKey}&query=${text}&page=${page}`
  );
  if (response.message === 422) {
    throw new Error();
  }
  return response.data;
}

function createList(acc, cardFilm) {
  let genreArrayOfObj = genres.filter(function (g) {
    return cardFilm.genre_ids.indexOf(g.id) !== -1;
  });

  const genreNames = genreArrayOfObj.map(a => a.name);
  return (
    acc +
    `<div class="movie" data-id="${cardFilm.id}">
    <div class="wrapper-img">
    ${
      cardFilm.poster_path
        ? `<img src='${imgUrl + cardFilm.poster_path}' alt='${
            cardFilm.title
          }' data-id="${cardFilm.id}" >`
        : `<img src="${require('/src/images/default-poster-webp.webp')}" alt="${
            cardFilm.title
          }" data-id="${cardFilm.id}">`
    }
    </div>
        <div class="movie-info">
          <h3 class="title__info">${cardFilm.title}</h3>
            <div class="overview">
            ${
              genreNames.slice(0, 2).join(', ')
                ? `<p class="info__genres-and-year">${genreNames
                    .slice(0, 2)
                    .join(', ')} ${
                    genreNames.length > 2 ? ', Other' : ' '
                  } | ${cardFilm.release_date.slice(0, 4)} </p>`
                : `<p class="info__genres-and-year"> N/A | ${cardFilm.release_date.slice(
                    0,
                    4
                  )} </p>`
            }
            <span class="vote_average">${cardFilm.vote_average}</span> 
            </div>
        </div>
        </div>`
  );
}

function generateContentList(array) {
  return array.reduce(createList, '');
}

async function renderContainer(value, page) {
  try {
    const { results, total_pages, total_results } = await searchFormApi(
      value,
      page
    );
    if (total_pages === 0 && total_results === 0) {
      Notify.failure(
        'Search result not successful. Enter the correct movie name and'
      );
    }
    if (total_pages >= 1) {
      main.innerHTML = '';
      main.insertAdjacentHTML('beforeend', generateContentList(results));
    }
  } catch (error) {
    Notify.failure(
      'Search result not successful. Enter the correct movie name and'
    );
  }
}
