var objMap;
var objMapMirror;
var projection = ol.proj.get('EPSG:3857');
var sidebar;
var headerHeight = 50;
var initLong = -5.5;
var initLat = 40;
var initZoom = 5;
var initMinZoom = 0;
var initMaxZoom = 18;
var initProj = 'EPSG:3857';
var listaCapas = "";
var initHash = "";
var actualHash = "";

var showPNOAOnCursor;
var browserIE;
var mobileMode;
var modeViz;
var pnoaSliderCobertura= new Array();

//Definiciones de projección
//En Canarias debería ser 4083, pero la definición es la misma
proj4.defs("EPSG:25828","+proj=utm +zone=28 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs");
proj4.defs("EPSG:25829","+proj=utm +zone=29 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs");
proj4.defs("EPSG:25830","+proj=utm +zone=30 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs");
proj4.defs("EPSG:25831","+proj=utm +zone=31 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs");
proj4.defs("EPSG:4083","+proj=utm +zone=28 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs");
/*
Extras JS Links
*/


/*
Funciones básicas
*/
String.prototype.beginsWith = function (string) {
    return(this.indexOf(string) === 0);
};

function replaceAll(str, find, replace) {
  return str.replace(new RegExp(find, 'g'), replace);
}

function closeModals(){
  //Si los hay se ponen aquí
  $('#permalinkText').modal('hide');
  $("#btnPrinterSymbol").hide();//Ocultamos el botón de impresión
  $("#toolTemporalTransitionElem").hide();
  $("#panel-AirPhotoLayers").hide();
  $("#panel-ATLayers").hide();
  $("#toolCoberInfoElem").hide();



//Apagamos capas de visualización

  if (modeViz==6) {
    $(".ign-mainmap-container").removeClass("col-sm-6").addClass("col-sm-12");
    $(".ign-mirrormap-container").hide();
  }
  if (modeViz==7) {
    $(".ign-mainmap-container").removeClass("col-sm-6").addClass("col-sm-12");
    $(".ign-mainmap-container").css("height", $(window).height()-75);
    $(".ign-mirrormap-container").hide();
  }
  $("#layerInfo1").text("");
  $("#layerInfo2").text("");
  $("#layerInfo3").text("");
  $("#layerInfo4").text("");
  $("#layerInfo5").text("");
  $("#layerInfo6").text("");

}

//Cuando enciendo capas por keyname, pueden encenserse las capas Viz que antes estaban asignadas. Con esto lo arreglo según el caso
function apagarOtrasViz(indexViz){

  if (indexViz == 0){
    setLayerVisibleByTitle(objMap,"Spot",0);
    setLayerVisibleByTitle(objMap,"SwipeE",0);
    setLayerVisibleByTitle(objMap,"SwipeW",0);
    setLayerVisibleByTitle(objMap,"SwipeN",0);
    setLayerVisibleByTitle(objMap,"SwipeS",0);
    setLayerVisibleByTitle(objMap,"MosaicNE",0);
    setLayerVisibleByTitle(objMap,"MosaicSE",0);
    setLayerVisibleByTitle(objMap,"MosaicNW",0);
    setLayerVisibleByTitle(objMap,"MosaicSW",0);
  }else if (indexViz == 1){
    setLayerVisibleByTitle(objMap,"Spot",0);
    setLayerVisibleByTitle(objMap,"SwipeE",0);
    setLayerVisibleByTitle(objMap,"SwipeW",0);
    setLayerVisibleByTitle(objMap,"SwipeN",0);
    setLayerVisibleByTitle(objMap,"SwipeS",0);
  }else if (indexViz == 2){
    setLayerVisibleByTitle(objMap,"Spot",0);
    setLayerVisibleByTitle(objMap,"SwipeN",0);
    setLayerVisibleByTitle(objMap,"SwipeS",0);
    setLayerVisibleByTitle(objMap,"MosaicNE",0);
    setLayerVisibleByTitle(objMap,"MosaicSE",0);
    setLayerVisibleByTitle(objMap,"MosaicNW",0);
    setLayerVisibleByTitle(objMap,"MosaicSW",0);
  }else if (indexViz == 3){
    setLayerVisibleByTitle(objMap,"Spot",0);
    setLayerVisibleByTitle(objMap,"SwipeE",0);
    setLayerVisibleByTitle(objMap,"SwipeW",0);
    setLayerVisibleByTitle(objMap,"MosaicNE",0);
    setLayerVisibleByTitle(objMap,"MosaicSE",0);
    setLayerVisibleByTitle(objMap,"MosaicNW",0);
    setLayerVisibleByTitle(objMap,"MosaicSW",0);
  }else if (indexViz == 4){
    setLayerVisibleByTitle(objMap,"SwipeE",0);
    setLayerVisibleByTitle(objMap,"SwipeW",0);
    setLayerVisibleByTitle(objMap,"MosaicNE",0);
    setLayerVisibleByTitle(objMap,"MosaicSE",0);
    setLayerVisibleByTitle(objMap,"MosaicNW",0);
    setLayerVisibleByTitle(objMap,"MosaicSW",0);
  }else if (indexViz >= 5){
    setLayerVisibleByTitle(objMap,"Spot",0);
    setLayerVisibleByTitle(objMap,"SwipeE",0);
    setLayerVisibleByTitle(objMap,"SwipeW",0);
    setLayerVisibleByTitle(objMap,"SwipeN",0);
    setLayerVisibleByTitle(objMap,"SwipeS",0);
    setLayerVisibleByTitle(objMap,"MosaicNE",0);
    setLayerVisibleByTitle(objMap,"MosaicSE",0);
    setLayerVisibleByTitle(objMap,"MosaicNW",0);
    setLayerVisibleByTitle(objMap,"MosaicSW",0);
  }


}


/*
-----------------------------------------------------------------------------------------------------------------------
FUNCIONES
-----------------------------------------------------------------------------------------------------------------------
*/
/*
Función para concatenar en la URL el nivel de zoom, rotación y centro del mapa mostrado
*/
var updatePermalink = function() {
    var shouldUpdate = true;
    var view = objMap.getView();

  if (!shouldUpdate) {
    // do not update the URL when the view was changed in the 'popstate' handler
    shouldUpdate = true;
    return;
  }

  var center = view.getCenter();
  var hash = '#map=' +
      view.getZoom() + '/' +
      Math.round(center[0] * 100) / 100 + '/' +
      Math.round(center[1] * 100) / 100 + '/' +
      view.getRotation() + '/' +
      modeViz + '/' +
      listaCapas;

  var state = {
    zoom: view.getZoom(),
    center: view.getCenter(),
    rotation: view.getRotation()
  };
  //Si estamos en modo móvil  con showPNOAOnCursor=false mostramos esto
  if ((mobileMode==true) || (showPNOAOnCursor==false)){
      var pixelCentral = objMap.getPixelFromCoordinate(objMap.getView().getCenter());
      displayPNOAInfo(pixelCentral,"layersAvailablesList","");
  }
  actualHash = "" + hash;
  window.history.pushState(state, 'Enlace web', "index.html");
  //console.log("Hash actualizado");
};

function processHash(){
  var permalinkModeViz;
  if (initHash.beginsWith("#map=")==false){
    //Por defecto cuando no hay un permalink carga la visualización 6
    if (mobileMode==true){
      changeVizMode(0);//Modo por defecto en versión móvil
    }else{
      changeVizMode(0);//Modo por defecto en versión escritorio
    }
    return;
  }

  if (initHash !== '') {
      var hash = initHash.replace('#map=', '');
      var parts = hash.split('/');
      if (parts.length === 6) {
        zoom  = parseInt(parts[0], 10);
        var center = [
              parseFloat(parts[1]),
              parseFloat(parts[2])
            ];
        rotation = parseFloat(parts[3]);
        permalinkModeViz = parseFloat(parts[4]);
        listaCapas = parts[5];
      }

    if ( typeof(zoom) !== "undefined" && zoom !== null ) {
      //No pasa nada
    }else{
      console.log("Zoom indefinido o nulo. Cojo zoom inicial");
      zoom = initZoom;
    }
    if ( typeof(rotation) !== "undefined" && rotation !== null ) {
      //No pasa nada
    }else{
      console.log("Rotación indefinido o nulo. Cojo rotacion cero");
      rotation = 0;
    }
    var vistaPermalink= new ol.View({
            projection: 'EPSG:3857',
            center: center,
            zoom: zoom,
            rotation: rotation,
            minZoom: 4, maxZoom: 19
          });
          objMap.setView(vistaPermalink);
    objMapMirror.setView(objMap.getView());



    console.log("Establezco modo: " + permalinkModeViz + " con capas " + listaCapas);
    console.log("overlayPNOARasterList: " + overlayPNOARasterList.length + " capas.");
    console.log("overlayIGNRasterList: " + overlayIGNRasterList.length + " capas.");
    changeVizMode(permalinkModeViz);
  }else{
      //Por defecto cuando no hay un permalink carga la visualización 6
      if (mobileMode==true){
        changeVizMode(0);//Modo por defecto en versión móvil
      }else{
        changeVizMode(0);//Modo por defecto en versión escritorio
      }
    }
}


