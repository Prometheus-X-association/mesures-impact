/**
 * get queries params ---------------------------------------
 */
export function getUrlParams() {
    const queryString = window.location.search; // "?experiment=value1&param2=value2"
    const getParams = new URLSearchParams(queryString);
    return Object.fromEntries(getParams.entries());
}
export async function fetchWithGetParams(endpoint, params) {
    // new URL
    const url = new URL(endpoint);
    // query string
    Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value);
    });
    // get request
    const response = await fetch(url.toString());
    if (!response.ok) {
        throw new Error(`Erreur HTTP : ${response.status}`);
    }
    // JSON data
    return response.json();
}
export async function loadHtml(htmlPath) {
    const response = await fetch(htmlPath);
    if (!response.ok) {
        throw new Error(`Erreur HTTP : ${response.status}`);
    }
    return response.text();
}
/**
 * get forms input ---------------------------------------
 */
export function getInputs() {
    const dateFromInput = document.querySelector('input[name="datefrom"]');
    const dateToInput = document.querySelector('input[name="dateto"]');
    const indexProductInput = document.querySelector('input[name="indexProduct"]');
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
export function setDefaultDates() {
    if (typeof document === "undefined") {
        console.error("document is not available in this environment.");
        return;
    }
    const today = new Date();
    const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000); // 30 days before
    const todayFormatted = today.toISOString().slice(0, 10);
    const thirtyDaysAgoFormatted = thirtyDaysAgo.toISOString().slice(0, 10);
    const dateFromInput = document.querySelector('input[name="datefrom"]');
    const dateToInput = document.querySelector('input[name="dateto"]');
    if (dateFromInput) {
        dateFromInput.value = thirtyDaysAgoFormatted;
    }
    if (dateToInput) {
        dateToInput.value = todayFormatted;
    }
}
export function verifyDates(showAlert = true) {
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
        }
        else {
            // TODO: change input
        }
    }
    else {
        returnValue = true;
    }
    return returnValue;
}
