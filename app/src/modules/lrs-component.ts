/**
 *
 */
import { getInputs, verifyDates, fetchWithGetParams } from './utils.js';
import { getConfig } from './config.js';
import { displayAsset } from './interface.js';

let lrs_accumulation: Array<any> = [];
let nb_accumulation: number = 0;

export async function prepareLrsComponent(indexProduct: number, index: number): Promise<void> {
    const config = await getConfig();
    const idButton = config.products[indexProduct].lrs[index].button;
    const btn = document.getElementById(idButton);

    if (btn) {
        btn.onclick = function () {
            const datesOk = verifyDates();
            if (datesOk === true) {
                displayAsset('wait', "block");

                lrs_accumulation = [];
                getLrsData(indexProduct, index, 1);
            }
        };
    }
}

async function getLrsData(indexProduct: number, index: number, page: number): Promise<void> {
    try {
        const inputs = getInputs();
        const config = await getConfig();
        const currentLrs = config.products[indexProduct].lrs[index];

        const url = currentLrs.url;
        const product_index_lrs = currentLrs.product_index_lrs;
        const coursename = currentLrs.coursename;
        const verbs = currentLrs.verbs;
        const limit_by_request = currentLrs.limit_by_request;

        try {
            const params = {
                datefrom: inputs.datefrom ?? '',
                dateto: inputs.dateto ?? '',
                indexLRS: product_index_lrs ?? '',
                coursename: coursename ?? '',
                verbs: verbs ?? '',
                limit: limit_by_request ?? '',
                page: String(page)
            };

            const data = await fetchWithGetParams(url, params);
            updateLrsComponent(indexProduct, index, data);

        } catch (error) {
            console.error('Error loading LRS data:', error);
        }

    } catch (error) {
        console.error('Error loading config:', error);
    }
}

/**
 * update component
 */
async function updateLrsComponent(indexProduct: number, index: number, data: any): Promise<void> {
    const config = await getConfig();
    const currentLrs = config.products[indexProduct].lrs[index];
    const result = currentLrs.result;
    const source = result.table.source;
    const table_id = result.table.dom_id;
    const arrayVerbs = currentLrs.verbs.split(",");

    // analyse data
    for (let i = 0; i < data[source].length; i++) {
        let coursename = data[source][i]["name"];

        let indexname = -1;
        for (let j = 0; j < lrs_accumulation.length; j++) {
            if (lrs_accumulation[j].name === coursename) {
                indexname = j;
            }
        }

        if (indexname === -1) {
            let storedata: any = {};
            storedata.name = coursename;
            for (let j = 0; j < arrayVerbs.length; j++) {
                storedata[arrayVerbs[j]] = 0;
            }
            indexname = lrs_accumulation.length;
            lrs_accumulation[indexname] = storedata;
        }

        for (let j = 0; j < arrayVerbs.length; j++) {
            let countVerb = data[source][i][arrayVerbs[j]];
            if (typeof countVerb !== "undefined") {
                lrs_accumulation[indexname][arrayVerbs[j]] += countVerb;
            }
        }
    }

    //-- table  ------------------------------------------------
    updateLrsComponentTable(indexProduct, index, data, data[source].length, currentLrs);

    //-- interface ------------------------------------------------
    const dom_id = config.products[indexProduct].lrs[index].dom_id;
    document.getElementById('container-' + dom_id)?.classList.remove("hidden");
}

function updateLrsComponentTable(indexProduct: number, index: number, data: any, more: number, currentLrs: any): void {
    const result = currentLrs.result;
    const table_id = result.table.dom_id;
    const arrayVerbs = currentLrs.verbs.split(",");

    nb_accumulation += 1;

    if (more > 0) {
        getLrsData(indexProduct, index, data.page + 1);
        const tableElement = document.getElementById(table_id);
        if (tableElement) {
            tableElement.innerHTML = "... page " + nb_accumulation;
        }
    } else {
        displayAsset('wait', "none");

        //-- header  ------------------------------------------------
        let htmlTxt = "<table>\n<tr>\n";
        htmlTxt += "                    <td><strong>Coursename</strong></td>\n";
        for (let j = 0; j < arrayVerbs.length; j++) {
            htmlTxt += "                    <td><strong>" + arrayVerbs[j] + "</strong></td>\n";
        }
        htmlTxt += "                </tr>\n";

        for (let i = 0; i < lrs_accumulation.length; i++) {
            htmlTxt += "                <tr>\n";
            htmlTxt += "                    <td>" + lrs_accumulation[i].name + "</td>\n";
            for (let j = 0; j < arrayVerbs.length; j++) {
                htmlTxt += "                    <td>" + lrs_accumulation[i][arrayVerbs[j]] + "</td>\n";
            }
            htmlTxt += "                </tr>\n";
        }

        htmlTxt += '</table>';
        const tableElement = document.getElementById(table_id);
        if (tableElement) {
            tableElement.innerHTML = htmlTxt;
        }
    }
}
