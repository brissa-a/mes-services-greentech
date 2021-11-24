import React, { Fragment, useEffect, useState } from 'react';
import type {ApiResponse} from './api/Api';
import {buildSearchAnythingRequest} from './api/Api';
import './App.scss';
import {Card, CardPlaceholder} from './Card'
import {defaultDescription} from './UrlSearchParam'

var to: NodeJS.Timeout | null = null;

declare global {
  interface Window { lastApiResponse: ApiResponse; }
}

function App() {
  const defaultValue = null
  const [reponse, setReponse] = useState<ApiResponse | null>(null);
  const [descriptionStartup, setDescriptionStartup] = useState<string>(defaultDescription);

  useEffect(() => {
    document.documentElement.setAttribute("data-fr-theme", "dark");
  });

  function updateReponse() {
    console.log("updating results")
    setReponse(null);
    buildSearchAnythingRequest(descriptionStartup).then(json => {
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
            {reponse ? reponse.cards.aides.map(x => <Card aide={x} maxscore={reponse.cards.aides.slice(-1)[0].score} />) :
              <Fragment>
                <CardPlaceholder/>
                <CardPlaceholder/>
                <CardPlaceholder/>
                <CardPlaceholder/>
                <CardPlaceholder/>
                <CardPlaceholder/>
              </Fragment>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
