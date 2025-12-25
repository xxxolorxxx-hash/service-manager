# Manager Usług

Profesjonalna PWA do zarządzania biznesem dla usługodawców (remonty, naprawy, instalacje).

## 📄 Dokumentacja

Dla ułatwienia nawigacji projekt posiada podzieloną dokumentację:

- [**Architektura Techniczna**](docs/ARCHITECTURE.md) - Informacje o stosie technologicznym i strukturze.
- [**Przewodnik Dewelopera**](docs/DEVELOPMENT.md) - Jak uruchomić i rozwijać aplikację.
- [**Instrukcja Użytkownika**](docs/USER_GUIDE.md) - Opis funkcjonalności dla użytkownika końcowego.

## 🚀 Funkcjonalności

- **Pulpit** - Podsumowanie finansowe, aktywne zlecenia, ostatnia aktywność.
- **Klienci** - Baza kontrahentów z szybkim kontaktem (telefon, SMS, email).
- **Zlecenia** - Zarządzanie zleceniami, statusy, przypisywanie do klientów.
- **Kosztorysy** - Tworzenie wycen z dynamicznymi pozycjami, generowanie PDF.
- **Raporty** - Wykresy przychodów, eksport do CSV.
- **Ustawienia** - Dane firmy, backup/restore danych.

## 🛠️ Tech Stack

- **Frontend**: React 19 + TypeScript
- **Styling**: Tailwind CSS v4 + Framer Motion
- **Storage**: Dexie.js (IndexedDB)
- **State**: Zustand

## 📦 Szybki Start

```bash
# Instalacja zależności
npm install

# Uruchomienie w trybie deweloperskim
npm run dev
```

## 📱 Offline & PWA

Aplikacja przechowuje wszystkie dane lokalnie w IndexedDB, więc nie wymaga backendu. Działa w trybie offline i może być zainstalowana na ekranie głównym urządzenia.

## 📝 Licencja

Projekt jest open-source.
