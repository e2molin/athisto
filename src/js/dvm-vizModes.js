var radius = 75;
var spotOpacity = 100;
var container = document.getElementById('mapLienzo');
var pixelPos=null;
var fixedSizes = true;

var vizLayerGroup = null;
var vizLayerList = new Array();
var spot_Lyr = null;
var nw_Lyr = null;
var ne_Lyr = null;
var sw_Lyr = null;
var se_Lyr = null;
var west_Lyr = null;
var east_Lyr = null;
var north_Lyr = null;
var south_Lyr = null;

/*
Funciones de controles asociadas a los modos de visualización
*/
function hideSelectorPanel(){
  $("#sel-mosaicViz").hide();
  $("#sel-swipeVViz").hide();
  $("#sel-swipeHViz").hide();
  $("#sel-mirrorVViz").hide();
  $("#sel-mirrorHViz").hide();
  //console.log("Oculto paneles");
}


function asignaLayerPrincipal(keyLayer,textoInfoID){
  var flagAsign = false;
  var capasMirror = listaCapas.split(",");

  for (var i = 0, len = overlayPNOARasterList.length; i < len; i++) {
      if (overlayPNOARasterList[i].getProperties()['keyname']==keyLayer){
        $("input[id^='sidebarBtn']" ).bootstrapToggle('off');
        $('#sidebarBtn' + keyLayer).bootstrapToggle('on');
        $("#" + textoInfoID).text(overlayPNOARasterList[i].getProperties()['alias']);
        listaCapas = overlayPNOARasterList[i].getProperties()['keyname'] + "," + capasMirror[1];
        flagAsign = true;
      }
  }
  console.info("test1:" + $("#cobselectorText1").text());
  if (flagAsign){return;}
  for (var i = 0, len = baseLayerList.length; i < len; i++) {
    $("input[id^='sidebarBtn']" ).bootstrapToggle('off');
    $('#sidebarBtn' + keyLayer).bootstrapToggle('on');
    $("#" + textoInfoID).text(baseLayerList[i].getProperties()['alias']);
    listaCapas = baseLayerList[i].getProperties()['keyname'] + "," + capasMirror[1];
    flagAsign = true;
  }
  console.info("test2:" + $("#cobselectorText1").text());
  if (flagAsign){return;}
  //console.log("e2m3: "+ overlayIGNRasterList.length);
  for (var i = 0, len = overlayIGNRasterList.length; i < len; i++) {
    if (overlayIGNRasterList[i].getProperties()['keyname']==keyLayer){
      $("input[id^='sidebarBtn']" ).bootstrapToggle('off');
      $('#sidebarBtn' + keyLayer).bootstrapToggle('on');
      $("#" + textoInfoID).text(overlayIGNRasterList[i].getProperties()['alias']);
      listaCapas = overlayIGNRasterList[i].getProperties()['keyname'] + "," + capasMirror[1];
      flagAsign = true;
    }
  }
  console.info("test3:" + $("#cobselectorText1").text());
}


function asignaLayerMirror(keyLayer,textoInfoID){

  var flagAsign = false;
  var capasMirror = listaCapas.split(",");
  for (var i = 0, len = overlayPNOARasterList.length; i < len; i++) {
      if (overlayPNOARasterList[i].getProperties()['keyname']==keyLayer){
          objMapMirror.getLayers().forEach(
                //Objeto Capa,index
                function (layer, iLayer, layers) {
                    if (iLayer==3){
                      //console.log(overlayPNOARasterList[i]);
                      layer.setSource(overlayPNOARasterList[i].getSource());
                      layer.setVisible(1);
                      $("#" + textoInfoID).text(overlayPNOARasterList[i].getProperties()['alias']);
                      listaCapas = capasMirror[0] + "," + overlayPNOARasterList[i].getProperties()['keyname'];
                      flagAsign=true;
                    }
                });
         break;
      }
  }
  if (flagAsign){return;}

  for (var i = 0, len = baseLayerList.length; i < len; i++) {
      if (baseLayerList[i].getProperties()['keyname']==keyLayer){
          objMapMirror.getLayers().forEach(
                //Objeto Capa,index
                function (layer, iLayer, layers) {
                    if (iLayer==3){
                      layer.setSource(baseLayerList[i].getSource());
                      layer.setVisible(1);
                      $("#" + textoInfoID).text(baseLayerList[i].getProperties()['alias']);
                      listaCapas = capasMirror[0] + "," + baseLayerList[i].getProperties()['keyname'];
                      flagAsign=true;
                    }
                });
         break;
      }
  }
  if (flagAsign){return;}

  for (var i = 0, len = overlayIGNRasterList.length; i < len; i++) {
      if (overlayIGNRasterList[i].getProperties()['keyname']==keyLayer){
          objMapMirror.getLayers().forEach(
                //Objeto Capa,index
                function (layer, iLayer, layers) {
                    if (iLayer==3){
                      layer.setSource(overlayIGNRasterList[i].getSource());
                      layer.setVisible(1);
                      $("#" + textoInfoID).text(overlayIGNRasterList[i].getProperties()['alias']);
                      listaCapas = capasMirror[0] + "," + overlayIGNRasterList[i].getProperties()['keyname'];
                      flagAsign=true;
                    }
                });
         break;
      }
  }


}




