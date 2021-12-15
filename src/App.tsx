import React, { Fragment, ReactNode, useEffect, useState } from 'react';
import { useLocalStorage } from './localStorage'
import { buildId, Card, CardPlaceholder, Thematique, CardData } from './Card';

import { page, objectId, defaultDescription } from './UrlSearchParam';
import { SearchAnything, LastApiResponse } from "./page/SearchAnything"
import { Details } from './page/Details';
import { FavorisPage } from './page/FavorisPage';

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
    "/details": objectId && <Details data={lastApiResponse?.cardDataById[objectId] || favoris[objectId] || archives[objectId]} />
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
  return (
    <div className="App">
      <div className="header">
        <div className="left-side">
          <img className="msg-icon" src="/icon-ministere.png" style={{ transform: "translateX(-20px)" }} />
          <img className="msg-icon" style={{ marginLeft: "35px", transform: "scale(0.8)" }} src="/icon-msg-txt-beta.png" />
        </div>
      </div>
      <div className={`body`}>
        <div className="body-container">
          {page}
        </div>
      </div>
      <footer className="fr-footer" role="contentinfo" id="footer">
    <div className="fr-container">
        <div className="fr-footer__body">
            <div className="fr-footer__brand fr-enlarge-link">
                <a href="/" title="Retour à l’accueil">
                    <p className="fr-logo" title="république française">
                        république
                        <br/>française
                    </p>
                </a>
            </div>
            <div className="fr-footer__content">
                <p className="fr-footer__content-desc">Lorem [...] elit ut.</p>
                <ul className="fr-footer__content-list">
                    <li className="fr-footer__content-item">
                        <a className="fr-footer__content-link" href="https://legifrance.gouv.fr">legifrance.gouv.fr</a>
                    </li>
                    <li className="fr-footer__content-item">
                        <a className="fr-footer__content-link" href="https://gouvernement.fr">gouvernement.fr</a>
                    </li>
                    <li className="fr-footer__content-item">
                        <a className="fr-footer__content-link" href="https://service-public.fr">service-public.fr</a>
                    </li>
                    <li className="fr-footer__content-item">
                        <a className="fr-footer__content-link" href="https://data.gouv.fr">data.gouv.fr</a>
                    </li>
                </ul>
            </div>
        </div>
        <div className="fr-footer__bottom">
            <ul className="fr-footer__bottom-list">
                <li className="fr-footer__bottom-item">
                    <a className="fr-footer__bottom-link" href="#">Plan du site</a>
                </li>
                <li className="fr-footer__bottom-item">
                    <a className="fr-footer__bottom-link" href="#">Accessibilité: non/partiellement/totalement conforme</a>
                </li>
                <li className="fr-footer__bottom-item">
                    <a className="fr-footer__bottom-link" href="#">Mentions légales</a>
                </li>
                <li className="fr-footer__bottom-item">
                    <a className="fr-footer__bottom-link" href="#">Données personnelles</a>
                </li>
                <li className="fr-footer__bottom-item">
                    <a className="fr-footer__bottom-link" href="#">Gestion des cookies</a>
                </li>
            </ul>
            <div className="fr-footer__bottom-copy">
                <p>Sauf mention contraire, tous les contenus de ce site sont sous <a href="https://github.com/etalab/licence-ouverte/blob/master/LO.md" target="_blank">licence etalab-2.0</a>
                </p>
            </div>
        </div>
    </div>
</footer>

    </div>
  );
}

export default App;
