// Carica il file JSON con la lista VHS
fetch('data/vhs.json')
  .then(res => res.json())
  .then(data => {

    // ORDINA ALFABETICAMENTE PER TITOLO
    data.sort((a, b) => a.titolo.localeCompare(b.titolo));

    const grid = document.getElementById("grid");

    // GENERA LA GRIGLIA
    data.forEach(item => {
      const card = creaCard(item);
      grid.appendChild(card);
    });
  })
  .catch(err => {
    console.error("Errore nel caricamento di vhs.json:", err);
  });


// CREA UNA CARD SINGOLA
function creaCard(item) {

  // Div principale della card
  const div = document.createElement('div');
  div.className = "card";

  // HTML della card (poster → front VHS)
  div.innerHTML = `
      <div class="inner">
          <div class="front">
              <img src="${item.poster}" alt="${item.titolo} - Poster">
          </div>
          <div class="back">
              <img src="${item.front}" alt="${item.titolo} - VHS Front">
          </div>
      </div>
  `;

  return div;
}
