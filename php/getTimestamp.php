<?php

//----------------------
//--TIMESTAMP
//----------------------
// days of the week: UTC format like in Matomo: 1 = sunday

$weekDayUTC     =   array("","dimanche","lundi","mardi","mercredi","jeudi","vendredi","samedi");
$dayHours       =   array(0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24);
$timestamp      =   array();

for($i=1;$i<8;$i++){

    $currentday         = $weekDayUTC[$i];
    $currentdayarray    = array();

    //--Init -------------------------
    for($k=0;$k<count($dayHours);$k++) {
        $currenthour        = $dayHours[$k];
        $newObj             = new stdClass();
        $newObj->hournb     = $currenthour;
        $newObj->visits     = 0;
        $currentdayarray[]  = $newObj;
    }

    //--API call -------------------------
    $ch = curl_init("https://matomo.tralalere.com/?module=API&method=VisitTime.getVisitInformationPerLocalTime&idSite=".$idsite."&period=range&date=".$datefrom.",".$dateto."&filter_limit=-1&segment=visitEndServerDayOfWeek%3D%3D".$i."&format=json&token_auth=".$token);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, array(
        'Content-Type: application/json'
    )       // Base64.encode(user.username + ':' + user.password)
    );
    $result = curl_exec($ch);
    curl_close($ch);

    //--Analyse -------------------------
    $jsonMatomo = json_decode($result);
    $nblines    = count($jsonMatomo);

    for($j=0;$j<$nblines;$j++){
        $currenthour    = $jsonMatomo[$j]->label;
        $hourStr        = substr($currenthour,0,strlen($currenthour)-2);
        $hourInt        = intval($hourStr);

        $nbvisitshour   = $jsonMatomo[$j]->nb_visits;

        $currentdayarray[$hourInt]->visits = $nbvisitshour;
    }

    $timestamp[$currentday]=$currentdayarray;

}
//----------------------------------------------
//---- résultat----------------------------
//----------------------------------------------

$objet = new stdClass();
$objet->{'dayHours'}  =   $dayHours ;
$objet->{'timestamp'} =   $timestamp ;

header('Content-Type: application/json; charset=utf-8');
echo json_encode($objet);

?>