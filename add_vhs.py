import json
import os
import requests

# === CONFIGURAZIONE ===

# Percorso del file JSON della tua collezione
JSON_FILE = r"C:\Users\Hyuma\Documents\vhs-collection\data\vhs.json"

# Cartella dove tieni le cover
COVERS_DIR = "covers"

# API key di TheMovieDB
TMDB_KEY = "3ef4c81172898087e7de2ac172c7c279"

# =======================


# Carica database
def load_db():
    if os.path.exists(JSON_FILE):
        with open(JSON_FILE, "r", encoding="utf-8") as f:
            try:
                return json.load(f)
            except:
                print("⚠️ JSON danneggiato, ricreo lista vuota.")
                return []
    return []


# Salva database
def save_db(data):
    os.makedirs(os.path.dirname(JSON_FILE), exist_ok=True)
    with open(JSON_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=4, ensure_ascii=False)


# Verifica se il film è già presente
def exists(db, titolo):
    titolo = titolo.strip().lower()
    return any(item.get("titolo", "").strip().lower() == titolo for item in db)


# Sistemazione percorso cover
def fix_cover_path(f):
    f = f.strip()
    if not f:
        return None
    if f.startswith(COVERS_DIR + "/"):
        return f
    return f"{COVERS_DIR}/{f}"


# ============================
#   RICERCA INTELLIGENTE TMDb
# ============================

def tmdb_search(query):
    """
    Ritorna una lista di film SIMILI al testo inserito.
    Funziona con parole parziali, italiano, errori minimi.
    """
    url = "https://api.themoviedb.org/3/search/movie"
    params = {
        "api_key": TMDB_KEY,
        "query": query,
        "language": "it-IT"  # così ti dà titoli italiani se disponibili
    }

    r = requests.get(url, params=params).json()
    
    if "results" not in r:
        return []

    risultati = r["results"]

    # ordino per popolarità (i film giusti vengono prima)
    risultati = sorted(risultati, key=lambda x: x.get("popularity", 0), reverse=True)

    # Limito a 10 risultati per ordine mentale
    return risultati[:10]


# ============
#    MAIN
# ============

def main():
    print("=== Aggiungi VHS ===")

    titolo_input = input("Titolo (anche parziale): ").strip()

    db = load_db()
    if exists(db, titolo_input):
        print(f"\n⚠️ '{titolo_input}' è già presente. Nessuna aggiunta.")
        return

    print("\n🔎 Cerco il film su TMDb...")
    risultati = tmdb_search(titolo_input)

    # Nessun risultato
    if not risultati:
        print("⚠️ Nessun risultato trovato. Inserisci l'anno manualmente.")
        anno_raw = input("Anno: ").strip()
        anno = int(anno_raw) if anno_raw.isdigit() else None
        titolo = titolo_input

    # Un solo risultato — conferma rapida
    elif len(risultati) == 1:
        film = risultati[0]
        titolo = film["title"]
        anno = int(film["release_date"].split("-")[0]) if film.get("release_date") else None

        print(f"\nTrovato: {titolo} ({anno})")
        conferma = input("Confermi? (s/n): ").strip().lower()
        if conferma != "s":
            titolo = titolo_input
            anno_raw = input("Anno manuale: ").strip()
            anno = int(anno_raw) if anno_raw.isdigit() else None

    # Più risultati — fai scegliere
    else:
        print("\n📚 Risultati trovati:\n")
        for i, film in enumerate(risultati):
            anno_film = film["release_date"][:4] if film.get("release_date") else "----"
            print(f"{i+1}) {film['title']} ({anno_film})")

        scelta = input("\nQuale numero è corretto? ").strip()

        if scelta.isdigit() and 1 <= int(scelta) <= len(risultati):
            film = risultati[int(scelta)-1]
            titolo = film["title"]
            anno = int(film["release_date"].split("-")[0]) if film.get("release_date") else None
        else:
            print("Scelta non valida. Inserisci anno manualmente.")
            titolo = titolo_input
            anno_raw = input("Anno: ").strip()
            anno = int(anno_raw) if anno_raw.isdigit() else None

    # Stato fisico
    stato = input("Stato (Ottima, Buona, etc.): ").strip()

    # Cover
    print("\n--- Immagini ---")
    print("Scrivi solo il nome file, es: Predator.2.front.jpg")
    front = fix_cover_path(input("Front: ").strip())
    back  = fix_cover_path(input("Back: ").strip())

    # Nuova VHS
    nuova = {
        "titolo": titolo,
        "anno": anno,
        "stato": stato,
        "front": front,
        "back": back
    }

    db.append(nuova)
    save_db(db)

    print("\n✅ Aggiunta completata!")
    print(f"Totale VHS: {len(db)}")


if __name__ == "__main__":
    main()
