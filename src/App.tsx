import React, { Fragment, ReactNode, useEffect, useState } from 'react';
import { useLocalStorage } from './localStorage'
import { buildId, Card, CardPlaceholder, Thematique, CardData } from './component/Card';

import { page, objectId, defaultDescription } from './UrlSearchParam';
import { SearchAnything, LastApiResponse } from "./page/SearchAnything"
import { Details } from './page/Details';
import { FavorisPage } from './page/FavorisPage';
import { Footer } from "./component/Footer"
import { Header } from "./component/Header"
import { DonnezVotreAvis } from "./component/DonnezVotreAvis"

import './App.scss';

var to: NodeJS.Timeout | null = null;

function App() {
  const defaultValue = null
  const [archives, setArchives] = useLocalStorage<Record<string, boolean>>("archives", { '605f26f616f88c8028d2f8d2c87c9385f7bf5651': true })
  const [favoris, setFavoris] = useLocalStorage<Record<string, CardData>>("favoris", {})
  const [lastApiResponse, setLastApiResponse] = useLocalStorage<LastApiResponse>("lastApiResponse", null)
  const toggleFavori = (cd: CardData) => {
    if (!favoris[cd.id]) {
      setFavoris(Object.assign({}, favoris, { [cd.id]: cd }))
    } else {
      delete favoris[cd.id]
      setFavoris(Object.assign({}, favoris))
    }
  }
  const toggleArchive = (cd: CardData) => setArchives(Object.assign({}, archives, { [cd.id]: !archives[cd.id] }))
  Object.assign(window, { archives, favoris })
  useEffect(() => {
    document.documentElement.setAttribute("data-fr-theme", "dark");
  });

  const router: Record<string, ReactNode> = {
    "/favoris": <FavorisPage favoris={favoris}
      archives={archives}
      toggleFavori={toggleFavori}
      toggleArchive={toggleArchive}
      lastApiResponse={lastApiResponse} />,
    "/details": objectId && <Details data={ ((lastApiResponse != "loading") && lastApiResponse?.cardDataById[objectId]) || favoris[objectId] || archives[objectId]} />
  }
  const defaultPage = <SearchAnything
    favoris={favoris}
    archives={archives}
    toggleFavori={toggleFavori}
    toggleArchive={toggleArchive}
    setLastApiResponse={setLastApiResponse}
    lastApiResponse={lastApiResponse}
  />
  const page = router[window.location.pathname] || defaultPage;
  const staticWidthClass = page === "ProspectPublic" ? "static" : ""
  return <div className="App">
    <DonnezVotreAvis/>
    <Header />
    <div className={`body`}>
      <div className="body-container">
        {page}
      </div>
    </div>
    <Footer />
  </div>;
}

export default App;
