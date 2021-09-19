import debounce from "lodash.debounce";
import { Notify } from "notiflix";
import findCountries from "./fetchCountries";

Notify.init({
  timeout: 3500,
  position: "center-bottom",
  closeButton: true,
});

const inputRef = document.querySelector('[name="country-name"]');
const countryListRef = document.querySelector(".country-list");
const countryInfoRef = document.querySelector(".country-info");

const renderInfo = (country) => {
  countryListRef.innerHTML = "";
  countryInfoRef.innerHTML = "";

  const { name, capital, population, languages, flag } = country;

  let languagesList = languages.map((el) => `<li>${el.name}</li>`).join("");

  countryInfoRef.insertAdjacentHTML(
    "afterbegin",
    `
        <div class="country-info-text">
          <h1 class="country-name">${name}</h1>
          <p class="country-capital">Capital: ${capital}</p>
          <p class="country-population">Population: ${population}</p>
          <ul class="country-languages">Languages: ${languagesList}</ul>
          <button type="button" class="more-btn" data-name="${name}">More</button>
        </div>
        <div class="country-info-img">
          <img src="${flag}" alt="Flag of ${name}" class="country-flag">
        </div>
        `,
  );

  inputRef.value = "";
};

const renderMore = (country) => {
  const {
    currencies,
    borders,
    area,
    numericCode,
    region,
    subregion,
    topLevelDomain,
  } = country;

  const currenciesList = currencies.map((el) => `${el.code}`).join(", ");
  const bordersList = borders.join(", ");
  const topLevelDomainsList = topLevelDomain.join(", ");

  document.querySelector(".country-info-text").insertAdjacentHTML(
    "beforeend",
    `
    <div class="county-more">
      <p class="country-region">Region: ${region}</p>
      <p class="country-subregion">Subregion: ${subregion}</p>
      <p class="country-area">Area: ${area}</p>
      <p class="country-numericCode">Numeric Code: ${numericCode}</p>
      <p class="country-borders">Borders: ${bordersList}</p>
      <p class="country-currencies">Currencies: ${currenciesList}</p>
      <p class="country-topLevelDomain">Top Level Domain: ${topLevelDomainsList}</p>
    </div>
  `,
  );
};

const renderList = (countriesArr) => {
  countryListRef.innerHTML = "";
  countryInfoRef.innerHTML = "";

  const countriesSearchList = countriesArr
    .map(
      (el) =>
        `<li class='country'><img src='${el.flag}' alt='Flag of ${el.name}'>${el.name}</li>`,
    )
    .join("");

  countryListRef.insertAdjacentHTML("beforeend", countriesSearchList);
};

const renderCountries = (searchQuery) => {
  findCountries(searchQuery)
    .then((result) => {
      if (result.length > 10) {
        throw new Error(
          `Too many matches found (${result.length} results). Please enter a more specific query!`,
        );
      } else if (result.length === 1) {
        renderInfo(result[0]);
      } else if (result.length < 10) {
        renderList(result);
      }
    })
    .catch((err) => {
      Notify.warning(err.message);
    });
};

inputRef.addEventListener(
  "input",
  debounce((e) => {
    if (e.target.value.length > 0) {
      renderCountries(e.target.value);
    }
  }, 500),
);

countryListRef.addEventListener("click", (e) => {
  inputRef.value = e.target.textContent;
  renderCountries(inputRef.value);
});

countryInfoRef.addEventListener("click", (e) => {
  if (e.target.nodeName !== "BUTTON") {
    return;
  }
  findCountries(e.target.dataset.name).then((data) => renderMore(data[0]));
  e.target.disabled = true;
});
