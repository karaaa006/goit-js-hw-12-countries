export default function (searchQuery) {
  const baseUrl = "https://restcountries.eu/rest/v2";
  let queryUrl = `/name/${searchQuery}`;
  let url = baseUrl + queryUrl;

  return fetch(url).then((response) => {
    if (response.status === 200) {
      return response.json();
    }
    throw new Error("404 - Not found!");
  });
}
