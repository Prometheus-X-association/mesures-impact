# php parameters

All php files include "params.config.php".

## Analytics : matomo

| param           |     | description                                                          |
|-----------------|-----|----------------------------------------------------------------------|
| datefrom        | GET | min date of the interval. By default : 30 days before current date   |
| dateto          | GET | max date of the interval. By default : current date                  |
| token           |     | matomo token                                                         |
| root            |     | matomo url                                                           |
| idsite          | GET | matomo id                                                            | 

* getUsers.php (visitors)
* getPages.php
* getDevices.php
* getBrowsers.php
* getReferrers.php <i>("referrer" and not "referer" because of matomo syntax)</i>
* getDownloads.php
* getTimestamp.php (usages according to days and hours)

## Lrs : learning locker

| param           |     | description                                                      |
|-----------------|-----|------------------------------------------------------------------|
| endpoint        |     | endpoint URL                                                     |
| lrsUsers        |     | array of usernames (in case of several clients and stores)       |
| lrsPwds         |     | array of passwords (in case of several clients and stores)       |
| indexLRS        | GET | index in arrays (in case of several clients and stores)          |
| limit           | GET | maximum number of results (to avoid massive data)                |
| page            | GET | requested page (to avoid massive data) = skip in learning locker |
| coursename      | GET | statement course name                                            | 
| verbs           | GET | statement verbs, separated by comma                              |

* getLRS.php

## Surveys : limesurvey

| param           |     | description                                                |
|-----------------|-----|------------------------------------------------------------|
| surveyUrl       |     | endpoint URL                                               |
| surveyUsers     |     | array of usernames (in case of several clients and stores) |
| surveyPwds      |     | array of passwords (in case of several clients and stores) |
| surveyIndexUser | GET | index in arrays (in case of several clients and stores)    |
| surveyId        | GET | id of limesurvey                                           |

* getSurvey.php

---

## Other docs

### general presentation
\>\> [overview](../../README.md)

### config.json
\>\> [config.json](../conf-app/CONFIG.md)
