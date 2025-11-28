// Carica il JSON
fetch('data/vhs.json')
  .then(res => res.json())
  .then(data => {
    // Ordine alfabetico
    data.sort((a, b) => a.titolo.localeCompare(b.titolo));
    
    const grid = document.getElementById("grid");
    
    data.forEach(item => {
      const card = document.createElement('div');
      card.className = "card";
      card.onclick = () => apriScheda(item);
      
      card.innerHTML = `
        <div class="card-image">
          <img src="${item.poster}" alt="${item.titolo}">
        </div>
      `;
      
      grid.appendChild(card);
    });
  })
  .catch(err => console.error("Errore nel caricamento di vhs.json:", err));


// Elementi modal
const modalOverlay = document.getElementById("modalOverlay");
const mainImage = document.getElementById("mainImage");
const infoTitle = document.getElementById("infoTitle");
const infoAnno = document.getElementById("infoAnno");
const infoTrama = document.getElementById("infoTrama");
const closeInfo = document.getElementById("closeInfo");
const thumbnailsContainer = document.getElementById("thumbnailsContainer");

let currentImages = [];

// Apri scheda film
function apriScheda(item) {
    infoTitle.textContent = item.titolo;
    infoAnno.textContent = item.anno;
    infoTrama.textContent = item.trama || "Nessuna trama disponibile";
    
    // Prepara array immagini disponibili
    currentImages = [
        { src: item.poster, label: "Poster" },
        { src: item.front, label: "Fronte VHS" },
        { src: item.back, label: "Retro VHS" }
    ];
    
    // Mostra prima immagine (poster)
    mainImage.src = currentImages[0].src;
    
    // Crea thumbnails
    thumbnailsContainer.innerHTML = '';
    currentImages.forEach((img, index) => {
        const thumbWrapper = document.createElement('div');
        thumbWrapper.style.textAlign = 'center';
        
        const thumb = document.createElement('div');
        thumb.className = 'vhs-thumb' + (index === 0 ? ' active' : '');
        thumb.onclick = () => cambiaImmagine(index);
        thumb.innerHTML = `<img src="${img.src}" alt="${img.label}">`;
        
        const label = document.createElement('div');
        label.className = 'vhs-thumb-label';
        label.textContent = img.label;
        
        thumbWrapper.appendChild(thumb);
        thumbWrapper.appendChild(label);
        thumbnailsContainer.appendChild(thumbWrapper);
    });
    
    modalOverlay.classList.remove("hidden");
    document.body.style.overflow = 'hidden';
}

// Cambia immagine principale
function cambiaImmagine(index) {
    mainImage.style.opacity = '0';
    setTimeout(() => {
        mainImage.src = currentImages[index].src;
        mainImage.style.opacity = '1';
    }, 150);
    
    // Aggiorna thumbnails attive
    document.querySelectorAll('.vhs-thumb').forEach((thumb, i) => {
        thumb.classList.toggle('active', i === index);
    });
}

// Chiudi modal
closeInfo.addEventListener("click", chiudiModal);
modalOverlay.addEventListener("click", (e) => {
    if (e.target === modalOverlay) chiudiModal();
});

function chiudiModal() {
    modalOverlay.classList.add("hidden");
    document.body.style.overflow = '';
}

// Chiudi con ESC
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modalOverlay.classList.contains('hidden')) {
        chiudiModal();
    }
});