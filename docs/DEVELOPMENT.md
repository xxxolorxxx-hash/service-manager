# Przewodnik Dewelopera - Service Manager

## Przygotowanie Środowiska

### Wymagania

- Node.js (zalecana wersja 18+)
- npm lub yarn

### Instalacja

1. Sklonuj repozytorium.
2. Zainstaluj zależności:

   ```bash
   npm install
   ```

## Dostępne Skrypty

- `npm run dev`: Uruchamia serwer deweloperski Vite.
- `npm run build`: Buduje aplikację do produkcji (output w folderze `dist`).
- `npm run lint`: Uruchamia ESLint w celu sprawdzenia jakości kodu.
- `npm run preview`: Uruchamia podgląd wersji produkcyjnej.

## Praca z Bazą Danych (Dexie.js)

Aby dodać nową tabelę w bazie danych:

1. Edytuj plik `src/lib/db/schema.ts`.
2. Zaktualizuj wersję bazy danych (`this.version(X)`).
3. Zaktualizuj definicję typów w `src/types/index.ts`.

## Konwencje Kodowania

- **Komponenty**: Funkcyjne z użyciem React Hooków.
- **Stylowanie**: Tailwind CSS. Staramy się używać zmiennych CSS zdefiniowanych w `index.css`.
- **Typowanie**: Każdy nowy komponent i funkcja powinny posiadać odpowiednie typy TypeScript.
- **Hooki**: Logika pobierania danych powinna być zamknięta w customowych hookach w folderze `src/lib/hooks/`.

## Deployment

Aplikacja jest statyczna i może być wdrożona na dowolny hosting (Vercel, Netlify, GitHub Pages, Firebase Hosting). Jako aplikacja PWA, po zbudowaniu wymaga serwowania przez HTTPS.
