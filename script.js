"use strict";

(function() {
  const init = () => {
    makeRequest()
      .then((response) => response.json())
      .then((body) => limitFields(body))
      .then((payload) => {
        createDivs(payload);
      })
      .catch((reason) => {
        triggerModal(reason);
      });
  };

  const makeRequest = () => {
    return new Promise((resolve, reject) => {
      let done = false;
      function attempt(n) {
        networkRequest((value) => {
          done = true;
          resolve(value);
        });
        setTimeout(() => {
          if (done) return;
          else if (n < 3) attempt(n + 1);
          else reject("Network error");
        }, 0);
      }

      attempt(1);
    });
  };

  const networkRequest = (callback) => {
    let failureRate = Math.floor(Math.random() * 10);
    if (failureRate < 4) {
      setTimeout(() => {
        callback(fetch("https://ghibliapi.herokuapp.com/films"));
      }, 10);
    }
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

  const triggerModal = (reason) => {
    let modal = document.querySelector(".error-modal");
    let span = document.querySelector(".reason");
    modal.style.display = "block";
    span.textContent = reason;
  };

  init();
}());