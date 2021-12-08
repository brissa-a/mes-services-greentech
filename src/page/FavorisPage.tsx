import { Collectivite } from "../api/Api";
import { CardData, Themed, thematiqueToUI, Thematique, Card } from "../Card"
import "./FavorisPage.scss"
import SyntaxHighlighter from 'react-syntax-highlighter';
import { a11yDark as style } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { ReactElement } from "react";

import { devMode } from "../devMode"
import { LastApiResponse } from "./SearchAnything";

export type FavorisPageProps = {
    archives: Record<string, boolean>,
    favoris: Record<string, CardData>,
    toggleFavori: (cd: CardData) => void,
    toggleArchive: (cd: CardData) => void,
    lastApiResponse: LastApiResponse
}
export function FavorisPage(props: FavorisPageProps) {
    const { favoris, lastApiResponse } = props;
    const filteredCards = Object.values(favoris)
    return <div className="card-list">
        {filteredCards.map(x => <Card
            data={x}
            maxscore={lastApiResponse?.cardData.slice(-1)[0].score ?? 0}
            archived={props.archives[x.id]}
            favori={props.favoris[x.id]}
            onFavori={() => props.toggleFavori(x)}
            onArchive={() => props.toggleArchive(x)}
        />)}
    </div>

}