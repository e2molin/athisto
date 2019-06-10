function getURLGetFeatureInfo4WMTSLayer(urlQueryGFI,layerQueryGFI,evt,viewResolution,useProxy){

    var GFI_lyr = new ol.layer.Tile({
        source: new ol.source.TileWMS({
            url: urlQueryGFI,
            params: {"LAYERS": layerQueryGFI}
         })
    });
    if (useProxy==true){
        getURLGetFeatureInfoLayerWithProxy(GFI_lyr,evt,viewResolution);
    }else{
        getURLGetFeatureInfoLayer(GFI_lyr,evt,viewResolution);
    }
    
}


function getURLGetFeatureInfoLayerWithProxy(ol3_lyr,evt,viewResolution){

    var urlGetFeatureInfo = ol3_lyr.getSource().getGetFeatureInfoUrl(
            evt.coordinate, viewResolution, 'EPSG:3857',
            {'INFO_FORMAT': 'text/html'});

    cadHTML = "<div class='alert alert-warning alert-dismissible infoWMS' role='alert' >" +
        "<button type='button' class='close' data-dismiss='alert' aria-label='Close' onclick=\"$('#listaSelMaps').trigger('heightChange');\"><span aria-hidden='true'>&times;</span></button>" +
        "<strong>" + ol3_lyr.getProperties()['title'] + "</strong><br/>" +
        "<iframe class='iframeGetFeatureInfo' src='./php/proxyGFI.php?urlCapabilities=" + urlGetFeatureInfo + "'></iframe>" +
        "</div>";
console.log(urlGetFeatureInfo);
    var container = document.getElementById('listaSelMaps');
    var resultsPrevios = container.innerHTML;
    container.innerHTML = cadHTML + resultsPrevios;
    $(".listaSelMapsclass").show(500);
}
 
function getURLGetFeatureInfoLayer(ol3_lyr,evt,viewResolution){
    
    var urlGetFeatureInfo = ol3_lyr.getSource().getGetFeatureInfoUrl(
            evt.coordinate, viewResolution, 'EPSG:3857',
            {'INFO_FORMAT': 'text/html'});
    var titleLyr = "";
    if (ol3_lyr.getProperties()['title']!==undefined){
        titleLyr = ol3_lyr.getProperties()['title'];
    }
    
    cadHTML = "<div class='alert alert-warning alert-dismissible infoWMS' role='alert' >" +
        "<button type='button' class='close' data-dismiss='alert' aria-label='Close' onclick=\"$('#listaSelMaps').trigger('heightChange');\"><span aria-hidden='true'>&times;</span></button>" +
        "<strong>" + titleLyr + "</strong><br/>" +
        "<iframe class='iframeGetFeatureInfo' src='" + urlGetFeatureInfo + "'></iframe>" +
        "</div>";

        var container = document.getElementById('listaSelMaps');
        var resultsPrevios = container.innerHTML;
        container.innerHTML = cadHTML + resultsPrevios;
    $(".listaSelMapsclass").show(500);
}

function getURLGetFeatureInfoAB(bbox,width,height,longitude,latitude){
    console.log(bbox);
    console.log(width + ' / ' + height);
    console.log(longitude + ' / ' + latitude);
	return 'https://www.ign.es/wms-inspire/unidades-administrativas?'
				+ 'SERVICE=WMS&VERSION=1.1.1&REQUEST=GetFeatureInfo&'
				+ 'LAYERS=AU.AdministrativeBoundary&QUERY_LAYERS=AU.AdministrativeBoundary&STYLES=&'
				+ 'BBOX='+bbox+'&FEATURE_COUNT=5&'
				+ 'HEIGHT='+height+'&WIDTH='+width+'&FORMAT=image/png&'
				+ 'INFO_FORMAT=text/html&SRS=EPSG:4326&X='+longitude+'&Y='+latitude;
}

function getURLGetFeatureInfoAU(bbox,width,height,longitude,latitude){
    console.log(bbox);
    console.log(width + ' / ' + height);
    console.log(longitude + ' / ' + latitude);
	return 'https://www.ign.es/wms-inspire/unidades-administrativas?'
				+ 'SERVICE=WMS&VERSION=1.1.1&REQUEST=GetFeatureInfo&'
				+ 'LAYERS=AU.AdministrativeUnit&QUERY_LAYERS=AU.AdministrativeUnit&STYLES=&'
				+ 'BBOX='+bbox+'&FEATURE_COUNT=5&'
				+ 'HEIGHT='+height+'&WIDTH='+width+'&FORMAT=image/png&'
				+ 'INFO_FORMAT=text/html&SRS=EPSG:4326&X='+longitude+'&Y='+latitude;
}


