fetch('data/vhs.json')
  .then(res => res.json())
  .then(data => {
    const grid = document.getElementById("grid");

    // volendo, puoi ordinare per titolo:
    // data.sort((a, b) => a.titolo.localeCompare(b.titolo));

    data.forEach(item => {
      const card = creaCard(item);
      grid.appendChild(card);
    });
  })
  .catch(err => {
    console.error("Errore nel caricamento di vhs.json:", err);
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
