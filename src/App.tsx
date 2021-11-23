import React, { Fragment, useEffect, useState } from 'react';
import './App.scss';

const params = new URLSearchParams(window.location.search)
const apiurl = params.get("api-url") || 'https://alexisb.pythonanywhere.com/getAides/'
const max_results_str = params.get("max-results")
const max_results = max_results_str && JSON.parse(max_results_str) || 30
const defaultDescription = params.get("description") || "Nous sommes une startup spécialisé dans le tri des déchets métalliques"

console.log(`Hidden params: &max-results=${max_results}&api-url=${apiurl}&description=${defaultDescription}`)

function Tag(props: { color: string, children: React.ReactNode }) {
  const style = {
    backgroundColor: props.color,
    borderRadius: '25px',
    color: "rgba(255,255,255,0.93)",
    padding: "7px 7px",
    fontSize: "0.8em"
  }
  return <span style={style}>{props.children}</span>
}

type AidePublique = {
  "titre_aide": string,
  "aide_detail": string,
  "aide_detail_clean": string,
  "score": number,
  "contact": string
}

type reponseType = {
  "fichier_aides": string,
  "descriptionSU": string,
  "fichier_vocab": string,
  "nb_aides": number,
  "resultats_aides": AidePublique[],
  "score_max": number
}

const cardType = {
  "aide": { color: "rgb(255,127,0)", text: "🚀 Aide publique" },
  "marché": { color: "rgb(0,255,127)", text: "💱 Marché public" },
  "collectivité": { color: "rgb(127,0,255)", text: "🏙️ Collectivité" }
};


function OneResult(props: { aide: AidePublique, maxscore: number }) {
  const [showDetails, setShowDetails] = useState(false);
  return <div className="card"
    onMouseEnter={() => setShowDetails(true)}
    onMouseLeave={() => setShowDetails(false)}>
    <div className="fieldset" style={{ borderColor: cardType["aide"].color }}>
      <span className="legend" style={{ color: cardType["aide"].color }}>{cardType["aide"].text}</span>
      {/* <div style={{ height: "1px", backgroundColor: "red", width: ((1 - (props.aide.score / props.maxscore)) * 100) + "%" }}></div>
    <br /> */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "11px"}}>
        <div style={{ fontWeight: 100, fontSize: "12px" }}>Test texte gris | 2022/06</div>
        <div><span>⭐</span><span>🗑️</span></div>
      </div>
      {showDetails && <div style={{ position: "absolute", top: "1px", right: "10px", fontSize: "0.5em" }}>{props.aide.score}</div>}
      <p style={{ fontWeight: 400, fontSize: "16px", marginBottom: "11px" }}>{props.aide.titre_aide}</p>
      <a href="#"><div style={{ padding: "10px" }}>👁️ Voir le détail</div></a>
      {/* {showDetails && <br />}
    {showDetails && <div>{props.aide.aide_detail_clean}</div>}
    {showDetails && <div><i><span dangerouslySetInnerHTML={{ __html: props.aide.contact }}></span></i></div>} */}
    </div>
  </div>
}

function buildAidesRequest(description: string) {
  return fetch(apiurl, {
    method: "POST",
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      "fichier_aides": "Aides_detailsandname.xlsx",
      "descriptionSU": description,
      "fichier_vocab": "vocab.pkl",
      "nb_aides": max_results,
      "resultats_aides": [],
      "score_max": 0
    })
  })
    .then(resp => resp.json())
}

var to: NodeJS.Timeout | null = null;

declare global {
  interface Window { lastApiResponse: reponseType; }
}

function App() {
  const defaultValue = null
  const [reponse, setReponse] = useState<reponseType | null>(null);
  const [descriptionStartup, setDescriptionStartup] = useState<string>(defaultDescription);

  useEffect(() => {
    document.documentElement.setAttribute("data-fr-theme", "dark");
  });

  function updateReponse() {
    console.log("updating results")
    setReponse(null);
    buildAidesRequest(descriptionStartup).then(json => {
      setReponse(json)
      window.lastApiResponse = json
    })
  }
  function delayedUpdateReponse() {
    console.log("delaying request")
    if (to) clearTimeout(to)
    to = setTimeout(updateReponse, 600)
  }
  useEffect(delayedUpdateReponse, [descriptionStartup]);
  console.log(descriptionStartup)
  const shareableLink = `${window.location.origin}?description=${encodeURIComponent(descriptionStartup)}`
  return (
    <div className="App">
      <div className="header">
        <img className="msg-icon" src="/icon-ministere.png" />
        <img className="msg-icon" style={{ marginLeft: "35px" }} src="/icon-msg-txt-beta.png" />
      </div>
      <div className="body">
        <div className="description-startup">
          <div>
            <div className="big">Aimant greentech</div>
          </div>
          <div >
            <div className="label">1, 2, 3... pitchez !</div>
            <textarea
              onChange={e => setDescriptionStartup(e.target.value)}
              className=""
              value={descriptionStartup}
              placeholder="ex: Nous sommes une startup spécialisé dans le tri des déchets métalliques et...">
            </textarea>
          </div>
          <div style={{ margin: "10px" }}>
            <a href={shareableLink}>Shareable link</a>
          </div>
        </div>
        <div className="resultats">
          <div className="control-pannel white-text">
            <div style={{ textAlign: "center", fontWeight: 700, marginBottom: "16px" }}>Vos pistes de prospection</div>
            <div>
              <div className="fr-toggle">
                <input type="checkbox" className="fr-toggle__input" aria-describedby="toggle-698-hint-text" id="toggle-698" />
                <label className="fr-toggle__label" htmlFor="toggle-698" data-fr-checked-label="Activé" data-fr-unchecked-label="Désactivé">Aide publique</label>
              </div>
            </div>
            <div style={{ textAlign: "center" }}>
              <button className="fr-btn">
                Toutes (7)
              </button> &nbsp;
              <button className="fr-btn">
                Séletionnées (0)
              </button> &nbsp;
              <button className="fr-btn">
                Archivée (0)
              </button>
            </div>
          </div>
          <div className="card-list">
            {reponse ? reponse.resultats_aides.map(x => <OneResult aide={x} maxscore={reponse.resultats_aides.slice(-1)[0].score} />) :
              <Fragment>
                <div className="card">It's loading...</div>
                <div className="card"></div>
                <div className="card"></div>
                <div className="card"></div>
                <div className="card"></div>
              </Fragment>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
