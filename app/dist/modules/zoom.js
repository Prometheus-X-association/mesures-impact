import { displayAsset } from './interface.js';
let zoomChart;
export function initZoom() {
    // -- to close the zoom ----------------
    const greyBackground = document.getElementById('greyBackground');
    if (greyBackground) {
        greyBackground.onclick = function (e) {
            displayAsset('greyBackground', "none");
        };
    }
    // -- init ----------------------------
    displayAsset('greyBackground', "none");
}
export function showZoom(theType, theLabels, theDatasets) {
    const ctxZoom = document.getElementById('chartZoom');
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
