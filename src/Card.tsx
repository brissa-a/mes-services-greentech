import React, { Fragment, useEffect, useState } from 'react';
import type { Aide } from './api/Api';

const thematiqueToUI = {
    "aide": {
        color: "rgba(133, 133, 246, 1)",
        text: <Fragment>
            <img style={{ height: "1em" }} src="icons/rocket.svg" alt="Favori" aria-label="Favori" />
            <span style={{ marginLeft: "5px" }}>Aide publique</span>
        </Fragment>
    },
    "marché": { color: "rgb(0,255,127)", text: "💱 Marché public" },
    "collectivité": { color: "rgb(127,0,255)", text: "🏙️ Collectivité" }
};

export function CardPlaceholder() {
    return <div className="card placeholder">

    </div>
}

export function Card(props: { aide: Aide, maxscore: number }) {
    const [showDetails, setShowDetails] = useState(false);
    return <div className="card"
        onMouseEnter={() => setShowDetails(true)}
        onMouseLeave={() => setShowDetails(false)}>
        <div className="fieldset" style={{ borderColor: thematiqueToUI["aide"].color }}>
            <span className="legend" style={{ color: thematiqueToUI["aide"].color }}>{thematiqueToUI["aide"].text}</span>
            {/* <div style={{ height: "1px", backgroundColor: "red", width: ((1 - (props.aide.score / props.maxscore)) * 100) + "%" }}></div>
      <br /> */}
            <div style={{ margin: "15px 25px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: "3px" }}>
                    <div style={{ fontWeight: 100, fontSize: "12px", lineHeight: "22px" }}>Test texte gris | 2022/06</div>
                    <div style={{ display: "flex", width: "42px", justifyContent: "space-between" }}>
                        <img style={{ height: "1em" }} src="icons/star.svg" alt="Favori" aria-label="Favori" />
                        <img style={{ height: "1em" }} src="icons/trash.svg" alt="Favori" aria-label="Archiver" />
                    </div>
                </div>
                {showDetails && <div style={{ position: "absolute", top: "1px", right: "10px", fontSize: "0.5em" }}>{props.aide.score}</div>}
                <p style={{ fontWeight: "bolder", fontSize: "16px", lineHeight: "22px", marginTop: "12px" }}>
                    {props.aide.titre_aide}
                </p>
                <a href="#"><div style={{
                    height: "32px", width: "130px", marginTop: "11px",
                    display: "flex", alignItems: "center", justifyContent: "space-around",
                    fontWeight: "lighter", fontSize: "14px", color: "rgba(133, 133, 246, 1)"
                }}>
                    <img style={{ height: "1em" }} src="icons/eye.svg" alt="Favori" aria-label="Favori" />
                    <span className="txt">Voir le détail</span>
                </div></a>
                {/* {showDetails && <br />}
          {showDetails && <div>{props.aide.aide_detail_clean}</div>}
          {showDetails && <div><i><span dangerouslySetInnerHTML={{ __html: props.aide.contact }}></span></i></div>} */}
            </div>
        </div>{/*.fieldset*/}
    </div>
}