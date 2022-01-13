
import React, { Fragment, useEffect, useState } from 'react';
import type { Aide, ApiResponse, Collectivite, Marche } from '../api/Api';
import { buildSearchAnythingRequest } from '../api/Api';
import { defaultDescription } from '../UrlSearchParam';
import { buildId, Card, CardData, CardPlaceholder, Thematique, Themed, thematiqueToUI, ThematiqueUI } from '../component/Card';
import "./SearchAnything.scss"
import { useLocalStorage } from '../localStorage';
import { Star } from '../component/Icons';


var to: NodeJS.Timeout | null = null;

const allSecteur = [
    'Agriculture durable',
    'Bâtiments et ville durable',
    'Eau biodiversité et biomimétisme',
    'Energies renouvelables',
    'Santé et environnement',
    'Economie circulaire',
    'Efficacité numérique',
    'Gestion des risques',
    'Mobilité durable',
    'Numérique durable'
]

const defaultMontantMin = 0
const defaultMontantMax = 200000000

export type LastApiResponse = {
    apiResponse: ApiResponse,
    cardDataById: Record<string, CardData>,
    cardData: CardData[]
} | null | "loading"

type SearchAnythingProps = {
    archives: Record<string, boolean>,
    favoris: Record<string, CardData>,
    toggleFavori: (cd: CardData) => void,
    toggleArchive: (cd: CardData) => void,
    setLastApiResponse: (lastApiResponse: LastApiResponse) => void,
    lastApiResponse: LastApiResponse,
    goto: (pathname:string) => void
}
export function SearchAnything(props: SearchAnythingProps) {
    const [descriptionStartup, setDescriptionStartup] = useLocalStorage<string>("description", "");
    const [secteurs, setSecteurs] = useLocalStorage<string[]>("secteurs", [])
    const [montant_min, setMontantMin] = useLocalStorage("montant_min", defaultMontantMin)
    const [montant_max, setMontantMax] = useLocalStorage("montant_max", defaultMontantMax)
    const [temp_montant_min, setTempMontantMin] = useState(montant_min)
    const [temp_montant_max, setTempMontantMax] = useState(montant_max)
    type ControlPanel = { showHidden: boolean } & Record<Thematique, boolean>
    const [controlPanel, setControlPanel] = useLocalStorage<ControlPanel>("controlPanel", {
        showHidden: false,
        "aide": true,
        //"marché": true,
        "collectivité": true,
        "investisseurs": true
    });
    const { lastApiResponse } = props
    function updateReponse() {
        props.setLastApiResponse(null);
        console.log("Requesting", { descriptionStartup, secteurs, montant_min, montant_max })
        if (!descriptionStartup) return;
        props.setLastApiResponse("loading");
        buildSearchAnythingRequest(descriptionStartup, secteurs, montant_min, montant_max).then((reponse: ApiResponse) => {
            console.log("Got reponse for", { descriptionStartup, secteurs, montant_min, montant_max })
            const allcards: CardData[] | null = []
            const allcardsById: Record<string, CardData> = {}
            //Totally not uniform but easy
            var seed = 1;
            const random = () => {
                var x = Math.sin(seed++) * 10000;
                return x - Math.floor(x);
            }
            const { aides, collectivites, marches, investisseurs } = reponse.cards;
            const allList = [[...aides], [...collectivites], [...investisseurs]];
            const allNames: Thematique[] = ["aide", "collectivité", "investisseurs"]
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

    const shareableLink = `${window.location.origin}?description=${encodeURIComponent(descriptionStartup)}`

    const filters = (Object.entries(thematiqueToUI) as [Thematique, ThematiqueUI][]).map(([key, value]) => {
        var style = { color: value.color, "--bf500": value.color, "margin": '0 1em' } as React.CSSProperties;
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
        <label className="fr-toggle__label" htmlFor={`toggle-${key}`}>Afficher les pistes écartées ({Object.values(props.archives).map(x => Number(x)).reduce((a, b) => a + b, 0)})</label>
    </div>
    const filteredCards = (lastApiResponse && lastApiResponse != "loading")
        ? lastApiResponse?.cardData.filter(x => (!props.archives[x.id] || controlPanel.showHidden) && controlPanel[x.thematique])
        : []
    return <div>
        <div className="search-anything">
            <div className="query-pannel">
                <div>
                    <div className="big">Aimant greentech</div>
                </div>
                <div className="description-startup">
                    <div className="label">1, 2, 3... pitchez !</div>
                    <textarea
                        onChange={e => {
                            setDescriptionStartup(e.target.value)
                        }}
                        className=""
                        value={descriptionStartup}
                        placeholder="ex: Nous sommes une startup spécialisé dans le tri des déchets métalliques et...">
                    </textarea>
                </div>
                <div className="secteur">
                    <fieldset className="fr-fieldset fr-fieldset--inline">
                        <legend className="label" id='checkboxes-inline-legend'>
                            Thématiques
                        </legend>
                        <div className="fr-fieldset__content">
                            {allSecteur.map(secteur => <div className="fr-checkbox-group fr-checkbox-group--sm">
                                <input type="checkbox" id={secteur} name={secteur} checked={secteurs.includes(secteur)} onChange={e => {
                                    e.currentTarget.checked ? setSecteurs([...secteurs, secteur]) : setSecteurs(secteurs.filter(x => x != secteur))
                                }} />
                                <label className="fr-label" htmlFor={secteur}>{secteur}</label>
                            </div>)}
                        </div>
                    </fieldset>

                </div>
                <div className="montants">
                    <label className="label">Si vous cherchez un investisseur</label>
                    <div className="inputs">
                        <input className="fr-input" type="number" id="montant_min" name="montant_min" value={temp_montant_min}
                            onChange={e => setTempMontantMin(e.currentTarget.valueAsNumber)}
                            onBlur={e => {
                                if (e.currentTarget.valueAsNumber > montant_max) {
                                    setTempMontantMin(montant_max)
                                    setMontantMin(montant_max)
                                } else {
                                    setTempMontantMin(e.currentTarget.valueAsNumber)
                                    setMontantMin(e.currentTarget.valueAsNumber)
                                }
                            }}
                        />
                        <input className="fr-input" type="number" id="montant_max" name="montant_max" value={temp_montant_max}
                            onChange={e => setTempMontantMax(e.currentTarget.valueAsNumber)}
                            onBlur={e => {
                                if (montant_min > e.currentTarget.valueAsNumber) {
                                    setTempMontantMax(montant_min)
                                    setMontantMax(montant_min)
                                } else {
                                    setTempMontantMax(e.currentTarget.valueAsNumber)
                                    setMontantMax(e.currentTarget.valueAsNumber)
                                }
                            }} />
                    </div>
                </div>
                <div className="validate-btn-row">
                    <button className="fr-btn validate-btn" onClick={updateReponse}>
                        Valider
                    </button>
                </div>
                <div style={{ margin: "10px" }}>
                    {/* <a href={shareableLink}>Shareable link</a> */}
                </div>
            </div>
            <div className="resultats">
                <div style={{ display: "flex", justifyContent: "space-around" }}>
                    <div className="control-panel white-text">
                        <div style={{ textAlign: "center", fontWeight: 700, marginBottom: "16px" }}>Vos pistes de prospection</div>
                        <div className="thematique-filter" style={{ display: "flex", justifyContent: "space-around", "flexWrap": "wrap" }}>
                            {filters}
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-around", "alignItems": "center" }}>
                            {showHiddenToggle}
                            <a className="link" onClick={e => {
                                e.preventDefault()
                                props.goto("/favoris");
                            }} href={"/favoris"}><div><Star style={{ color: "rgb(255, 243, 76)" }} /> Mes Favoris ({Object.values(props.favoris).length})</div></a>
                        </div>
                    </div>
                </div>
                <div className="card-list">
                    {(filteredCards.length > 0 && lastApiResponse != "loading") ? filteredCards.map(x => thematiqueToUI[x.thematique] && <Card
                        data={x}
                        maxscore={lastApiResponse?.cardData.slice(-1)[0].score ?? 0}
                        archived={props.archives[x.id]}
                        favori={props.favoris[x.id]}
                        onFavori={() => props.toggleFavori(x)}
                        onArchive={() => props.toggleArchive(x)}
                        goto={props.goto}
                    />) :
                        <Fragment>
                            <CardPlaceholder loading={lastApiResponse == "loading"}/>
                            <CardPlaceholder loading={lastApiResponse == "loading"}/>
                            <CardPlaceholder loading={lastApiResponse == "loading"}/>
                            <CardPlaceholder loading={lastApiResponse == "loading"}/>
                            <CardPlaceholder loading={lastApiResponse == "loading"}/>
                            <CardPlaceholder loading={lastApiResponse == "loading"}/>
                            <CardPlaceholder loading={lastApiResponse == "loading"}/>
                            <CardPlaceholder loading={lastApiResponse == "loading"}/>
                            <CardPlaceholder loading={lastApiResponse == "loading"}/>
                        </Fragment>}
                </div>
            </div>
        </div>
    </div>
}
