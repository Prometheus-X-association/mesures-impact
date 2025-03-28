<?php

//-----------------------------------------------
//-- GET common parameters for analytics and LRS -------
//-----------------------------------------------
$datefrom       = isset($_GET['datefrom']) ? $_GET['datefrom'] : '';
$dateto         = isset($_GET['dateto']) ? $_GET['dateto'] : '';

//-----------------------------------------------
//-- GET parameters for analytics ---------------
//-----------------------------------------------

//-- constant parameters ------------------------
$token          = "";
$root           = "";

//-- variable parameters ------------------------
$idsite         = (int)(isset($_GET['idsite']) ? $_GET['idsite'] : 0);

//-----------------------------------------------
//-- GET parameters for LRS ---------------------
//-----------------------------------------------

//-- constant parameters ------------------------
$endpoint       = 'https://lrs.endpoint';
$lrsUsers       = array();
$lrsPwds        = array();

//-- configure as many users as needed
$lrsUsers[0]    = '';
$lrsPwds[0]     = '';

//-- variable parameters ------------------------
$dateStart      = $datefrom.'T00:00:00.425Z';
$dateEnd        = $dateto.'T23:59:59.425Z';
$page           = (int)(isset($_GET['page']) ? $_GET['page'] : '1');
$coursename     = isset($_GET['coursename']) ? $_GET['coursename'] : 'statement.actor.name';
$verbs          = isset($_GET['verbs']) ? $_GET['verbs'] : 'initialized,terminated';
$indexLRS       = (int)(isset($_GET['indexLRS']) ? $_GET['indexLRS'] : '0');
$limit          = (int)(isset($_GET['limit']) ? $_GET['limit'] : '100');

$username       = $lrsUsers[$indexLRS];
$password       = $lrsPwds[$indexLRS];

//-----------------------------------------------
//-- GET parameters for Surveys -----------------
//-----------------------------------------------

//-- constant parameters ------------------------
$surveyUrl       = "https://survey.endpoint";
$surveyUsers     = array();
$surveyPwds      = array();
//-- configure as many users as needed
$surveyUsers[0]  = "";
$surveyPwds[0]   = "";

//-- variable parameters ------------------------
$surveyIndexUser = (int)(isset($_GET['surveyIndexUser']) ? $_GET['surveyIndexUser'] : '0');
$surveyUser      = $surveyUsers[$surveyIndexUser];
$surveyPwd       = $surveyPwds[$surveyIndexUser];

$surveyId        = (int)(isset($_GET['surveyId']) ? $_GET['surveyId'] : '0');

?>