/*
-----------------------------------------------------------------------------------------------------------------------------
Controles en pantalla
-----------------------------------------------------------------------------------------------------------------------------
*/
//Contenedor de la capas de usuario
$("#content-panel-layers-User").on("hide.bs.collapse", function(){
    $("#btn-content-panel-layers-User").html("<i class='fa fa-plus-square' aria-hidden='true'></i> Capas de usuario</a></div>");
});
$("#content-panel-layers-User").on("show.bs.collapse", function(){
    $("#btn-content-panel-layers-User").html("<i class='fa fa-minus-square' aria-hidden='true'></i> Capas de usuario</a></div>");
});

$("#temporalLevel").slider({
    min: 0,
    max: 100,
    orientation: "horizontal",
    value: 0,
    step: 0.01,
    slide: function(event, ui) {
        //console.log(ui.value);
        dynamicPNOAoverlayOpacity(ui.value);
    }
});


$("#opacityLevel").slider({
    min: 0,
    max: 100,
    orientation: "horizontal",
    value: 100,
    slide: function(event, ui) {
        //console.log(ui.value);
        //$(".opacityLyrClass").slider( "option", "value", ui.value );
        //manageVisibleOverlaysByGroup(objMap,"imaginery-flight","opacity",ui.value);
        if (ui.value<=10){
          $("#lblOpacidad").css('background-color', "#ff6666");
          $("#lblOpacidad").css('font-weight', "bold");
          $("#lblOpacidad").text("Opacidad < 10%");
        }else{
          $("#lblOpacidad").css('background-color', "transparent");
          $("#lblOpacidad").css('font-weight', "normal");
          $("#lblOpacidad").text("Opacidad");
        }
        if (modeViz==1){
          manageVisibleOverlaysByTitle(objMap,"MosaicNW","opacity",ui.value);
          manageVisibleOverlaysByTitle(objMap,"MosaicNE","opacity",ui.value);
          manageVisibleOverlaysByTitle(objMap,"MosaicSW","opacity",ui.value);
          manageVisibleOverlaysByTitle(objMap,"MosaicSE","opacity",ui.value);
        }
        if (modeViz==2){
          manageVisibleOverlaysByTitle(objMap,"SwipeE","opacity",ui.value);
          manageVisibleOverlaysByTitle(objMap,"SwipeW","opacity",ui.value);
        }
        if (modeViz==3){
          manageVisibleOverlaysByTitle(objMap,"SwipeN","opacity",ui.value);
          manageVisibleOverlaysByTitle(objMap,"SwipeS","opacity",ui.value);
        }
        if ((modeViz==6) || (modeViz==7)){
          //Si los modos son mirror, aplicamos la misma transparencia
          manageVisibleOverlaysByGroup(objMap,"imaginery-flight","opacity",ui.value);
          manageVisibleOverlaysByGroup(objMap,"imaginery-ign","opacity",ui.value);
          manageVisibleOverlaysByTitle(objMapMirror,"Overlay Mirror","opacity",ui.value);
        }

    }
});

//Botones capas base del mapa Main
$("#set-mapMain-mapa").click(function() {

  if ($("#set-mapMain-mapa").hasClass("selected")){ return;}
  $(".btnGroupLayerChangeMainMap a").removeClass("selected")
  $("#set-mapMain-mapa").addClass("selected");
  setLayerVisibleByIndex(objMap,0,1);
  setLayerVisibleByIndex(objMap,1,0);
  setLayerVisibleByIndex(objMap,2,0);

});

$("#set-mapMain-imagen").click(function() {

  if ($("#set-mapMain-imagen").hasClass("selected")){ return;}
  $(".btnGroupLayerChangeMainMap a").removeClass("selected")
  $("#set-mapMain-imagen").addClass("selected");
  setLayerVisibleByIndex(objMap,0,0);
  setLayerVisibleByIndex(objMap,1,1);
  setLayerVisibleByIndex(objMap,2,0);

});

$("#set-mapMain-hibrido").click(function() {

  if ($("#set-mapMain-hibrido").hasClass("selected")){ return;}
  $(".btnGroupLayerChangeMainMap a").removeClass("selected")
  $("#set-mapMain-hibrido").addClass("selected");
  setLayerVisibleByIndex(objMap,0,0);
  setLayerVisibleByIndex(objMap,1,1);
  setLayerVisibleByIndex(objMap,2,1);

});

$("#set-showTools").click(function() {

  $("#toolbarMappingElem").toggle();

});

$("#set-showInfo").click(function() {

  BootstrapDialog.alert({
              title: 'Obtener información de las capas',
              message: 'Active la capa vectorial de líneas límite y haga clic sobre una linea límite o un municipio para ver su información asociada.<br/>' +
                      'Las capas con el símbolo <i class=\'fa fa-info-circle\' aria-hidden=\'true\'></i> contienen información que se mostrará al hacer clic con la capa activada.'
  });

});

$("#set-CDC").click(function() {

  var extent = objMap.getView().calculateExtent(objMap.getSize());
  extent = ol.proj.transformExtent(extent, 'EPSG:3857', 'EPSG:4326');
  var urlCDD = "http://centrodedescargas.cnig.es/CentroDescargas/buscador.do?crs=EPSG:4258&BBOX=" + extent[0] + "," + extent[1] + "," +  extent[2] + "," + extent[3];
  window.open(urlCDD, '_blank');
  $("#toolbarMappingElem").toggle();

});



//Botones capas base del mapa Mirror
$("#set-mapMirror-mapa").click(function() {
  var capasMirror = listaCapas.split(",");
  if ($("#set-mapMirror-mapa").hasClass("selected")){ return;}
  $(".btnGroupLayerChangeMirrorMap a").removeClass("selected")
  $("#set-mapMirror-mapa").addClass("selected");

  setLayerVisibleByIndex(objMapMirror,0,1);
  setLayerVisibleByIndex(objMapMirror,1,0);
  setLayerVisibleByIndex(objMapMirror,2,0);
  //setLayerVisibleByIndex(objMapMirror,3,0);//Siempre apagamos el overlay  cuando pulsamos uno de estos botones
  if (modeViz==6){
    $("#layerInfo2").text("Mapa");
  }
  if (modeViz==7){
    $("#layerInfo6").text("Mapa");
  }
  //listaCapas = capasMirror[0] + ",mapaMTN";
});

$("#set-mapMirror-imagen").click(function() {
  var capasMirror = listaCapas.split(",");
  if ($("#set-mapMirror-imagen").hasClass("selected")){ return;}
  $(".btnGroupLayerChangeMirrorMap a").removeClass("selected")
  $("#set-mapMirror-imagen").addClass("selected");
  setLayerVisibleByIndex(objMapMirror,0,0);
  setLayerVisibleByIndex(objMapMirror,1,1);
  setLayerVisibleByIndex(objMapMirror,2,0);
  //setLayerVisibleByIndex(objMapMirror,3,0);//Siempre apagamos el overlay  cuando pulsamos uno de estos botones
  if (modeViz==6){
    $("#layerInfo2").text("Imagen");
  }
  if (modeViz==7){
    $("#layerInfo6").text("Imagen");
  }
  //listaCapas = capasMirror[0] + ",pnoaActualIGN";
});

