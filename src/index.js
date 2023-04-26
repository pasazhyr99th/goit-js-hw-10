import './css/styles.css';
import { fetchCountries } from './fetchCountries';
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

  if (searchCountry) {
    fetchCountries(searchCountry)
      .then(country => {
        if (country.length === 1) {
          // country[0].languages = Object.values(country[0].languages).join(', ');

          countryInfoCard(country);
          refs.countryList.innerHTML = '';
        }
        if (country.length <= 10 && country.length > 1) {
          countriesList(country);
          refs.countryInfo.innerHTML = '';
        }
        if (country.length > 10) {
          fetchManyCoutries(country);
          clearHTML();
        }
      })
      .catch(error => {
        if (error.message === '404' && searchCountry) {
          Notify.failure('Oops, there is no country with that name');
          clearHTML();
        }
      });
  }
  clearHTML();
}

function countryInfoCard(countries) {
  const markup = countries
    .map(({ name, capital, population, flags, languages }) => {
      return `
      <div class="country__card">
        <div class="country__main">
          <img class="country__flag"
            src="${flags.svg}"
            alt="flag of ${name.official}"
            width="50"
            height="30"
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
          <span class="language"> ${Object.values(languages)}</span>
        </p>
      </div>
      `;
    })
    .join('');
  refs.countryInfo.innerHTML = markup;
}

function countriesList(countries) {
  const markup = countries
    .map(({ name, flags }) => {
      return `
      <li class="country__item">
        <img class="country__flag--list"
          src="${flags.svg}"
          alt="flag of ${name.official}"
          width="50"
          height="30"
          />
        <p class="country__name--list">${name.official}</p>
      </li>
      `;
    })
    .join('');
  refs.countryList.innerHTML = markup;
}

function fetchManyCoutries() {
  Notify.info('Too many matches found. Please enter a more specific name.');
}

function clearHTML() {
  refs.countryInfo.innerHTML = '';
  refs.countryList.innerHTML = '';
}