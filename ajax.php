<?php
header('Access-Control-Allow-Origin: *');
header('Content-type: application/json');

if(isset($_POST['save'])) {
    $response = array();

    $response[0] = $_POST;

    echo json_encode($response);
    exit;
}
exit("You can't allow access that");