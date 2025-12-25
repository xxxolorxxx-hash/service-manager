# Specyfikacja: Rozbudowa modułu finansowego i analiza rentowności zleceń

## Cel
Celem tego tracka jest umożliwienie użytkownikom precyzyjnego śledzenia kosztów materiałów i robocizny w ramach każdego zlecenia, co pozwoli na automatyczne obliczanie marży i rentowności. Jest to kluczowa funkcjonalność wspierająca cele biznesowe zdefiniowane w Product Guide.

## Zakres Funkcjonalny

### 1. Zarządzanie Kosztami Zlecenia
- **Koszty Materiałowe:**
    - Możliwość dodawania pozycji kosztowych materiałów do zlecenia.
    - Każda pozycja zawiera: nazwę materiału, cenę jednostkową, ilość, jednostkę miary (szt., mb, m2, kg, l), stawkę VAT (opcjonalnie, jeśli aplikacja obsługuje brutto/netto).
    - Obliczanie sumy kosztów materiałowych.
- **Koszty Robocizny:**
    - Możliwość definiowania stawek godzinowych dla pracowników lub podwykonawców.
    - Rejestracja czasu pracy przy zleceniu (logowanie godzin).
    - Możliwość dodawania kosztów robocizny ryczałtowej (np. usługa zewnętrzna).
    - Obliczanie sumy kosztów robocizny.
- **Inne Koszty:**
    - Możliwość dodania "innych kosztów" (np. transport, wynajem sprzętu).

### 2. Analiza Rentowności (w czasie rzeczywistym)
- **Kalkulacja:**
    - Przychód (Wartość zlecenia dla klienta).
    - Koszty Całkowite = Koszty Materiałowe + Koszty Robocizny + Inne Koszty.
    - Zysk = Przychód - Koszty Całkowite.
    - Marża (%) = (Zysk / Przychód) * 100%.
    - Narzut (%) = (Zysk / Koszty Całkowite) * 100%.
- **Prezentacja Danych:**
    - Wyświetlanie podsumowania finansowego w szczegółach zlecenia.
    - Wizualne wskaźniki rentowności (np. kolor zielony dla marży > X%, czerwony dla < Y%).

### 3. Zmiany w Bazie Danych (Dexie.js)
- Rozbudowa schematu `Order` o tablice/kolekcje kosztów (`materials`, `labor`, `otherCosts`).
- Migracja istniejących danych (jeśli konieczna, aby zachować kompatybilność).

### 4. Interfejs Użytkownika (UI)
- Nowa zakładka lub sekcja "Finanse" w widoku szczegółów zlecenia.
- Formularze dodawania/edycji kosztów (modale lub inline).
- Czytelne karty podsumowujące finanse zlecenia.

## Wymagania Techniczne
- **Baza danych:** Dexie.js
- **Stan:** Zustand
- **Walidacja:** Zod
- **UI:** Komponenty Tailwind CSS, spójne z istniejącym stylem.
- **Testy:** Pokrycie testami jednostkowymi i integracyjnymi > 80%.

## Kryteria Akceptacji
- Użytkownik może dodać, edytować i usunąć koszt materiałowy.
- Użytkownik może dodać, edytować i usunąć koszt robocizny.
- System automatycznie przelicza sumy kosztów i zysk po każdej zmianie.
- Dane są poprawnie zapisywane w IndexedDB i odtwarzane po ponownym uruchomieniu aplikacji.
- UI jest responsywny i czytelny na urządzeniach mobilnych.
