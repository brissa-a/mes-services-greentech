import { Collectivite } from "../api/Api";
import { CardData, Themed, thematiqueToUI, Thematique } from "../Card"
import "./Details.scss"
import SyntaxHighlighter from 'react-syntax-highlighter';
import { a11yDark as style } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { ReactElement } from "react";

import { devMode } from "../devMode"
import { Back } from "../Icons";

function browseObject(obj: any,
    onLeaf: (prefix: string[], key: string, value: any) => void, prefix: string[] = []) {
    console.log("browseObject", obj);
    for (const [key, value] of Object.entries(obj)) {
        if (value != null && typeof value === 'object') {
            prefix.push(key)
            browseObject(value, onLeaf, prefix);
            prefix.pop()
        } else {
            onLeaf(prefix, key, value)
        }
    }
}

export const thematiqueToFieldsConf: Record<Thematique, Record<string, string | boolean>> = {
    "aide": {
        titre_aide: "Nom",
        funding_source_url: "Url source",
        aide_detail: "Détails de l'aide",
        contact: "Qui contacter ?"
    },
    "marché": {
        libelle: "Nom",
        groupe_marchandise_nom: "Groupe Marchandise",
        duree_mois: "Durée (en mois)",
        annee: "Année",
        depense_annualisee: "Dépense annualisée",
        acheteur: "Acheteur",
        entite_porteuse: "Entité Porteuse",
        contexte: "Contexte"
    },
    "collectivité": {
        nom: "Nom"
    }
};

export type DetailsProps = {
    data: CardData
}
export function Details(props: DetailsProps) {
    const { data } = props;
    console.log("jsondata:", data);
    const toDisplay: ReactElement[] = [];
    const thematiqueUI = thematiqueToUI[data.thematique]
    const fieldsConf = thematiqueToFieldsConf[data.thematique]
    browseObject(data, (prefix, key, value) => {
        const fullname = [...prefix, key].join("/")
        if (value) {
            const humanReadableName = fieldsConf[fullname]
            if (humanReadableName) {
                const devTitle = (devMode && humanReadableName) ? <span style={{ filter: "opacity(25%)" }}>({fullname})</span> : null
                toDisplay.push(<div key={key} style={{ margin: "20px" }}>
                    <div style={{ margin: "20px 0px", color: thematiqueUI.color }}>{humanReadableName || fullname} {devTitle}</div>
                    <div style={{ margin: "20px 0px" }} dangerouslySetInnerHTML={{ __html: value + "" }}></div>
                    <div style={{ width: "200px", border: "0.5px solid rgba(206, 206, 206, 0.2)" }}></div>
                </div>)
            } else if (devMode) {
                toDisplay.push(<div key={key} style={{ margin: "20px", filter: "opacity(25%)" }}>
                    <div style={{ margin: "20px 0px", color: thematiqueUI.color }}>{humanReadableName || fullname}</div>
                    <div style={{ margin: "20px 0px" }} dangerouslySetInnerHTML={{ __html: value + "" }}></div>
                    <div style={{ width: "200px", border: "0.5px solid rgba(206, 206, 206, 0.2)" }}></div>
                </div>)
            }
        }
    })
    return <div>
        <div style={{display: "flex"}}>
            <div style={{color:"rgba(133, 133, 246, 1)", cursor: "pointer"}} onClick={() => window.history.back()}><Back height="13"/>  Retour</div>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap" }}>
            {toDisplay}
            {/* <div style={{ width: "800px", border: `2px solid ${thematiqueUI.color}` }}>
            <SyntaxHighlighter language="javascript" style={style}>
                {JSON.stringify(data, null, " ")}
            </SyntaxHighlighter>
        </div> */}
        </div>
    </div>
}