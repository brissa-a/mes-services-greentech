import React, { Fragment, useEffect, useState } from 'react';
import { useLocalStorage } from './localStorage'
import { buildId, Card, CardPlaceholder, Thematique, CardData } from './Card';

import { page } from './UrlSearchParam';
import { SearchAnything } from "./page/SearchAnything"
import { ProspectPublic } from './page/PropectPublic';
import { Details } from './page/Details';

import './App.scss';

var to: NodeJS.Timeout | null = null;

function App() {
  const defaultValue = null
  const [archives, setArchives] = useLocalStorage<Record<string, boolean>>("archives", { '605f26f616f88c8028d2f8d2c87c9385f7bf5651': true })
  const [favoris, setFavoris] = useLocalStorage<Record<string, CardData>>("favoris", {})
  const toggleFavori = (cd: CardData) => {
    if (!favoris[cd.id]) {
      setFavoris(Object.assign({}, favoris, { [cd.id]: cd }))
    } else {
      delete favoris[cd.id]
      setFavoris(Object.assign({}, favoris))
    }
  }
  const toggleArchive = (cd: CardData) => setArchives(Object.assign({}, archives, { [cd.id]: !archives[cd.id] }))
  Object.assign(window, {archives, favoris})
  useEffect(() => {
    document.documentElement.setAttribute("data-fr-theme", "dark");
  });

  const staticWidthClass = page === "ProspectPublic" ? "static" : ""
  
  return (
    <div className="App">
      <div className="header">
        <div className="left-side">
          <img className="msg-icon" src="/icon-ministere.png" style={{transform: "translateX(-20px)"}}/>
          <img className="msg-icon" style={{ marginLeft: "35px", transform: "scale(0.8)"}} src="/icon-msg-txt-beta.png"/>
        </div>
      </div>
      <div className={`body ${staticWidthClass}`}>
        <div className="body-container">
          {page === "ProspectPublic" ? <Details data={Object.values(favoris)[0]} /> : <SearchAnything
            favoris={favoris}
            archives={archives}
            toggleFavori={toggleFavori}
            toggleArchive={toggleArchive}
          />}
        </div>
      </div>
    </div>
  );
}

export default App;
