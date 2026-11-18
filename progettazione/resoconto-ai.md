# Resoconto del lavoro con l’AI — Segnale

## Sessione 1 — 18 novembre 2026
**Chatbot utilizzato:** Gemini

* **Che cosa ho chiesto:** 
  Ho condiviso con il chatbot tutti i file di partenza del sito (`index.html`, `programma.html`, `info.html`, `style.css`, `galleria.js`, `eventi.json`, `sedi.json`)[cite: 1, 2, 3, 4, 5, 6, 7] e la traccia dell'esercitazione, chiedendo di affrontare e risolvere un punto alla volta:
  1. Completamento dei due file JSON (`sedi.json` ed `eventi.json`)[cite: 6, 7].
  2. Documentazione della struttura dati in `dati/SCHEMA.md` e creazione dello schema relazionale in Mermaid.
  3. Sostituzione delle schede statiche in `programma.html` con il caricamento dinamico da JSON tramite `fetch`[cite: 2].
  4. Aggiunta della sezione **Meteo a Torino adesso** in `info.html` collegata all'API pubblica di Open-Meteo[cite: 3].

* **Che cosa ho usato, modificato o scartato:**
  * **File JSON (`dati/sedi.json` e `dati/eventi.json`):** Ho usato le proposte generate dall'AI per aggiungere le due sedi mancanti (*Spazio Forma* e *Cortile Comune*)[cite: 1, 3] e i quattro eventi mancanti (*Materia seconda*, *La città in un manifesto*, *Mappe da abitare*, *Progettare insieme*)[cite: 2], collegando ogni evento alla rispettiva sede tramite il campo numerico `sede_id`[cite: 6].
  * **Documentazione (`dati/SCHEMA.md`):** Dalla proposta iniziale del documento completo ho chiesto di estrarre il solo blocco del diagramma Entità-Relazione (`erDiagram`) in sintassi Mermaid, inserendolo poi nella scheda dati scritta da me.
  * **Programma dinamico (`programma.html` e `programma.js`):** Ho rimosso i sei `<article class="event-card">` scritti a mano in `programma.html`[cite: 2] lasciando un contenitore vuoto (`#griglia-eventi`) e un paragrafo per i messaggi di stato (`#stato-programma`). Ho creato `programma.js` per caricare in parallelo i due file JSON con `Promise.all` e `fetch`, formattare le date ISO (`2026-06-12` → `Venerdì 12 giugno`) e generare gli elementi HTML mantenendo classi e layout originali[cite: 2, 4, 6].
  * **Meteo in tempo reale (`info.html`, `meteo.js`, `style.css`):** Ho inserito in `info.html` una nuova sezione dedicata al meteo attuale di Torino[cite: 3] e creato `meteo.js` per interrogare l'endpoint JSON di Open-Meteo, mostrando temperatura, velocità del vento, orario dell'ultimo rilevamento, licenza CC BY 4.0 e nota esplicativa (dato odierno e non previsione per giugno). Ho inoltre aggiunto in `style.css` la classe `.weather-box` riprendendo colori, bordi e spaziature delle schede già presenti nel sito[cite: 4].

* **Come ho verificato:**
  * Ho eseguito il progetto tramite un server web locale per testare correttamente le richieste `fetch` verso i file JSON locali e verso l'API esterna di Open-Meteo.
  * Ho verificato visivamente che `programma.html` mostrasse tutte e sei le schede complete di immagini, testi alternativi, orari e nomi delle sedi corretti[cite: 2, 6, 7].
  * Ho controllato che in `info.html` il carosello Swiper e la mappa uMap continuassero a funzionare senza interferenze insieme al nuovo riquadro meteo[cite: 3].

* **Problemi riscontrati e soluzioni:**
  * **Allineamento del nome sede nelle schede:** Nel file `sedi.json` il campo `nome` riporta sia il nome immaginario sia la sede reale separati dal trattino lungo `—` (es. `"Officina Nord — Sede centrale"`)[cite: 7], mentre nelle schede originali del programma compariva solo il nome breve (`"Officina Nord"`)[cite: 2]. In `programma.js` il problema è stato risolto estraendo la prima parte della stringa con `.split(' — ')[0]`.
  * **Gestione degli errori e casi limite:** Per evitare che la pagina resti vuota o si blocchi in caso di problemi di rete, file mancanti o riferimenti errati, sono stati implementati messaggi di stato accessibili (`aria-live="polite"`) per caricamento, elenco vuoto ed errori HTTP/fetch, più il controllo `«Sede da definire»` nel caso in cui un evento punti a un `sede_id` inesistente.
  