<?php

$numhoja = "";
if (isset($_GET['numhoja'])) {
    $numhoja = $_GET['numhoja'];
}
if (isset($_POST['numhoja'])) {
    $numhoja = $_POST['numhoja'];
}
if ($numhoja == "") {
        echo "Este script necesita recibir por POST o GET la referencia catastral cuya posición se quiere consultar. Por ejemplo /getPosByRefCadastral.php?refcadastral=9977715VK3797F";
        die();
}

if(!function_exists('curl_version'))
{
    echo "No tienes curl instalado"; die();
}
//url que recibirá la petición post
$url = "http://centrodedescargas.cnig.es/CentroDescargas/geomHoja?numHoja=".$numhoja;

//iniciamos curl
$ch = curl_init();
 
//seteamos la url
curl_setopt($ch, CURLOPT_URL, $url);

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

 
//seteamos los datos post asociados a la variable xmlData
curl_setopt($ch, CURLOPT_POSTFIELDS, "Provincia=&Municipio=&SRS=EPSG:4326&RC=".$refcadastral);
 
//TRUE para devolver el resultado de la transferencia como string del valor de curl_exec().
curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
 
//tiempo de espera, 0 infinito
curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 300);
 
//ejecutamos la petición y asignamos el resultado a $data
$data = curl_exec($ch);
 
//cerramos la petición curl
curl_close($ch);

header('Content-type: application/xml');
print_r($data);

//echo json_encode($data, JSON_NUMERIC_CHECK);

//json_encode($data);





?>