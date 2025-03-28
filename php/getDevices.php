<?php

//-- get parameters --------------------
require("./params.config.php");

//-------------------
//-- API call
//-------------------

$ch = curl_init($root."?module=API&method=DevicesDetection.getType&expanded=1&idSite=".$idsite."&period=range&date=".$datefrom.",".$dateto."&filter_limit=-1&format=json&token_auth=".$token);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, array(
    'Content-Type: application/json'
)       // Base64.encode(user.username + ':' + user.password)
);
$result = curl_exec($ch);
curl_close($ch);

//-------------------
//-- analyse --------
//-------------------
$jsonMatomo     = json_decode($result);
$nbPages        = count($jsonMatomo);

$devices        = array();

for($i=0;$i<$nbPages;$i++){
    $currentdevice      = $jsonMatomo[$i]->label;
    $nbvisitorsdevices  = $jsonMatomo[$i]->nb_uniq_visitors + $jsonMatomo[$i]->sum_daily_nb_uniq_visitors;
    $nbvisitsdevices    = $jsonMatomo[$i]->nb_visits;

    if($nbvisitorsdevices>0) {
        $newObj             = new stdClass();
        $newObj->matomo_device     = $currentdevice;
        $newObj->matomo_users      = $nbvisitorsdevices;
        $newObj->matomo_visits     = $nbvisitsdevices;
        $devices[] = $newObj;
    }

}

//---------------------------------------
//---- result----------------------------
//---------------------------------------

$objet = new stdClass();
$objet->{'matomo_devices'} =   $devices ;

header('Content-Type: application/json; charset=utf-8');
echo json_encode($objet);

?>