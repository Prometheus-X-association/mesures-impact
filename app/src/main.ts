"use strict";

import { setDefaultDates, getUrlParams, loadHtml } from './modules/utils.js';
import { getConfig } from './modules/config.js';
import { initZoom } from './modules/zoom.js';
import { prepareAnalyticsComponent } from './modules/analytics-component.js';
import { prepareLrsComponent } from "./modules/lrs-component.js";
import { prepareSurveyComponent } from "./modules/survey-component.js";

let config:any          = null;
let indexProduct:number = 0;
async function init() {
    const urlParams = getUrlParams();
    if (typeof urlParams.index === 'undefined') {
    }else{
        indexProduct = parseInt(urlParams.index);
        setIndexProduct(indexProduct);
    }
    setDefaultDates();
    initZoom();

    try {
        config = await getConfig();
        setInterface();
    } catch (error) {
        console.error('Error loading config :', error);
    }
}

async function initComponent(indexProduct: number, index: number, type: 'analytics' | 'lrs' | 'surveys'): Promise<void> {
    try {
        let componentObject: any;

        // type verification to get the right configuraiton
        switch(type){
            case "analytics":
                componentObject = config.products[indexProduct].analytics[index];
                break;
            case "lrs":
                componentObject = config.products[indexProduct].lrs[index];
                break;
            case "surveys":
                componentObject = config.products[indexProduct].surveys[index];
                break;
        }

        // load HTML content
        const contentHtml = await loadHtml(componentObject.html);

        // create div and add to the page
        const div = document.createElement('div');
        const dom_id = componentObject.dom_id;
        div.id = dom_id;
        document.getElementById(type + "-components")?.appendChild(div);

        // insertion
        const targetElement = document.getElementById(dom_id);
        if (targetElement) {
            targetElement.innerHTML = contentHtml;
        }

        // specific initialisation according to the type
        switch(type){
            case "analytics":
                prepareAnalyticsComponent(indexProduct, index);
                break;
            case "lrs":
                prepareLrsComponent(indexProduct, index);
                break;
            case "surveys":
                prepareSurveyComponent(indexProduct, index);
                break;
        }


    } catch (error) {
        console.error(`Error loading Html for index ${index}:`, error);
    }
}

//-- interface -----------------
export function setIndexProduct(index: number): void {
    const input = document.querySelector('input[name="indexProduct"]') as HTMLInputElement;
    if (input) {
        input.value = index.toString();
    } else {
        console.warn("Element input[name='indexProduct'] not found");
    }
}
function setInterface(){

    const currentProduct = config.products[indexProduct];
    const divTitle = document.getElementById("title") as HTMLInputElement;
    if (divTitle) {
        divTitle.innerHTML = currentProduct.product_title;
    } else {
        console.warn("Element not found");
    }
    for(var i=0; i<currentProduct.analytics.length; i++){
        if(currentProduct.analytics[i].display===true){
            initComponent(indexProduct, i,"analytics");
        }else{
        }
    }

    for(var i=0; i<currentProduct.lrs.length; i++){
        if(currentProduct.lrs[i].display===true){
            initComponent(indexProduct,i,"lrs");
        }else{
        }
    }

    for(var i=0; i<currentProduct.surveys.length; i++){
        if(currentProduct.surveys[i].display===true){
            initComponent(indexProduct,i,"surveys");
        }else{
        }
    }

}

init();