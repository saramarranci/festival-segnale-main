document.addEventListener('DOMContentLoaded', () => {
  const statoEl = document.getElementById('stato-programma');
  const grigliaEl = document.getElementById('griglia-eventi');

  // Converte la data YYYY-MM-DD in "Giorno GG mese" (es. "Venerdì 12 giugno")
  function formattaData(dataISO) {
    const [anno, mese, giorno] = dataISO.split('-').map(Number);
    const dataObj = new Date(anno, mese - 1, giorno);
    const formattata = new Intl.DateTimeFormat('it-IT', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    }).format(dataObj);

    return formattata.charAt(0).toUpperCase() + formattata.slice(1);
  }

  async function caricaProgramma() {
    statoEl.textContent = 'Caricamento del programma in corso...';
    statoEl.hidden = false;

    try {
      const [rispostaEventi, rispostaSedi] = await Promise.all([
        fetch('dati/eventi.json'),
        fetch('dati/sedi.json'),
      ]);

      if (!rispostaEventi.ok || !rispostaSedi.ok) {
        throw new Error('Errore nel caricamento dei file JSON.');
      }

      const [eventi, sedi] = await Promise.all([
        rispostaEventi.json(),
        rispostaSedi.json(),
      ]);

      if (!Array.isArray(eventi) || eventi.length === 0) {
        statoEl.textContent = 'Nessun evento in programma al momento.';
        return;
      }

      // Mappa delle sedi indicizzata per id per un accesso rapido
      const mappaSedi = new Map(sedi.map((sede) => [sede.id, sede]));

      // Nasconde il messaggio di caricamento e svuota la griglia
      statoEl.hidden = true;
      grigliaEl.innerHTML = '';

      eventi.forEach((evento) => {
        const sedeTrovata = mappaSedi.get(evento.sede_id);
        // Se la sede esiste, mostra il nome breve prima del trattino lungo (come nelle card originali)
        const nomeSede = sedeTrovata
          ? sedeTrovata.nome.split(' — ')[0]
          : 'Sede da definire';

        const articolo = document.createElement('article');
        articolo.className = 'event-card';

        const img = document.createElement('img');
        img.src = evento.immagine;
        img.alt = evento.immagine_alt;
        img.width = 900;
        img.height = 600;

        const body = document.createElement('div');
        body.className = 'event-body';

        const meta = document.createElement('p');
        meta.className = 'event-meta';
        meta.textContent = `${formattaData(evento.data)} · ${evento.orario} · ${evento.categoria}`;

        const titolo = document.createElement('h3');
        titolo.textContent = evento.titolo;

        const descrizione = document.createElement('p');
        descrizione.textContent = evento.descrizione;

        const luogo = document.createElement('p');
        luogo.className = 'event-place';
        const strongSede = document.createElement('strong');
        strongSede.textContent = 'Sede: ';
        luogo.append(strongSede, document.createTextNode(nomeSede));

        body.append(meta, titolo, descrizione, luogo);
        articolo.append(img, body);
        grigliaEl.appendChild(articolo);
      });
    } catch (errore) {
      console.error(errore);
      statoEl.textContent = 'Impossibile caricare il programma. Riprova più tardi.';
      statoEl.hidden = false;
    }
  }

  caricaProgramma();
});