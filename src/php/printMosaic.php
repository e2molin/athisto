<?php
/*
Por motivos que todav�a no pillo, el script no puede estar en UTF-8, tiene que estar en ANSI
*/


require('fpdf/alphafpdf.php');

//echo($_POST["cooCentroX"]);
//exit(0);

$ancho=800;
$alto=565;
$zoom=2;
$cooCentroX = 0;	//-414180.83;
$cooCentroY = 0;	//4924507.67;
$listacapas = "";	//"AMS_1956-1957,SIGPAC,pnoa2006,pnoa2014";


if (isset($_GET["cooCentroX"]) && isset($_GET["cooCentroY"]) && isset($_GET["zoom"]) && isset($_GET["listacapas"]))
{
	$cooCentroX = $_REQUEST["cooCentroX"];
	$cooCentroY = $_REQUEST["cooCentroY"];
	$zoom = $_REQUEST["zoom"];
	$listacapas = $_REQUEST["listacapas"];
}

$listacapas = str_replace("PNOA ", "pnoa", $listacapas);

$capas = explode(",", $listacapas);
$servidorWMS = array("servidor1", "servidor2", "servidor3", "servidor4");
$layer = array("layer1", "layer2", "layer3", "layer4");
$BBOX="&BBox=".($cooCentroX-($ancho*$zoom/2)).",".($cooCentroY-($alto*$zoom/2)).",".($cooCentroX+($ancho*$zoom/2)).",".($cooCentroY+($alto*$zoom/2));

for ($i = 0; $i < 4; $i++) {
	if ($capas[$i]=="mapaMTN"){
		$servidorWMS[$i] = "http://www.ign.es/wms-inspire/mapa-raster?";
		$layer[$i] = "mtn_rasterizado";
	}elseif ($capas[$i]=="pnoaActualIGN"){
		$servidorWMS[$i] = "http://www.ign.es/wms-inspire/pnoa-ma?";
		$layer[$i] = "OI.OrthoimageCoverage";
	}elseif ($capas[$i]=="nacional"){
		$servidorWMS[$i] = "http://www.ign.es/wms/pnoa-historico?";
		$layer[$i] = "Nacional_1981-1986";
	}elseif ($capas[$i]=="intermin"){
		$servidorWMS[$i] = "http://www.ign.es/wms/pnoa-historico?";
		$layer[$i] = "Interministerial_1973-1986";
	}elseif ($capas[$i]=="amsb"){
		$servidorWMS[$i] = "http://www.ign.es/wms/pnoa-historico?";
		$layer[$i] = "AMS_1956-1957";
	}else{
		$servidorWMS[$i] = "http://www.ign.es/wms/pnoa-historico?";
		$layer[$i] = $capas[$i];
	}
}

$imgNW = $servidorWMS[0]."SERVICES=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=".$layer[0]."&FORMAT=image/jpeg&CRS=EPSG:3857".$BBOX."&WIDTH=".$ancho."&HEIGHT=".$alto;
$imgNE = $servidorWMS[1]."SERVICES=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=".$layer[1]."&FORMAT=image/jpeg&CRS=EPSG:3857".$BBOX."&WIDTH=".$ancho."&HEIGHT=".$alto;
$imgSW = $servidorWMS[2]."SERVICES=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=".$layer[2]."&FORMAT=image/jpeg&CRS=EPSG:3857".$BBOX."&WIDTH=".$ancho."&HEIGHT=".$alto;
$imgSE = $servidorWMS[3]."SERVICES=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=".$layer[3]."&FORMAT=image/jpeg&CRS=EPSG:3857".$BBOX."&WIDTH=".$ancho."&HEIGHT=".$alto;

$pdf = new AlphaPDF();
$pdf->AddPage('Landscape','A3');
$pdf->Image($imgNW,0,0,0,0,'JPG');
$pdf->Image($imgNE,210,0,0,0,'JPG');
$pdf->Image($imgSW,0,148,0,0,'JPG');
$pdf->Image($imgSE,210,148,0,0,'JPG');

$pdf->SetFillColor(0,60,136);
$pdf->SetAlpha(0.5);
$pdf->SetFont('Arial','B',10);

$pdf->SetXY(5, 5);
$pdf->Cell(25,6,'',0,1,'C',1);
$pdf->SetXY(215, 5);
$pdf->Cell(25,6,'',0,1,'C',1);
$pdf->SetXY(5, 155);
$pdf->Cell(25,6,'',0,1,'C',1);
$pdf->SetXY(215, 155);
$pdf->Cell(25,6,'',0,1,'C',1);

$pdf->SetAlpha(1.0);
$pdf->SetTextColor(255, 255, 255);
$pdf->SetXY(5, 5);
$pdf->Cell(25,6,$capas[0],0,1,'C',0);
$pdf->SetXY(215, 5);
$pdf->Cell(25,6,$capas[1],0,1,'C',0);
$pdf->SetXY(5, 155);
$pdf->Cell(25,6,$capas[2],0,1,'C',0);
$pdf->SetXY(215, 155);
$pdf->Cell(25,6,$capas[3],0,1,'C',0);

$pdf->Output();
?>
