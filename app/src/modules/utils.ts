// Declaration to call the library
declare const Toastify: any;

/**
 * get queries params ---------------------------------------
 */
export function getUrlParams(){
    const queryString:string        = window.location.search; // "?experiment=value1&param2=value2"
    const getParams:URLSearchParams = new URLSearchParams(queryString);

    return Object.fromEntries(getParams.entries());
}
export async function fetchWithGetParams(endpoint: string, params: Record<string, string>): Promise<any> {
    // new URL
    const url:URL = new URL(endpoint);

    // query string
    Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value);
    });

    // get request
    const response:Response = await fetch(url.toString());

    if (!response.ok) {
        throw new Error(`Erreur HTTP : ${response.status}`);
    }

    // JSON data
    return response.json();
}

export async function loadHtml(htmlPath: string): Promise<string> {
    const response: Response = await fetch(htmlPath);

    if (!response.ok) {
        throw new Error(`Erreur HTTP : ${response.status}`);
    }

    return response.text();
}
/**
 * get forms input ---------------------------------------
 */
export function getInputs(): Record<string, string | null> {
    const dateFromInput = document.querySelector<HTMLInputElement>('input[name="datefrom"]');
    const dateToInput = document.querySelector<HTMLInputElement>('input[name="dateto"]');
    const indexProductInput = document.querySelector<HTMLInputElement>('input[name="indexProduct"]');

    const inputs = {
        datefrom: dateFromInput ? dateFromInput.value : null,
        dateto: dateToInput ? dateToInput.value : null,
        indexProduct: indexProductInput ? indexProductInput.value : null
    };

    return inputs;
}

/**
 * dates function ---------------------------------------------
 */


export function setDefaultDates(): void {
    if (typeof document === "undefined") {
        console.error("document is not available in this environment.");
        return;
    }

    const today: Date = new Date();
    const thirtyDaysAgo: Date = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000); // 30 days before
    const todayFormatted: string = today.toISOString().slice(0, 10);
    const thirtyDaysAgoFormatted: string = thirtyDaysAgo.toISOString().slice(0, 10);

    const dateFromInput = document.querySelector<HTMLInputElement>('input[name="datefrom"]');
    const dateToInput = document.querySelector<HTMLInputElement>('input[name="dateto"]');

    if (dateFromInput) {
        dateFromInput.value = thirtyDaysAgoFormatted;
    }

    if (dateToInput) {
        dateToInput.value = todayFormatted;
    }

}
export function verifyDates(showAlert: boolean = true): boolean {
    const inputs = getInputs();
    const dateFrom = inputs.datefrom;
    const dateTo = inputs.dateto;
    let returnValue = false;

    if (!dateFrom || !dateTo) {
        if (showAlert) {
            Toastify({
                text: "Veuillez entrer une date de départ et une date de fin",
                duration: 1500,
                position: "left",
                style: {
                    background: "#FF0000",
                }
            }).showToast();

        } else {
            // TODO: change input
        }
    } else {
        returnValue = true;
    }

    return returnValue;
}


