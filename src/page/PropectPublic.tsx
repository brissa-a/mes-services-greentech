import { Collectivite } from "../api/Api";
import { Themed } from "../Card"
import "./ProspectPublic.scss"


export type ProspectPublicProps = {
    data: Themed & Partial<Collectivite>
}
export function ProspectPublic(props: ProspectPublicProps) {
    return <div>
        <div style={{ marginTop: "20px" }}>&lt;- Retourner a la recherche</div>
        <div style={{ marginTop: "20px", color: "rgb(255,127,0)" }}>🏙️ Prospect Public</div>
        <div style={{ marginTop: "20px", display: "flex" }}>
            <div style={{ flex: "1 1 50%", margin: "0px 12px" }}>
                <h1>Bordreaux Métropole</h1>
            </div>
            <div style={{ flex: "1 1 50%", margin: "0px 12px" }}>
            </div>
        </div>
        <div style={{ marginTop: "20px", display: "flex" }}>
            <div style={{ flex: "1 1 50%", margin: "0px 12px", display: "flex", justifyContent: "space-between"}}>
                <div>DECP</div><div>⭐👁️</div>
            </div>
            <div style={{ flex: "1 1 50%", margin: "12px" }}>
            </div>
        </div>
        <div style={{ display: "flex" }}>
            <div style={{ flex: "1 1 50%", margin: "12px" }}>
                <div>
                    Les données essentielles de la commande publique, actualisées
                    toutes les xx fois par semaine nous permettre d’effectuer des calculs
                    pour vous faire remonter les villes les plus propices à la mise en place
                    de démonstrateurs sur les critères suivants :
                </div>
                <div style={{ display: "flex", marginTop: "45px", justifyContent: "space-between" }}>
                    <div className="figures-card">
                        <div className="content">
                            <div className="figures">50%</div>
                            <div className="details">8 marchés sur 16</div>
                            <div className="text">Proportion de marchés conclus sous les seuils en 2021</div>
                        </div>
                    </div>
                    <div className="figures-card">
                        <div className="content">
                            <div className="figures">50%</div>
                            <div className="details">8 marchés sur 16</div>
                            <div className="text">Proportion de marchés conclus sous les seuils en 2021</div>
                        </div>
                    </div>
                    <div className="figures-card">
                        <div className="content">
                            <div className="figures">50%</div>
                            <div className="details">8 marchés sur 16</div>
                            <div className="text">Proportion de marchés conclus sous les seuils en 2021</div>
                        </div>
                    </div>
                </div>
            </div>
            <div style={{ flex: "1 1 50%", margin: "12.5px" }}>
                <img src="/map-placeholder.png" />
            </div>
        </div>
        <div className="charts">
            <div>
                <div>Marchés sous les seuils</div>
                <div>
                    <div>
                        <div>image</div>
                        <div>légende</div>
                    </div>
                    <div>
                        <div>image</div>
                        <div>légende</div>
                    </div>
                </div>
            </div>
            <div>Marchés innovants</div>
            <div>Marchés TPE/PME</div>
        </div>
    </div>
}