import json
import os
import requests

JSON_FILE = r"C:\Users\Hyuma\Documents\vhs-collection\data\vhs.json"
COVERS_DIR = "covers"
OMDB_KEY = "f3fb389"

def load_db():
    if os.path.exists(JSON_FILE):
        with open(JSON_FILE, "r", encoding="utf-8") as f:
            try:
                return json.load(f)
            except json.JSONDecodeError:
                print("⚠️ Il JSON è danneggiato, riparto da lista vuota.")
                return []
    return []

def save_db(data):
    os.makedirs(os.path.dirname(JSON_FILE), exist_ok=True)
    with open(JSON_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=4, ensure_ascii=False)

def fix_cover_path(filename: str) -> str:
    filename = filename.strip()
    if not filename:
        return ""
    if filename.startswith(COVERS_DIR + "/"):
        return filename
    return f"{COVERS_DIR}/{filename}"

def exists(db, titolo):
    titolo_lower = titolo.strip().lower()
    return any(item.get("titolo", "").strip().lower() == titolo_lower for item in db)

def search_movie(title):
    url = f"https://www.omdbapi.com/?apikey={OMDB_KEY}&t={title}"
    try:
        res = requests.get(url).json()
        if res.get("Response") == "True":
            return res.get("Title"), res.get("Year")
        return None, None
    except:
        return None, None

def main():
    print("=== Aggiungi VHS ===")

    titolo = input("Titolo: ").strip()

    db = load_db()
    if exists(db, titolo):
        print(f"\n⚠️ La VHS '{titolo}' esiste già! Nessuna modifica fatta.")
        return

    print("\n🔎 Cerco informazioni sul film...")
    imdb_title, imdb_year = search_movie(titolo)

    if imdb_title:
        print(f"\nTrovato: {imdb_title} ({imdb_year})")
        conferma = input("Confermi? (s/n): ").strip().lower()
        if conferma == "s":
            titolo = imdb_title
            anno = int(imdb_year)
        else:
            anno_raw = input("Anno (manuale): ").strip()
            anno = int(anno_raw) if anno_raw.isdigit() else None
    else:
        print("⚠️ Non trovato su IMDB/OMDb.")
        anno_raw = input("Anno (manuale): ").strip()
        anno = int(anno_raw) if anno_raw.isdigit() else None

    stato = input("Stato (Ottima, Buona, etc.): ").strip()

    print("\n--- Immagini ---")
    print("Scrivi solo il nome file, tipo: Predator.2.front.jpg")

    front = fix_cover_path(input("Front: ").strip())
    back = fix_cover_path(input("Back: ").strip())

    nuova = {
        "titolo": titolo,
        "anno": anno,
        "stato": stato,
        "front": front or None,
        "back": back or None
    }

    db.append(nuova)
    save_db(db)

    print("\n✅ VHS aggiunta con successo!")
    print(f"Totale VHS ora: {len(db)}")

if __name__ == "__main__":
    main()
