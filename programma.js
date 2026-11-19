const griglia = document.querySelector("#event-grid");

function aggiungiTesto(parent, tag, classe, testo) {
  const elemento = document.createElement(tag);
  if (classe) elemento.className = classe;
  elemento.textContent = testo;
  parent.append(elemento);
  return elemento;
}

function formattaData(data) {
  const [anno, mese, giorno] = data.split("-").map(Number);
  const dataLocale = new Date(anno, mese - 1, giorno);

  const testo = new Intl.DateTimeFormat("it-IT", {
    weekday: "long",
    day: "numeric",
    month: "long"
  }).format(dataLocale);

  return testo.charAt(0).toLocaleUpperCase("it-IT") + testo.slice(1);
}

async function caricaEventi() {
      griglia.textContent = "Caricamento del programma…";
  try {
    const [rispostaEventi, rispostaSedi] = await Promise.all([
      fetch("dati/eventi.json"),
      fetch("dati/sedi.json")
    ]);

    if (!rispostaEventi.ok || !rispostaSedi.ok) {
      throw new Error("Impossibile caricare i file JSON.");
    }

    const [eventi, sedi] = await Promise.all([
      rispostaEventi.json(),
      rispostaSedi.json()
    ]);
    griglia.replaceChildren();

    if (eventi.length === 0) {
    griglia.textContent = "Al momento non ci sono eventi in programma.";
    return;
    }

    const sediPerId = new Map(sedi.map((sede) => [sede.id, sede]));

    for (const evento of eventi) {
      const sede = sediPerId.get(evento.sede_id);
      const scheda = document.createElement("article");
      scheda.className = "event-card";

      const immagine = document.createElement("img");
      immagine.src = evento.immagine;
      immagine.alt = evento.immagine_alt;
      immagine.width = 900;
      immagine.height = 600;
      scheda.append(immagine);

      const corpo = document.createElement("div");
      corpo.className = "event-body";

      aggiungiTesto(
        corpo,
        "p",
        "event-meta",
        `${formattaData(evento.data)} · ${evento.orario} · ${evento.categoria}`
      );

      aggiungiTesto(corpo, "h3", "", evento.titolo);
      aggiungiTesto(corpo, "p", "", evento.descrizione);

      const luogo = document.createElement("p");
      luogo.className = "event-place";

      const etichetta = document.createElement("strong");
      etichetta.textContent = "Sede:";
      luogo.append(etichetta, ` ${sede ? sede.nome : "Sede da definire"}`);

      corpo.append(luogo);
      scheda.append(corpo);
      griglia.append(scheda);
    }
  } catch (errore) {
    console.error(errore);
    griglia.textContent = "Non è stato possibile caricare il programma.";
  }
}

caricaEventi();