function getWMSAU(bbox,width,height,longitude,latitude){
    console.log(getURLGetFeatureInfoAU(bbox,width,height,longitude,latitude));
    $.ajax({
        url: getURLGetFeatureInfoAU(bbox,width,height,longitude,latitude),
        dataType: "html",
        type: "GET",
        beforeSend: function () {
                    $("#resultNoSpin").hide();
                    $("#resultSpin").show();
                    numLineas = 0;
        },
        success: function(data) {
            var $response=$(data);
            var container = document.getElementById('listaSelMaps');
            var cadCodINSPIRE = $(data).find("#idinspire .text-info:first").map(function() { return $(this).text(); }).get().join('|');
            var cadNombreUnidad = $(data).find("#nombre .text-info").map(function() { return $(this).text(); }).get().join('|');
            var cadJerarqLevel = $(data).find("#nivel .text-info").map(function() { return $(this).text(); }).get().join('|');
            var cadhojaRegistral = $(data).find("#nombre .text-info a").map(function() { return $(this).attr('href'); }).get().join('|');

            var codigosINSPIRE=cadCodINSPIRE.split("|");
            var nombresUnidad=cadNombreUnidad.split("|");
            var jerarqLevel=cadJerarqLevel.split("|");
            var cadHTML = "";
            if (cadCodINSPIRE!=""){
                numLineas = codigosINSPIRE.length;
                var nomMuni = "";
                var nomProvin = "";
                var nomAutonom = "";
                var codINE = "";
                var codINEprov = "";
                var codINEauto = "";
                var urlCDDActas = "";
                var urlCDDPlani = "";
                var urlCDDPobla = "";
                for (var i = 0; i < codigosINSPIRE.length; i++) {
                    if (jerarqLevel[i]=="4thOrder"){
                        nomMuni = nombresUnidad[i];
                        codINE = codigosINSPIRE[i];
                    }
                    if (jerarqLevel[i]=="3rdOrder"){
                        nomProvin = nombresUnidad[i];
                        codINEprov = codigosINSPIRE[i];
                    }
                    if (jerarqLevel[i]=="2ndOrder"){
                        nomAutonom = nombresUnidad[i];
                        codINEauto = codigosINSPIRE[i];
                    }
                }
                if (nomMuni!=""){
                    urlCDDActas="https://centrodedescargas.cnig.es/CentroDescargas/buscar.do?filtro.codFamilia=ACLLI&filtro.codIne=" + replaceAll(codINE,"ES.IGN.SIGLIM.","");
                    urlCDDPlani="https://centrodedescargas.cnig.es/CentroDescargas/buscar.do?filtro.codFamilia=MIPAC&filtro.codIne=" + replaceAll(codINE,"ES.IGN.SIGLIM.","");
                    urlCDDPobla="https://centrodedescargas.cnig.es/CentroDescargas/buscar.do?filtro.codFamilia=PLPOB&filtro.codIne=" + replaceAll(codINE,"ES.IGN.SIGLIM.","");
                    cadHTML= cadHTML +
                        "<div class='alert alert-warning alert-dismissible infoBDLJE' role='alert' >" +
                        "<button type='button' class='close' data-dismiss='alert' aria-label='Close' onclick=\"$('#listaSelMaps').trigger('heightChange');\"><span aria-hidden='true'>&times;</span></button>" +
                        "<strong>" + nomMuni + "</strong><br/>" +
                        "<em><small>" + codINE + "</small></em><br/>" +
                        "<em>" + nomProvin + "(" + nomAutonom + ")" + "</em><br/>" +
                        "<a href=\"" + urlCDDActas + "\" class=\"btn btn-primary btn-block btn-xs\" target=\"_blank\"><i class=\"fa fa-book\" aria-hidden=\"true\"></i> Documentación deslindes</a>" +
                        "<a href=\"" + urlCDDPlani + "\" class=\"btn btn-primary btn-block btn-xs\" target=\"_blank\"><i class=\"fa fa-map\" aria-hidden=\"true\"></i> Planimetrías y altimetrías</a>" +
                        "<a href=\"" + urlCDDPobla + "\" class=\"btn btn-primary btn-block btn-xs\" target=\"_blank\"><i class=\"fa fa-map\" aria-hidden=\"true\"></i> Planos de población</a>" +
                        "</div>";

                }else{
                  if (codINEprov!=""){
                    urlCDDActas="https://centrodedescargas.cnig.es/CentroDescargas/buscar.do?filtro.codFamilia=ACLLI&filtro.codProv=" + parseInt(codINEprov.substring(18,20));
                    urlCDDPlani="https://centrodedescargas.cnig.es/CentroDescargas/buscar.do?filtro.codFamilia=MIPAC&filtro.codProv=" + parseInt(codINEprov.substring(18,20));
                    urlCDDPobla="https://centrodedescargas.cnig.es/CentroDescargas/buscar.do?filtro.codFamilia=PLPOB&filtro.codProv=" + parseInt(codINEprov.substring(18,20));
                    cadHTML = cadHTML +
                        "<div class='alert alert-warning alert-dismissible infoBDLJE' role='alert' >" +
                        "<button type='button' class='close' data-dismiss='alert' aria-label='Close' onclick=\"$('#listaSelMaps').trigger('heightChange');\"><span aria-hidden='true'>&times;</span></button>" +
                        "<strong>" + nomProvin + "(" + nomAutonom + ")" + "</strong><br/>" +
                        "<em><small>Haga más zoom para identificar municipios</small></em><br/>" +
                        "<a href=\"" + urlCDDActas + "\" class=\"btn btn-primary btn-block btn-xs\" target=\"_blank\"><i class=\"fa fa-book\" aria-hidden=\"true\"></i> Documentación deslindes</a>" +
                        "<a href=\"" + urlCDDPlani + "\" class=\"btn btn-primary btn-block btn-xs\" target=\"_blank\"><i class=\"fa fa-map\" aria-hidden=\"true\"></i> Planimetrías y altimetrías</a>" +
                        "<a href=\"" + urlCDDPobla + "\" class=\"btn btn-primary btn-block btn-xs\" target=\"_blank\"><i class=\"fa fa-map\" aria-hidden=\"true\"></i> Planos de población</a>" +
                        "</div>";
                  }else{
                    urlCDDActas="https://centrodedescargas.cnig.es/CentroDescargas/buscar.do?filtro.codFamilia=ACLLI&filtro.codCA=" + parseInt(codINEauto.substring(16,18));
                    urlCDDPlani="https://centrodedescargas.cnig.es/CentroDescargas/buscar.do?filtro.codFamilia=MIPAC&filtro.codCA=" + parseInt(codINEauto.substring(16,18));
                    urlCDDPobla="https://centrodedescargas.cnig.es/CentroDescargas/buscar.do?filtro.codFamilia=PLPOB&filtro.codCA=" + parseInt(codINEauto.substring(16,18));
                    cadHTML = cadHTML +
                        "<div class='alert alert-warning alert-dismissible infoBDLJE' role='alert' >" +
                        "<button type='button' class='close' data-dismiss='alert' aria-label='Close' onclick=\"$('#listaSelMaps').trigger('heightChange');\"><span aria-hidden='true'>&times;</span></button>" +
                        "<strong>" +  nomAutonom + "</strong><br/>" +
                        "<em><small>Haga más zoom para identificar municipios</small></em><br/>" +
                        "<a href=\"" + urlCDDActas + "\" class=\"btn btn-primary btn-block btn-xs\" target=\"_blank\"><i class=\"fa fa-book\" aria-hidden=\"true\"></i> Documentación deslindes</a>" +
                        "<a href=\"" + urlCDDPlani + "\" class=\"btn btn-primary btn-block btn-xs\" target=\"_blank\"><i class=\"fa fa-map\" aria-hidden=\"true\"></i> Planimetrías y altimetrías</a>" +
                        "<a href=\"" + urlCDDPobla + "\" class=\"btn btn-primary btn-block btn-xs\" target=\"_blank\"><i class=\"fa fa-map\" aria-hidden=\"true\"></i> Planos de población</a>" +
                        "</div>";
                  }
                }
                var resultsPrevios = container.innerHTML;
                container.innerHTML = cadHTML + resultsPrevios;
            }
        },
        error: function(e) {
            console.log(e.responseText);
        },
        complete: function () {
                $("#resultNoSpin").show();
                $("#resultSpin").hide();
        }
  });

}

