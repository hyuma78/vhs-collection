// Carica il JSON
fetch('data/vhs.json')
  .then(res => res.json())
  .then(data => {

    // Ordine alfabetico
    data.sort((a, b) => a.titolo.localeCompare(b.titolo));

    const grid = document.getElementById("grid");

    data.forEach(item => {
      const card = creaCard(item);

      // CLIC sulla VHS → apre scheda info
      card.addEventListener("click", () => apriScheda(item));

      grid.appendChild(card);
    });
  });


// === GENERA CARD ===
function creaCard(item) {
  const div = document.createElement('div');
  div.className = "card";

  div.innerHTML = `
      <div class="inner">
          <div class="front">
              <img src="${item.poster}" alt="${item.titolo}">
          </div>
          <div class="back">
              <img src="${item.front}" alt="${item.titolo}">
          </div>
      </div>
  `;
  return div;
}


// === ELEMENTI SCHEDA ===
const infoBox    = document.getElementById("infoBox");
const infoTitle  = document.getElementById("infoTitle");
const infoAnno   = document.getElementById("infoAnno");
const infoTrama  = document.getElementById("infoTrama");
const infoImage  = document.getElementById("infoImage");

const btnFront   = document.getElementById("btnFront");
const btnBack    = document.getElementById("btnBack");
const closeInfo  = document.getElementById("closeInfo");


// === APRI SCHEDA ===
function apriScheda(item) {

  infoTitle.textContent = item.titolo;
  infoAnno.textContent  = "Anno: " + item.anno;
  infoTrama.textContent = item.trama || "Nessuna trama disponibile";

  // Immagine iniziale
  infoImage.src = item.front;

  // Pulsanti
  btnFront.onclick = () => { infoImage.src = item.front; };
  btnBack.onclick  = () => { infoImage.src = item.back;  };

  infoBox.classList.remove("hidden");
}


// === CHIUDI SCHEDA ===
closeInfo.addEventListener("click", () => {
  infoBox.classList.add("hidden");
});
