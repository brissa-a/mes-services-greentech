import mockApiResponse from './mock_api_resp.json'
import {useMockResponse, apiurl, max_results} from "../UrlSearchParam"

export type Aide = {
    "titre_aide": string,
    "aide_detail": string,
    "aide_detail_clean": string,
    "score": number,
    "contact": string,
    "funding_source_url": string
}

export type CollectiviteScore = null | {
    "proportion_numerateur": string,
    "proportion_denominateur": string,
    "proportion": number
}

export type Collectivite = {
    "nom": string,
    "score": {
        "innovation": CollectiviteScore,
        "sous_les_seuils": CollectiviteScore,
        "petites_entreprises": CollectiviteScore
    },
    "scoretotal": number
}

export type Marche = {
    "libelle": string,                  //"MS_S\u00e9rigraphies, vitrages",
    "domaine": string,                  //"Transport de personnes et de biens - V\u00e9hicules",
    "groupe_marchandise_code": string,  //"34.03.01",
    "groupe_marchandise_nom": string,   //"PIECES DETACHEES ET ACCESSOIRES VEHICULES TERRESTRES",
    "acheteur": string,                 //"Minist\u00e8re de l'Int\u00e9rieur",
    "entite_porteuse": string,          //"Etablissement central logistique de la police nationale",
    "contexte": string,                 //"Renouvellement march\u00e9 existant",
    "duree_mois": number,               //48.0,
    "annee": number,                    //2023.0,
    "depense_annualisee": string,       //"Compris entre 200 000 \u20ac et 1 M\u20ac",
    "depense_min": number | null,              //200000,
    "depense_max": number,              //1000000,
    "score": number,                    //1.6401309967041016
}

export type ApiResponse = {
    "fichier_aides": string,
    "fichier_achats_previs": string,
    "fichier_embeddings_achats": string,
    "fichier_decp": string,
    "descriptionSU": string,
    "fichier_vocab": string,
    "nb_aides": number,
    "nb_achats_previs": number,
    "cards": {
        "collectivites": Collectivite[],
        "aides": Aide[],
        "marches": Marche[]
    }
}

export function buildSearchAnythingRequest(description: string) {
    if (useMockResponse) {
      return  new Promise<ApiResponse>(res => setTimeout(() => res(mockApiResponse), 3000))
    } else {
      return fetch(apiurl, {
        method: "POST",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "fichier_aides": "Aides_detailsandname.xlsx",
          "descriptionSU": description,
          "fichier_vocab": "vocab.pkl",
          "nb_aides": max_results,
          "resultats_aides": [],
          "score_max": 0
        })
      })
      .then(resp => resp.json())      
    }
  }
  
  