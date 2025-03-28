<?php

//-- get parameters --------------------
require("./params.config.php");

//------------------------------------------
//-- API call -----------------------------
//------------------------------------------

$ch = curl_init($root."?module=API&method=Actions.getPageUrls&idSite=".$idsite."&period=range&date=".$datefrom.",".$dateto."&flat=1&filter_limit=-1&format=json&token_auth=".$token);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, array(
    'Content-Type: application/json'
)       // Base64.encode(user.username + ':' + user.password)
);
$result = curl_exec($ch);
curl_close($ch);

//------------------------------------------
//-- analyse -------------------------------
//------------------------------------------
$jsonMatomo     = json_decode($result);
$nbPages        = count($jsonMatomo);
$nbTotalViews   = 0;
$nbPagesViews   = 0;
$top10pages     = [];

for($i=0;$i<$nbPages;$i++){
    $nbTotalViews  +=$jsonMatomo[$i]->nb_hits;
    $nbPagesViews  +=1;
}

//-- top 10 pages -----------------------------
for($i=0;$i<10;$i++){
    $currenthits    = $jsonMatomo[$i]->nb_hits;
    $currenturl     = $jsonMatomo[$i]->label;
    $currentvisits  = $jsonMatomo[$i]->nb_visits;

    if($currentvisits>=1) {
        $newObj = new stdClass();
        $newObj->matomo_page       = $currenturl;
        $newObj->matomo_nbvisits   = $currentvisits;
        $newObj->matomo_nbhits     = $currenthits;
        $top10pages[]       = $newObj;
    }
}

//----------------------------------------------
//---- result----------------------------
//----------------------------------------------

$objet = new stdClass();
$objet->{'matomo_nbPagesViews'}    =   $nbPagesViews ;
$objet->{'matomo_nbTotalViews'}    =   $nbTotalViews ;
$objet->{'matomo_top10pages'}      =   $top10pages ;

header('Content-Type: application/json; charset=utf-8');
echo json_encode($objet);

?>