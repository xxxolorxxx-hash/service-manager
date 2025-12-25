# Manager Usług

Profesjonalna PWA do zarządzania biznesem dla usługodawców (remonty, naprawy, instalacje).

## 🚀 Funkcjonalności

- **Pulpit** - Podsumowanie finansowe, aktywne zlecenia, ostatnia aktywność
- **Klienci** - Baza kontrahentów z szybkim kontaktem (telefon, SMS, email)
- **Zlecenia** - Zarządzanie zleceniami, statusy, przypisywanie do klientów
- **Kosztorysy** - Tworzenie wycen z dynamicznymi pozycjami, generowanie PDF
- **Raporty** - Wykresy przychodów, eksport do CSV
- **Ustawienia** - Dane firmy, backup/restore danych

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **State Management**: Zustand
- **Storage**: Dexie.js (IndexedDB)
- **Routing**: React Router Dom
- **Charts**: Recharts
- **PDF Generation**: jsPDF + jspdf-autotable
- **Forms**: React Hook Form + Zod

## 📦 Instalacja

```bash
cd service-manager
npm install
npm run dev
```

## 🏃️ Budowa dla produkcji

```bash
npm run build
```

## 📱 Dane

Aplikacja przechowuje wszystkie dane lokalnie w IndexedDB, więc nie wymaga backendu.

Dane są bezpieczne i pozostają na urządzeniu użytkownika.

## 📱 Dane testowe

1. Kliknij "Ustawienia"
2. Wybierz "Wygeneruj dane testowe"
3. Sprawdź wszystkie moduły aplikacji

## 🎨 UI/UX

- **Mobile-first** design z dolną nawigacją
- **Responsywny** layout (desktop i mobile)
- **PWA** z możliwością instalacji na ekran główny
- **Offline-first** - działa bez połączenia z internetem

## 📱 Zrzuty ekranów

```bash
# Mobile
320x568px

# Tablet
768x1024px

# Desktop
1024x768px
```

## 🔧 Narzędzia deweloperskie

```bash
# Instalacja
npm install

# Uruchomienie development
npm run dev

# Budowa
npm run build

# Typowanie
npm run type-check

# Linting
npm run lint
```

## 📄 Dane API

- Klienci: CRUD (Create, Read, Update, Delete)
- Zlecenia: CRUD + filtry (po statusie)
- Kosztorysy: CRUD + generowanie PDF
- Raporty: Wizualizacja danych, eksport CSV
- Ustawienia: Konfiguracja aplikacji, backup/restore

## 🚀 Tryb PWA

- Instalacja na ekran główny
- Offline mode
- Push notifications (przygotowane)

## 📝 Licencja

Projekt jest open-source.

## 🤝 Wsparcie

Jeśli znajdziesz błąd lub masz sugestię, zgło issue na GitHub.
