import mockApiResponse from './mock_api_resp.json'
import { useMockResponse, apiurl, max_results } from "../UrlSearchParam"

/*
  From old FTE file
*/
export type Aide = typeof mockApiResponse.cards.aides[0]

/*
  Deduced from DECP
*/
export type Collectivite = typeof mockApiResponse.cards.collectivites[0]

/*
  deduced from DECP
*/
export type Marche = typeof mockApiResponse.cards.marches[0]

/*

*/
export type Investisseur = typeof mockApiResponse.cards.investisseurs[0]

export type ApiResponse = typeof mockApiResponse

export function buildSearchAnythingRequest(description: string, secteurs:string[], montant_min:number, montant_max:number) {
  if (useMockResponse) {
    return new Promise<ApiResponse>(res => setTimeout(() => res(mockApiResponse), 3000))
  } else {
    return fetch(apiurl, {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "fichier_aides": "Aides_detailsandname.xlsx",
        "fichier_achats_previs": "Programmation_2021-2024.xlsx",
        "fichier_decp": "decp_score.csv",
        "fichier_investisseurs": "GTIetmontant.csv",
        "descriptionSU": description,
        "fichier_vocab": "vocab.pkl",
        "fichier_embeddings_achats": "vocab_achats_previs.pkl",
        "vectorizer_achats": "vectorizer_AchatsEtat.pickle",
        "vectorizer_aides": "vectorizer_Aides.pickle",
        "faiss_index" : "aides.index",
        "faiss_index_generation" : "aides_newmod.index",
        "nb_aides": 10,
        "nb_achats_previs": 12,
        "nb_acheteur": 10,
        "montant_min": montant_min,
        "montant_max": montant_max,
        "secteurs": secteurs,    
        "cards": {
          "collectivites": [],
          "aides": [],
          "marches": [],
          "investisseurs" : []
        }
      })
    })
    .then(resp => resp.json())
  }
}