function getWMSAB(bbox,width,height,longitude,latitude){
    console.log(getURLGetFeatureInfoAB(bbox,width,height,longitude,latitude));
    $.ajax({
		    url: getURLGetFeatureInfoAB(bbox,width,height,longitude,latitude),
		    dataType: "html",
		    type: "GET",
		    //async: false,
		    beforeSend: function () {
                        $("#resultNoSpin").hide();
                        $("#resultSpin").show();
                        numLineas = 0;
            },
            success: function(data) {

      			var $response=$(data);
                  var container = document.getElementById('listaSelMaps');
                  var cadCodINSPIRE = $(data).find("#idinspire .text-info:first").map(function() { return $(this).text(); }).get().join('|');
                  var cadNombreLinea = $(data).find("#nombre .text-info").map(function() { return $(this).text(); }).get().join('|');
                  var cadJerarqLevel = $(data).find("#nivel .text-info").map(function() { return $(this).text(); }).get().join('|');
                  var cadhojaRegistral = $(data).find("#nombre .text-info a").map(function() { return $(this).attr('href'); }).get().join('|');
                  var codigosINSPIRE=cadCodINSPIRE.split("|");
                  var nombresLinea=cadNombreLinea.split("|");
                  var jerarqLevel=cadJerarqLevel.split("|");
                  var hojasReg=cadhojaRegistral.split("|");
                  var cadHTML = "";
                  var matricula = "";
                  if (cadCodINSPIRE!=""){
                      numLineas = codigosINSPIRE.length;
                      for (var i = 0; i < codigosINSPIRE.length; i++) {
                          matricula = hojasReg[i].substr(hojasReg[i].length-18).substring(0,14);
                          console.log(matricula);
                            cadHTML= cadHTML +
                                  "<div class='alert alert-warning alert-dismissible infoBDLJE' role='alert' >" +
                                  "<button type='button' class='close' data-dismiss='alert' aria-label='Close' onclick=\"$('#listaSelMaps').trigger('heightChange');\">" +
                                  "<span aria-hidden='true'>&times;</span></button>" +
                                  "<strong>" + nombresLinea[i] + "</strong><br/>" +
                                  "<em>" + jerarqLevel[i] + "</em><br/>" +
                                  "<a href='" + hojasReg[i] + "' target='_blank'><small>" + codigosINSPIRE[i] + "</small></a><br/>" +
                                  "<a class='btn btn-primary btn-xs' role='button' href='" + hojasReg[i] + "' target='_blank'>Consultar la Hoja registral</a>" +
                                  "</div>";
                      }
                      var resultsPrevios = container.innerHTML;
                      container.innerHTML = cadHTML + resultsPrevios;
                  }
		    },
            error: function(e) {
                console.log(e.responseText);
            },
            complete: function () {
                if (numLineas==0){
                    getWMSAU(bbox,width,height,longitude,latitude);
                }
                $("#resultNoSpin").show();
                $("#resultSpin").hide();
            }
	});
    $(".listaSelMapsclass").show(500);

}

