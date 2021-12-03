import { Collectivite } from "../api/Api";
import { CardData, Themed, thematiqueToUI } from "../Card"
import "./Details.scss"
import SyntaxHighlighter from 'react-syntax-highlighter';
import { a11yDark as style } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { ReactElement } from "react";

export type DetailsProps = {
    data: CardData
}

function browseObject(obj: any, todo: (prefix: string[], key: string, value: any) => void, prefix: string[] = []) {
    console.log("browseObject", obj);
    for (const [key, value] of Object.entries(obj)) {
        if (value != null && typeof value === 'object') {
            prefix.push(key)
            browseObject(value, todo, prefix);
            prefix.pop()
        } else {
            todo(prefix, key, value)
        }
    }
}

export function Details(props: DetailsProps) {
    const { data } = props;
    const toDisplay: ReactElement[] = [];
    const thematiqueUI = thematiqueToUI[data.thematique]
    browseObject(data, (prefix, key, value) => {
        const fullname = [...prefix, key].join("/")
        if (value) {
            toDisplay.push(<div key={key} style={{ margin: "20px" }}>
                <div style={{ margin: "20px 0px", color: thematiqueUI.color }}>{fullname}</div>
                <div style={{ margin: "20px 0px" }}>{JSON.stringify(value)}</div>
                <div style={{ width: "200px", border: "0.5px solid rgba(206, 206, 206, 0.2)" }}></div>
            </div>)
        }
    })
    return <div style={{ display: "flex", flexWrap: "wrap" }}>
        {toDisplay}
        {/* <div style={{ width: "800px", border: `2px solid ${thematiqueUI.color}` }}>
            <SyntaxHighlighter language="javascript" style={style}>
                {JSON.stringify(data, null, " ")}
            </SyntaxHighlighter>
        </div> */}
    </div>
}