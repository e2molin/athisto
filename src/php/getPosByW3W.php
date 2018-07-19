<?php

//L7ZG8VW6
//fiera.arañar.primo
//intercambiar.castillo.mangos
//https://api.what3words.com/v2/forward?addr=intercambiar.castillo.mangos&key=L7ZG8VW6&lang=es&format=json&display=minimal
//teoría aquí https://docs.what3words.com/api/v2/#forward
//Mapa https://map.what3words.com/empezamos.vendi%C3%B3.aislada

$what3words = "";
if (isset($_GET['what3words'])) {
    $what3words = $_GET['what3words'];
}
if (isset($_POST['what3words'])) {
    $what3words = $_POST['what3words'];
}
/*
if ($what3words == "") {
        echo "Este script necesita recibir por POST o GET la terna what3words cuya posición se quiere consultar. Por ejemplo /getPosByW3W.php?what3words=intercambiar.castillo.mangos";
        die();
}
*/
if(!function_exists('curl_version'))
{
    echo "No tienes curl instalado"; die();
}
//url que recibirá la petición post
//$url = "https://api.what3words.com/v2/forward?";
$url = "https://api.what3words.com/v2/forward?addr=intercambiar.castillo.mangos&key=L7ZG8VW6&lang=es&format=xml&display=minimal";

//iniciamos curl
$ch = curl_init();

//seteamos la url
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_HEADER, 0); // no headers in the output

//TRUE para devolver el resultado de la transferencia como string del valor de curl_exec().
curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
 
//tiempo de espera, 0 infinito
curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 600);
 
//ejecutamos la petición y asignamos el resultado a $data
$data = curl_exec($ch);
 
//cerramos la petición curl
curl_close($ch);

//echo "PAso2: "."https://api.what3words.com/v2/forward?addr=".$what3words."&key=L7ZG8VW6&lang=es&format=json&display=minimal";
//exit(0);

header('Content-type: application/xml');
print_r($data);

//header('Content-Type: application/json');
//print_r($data);

?>