$('#listaSelMaps').bind('heightChange', function(){
        //console.log("Encontrado (infoBDLJE): " + $(this).find(".infoBDLJE").length);
        //console.log("Encontrado (infoWMS): " + $(this).find(".infoWMS").length);
        if ($(this).find(".infoBDLJE").length + $(this).find(".infoWMS").length<2){
            $(".listaSelMapsclass").fadeOut(500);
        }

});

function onPointerClick(event){

  var numLineas=0;
  //Extensión del lienzo
  var extent = objMap.getView().calculateExtent(objMap.getSize());
	extent = ol.proj.transformExtent(extent, 'EPSG:3857', 'EPSG:4326');
	//Centro del lienzo
	var centro = objMap.getView().getCenter();//Devuelve un ol.Coordinate en el sistema de proyección, en nuestro caso 3857
	centro = ol.proj.toLonLat(centro, 'EPSG:3857');//Devuelve un ol.Coordinate transformado a 4326


    


  //Trabajando con el punto pinchado
  var pixel = objMap.getEventPixel(event.originalEvent);
  var pointClick = objMap.getCoordinateFromPixel(pixel);
  pointClick = ol.proj.toLonLat(pointClick, 'EPSG:3857');//Devuelve un ol.Coordinate transformado a 4326

  if ($("#acumularResults").is(':checked')){
      var container = document.getElementById('listaSelMaps');
      container.innerHTML = "";
  }


  objMap.getLayers().forEach(
    //Objeto Capa,index
    function (layer, iLayer, layers) {
        if (layer.getProperties()['visible']==true && layer.getProperties()['keyname']=="BDLJE"){
            console.log("Activada y consultable: " + layer.getProperties()['keyname']);
            getWMSAB(extent,objMap.getSize()[0],objMap.getSize()[1],parseInt(pixel[0]),parseInt(pixel[1]));
        }else{
            if (layer.getProperties()['visible']==true && layer.getProperties()['queryable']==true && layer.getProperties()['tiposerv']=="WMTS"){
                console.log("Activada y consultable pero es WMTS: " + layer.getProperties()['keyname']);
                urlQueryGFI = layer.getProperties()['urlQuery'];
                layerQueryGFI = layer.getProperties()['layerQuery'];
                getURLGetFeatureInfo4WMTSLayer(urlQueryGFI,layerQueryGFI,event,objMap.getView().getResolution(),layer.getProperties()['useproxy']);
                //console.log("Accedo: " + layer.getProperties()['author']['name']);
                //getURLGetFeatureInfo4WMTSLayer(extent,objMap.getSize()[0],objMap.getSize()[1],parseInt(pixel[0]),parseInt(pixel[1]));
            }else if (layer.getProperties()['visible']==true && layer.getProperties()['queryable']==true && layer.getProperties()['useproxy']==false && layer.getProperties()['keyname']!="BDLJE" ){
                console.log("Activada y consultable sin proxy: " + layer.getProperties()['keyname']);
                getURLGetFeatureInfoLayer(layer,event,objMap.getView().getResolution());
            }else if (layer.getProperties()['visible']==true && layer.getProperties()['queryable']==true && layer.getProperties()['useproxy']==true && layer.getProperties()['keyname']!="BDLJE"){
                console.log("Activada y consultable con proxy: " + layer.getProperties()['keyname']);
                getURLGetFeatureInfoLayerWithProxy(layer,event,objMap.getView().getResolution());
            }else if (layer.getProperties()['keyname']=="overlayMTN"){
                console.log("Hola MTN");
            }
        }  
    }
  );


  //console.log("Lista por consola las capas del mapa y sus propiedades");
  var listaGrupos=objMap.getLayers();
  //Recorremos todas las capas y escribimos su nombre
  listaGrupos.forEach(function(grupoLayers, i) {
          if (grupoLayers instanceof ol.layer.Group) {
            if (grupoLayers.getProperties()['title']=="Capas WMS de usuario"){
                grupoLayers.getLayers().forEach(function(sublayer, j) {
                  if (sublayer.getProperties()['visible']==true){
                    console.log("Hay capas encendidas");
                    getURLGetFeatureInfoLayerWithProxy(sublayer,event,objMap.getView().getResolution());
                  }
                });
            }
          }
  });



  //Siempre se hace consulta de la BDLL, esten activadas o no
  //getWMSAB(extent,objMap.getSize()[0],objMap.getSize()[1],pixel[0],pixel[1]);

}

