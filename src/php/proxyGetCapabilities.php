<?php

$urlCapabilities = "";
if (isset($_GET['urlCapabilities'])) {
    $urlCapabilities = $_GET['urlCapabilities'];
}

if (isset($_POST['urlCapabilities'])) {
    $urlCapabilities = $_POST['urlCapabilities'];
}

$url= $urlCapabilities."?request=GetCapabilities&service=WMS";

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
//Configuramos el uso del proxy
if (($_SERVER['SERVER_NAME']=='localhost') || 
    ($_SERVER['SERVER_NAME']=='sapignmad200.ign.fomento.es') || 
    ($_SERVER['SERVER_NAME']=='sapignmad200') || 
    ($_SERVER['SERVER_NAME']=='10.13.90.93')){
    //echo $_SERVER['SERVER_NAME'];
    //echo "<br/>";
    //echo $_SERVER['REQUEST_URI'];
}else{
    $proxy_ip = '192.168.192.11'; //proxy IP here
    $proxy_port = 8080; //proxy port that you use with the proxies    
    curl_setopt($ch, CURLOPT_HEADER, 0); // no headers in the output
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1); // output to variable
    curl_setopt($ch, CURLOPT_PROXYTYPE, 'HTTP');
    curl_setopt($ch, CURLOPT_PROXYPORT, $proxy_port);
    curl_setopt($ch, CURLOPT_PROXY, $proxy_ip);
}
 
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
