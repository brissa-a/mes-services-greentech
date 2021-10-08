import React, { useEffect, useState } from 'react';
import './App.css';
import reponse_exemple from "./response_exemple.json"

console.log(reponse_exemple)

const params = new URLSearchParams(window.location.search)
const apiurl = params.get("api-url")  || 'https://alexisb.pythonanywhere.com/getAides/'
console.log("Using api url: ", apiurl)

type AidePublique =  {
  "titre_aide": string,
  "aide_detail": string,
  "aide_detail_clean": string,
  "contact": string
}

type reponseType = {
  "fichier_aides": string,
  "descriptionSU": string,
  "fichier_vocab": string,
  "nb_aides": number,
  "resultats_aides": AidePublique[]
}

function OneResult(props: {aide: AidePublique}) {
    return <div style={{border: "1px solid black", padding: "10px 20px"}}>
      <div>{props.aide.titre_aide}</div>
      
      <div dangerouslySetInnerHTML={{__html: props.aide.contact}}>{}</div>
    </div>
}

function buildAidesRequest(description : string) {
  return fetch(apiurl, {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "fichier_aides" : "Aides_detailsandname.xlsx",
        "descriptionSU": description,
        "fichier_vocab" :"vocab.pkl",
        "nb_aides" : 10,
        "resultats_aides":[]
      })
    })
    .then(resp => resp.json())
}

var to : NodeJS.Timeout | null = null;

declare global {
  interface Window { lastApiResponse: reponseType; }
}

function App() {
  const defaultValue = null
  const [reponse, setReponse] = useState<reponseType | null>(null);
  const [descriptionStartup, setDescriptionStartup] = useState<string>("");
  function updateReponse() {
    console.log("updating results")
    setReponse(null);
    buildAidesRequest(descriptionStartup || "Nous sommes une startup spécialisé dans le tri des déchets métalliques").then(json => {
      setReponse(json)
      window.lastApiResponse = json
    })
  }
  function delayedUpdateReponse() {
    console.log("delaying request")
    if (to) clearTimeout(to)
    to = setTimeout(updateReponse, 600)
  }
  useEffect(delayedUpdateReponse, [descriptionStartup]);
  console.log(descriptionStartup)

  return (
    <div className="App">
      <div className="description-startup">
        <textarea
          onChange={e => setDescriptionStartup(e.target.value)}
          style={{width: "50vw", height: "50vh"}}
          value={descriptionStartup}
          placeholder="ex: Nous sommes une startup spécialisé dans le tri des déchets métalliques et...">
        </textarea>
      </div>
      <div className="resultats">
        {reponse ? reponse.resultats_aides.map(x => <OneResult aide={x}/>) : "It's loading..."}
      </div>
    </div>
  );
}

export default App;
