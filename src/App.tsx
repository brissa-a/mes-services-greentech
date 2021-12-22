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
  const [archives, setArchives] = useLocalStorage<Record<string, boolean>>("archives", { '605f26f616f88c8028d2f8d2c87c9385f7bf5651': true })
  const [favoris, setFavoris] = useLocalStorage<Record<string, CardData>>("favoris", {})
  const [lastApiResponse, setLastApiResponse] = useLocalStorage<LastApiResponse>("lastApiResponse", null)
  const [pathname, setPathname] = useState(window.location.pathname)
  function goto(urlstr:string) {
    console.log(urlstr)
    const url = new URL(urlstr, window.location.origin)
    window.history.pushState({}, "", urlstr)
    window.scrollTo(0, 0)
    setPathname(url.pathname)
  }
  function onBackButtonEvent(e: PopStateEvent) {
    setPathname(window.location.pathname)
  }

  useEffect(() => {
    window.addEventListener('popstate', onBackButtonEvent);
    return () => {
      window.removeEventListener('popstate', onBackButtonEvent);  
    };
  })
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
      lastApiResponse={lastApiResponse}
      goto={goto}/>,
    "/details": objectId && <Details data={ ((lastApiResponse != "loading") && lastApiResponse?.cardDataById[objectId]) || favoris[objectId] || archives[objectId]} />
  }
  const defaultPage = <SearchAnything
    favoris={favoris}
    archives={archives}
    toggleFavori={toggleFavori}
    toggleArchive={toggleArchive}
    setLastApiResponse={setLastApiResponse}
    lastApiResponse={lastApiResponse}
    goto={goto}
  />
  const page = router[pathname];
  
  return <div className="App">
    <DonnezVotreAvis/>
    <Header />
    <div className={`body`}>
      <div className="body-container">
        <div style={{display: page ? "none" : "block"}}>
          {defaultPage}
        </div>
        {page}
      </div>
    </div>
    <Footer />
  </div>;
}

export default App;
