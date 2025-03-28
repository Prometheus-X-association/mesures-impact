<?php


//-- get parameters --------------------
require("./params.config.php");

//--------------------------------
//-- variables initialisation --------------------

$diffdates  = date_diff(date_create($dateto),date_create($datefrom));
$diffFormat = $diffdates->format('%a');
$nbDates    = intval($diffFormat);

//-- the first date ------------------------------

$date           = $datefrom;

//-- variables initialisation

$nbTotalUniqVisitors    =0;
$nbTotalDownloads       =0;
$nbfilesdownloaded      =0;

$downloads_fulllist     =array();

//------------------------------------------
//-- DOWNLOADS  ----------------------------

    $ch = curl_init($root."?module=API&method=Actions.getDownloads&idSite=" . $idsite . "&period=range&date=" . $datefrom . "," . $dateto . "&flat=1&filter_limit=-1&format=json&token_auth=".$token);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, array(
        'Content-Type: application/json'
    )       // Base64.encode(user.username + ':' + user.password)
    );
    $result = curl_exec($ch);
    curl_close($ch);

    $jsonMatomo = json_decode($result);
    $nbPages = count((array)$jsonMatomo);

    for ($i = 0; $i < $nbPages; $i++) {
        $nbTotalDownloads  += $jsonMatomo[$i]->nb_visits;
        $nbfilesdownloaded += 1;

        $currenthits        = $jsonMatomo[$i]->nb_hits;
        $currenturl         = $jsonMatomo[$i]->url;
        $currentvisits      = $jsonMatomo[$i]->nb_visits;

        $newObj                     = new stdClass();
        $newObj->matomo_page               = $currenturl;
        $newObj->matomo_nbvisits           = $currentvisits;
        $newObj->matomo_nbhits             = $currenthits;
        $downloads_fulllist[]       = $newObj;

    }//end of pages loop


//---------------------------------
//-- number of visits with downloads
    $ch = curl_init($root."?module=API&method=VisitsSummary.getUniqueVisitors&idSite=" . $idsite . "&period=day&date=" . $datefrom . "," . $dateto . "&flat=1&filter_limit=-1&segment=downloadUrl%3D%40%25252F&format=json&token_auth=".$token);
    
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

    for ($i = 0; $i < $nbDates + 1; $i++) {

        $currentdatesub             = $currentdatearray->{$date};
        $currentnb_uniq_visitors    = $currentdatesub[0]->nb_uniq_visitors;

        $nbTotalUniqVisitors += $currentnb_uniq_visitors;

        // -- prepare the next $date
        $date = strtotime($date);
        $date = strtotime('+1 day', $date);
        $date = date('Y-m-d', $date);

    }

//-------------------------------
//-- restitution

// génerate objects for publication

$objet = new stdClass();

$objet->{'matomo_totaldownload'}           =   $nbTotalDownloads ;
$objet->{'matomo_filesdownloaded'}         =   $nbfilesdownloaded ;
$objet->{'matomo_visitorswithdownloads'}   =   $nbTotalUniqVisitors ;

$objet->{'matomo_downloadslist'}           =   $downloads_fulllist ;


header('Content-Type: application/json; charset=utf-8');
echo json_encode($objet);

?>