var drawVerticalSwipe = new ol.interaction.Draw({
    type: 'Polygon',
    source: new ol.source.Vector(),
    style: new ol.style.Style({
        image: new ol.style.Icon({
            src: 'img/swipeVertical.png',
            size: [64, 64],
            opacity: 1,
            scale: 0.4
        })
    })
});

var drawHorizontalSwipe = new ol.interaction.Draw({
    type: 'Polygon',
    source: new ol.source.Vector(),
    style: new ol.style.Style({
        image: new ol.style.Icon({
            src: 'img/swipeHorizontal.png',
            size: [64, 64],
            opacity: 1,
            scale: 0.4
        })
    })
});


document.addEventListener('keydown', function(evt) {
        if (evt.which === 38) {
          //Key ArrowUp
          radius = Math.min(radius + 5, 200);//
          map.render();
          evt.preventDefault();
        } else if (evt.which === 37) {
          spotOpacity = Math.max(spotOpacity - 4, 30);
          spot_Lyr.setOpacity(spotOpacity/100);
          map.render();
          evt.preventDefault();
        } else if (evt.which === 39) {
          spotOpacity = Math.min(spotOpacity + 4, 100);
          spot_Lyr.setOpacity(spotOpacity/100);
          map.render();
          evt.preventDefault();
        } else if (evt.which === 40) {
          //Key ArrowDown
          radius = Math.max(radius - 5, 25);
          map.render();
          evt.preventDefault();
        }
});

container.addEventListener('mousemove', function(event) {
  mousePosition = objMap.getEventPixel(event);
  objMap.render();
});

container.addEventListener('mouseout', function() {
  mousePosition = null;
  objMap.render();
});

/*Spot Viz Mode*/
function activateSpotViz(spotLayer,visibleInit){

  //Eliminamos visualizaciones previas

  spot_Lyr = spotLayer;
  spot_Lyr.set("title","Spot");
  spot_Lyr.set("keyname","spotLyr");
  spot_Lyr.setVisible(visibleInit);
  spotOpacity = 100;
  spot_Lyr.setOpacity(spotOpacity/100);  //Por defecto la opacidad al arrancar la ponemos a uno



  spot_Lyr.on('precompose', function(event) {
    var ctx = event.context;
    var pixelRatio = event.frameState.pixelRatio;
    ctx.save();
    ctx.beginPath();
    if (mousePosition) {
      // only show a circle around the mouse
      ctx.arc(mousePosition[0] * pixelRatio, mousePosition[1] * pixelRatio,
          radius * pixelRatio, 0, 2 * Math.PI);
      ctx.lineWidth = 5 * pixelRatio;
      ctx.strokeStyle = 'rgba(0,0,0,0.5)';
      ctx.stroke();
    }
    ctx.clip();
  });

  // after rendering the layer, restore the canvas context
  spot_Lyr.on('postcompose', function(event) {
    var ctx = event.context;
    ctx.restore();
  });

  vizLayerList.push(spot_Lyr);
  console.log("Activo Spot: " + spotLayer.getProperties()['alias']);

}

