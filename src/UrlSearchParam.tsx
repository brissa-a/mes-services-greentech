const params = new URLSearchParams(window.location.search)
export const apiurl = params.get("api-url") || 'https://alexisb.pythonanywhere.com/getAides/'
export const max_results_str = params.get("max-results")
export const max_results = max_results_str && JSON.parse(max_results_str) || 30
export const defaultDescription = params.get("description") || "Nous sommes une startup spécialisé dans le tri des déchets métalliques"
export const useMockResponse = params.get("use-mock-response") === 'true'

console.log(`Hidden params:
&max-results=${max_results}
&api-url=${apiurl}
&description=${defaultDescription}
&use-mock-response=${useMockResponse}`)
