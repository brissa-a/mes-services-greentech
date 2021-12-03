import { Collectivite } from "../api/Api";
import { CardData, Themed } from "../Card"
import "./Details.scss"


export type DetailsProps = {
    data: CardData
}
export function Details(props: DetailsProps) {

    return <div>
        <pre>
        {JSON.stringify(props.data, null, " ")}
        </pre>
    </div>
}