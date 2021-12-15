
import React, { Fragment, useEffect, useState } from 'react';
import type { Aide, ApiResponse, Collectivite, Marche } from '../api/Api';
import { buildSearchAnythingRequest } from '../api/Api';
import { defaultDescription } from '../UrlSearchParam';
import { buildId, Card, CardData, CardPlaceholder, Thematique, Themed, thematiqueToUI, ThematiqueUI } from '../Card';
import "./SearchAnything.scss"
import { useLocalStorage } from '../localStorage';
import { Star } from '../Icons';


var to: NodeJS.Timeout | null = null;


export type LastApiResponse = {
    apiResponse: ApiResponse,
    cardDataById: Record<string, CardData>,
    cardData: CardData[]
} | null

type SearchAnythingProps = {
    archives: Record<string, boolean>,
    favoris: Record<string, CardData>,
    toggleFavori: (cd: CardData) => void,
    toggleArchive: (cd: CardData) => void,
    setLastApiResponse: (lastApiResponse: LastApiResponse) => void,
    lastApiResponse: LastApiResponse
}
export function SearchAnything(props: SearchAnythingProps) {
    const [descriptionStartup, setDescriptionStartup] = useLocalStorage<string>("description", "");
    const [controlPanel, setControlPanel] = useLocalStorage("controlPanel", {
        showHidden: false,
        "aide": true,
        "marché": true,
        "collectivité": true
    });
    const { lastApiResponse } = props
    function updateReponse() {
        console.log("updating results")
        props.setLastApiResponse(null);
        if (!descriptionStartup) return;
        buildSearchAnythingRequest(descriptionStartup).then((reponse: ApiResponse) => {
            const allcards: CardData[] | null = []
            const allcardsById: Record<string, CardData> = {}
            //Totally not uniform but easy
            var seed = 1;
            const random = () => {
                var x = Math.sin(seed++) * 10000;
                return x - Math.floor(x);
            }
            const { aides, collectivites, marches } = reponse.cards;
            const allList = [[...aides], [...collectivites], [...marches]];
            const allNames: Thematique[] = ["aide", "collectivité", "marché"]
            while (allList.some(x => x.length)) {//While one of the list still as elements
                const rand = Math.floor(random() * allList.length);//entier 0 < rand < allList.length 
                const pick = allList[rand].shift()
                const name = allNames[rand];
                if (pick) {
                    const obj = Object.assign({ thematique: name, id: buildId(pick) }, pick)
                    allcards.push(obj)
                    allcardsById[obj.id] = obj;
                }
            }
            props.setLastApiResponse({ apiResponse: reponse, cardDataById: allcardsById, cardData: allcards })
        })
    }

    function delayedUpdateReponse() {
        console.log("delaying request")
        if (to) clearTimeout(to)
        to = setTimeout(updateReponse, 600)
    }

    const shareableLink = `${window.location.origin}?description=${encodeURIComponent(descriptionStartup)}`

    const filters = (Object.entries(thematiqueToUI) as [Thematique, ThematiqueUI][]).map(([key, value]) => {
        var style = { color: value.color, "--bf500": value.color } as React.CSSProperties;
        return <div key={key} className="fr-toggle" style={style}>
            <input
                onChange={e => {
                    setControlPanel(Object.assign({}, controlPanel, { [key]: e.target.checked }))
                }}
                checked={controlPanel[key]}
                type="checkbox" className="fr-toggle__input" aria-describedby={`toggle-${key}-hint-text`} id={`toggle-${key}`} />
            <label className="fr-toggle__label" htmlFor={`toggle-${key}`}>{value.text}</label>
        </div>
    })
    const key = "showHidden"
    const showHiddenToggle = <div className="fr-toggle" >
        <input
            onChange={e => {
                setControlPanel(Object.assign({}, controlPanel, { showHidden: e.target.checked }))
            }}
            checked={controlPanel.showHidden}
            type="checkbox" className="fr-toggle__input" aria-describedby={`toggle-${key}-hint-text`} id={`toggle-${key}`}
        />
        <label className="fr-toggle__label" htmlFor={`toggle-${key}`}>Afficher les pistes écartées ({Object.values(props.archives).map(x => Number(x)).reduce((a,b)=>a+b)})</label>
    </div>
    const filteredCards = lastApiResponse
        ? lastApiResponse?.cardData.filter(x => (!props.archives[x.id] || controlPanel.showHidden) && controlPanel[x.thematique])
        : []
    return <div>
        <div className="search-anything">
            <div className="description-startup">
                <div>
                    <div className="big">Aimant greentech</div>
                </div>
                <div >
                    <div className="label">1, 2, 3... pitchez !</div>
                    <textarea
                        onChange={e => {
                            setDescriptionStartup(e.target.value)
                            delayedUpdateReponse()
                        }}
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
                <div className="control-panel white-text">
                    <div style={{ textAlign: "center", fontWeight: 700, marginBottom: "16px" }}>Vos pistes de prospection</div>
                    <div className="thematique-filter" style={{ display: "flex", justifyContent: "space-around" }}>
                        {filters}
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-around", "alignItems": "center" }}>
                        {showHiddenToggle}
                        <a className="link" href="/favoris"><div><Star style={{color: "rgb(255, 243, 76)"}}/> Mes Favoris ({Object.values(props.favoris).length})</div></a>
                    </div>
                    {/* <div style={{ textAlign: "center" }}>
                    <button className="fr-btn">
                        Toutes (7)
                    </button> &nbsp;
                    <button className="fr-btn">
                        Séletionnées (0)
                    </button> &nbsp;
                    <button className="fr-btn">
                        Archivée ({props.archives.length})
                    </button>
                </div> */}
                </div>
                <div className="card-list">
                    {filteredCards.length > 0 ? filteredCards.map(x => <Card
                        data={x}
                        maxscore={lastApiResponse?.cardData.slice(-1)[0].score ?? 0}
                        archived={props.archives[x.id]}
                        favori={props.favoris[x.id]}
                        onFavori={() => props.toggleFavori(x)}
                        onArchive={() => props.toggleArchive(x)}
                    />) :
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
}
