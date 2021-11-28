import mockApiResponse from './mock_api_resp.json'
import {useMockResponse, apiurl, max_results} from "../UrlSearchParam"

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

export type ApiResponse = typeof mockApiResponse

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
  
  