/*Mosaic Viz Mode */
function activateMosaicViz(NWLayer,NELayer,SWLayer,SELayer,visibleInit){

    nw_Lyr = NWLayer;
    nw_Lyr.set("title","MosaicNW");
    nw_Lyr.set("keyname","mosaicNW");
    nw_Lyr.setVisible(visibleInit);

    ne_Lyr = NELayer;
    ne_Lyr.set("title","MosaicNE");
    ne_Lyr.set("keyname","mosaicNE");
    ne_Lyr.setVisible(visibleInit);

    sw_Lyr = SWLayer;
    sw_Lyr.set("title","MosaicSW");
    sw_Lyr.set("keyname","mosaicSW");
    sw_Lyr.setVisible(visibleInit);

    se_Lyr = SELayer;
    se_Lyr.set("title","MosaicSE");
    se_Lyr.set("keyname","mosaicSE");
    se_Lyr.setVisible(visibleInit);

    nw_Lyr.on('precompose', function(event) {
      var widthMouse;
      var heightMouse;
      var ctx = event.context;
      var pixelRatio = event.frameState.pixelRatio;
      if (typeof mousePosition === 'undefined'){
        pixelPos = objMap.getSize();
        widthMouse = pixelPos[0];
        heightMouse = pixelPos[1];
      }else{
        if (mousePosition) {
          widthMouse = mousePosition[0] * pixelRatio;
          heightMouse = mousePosition[1] * pixelRatio;
        }else{
          pixelPos = objMap.getSize();
          widthMouse = pixelPos[0];
          heightMouse = pixelPos[1];
        }
      }
      ctx.save();
      ctx.beginPath();
      if (fixedSizes==false){
        ctx.rect(0, 0, widthMouse-2*pixelRatio, heightMouse-2*pixelRatio);
      }else{
        ctx.rect(0, 0, objMap.getSize()[0]* pixelRatio/2-2*pixelRatio, objMap.getSize()[1]* pixelRatio/2-2*pixelRatio);
      }
      ctx.lineWidth = 4 * pixelRatio;
      ctx.strokeStyle = 'rgba(0, 102, 204, 0.9)';
      ctx.stroke();
      ctx.clip();
    });
    nw_Lyr.on('postcompose', function(event) {
      var ctx = event.context;
      ctx.restore();
    });

    ne_Lyr.on('precompose', function(event) {
      var widthMouse;
      var heightMouse;
      var ctx = event.context;
      var pixelRatio = event.frameState.pixelRatio;
      if (typeof mousePosition === 'undefined'){
        pixelPos = objMap.getSize();
        widthMouse = pixelPos[0];
        heightMouse = pixelPos[1];
      }else{
        if (mousePosition) {
          widthMouse = mousePosition[0] * pixelRatio;
          heightMouse = mousePosition[1] * pixelRatio;
        }else{
          pixelPos = objMap.getSize();
          widthMouse = pixelPos[0];
          heightMouse = pixelPos[1];
        }
      }
      ctx.save();
      ctx.beginPath();
      if (fixedSizes==false){
        ctx.rect(widthMouse, 0, ctx.canvas.width - widthMouse, heightMouse);
      }else{
        ctx.rect(objMap.getSize()[0]* pixelRatio/2, 0, ctx.canvas.width - objMap.getSize()[0]* pixelRatio/2, objMap.getSize()[1]* pixelRatio/2);
      }

      ctx.clip();
    });
    ne_Lyr.on('postcompose', function(event) {
      var ctx = event.context;
      ctx.restore();
    });

    sw_Lyr.on('precompose', function(event) {
      var widthMouse;
      var heightMouse;
      var ctx = event.context;
      var pixelRatio = event.frameState.pixelRatio;
      if (typeof mousePosition === 'undefined'){
        pixelPos = objMap.getSize();
        widthMouse = pixelPos[0];
        heightMouse = pixelPos[1];
      }else{
        if (mousePosition) {
          widthMouse = mousePosition[0] * pixelRatio;
          heightMouse = mousePosition[1] * pixelRatio;
        }else{
          pixelPos = objMap.getSize();
          widthMouse = pixelPos[0];
          heightMouse = pixelPos[1];
        }
      }
      ctx.save();
      ctx.beginPath();
      if (fixedSizes==false){
        ctx.rect(0, heightMouse, widthMouse, ctx.canvas.height-heightMouse);
      }else{
        ctx.rect(0, objMap.getSize()[1]* pixelRatio/2, objMap.getSize()[0]* pixelRatio/2, ctx.canvas.height-objMap.getSize()[1]* pixelRatio/2);
      }
      ctx.clip();
    });
    sw_Lyr.on('postcompose', function(event) {
      var ctx = event.context;
      ctx.restore();
    });

    se_Lyr.on('precompose', function(event) {
      var widthMouse;
      var heightMouse;
      var ctx = event.context;
      var pixelRatio = event.frameState.pixelRatio;
      if (typeof mousePosition === 'undefined'){
        pixelPos = objMap.getSize();
        widthMouse = pixelPos[0];
        heightMouse = pixelPos[1];
      }else{
        if (mousePosition) {
          widthMouse = mousePosition[0] * pixelRatio;
          heightMouse = mousePosition[1] * pixelRatio;
        }else{
          pixelPos = objMap.getSize();
          widthMouse = pixelPos[0];
          heightMouse = pixelPos[1];
        }
      }
      ctx.save();
      ctx.beginPath();
      if (fixedSizes==false){
        ctx.rect(widthMouse+2*pixelRatio, heightMouse+2*pixelRatio, ctx.canvas.width - widthMouse, ctx.canvas.height-heightMouse);
      }else{
        ctx.rect(objMap.getSize()[0]* pixelRatio/2+2*pixelRatio, objMap.getSize()[1]* pixelRatio/2+2*pixelRatio, ctx.canvas.width - objMap.getSize()[0]* pixelRatio/2, ctx.canvas.height-objMap.getSize()[1]* pixelRatio/2);
      }
      ctx.lineWidth = 4 * pixelRatio;
      ctx.strokeStyle = 'rgba(0, 102, 204, 0.9)';
      ctx.stroke();
      //ctx.clip();
      ctx.clip();
    });
    se_Lyr.on('postcompose', function(event) {
      var ctx = event.context;
      ctx.restore();
    });

  vizLayerList.push(nw_Lyr);
  vizLayerList.push(ne_Lyr);
  vizLayerList.push(se_Lyr);
  vizLayerList.push(sw_Lyr);
}