$("#set-mapMirror-hibrido").click(function() {
  var capasMirror = listaCapas.split(",");
  if ($("#set-mapMirror-hibrido").hasClass("selected")){ return;}
  $(".btnGroupLayerChangeMirrorMap a").removeClass("selected")
  $("#set-mapMirror-hibrido").addClass("selected");
  setLayerVisibleByIndex(objMapMirror,0,0);
  setLayerVisibleByIndex(objMapMirror,1,1);
  setLayerVisibleByIndex(objMapMirror,2,1);
  //setLayerVisibleByIndex(objMapMirror,3,0);//Siempre apagamos el overlay  cuando pulsamos uno de estos botones
  if (modeViz==6){
    $("#layerInfo2").text("Híbrido");
  }
  if (modeViz==7){
    $("#layerInfo6").text("Híbrido");
  }
  //listaCapas = capasMirror[0] + ",pnoaActualIGN";
});


$("#btnPrint").click(function() {
  //La impresión es en A3
  updatePermalink;//Actualizo el permalink, por si las moscas
  var center = objMap.getView().getCenter();
  xCenter = Math.round(center[0] * 100) / 100;
  yCenter = Math.round(center[1] * 100) / 100;
  zoom = 2;
  console.log("php/printMosaic.php?cooCentroX=" + xCenter + "&cooCentroY=" + yCenter + "&zoom=" + zoom + "&listacapas=" + listaCapas);
  if (modeViz==1){
    //capasPrint = getLayerOLByTitle("MosaicNW").getProperties()['keyname'] + "," + getLayerOLByTitle("MosaicNE").getProperties()['keyname'] + "," + getLayerOLByTitle("MosaicSW").getProperties()['keyname'] + "," + getLayerOLByTitle("MosaicSE").getProperties()['keyname'];
    window.open("php/printMosaic.php?cooCentroX=" + xCenter + "&cooCentroY=" + yCenter + "&zoom=" + zoom + "&listacapas=" + listaCapas);
  }else if (modeViz==2){
    //capasPrint = getLayerOLByTitle("SwipeW").getProperties()['keyname'] + "," + getLayerOLByTitle("SwipeE").getProperties()['keyname'];
    window.open("php/printVerticalCurtain.php?cooCentroX=" + xCenter + "&cooCentroY=" + yCenter + "&zoom=" + zoom + "&listacapas=" + listaCapas);
  }else if (modeViz==3){
    //capasPrint = getLayerOLByTitle("SwipeN").getProperties()['keyname'] + "," + getLayerOLByTitle("SwipeS").getProperties()['keyname'];
    window.open("php/printHorizontalCurtain.php?cooCentroX=" + xCenter + "&cooCentroY=" + yCenter + "&zoom=" + zoom + "&listacapas=" + listaCapas);
  }else if (modeViz==6){
    window.open("php/printVertical.php?cooCentroX=" + xCenter + "&cooCentroY=" + yCenter + "&zoom=" + zoom + "&listacapas=" + listaCapas);
  }else if (modeViz==7){
    window.open("php/printHorizontal.php?cooCentroX=" + xCenter + "&cooCentroY=" + yCenter + "&zoom=" + zoom + "&listacapas=" + listaCapas);
  }
});

$("#btnSearchBoxToogle").click(function() {
  $("#topoinput").toggle();
});

$("#btnLayerVizToogle").click(function() {
  $("#toolCoberInfoElem").toggle();
});

$("#btnSocial").click(function() {
  var ok = updatePermalink();//Actualizo el permalink, por si las moscas

  $("#permalinkText").text(window.location.href + actualHash);
  $("#btnSocialFacebook").attr("href", "https://www.facebook.com/sharer.php?u=" + replaceAll($("#permalinkText").text(),"#","%23") + "&t=Comparador del PNOA");
  $("#btnSocialTwitter").attr("href", "http://twitter.com/intent/tweet?text=Comparador del PNOA" + "&url=" + replaceAll($("#permalinkText").text(),"#","%23"));
  $("#btnSocialGooglePlus").attr("href", "https://plus.google.com/share?url=" + replaceAll($("#permalinkText").text(),"#","%23"));
  $("#bidienlace").attr("src", "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=" + replaceAll($("#permalinkText").text(),"#","%23"));
  $('#modalInfoPermalink').modal('show');
});

$("#btnTest").click(function() {
  console.log("Actual Hash: " + actualHash);
  console.log("URL completa: " + window.location.href);
});

//-------------------------------------------
//  Cambios en la visualización
//-------------------------------------------
function mapsRendering(){
  setTimeout( function() {
    objMap.updateSize();
    objMapMirror.updateSize();
  },0);
}

