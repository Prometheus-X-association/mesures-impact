
interface Config {
    [key: string]: any; //
}

// Variable to stock config
let config: Promise<Config> | null = null;

/**
 * load configuration file
 * @returns json Object
 */
async function loadConfig(): Promise<Config> {
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
export async function getConfig(): Promise<Config> {
    if (!config) {
        config = loadConfig();
    }
    return await config;
}