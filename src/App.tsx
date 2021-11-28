import React, { Fragment, useEffect, useState } from 'react';
import type { Aide, ApiResponse, Collectivite, Marche } from './api/Api';
import { buildSearchAnythingRequest } from './api/Api';
import './App.scss';
import { Card, CardPlaceholder, Thematique } from './Card'
import { defaultDescription } from './UrlSearchParam'

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
  const toto = reponse && [
    ...reponse.cards.aides.map(x => Object.assign({ type: "aide" as Thematique}, x)),
    ...reponse.cards.collectivites.map(x => Object.assign({ type: "collectivité"  as Thematique}, x)),
    ...reponse.cards.marches.map(x => Object.assign({ type: "marché" as Thematique}, x))
  ]
  type Themed = {thematique: Thematique}
  const allcards : ((Themed & Aide) | (Themed & Collectivite) | (Themed & Marche))[] | null = []
  if (reponse) {
    const {aides, collectivites, marches} = reponse.cards;
    const allList = [[...aides], [...collectivites], [...marches]];
    const allNames : Thematique[] = ["aide", "collectivité", "marché"]
    while (allList.some(x => x.length)) {//While one of the list still as elements
      //debugger;
      const rand = Math.floor(Math.random() * allList.length );//entier 0 < rand < allList.length 
      const pick = allList[rand].pop()
      const name = allNames[rand];
      if (pick) allcards.push(Object.assign({thematique: name}, pick))
    }
  }
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
            {reponse ? allcards.map(x => <Card data={x} maxscore={allcards.slice(-1)[0].score} />) :
              <Fragment>
                <CardPlaceholder />
                <CardPlaceholder />
                <CardPlaceholder />
                <CardPlaceholder />
                <CardPlaceholder />
                <CardPlaceholder />
                <CardPlaceholder />
                <CardPlaceholder />
                <CardPlaceholder />
              </Fragment>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
