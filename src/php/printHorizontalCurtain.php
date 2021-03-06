<?php
require('fpdf/alphafpdf.php');
require('sourceswms.php');

$ancho=1600;
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
$bbox = array("bbox1", "bbox2");
$bbox[0] ="&BBox=".($cooCentroX-($ancho*$zoom/2)).",".($cooCentroY).",".($cooCentroX+($ancho*$zoom/2)).",".($cooCentroY+($alto*$zoom));
$bbox[1] ="&BBox=".($cooCentroX-($ancho*$zoom/2)).",".($cooCentroY-($alto*$zoom)).",".($cooCentroX+($ancho*$zoom/2)).",".($cooCentroY);

getWMSParams($capas);

$imgNorth = "urlService=".$servidorWMS[0]."&SERVICES=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=".$layer[0]."&FORMAT=image/jpeg&CRS=EPSG:3857".$bbox[0]."&WIDTH=".$ancho."&HEIGHT=".$alto;
$imgSouth = "urlService=".$servidorWMS[1]."&SERVICES=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=".$layer[1]."&FORMAT=image/jpeg&CRS=EPSG:3857".$bbox[1]."&WIDTH=".$ancho."&HEIGHT=".$alto;

if(isset($_SERVER['HTTPS'])){
	$protocol = ($_SERVER['HTTPS'] && $_SERVER['HTTPS'] != "off") ? "https" : "http";
}
else{
	$protocol = 'http';
}
$pathLocal = $protocol . "://".$_SERVER['HTTP_HOST'].str_replace('\\', '/', substr(dirname(__FILE__), strlen($_SERVER['DOCUMENT_ROOT'])));



$pdf = new AlphaPDF();
$pdf->AddPage('Landscape','A3');
$pdf->Image($pathLocal."/proxycnig.php?".$imgNorth,0,0,0,0,'JPG');
$pdf->Image($pathLocal."/proxycnig.php?".$imgSouth,0,148,0,0,'JPG');


$pdf->SetFillColor(0,60,136);
$pdf->SetAlpha(0.5);
$pdf->SetFont('Arial','B',10);

$pdf->SetXY(5, 5);
$pdf->Cell(25,6,'',0,1,'C',1);
$pdf->SetXY(5, 155);
$pdf->Cell(25,6,'',0,1,'C',1);

$pdf->SetAlpha(1.0);
$pdf->SetTextColor(255, 255, 255);
$pdf->SetXY(5, 5);
$pdf->Cell(25,6,$tituloIMG[0],0,1,'C',0);
$pdf->SetXY(5, 155);
$pdf->Cell(25,6,$tituloIMG[1],0,1,'C',0);

$pdf->Output();
?>
