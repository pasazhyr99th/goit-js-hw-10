import './css/styles.css';
import API from './fetchCountries';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import debounce from 'lodash.debounce';

const DEBOUNCE_DELAY = 300;

const refs = {
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
  input: document.querySelector('#search-box'),
};

refs.input.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));

function onSearch(e) {
  e.preventDefault();

  const searchCountry = refs.input.value.trim();

    API.fetchCountries(searchCountry)
        // .then(countryInfoCard)
        .then()
        .catch(onFetchError);
  // .finally(() => searchCountry.reset());
}

function countryInfoCard(name) {
  const markup = name
    .map(({ name, capital, population, flags, languages }) => {
      return `
      <div class="country__card">
        <div>
          <img class="country__flag"
            src="${flags.svg}"
            alt="flag of ${name.official}"
            width="25"
            />
          <h2 class="country__name">${name.official}</h2>
        </div>
        <p class="country__capital">Столиця:
          <span class="capital">${capital}</span>
        </p>
        <p class="country__population">Населення:
          <span class="population">${population}</span>
        </p>
        <p class="country__language">Мова:
          <span class="language">${Object.values(languages)}</span>
        </p>
      </div>
    `;
    })
    .join('');
  refs.countryInfo.innerHTML = markup;
  console.log(markup);
}

function onFetchError() {
  Notify.failure('Oops, there is no country with that name');
}

// function manyCountries() {
//     if()
// }
