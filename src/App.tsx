import React, { Fragment, useEffect, useState } from 'react';
import { useLocalStorage } from './localStorage'
import type { Aide, ApiResponse, Collectivite, Marche } from './api/Api';
import { buildId, Card, CardPlaceholder, Thematique, CardData } from './Card';
import {SearchAnything} from "./page/SearchAnything"

import './App.scss';

var to: NodeJS.Timeout | null = null;

function App() {
  const defaultValue = null
  const [archives, setArchives] = useLocalStorage<Record<string, boolean>>("archives", { '605f26f616f88c8028d2f8d2c87c9385f7bf5651': true })
  const [favoris, setFavoris] = useLocalStorage<Record<string, CardData>>("favoris", {})
  const toggleFavori = (cd: CardData) => setFavoris(Object.assign({}, favoris, { [cd.id]: favoris[cd.id] ? null : cd }))
  const toggleArchive = (cd: CardData) => setArchives(Object.assign({}, archives, { [cd.id]: !archives[cd.id] }))

  useEffect(() => {
    document.documentElement.setAttribute("data-fr-theme", "dark");
  });

  return (
    <div className="App">
      <div className="header">
        <img className="msg-icon" src="/icon-ministere.png" />
        <img className="msg-icon" style={{ marginLeft: "35px" }} src="/icon-msg-txt-beta.png" />
      </div>
      <div className="body">
        <SearchAnything
          favoris={favoris}
          archives={archives}
          toggleFavori={toggleFavori}
          toggleArchive={toggleArchive}
        />
      </div>
    </div>
  );
}

export default App;
