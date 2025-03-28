<?php
require_once './jsonrpcphp/JsonRPCClient.php';
//-- get parameters --------------------
require("./params.config.php");

define( 'LS_RPCURL', $surveyUrl);  // adjust this one to your actual Remote Control URL
define( 'LS_USER', $surveyUser );
define( 'LS_PASSWORD', $surveyPwd );

// the survey to process

// instantiate a new client
$myJSONRPCClient = new \org\jsonrpcphp\JsonRPCClient( LS_RPCURL );

// receive session key
$sessionKey= $myJSONRPCClient->get_session_key( LS_USER, LS_PASSWORD );

// receive surveys list current user can read
$groups = $myJSONRPCClient->list_surveys( $sessionKey );

$exportbase64 = $myJSONRPCClient->export_responses( $sessionKey, $surveyId, 'json' );

// release the session key
$myJSONRPCClient->release_session_key( $sessionKey );

$export = base64_decode($exportbase64);
header('Content-Type: application/json; charset=utf-8');
echo ($export);

?>