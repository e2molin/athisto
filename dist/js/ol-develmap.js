var resultToponim_lyr;function detectIE(){var ua=window.navigator.userAgent,msie=ua.indexOf("MSIE ");if(0<msie)return parseInt(ua.substring(msie+5,ua.indexOf(".",msie)),10);if(0<ua.indexOf("Trident/")){var rv=ua.indexOf("rv:");return parseInt(ua.substring(rv+3,ua.indexOf(".",rv)),10)}var edge=ua.indexOf("Edge/");return 0<edge?parseInt(ua.substring(edge+5,ua.indexOf(".",edge)),10):-1}function dvmGetEscalaNormalizada(nivelZoom){switch(nivelZoom){case 20:return"Escala 1:500";case 19:return"Escala 1:1.000";case 18:return"Escala 1:2.000";case 17:return"Escala 1:4.250";case 16:return"Escala 1:8.500";case 15:return"Escala 1:17.000";case 14:return"Escala 1:34.000";case 13:return"Escala 1:68.000";case 12:return"Escala 1:136.500";case 11:return"Escala 1:273.000";case 10:return"Escala 1:546.000";case 9:return"Escala 1:1.100.000";case 8:return"Escala 1:2.185.000";case 7:return"Escala 1:4.370.000";case 6:return"Escala 1:8.735.000";case 5:return"Escala 1:17.471.000";case 4:return"Escala 1:34.942.000";default:return"Zoom "+nivelZoom}}function getLayerOLById(indexLayer){var layerUser=null;return objMap.getLayers().forEach(function(layer,iLayer,layers){iLayer==indexLayer&&(layerUser=layer)}),layerUser}function getLayerOLByKeyname(keyName){var layerUser=null;return objMap.getLayers().forEach(function(layer,iLayer,layers){layer.getProperties().keyname==keyName&&(layerUser=layer)}),layerUser}function getLayerOLByTitle(titleName){var layerUser=null;return objMap.getLayers().forEach(function(layer,iLayer,layers){layer.getProperties().title==titleName&&(layerUser=layer)}),layerUser}function getLayerPropertyBykeyname(mapOL,keyName,nameProperty){var layerProp=null;return mapOL.getLayers().forEach(function(layer,iLayer,layers){layer.getProperties().keyname==keyName&&(layerProp=layer.getProperties()[nameProperty])}),layerProp}function setLayerVisibleByIndex(mapOL,indexLayer,visibleValue){mapOL.getLayers().forEach(function(layer,iLayer,layers){iLayer==indexLayer&&(layer.setVisible(visibleValue),layer.setOpacity(1))})}function setLayerVisibleByKey(mapOL,layerKey,visibleValue){mapOL.getLayers().forEach(function(layer,iLayer,layers){layer.getProperties().keyname==layerKey&&(layer.setVisible(visibleValue),layer.setOpacity(1))})}function setZoomToLayerByKey(mapOL3,layerKey){mapOL3.getLayers().forEach(function(grupoLayers,i){grupoLayers instanceof ol.layer.Group&&grupoLayers.getLayers().forEach(function(sublayer,j){sublayer instanceof ol.layer.Base&&sublayer.getProperties().keyname==layerKey&&mapOL3.getView().fit(sublayer.getSource().getExtent(),mapOL3.getSize())})})}function setLayerVisibleByKeyGroup(mapOL3,layerKey,visibleValue){mapOL3.getLayers().forEach(function(grupoLayers,i){grupoLayers instanceof ol.layer.Group&&grupoLayers.getLayers().forEach(function(sublayer,j){sublayer instanceof ol.layer.Base&&sublayer.getProperties().keyname==layerKey&&sublayer.setVisible(visibleValue)})})}function setGroupVisibleByKey(mapOL,groupName,visibleValue){mapOL.getLayers().forEach(function(layer,iLayer,layers){layer.getProperties().group==groupName&&layer.setVisible(visibleValue)})}function setLayerVisibleByTitle(mapOL,title,visibleValue){mapOL.getLayers().forEach(function(layer,iLayer,layers){layer.getProperties().title==title&&layer.setVisible(visibleValue)})}function manageOverlaysByGroup(mapOL,groupname,operation,valor){mapOL.getLayers().forEach(function(layer,iLayer,layers){layer.getProperties().group==groupname&&1==layer.getProperties().visible&&"opacity"==operation&&layer.setOpacity(valor/100)})}function manageVisibleOverlaysByGroup(mapOL,groupname,operation,valor){mapOL.getLayers().forEach(function(layer,iLayer,layers){layer.getProperties().group==groupname&&1==layer.getProperties().visible&&"opacity"==operation&&layer.setOpacity(valor/100)})}function manageVisibleOverlaysByKeyname(mapOL,keyname,operation,valor){mapOL.getLayers().forEach(function(layer,iLayer,layers){layer.getProperties().keyname==keyname&&1==layer.getProperties().visible&&"opacity"==operation&&layer.setOpacity(valor/100)})}function manageVisibleOverlaysByTitle(mapOL,title,operation,valor){mapOL.getLayers().forEach(function(layer,iLayer,layers){layer.getProperties().title==title&&1==layer.getProperties().visible&&"opacity"==operation&&layer.setOpacity(valor/100)})}function setLayerPNOAVisibilityAndOpacityByKey(mapOL,groupname,yearOrto,valueVisibility,valueOpacity,offOthers){mapOL.getLayers().forEach(function(layer,iLayer,layers){layer.getProperties().group==groupname&&layer.getProperties().year==yearOrto?(layer.setVisible(valueVisibility),layer.setOpacity(valueOpacity),1==valueVisibility?$("#sidebarBtn"+layer.getProperties().keyname).bootstrapToggle("on"):$("#sidebarBtn"+layer.getProperties().keyname).bootstrapToggle("off")):offOthers&&layer.getProperties().group==groupname&&(layer.setVisible(0),$("#sidebarBtn"+layer.getProperties().keyname).bootstrapToggle("off"))})}function dvmListLayersOnConsole(mapOL3){mapOL3.getLayers().forEach(function(grupoLayers,i){grupoLayers instanceof ol.layer.Group&&grupoLayers.getLayers().forEach(function(sublayer,j){ol.layer.Base}),grupoLayers instanceof ol.layer.Base&&("IGN-BASE"==grupoLayers.getProperties().title&&(fullScreen_lyr=grupoLayers),"PNOA"==grupoLayers.getProperties().title&&(spotScreen_lyr=grupoLayers,activateLayerSpy(grupoLayers)))})}function dvmListMapGemPropertiesOnConsole(mapOL3){mapOL3.getSize();var extent=mapOL3.getView().calculateExtent(mapOL3.getSize());extent=ol.proj.transformExtent(extent,"EPSG:3857","EPSG:4326");var centro=mapOL3.getView().getCenter();centro=ol.proj.toLonLat(centro,"EPSG:3857")}function dvmShowInfoClicOnConsole(mapOL3,eventClic){var pixel=mapOL3.getEventPixel(eventClic.originalEvent),pointClick=mapOL3.getCoordinateFromPixel(pixel);pointClick=ol.proj.toLonLat(pointClick,"EPSG:3857")}function dvmSetAllBaseLayerNoVisible(mapOL3){mapOL3.getLayers().forEach(function(grupoLayers,i){grupoLayers instanceof ol.layer.Group&&grupoLayers.getLayers().forEach(function(sublayer,j){sublayer instanceof ol.layer.Base&&"base"==sublayer.getProperties().type&&sublayer.setVisible(!1)})})}function dvmIsLayerVisible(mapOL3,layerNombre){var listaGrupos=mapOL3.getLayers(),resultado=-99;return listaGrupos.forEach(function(grupoLayers,i){grupoLayers instanceof ol.layer.Group&&grupoLayers.getLayers().forEach(function(sublayer,j){if(sublayer instanceof ol.layer.Base&&sublayer.getProperties().title==layerNombre)return resultado=sublayer.getProperties().visible})}),resultado}function dvmIsLayerVisibleByKey(mapOL3,layerKey){var listaGrupos=mapOL3.getLayers(),resultado=-99;return listaGrupos.forEach(function(grupoLayers,i){if(grupoLayers instanceof ol.layer.Group&&grupoLayers.getLayers().forEach(function(sublayer,j){if(sublayer instanceof ol.layer.Base&&sublayer.getProperties().keyname==layerKey)return resultado=sublayer.getProperties().visible}),grupoLayers instanceof ol.layer.Base&&grupoLayers.getProperties().keyname==layerKey)return resultado=grupoLayers.getProperties().visible}),resultado}function setLayerInGroupZindex(mapOL3,layerKey,stackValue){mapOL3.getLayers().forEach(function(grupoLayers,i){grupoLayers instanceof ol.layer.Group&&grupoLayers.getLayers().forEach(function(sublayer,j){sublayer.getProperties().keyname==layerKey&&sublayer.setZIndex(stackValue)})})}function setLayerZindex(mapOL,layerKey,stackValue){mapOL.getLayers().forEach(function(layer,iLayer,layers){layer.getProperties().keyname==layerKey&&layer.setZIndex(stackValue)})}function obtenerZIndex(mapOL){mapOL.getLayers().forEach(function(layer,iLayer,layers){})}function setLayerPNOAVisibleByKeyAndOFFTheOthers(mapOL3,layerKey){mapOL3.getLayers().forEach(function(grupoLayers,i){if(grupoLayers instanceof ol.layer.Group){if("Vuelos PNOA"!=grupoLayers.getProperties().title)return;grupoLayers.getLayers().forEach(function(sublayer,j){sublayer instanceof ol.layer.Base&&(sublayer.getProperties().keyname==layerKey?(sublayer.setVisible(1),$("#"+sublayer.getProperties().keyname).bootstrapToggle("on")):(sublayer.setVisible(0),$("#"+sublayer.getProperties().keyname).bootstrapToggle("off")))})}})}function addPointInfo(mapOL3,longitud,latitud,mensaje){var pos=ol.proj.fromLonLat([longitud,latitud]),jQueryElement=$("<div></div>");jQueryElement.addClass("myclass"),jQueryElement.css({cursor:"pointer"}),jQueryElement.html("<img class='location-popover' src='./img/pushpin16.png'>"),jQueryElement.on("click",function(e){$(".location-popover").not(this).popover("hide")}),jQueryElement.popover({placement:"top",html:!0,content:"<strong>"+mensaje+"</strong>"}),resultToponim_lyr=new ol.Overlay({element:jQueryElement.get(0),position:pos,positioning:"top-center",stopEvent:!1}),mapOL3.addOverlay(resultToponim_lyr)}function removePointInfoLayer(mapOL3){mapOL3.removeOverlay(resultToponim_lyr)}function centrarVista(mapOL3,longitud,latitud,zoomLevel){var panning=new ol.View({center:ol.proj.transform([parseFloat(longitud),parseFloat(latitud)],"EPSG:4326","EPSG:3857"),zoom:zoomLevel});mapOL3.setView(panning)}function centrarVistaReferenciaCatastral(mapOL3,referenceCadastral,zoomLevel,containerCoor){var dataRequest,lonRef,latRef;$("#"+containerCoor).addClass("inputWithSpin"),dataRequest="./php/getPosByRefCadastral.php?refcadastral="+referenceCadastral,$.ajax({url:dataRequest,type:"GET",dataType:"xml",success:function(resultResponse){$("#"+containerCoor).removeClass("inputWithSpin"),$(resultResponse).find("geo").each(function(){$(this).find("xcen").each(function(){lonRef=$(this).text()}),$(this).find("ycen").each(function(){latRef=$(this).text()}),centrarVistaToponimo(mapOL3,lonRef,latRef,zoomLevel,"Referencia catastral: "+referenceCadastral)})},error:function(e){}})}function centrarVistaWhatThreeWords(mapOL3,whatTreeWords,zoomLevel,containerCoor){var dataRequest,lonRef,latRef;$("#"+containerCoor).addClass("inputWithSpin"),dataRequest="http://localhost/projects/mapahisto/php/getPosByW3W.php?what3words="+whatTreeWords,$.ajax({url:dataRequest,type:"GET",dataType:"xml",success:function(resultResponse){$("#"+containerCoor).removeClass("inputWithSpin"),$(resultResponse).find("geo").each(function(){$(this).find("lng").each(function(){lonRef=$(this).text()}),$(this).find("lat").each(function(){latRef=$(this).text()}),centrarVistaToponimo(mapOL3,lonRef,latRef,zoomLevel,"Referencia catastral: "+referenceCadastral)})},error:function(e){}})}function centrarVistaMTN50(mapOL3,numHoja,zoomLevel,containerCoor){var dataRequest,lonRef,latRef;$("#"+containerCoor).addClass("inputWithSpin"),dataRequest="./php/getProxyNumHoja.php?numhoja="+numHoja,$.ajax({url:dataRequest,type:"GET",dataType:"xml",success:function(resultResponse){$("#"+containerCoor).removeClass("inputWithSpin"),$(resultResponse).find("geo").each(function(){$(this).find("lng").each(function(){lonRef=$(this).text()}),$(this).find("lat").each(function(){latRef=$(this).text()}),centrarVistaToponimo(mapOL3,lonRef,latRef,zoomLevel,"Referencia catastral: "+referenceCadastral)})},error:function(e){}})}function centrarVistaToponimo(mapOL3,longitud,latitud,zoomLevel,mensaje){removePointInfoLayer(mapOL3),addPointInfo(mapOL3,parseFloat(longitud),parseFloat(latitud),mensaje);var panning=new ol.View({center:ol.proj.transform([parseFloat(longitud),parseFloat(latitud)],"EPSG:4326","EPSG:3857"),zoom:zoomLevel,minZoom:4,maxZoom:18});mapOL3.setView(panning)}