import { Collectivite } from "../api/Api";
import { Themed } from "../Card"


export type ProspectPublicProps = {
    data: Themed & Partial<Collectivite>
}
export function ProspectPublic(props: ProspectPublicProps) {
    return <div className="PropectPublic">
        <div>&lt;- Retourner a la recherche</div>
        <div>Prospect Public</div>
        <div>Bordreaux Metropole</div>
        <div><div>DECP</div><div>⭐👁️</div></div>
        <div className="col1">
            <div>
                Les données essentielles de la commande publique, actualisées
                toutes les xx fois par semaine nous permettre d’effectuer des calculs
                pour vous faire remonter les villes les plus propices à la mise en place
                de démonstrateurs sur les critères suivants :
            </div>
            <div>
                <div>
                    <div>50%</div>
                    <div>8 marchés sur 16</div>
                    <div>Proportion de marchés conclus sous les seuils en 2021</div>
                </div>
            </div>
        </div>
        <div className="col2">
            Carte
        </div>
        <div className="charts">
            <div>Chart1</div>
            <div>Chart2</div>
            <div>Chart3</div>
        </div>
    </div>
}