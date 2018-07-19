var coors,searchCooOption="latlon";function setLonLatView(Lon,Lat,zoomLevel){var lonlatView=new ol.View({projection:"EPSG:3857",center:ol.proj.transform([Lon,Lat],"EPSG:4326","EPSG:3857"),zoom:zoomLevel,minZoom:initMinZoom,maxZoom:initMaxZoom});objMap.setView(lonlatView)}function setHomeView(){var homeView=new ol.View({projection:"EPSG:3857",center:ol.proj.transform([initLong,initLat],"EPSG:4326","EPSG:3857"),zoom:initZoom,minZoom:initMinZoom,maxZoom:initMaxZoom});objMap.setView(homeView)}function setPeninsularView(){var peninView=new ol.View({projection:"EPSG:3857",center:ol.proj.transform([-3.735,40.375],"EPSG:4326","EPSG:3857"),zoom:7,minZoom:initMinZoom,maxZoom:initMaxZoom});objMap.setView(peninView)}function setBalearesView(){var balearesView=new ol.View({projection:"EPSG:3857",center:ol.proj.transform([2.774,39.5722],"EPSG:4326","EPSG:3857"),zoom:9,minZoom:initMinZoom,maxZoom:initMaxZoom});objMap.setView(balearesView)}function setCanariasView(){var canariasView=new ol.View({projection:"EPSG:3857",center:ol.proj.transform([-16.1115,28.295],"EPSG:4326","EPSG:3857"),zoom:8,minZoom:initMinZoom,maxZoom:initMaxZoom});objMap.setView(canariasView)}$("#zoomSpain").click(function(){setHomeView()}),$("#zoomPenin").click(function(){setPeninsularView()}),$("#zoomBaleares").click(function(){setBalearesView()}),$("#zoomCanarias").click(function(){setCanariasView()}),$("#btnShowFinder").click(function(){$("#topoinput").toggle()}),$("#spinnerAjaxIDEE").hide(),$("#spinnerAjaxGeonames").hide(),$("#nameSearchIDE").val(""),$("#nameSearchGeonames").val("");var showMoreSearchOptions=0;function getCoordinateByIDEid(idIDEE){$.ajax({url:"http://www.idee.es/communicationsPoolServlet/Dispatcher",dataType:"jsonp",data:{request:"OpenQuerySource",query:'<ogc:Filter><ogc:FeatureId fid="'+idIDEE+'"/></ogc:Filter>',sourcename:"http://www.idee.es/communicationsPoolServlet/sourceAccessWFS-INSPIRE-NGBE.rdf",outputformat:"application/json"},success:function(data){$.map(data.results,function(item){var coordinatesTopo=item.location.split(" ");centrarVistaToponimo(objMap,coordinatesTopo[1],coordinatesTopo[0],12,item.title),1==$("#mapMirrorLienzo").length&&objMapMirror.setView(map.getView()),sidebar.hide(),1==mobileMode&&$("#topoinput").hide()})},error:function(e){}})}$("#btnMoreSearchs").click(function(){0==showMoreSearchOptions?(showMoreSearchOptions=1,$("#searchCooContainer").show(),$(this).html('Búsquedas <i class="fa fa-minus-square" aria-hidden="true"></i>')):(showMoreSearchOptions=0,$("#searchCooContainer").hide(),$(this).html('Búsquedas <i class="fa fa-plus-square" aria-hidden="true"></i>'))}),$("#typeSearchCoo li").on("click",function(event){event.preventDefault(),$("#searchCoo-DD").html($(this).text()+" <span class='caret'></span>");var modeSearch=$(this).attr("id");"latlon"==modeSearch?$("#cooSearch").attr("placeholder","Longitud , Latitud"):"utm"==modeSearch?$("#cooSearch").attr("placeholder","Huso , X , Y"):"refcatastral"==modeSearch?$("#cooSearch").attr("placeholder","Ref. catastral nº: 9977715VK3797F"):"what3words"==modeSearch?$("#cooSearch").attr("placeholder","palabras: intercambiar.castillo.mangos"):"numhojamtn50"==modeSearch&&$("#cooSearch").attr("placeholder","Nº hoja MTN50"),searchCooOption=modeSearch}),$("#btnSearchCoo").click(function(){if("latlon"==searchCooOption){if(2!=(coors=$("#cooSearch").val().split(",")).length&&2!=(coors=$("#cooSearch").val().split(" ")).length)return void alert("Coordenadas no válidas");centrarVistaToponimo(objMap,parseFloat(coors[0]),parseFloat(coors[1]),15,$("#cooSearch").val())}else if("utm"==searchCooOption){if(3!=(coors=$("#cooSearch").val().split(",")).length&&3!=(coors=$("#cooSearch").val().split(" ")).length)return void alert("Coordenadas no válidas");27==coors[0]&&(proj4.defs("EPSG:25827","+proj=utm +zone=27 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs"),resultLL=ol.proj.transform([coors[1],coors[2]],"EPSG:25827","EPSG:4326")),28==coors[0]&&(proj4.defs("EPSG:25828","+proj=utm +zone=28 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs"),resultLL=ol.proj.transform([coors[1],coors[2]],"EPSG:25828","EPSG:4326")),29==coors[0]&&(proj4.defs("EPSG:25829","+proj=utm +zone=29 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs"),resultLL=ol.proj.transform([coors[1],coors[2]],"EPSG:25829","EPSG:4326")),30==coors[0]&&(proj4.defs("EPSG:25830","+proj=utm +zone=30 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs"),resultLL=ol.proj.transform([coors[1],coors[2]],"EPSG:25830","EPSG:4326")),31==coors[0]&&(proj4.defs("EPSG:25831","+proj=utm +zone=31 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs"),resultLL=ol.proj.transform([coors[1],coors[2]],"EPSG:25831","EPSG:4326")),centrarVistaToponimo(objMap,parseFloat(resultLL[0]),parseFloat(resultLL[1]),15,$("#cooSearch").val())}else"refcatastral"==searchCooOption?centrarVistaReferenciaCatastral(objMap,$("#cooSearch").val(),16,"cooSearch"):"what3words"==searchCooOption?centrarVistaWhatThreeWords(objMap,$("#cooSearch").val(),16,"cooSearch"):"numhojamtn50"==searchCooOption&&centrarVistaMTN50(objMap,$("#cooSearch").val(),16,"cooSearch")}),$(function(){$("#nameSearchIDE").autocomplete({source:function(request,response){$("#nameSearchIDE").removeClass("inputTopoWithoutSpinner").addClass("inputTopoWithSpinner"),$.ajax({url:"http://www.idee.es/communicationsPoolServlet/SearchAssistant",dataType:"jsonp",data:{name_equals:$("#nameSearchIDE").val(),maxresults:8},success:function(data){response($.map(data.results,function(object){return $("#nameSearchIDE").removeClass("inputTopoWithSpinner").addClass("inputTopoWithoutSpinner"),object}))},error:function(e){}})},appendTo:"#topoSearchIDEResults",focus:function(event,ui){return $("#nameSearchIDE").val(ui.item.title),!1},select:function(event,ui){return getCoordinateByIDEid(ui.item.id,!1),!1}}).autocomplete("instance")._renderItem=function(ul,item){return $("<li>").append('<img src="./img/pushpin16.png"> '+item.title+' <small style="color:#847777;">('+item.type+")</small>").appendTo(ul)}});