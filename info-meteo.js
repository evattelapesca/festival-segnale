const statoMeteo = document.querySelector("#meteo-stato");
const datiMeteo = document.querySelector("#meteo-dati");

async function caricaMeteo() {
  const indirizzo =
    "https://api.open-meteo.com/v1/forecast" +
    "?latitude=45.0703" +
    "&longitude=7.6869" +
    "&current=temperature_2m,wind_speed_10m" +
    "&timezone=Europe%2FRome";

  try {
    const risposta = await fetch(indirizzo);

    if (!risposta.ok) {
      throw new Error("La richiesta meteo non è riuscita.");
    }

    const dati = await risposta.json();
    const attuali = dati.current;

    if (!attuali) {
      throw new Error("I dati meteo attuali non sono disponibili.");
    }

    document.querySelector("#meteo-temperatura").textContent =
      `${attuali.temperature_2m} °C`;

    document.querySelector("#meteo-vento").textContent =
      `${attuali.wind_speed_10m} km/h`;

    const ora = document.querySelector("#meteo-ora");
    ora.dateTime = attuali.time;
    ora.textContent = attuali.time.replace("T", " ");

    datiMeteo.hidden = false;
    statoMeteo.textContent = "";
  } catch (errore) {
    console.error("Errore nel caricamento del meteo:", errore);
    statoMeteo.textContent =
      "I dati meteo non sono disponibili al momento. Puoi riprovare più tardi.";
  }
}

caricaMeteo();