<?php

//-- get parameters --------------------
require("./params.config.php");

//-- variables initialisation --------------------

$diffdates  = date_diff(date_create($dateto),date_create($datefrom));
$diffFormat = $diffdates->format('%a');
$nbDates    = intval($diffFormat);

//-- the first date ------------------------------

$dateFromToTime = strtotime($datefrom);
$date           = date('Y-m-d', $dateFromToTime);

//-- visits and visitors --------------------------

$arrayVisitsDay = array();

$nbTotalVisits                  = 0;
$nbTotalVisitsUniques           = 0;
$durations                      = 0;
$currentnb_uniq_visitors        = 0;
$currentnb_visits               = 0;
$currentsum_visit_length        = 0;

//--urls API -------------------------------------

$url0 = 'idSite='.$idsite.'&period=day&date='.$datefrom.','.$dateto.'&method=VisitsSummary.getUniqueVisitors';
$urlenc0 = urlencode($url0);

$url1 = 'idSite='.$idsite.'&period=day&date='.$datefrom.','.$dateto.'&method=VisitsSummary.getVisits';
$urlenc1 = urlencode($url1);

$url2 = 'idSite='.$idsite.'&period=day&date='.$datefrom.','.$dateto.'&method=VisitsSummary.getSumVisitsLength';
$urlenc2 = urlencode($url2);

$url = $root.'index.php?module=API&method=API.getBulkRequest&format=JSON';
$url .= '&urls[0]='.$urlenc0.'&urls[1]='.$urlenc1.'&urls[2]='.$urlenc2;
$url .= '&filter_limit=-1&token_auth='.$token;

//-- API call -------------------------------------
$ch = curl_init($url);

curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, array(
    'Content-Type: application/json'
)       // Base64.encode(user.username + ':' + user.password)
);

$result = curl_exec($ch);
curl_close($ch);
$jsonMatomo = json_decode($result);

//-- get data and transformation -----------------------

$currentdatearray = $jsonMatomo;

for ($i = 0; $i < $nbDates+1; $i++) {

    $currentnb_uniq_visitors        = 0+$currentdatearray[0]->{$date};
    $currentnb_visits               = 0+$currentdatearray[1]->{$date};
    $currentsum_visit_length        = 0+$currentdatearray[2]->{$date};

    $nbTotalVisitsUniques   += $currentnb_uniq_visitors;
    $nbTotalVisits          += $currentnb_visits;
    $durations              += $currentsum_visit_length;

    $newObj = new stdClass();
    $newObj->matomo_day = $date;
    $newObj->matomo_nb_visits = $currentnb_visits;
    $newObj->matomo_nb_uniq_visitors = $currentnb_uniq_visitors;
    $arrayVisitsDay[] = $newObj;

    // -- prepare the next $date
    $date = strtotime($date);
    $date = strtotime('+1 day', $date);
    $date = date('Y-m-d', $date);

}


// compute durations ------------------
// -- control ------------------
if($nbTotalVisits ==0){
    $nbTotalVisits = 1;
}else{
}
$newDuration    = $durations/$nbTotalVisits;
$newDurationHH  = (int)($newDuration/3600);
$newDurationMN  = (int)(($newDuration - ($newDurationHH*3600)) /60);
$newDurationSS  = (int)(($newDuration - ($newDurationHH*3600)- ($newDurationMN*60)));

//-- return object ------------------------------------

$objet = new stdClass();
$objet->{'datefrom'}                =   $datefrom ;
$objet->{'dateto'}                  =   $dateto ;
$objet->{'matomo_nbTotalVisits'}           =   $nbTotalVisits ;
$objet->{'matomo_nbTotalVisitsUniques'}    =   $nbTotalVisitsUniques ;
$objet->{'matomo_arrayVisitsDay'}          =   $arrayVisitsDay ;

$objet->{'newDurationHH'}   =   $newDurationHH ;
$objet->{'newDurationMN'}   =   $newDurationMN ;
$objet->{'newDurationSS'}   =   $newDurationSS ;

header('Content-Type: application/json; charset=utf-8');
echo json_encode($objet);

?>