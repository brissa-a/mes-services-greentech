import React, { Fragment, ReactElement, useEffect, useState } from 'react';
import type { Aide, Collectivite, Marche } from '../api/Api';
import { canonicalize } from 'json-canonicalize';
import sha1 from 'sha1';
import { devMode } from '../devMode';
import "./Card.scss"
import { ClosedEye, Euro, Eye, Radar, Rocket, Star } from "./Icons"

export type Thematique = "aide" | "marché" | "collectivité" | "investisseurs"
export type Themed = { thematique: Thematique, id: string }
export type CardData = (Themed & (Partial<Aide> & Partial<Marche> & Partial<Collectivite>))

export const buildId = (obj: any) => sha1(canonicalize(obj))
Object.assign(window, { buildId })

export type ThematiqueUI = {
    color: string,
    text: string,
    textWithIcon: ReactElement | string
}
export const thematiqueToUI: Record<Thematique, ThematiqueUI> = {
    "aide": {
        color: "rgba(133, 133, 246, 1)",
        text: "Aide publique",
        textWithIcon: <Fragment>
            <Rocket style={{ height: "1em" }} />
            <span style={{ marginLeft: "5px" }}>{"Aide publique"}</span>
        </Fragment>
    },
    "marché": {
        color: "rgba(223, 207, 97, 1)", text: "Achat prévisionnel", textWithIcon: <Fragment>
            <Euro style={{ height: "1em" }} />
            <span style={{ marginLeft: "5px" }}>{"Achat prévisionnel"}</span>
        </Fragment>
    },
    "collectivité": {
        color: "rgba(255, 111, 76, 1)", text: "Propect public", textWithIcon: <Fragment>
            <Radar style={{ height: "1em" }} />
            <span style={{ marginLeft: "5px" }}>{"Propect public"}</span>
        </Fragment>
    },
    "investisseurs": {
        color: "rgba(39, 166, 88, 1)", text: "Investisseurs", textWithIcon: <Fragment>
            <Euro style={{ height: "1em" }} />
            <span style={{ marginLeft: "5px" }}>{"Investisseurs"}</span>
        </Fragment>
    }
}

export function CardPlaceholder(props: { loading: boolean }) {
    const loadingAnimation = <div className="loading-container">
        <div className="loading">.&nbsp;&nbsp;</div>
    </div>
    return <div className="card placeholder">
        {props.loading ? loadingAnimation : null}
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
    const achivedProps = props.archived ? { style: { "opacity": 0.3, "filter": "grayscale(50%)" } } : {}
    const StarIcon = props.favori
        ? ({ className, ...other }: { className: string, [x: string]: any }) => <Star className={className + " active"} {...other} />
        : ({ ...other }) => <Star {...other} />;
    const ArchiveIcon = props.archived
        ? ({ className, ...other }: { className: string, [x: string]: any }) => <Eye className={className + " active"} {...other} />
        : ({ ...other }) => <ClosedEye {...other} />
    return <div {...achivedProps} className="card"
        onMouseEnter={() => setShowDetails(true)}
        onMouseLeave={() => setShowDetails(false)}>
        <div className="fieldset" style={{ borderColor: thematiqueToUI[props.data.thematique].color }}>
            <span onClick={() => console.log(props.data)} className="legend" style={{ color: thematiqueToUI[props.data.thematique].color }}>
                {thematiqueToUI[props.data.thematique].textWithIcon}</span>
            <div style={{ margin: "15px 25px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: "3px" }}>
                    <div style={{ fontWeight: 100, fontSize: "12px", lineHeight: "22px" }}></div>
                    <div style={{ display: "flex", width: "42px", justifyContent: "space-between" }}>
                        <StarIcon className="favori-icon clickable" alt="Favori" aria-label="Favori" onClick={props.onFavori} />
                        <ArchiveIcon className="archive-icon clickable" alt="Archiver" aria-label="Archiver" onClick={props.onArchive} />
                    </div>
                </div>
                {showDetails && devMode && <div style={{ position: "absolute", top: "1px", right: "10px", fontSize: "0.5em" }}>{props.data.score}</div>}
                <a href={`/details?object-id=${props.data.id}`}>
                    <p style={{ fontWeight: "bolder", fontSize: "16px", lineHeight: "22px", marginTop: "12px" }}>
                        {props.data.titre_aide || props.data.libelle || props.data.nom || "N/A"}
                    </p>
                </a>
                <a href={`/details?object-id=${props.data.id}`}><div style={{
                    height: "32px", width: "130px", marginTop: "11px",
                    display: "flex", alignItems: "center", justifyContent: "space-around",
                    fontWeight: "lighter", fontSize: "14px", color: "rgba(133, 133, 246, 1)"
                }}>
                    <Eye style={{ height: "1em" }} alt="Favori" aria-label="Favori" />
                    <span className="txt">Voir le détail</span>
                </div></a>
            </div>
        </div>
    </div>
}