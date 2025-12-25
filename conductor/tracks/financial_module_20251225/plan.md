# Plan: Rozbudowa modułu finansowego i analiza rentowności zleceń

## Faza 1: Rozbudowa warstwy danych i logiki biznesowej [checkpoint: f8ec545]

W tej fazie skupimy się na backendzie (lokalnym) - rozszerzeniu schematu bazy danych Dexie.js oraz logiki w storeach Zustand do obsługi kosztów.

- [x] Task: Zaktualizuj schemat bazy danych Dexie o tabele kosztów (materials, labor, other) oraz powiązania ze zleceniami. Zdefiniuj typy TypeScript. 63c1b51
- [x] Task: Zaktualizuj store Zustand (`useOrders` lub nowy `useFinance`) o akcje do dodawania, edycji i usuwania kosztów. 87e7e26
- [x] Task: Zaimplementuj funkcje pomocnicze (utils) do obliczania sum, marży i zysku. Napisz testy jednostkowe dla logiki obliczeniowej. a0fdc3f
- [x] Task: Conductor - User Manual Verification 'Faza 1: Rozbudowa warstwy danych i logiki biznesowej' (Protocol in workflow.md) f8ec545

## Faza 2: Interfejs zarządzania kosztami (Materiały)

Implementacja UI do zarządzania kosztami materiałowymi w szczegółach zlecenia.

- [x] Task: Stwórz komponenty UI do wyświetlania listy materiałów w zleceniu (tabela/karty). 59f5686
- [x] Task: Zaimplementuj formularz (Dialog) dodawania i edycji kosztu materiałowego z walidacją (Zod). bdc3c90
- [x] Task: Zintegruj formularz ze storem i bazą danych. 3767f25
- [x] Task: Conductor - User Manual Verification 'Faza 2: Interfejs zarządzania kosztami (Materiały)' (Protocol in workflow.md) 307d0bf

## Faza 3: Interfejs zarządzania kosztami (Robocizna i Inne)

Implementacja UI do zarządzania robocizną i innymi kosztami.

- [ ] Task: Stwórz komponenty UI do wyświetlania listy kosztów robocizny i innych.
- [ ] Task: Zaimplementuj formularze dodawania/edycji kosztów robocizny i innych kosztów.
- [ ] Task: Zintegruj formularze ze storem.
- [ ] Task: Conductor - User Manual Verification 'Faza 3: Interfejs zarządzania kosztami (Robocizna i Inne)' (Protocol in workflow.md)

## Faza 4: Podsumowanie finansowe i analiza rentowności

Implementacja widoku podsumowującego finanse zlecenia.

- [ ] Task: Stwórz komponent `FinancialSummary` wyświetlający przychód, sumę kosztów, zysk i marżę.
- [ ] Task: Zaimplementuj wizualne wskaźniki rentowności (np. kolorowanie marży).
- [ ] Task: Dodaj sekcję "Finanse" do widoku szczegółów zlecenia (`OrderDetailsPage`), integrując wszystkie nowe komponenty.
- [ ] Task: Conductor - User Manual Verification 'Faza 4: Podsumowanie finansowe i analiza rentowności' (Protocol in workflow.md)
