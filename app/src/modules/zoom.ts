import { displayAsset } from './interface.js';

// Déclaration globale pour Chart.js
declare const Chart: any;
type ChartType = string;

let zoomChart: any;

export function initZoom(): void {
    // -- to close the zoom ----------------
    const greyBackground = document.getElementById('greyBackground');
    if (greyBackground) {
        greyBackground.onclick = function(e: MouseEvent): void {
            displayAsset('greyBackground', "none");
        };
    }
    // -- init ----------------------------
    displayAsset('greyBackground', "none");
}

export function showZoom(theType: ChartType, theLabels: string[], theDatasets: any[]): void {
    const ctxZoom = document.getElementById('chartZoom') as HTMLCanvasElement;

    if (zoomChart !== undefined) {
        zoomChart.destroy();
    }

    displayAsset('greyBackground', "block");

    zoomChart = new Chart(ctxZoom, {
        type: theType,
        data: {
            labels: theLabels,
            datasets: theDatasets
        }
    });
}