/*Swipe Vertical Function*/
function activateVerticalSwipeViz(WestLayer,EastLayer,visibleInit){

    west_Lyr = WestLayer;
    west_Lyr.set("title","SwipeW");
    west_Lyr.set("keyname","swipeWest");
    west_Lyr.setVisible(visibleInit);

    east_Lyr = EastLayer;
    east_Lyr.set("title","SwipeE");
    east_Lyr.set("keyname","swipeEast");
    east_Lyr.setVisible(visibleInit);

    west_Lyr.on('precompose', function(event) {
      var widthMouse;
      var heightMouse;
      var opacidadSwipe;
      var ctx = event.context;
      var pixelRatio = event.frameState.pixelRatio;
      var lienzoMapa = objMap.getSize();
      if (typeof mousePosition === 'undefined'){
        widthMouse = lienzoMapa[0];
        heightMouse = lienzoMapa[1];
      }else{
        if (mousePosition) {
          var semiVerticalScreen=lienzoMapa[1]/2;
  /*
          if (fixedSizes==false){
            //Quitamos la opacidad variable con el cursor
            //opacidadSwipe = Math.max(100-(Math.abs(semiVerticalScreen - mousePosition[1] * pixelRatio))*100/semiVerticalScreen, 5);
            opacidadSwipe = 100;
          }else{
            opacidadSwipe = 100;
          }
          if (mousePosition[1] * pixelRatio<=semiVerticalScreen){
            //west_Lyr.setOpacity(opacidadSwipe/100);
          }else{
            //west_Lyr.setOpacity(1);
          }
  */
          widthMouse = mousePosition[0] * pixelRatio;
          heightMouse = lienzoMapa[1];
        }else{
          pixelPos = objMap.getSize();
          //west_Lyr.setOpacity(1);
          widthMouse = lienzoMapa[0];
          heightMouse = lienzoMapa[1];
        }
      }      
      ctx.save();
      ctx.beginPath();
      if (fixedSizes==true){
        ctx.rect(0, 0, lienzoMapa[0]/2 * pixelRatio - 2 * pixelRatio, heightMouse * pixelRatio);
      }else{
        ctx.rect(0, 0, widthMouse - 2 * pixelRatio, heightMouse* pixelRatio);
      }
      ctx.lineWidth = 4 * pixelRatio;
      ctx.strokeStyle = 'rgba(0, 102, 204, 0.9)';
      ctx.stroke();
      ctx.clip();
    });
    west_Lyr.on('postcompose', function(event) {
      var ctx = event.context;
      ctx.restore();
    });

    east_Lyr.on('precompose', function(event) {
      var widthMouse;
      var heightMouse;
      var opacidadSwipe;
      var ctx = event.context;
      var pixelRatio = event.frameState.pixelRatio;
      var lienzoMapa = objMap.getSize();
      if (typeof mousePosition === 'undefined'){
        widthMouse = lienzoMapa[0];
        heightMouse = lienzoMapa[1];
      }else{
        if (mousePosition) {
          var semiVerticalScreen=lienzoMapa[1]/2;
  /*
          if (fixedSizes==false){
            //Quitamos la opacidad variable con el cursor
            //opacidadSwipe = Math.max(100-(Math.abs(semiVerticalScreen- mousePosition[1] * pixelRatio))*100/semiVerticalScreen, 5);
            opacidadSwipe = 100;
          }else{
            opacidadSwipe = 100;
          }
          if (mousePosition[1] * pixelRatio>semiVerticalScreen){
            east_Lyr.setOpacity(opacidadSwipe/100);
          }else{
            east_Lyr.setOpacity(1);
          }
  */
          widthMouse = mousePosition[0] * pixelRatio;
          heightMouse = lienzoMapa[1];
        }else{
          //east_Lyr.setOpacity(1);
          widthMouse = lienzoMapa[0];
          heightMouse = lienzoMapa[1];
        }
      }
      ctx.save();
      ctx.beginPath();
      if (fixedSizes==true){
        ctx.rect(lienzoMapa[0]* pixelRatio/2, 0, ctx.canvas.width - lienzoMapa[0]* pixelRatio/2, heightMouse * pixelRatio);
      }else{
        ctx.rect(widthMouse, 0, ctx.canvas.width - widthMouse, heightMouse* pixelRatio);
      }
      ctx.clip();
    });
    east_Lyr.on('postcompose', function(event) {
      var ctx = event.context;
      ctx.restore();
    });

    vizLayerList.push(west_Lyr);
    vizLayerList.push(east_Lyr);

}

