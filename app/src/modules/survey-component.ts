/**
 *
 */
import { verifyDates, fetchWithGetParams } from './utils.js';
import { getConfig } from './config.js';
import { displayAsset } from './interface.js';


export async function prepareSurveyComponent(indexProduct: number, index: number): Promise<void> {
    const config = await getConfig();
    const idButton = config.products[indexProduct].surveys[index].button;
    const btn = document.getElementById(idButton);

    if (btn) {
        btn.onclick = function () {
            const datesOk = verifyDates();
            if (datesOk === true) {
                displayAsset('wait', "block");
                getSurveyData(indexProduct, index);
            }
        };
    }
}

async function getSurveyData(indexProduct: number, index: number): Promise<void> {
    try {

        const config = await getConfig();
        const currentSurvey = config.products[indexProduct].surveys[index];

        const url = currentSurvey.url;
        const survey_index_user = currentSurvey.survey_index_user;
        const survey_id = currentSurvey.survey_id;

        try {
            const params = {

                surveyIndexUser: survey_index_user ?? '',
                surveyId: survey_id ?? '0'
            };

            const data = await fetchWithGetParams(url, params);
            updateSurveyComponentTable(indexProduct, index, data);

        } catch (error) {
            console.error('Error loading Survey data:', error);
        }

    } catch (error) {
        console.error('Error loading config:', error);
    }
}

/**
 * update component
 */
async function updateSurveyComponentTable(indexProduct: number, index: number, data: any): Promise<void> {
    const config = await getConfig();
    const currentSurvey = config.products[indexProduct].surveys[index];
    const result = currentSurvey.result;

    const table = result.table;

    if (table.display === true) {
        let htmlTxt = "<table>\n<tr>\n";
        console.log("controle",table.data_array.length)
        for (let i = 0; i < table.data_array.length; i++) {
            htmlTxt += `                    <td><strong>${table.data_array[i].legend}</strong></td>\n`;
        }
        htmlTxt += "                </tr>\n";
        if (Array.isArray(data[table.source])) {
            for (let i = 0; i < data[table.source].length; i++) {
                htmlTxt += "                <tr>\n";
                for (let j = 0; j < table.data_array.length; j++) {
                    htmlTxt += `                    <td>${data[table.source][i][table.data_array[j].data]}</td>\n`;
                }
                htmlTxt += "                </tr>\n";
            }
            htmlTxt += '</table>';
            const tableElement = document.getElementById(table.dom_id);
            if (tableElement) {
                tableElement.innerHTML = htmlTxt;
            }
        }

        //-- interface ------------------------------------------------
        displayAsset('wait', "none");
        const dom_id = config.products[indexProduct].surveys[index].dom_id;
        document.getElementById('container-' + dom_id)?.classList.remove("hidden");

    }
}

