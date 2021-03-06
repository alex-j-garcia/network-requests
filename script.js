"use strict";

(function() {
  const init = () => {
    makeRequest()
      .then((response) => response.json())
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
    if (failureRate < 5) {
      setTimeout(() => {
        callback(fetch("https://ghibliapi.herokuapp.com/films"));
      }, 10);
    }
  };

  const createDivs = (films) => {
    let container = document.querySelector(".container");
    for (let film of films) {
      let div = document.createElement("div");
      div.classList.add("film");

      let title = document.createElement("h1");
      title.textContent = film.title;

      let p = document.createElement("p");
      p.textContent = `${film.description.substring(0, 300)}...`;

      div.appendChild(title);
      div.appendChild(p);
      container.appendChild(div);
    }
  };

  const triggerModal = (reason) => {
    let container = document.querySelector(".container");
    container.style.display = "none";
    
    let modal = document.querySelector(".error-modal");
    modal.style.display = "block";

    let span = document.querySelector(".reason");
    span.textContent = reason;
  };

  init();
}());