/*Swipe Horizontal Function*/
function activateHorizontalSwipeViz(NorthLayer,SouthLayer,visibleInit){

  north_Lyr = NorthLayer;
  north_Lyr.set("title","SwipeN");
  north_Lyr.set("keyname","swipeNorth");
  north_Lyr.setVisible(visibleInit);


  south_Lyr = SouthLayer;
  south_Lyr.set("title","SwipeS");
  south_Lyr.set("keyname","swipeSouth");
  south_Lyr.setVisible(visibleInit);

  north_Lyr.on('precompose', function(event) {
    var widthMouse;
    var heightMouse;
    var ctx = event.context;
    var pixelRatio = event.frameState.pixelRatio;
    var lienzoMapa = objMap.getSize();

    if (typeof mousePosition === 'undefined'){
      widthMouse = lienzoMapa[0];
      heightMouse = lienzoMapa[1];
    }else{
      if (mousePosition) {
        var semiHorizontalScreen=lienzoMapa[0]/2;
        /*
        if (fixedSizes==false){
          //Quitamos la opacidad variable con el cursor
          opacidadSwipe = 100;
          opacidadSwipe = Math.max(100-(Math.abs(semiHorizontalScreen- mousePosition[0] * pixelRatio))*100/semiHorizontalScreen, 5);
        }else{
          opacidadSwipe = 100;
        }
        if (mousePosition[0] * pixelRatio<=semiHorizontalScreen){
          north_Lyr.setOpacity(opacidadSwipe/100);
        }else{
          north_Lyr.setOpacity(1);
        }
        */
        widthMouse = lienzoMapa[0];
        heightMouse = mousePosition[1] * pixelRatio;
      }else{
        //north_Lyr.setOpacity(1);
        widthMouse = lienzoMapa[0];
        heightMouse = lienzoMapa[1];
      }
    }
    ctx.save();
    ctx.beginPath();
    if (fixedSizes==false){
      ctx.rect(0, 0, widthMouse * pixelRatio, heightMouse- 2 * pixelRatio);
    }else{
      ctx.rect(0, 0, widthMouse * pixelRatio, lienzoMapa[1]* pixelRatio/2 - 2 * pixelRatio);
    }
    ctx.lineWidth = 4 * pixelRatio;
    ctx.strokeStyle = 'rgba(0, 102, 204, 0.9)';
    ctx.stroke();
    ctx.clip();
  });
  north_Lyr.on('postcompose', function(event) {
    var ctx = event.context;
    ctx.restore();
  });

  south_Lyr.on('precompose', function(event) {
    var widthMouse;
    var heightMouse;
    var ctx = event.context;
    var pixelRatio = event.frameState.pixelRatio;
    var lienzoMapa = objMap.getSize();
    if (typeof mousePosition === 'undefined'){
      widthMouse = lienzoMapa[0];
      heightMouse = lienzoMapa[1];
    }else{    
      if (mousePosition) {
        var semiHorizontalScreen=lienzoMapa[0]/2;
        /*
        if (fixedSizes==false){
          //Quitamos la opacidad variable con el cursor
          //opacidadSwipe = Math.max(100-(Math.abs(semiHorizontalScreen- mousePosition[0] * pixelRatio))*100/semiHorizontalScreen, 5);
          opacidadSwipe = 100;
        }else{
          opacidadSwipe = 100;
        }
        if (mousePosition[0] * pixelRatio>semiHorizontalScreen){
          south_Lyr.setOpacity(opacidadSwipe/100);
        }else{
          south_Lyr.setOpacity(1);
        }
        */
        widthMouse = lienzoMapa[0];
        heightMouse = mousePosition[1] * pixelRatio;
      }else{
        //south_Lyr.setOpacity(1);
        widthMouse = lienzoMapa[0];
        heightMouse = lienzoMapa[1];
      }
    }
    ctx.save();
    ctx.beginPath();
    if (fixedSizes==false){
      ctx.rect(0, heightMouse* pixelRatio, widthMouse* pixelRatio, ctx.canvas.height-heightMouse*pixelratio);
    }else{
      ctx.rect(0, lienzoMapa[1]* pixelRatio/2, widthMouse* pixelRatio, ctx.canvas.height-lienzoMapa[1]* pixelRatio/2);
    }

    ctx.clip();
  });
  south_Lyr.on('postcompose', function(event) {
    var ctx = event.context;
    ctx.restore();
  });

    vizLayerList.push(north_Lyr);
    vizLayerList.push(south_Lyr);

}

