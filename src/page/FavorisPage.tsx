import { Collectivite } from "../api/Api";
import { CardData, Themed, thematiqueToUI, Thematique } from "../Card"
import "./FavorisPage.scss"
import SyntaxHighlighter from 'react-syntax-highlighter';
import { a11yDark as style } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { ReactElement } from "react";

import { devMode } from "../devMode"

export type FavorisPageProps = {
    favoris: Record<string, CardData>
}
export function FavorisPage(props: FavorisPageProps) {
    const { favoris } = props;
    console.log("jsondata:", favoris);
    return <div>Hello world</div>
}