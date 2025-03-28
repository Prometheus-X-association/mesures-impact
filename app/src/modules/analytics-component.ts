import { getInputs, verifyDates, fetchWithGetParams } from './utils.js';
import { getConfig } from './config.js';
import { displayAsset } from './interface.js';
import { showZoom } from './zoom.js';

let chartComponents: Array<any> = [];
// global declaration for Chart.js
declare const Chart: any;
/**
 * prepare front
 */
export async function prepareAnalyticsComponent(indexProduct: number, index: number): Promise<void> {
    const config = await getConfig();
    const idButton = config.products[indexProduct].analytics[index].button;
    const btn = document.getElementById(idButton);

    if (btn) {
        btn.onclick = function() {
            const datesOk = verifyDates();
            if (datesOk === true) {
                displayAsset('wait', "block");
                getAnalyticsData(indexProduct, index);
            }
        };
    }

    const chart = config.products[indexProduct].analytics[index].result.chart;
    if (chart.display === true) {
        const ctxChart = document.getElementById(chart.dom_id) as HTMLCanvasElement;
        ctxChart.setAttribute("index", String(index));
        ctxChart.onclick = function() {
            const index = ctxChart.getAttribute("index");
            if (index !== null && chartComponents[parseInt(index)]) {
                showZoom(chartComponents[parseInt(index)].config.type, chartComponents[parseInt(index)].config.data.labels, chartComponents[parseInt(index)].config.data.datasets);
            }
        }
    }
    chartComponents[index] = null;
}

/**
 * get data from URL
 */
async function getAnalyticsData(indexProduct: number, index: number): Promise<void> {
    try {
        const inputs = getInputs();
        const config = await getConfig();
        const url = config.products[indexProduct].analytics[index].url;
        const idsite = config.products[indexProduct].product_id_matomo;

        try {
            const params: Record<string, string> = {
                datefrom: inputs.datefrom ?? '',
                dateto: inputs.dateto ?? '',
                idsite: String(idsite)
            };
            const data = await fetchWithGetParams(url, params);
            updateAnalyticsComponent(indexProduct, index, data);

        } catch (error) {
            console.error('Error loading visitors:', error);
        }

    } catch (error) {
        console.error('Error loading config:', error);
    }
}

/**
 * update any type component
 */
async function updateAnalyticsComponent(indexProduct: number, index: number, data: any): Promise<void> {
    const config = await getConfig();
    const result = config.products[indexProduct].analytics[index].result;

    updateAnalyticsComponentText(result, data);
    updateAnalyticsComponentChart(result, data, index);
    updateAnalyticsComponentTable(result, data, index);

    displayAsset('wait', "none");
    const dom_id = config.products[indexProduct].analytics[index].dom_id;
    document.getElementById('container-' + dom_id)?.classList.remove("hidden");
}

/**
 * update  text component
 */
function updateAnalyticsComponentText(result: any, data: any): void {
    const texts = result.texts;
    for (let i = 0; i < texts.length; i++) {
        const element = document.getElementById(texts[i].dom_id);
        if (element) {
            element.innerHTML = data[texts[i].data];
        }
    }
}

/**
 * update  chart component
 */
function updateAnalyticsComponentChart(result: any, data: any, index: number): void {
    const chart = result.chart;

    if (chart.display === true) {
        const ctxChart = document.getElementById(chart.dom_id) as HTMLCanvasElement;
        const chart_data = chart.data_array;
        const labels: string[] = [];
        const datasets: Array<any> = [];

        for (let j = 0; j < chart_data.datasets.length; j++) {
            datasets[j] = {
                label: chart_data.datasets[j].legend,
                data: []
            };
        }

        for (let i = 0; i < data[chart_data.source].length; i++) {
            labels[i] = data[chart_data.source][i][chart_data.labels];
            for (let j = 0; j < chart_data.datasets.length; j++) {
                datasets[j].data[i] = data[chart_data.source][i][chart_data.datasets[j].data];
            }
        }

        if (chartComponents[index] !== undefined && chartComponents[index] !== null) {
            chartComponents[index].destroy();
        }

        displayComponentChart(index, ctxChart, chart.type, labels, datasets);
    }
}

/**
 * Display  chart component
 */
function displayComponentChart(index: number, ctxChart: HTMLCanvasElement, type: string, labels: string[], datasets: any[]): void {
    chartComponents[index] = new Chart(ctxChart, {
        type: type,
        data: {
            labels: labels,
            datasets: datasets
        }
    });
    ctxChart.style.width = '400px';
    ctxChart.style.height = '300px';
}

/**
 * update table component
 */
function updateAnalyticsComponentTable(result: any, data: any, index: number): void {
    const table = result.table;

    if (table.display === true) {
        let htmlTxt = "<table>\n<tr>\n";
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
    }
}