function apagarTodo(){

  spot_Lyr.setVisible(0);
  west_Lyr.setVisible(0);
  east_Lyr.setVisible(0);
  north_Lyr.setVisible(0);
  south_Lyr.setVisible(0);
  nw_Lyr.setVisible(0);
  ne_Lyr.setVisible(0);
  sw_Lyr.setVisible(0);
  se_Lyr.setVisible(0);
  objMap.removeInteraction(drawVerticalSwipe);
  objMap.removeInteraction(drawHorizontalSwipe);
  hideSelectorPanel();
  console.log("Apagado todo");
}

function changeToVerticalSwipeViz(WestLayer,EastLayer){
  console.log("changeToVerticalSwipeViz");
  west_Lyr.setSource(WestLayer.getSource());
  west_Lyr.set("alias",WestLayer.getProperties()['alias']);
  west_Lyr.set("keyname",WestLayer.getProperties()['keyname']);
  east_Lyr.setSource(EastLayer.getSource());
  east_Lyr.set("alias",EastLayer.getProperties()['alias']);
  east_Lyr.set("keyname",EastLayer.getProperties()['keyname']);
  $.when(apagarTodo()).done( function(){
    west_Lyr.setVisible(1);
    east_Lyr.setVisible(1);
    if (fixedSizes==false){
      objMap.addInteraction(drawVerticalSwipe);
    }
    $("#cobselectorText1").text(WestLayer.getProperties()['alias']);
    $("#cobselectorText2").text(EastLayer.getProperties()['alias']);
    listaCapas = west_Lyr.getProperties()['keyname'] + "," + east_Lyr.getProperties()['keyname'];
  });
}

