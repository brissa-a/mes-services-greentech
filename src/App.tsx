import React, { Fragment, ReactNode, useEffect, useState } from 'react';
import { useLocalStorage } from './localStorage'
import { buildId, Card, CardPlaceholder, Thematique, CardData } from './component/Card';

import { defaultDescription } from './UrlSearchParam';
import { SearchAnything, LastApiResponse } from "./page/SearchAnything"
import { Details } from './page/Details';
import { FavorisPage } from './page/FavorisPage';
import { Footer } from "./component/Footer"
import { Header } from "./component/Header"
import { DonnezVotreAvis } from "./component/DonnezVotreAvis"

import './App.scss';

var to: NodeJS.Timeout | null = null;

declare global {
  interface Window { _paq: any; }
}

function App() {
  const [archives, setArchives] = useLocalStorage<Record<string, boolean>>("archives", {})
  const [favoris, setFavoris] = useLocalStorage<Record<string, CardData>>("favoris", {})
  const [lastApiResponse, setLastApiResponse] = useLocalStorage<LastApiResponse>("lastApiResponse", null)
  const [pathname, setPathname] = useState(window.location.pathname)
  function goto(urlstr: string) {
    console.log(urlstr)
    const _paq = window._paq || [];
    console.log({setReferrerUrl: window.location.href})
    _paq.push(['setReferrerUrl', window.location.href]);
    const url = new URL(urlstr, window.location.origin)
    window.history.pushState({}, "", urlstr)
    window.scrollTo(0, 0)
    setPathname(url.pathname)
    console.log({setCustomUrl: window.location.href})
    _paq.push(['setCustomUrl', window.location.href]);

    // remove all previously assigned custom variables, requires Matomo (formerly Piwik) 3.0.2
    _paq.push(['deleteCustomVariables', 'page']);
    _paq.push(['trackPageView']);

    // make Matomo aware of newly added content
    // var content = document.getElementById('content');
    // _paq.push(['MediaAnalytics::scanForMedia', content]);
    // _paq.push(['FormAnalytics::scanForForms', content]);
    // _paq.push(['trackContentImpressionsWithinNode', content]);
    _paq.push(['enableLinkTracking']);
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
  const objectId = new URLSearchParams(window.location.search).get("object-id")
  const router: Record<string, ReactNode> = {
    "/favoris": <FavorisPage favoris={favoris}
      archives={archives}
      toggleFavori={toggleFavori}
      toggleArchive={toggleArchive}
      lastApiResponse={lastApiResponse}
      goto={goto} />,
    "/details": objectId && <Details data={((lastApiResponse != "loading") && lastApiResponse?.cardDataById[objectId]) || favoris[objectId] || archives[objectId]} />
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
    <DonnezVotreAvis />
    <Header goto={goto} />
    <div className={`body`}>
      <div className="body-container">
        <div style={{ display: page ? "none" : "block" }}>
          {defaultPage}
        </div>
        {page}
      </div>
    </div>
    <Footer />
  </div>;
}

export default App;
