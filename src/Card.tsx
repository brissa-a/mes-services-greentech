import React, { Fragment, ReactElement, useEffect, useState } from 'react';
import type { Aide, Collectivite, Marche } from './api/Api';
import { canonicalize } from 'json-canonicalize';
import sha1 from 'sha1';
import { devMode } from './devMode';
//import "./Card.scss"

export type Thematique = "aide" | "marché" | "collectivité"
export type Themed = { thematique: Thematique, id: string }
export type CardData = (Themed & (Partial<Aide> & Partial<Marche> & Partial<Collectivite>))

export const buildId = (obj: any) => sha1(canonicalize(obj))
Object.assign(window, { buildId })

export type thematiqueUI = {
    color: string,
    text: string,
    textWithIcon: ReactElement | string
}
export const thematiqueToUI: Record<Thematique, thematiqueUI> = {
    "aide": {
        color: "rgba(133, 133, 246, 1)",
        text: "Aide publique",
        textWithIcon: <Fragment>
            <img style={{ height: "1em" }} src="icons/rocket.svg" alt="Favori" aria-label="Favori" />
            <span style={{ marginLeft: "5px" }}>{"Aide publique"}</span>
        </Fragment>
    },
    "marché": { color: "rgb(0,255,127)", text: "Marché public", textWithIcon: "💱 Marché public"},
    "collectivité": { color: "rgb(255,127,0)", text: "Propect public", textWithIcon: "🏙️ Propect public"}
};

export function CardPlaceholder() {
    return <div className="card placeholder">

    </div>
}

type CardProps = {
    archived: boolean,
    favori: CardData,
    data: CardData,
    maxscore: number,
    onFavori: () => void,
    onArchive: () => void
}

export function Card(props: CardProps) {
    const [showDetails, setShowDetails] = useState(false);
    const achivedProps = props.archived ? {style: {"opacity": 0.3, "filter": "grayscale(50%)"}} : {}
    const favoriPros = props.favori ? {style: {"filter": "invert(42%) sepia(93%) saturate(1352%) hue-rotate(0deg) brightness(119%) contrast(119%)"}} : {};
    return <div {...achivedProps} className="card"
        onMouseEnter={() => setShowDetails(true)}
        onMouseLeave={() => setShowDetails(false)}>
        <div className="fieldset" style={{ borderColor: thematiqueToUI[props.data.thematique].color }}>
            <span onClick={() => console.log(props.data)} className="legend" style={{ color: thematiqueToUI[props.data.thematique].color }}>
                {thematiqueToUI[props.data.thematique].textWithIcon}</span>
            <div style={{ margin: "15px 25px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: "3px" }}>
                    <div style={{ fontWeight: 100, fontSize: "12px", lineHeight: "22px" }}>Test texte gris | 2022/06</div>
                    <div style={{ display: "flex", width: "42px", justifyContent: "space-between" }}>
                        <img style={Object.assign({ height: "1em", cursor: "pointer" }, favoriPros.style)} src="icons/star.svg" alt="Favori" aria-label="Favori" onClick={props.onFavori}/>
                        <img style={{ height: "1em", cursor: "pointer" }} src="icons/trash.svg" alt="Archiver" aria-label="Archiver" onClick={props.onArchive}/>
                    </div>
                </div>
                {showDetails && devMode && <div style={{ position: "absolute", top: "1px", right: "10px", fontSize: "0.5em" }}>{props.data.score}</div>}
                <p style={{ fontWeight: "bolder", fontSize: "16px", lineHeight: "22px", marginTop: "12px" }}>
                    {props.data.titre_aide || props.data.libelle || props.data.nom || "N/A"}
                </p>
                <a href={`?object-id=${props.data.id}`}><div style={{
                    height: "32px", width: "130px", marginTop: "11px",
                    display: "flex", alignItems: "center", justifyContent: "space-around",
                    fontWeight: "lighter", fontSize: "14px", color: "rgba(133, 133, 246, 1)"
                }}>
                    <img style={{ height: "1em" }} src="icons/eye.svg" alt="Favori" aria-label="Favori" />
                    <span className="txt">Voir le détail</span>
                </div></a>
            </div>
        </div>
    </div>
}