# Architektura Projektu - Service Manager

## Stos Technologiczny

Projekt jest zbudowany przy użyciu nowoczesnych narzędzi frontendowych:

- **React 19**: Biblioteka UI.
- **TypeScript**: Typowanie statyczne dla zapewnienia jakości kodu.
- **Vite**: Szybkie narzędzie do budowania i serwer deweloperski.
- **Tailwind CSS v4 / PostCSS**: Framework CSS do szybkiego stylowania.
- **Framer Motion**: Biblioteka do zaawansowanych animacji i przejść.
- **Zustand**: Lekkie zarządzanie stanem (używane głównie dla stanu UI).
- **Dexie.js**: Wrapper dla IndexedDB, służący jako lokalna baza danych.
- **Lucide React**: Ikony.

## Struktura Katalogów

```text
src/
├── components/   # Współdzielone komponenty UI (shadcn, custom)
├── layouts/      # Główne układy stron (MobileLayout, TopNavigation)
├── lib/          # Logika biznesowa i konfiguracja
│   ├── config/   # Konfiguracja aplikacji
│   ├── db/       # Schemat i inicjalizacja bazy danych (Dexie)
│   ├── hooks/    # Customowe hooki do zarządzania danymi
│   ├── pdf/      # Logika generowania plików PDF
│   ├── stores/   # Store'y Zustand (np. uiStore)
│   └── utils/    # Funkcje pomocnicze i formatery
├── pages/        # Komponenty stron (Dashboard, Clients, etc.)
├── styles/       # Arkusze stylów CSS
├── types/        # Definicje typów TypeScript
├── App.tsx       # Główny komponent aplikacji i routing
└── main.tsx      # Punkt wejścia aplikacji
```

## Warstwa Danych (Offline-First)

Aplikacja opiera się na architekturze **Offline-First**. Wszystkie dane użytkownika są przechowywane lokalnie w przeglądarce za pomocą **IndexedDB** (zarządzanego przez Dexie.js).

- **Schemat bazy**: Zdefiniowany w `src/lib/db/schema.ts`.
- **Synchronizacja**: Dane są dostępne natychmiastowo bez konieczności połączenia z serwerem.
- **Eksport/Import**: Funkcjonalność backupu pozwala na pobranie i przywrócenie bazy danych w formacie JSON.

## Zarządzanie Stanem

- **Dane domenowe**: Zarządzane przez hooki Dexie (reaktywne zapytania do bazy).
- **Globalny stan UI**: Przechowywany w Zustand (np. aktualna strona, filtry, powiadomienia toast).

## Generowanie PDF

Do generowania dokumentów (kosztorysy, raporty) wykorzystywane są biblioteki `jsPDF` oraz `jspdf-autotable`. Stylistyka generowanych PDF-ów jest spójna z identyfikacją wizualną aplikacji.
