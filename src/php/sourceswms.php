<?php
$servidorWMS = array("servidor1", "servidor2");
$layer = array("layer1", "layer2");
$tituloIMG = array("titulo1", "titulo2");

function getWMSParams($capas) {
  global $servidorWMS;
  global $layer;
  global $tituloIMG;
  for ($i = 0; $i < 2; $i++) {
    if ($capas[$i]=="mapamtn"){
      $servidorWMS[$i] = "http://www.ign.es/wms-inspire/mapa-raster?";
      $layer[$i] = "mtn_rasterizado";
      $tituloIMG[$i] = "MTN actual";
    }elseif ($capas[$i]=="actualpnoa"){
      $servidorWMS[$i] = "http://www.ign.es/wms-inspire/pnoa-ma?";
      $layer[$i] = "OI.OrthoimageCoverage";
      $tituloIMG[$i] = "PNOA actual";
    }elseif ($capas[$i]=="nacional"){
      $servidorWMS[$i] = "http://www.ign.es/wms/pnoa-historico?";
      $layer[$i] = "Nacional_1981-1986";
      $tituloIMG[$i] = "Nacional 1981-1986";
    }elseif ($capas[$i]=="intermin"){
      $servidorWMS[$i] = "http://www.ign.es/wms/pnoa-historico?";
      $layer[$i] = "Interministerial_1973-1986";
      $tituloIMG[$i] = "Interministerial 1973-1986";
    }elseif ($capas[$i]=="amsb"){
      $servidorWMS[$i] = "http://www.ign.es/wms/pnoa-historico?";
      $layer[$i] = "AMS_1956-1957";
      $tituloIMG[$i] = "AMS 1956-1957";
    }elseif ($capas[$i]=="mtn50edi1"){
      $servidorWMS[$i] = "http://www.ign.es/wms/primera-edicion-mtn?";
      $layer[$i] = "MTN50";
      $tituloIMG[$i] = "MTN50 1Edicion";
    }elseif ($capas[$i]=="mtn50minuta"){
      $servidorWMS[$i] = "http://www.ign.es/wms/primera-edicion-mtn?";
      $layer[$i] = "catastrones";
      $tituloIMG[$i] = "Minutas MTN50";
    }elseif ($capas[$i]=="mtn25edi1"){
      $servidorWMS[$i] = "http://www.ign.es/wms/primera-edicion-mtn?";
      $layer[$i] = "MTN25";
      $tituloIMG[$i] = "MTN25 1Edicion";      
    }elseif ($capas[$i]=="hojaskm"){
      $servidorWMS[$i] = "http://www.ign.es/wms/hojas-kilometricas?";
      $layer[$i] = "Mapas";
      $tituloIMG[$i] = "Hojas Km";
    }elseif ($capas[$i]=="planimetria"){
      $servidorWMS[$i] = "http://www.ign.es/wms/minutas-cartograficas?";
      $layer[$i] = "Minutas";
      $tituloIMG[$i] = "Planimetrias";         
    }elseif ($capas[$i]=="mapaautom"){
      $servidorWMS[$i] = "http://10.67.33.133/wms1-inspire/mapa-raster?";
      $layer[$i] = "mapaBTN25";
      $tituloIMG[$i] = "Mapa automatica";         
    }else{
      $servidorWMS[$i] = "http://www.ign.es/wms/pnoa-historico?";
      $layer[$i] = $capas[$i];
    }
  }

}

?>