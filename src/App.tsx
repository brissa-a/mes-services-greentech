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
    color: "rgba(255,255,255,0.93",
    padding: "7px 7px",
    fontSize: "0.8em"
  }
  return <span style={style}>{props.children}</span>
}

const cardType = {
  "aide": <Tag color="rgb(255,127,0)">🚀 Aide publique</Tag>,
  "marché": <Tag color="rgb(0,255,127)">💱 Marché public</Tag>,
  "collectivité": <Tag color="rgb(127,0,255)">🏙️ Collectivité</Tag>
};

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

function OneResult(props: { aide: AidePublique, maxscore: number }) {
  const [showDetails, setShowDetails] = useState(false);
  return <div className="card card-1"
    onMouseEnter={() => setShowDetails(true)}
    onMouseLeave={() => setShowDetails(false)}>
    {/* <div style={{ height: "1px", backgroundColor: "red", width: ((1 - (props.aide.score / props.maxscore)) * 100) + "%" }}></div>
    <br /> */}
    <div style={{display: "flex", justifyContent: "space-between"}}>
      <div>{cardType["aide"]}</div>
      <div><span>👍</span><span>👎</span></div>
    </div>
    <div style={{color: "rgba(0,0,0, 0.2)", padding: "10px 0px"}}>Test texte gris | 2022/06</div>
    {showDetails && <div style={{ position: "absolute", top: "1px", right: "10px", fontSize: "0.5em" }}>{props.aide.score}</div>}
    <div><b>{props.aide.titre_aide}</b></div>
    <a href="#"><div style={{padding: "10px"}}>👁️ Voir le détail</div></a>
    {showDetails && <br />}
    {showDetails && <div>{props.aide.aide_detail_clean}</div>}
    {showDetails && <div><i><span dangerouslySetInnerHTML={{ __html: props.aide.contact }}></span></i></div>}
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
            <div className="big white-text">1, 2, 3... pitchez !</div>
            <div className="small white-text">
              Mes services Greentech est en version beta. L’outil vous propose automatiquement des pistes pour booster votre développement !
              Merci de nous aider a améliorer l’expérience
            </div>
          </div>
          <div >
            <div className="label">Pitch de votre startup</div>
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
          <div className="card-list">
            {reponse ? reponse.resultats_aides.map(x => <OneResult aide={x} maxscore={reponse.resultats_aides.slice(-1)[0].score} />) :
              <Fragment>
                <div className="card card-1">It's loading...</div>
                <div className="card card-1"></div>
                <div className="card card-1"></div>
                <div className="card card-1"></div>
                <div className="card card-1"></div>
              </Fragment>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
