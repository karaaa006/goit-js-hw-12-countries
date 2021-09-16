import debounce from "lodash.debounce";
import { error, defaults } from "@pnotify/core";
// import "@pnotify/core/dist/BrightTheme.css";
import findCountries from "./fetchCountries";

const inputRef = document.querySelector('[name="country-name"]');
const countryListRef = document.querySelector(".country-list");
const countryInfoRef = document.querySelector(".country-info");

const renderCountries = (searchQuery) => {
  countryListRef.innerHTML = "";
  countryInfoRef.innerHTML = "";

  findCountries(searchQuery)
    .then((result) => {
      if (result.length > 10) {
        throw new Error(
          `Too many matches found (${result.length} results). Please enter a more specific query!`,
        );
      } else if (result.length === 1) {
        const { name, capital, population, languages, flag } = result[0];

        let languagesList = languages
          .map((el) => `<li>${el.name}</li>`)
          .join("");

        countryInfoRef.insertAdjacentHTML(
          "afterbegin",
          `
        <div class="country-info-text">
          <h1 class="country-name">${name}</h1>
          <p class="country-capital">Capital: ${capital}</p>
          <p class="country-population">Population: ${population}</p>
          <ul class="country-languages">Languages: ${languagesList}</ul>
        </div>
        <div class="country-info-img">
          <img src="${flag}" alt="Flag of ${name}" class="country-flag">
        </div>
        `,
        );
      } else if (result.length < 10) {
        const countriesSearchList = result
          .map((el) => `<li class='country'>${el.name}</li>`)
          .join("");

        countryListRef.insertAdjacentHTML("beforeend", countriesSearchList);
      }
    })
    .catch((err) => {
      error({
        title: "Oh No!",
        text: err,
        delay: 3500,
        styling: "custom",
        sticker: false,
        closer: false,
        // icon: "far fa-file-image fa-3x",
      });
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