function changeLayerInVerticalSwipeViz(layerChange,posicion){
  if (posicion=="West") {
    west_Lyr.setSource(layerChange.getSource());
    west_Lyr.set("alias",layerChange.getProperties()['alias']);
    west_Lyr.set("keyname",layerChange.getProperties()['keyname']);
    $("#cobselectorText1").text(layerChange.getProperties()['alias']);
  }
  if (posicion=="East") {
    east_Lyr.setSource(layerChange.getSource());
    east_Lyr.set("alias",layerChange.getProperties()['alias']);
    east_Lyr.set("keyname",layerChange.getProperties()['keyname']);
    $("#cobselectorText2").text(layerChange.getProperties()['alias']);
  }
  $.when(apagarTodo()).done( function(){
    west_Lyr.setVisible(1);
    east_Lyr.setVisible(1);
    if (fixedSizes==false){
      objMap.addInteraction(drawVerticalSwipe);
    }
    listaCapas = west_Lyr.getProperties()['keyname'] + "," + east_Lyr.getProperties()['keyname'];
  });
}

function changeToHorizontalSwipeViz(NorthLayer,SouthLayer){
  console.log("changeToHorizontalSwipeViz");
  north_Lyr.setSource(NorthLayer.getSource());
  north_Lyr.set("alias",NorthLayer.getProperties()['alias']);
  north_Lyr.set("keyname",NorthLayer.getProperties()['keyname']);
  south_Lyr.setSource(SouthLayer.getSource());
  south_Lyr.set("alias",SouthLayer.getProperties()['alias']);
  south_Lyr.set("keyname",SouthLayer.getProperties()['keyname']);
  $("#cobselectorText1").text(NorthLayer.getProperties()['alias']);
  $("#cobselectorText2").text(SouthLayer.getProperties()['alias']);
  $.when(apagarTodo()).done( function(){
    north_Lyr.setVisible(1);
    south_Lyr.setVisible(1);
    if (fixedSizes==false){
      objMap.addInteraction(drawHorizontalSwipe);
    }
    listaCapas = north_Lyr.getProperties()['keyname'] + "," + south_Lyr.getProperties()['keyname'];
  });
}

function changeLayerInHorizontalSwipeViz(layerChange,posicion){
  if (posicion=="North") {
    north_Lyr.setSource(layerChange.getSource());
    north_Lyr.set("alias",layerChange.getProperties()['alias']);
    north_Lyr.set("keyname",layerChange.getProperties()['keyname']);
    $("#cobselectorText1").text(layerChange.getProperties()['alias']);
  }
  if (posicion=="South") {
    south_Lyr.setSource(layerChange.getSource());
    south_Lyr.set("alias",layerChange.getProperties()['alias']);
    south_Lyr.set("keyname",layerChange.getProperties()['keyname']);
    $("#cobselectorText2").text(layerChange.getProperties()['alias']);
  }
  $.when(apagarTodo()).done( function(){
    north_Lyr.setVisible(1);
    south_Lyr.setVisible(1);
    if (fixedSizes==false){
      objMap.addInteraction(drawHorizontalSwipe);
    }
    listaCapas = north_Lyr.getProperties()['keyname'] + "," + south_Lyr.getProperties()['keyname'];
  });
}

function changeToSpotViz(spotLayer){
  console.log("changeToSpotViz");
  spot_Lyr.setSource(spotLayer.getSource());
  spot_Lyr.set("alias",spotLayer.getProperties()['alias']);
  spot_Lyr.set("keyname",spotLayer.getProperties()['keyname']);
  $("#cobselectorText1").text(spotLayer.getProperties()['alias']);
  $.when(apagarTodo()).done( function(){
    spot_Lyr.setVisible(1);
    listaCapas = spotLayer.getProperties()['keyname'];
  });
  console.log("Campio a Spot: " + spotLayer.getProperties()['alias']);
}

