document.addEventListener('DOMContentLoaded', () => {
  const statoEl = document.getElementById('stato-meteo');
  const datiEl = document.getElementById('dati-meteo');
  const tempEl = document.getElementById('meteo-temperatura');
  const ventoEl = document.getElementById('meteo-vento');
  const oraEl = document.getElementById('meteo-ora');

  const urlMeteo =
    'https://api.open-meteo.com/v1/forecast?latitude=45.0703&longitude=7.6869&current=temperature_2m,wind_speed_10m&timezone=Europe%2FRome';

  function formattaOraAPI(isoString) {
    // Open-Meteo restituisce "YYYY-MM-DDTHH:MM"
    const [dataParte, oraParte] = isoString.split('T');
    if (!dataParte || !oraParte) return isoString;
    const [anno, mese, giorno] = dataParte.split('-');
    return `${giorno}/${mese}/${anno} alle ${oraParte}`;
  }

  async function caricaMeteo() {
    try {
      const risposta = await fetch(urlMeteo);
      if (!risposta.ok) {
        throw new Error(`Errore HTTP: ${risposta.status}`);
      }

      const dati = await risposta.json();

      if (!dati.current || !dati.current_units) {
        throw new Error('Formato risposta meteo non valido.');
      }

      const temperatura = dati.current.temperature_2m;
      const unitaTemp = dati.current_units.temperature_2m;
      const vento = dati.current.wind_speed_10m;
      const unitaVento = dati.current_units.wind_speed_10m;
      const ora = dati.current.time;

      tempEl.textContent = `${temperatura} ${unitaTemp}`;
      ventoEl.textContent = `${vento} ${unitaVento}`;
      oraEl.textContent = formattaOraAPI(ora);

      statoEl.hidden = true;
      datiEl.hidden = false;
    } catch (errore) {
      console.error('Errore nel recupero del meteo:', errore);
      statoEl.textContent =
        'Dati meteo momentaneamente non disponibili. Il resto delle informazioni sul festival resta consultabile.';
      statoEl.hidden = false;
      datiEl.hidden = true;
    }
  }

  caricaMeteo();
});