function changeVizMode(indexViz){
  if (modeViz==indexViz){return;}


  var pixelCentral = objMap.getPixelFromCoordinate(objMap.getView().getCenter());
  displayPNOAInfo(pixelCentral,"layersAvailablesList","");

  closeModals();
  var capasHash = null;
  if ( typeof(listaCapas) !== "undefined" && listaCapas !== null ) {
      //No pasa nada
  }else{
    listacapas="mtn50edi1,mtn25edi1"
  }
  if (listaCapas!==''){
    var capasHash = listaCapas.split(",");
  }else{
    if ((indexViz==1) || (indexViz==2) || (indexViz==3) || (indexViz==4)){
      //Si es un modo con capas superpuestas, meeto alguna para muestre algo para invitar al usuario  a lo que puede hacer
      listaCapas = "mtn50edi1,mtn25edi1";
      var capasHash = listaCapas.split(",");
    }
  }
  //Apagamos todas las Capas
  setGroupVisibleByKey(objMap,"imaginery-flight",0);
  $(".toolboxOverlayRaster").bootstrapToggle('off');
  
  $(".opacityLyrClass").slider( "option", "value", 0 ); //Ponemos los slider a 0
  $('[id ^= btnViz]').removeClass('vizModeSelected');
  if (indexViz==0){
    apagarTodo();
    //Encendemos los paneles para seleccionar capas
    $("#panel-AirPhotoLayers").show();
    $("#panel-ATLayers").show();    
    $("#toolTypeWindowViz").hide();
    $("#toolInfoScreenElem").removeClass("toolInfoScreenClassRight toolInfoScreenClassLeft").addClass("toolInfoScreenClassLeft");
    $("#btnVizStandard").addClass('vizModeSelected');
    $("#btnHelpSymbol").show();   //Muestro botón de ayuda
    $("#btnVizModesSymbol").show();   //Muestro botón de modos de visualización
    if (mobileMode==false) {$("#btnVizMode7").show();}
    //Al final cuando venimos de un modo de visualización comparativo no encendemos ninguna capa, porque da más líos que beneficios
    /*
    if (capasHash!==null){
      for (var i = 0, len = capasHash.length; i < len; i++) {
        //Como me produce más dolor de cabeza que otra cosa, cuando me viene encendidas pnoa y cartografia, no las enciendo
        //if ((capasHash[i] == "mapaMTN") || (capasHash[i] == "pnoaActualIGN")){continue;}
        $("#sidebarBtn" + capasHash[i]).bootstrapToggle('on');
        $("#selcob" + capasHash[i]).addClass("btn-success");
      }
    }
    */
    console.log("Modo Standard");
  }else if (indexViz==1){
    if (capasHash.length>=4){
      changeToMosaicViz(getOBJlayerByKeyname(capasHash[0]),getOBJlayerByKeyname(capasHash[1]),getOBJlayerByKeyname(capasHash[2]),getOBJlayerByKeyname(capasHash[3]));
      listaCapas= capasHash[0] + "," + capasHash[1] + "," + capasHash[2] + "," + capasHash[3];
    }else if (capasHash.length==3){
      console.log(capasHash);
      changeToMosaicViz(getOBJlayerByKeyname(capasHash[0]),getOBJlayerByKeyname(capasHash[1]),getOBJlayerByKeyname(capasHash[2]),getLayerSourceByKeyname("mapamtn"));
      listaCapas= capasHash[0] + "," + capasHash[1] + "," + capasHash[2] + "," + "mapamtn";
    }else if (capasHash.length==2){
      console.log("Paso5");
      changeToMosaicViz(getOBJlayerByKeyname(capasHash[0]),getOBJlayerByKeyname(capasHash[1]),getLayerSourceByKeyname("actualpnoa"),getLayerSourceByKeyname("mapamtn"));
      listaCapas= capasHash[0] + "," + capasHash[1] + ",actualpnoa,mapamtn";
    }else if (capasHash.length==1){
      changeToMosaicViz(getOBJlayerByKeyname(capasHash[0]),overlayPNOARasterList[0],overlayPNOARasterList[1],overlayPNOARasterList[2]);
    }else{
      changeToMosaicViz(baseLayerList[0],overlayPNOARasterList[1],overlayPNOARasterList[0],baseLayerList[1]);
    }

    $("#toolTypeWindowViz").show();
    $("#toolCoberInfoElem").show();
    $("#toolInfoScreenElem").removeClass("toolInfoScreenClassRight toolInfoScreenClassLeft").addClass("toolInfoScreenClassLeft");
    $("#btnVizMosaic").addClass('vizModeSelected');
    $("#btnHelpSymbol").show();   //Muestro botón de ayuda
    //$("#btnPrinterSymbol").show();//Muestro impresora porque este modo de viz tiene posiblidad de impresión. ahora lo ocultamos hasta que solucionemos los problemas
    $("#btnVizModesSymbol").show();   //Muestro botón de modos de visualización
    if (mobileMode==false) {$("#btnVizMode7").show();}
    console.log("Modo VizMosaic");
  }else if (indexViz==2){
    if (capasHash.length>=2){
      changeToVerticalSwipeViz(getOBJlayerByKeyname(capasHash[0]),getOBJlayerByKeyname(capasHash[1]));
    }else{
      changeToVerticalSwipeViz(overlayPNOARasterList[0],overlayPNOARasterList[2]);
    }
    $("#toolTypeWindowViz").show();
    $("#toolCoberInfoElem").show();
    $("#toolInfoScreenElem").removeClass("toolInfoScreenClassRight toolInfoScreenClassLeft").addClass("toolInfoScreenClassLeft");
    $("#btnVizSwipeV").addClass('vizModeSelected');
    $("#btnPrinterSymbol").show();//Muestro impresora porque este modo de viz tiene posiblidad de impresión. ahora lo ocultamos hasta que solucionemos los problemas
    $("#btnHelpSymbol").show();       //Muestro botón de ayuda
    $("#btnVizModesSymbol").show();   //Muestro botón de modos de visualización
    if (mobileMode==false) {$("#btnVizMode7").show();}
    console.log("Modo VizSwipeV");
  }else if (indexViz==3){
    if (capasHash.length>=2){
      changeToHorizontalSwipeViz(getOBJlayerByKeyname(capasHash[0]),getOBJlayerByKeyname(capasHash[1]));
    }else{
      changeToHorizontalSwipeViz(overlayPNOARasterList[0],overlayPNOARasterList[2]);
    }
    $("#toolTypeWindowViz").show();
    $("#toolCoberInfoElem").show();
    $("#toolInfoScreenElem").removeClass("toolInfoScreenClassRight toolInfoScreenClassLeft").addClass("toolInfoScreenClassLeft");
    $("#btnVizSwipeH").addClass('vizModeSelected');
    $("#btnPrinterSymbol").show();//Muestro impresora porque este modo de viz tiene posiblidad de impresión. ahora lo ocultamos hasta que solucionemos los problemas
    $("#btnHelpSymbol").show();   //Muestro botón de ayuda
    $("#btnVizModesSymbol").show();   //Muestro botón de modos de visualización
    if (mobileMode==false) {$("#btnVizMode7").show();}
    console.log("Modo VizSwipeH");
  }else if (indexViz==4){
    if (capasHash.length>=1){
      changeToSpotViz(getOBJlayerByKeyname(capasHash[0]));
    }else{
      changeToSpotViz(overlayPNOARasterList[4]);
    }
    $("#toolTypeWindowViz").hide();
    $("#toolCoberInfoElem").show();
    $("#toolInfoScreenElem").removeClass("toolInfoScreenClassRight toolInfoScreenClassLeft").addClass("toolInfoScreenClassLeft");
    $("#btnVizSpot").addClass('vizModeSelected');
    $("#btnHelpSymbol").show();   //Muestro botón de ayuda
    $("#btnVizModesSymbol").show();   //Muestro botón de modos de visualización
    if (mobileMode==false) {$("#btnVizMode7").show();}
    console.log("Modo VizSpot");
  }else if (indexViz==5){
    apagarTodo();
    $("#toolTemporalTransitionElem").show();
    $("#toolCoberInfoElem").show();
    $("#toolTypeWindowViz").hide();
    $("#toolInfoScreenElem").removeClass("toolInfoScreenClassRight toolInfoScreenClassLeft").addClass("toolInfoScreenClassLeft");
    $("#btnVizTimer").addClass('vizModeSelected');
    $("#btnHelpSymbol").show();   //Muestro botón de ayuda
    $("#btnVizModesSymbol").show();   //Muestro botón de modos de visualización
    if (mobileMode==false) {$("#btnVizMode7").show();}
    listaCapas = "";
    console.log("Modo Visor temporal");
  }else if (indexViz==6){
    apagarTodo();
    $(".ign-mainmap-container").removeClass("col-sm-12").addClass("col-sm-6");
    if ($(".ign-mirrormap-container").hasClass("col-sm-12")){
      $(".ign-mirrormap-container").removeClass("col-sm-12").addClass("col-sm-6");
    }
    $(".ign-mainmap-container").css("height", $(window).height()-headerHeight);
    $(".ign-mirrormap-container").css("height", $(window).height()-headerHeight);
    $(".ign-mirrormap-container").show();
    $("#toolTypeWindowViz").hide();
    $("#toolCoberInfoElem").show();
    $("#btnPrinterSymbol").show();//Muestro impresora porque este modo de viz tiene posiblidad de impresión. ahora lo ocultamos hasta que solucionemos los problemas
    $("#btnHelpSymbol").show();   //Muestro botón de ayuda
    $("#btnVizModesSymbol").show();   //Muestro botón de modos de visualización
    if (mobileMode==false) {$("#btnVizMode7").show();}
    $("#toolInfoScreenElem").removeClass("toolInfoScreenClassRight toolInfoScreenClassLeft").addClass("toolInfoScreenClassRight");
    $("#btnVizDoubleScreenV").addClass('vizModeSelected');
    if (capasHash === undefined || capasHash === null) {
      $("#layerInfo1").text("Mapa");
      $("#layerInfo2").text("Híbrido");
      listaCapas="mapamtn,actualpnoa";
    }else{
      if (capasHash.length>=2){
        asignaLayerPrincipal(capasHash[0],"cobselectorText1");
        asignaLayerMirror(capasHash[1],"cobselectorText2");
      }else{
        //$("#layerInfo1").text("Mapa");
        //$("#layerInfo2").text("Híbrido");
        listaCapas="mapamtn,actualpnoa";
      }
    }
    console.log("Modo Visor doble pantalla vertical");
  }else if (indexViz==7){
    apagarTodo();
    if ($(".ign-mainmap-container").hasClass("col-sm-6")){
      $(".ign-mainmap-container").removeClass("col-sm-6").addClass("col-sm-12");
    }
    if ($(".ign-mirrormap-container").hasClass("col-sm-6")){
      $(".ign-mirrormap-container").removeClass("col-sm-6").addClass("col-sm-12");
    }
    $(".ign-mainmap-container").css("height", ($(window).height()-headerHeight)/2);
    $(".ign-mirrormap-container").css("height", ($(window).height()-headerHeight)/2);
    $(".ign-mirrormap-container").show();
    $("#toolCoberInfoElem").show();
    $("#toolTypeWindowViz").hide();
    $("#btnPrinterSymbol").show();//Muestro impresora porque este modo de viz tiene posiblidad de impresión. ahora lo ocultamos hasta que solucionemos los problemas
    //Oculto algunos botones en este modo de visualización para que quepa
    $("#btnHelpSymbol").hide();   //Oculto botón de ayuda
    $("#btnVizModesSymbol").hide();   //Oculto botón de modos de visualización
    $("#btnVizMode7").hide();   //Oculto el botón de modo de visualización de pantalla horizontal
    $("#toolInfoScreenElem").removeClass("toolInfoScreenClassRight toolInfoScreenClassLeft").addClass("toolInfoScreenClassLeft");
    $("#btnVizDoubleScreenH").addClass('vizModeSelected');
    if (capasHash === undefined || capasHash === null) {
      $("#layerInfo5").text("Mapa");
      $("#layerInfo6").text("Híbrido");
      listaCapas="mapamtn,actualpnoa";
    }else{
      if (capasHash.length>=2){
        asignaLayerPrincipal(capasHash[0],"cobselectorText1");
        asignaLayerMirror(capasHash[1],"cobselectorText2");
      }else{
        //$("#layerInfo5").text("Mapa");
        //$("#layerInfo6").text("Híbrido");
        listaCapas="mapamtn,actualpnoa";
      }
      
    }

    console.log("Modo Visor doble pantalla Horizontal");
  }
  apagarOtrasViz(indexViz);
  if (indexViz==6){mapsRendering();} //Si cambiamos al Modo Visor doble pantalla vertical
  if (modeViz==6){mapsRendering();} //Si el modo anterior es Modo Visor doble pantalla vertical
  if (indexViz==7){mapsRendering();} //Si cambiamos al Modo Visor doble pantalla Horizontal
  if (modeViz==7){mapsRendering();} //Si el modo anterior es Modo Visor doble pantalla horizontal
  if (indexViz==0){mapsRendering();} //Si cambiamos al Modo Visor doble pantalla Horizontal
  if (modeViz==0){mapsRendering();} //Si el modo anterior es Modo Visor doble pantalla horizontal


  modeViz=indexViz;
  var pixelCentral = objMap.getPixelFromCoordinate(objMap.getView().getCenter());
  displayPNOAInfo(pixelCentral,"layersAvailablesList","");

}

