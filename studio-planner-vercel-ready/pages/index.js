
import React, { useState } from 'react';

export default function Home() {
  const [giorni, setGiorni] = useState(40);
  const [pagine, setPagine] = useState([25, 20, 18, 15]);
  const [risultato, setRisultato] = useState(null);

  const calcolaStudio = () => {
    const giorniEffettivi = giorni <= 30 ? giorni - 10 : giorni - 15;
    if (giorniEffettivi <= 0) return setRisultato("Giorni insufficienti per studiare.");

    const sommaPagine = pagine.reduce((a, b) => a + b, 0);
    if (sommaPagine < 80 || sommaPagine > 100) {
      return setRisultato("Il totale delle pagine deve essere tra 80 e 100. Attuali: " + sommaPagine);
    }

    const programma = {};
    let giorniAssegnati = 0;

    pagine.forEach((p, i) => {
      if (i === 0) {
        const pagGiorno = +(p / giorniEffettivi).toFixed(2);
        programma[`Materia ${i + 1} (Procedura - quotidiana)`] = {
          durata: giorniEffettivi,
          pagineTotali: p,
          pagineGiornaliere: pagGiorno
        };
        giorniAssegnati += giorniEffettivi;
      } else {
        const durata1 = Math.ceil(giorniEffettivi / 5);
        const durata2 = Math.max(3, Math.ceil(durata1 * 0.7));
        const durata3 = Math.max(3, Math.ceil(durata2 * 0.5));

        let nomeMateria = `Materia ${i + 1}`;
        if (i === 3) nomeMateria += " (Deontologia)";

        programma[nomeMateria] = {
          fase1: {
            durata: durata1,
            pagineGiornaliere: +(p / durata1).toFixed(2)
          },
          fase2: {
            durata: durata2,
            pagineGiornaliere: +(p / durata2).toFixed(2)
          },
          fase3: {
            durata: durata3,
            pagineGiornaliere: +(p / durata3).toFixed(2)
          }
        };

        giorniAssegnati += durata1 + durata2 + durata3;
      }
    });

    setRisultato({ giorniEffettivi, giorniAssegnati, programma });
  };

  const aggiornaPagine = (index, valore) => {
    const nuovo = [...pagine];
    nuovo[index] = parseInt(valore) || 0;
    setPagine(nuovo);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '700px', margin: 'auto' }}>
      <h1>📚 Studio Planner Bot</h1>
      <label>Giorni disponibili: </label>
      <input type="number" value={giorni} onChange={e => setGiorni(+e.target.value)} /><br />
      {pagine.map((p, i) => (
        <div key={i}>
          <label>
            {i === 0 ? "Procedura (sempre ogni giorno)" :
             i === 3 ? "Deontologia" : `Materia ${i + 1}`} - pagine:
          </label>
          <input type="number" value={p} onChange={e => aggiornaPagine(i, e.target.value)} />
        </div>
      ))}
      <button onClick={calcolaStudio}>Calcola</button>
      {risultato && typeof risultato === 'string' && (
        <p style={{ color: 'red' }}>{risultato}</p>
      )}
      {risultato && typeof risultato === 'object' && (
        <div>
          <p><strong>Giorni effettivi di studio:</strong> {risultato.giorniEffettivi}</p>
          <p><strong>Giorni totali assegnati:</strong> {risultato.giorniAssegnati}</p>
          {Object.entries(risultato.programma).map(([materia, fasi], idx) => (
            <div key={idx}>
              <h3>{materia}</h3>
              {materia.includes("quotidiana") ? (
                <p>Pagine al giorno: {fasi.pagineGiornaliere}</p>
              ) : (
                <ul>
                  <li>Fase 1: {fasi.fase1.durata} giorni, {fasi.fase1.pagineGiornaliere} pag/giorno</li>
                  <li>Fase 2: {fasi.fase2.durata} giorni, {fasi.fase2.pagineGiornaliere} pag/giorno</li>
                  <li>Fase 3: {fasi.fase3.durata} giorni, {fasi.fase3.pagineGiornaliere} pag/giorno</li>
                </ul>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
