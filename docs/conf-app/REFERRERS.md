# Referrers

<i>"Referrers" instead of "Referers" according to matomo API</i>

## file : html-components/referrers.html

The DOM important elements are :

| id                  | role                  |  
|---------------------|-----------------------|
| btnReferrers        | button                |
| container-referrers | main container        |
| tablereferrer       | the table of browsers |

## file : php/getReferrers.php

The input GET params :

See \>\> [CONFIG-PHP.md](../demo-php/CONFIG-PHP.md)

The output json result is :

| variable            | role                               |  
|---------------------|------------------------------------|
| matomo_referrers    | array of objects for each referrer |
| ->matomo_page       | -> the referrer page               |
| ->matomo_nbvisits   | -> number of visits                |
| ->matomo_nbvisitors | -> number of visitors              |

## file : confs/config.json

| param                                 | explanation                                                              |  
|---------------------------------------|--------------------------------------------------------------------------|
| dom_id                                | to be concatenated with "container-" <br/> in analytics-component.ts     |
| display                               | true or false                                                            |
| html                                  | the path to html-file                                                    |
| button                                | click event defined in analytics-component.ts->prepareAnalyticsComponent |
| url                                   | the endpoint to get data                                                 |
| result                                | object                                                                   |
| ->chart->display                      | false // true or false                                                   |
| ->texts                               | unused                                                                   |
| ->table                               | object                                                                   |
| ->table->display                      | true                                                             |
| ->table->dom_id                       | html DOM element : "tablereferrer"                                       |
| ->table->source                       | php json property : json->matomo_referrers                                |
| ->table->data_array                   | object to feed the table                                                 |
| ->table->data_array->data             | php json property. For instance json->matomo_referrers->matomo_page      |
| ->table->data_array->legend           | text to be displayed as a legend. For instance "Site referrer"     |


---

## Other docs

### general presentation
\>\> [overview](../../README.md)

### config.json
\>\> [config.json](../conf-app/CONFIG.md)

### demo php files
\>\> [CONFIG-PHP.md](../demo-php/CONFIG-PHP.md)

