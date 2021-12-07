import {getStorageValue} from "./localStorage"

document.addEventListener('keydown', (event) => {
    if (event.altKey && event.shiftKey && event.key === 'D') {
        const devMode = getStorageValue<boolean>("devMode", false)
        localStorage.setItem("devMode", JSON.stringify(!devMode))
        window.location.reload()
    }
}, false);

const devMode = getStorageValue<boolean>("devMode", false)

export {devMode}