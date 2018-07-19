<?php

$urlCapabilities = "";
if (isset($_GET['urlCapabilities'])) {
    $urlCapabilities = $_GET['urlCapabilities'];
}
if (isset($_POST['urlCapabilities'])) {
    $urlCapabilities = $_POST['urlCapabilities'];
}
if ($urlCapabilities == "") {
        echo "Este script necesita recibir por POST o GET la referencia catastral cuya posición se quiere consultar. Por ejemplo /getPosByRefCadastral.php?urlCapabilities=9977715VK3797F";
        die();
}

if(!function_exists('curl_version'))
{
    echo "No tienes curl instalado"; die();
}
//url que recibirá la petición post
$url = $urlCapabilities."?request=GetCapabilities&service=WMS";
//$url="http://www.ign.es/wms-inspire/ign-base?request=GetCapabilities&service=WMS";
//iniciamos curl
$ch = curl_init();
 
//seteamos la url
curl_setopt($ch, CURLOPT_URL, $url);
 
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

header('Content-type: application/xml');
print_r($data);

//echo json_encode($data, JSON_NUMERIC_CHECK);

//json_encode($data);





?>
