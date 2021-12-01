
import React, { Fragment, useEffect, useState } from 'react';
import type { Aide, ApiResponse, Collectivite, Marche } from '../api/Api';
import { buildSearchAnythingRequest } from '../api/Api';
import { defaultDescription } from '../UrlSearchParam';
import { buildId, Card, CardData, CardPlaceholder, Thematique, Themed } from '../Card';
import "./SearchAnything.scss"

declare global {
    interface Window { lastApiResponse: ApiResponse; }
}

var to: NodeJS.Timeout | null = null;

type SearchAnythingProps = {
    archives:Record<string, boolean>,
    favoris : Record<string, CardData>,
    toggleFavori: (cd: CardData) => void,
    toggleArchive: (cd: CardData) => void
}
export function SearchAnything(props:SearchAnythingProps) {
    const [reponse, setReponse] = useState<ApiResponse | null>(null);
    const [descriptionStartup, setDescriptionStartup] = useState<string>(defaultDescription);

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
    const allcards: CardData[] | null = []
    if (reponse) {
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
            if (pick) allcards.push(Object.assign({ thematique: name, id: buildId(pick) }, pick))
        }
    }

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
                        Archivée ({props.archives.length})
                    </button>
                </div>
            </div>
            <div className="card-list">
                {reponse ? allcards.map(x => <Card
                    data={x}
                    maxscore={allcards.slice(-1)[0].score ?? 0}
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
