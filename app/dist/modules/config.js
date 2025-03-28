// Variable to stock config
let config = null;
/**
 * load configuration file
 * @returns json Object
 */
async function loadConfig() {
    const response = await fetch('./confs/config.json');
    if (!response.ok) {
        throw new Error(`Erreur HTTP : ${response.status}`);
    }
    return await response.json();
}
/**
 * Exporte la configuration
 * @returns Objet json de la configuration
 */
export async function getConfig() {
    if (!config) {
        config = loadConfig();
    }
    return await config;
}
