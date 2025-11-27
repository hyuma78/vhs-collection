fetch('data/vhs.json')
  .then(res => res.json())
  .then(data => {
    
    // Ordina le VHS più recenti in alto (per slider)
    const recenti = [...data].reverse().slice(0, 10);

    // Sezioni del DOM
    const slider = document.getElementById("slider");
    const grid = document.getElementById("grid");

    // --- Aggiunti di Recente (slider) ---
    recenti.forEach(item => {
      const card = creaCard(item);
      slider.appendChild(card);
    });

    // --- Griglia Completa ---
    data.forEach(item => {
      const card = creaCard(item);
      grid.appendChild(card);
    });

  });

function creaCard(item) {
  const div = document.createElement('div');
  div.className = "card";
  div.innerHTML = `
      <div class="inner">
          <div class="front">
              <img src="${item.front}" alt="${item.titolo}">
          </div>
          <div class="back">
              <img src="${item.back}" alt="${item.titolo}">
          </div>
      </div>
  `;
  return div;
}
