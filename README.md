# Boompje Klimmen Scorebord

Een eenvoudige webapplicatie om de scores bij te houden voor het kaartspel "Boompje Klimmen".

## Functies

*   **Spelinstellingen:** Stel het aantal spelers (2-12), hun namen en het maximale aantal rondes (2-7) in.
*   **Rondeverloop:** Voer per ronde de biedingen en behaalde slagen per speler in.
*   **Scoreberekening:** Berekent automatisch de scores op basis van de regels van Boompje Klimmen (10 punten + aantal slagen bij correct bod, anders -5 punten).
*   **Scorebord:** Toont een overzicht van de scores per ronde en de totaalscore per speler.
*   **Biedlogboek:** Toont een overzicht van de biedingen per ronde per speler.
*   **Eindstand:** Geeft de eindrangschikking weer aan het einde van het spel.
*   **Acties:**
    *   Strafpunten toekennen.
    *   Score(s) van spelers naar 0 zetten.
    *   Een nieuw spel starten (reset alle gegevens).
*   **PDF Export:** Exporteer de eindstand en het scorebord naar een PDF-bestand.
*   **Responsief:** Ontworpen om te werken op verschillende schermformaten.

## Hoe te gebruiken

1.  Open het `index.html` bestand in je webbrowser.
2.  **Instellen:**
    *   Kies het aantal spelers.
    *   Voer de namen van de spelers in.
    *   Selecteer het aantal rondes dat gespeeld wordt.
    *   Klik op "Start Spel".
3.  **Spelen:**
    *   **Bieden:** Voer voor elke speler het aantal slagen in dat ze denken te halen. Het totaal mag niet gelijk zijn aan het aantal kaarten in de ronde. Klik op "Bevestig Biedingen".
    *   **Slagen:** Voer voor elke speler het aantal behaalde slagen in. Het totaal moet gelijk zijn aan het aantal kaarten in de ronde. Klik op "Bevestig Slagen".
    *   **Ronde Uitslag:** Bekijk de scores voor de afgelopen ronde. Klik op "Volgende Ronde" of "Bekijk Eindscore" (in de laatste ronde).
4.  **Overzichten:**
    *   Klik op "Scorebord" om de totaalscores te zien.
    *   Klik op "Biedlogboek" om de biedingen per ronde te zien.
5.  **Menu:**
    *   Klik op het hamburgermenu (☰) rechtsboven voor extra acties zoals strafpunten geven, scores resetten of een nieuw spel starten.
6.  **Einde Spel:**
    *   Bekijk de eindrangschikking.
    *   Exporteer de resultaten naar PDF.
    *   Start een nieuw spel.

## Technologieën

*   HTML5
*   CSS3
*   JavaScript (ES6+)
*   [jsPDF](https://github.com/parallax/jsPDF) & [jsPDF-AutoTable](https://github.com/simonbengtsson/jsPDF-AutoTable) voor PDF-export.
