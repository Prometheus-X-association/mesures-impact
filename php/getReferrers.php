<?php

//-- get parameters --------------------
require("./params.config.php");

//------------------
//-----API call
//------------------

$ch = curl_init($root."?module=API&method=Referrers.getWebsites&idSite=".$idsite."&period=range&date=".$datefrom.",".$dateto."&flat=1&filter_limit=-1&format=json&token_auth=".$token);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, array(
    'Content-Type: application/json'
)       // Base64.encode(user.username + ':' + user.password)
);
$result = curl_exec($ch);
curl_close($ch);

//------------------
//-- analyse ----
//------------------
$jsonMatomo     = json_decode($result);
$referrers       = array();

$nbReferrers =count($jsonMatomo);
for($i=0;$i<$nbReferrers;$i++){
    $currentvisitors    = $jsonMatomo[$i]->sum_daily_nb_uniq_visitors;
    $currentsite        = $jsonMatomo[$i]->label;
    $currentvisits      = $jsonMatomo[$i]->nb_visits;

    $newObj             = new stdClass();
    $newObj->matomo_page       = $currentsite;
    $newObj->matomo_nbvisits   = $currentvisits;
    $newObj->matomo_nbvisitors = $currentvisitors;
    $referrers[]         = $newObj;
}

//----------------------------------------------
//---- résultat----------------------------
//----------------------------------------------

$objet = new stdClass();
$objet->{'matomo_referrers'} =   $referrers ;

header('Content-Type: application/json; charset=utf-8');
echo json_encode($objet);

?>