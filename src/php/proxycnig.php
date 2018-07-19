<?php

//var $urlProxy;
//var $paramProxy;

if (isset($_GET['urlService'])) {
  $urlService = $_GET['urlService'];
}
if (isset($_GET['SERVICES'])) {
  $services = $_GET['SERVICES'];
}
if (isset($_GET['VERSION'])) {
  $version = $_GET['VERSION'];
}
if (isset($_GET['REQUEST'])) {
  $request = $_GET['REQUEST'];
}
if (isset($_GET['LAYERS'])) {
  $layers = $_GET['LAYERS'];
}
if (isset($_GET['FORMAT'])) {
  $format = $_GET['FORMAT'];
}
if (isset($_GET['CRS'])) {
  $crs = $_GET['CRS'];
}
if (isset($_GET['BBox'])) {
  $bbox = $_GET['BBox'];
}
if (isset($_GET['WIDTH'])) {
  $width = $_GET['WIDTH'];
}
if (isset($_GET['HEIGHT'])) {
  $height = $_GET['HEIGHT'];
}

$urlparams = "SERVICES=".$services;
$urlparams.= "&VERSION=".$version;
$urlparams.= "&REQUEST=".$request;
$urlparams.= "&LAYERS=".$layers;
$urlparams.= "&FORMAT=".$format;
$urlparams.= "&CRS=".$crs;
$urlparams.= "&BBox=".$bbox;
$urlparams.= "&WIDTH=".$width;
$urlparams.= "&HEIGHT=".$height;
/*
echo $urlService."<br/>";
echo $urlparams."<br/>";
exit(0);
*/

//iniciamos curl
$ch = curl_init();
//seteamos la url
curl_setopt($ch, CURLOPT_URL, $urlService);

//Configuramos el uso del proxy
if (($_SERVER['SERVER_NAME']=='localhost') || 
    ($_SERVER['SERVER_NAME']=='sapignmad200.ign.fomento.es') || 
    ($_SERVER['SERVER_NAME']=='sapignmad200') || 
    ($_SERVER['SERVER_NAME']=='10.13.90.93')){
}else{
    $proxy_ip = '192.168.192.11'; //proxy IP here
    $proxy_port = 8080; //proxy port that you use with the proxies    
    curl_setopt($ch, CURLOPT_HEADER, 0); // no headers in the output
    //curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1); // output to variable
    curl_setopt($ch, CURLOPT_PROXYTYPE, 'HTTP');
    curl_setopt($ch, CURLOPT_PROXYPORT, $proxy_port);
    curl_setopt($ch, CURLOPT_PROXY, $proxy_ip);
}

//seteamos los datos post asociados a la variable xmlData
curl_setopt($ch, CURLOPT_POSTFIELDS, $urlparams);
 
//TRUE para devolver el resultado de la transferencia como string del valor de curl_exec().
curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
 
//tiempo de espera, 0 infinito
curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 300);
 
//ejecutamos la petición y asignamos el resultado a $data
$data = curl_exec($ch);
 
//cerramos la petición curl
curl_close($ch);

header('Content-type: image/jpeg');
print_r($data);








$proxy_ip = '192.168.192.11'; //proxy IP here
$proxy_port = 8080; //proxy port that you use with the proxies
//$url = 'http://www.develmap.com'; //URL to get
//$url = "https://api.what3words.com/v2/forward?addr=intercambiar.castillo.mangos&key=L7ZG8VW6&lang=es&format=xml&display=minimal";

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $urlProxy.$paramProxy);
curl_setopt($ch, CURLOPT_HEADER, 0); // no headers in the output
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1); // output to variable
curl_setopt($ch, CURLOPT_PROXYTYPE, 'HTTP');
//echo $_SERVER['SERVER_NAME'];
//echo "<br/>";
//echo $_SERVER['REQUEST_URI'];
//curl_setopt($ch, CURLOPT_PROXYPORT, $proxy_port);
//curl_setopt($ch, CURLOPT_PROXY, $proxy_ip);
$data = curl_exec($ch);
curl_close($ch);

header('Content-type: image/jpeg');
print_r($data);


?>