$("#btnVizStandard, #btnVizMosaic, #btnVizSwipeV, #btnVizSwipeH, #btnVizSpot, #btnVizTimer, #btnVizDoubleScreenV, #btnVizDoubleScreenH").click(function() {

  if ($(this).attr("id")=="btnVizStandard"){
    changeVizMode(0);
  }else if ($(this).attr("id")=="btnVizMosaic"){
    changeVizMode(1);
  }else if ($(this).attr("id")=="btnVizSwipeV"){
    changeVizMode(2);
  }else if ($(this).attr("id")=="btnVizSwipeH"){
    changeVizMode(3);
  }else if ($(this).attr("id")=="btnVizSpot"){
    changeVizMode(4);
  }else if ($(this).attr("id")=="btnVizTimer"){
    changeVizMode(5);
  }else if ($(this).attr("id")=="btnVizDoubleScreenV"){
    changeVizMode(6);
  }else if ($(this).attr("id")=="btnVizDoubleScreenH"){
    changeVizMode(7);
  }
});

$("#btnHelpVizStandard, #btnHelpVizMosaic, #btnHelpVizSwipeV, #btnHelpVizSwipeH, #btnHelpVizSpot, #btnHelpVizTimer, #btnHelpVizDoubleScreenV, #btnHelpVizDoubleScreenH").click(function() {

  if ($(this).attr("id")=="btnHelpVizStandard"){
    changeVizMode(0);
  }else if ($(this).attr("id")=="btnHelpVizMosaic"){
    changeVizMode(1);
  }else if ($(this).attr("id")=="btnHelpVizSwipeV"){
    changeVizMode(2);
  }else if ($(this).attr("id")=="btnHelpVizSwipeH"){
    changeVizMode(3);
  }else if ($(this).attr("id")=="btnHelpVizSpot"){
    changeVizMode(4);
  }else if ($(this).attr("id")=="btnHelpVizTimer"){
    changeVizMode(5);
  }else if ($(this).attr("id")=="btnHelpVizDoubleScreenV"){
    changeVizMode(6);
  }else if ($(this).attr("id")=="btnHelpVizDoubleScreenH"){
    changeVizMode(7);
  }
  sidebar.close();
});



$("#btnTypeWindowViz").change(function(event) {
    console.log("Mode: " + $(this).prop('checked'));
    //event.stopPropagation();
    fixedSizes = $(this).prop('checked');
});

 function dynamicPNOAoverlayOpacity(valueCoberturaRanger){
         var valueSlider = valueCoberturaRanger;
         var parteEntera = parseInt(valueSlider);
         var parteDecimal = parseFloat(valueSlider)-parseInt(valueSlider);
         var parteDecimalInversa = 1-(parseFloat(valueSlider)-parseInt(valueSlider));
         //console.log("proceso valueSlider/parteEntera/parteDecimal:" + valueSlider + "/" + parteEntera + "/" + parteDecimal);
         //return;
         if (parteDecimal==0){
             setLayerPNOAVisibilityAndOpacityByKey(objMap,"imaginery-flight",pnoaSliderCobertura[parteEntera-1],1,1,true);
             if (pnoaSliderCobertura[parteEntera-1]==undefined){
                 $('#coberturaDisplayInfo').html("");
             }else{
                 $('#coberturaDisplayInfo').html("Mostrando " + getPropertyValueFromPNOAOverlaysByYear("title",pnoaSliderCobertura[parteEntera-1]));
             }
             return;
         }

         if (valueSlider<1){
             //console.log("Entro principio");
             setLayerPNOAVisibilityAndOpacityByKey(objMap,"imaginery-flight", pnoaSliderCobertura[parteEntera],1,parteDecimal,true);
             //$('#coberturaDisplayInfo').html("Mostrando orto " + pnoaSliderCobertura[parteEntera]);
             $('#coberturaDisplayInfo').html("Mostrando " + getPropertyValueFromPNOAOverlaysByYear("title",pnoaSliderCobertura[parteEntera]));
         }else{
             //console.log("Entro resto");
             setLayerPNOAVisibilityAndOpacityByKey(objMap,"imaginery-flight", pnoaSliderCobertura[parteEntera-1],1,parteDecimalInversa,true);
             setLayerPNOAVisibilityAndOpacityByKey(objMap,"imaginery-flight", pnoaSliderCobertura[parteEntera],1,parteDecimal,false);
             $('#coberturaDisplayInfo').html("Mostrando " + getPropertyValueFromPNOAOverlaysByYear("title",pnoaSliderCobertura[parteEntera-1]) + " y " + getPropertyValueFromPNOAOverlaysByYear("title",pnoaSliderCobertura[parteEntera]));
         }
 }

function procesarLayerSelected(nomLayer){

  if (modeViz==0){
    $('#sidebarBtn' + nomLayer).bootstrapToggle('toggle');
    if ($('#sidebarBtn' + nomLayer).prop("checked") == true){
      $('#selcob' + nomLayer).addClass("btn-success");
    }else{
      $('#selcob' + nomLayer).removeClass("btn-success");
    }
    return;
  }
  $("#sel-LayerViz").text(nomLayer);
  if (modeViz == 1){
    $("#sel-mosaicViz").fadeIn();
  }else if (modeViz == 2){
    $("#sel-swipeVViz").fadeIn();
  }else if (modeViz == 3){
    $("#sel-swipeHViz").fadeIn();
  }else if (modeViz == 4){
    //Recorremos el array de Vuelos PNOA por si es una capa de PNOA
    for (var i = 0, len = overlayPNOARasterList.length; i < len; i++) {
        if (overlayPNOARasterList[i].getProperties()['keyname']==nomLayer){
            changeToSpotViz(overlayPNOARasterList[i]);
            break;
        }
    }
    //Recorremos el array de baseLayerList por si es una de esas capas
    for (var i = 0, len = baseLayerList.length; i < len; i++) {
        if (baseLayerList[i].getProperties()['keyname']==nomLayer){
            changeToSpotViz(baseLayerList[i]);
            break;
        }
    }
  }else if (modeViz == 5){

    for (var i = 0, len = pnoaSliderCobertura.length; i < len; i++) {
        if (pnoaSliderCobertura[i]==getPropertyValueFromPNOAOverlaysByLayerkey("year",nomLayer)){
            $("#temporalLevel").slider('value',i+1);
            dynamicPNOAoverlayOpacity(i+1);
        }
    }
  }else if (modeViz == 6){
    $("#sel-mirrorVViz").fadeIn();
  }else if (modeViz == 7){
    $("#sel-mirrorHViz").fadeIn();
  }

}

