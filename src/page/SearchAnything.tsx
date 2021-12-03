
import React, { Fragment, useEffect, useState } from 'react';
import type { Aide, ApiResponse, Collectivite, Marche } from '../api/Api';
import { buildSearchAnythingRequest } from '../api/Api';
import { defaultDescription } from '../UrlSearchParam';
import { buildId, Card, CardData, CardPlaceholder, Thematique, Themed } from '../Card';
import "./SearchAnything.scss"


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
    const [descriptionStartup, setDescriptionStartup] = useState<string>(defaultDescription);
    const { lastApiResponse } = props
    function updateReponse() {
        console.log("updating results")
        props.setLastApiResponse(null);
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
                const pick = allList[rand].pop()
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

    //useEffect(delayedUpdateReponse, [descriptionStartup]);
    console.log(descriptionStartup)
    const shareableLink = `${window.location.origin}?description=${encodeURIComponent(descriptionStartup)}`

    return <div className="search-anything">
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
            <div className="control-panel white-text">
                <div style={{ textAlign: "center", fontWeight: 700, marginBottom: "16px" }}>Vos pistes de prospection</div>
                <div>
                    <div className="fr-toggle">
                        <input type="checkbox" className="fr-toggle__input" aria-describedby="toggle-698-hint-text" id="toggle-698" />
                        <label className="fr-toggle__label" htmlFor="toggle-698">Aide publique</label>
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
                        Archivée ({props.archives.length})
                    </button>
                </div>
            </div>
            <div className="card-list">
                {lastApiResponse ? lastApiResponse?.cardData.map(x => <Card
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
}