function getZOnWCS(coordinatePoint,textoInfo,codepsg){
    var urlZ;
    if (codepsg=="epsg:25830"){
        //https://servicios.idee.es/wcs-inspire/mdt?SERVICE=WCS&REQUEST=GetCoverage&VERSION=1.0.0&COVERAGE=Elevacion4083_25&CRS=EPSG:4083&BBOX=337978,3121534,338003,3121559&WIDTH=1&HEIGHT=1&FORMAT=ArcGrid
        urlZ = "https://servicios.idee.es/wcs-inspire/mdt?SERVICE=WCS&REQUEST=GetCoverage&VERSION=1.0.0&" + 
                "COVERAGE=Elevacion25830_25&" + 
                "CRS=EPSG:25830&" + 
                "BBOX=" + Math.round(coordinatePoint[0],2) + "," + Math.round(coordinatePoint[1],2) + "," +  Math.round(coordinatePoint[0]+25,2) + "," + Math.round(coordinatePoint[1]+25,2) + "&" + 
                "WIDTH=1&HEIGHT=1&FORMAT=ArcGrid";
    }else if (codepsg=="epsg:4083"){
        urlZ = "https://servicios.idee.es/wcs-inspire/mdt?SERVICE=WCS&REQUEST=GetCoverage&VERSION=1.0.0&" + 
                "COVERAGE=Elevacion4083_25&" + 
                "CRS=EPSG:4083&" + 
                "BBOX=" + Math.round(coordinatePoint[0],2) + "," + Math.round(coordinatePoint[1],2) + "," +  Math.round(coordinatePoint[0]+25,2) + "," + Math.round(coordinatePoint[1]+25,2) + "&" + 
                "WIDTH=1&HEIGHT=1&FORMAT=ArcGrid";
    }

    //console.log(urlZ);
    $.ajax({
        url: urlZ,
        dataType: "html",
        type: "GET",
        beforeSend: function () {
            $("#infoAlt").html("<i class=\"fa fa-spinner fa-pulse\"></i>");
            //console.log("Lanzo");
            //$("#resultNoSpin").hide();
            //$("#resultSpin").show();
            //numLineas = 0;
        },
        success: function(data) {
            //console.log("Éxito");
            //var $response=$(data);
            //$(data).find("#idinspire .text-info:first").map(function() { return $(this).text(); }).get().join('|');
            //console.log(data);
            var lineas=data.split("\n");
            $("#infoAlt").html("<i class=\"fa fa-area-chart\"></i> " + lineas[6] + "m");
        },
        error: function(e) {
            console.log("Error");
            console.log(e.responseText);
            $("#infoAlt").text("Altura no disponible");

        },
        complete: function () {
        //console.log("Terminé");
        }
    });   
}

