<?php

//-- get parameters --------------------
require("./params.config.php");

//----------------------
//-- API call
//----------------------

$ch = curl_init($root."?module=API&method=DevicesDetection.getBrowsers&expanded=1&idSite=".$idsite."&period=range&date=".$datefrom.",".$dateto."&filter_limit=-1&format=json&token_auth=".$token);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, array(
    'Content-Type: application/json'
)       // Base64.encode(user.username + ':' + user.password)
);
$result = curl_exec($ch);
curl_close($ch);

//----------------------
//-- analyse -----------
//----------------------
$jsonMatomo     = json_decode($result);
$nbPages        = count($jsonMatomo);

$browsers       = array();

for($i=0;$i<$nbPages;$i++){
    $currentbrowser      = $jsonMatomo[$i]->label;
    $nbvisitorsbrowser   = $jsonMatomo[$i]->nb_uniq_visitors + $jsonMatomo[$i]->sum_daily_nb_uniq_visitors;
    $nbvisitsbrowser     = $jsonMatomo[$i]->nb_visits;

    $newObj = new stdClass();
    $newObj->matomo_browser        = $currentbrowser;
    $newObj->matomo_users          = $nbvisitorsbrowser;
    $newObj->matomo_visits         = $nbvisitsbrowser;
    $browsers[] = $newObj;
}

//---------------------------------------
//---- result----------------------------
//---------------------------------------

$objet = new stdClass();
$objet->{'matomo_browsers'} =   $browsers ;

header('Content-Type: application/json; charset=utf-8');
echo json_encode($objet);

?>