function procesarLayerSelectedDirect(nomLayer,container){

  if (modeViz==0){
    $('#sidebarBtn' + nomLayer).bootstrapToggle('toggle');
    if ($('#sidebarBtn' + nomLayer).prop("checked") == true){
      $('#selcob' + nomLayer).addClass("btn-success");
    }else{
      $('#selcob' + nomLayer).removeClass("btn-success");
    }
    return;
  }
  //$("#sel-LayerViz").text(nomLayer);
  if (modeViz == 1){
    var layerToChange;
    console.log("Busco: " + nomLayer);
    layerChange = getLayerSourceByKeyname(nomLayer);
    console.log("Encuentro: " + layerChange);
    if (container=="cobselector1"){
      changeLayerInMosaicViz(layerChange,"NW");
      $("#cobselectorText1").text(layerChange.getProperties()['alias']);
    }else if (container=="cobselector2"){
      changeLayerInMosaicViz(layerChange,"NE");
      $("#cobselectorText2").text(layerChange.getProperties()['alias']);
    }else if (container=="cobselector3"){
      changeLayerInMosaicViz(layerChange,"SW");
      $("#cobselectorText3").text(layerChange.getProperties()['alias']);
    }else if (container=="cobselector4"){
      changeLayerInMosaicViz(layerChange,"SE");
      $("#cobselectorText4").text(layerChange.getProperties()['alias']);
    }
    hideSelectorPanel();
  }else if (modeViz == 2){
    var layerChange;
    layerChange = getLayerSourceByKeyname(nomLayer);
    if (container=="cobselector1"){
      changeLayerInVerticalSwipeViz(layerChange,"West");
      $("#cobselectorText1").text(layerChange.getProperties()['alias']);
    }
    if (container=="cobselector2"){
      changeLayerInVerticalSwipeViz(layerChange,"East");
      $("#cobselectorText2").text(layerChange.getProperties()['alias']);
    }
    hideSelectorPanel();
  }else if (modeViz == 3){
    var layerChange;
    layerChange = getLayerSourceByKeyname(nomLayer);
    if (container=="cobselector1"){
      changeLayerInHorizontalSwipeViz(layerChange,"North");
      $("#cobselectorText1").text(layerChange.getProperties()['alias']);
    }else{
      changeLayerInHorizontalSwipeViz(layerChange,"South");
      $("#cobselectorText2").text(layerChange.getProperties()['alias']);
    }
    hideSelectorPanel();
  }else if (modeViz == 4){
    var layerChange;
    layerChange = getLayerSourceByKeyname(nomLayer);
    changeToSpotViz(layerChange);
    $("#cobselectorText1").text(layerChange.getProperties()['alias']);
  }else if (modeViz == 5){

    for (var i = 0, len = pnoaSliderCobertura.length; i < len; i++) {
        if (pnoaSliderCobertura[i]==getPropertyValueFromPNOAOverlaysByLayerkey("year",nomLayer)){
            $("#temporalLevel").slider('value',i+1);
            dynamicPNOAoverlayOpacity(i+1);
        }
    }
  }else if (modeViz == 6){
    var capasMirror = listaCapas.split(",");
    if (container=="cobselector1"){
      asignaLayerPrincipal(nomLayer,"cobselectorText1");
    }
    if (container=="cobselector2"){
      asignaLayerMirror(nomLayer,"cobselectorText2");
    }
    hideSelectorPanel();
  }else if (modeViz == 7){
    var capasMirror = listaCapas.split(",");
    if (container=="cobselector1"){
      asignaLayerPrincipal(nomLayer,"cobselectorText1");
    }
    if (container=="cobselector2"){
      asignaLayerMirror(nomLayer,"cobselectorText2");
    }
    hideSelectorPanel();
  }

}