function getZOnLidar(pointClickZ){


    var LidarTilegrid = getLayerOLByKeyname("maplidar").getSource().getTileGrid();
    var tileCoord = LidarTilegrid.getTileCoordForCoordAndResolution(pointClickZ,objMap.getView().getResolution());
    var nZoom = tileCoord[0]
    var tileCol = tileCoord[1];
    var tileRow = tileCoord[2];
    var tileRow4url = Math.abs(tileRow)-1;
    var resolucionZoom = objMap.getView().getResolution();
    var sizeTile=LidarTilegrid.getTileSize(nZoom);
    var origenTileX= -20037508.34  + tileCol * sizeTile * resolucionZoom;
    var origenTileY= 20037508.34 - sizeTile * resolucionZoom * (-1) * (tileRow+1);
    var cooTileX = Math.round((pointClickZ[0]-origenTileX)/resolucionZoom);
    var cooTileY = Math.round((origenTileY - pointClickZ[1])/resolucionZoom);

/*
    console.log("Coordenada: " + pointClickZ);
    console.log("Resolución: " + objMap.getView().getResolution());
    console.log("Zoom/TileCol/TileRow");
    console.log(LidarTilegrid.getTileCoordForCoordAndResolution(pointClickZ,objMap.getView().getResolution()));
    console.log("OriginTile: " + LidarTilegrid.getOrigin(16));
    console.log("TileSize: " + LidarTilegrid.getTileSize(16));    
    console.log("Resolución: " + resolucionZoom);
    console.log("nZoom: " + nZoom);
    console.log("sizeTile: " + sizeTile);
    console.log("tileCol: " + tileCol);
    console.log("tileRow: " + tileRow + "/" + tileRow4url);
    console.log("origenTileX: " + origenTileX);
    console.log("origenTileY: " + origenTileY);
    console.log("cooTileX: " + cooTileX);
    console.log("cooTileY: " + cooTileY);
*/
    var urlLidar = "https://wmts-mapa-lidar.idee.es/lidar?SERVICE=WMTS&REQUEST=GetFeatureInfo&VERSION=1.0.0&LAYER=EL.GridCoverageDSM&INFOFORMAT=text/plain" + 
                    "&TileCol=" + tileCol + "&TileRow=" + tileRow4url + "&TileMatrix=" + nZoom + "&TileMatrixSet=GoogleMapsCompatible&I=" + cooTileX + "&J=" + cooTileY;

    $("#infoLidar").text("");

    $.ajax({
        url: urlLidar,
        dataType: "html",
        type: "GET",
        beforeSend: function () {
            $("#infoLidar").html("<i class=\"fa fa-spinner fa-pulse\"></i>");
        },
        success: function(data) {
            var alturaLidar = replaceAll(data.split('\n')[2],"GRAY_INDEX = ","");
            if (alturaLidar!=="-999.0"){
                $("#infoLidar").html(" <i class=\"fa fa-building-o\"></i> " + alturaLidar + " m");
            }else{
                $("#infoLidar").html("");
            }
        },
        error: function(e) {
            console.log("Error");
            console.log(e.responseText);
            $("#infoAlt").html(" <i class=\"fa fa-building-o\"></i> LiDAR no disponible");


        },
        complete: function () {
            //$("#resultAlturaSpin").hide();
        }

    });


}


