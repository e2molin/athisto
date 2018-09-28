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
	return 'http://www.ign.es/wms-inspire/unidades-administrativas?'
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
	return 'http://www.ign.es/wms-inspire/unidades-administrativas?'
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
                    urlCDDActas="http://centrodedescargas.cnig.es/CentroDescargas/buscar.do?filtro.codFamilia=ACLLI&filtro.codIne=" + replaceAll(codINE,"ES.IGN.SIGLIM.","");
                    urlCDDPlani="http://centrodedescargas.cnig.es/CentroDescargas/buscar.do?filtro.codFamilia=MIPAC&filtro.codIne=" + replaceAll(codINE,"ES.IGN.SIGLIM.","");
                    urlCDDPobla="http://centrodedescargas.cnig.es/CentroDescargas/buscar.do?filtro.codFamilia=PLPOB&filtro.codIne=" + replaceAll(codINE,"ES.IGN.SIGLIM.","");
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
                    urlCDDActas="http://centrodedescargas.cnig.es/CentroDescargas/buscar.do?filtro.codFamilia=ACLLI&filtro.codProv=" + parseInt(codINEprov.substring(18,20));
                    urlCDDPlani="http://centrodedescargas.cnig.es/CentroDescargas/buscar.do?filtro.codFamilia=MIPAC&filtro.codProv=" + parseInt(codINEprov.substring(18,20));
                    urlCDDPobla="http://centrodedescargas.cnig.es/CentroDescargas/buscar.do?filtro.codFamilia=PLPOB&filtro.codProv=" + parseInt(codINEprov.substring(18,20));
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
                    urlCDDActas="http://centrodedescargas.cnig.es/CentroDescargas/buscar.do?filtro.codFamilia=ACLLI&filtro.codCA=" + parseInt(codINEauto.substring(16,18));
                    urlCDDPlani="http://centrodedescargas.cnig.es/CentroDescargas/buscar.do?filtro.codFamilia=MIPAC&filtro.codCA=" + parseInt(codINEauto.substring(16,18));
                    urlCDDPobla="http://centrodedescargas.cnig.es/CentroDescargas/buscar.do?filtro.codFamilia=PLPOB&filtro.codCA=" + parseInt(codINEauto.substring(16,18));
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

function getZOnWCS(coordinatePoint,textoInfo){

    var urlZ = "http://www.ign.es/wcs/mdt?SERVICE=WCS&REQUEST=GetCoverage&VERSION=1.0.0&" + 
                "COVERAGE=mdt:Elevacion25830_25&" + 
                "CRS=EPSG:25830&" + 
                "BBOX=" + Math.round(coordinatePoint[0],2) + "," + Math.round(coordinatePoint[1],2) + "," +  Math.round(coordinatePoint[0]+25,2) + "," + Math.round(coordinatePoint[1]+25,2) + "&" + 
                "WIDTH=1&HEIGHT=1&FORMAT=ArcGrid";

    //console.log(urlZ);
    $.ajax({
        url: urlZ,
        dataType: "html",
        type: "GET",
        beforeSend: function () {
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
            $("#infoAlt").text(textoInfo + lineas[6] + "m");
        },
        error: function(e) {
            console.log("Error");
            console.log(e.responseText);
            $("#infoAlt").text("Altura No disponible");

        },
        complete: function () {
        //console.log("Terminé");
        }
    });   
}


function getZOnPointer(event,textoInfo){

    var pixelZ = objMap.getEventPixel(event.originalEvent);
    var pointClickZ = objMap.getCoordinateFromPixel(pixelZ);
    //pointClickZ = ol.proj.toLonLat(pointClickZ, 'EPSG:3857');//Devuelve un ol.Coordinate transformado a 4326

    pointClickZ = ol.proj.transform(pointClickZ, "EPSG:3857", "EPSG:25830");
    getZOnWCS(pointClickZ,textoInfo);
    


}