var displayPNOAInfo = function(pixel,targetContainer,textoInfo) {

        var featuresDetect = [];
        var textSelect = [];
        var textoPrevio = ["","","",""];
        var nameClass = "";
        pnoaSliderCobertura= [];

        //Estructura HTML para crear el desplegable de capas. Como quiero crear 4, uso la variable NNumber, que luego relleno con el número de desplegable
        //Creo siempre los cuatro pero muestro 1,2 ó 4 según el modo de visualización
        //Cogemos el texto que viene por defecto, para no perderlo al hacer panning
        for (var i = 1, len = textoPrevio.length; i <= len; i++) {
          textoPrevio[i-1] = $("#cobselectorText" + i).text();
        }
        if ((modeViz == 0) || (modeViz == 4) || (modeViz == 5)){
          textSelect.push("<div id=\"cobSelectorContainerNNumber\" class=\"btn-group btn-flex dropup col-xs-12\" style=\"display:none;\">");
          $("#opacityLevelContainer").hide();
        }else if ((modeViz ==3) || (modeViz == 7)){
          textSelect.push("<div id=\"cobSelectorContainerNNumber\" class=\"btn-group btn-flex dropup col-xs-12\" style=\"display:none;\">");
          $("#opacityLevelContainer").show();
        }else{
          textSelect.push("<div id=\"cobSelectorContainerNNumber\" class=\"btn-group btn-flex dropup col-xs-6\" style=\"display:none;\">");
          $("#opacityLevelContainer").show();
        }
        textSelect.push("<button id=\"cobselectorTextNNumber\" type=\"button\" class=\"btn btn-default btn-xs\"></button>");
        textSelect.push("<button type=\"button\" class=\"btn btn-default btn-xs dropdown-toggle\" data-toggle=\"dropdown\" aria-haspopup=\"true\" aria-expanded=\"false\">");
        textSelect.push("<span class=\"caret\"></span>");
        textSelect.push("<span class=\"sr-only\">Toggle Dropdown</span>");
        textSelect.push("</button>");
        textSelect.push("<ul id=\"cobselectorNNumber\" class=\"dropdown-menu\">");

        //Añadimos las capas de Imaginery-IGN que están visibles siempre. Se podría hacer recorriendo el Array baseLayerList, pero no lo monto por ahora. En el caso del modo Timelapse y en los mirror
        //no se muestran porque creo que confunde al usuario. En la App del Archivo a lo mejor sí
        for (var i = 0, len = overlayIGNRasterList.length; i < len; i++) {
            nameClass = "";
            if(overlayIGNRasterList[i].getProperties()['group']!="imaginery-ign"){continue;}
            textSelect.push("<li id=\"selcob" + overlayIGNRasterList[i].getProperties()['keyname'] + "\" class=\"" + nameClass + "\">" +
                            "<a data=\"" + overlayIGNRasterList[i].getProperties()['keyname'] + "\" href=\"#\">" +
                            "<i class=\"fa fa-map\" aria-hidden=\"true\"></i> " + overlayIGNRasterList[i].getProperties()['nombre'] + "</a></li>");
        }
        for (var i = 0, len = overlayPNOARasterList.length; i < len; i++) {
            nameClass = "";
            //if ($('#sidebarBtn' + overlayPNOARasterList[i].getProperties()['keyname']).prop("checked") == true){ nameClass = "btn-success"; }
            textSelect.push("<li id=\"selcob" + overlayPNOARasterList[i].getProperties()['keyname'] + "\" class=\"" + nameClass + "\">" +
                            "<a data=\"" + overlayPNOARasterList[i].getProperties()['keyname'] + "\" href=\"#\">" +
                            "<i class=\"fa fa-plane\" aria-hidden=\"true\"></i> " + overlayPNOARasterList[i].getProperties()['nombre'] + "</a></li>");
        }
        if ((modeViz != 5) && (modeViz != 6) && (modeViz != 7)){

        }
        
        if (objMap.getView().getZoom()<14){
          //Si el nivel de zoom es menor que 14, muestro atribuciones genéricas
          baseIGN_Mainlyr.getSource().setAttributions(
            new ol.Attribution({
              html: "&copy; <a href='http://www.ign.es' target='_blank' title='Web del Instituto Geográfico Nacional'>Instituto Geográfico Nacional</a> - IGN Base "
            })
          );

        pnoaIGN_Mainlyr.getSource().setAttributions(
            new ol.Attribution({
              html: "&copy; <a href='http://www.ign.es' target='_blank' title='Web del Instituto Geográfico Nacional'>Instituto Geográfico Nacional</a> - PNOA"
            })
          );

        baseIGNTrans_Mainlyr.getSource().setAttributions(
            new ol.Attribution({
              html: " - IGN Base"
            })
          );
        } else {
          objMap.forEachFeatureAtPixel(pixel, function(feature, layer) {

            if (typeof feature.get('atribucion') == 'undefined'){return;}
            if (layer.get('title') !== "Autonomías"){return;}
            //console.log("Título: " + layer.get('title'));
            //console.log(feature.get('atribucion'));
            //console.log($(".ol-attribution ul").html());
            //var cadAttrib = $(".ol-attribution ul").html();
            //cadAttrib = replaceAll(cadAttrib,"#AutonomFootsprints#",feature.get('atribucion'));
            //$(".ol-attribution ul").html(cadAttrib);
            //footprints_lyr.attribution = feature.get('atribucion');
  
            baseIGN_Mainlyr.getSource().setAttributions(
                new ol.Attribution({
                  html: "&copy; <a href='http://www.ign.es' target='_blank'>Instituto Geográfico Nacional</a> - IGN Base cedido por " + feature.get('atribucion')
                })
            );
  
            pnoaIGN_Mainlyr.getSource().setAttributions(
                new ol.Attribution({
                  html: "&copy; <a href='http://www.ign.es' target='_blank'>Instituto Geográfico Nacional</a> - PNOA cedido por " + feature.get('atribucion')
                })
            );
  
            baseIGNTrans_Mainlyr.getSource().setAttributions(
                new ol.Attribution({
                  html: " - IGN Base"
                })
            );
  
          });
        }


        textSelect.push("</ul></div>");
        featuresDetect.sort();
        var containerCoberInfo = document.getElementById(targetContainer);

        containerCoberInfo.innerHTML = "<div class=\"row\">" + replaceAll(textSelect.join(''),"NNumber","1") +
                                    replaceAll(textSelect.join(''),"NNumber","2") + "</div><div class=\"row\">" +
                                    replaceAll(textSelect.join(''),"NNumber","3") +
                                    replaceAll(textSelect.join(''),"NNumber","4") +
                                    "</div>" + textoInfo;

        if (modeViz == 1){
          $("#cobSelectorContainer1").show();
          $("#cobSelectorContainer2").show();
          $("#cobSelectorContainer3").show();
          $("#cobSelectorContainer4").show();
        } else if ((modeViz == 0) ||(modeViz == 4) || (modeViz == 5)) {
          $("#cobSelectorContainer1").show();
        } else {
          $("#cobSelectorContainer1").show();
          $("#cobSelectorContainer2").show();
        }
        hideSelectorPanel();
        pnoaSliderCobertura.sort();

        $('#temporalLevel').slider( "option", "max", pnoaSliderCobertura.length);

        //Como creo en runtime estos componentes, defino dentro de la función el procedimiento de lo que pasa al hacer clic
        $("#cobselector1 li a").click(function(){
          var selText = $(this).text();
          var nomLayer = $(this).attr("data");
          if (nomLayer=="nothing"){return;}
          procesarLayerSelectedDirect(nomLayer,"cobselector1");
        });
        $("#cobselector2 li a").click(function(){
          var selText = $(this).text();
          var nomLayer = $(this).attr("data");
          if (nomLayer=="nothing"){return;}
          procesarLayerSelectedDirect(nomLayer,"cobselector2");
        });
        if (modeViz == 1){
          $("#cobselector3 li a").click(function(){
            var selText = $(this).text();
            var nomLayer = $(this).attr("data");
            if (nomLayer=="nothing"){return;}
            procesarLayerSelectedDirect(nomLayer,"cobselector3");
          });
          $("#cobselector4 li a").click(function(){
            var selText = $(this).text();
            var nomLayer = $(this).attr("data");
            if (nomLayer=="nothing"){return;}
            procesarLayerSelectedDirect(nomLayer,"cobselector4");
          });
        }
        //Pongo los valores por defecto
        for (var i = 1, len = textoPrevio.length; i <= len; i++) {
          if ((textoPrevio[i-1] != "Selecciona capa") && (textoPrevio[i-1] != "")){
            $("#cobselectorText" + i).text(textoPrevio[i-1]);
          }else{
            $("#cobselectorText" + i).text("Selecciona capa");
          }
        }

        $('.btnChangeLayerDisplay').on('click', function(event) {
          var nomLayer = replaceAll(event.target.id,"cob","");
          procesarLayerSelected(nomLayer);
        });

}

function mirrorMap(){

  objMapMirror = new ol.Map({
  		  layers: [capasBaseMirror[0],capasBaseMirror[1],capasBaseMirror[2],
          new ol.layer.Tile({
            title: 'Overlay Mirror',
            visible: false
          })
        ],
  		  target: 'mapMirrorLienzo',
              logo: false,/*Con esto quitamos el logo de OpenLayers del control de atributos*/
  		        controls: ol.control.defaults({
                          zoom: ( mobileMode == true ) ? false : true,
                          attribution: ( mobileMode == true ) ? false : true,
  						attributionOptions: /** @type {olx.control.AttributionOptions} */ ({
  						                    collapsible: true,
                                              tipLabel: 'Créditos',
                                              label:'C'   /*Texto del botón, por defecto es C*/
  			                             })
  		  }).extend(
                    ( mobileMode == true ) ? [] : []),
  		  view: objMap.getView()
      });
      /*
      var layerSwitcher = new ol.control.LayerSwitcher({
        tipLabel: 'Leyenda mirror'
      });
      objMapMirror.addControl(layerSwitcher);
      */
}

