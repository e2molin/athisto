<?php

$urlCapabilities = "";
if (isset($_GET['urlCapabilities'])) {
    $urlCapabilities = $_GET['urlCapabilities'];
}
if (isset($_GET['BBOX'])) {
    $BBOX = $_GET['BBOX'];
}
if (isset($_GET['CRS'])) {
    $CRS = $_GET['CRS'];
}
if (isset($_GET['VERSION'])) {
    $VERSION = $_GET['VERSION'];
}
if (isset($_GET['REQUEST'])) {
    $REQUEST = $_GET['REQUEST'];
}
if (isset($_GET['QUERY_LAYERS'])) {
    $QUERY_LAYERS = $_GET['QUERY_LAYERS'];
}
if (isset($_GET['LAYERS'])) {
    $LAYERS = $_GET['LAYERS'];
}
if (isset($_GET['INFO_FORMAT'])) {
    $INFO_FORMAT = $_GET['INFO_FORMAT'];
}
if (isset($_GET['I'])) {
    $I = $_GET['I'];
}
if (isset($_GET['J'])) {
    $J = $_GET['J'];
}
if (isset($_GET['WIDTH'])) {
    $WIDTH = $_GET['WIDTH'];
}
if (isset($_GET['HEIGHT'])) {
    $HEIGHT = $_GET['HEIGHT'];
}

/*
if (isset($_POST['urlCapabilities'])) {
    $urlCapabilities = $_POST['urlCapabilities'];
}
*/
$url= $urlCapabilities."&VERSION=".$VERSION."&REQUEST=".$REQUEST."&QUERY_LAYERS=".$QUERY_LAYERS."&LAYERS=".$LAYERS."&INFO_FORMAT=".$INFO_FORMAT."&I=".$I."&J=".$J."&WIDTH=".$WIDTH."&HEIGHT=".$HEIGHT."&CRS=".$CRS."&BBOX=".$BBOX;


if(!function_exists('curl_version'))
{
    echo "No tienes curl instalado"; die();
}

$proxy_ip = '192.168.192.11'; //proxy IP here
$proxy_port = 8080; //proxy port that you use with the proxies

$ch = curl_init();
 
//seteamos la url
curl_setopt($ch, CURLOPT_URL, $url);

//Parámetros del Proxy

curl_setopt($ch, CURLOPT_PROXYPORT, $proxy_port);
curl_setopt($ch, CURLOPT_PROXYTYPE, 'HTTP');
curl_setopt($ch, CURLOPT_PROXY, $proxy_ip);

//seteamos los datos post asociados a la variable xmlData
//curl_setopt($ch, CURLOPT_POSTFIELDS, "Provincia=&Municipio=&SRS=EPSG:4326&RC=9977715VK3797F");
 
//TRUE para devolver el resultado de la transferencia como string del valor de curl_exec().
curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
 
//tiempo de espera, 0 infinito
curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 300);
 
//ejecutamos la petición y asignamos el resultado a $data
$data = curl_exec($ch);
 
//cerramos la petición curl
curl_close($ch);

header('Content-type: text/html');
print_r($data);
//print_r($url);

//echo json_encode($data, JSON_NUMERIC_CHECK);
//json_encode($data);

?>
