"use strict";

(function() {
  const init = () => {
    networkRequest()
      .then((response) => response.json())
      .then((body) => limitFields(body))
      .then((payload) => {
        createDivs(payload);
      });
  };

  /*
   * Networks can sometimes fail. Create a function that
   * returns a promise that can fail sometimes.
   */
  const networkRequest = () => {
    let randInt = Math.floor(Math.random() * 10);
    return new Promise((fulfill, reject) => {
      if (randInt < 1) {
        reject("Network Error");
      }

      let response = fetch("https://ghibliapi.herokuapp.com/films?limit=9");
      fulfill(response);
    });
  };

  const limitFields = (payload) => (
    payload.map(({ id, title, description, movie_banner, }) => (
      { id, title, description, movie_banner, }
    ))
  );

  const createDivs = (films) => {
    let container = document.querySelector(".container");
    for (let film of films) {
      let div = document.createElement("DIV");
      div.classList.add("film");
      div.setAttribute("id", film.id);
      div.innerHTML = `
        <img
          src="${film.movie_banner}"
          alt="Movie banner for ${film.title}"
        >
        <div class="content">
          <h1>${film.title}</h1>
          <p>${film.description}</p>
        </div>
      `;
      container.appendChild(div);
    }
  };

  init();
}());