import {getStorageValue} from "./localStorage"

document.addEventListener('keydown', (event) => {
    if (event.key === 'd') {
        const devMode = getStorageValue<boolean>("devMode", false)
        localStorage.setItem("devMode", JSON.stringify(!devMode))
        window.location.reload()
    }
}, false);

const devMode = getStorageValue<boolean>("devMode", false)

export {devMode}