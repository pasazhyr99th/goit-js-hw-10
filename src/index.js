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
    .then(fetchManyCoutries)
    .then(countriesList)
    .then(countryInfoCard)
    .catch(onFetchError);
}

function countryInfoCard(countries) {
  if (countries.length === 1) {
    const markup = countries
      .map(({ name, capital, population, flags, languages }) => {
        return `
      <div class="country__card">
        <div>
          <img class="country__flag"
            src="${flags.svg}"
            alt="flag of ${name.official}"
            width="35"
            />
          <h2 class="country__name">${name.official}</h2>
        </div>
        <p class="country__capital">Capital:
          <span class="capital">${capital}</span>
        </p>
        <p class="country__population">Population:
          <span class="population">${population}</span>
        </p>
        <p class="country__language">Languages:
          <span class="language">${Object.values(languages)}</span>
        </p>
      </div>
      `;
      })
      .join('');
    refs.countryInfo.innerHTML = markup;
    console.log(markup);
  }
}

function countriesList(countries) {
  if (countries.length <= 10) {
    const markup = countries
      .map(({ name, flags }) => {
        return `
      <li>
        <img class="country__flag"
          src="${flags.svg}"
          alt="flag of ${name.official}"
          width="35"
          />
        <h2 class="country__name">${name.official}</h2>
      </li>
      `;
      })
      .join('');
    refs.countryList.innerHTML = markup;
  }
}

function fetchManyCoutries(countries) {
  if (countries.length > 10) {
    Notify.info('Too many matches found. Please enter a more specific name.');
  }
}

function onFetchError() {
  Notify.failure('Oops, there is no country with that name');
}
