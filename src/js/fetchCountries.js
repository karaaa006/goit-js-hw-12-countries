var debounce = require("lodash.debounce");
import { alert, notice, info, success, error } from "@pnotify/core";
import "@pnotify/core/dist/BrightTheme.css";

const inputRef = document.querySelector('[name="country-name"]');
const countryesWrapRef = document.querySelector(".countryes-wrap");
const countryListRef = document.querySelector(".country-list");
const countryInfoRef = document.querySelector(".country-info");

export default function fetchCountries(searchQuery) {
  const baseUrl = "https://restcountries.eu/rest/v2";
  let queryUrl = `/name/${searchQuery}`;
  let url = baseUrl + queryUrl;

  fetch(url)
    .then((result) => {
      return result.json();
    })
    .then((result) => {
      console.log(result);
      if (result.length > 10) {
        error({
          text: "I'm an error message.",
        });
        return;
      } else if (result.length === 1) {
        return result[0];
      }
      result.map((el) => {
        countryListRef.insertAdjacentHTML(
          "beforeend",
          `<li class='country'>${el.name}</li>`,
        );
      });
    })
    .then((result) => {
      const { name, capital, population, languages, flag } = result;
      console.log(languages);
      let languagesList = "";
      languages.forEach((el) => {
        languagesList += `<li>${el.name}</li>`;
      });
      countryInfoRef.insertAdjacentHTML(
        "afterbegin",
        `<h1 class="country-name">${name}</h1>
      <p class="country-capital">Capital: ${capital}</p>
      <p class="country-population">Population: ${population}</p>
      <ul class="country-languages">Languages: ${languagesList}</ul>
      <img src="${flag}" alt="Flag of ${name} class="country-flag">
        `,
      );
    })
    .catch((err) => {
      console.log(err);
    });
}

inputRef.addEventListener(
  "input",
  debounce((e) => {
    countryListRef.innerHTML = "";
    countryInfoRef.innerHTML = "";
    if (e.target.value.length > 0) {
      fetchCountries(e.target.value);
    }
  }, 500),
);