function getInfoOnSIOSE(pointClickZ){


    var LidarTilegrid = getLayerOLByKeyname("maplidar").getSource().getTileGrid();
    var tileCoord = LidarTilegrid.getTileCoordForCoordAndResolution(pointClickZ,objMap.getView().getResolution());
    var nZoom = tileCoord[0]
    var tileCol = tileCoord[1];
    var tileRow = tileCoord[2];
    var tileRow4url = Math.abs(tileRow)-1;
    var resolucionZoom = objMap.getView().getResolution();
    var sizeTile=LidarTilegrid.getTileSize(nZoom);
    var origenTileX= -20037508.34  + tileCol * sizeTile * resolucionZoom;
    var origenTileY= 20037508.34 - sizeTile * resolucionZoom * (-1) * (tileRow+1);
    var cooTileX = Math.round((pointClickZ[0]-origenTileX)/resolucionZoom);
    var cooTileY = Math.round((origenTileY - pointClickZ[1])/resolucionZoom);

    var urlSIOSE = "https://servicios.idee.es/wmts/ocupacion-suelo?SERVICE=WMTS&REQUEST=GetFeatureInfo&VERSION=1.0.0&LAYER=LC.LandCoverSurfaces&INFOFORMAT=text/html" + 
                    "&STYLE=LC.LandCoverSurfaces.Default&FORMAT=image/png" + 
                    "&TileCol=" + tileCol + "&TileRow=" + tileRow4url + "&TileMatrix=" + nZoom + "&TileMatrixSet=GoogleMapsCompatible&I=" + cooTileX + "&J=" + cooTileY;

    console.log(urlSIOSE)                    
    $("#infoSIOSE").text("");

    $.ajax({
        url: urlSIOSE,
        dataType: "html",
        type: "GET",
        beforeSend: function () {
            $("#infoSIOSE").html("<i class=\"fa fa-spinner fa-pulse\"></i>");
        },
        success: function(data) {
            console.log(data);
            var dataInfo = jQuery(data).find('.text-info');
            /*
            dataInfo.each(function() { 
                console.log($(this).text());
            });
            */
           var tipoSIOSE = jQuery(dataInfo[2]).text();
           $("#infoSIOSE").html(" <i class=\"fa fa-tree\"></i> " + tipoSIOSE);
            console.log();

        },
        error: function(e) {
            console.log("Error");
            console.log(e.responseText);
            $("#infoSIOSE").html("<i class=\"fa fa-tree\"></i> SIOSE no disponible");
        },
        complete: function () {
            //$("#resultAlturaSpin").hide();
        }

    });


}


function getZOnPointer(event,textoInfo){

    var pixelZ = objMap.getEventPixel(event.originalEvent);
    var pointClickZ = objMap.getCoordinateFromPixel(pixelZ);
    console.log("Pixel: " + pixelZ);

    getZOnLidar(pointClickZ);
    getInfoOnSIOSE(pointClickZ);

    if (objMap.getView().getCenter()[1]<3444248){
        //Estamos en Canarias
        console.log("Estamos en Canarias");
        pointClickZ = ol.proj.transform(pointClickZ, "EPSG:3857", "EPSG:4083");    
        getZOnWCS(pointClickZ,textoInfo,"epsg:4083");
    }else{
        //Estamos en Península. Se utiliza sólo el huso extendido
        console.log("Estamos en Península");
        pointClickZ = ol.proj.transform(pointClickZ, "EPSG:3857", "EPSG:25830");    
        getZOnWCS(pointClickZ,textoInfo,"epsg:25830");
    }
    
}
