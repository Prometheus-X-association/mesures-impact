<?php

//-----------------------------------------------
//-- initialization
//-----------------------------------------------

//-- get parameters --------------------
require("./params.config.php");
//-----------------------------------------------
//-- API call -- getting statements --------------
//-----------------------------------------------
function aggregateStatements($url, $username, $password) {
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_HTTPAUTH, CURLAUTH_BASIC);
    curl_setopt($ch, CURLOPT_USERPWD, "$username:$password");

    // additional options for debug
    curl_setopt($ch, CURLOPT_VERBOSE, true);
    $verbose = fopen('php://temp', 'w+');
    curl_setopt($ch, CURLOPT_STDERR, $verbose);

    $result = curl_exec($ch);
    curl_close($ch);
    return json_decode($result, true);
}

// Aggregation pipeline -----------------------------
$arrayVerbs = explode(",", $verbs);
$lrsverbs   = [];
for($i=0;$i<count($arrayVerbs);$i++){
    $lrsverbs[$i] = "http://adlnet.gov/expapi/verbs/".$arrayVerbs[$i];
}

$pipeline = [
    [
        '$match' => [
            'statement.verb.id'=> [
                '$in' => $lrsverbs
            ],
            'statement.timestamp' => [
                '$gte' => $dateStart,
                '$lte' => $dateEnd
            ]
        ]
    ],

    [
        '$project' => [
            '_id' => 0,
            $coursename => 1,
            'statement.verb.id' => 1 // only this field
        ]
    ],
    [

        '$skip' => ($page-1)*$limit
    ],
    [
        '$limit' => $limit
    ],
    [
        '$sort' => ['timestamp' => 1]
    ]
];

$encodedPipeline = urlencode(json_encode($pipeline));

//  result initialisation
$result = [];

$url = $endpoint . '?pipeline=' . $encodedPipeline;

$response = aggregateStatements($url, $username, $password);

$coursenameProperties = explode(".", $coursename);


for($i=0;$i<count($response);$i++){
    $currentVerb = $response[$i]["statement"]["verb"]["id"];
    $arrayVerbs  = explode("/", $currentVerb);
    $shortVerb   = $arrayVerbs[count($arrayVerbs)-1];

    $currentName = $response[$i];
    for($j=0;$j<count($coursenameProperties);$j++){
        $currentName = $currentName[$coursenameProperties[$j]];
    }

    $found=false;
    for($j=0;$j<count($result);$j++){
        if ($result[$j]->name===$currentName){
            $result[$j]->{$shortVerb}= $result[$j]->{$shortVerb}+1;
            $found=true;
        }else{
        }
    }
    if($found==false){
        $newObj                   = new stdClass();
        $newObj->name             = $currentName;
        $newObj->{$shortVerb}     = 1;
        $result[count($result)]   = $newObj;
    }else{

    }

}
$newObj                 = new stdClass();
$newObj->lrs_traces     = $result;
$newObj->page           = $page;

header('Content-Type: application/json; charset=utf-8');
echo json_encode($newObj);


?>