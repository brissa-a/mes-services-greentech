import { Collectivite } from "../api/Api";
import { CardData, Themed, thematiqueToUI, Thematique, Card } from "../component/Card"
import "./FavorisPage.scss"
import SyntaxHighlighter from 'react-syntax-highlighter';
import { a11yDark as style } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { ReactElement } from "react";

import { devMode } from "../devMode"
import { LastApiResponse } from "./SearchAnything";
import { Back } from "../component/Icons";

export type FavorisPageProps = {
    archives: Record<string, boolean>,
    favoris: Record<string, CardData>,
    toggleFavori: (cd: CardData) => void,
    toggleArchive: (cd: CardData) => void,
    lastApiResponse: LastApiResponse,
    goto: (pathname:string) => void
}
export function FavorisPage(props: FavorisPageProps) {
    const { favoris, lastApiResponse } = props;
    const filteredCards = Object.values(favoris)
    return <div>
        <div style={{ display: "flex" }}>
            <div style={{ color: "rgba(133, 133, 246, 1)", cursor: "pointer" }} onClick={() => window.history.back()}><Back height="13" />  Retour</div>
        </div>
        <div>
            <h2 style={{margin: "25px 0px"}}>Mes Favoris ({filteredCards.length})</h2>
        </div>
        <div className="card-list">
        {lastApiResponse != "loading" && filteredCards.map(x => <Card
            data={x}
            maxscore={lastApiResponse?.cardData.slice(-1)[0].score ?? 0}
            archived={props.archives[x.id]}
            favori={props.favoris[x.id]}
            onFavori={() => props.toggleFavori(x)}
            onArchive={() => props.toggleArchive(x)}
            goto={props.goto}
        />)}
    </div>
    </div>

}