function basicMap(){

  objMap = new ol.Map({
    layers: [
      capasBaseMain[0], capasBaseMain[1], capasBaseMain[2]
    ],
    target: 'mapLienzo',
    controls: ol.control.defaults({
      attributionOptions: /** @type {olx.control.AttributionOptions} */ ({
        collapsible: true
      })
    }),
    view: new ol.View({
      projection: 'EPSG:3857', center: ol.proj.transform([initLong, initLat], 'EPSG:4326', 'EPSG:3857'),
      zoom: initZoom, minZoom: initMinZoom, maxZoom: initMaxZoom
    })
  });

  /*
    var layerSwitcher = new ol.control.LayerSwitcher({
      tipLabel: 'Leyenda'
    });
    objMap.addControl(layerSwitcher);
  */


  activateHorizontalSwipeViz(waterColorOSM_lyr, blackWhiteOSM_lyr, 0);
  activateVerticalSwipeViz(basicOSM_lyr, basicOSM2_lyr, 0);
  activateMosaicViz(actualPNOA_lyr, baseIGN_lyr, siose_lyr, mdtign_lyr, 0);
  activateSpotViz(geologicoMinero_lyr, 0);
  loadVizModes();
  //Añadimos la sidebar al mapa
  sidebar = new ol.control.Sidebar({ element: 'sidebar', position: 'left' });
  objMap.addControl(sidebar);

  //Mouse Position
  var mousePositionControl = new ol.control.MousePosition({
    className: 'ol-mouse-position',                      //Es la clase que define el formato de la etiqueta que contiene las coordendas que se muestran. Valor por defecto
    //target: document.getElementById('infoCoo'),
    coordinateFormat: function (coordinateCursor) {
      var numHuso = "00";
      var cadUTMinfo = "";
      var coordinate;
      
      if (mobileMode==true){
        coordinate =  ol.proj.transform(objMap.getView().getCenter(), "EPSG:3857", "EPSG:4326");
        if ((objMap.getView().getZoom()>15) && (modeViz==0)){
          //getZOnWCS(ol.proj.transform(coordinate, 'EPSG:4326', "EPSG:25830"),"Altura en el centro: ");
        }
      }else{
        coordinate = coordinateCursor;
      }
      
      if ((coordinate[1] >= 36) && (coordinate[0] >= -10)) {
        //La coordenada está en la península
        if ((coordinate[0]>=-10) && (coordinate[0]<=-6)){
          numHuso="29";
        }else if ((coordinate[0]>-6) && (coordinate[0]<=0)){
          numHuso="30";
        }else if (coordinate[0]>0){
          numHuso="31";
        }
        resultLL = ol.proj.transform([coordinate[0], coordinate[1]], 'EPSG:4326', "EPSG:258" + numHuso);
        cadUTMinfo="<br/>UTM(" + numHuso + "): " + Math.round(resultLL[0],2) + "," + Math.round(resultLL[1],2);
        return ol.coordinate.format(coordinate, dvmGetEscalaNormalizada(objMap.getView().getZoom()) + ' (Zoom: ' + objMap.getView().getZoom() + ')' + '<br/>ETRS89: {x}, {y}' + cadUTMinfo, 5);
      }
      else if ((coordinate[0] >= -19) && (coordinate[0] <= -13) && (coordinate[1] < 30) && (coordinate[1] > 27)) {
        resultLL = ol.proj.transform([coordinate[0], coordinate[1]], 'EPSG:4326', "EPSG:4083");
        cadUTMinfo="<br/>REGCAN95 UTM(28): " + Math.round(resultLL[0],2) + "," + Math.round(resultLL[1],2);
        return ol.coordinate.format(coordinate, dvmGetEscalaNormalizada(objMap.getView().getZoom()) + ' (Zoom: ' + objMap.getView().getZoom() + ')' + '<br/>WGS84: {x}, {y}' + cadUTMinfo, 5);
      } else {
        return ol.coordinate.format(coordinate, dvmGetEscalaNormalizada(objMap.getView().getZoom()) + ' (Zoom: ' + objMap.getView().getZoom() + ')' + '<br/>WGS84 ({x}, {y})', 5);
      }
    },
    projection: "EPSG:4326",                              //Proyección en que se muestran los datos 
    //target: document.getElementById('mouse-position'), //Contenedor donde se almacenan las coordenadas si estÃ¡ fuera del mapa
    undefinedHTML: '&nbsp;'                            //Valor mostrado cuando no se calculan coordendas.
  });
  objMap.addControl(mousePositionControl);

  objMap.on('pointermove', function(evt) {
    if (evt.dragging) {
        return;
    }
    if ((objMap.getView().getZoom()>15) && (modeViz==0)){
      //getZOnPointer(evt,"Altura en el cursor: ");
    }
  });

  objMap.on('singleclick', function (evt) {

    if (evt.dragging) { return; }
    if (beginMeasurement == true) { return; }
    
    //Detectar Z
    getZOnPointer(evt,"Altura en cursor: ");
    $("#infoCoordinateClic").html("<i class=\"fa fa-map-marker\"></i>" + ol.proj.transform(evt.coordinate, "EPSG:3857", "EPSG:4326")[0] + ", " + ol.proj.transform(evt.coordinate, "EPSG:3857", "EPSG:4326")[1]);
    onPointerClick(evt);

  });

  //objMap.on('moveend', updatePermalink);

  objMap.on('moveend', function (evt) {
    updatePermalink();
    //var coordinateCenter =  ol.proj.transform(objMap.getView().getCenter(), "EPSG:3857", "EPSG:4326");
    if (objMap.getView().getZoom()>=15){
      var coordinateCenterUTM;
      if (objMap.getView().getCenter()[1]<3444248){
        //Estamos en canarias
        coordinateCenterUTM = ol.proj.transform(objMap.getView().getCenter(), "EPSG:3857", "EPSG:4083");
        getZOnWCS(coordinateCenterUTM,"Altura en el centro: ","epsg:4083");
      }else{
        //Estamos en Península
        coordinateCenterUTM = ol.proj.transform(objMap.getView().getCenter(), "EPSG:3857", "EPSG:25830");
        getZOnWCS(coordinateCenterUTM,"Altura en el centro: ","epsg:25830");
      }
    }else{
      $("#infoAlt").text("");
      $("#infoSIOSE").text("");
      $("#infoLidar").text("");
      $("#infoCoordinateClic").text("");
    }


  });

  // restore the view state when navigating through the history, see
  // https://developer.mozilla.org/en-US/docs/Web/API/WindowEventHandlers/onpopstate
  window.addEventListener('popstate', function (event) {
    if (event.state === null) { return; }
    objMap.getView().setCenter(event.state.center);
    objMap.getView().setZoom(event.state.zoom);
    objMap.getView().setRotation(event.state.rotation);
    shouldUpdate = false;
  });
  loadAutonomFootsprints();
  console.log("Main map creado");
}




//Función para redefinir componentes al cambiar la pantalla
function setSizes() {

  if (($(window).width()) < '768'){
    mobileMode = true;
    headerHeight = 35;
    $("#btnVizMode4").hide();
    $("#btnVizMode6").hide();
    $("#btnVizMode7").hide();
    $("#topoinput").hide();
    $("#btnSearchBoxToogleSymbol").show();
    $("#btnLayerVizToogleSymbol").show();
    $(".ol-zoom").hide();
    $("#zoomBaleares").text("Baleares");
    $("#zoomCanarias").text("Canarias");
    
  }
  else if (($(window).width() >= '768') && ($(window).width() < '1199')){
    mobileMode = true;
    headerHeight = 50;
    $("#btnVizMode4").hide();
    $("#btnVizMode6").hide();
    $("#btnVizMode7").hide();
    $("#topoinput").hide();
    $("#btnSearchBoxToogleSymbol").show();
    $("#btnLayerVizToogleSymbol").show();
    $(".ol-zoom").hide();
    $("#zoomBaleares").text("Baleares");
    $("#zoomCanarias").text("Canarias");

  } else {
    mobileMode = false;
    headerHeight = 50;
    $("#btnVizMode4").show();
    $("#btnVizMode6").show();
    $("#btnVizMode7").show();
    $("#topoinput").show();
    $("#btnSearchBoxToogleSymbol").hide();
    $("#btnLayerVizToogleSymbol").hide();
    $(".ol-zoom").show();
    $("#zoomBaleares").text("Islas Baleares");
    $("#zoomCanarias").text("Islas Canarias");

  }

  if (modeViz==7){
    $(".ign-mainmap-container").css("height", ($(window).height()-headerHeight)/2);
    $(".ign-mirrormap-container").css("height", ($(window).height()-headerHeight)/2);
  }else{
    $(".ign-mainmap-container").css("height", $(window).height()-headerHeight);
    $(".ign-mirrormap-container").css("height", $(window).height()-headerHeight);
  }

}


$(window).resize(function() { setSizes();});


$(document).ready(function() {
  //9977715VK3797F
  console.log("Start");
  browserIE=detectIE();
  initHash = window.location.hash;
  showPNOAOnCursor=false;                       //Por defecto: mostramos info de capas en el centro
  mobileMode=false;                             //Por defecto: modo sobremesa
  modeViz = -1;                                  //Por defecto: modo standard
  $('#btnTypeWindowViz').bootstrapToggle('on'); //Por defecto: división estática
  $(window).resize(function() { setSizes();});
  loadBasicOSM(false);
  loadBasicIGN(false);          // Carga de capas IGN. Las capas no se añaden al mapa
  rasterIGNOverlays(false);
  cargaCapasBaseMain();
  cargaCapasBaseMirror();
  basicMap();                   // Carga del entorno y conexión con la API-IGN
  mirrorMap();
  rasterPNOAOverlays(false); //Carga de las capas de vuelos. Las capas sí se añaden al mapa
  setSizes();
  mapsRendering();
  activateMeasurementTools(objMap);
  console.log("Mediciones activadas");
  init_activateDD();
  $('[data-toggle="tooltip"]').tooltip(); 
  console.log("Dragdrop gpx");
  console.log("Versión navegador: " + browserIE);
  console.log("Carga inicial completa");


});