function changeToMosaicViz(NWLayer,NELayer,SWLayer,SELayer){
  console.log("changeToMosaicViz");
  nw_Lyr.setSource(NWLayer.getSource());
  nw_Lyr.set("alias",NWLayer.getProperties()['alias']);
  nw_Lyr.set("keyname",NWLayer.getProperties()['keyname']);
  ne_Lyr.setSource(NELayer.getSource());
  ne_Lyr.set("alias",NELayer.getProperties()['alias']);
  ne_Lyr.set("keyname",NELayer.getProperties()['keyname']);
  sw_Lyr.setSource(SWLayer.getSource());
  sw_Lyr.set("alias",SWLayer.getProperties()['alias']);
  sw_Lyr.set("keyname",SWLayer.getProperties()['keyname']);
  se_Lyr.setSource(SELayer.getSource());
  se_Lyr.set("alias",SELayer.getProperties()['alias']);
  se_Lyr.set("keyname",SELayer.getProperties()['keyname']);
  $("#cobselectorText1").text(NWLayer.getProperties()['alias']);
  $("#cobselectorText2").text(NELayer.getProperties()['alias']);
  $("#cobselectorText3").text(SWLayer.getProperties()['alias']);
  $("#cobselectorText4").text(SELayer.getProperties()['alias']);

  $.when(apagarTodo()).done( function(){
    nw_Lyr.setVisible(1);
    ne_Lyr.setVisible(1);
    sw_Lyr.setVisible(1);
    se_Lyr.setVisible(1);
    listaCapas = nw_Lyr.getProperties()['keyname'] + "," + ne_Lyr.getProperties()['keyname'] + "," + sw_Lyr.getProperties()['keyname'] + "," + se_Lyr.getProperties()['keyname'];
  });
}

function changeLayerInMosaicViz(layerChange,posicion){
  if (posicion=="NW") {
    nw_Lyr.setSource(layerChange.getSource());
    nw_Lyr.set("alias",layerChange.getProperties()['alias']);
    nw_Lyr.set("keyname",layerChange.getProperties()['keyname']);
    $("#cobselectorText1").text(layerChange.getProperties()['alias']);
  }else if (posicion=="NE") {
    ne_Lyr.setSource(layerChange.getSource());
    ne_Lyr.set("alias",layerChange.getProperties()['alias']);
    ne_Lyr.set("keyname",layerChange.getProperties()['keyname']);
    $("#cobselectorText2").text(layerChange.getProperties()['alias']);
  }else if (posicion=="SW") {
    sw_Lyr.setSource(layerChange.getSource());
    sw_Lyr.set("alias",layerChange.getProperties()['alias']);
    sw_Lyr.set("keyname",layerChange.getProperties()['keyname']);
    $("#cobselectorText3").text(layerChange.getProperties()['alias']);
  }else if (posicion=="SE") {
    se_Lyr.setSource(layerChange.getSource());
    se_Lyr.set("alias",layerChange.getProperties()['alias']);
    se_Lyr.set("keyname",layerChange.getProperties()['keyname']);
    $("#cobselectorText4").text(layerChange.getProperties()['alias']);
  }
  $.when(apagarTodo()).done( function(){
    nw_Lyr.setVisible(1);
    ne_Lyr.setVisible(1);
    sw_Lyr.setVisible(1);
    se_Lyr.setVisible(1);
    listaCapas = nw_Lyr.getProperties()['keyname'] + "," + ne_Lyr.getProperties()['keyname'] + "," + sw_Lyr.getProperties()['keyname'] + "," + se_Lyr.getProperties()['keyname'];
  });
}


function loadVizModes(){

  objMap.addLayer(spot_Lyr);
  objMap.addLayer(nw_Lyr);
  objMap.addLayer(ne_Lyr);
  objMap.addLayer(se_Lyr);
  objMap.addLayer(sw_Lyr);
  objMap.addLayer(west_Lyr);
  objMap.addLayer(east_Lyr);
  objMap.addLayer(north_Lyr);
  objMap.addLayer(south_Lyr);
  
}
