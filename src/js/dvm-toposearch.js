var searchCooOption="latlon";
var coors;

/*
Botoneras
*/


$("#zoomSpain").click(function() {
    setHomeView();
});

$("#zoomPenin").click(function() {
    setPeninsularView();
});
$("#zoomBaleares").click(function() {
    setBalearesView();
});
$("#zoomCanarias").click(function() {
    setCanariasView();
});
$("#btnShowFinder").click(function() {
    $("#topoinput").toggle();
});


function setLonLatView(Lon, Lat,zoomLevel){
        var lonlatView = new ol.View({
                projection: 'EPSG:3857',
                center: ol.proj.transform([Lon, Lat], 'EPSG:4326', 'EPSG:3857'),
                zoom: zoomLevel,minZoom: initMinZoom, maxZoom: initMaxZoom
        });
        objMap.setView(lonlatView);
}

function setHomeView(){
        var homeView = new ol.View({
                projection: 'EPSG:3857',
                center: ol.proj.transform([initLong, initLat], 'EPSG:4326', 'EPSG:3857'),
                zoom: initZoom,minZoom: initMinZoom, maxZoom: initMaxZoom
        });
        objMap.setView(homeView);
}


function setPeninsularView(){
        var peninView = new ol.View({
                projection: 'EPSG:3857',
                center: ol.proj.transform([-3.7350, 40.3750], 'EPSG:4326', 'EPSG:3857'),
                zoom: 7,minZoom: initMinZoom, maxZoom: initMaxZoom
        });
        objMap.setView(peninView);
}

function setBalearesView(){
        var balearesView = new ol.View({
                projection: 'EPSG:3857',
                center: ol.proj.transform([2.7740, 39.5722], 'EPSG:4326', 'EPSG:3857'),
                zoom: 9,minZoom: initMinZoom, maxZoom: initMaxZoom
        });
        objMap.setView(balearesView);
}
function setCanariasView(){
        var canariasView = new ol.View({
                projection: 'EPSG:3857',
                center: ol.proj.transform([-16.1115, 28.2950], 'EPSG:4326', 'EPSG:3857'),
                zoom: 8,minZoom: initMinZoom, maxZoom: initMaxZoom
        });
        objMap.setView(canariasView);
}



$("#spinnerAjaxIDEE").hide();
$("#spinnerAjaxGeonames").hide();
$("#nameSearchIDE").val("");
$("#nameSearchGeonames").val("");




var showMoreSearchOptions = 0;
$('#btnMoreSearchs').click(function(){
    if( showMoreSearchOptions == 0 ){
        showMoreSearchOptions = 1;
        $('#searchCooContainer').show();
        $(this).html("Búsquedas <i class=\"fa fa-minus-square\" aria-hidden=\"true\"></i>");
    } else {
        //console.log('odd');
        showMoreSearchOptions = 0;
        $('#searchCooContainer').hide();
        $(this).html("Búsquedas <i class=\"fa fa-plus-square\" aria-hidden=\"true\"></i>");
    }
});


$("#typeSearchCoo li").on("click", function(event){
                event.preventDefault();
                var dropdown = $('#searchCoo-DD');
                dropdown.html($(this).text() + " <span class='caret'></span>");
                var modeSearch = $(this).attr('id');
                if (modeSearch=="latlon"){
                    $("#cooSearch").attr("placeholder", "Longitud , Latitud");
                }else if (modeSearch=="utm"){
                    $("#cooSearch").attr("placeholder", "Huso , X , Y");
                }else if (modeSearch=="refcatastral"){
                    $("#cooSearch").attr("placeholder", "Ref. catastral nº: 9977715VK3797F");
                }else if (modeSearch=="what3words"){
                    $("#cooSearch").attr("placeholder", "palabras: intercambiar.castillo.mangos");
                }else if (modeSearch=="numhojamtn50"){
                    $("#cooSearch").attr("placeholder", "Nº hoja MTN50");
                }

                
                searchCooOption = modeSearch;
});

$( "#btnSearchCoo" ).click(function() {
        if (searchCooOption=="latlon"){
                    coors = $("#cooSearch").val().split(",");
                    if (coors.length!=2){
                        coors = $("#cooSearch").val().split(" ");
                        if (coors.length!=2){
                            alert("Coordenadas no válidas");
                            return;
                        }
                    }
                    centrarVistaToponimo(objMap,parseFloat(coors[0]),parseFloat(coors[1]),15,$("#cooSearch").val());
        }else if (searchCooOption=="utm"){
                    coors = $("#cooSearch").val().split(",");
                    if (coors.length!=3){
                        coors = $("#cooSearch").val().split(" ");
                        if (coors.length!=3){
                            alert("Coordenadas no válidas");
                            return;
                        }
                    }
                    if (coors[0]==27){
                        proj4.defs("EPSG:25827","+proj=utm +zone=27 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs");
                        resultLL=ol.proj.transform([coors[1], coors[2]], 'EPSG:25827','EPSG:4326');
                    }
                    if (coors[0]==28){
                        proj4.defs("EPSG:25828","+proj=utm +zone=28 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs");
                        resultLL=ol.proj.transform([coors[1], coors[2]], 'EPSG:25828','EPSG:4326');
                    }
                    if (coors[0]==29){
                        proj4.defs("EPSG:25829","+proj=utm +zone=29 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs");
                        resultLL=ol.proj.transform([coors[1], coors[2]], 'EPSG:25829','EPSG:4326');
                    }
                    if (coors[0]==30){
                        proj4.defs("EPSG:25830","+proj=utm +zone=30 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs");
                        resultLL=ol.proj.transform([coors[1], coors[2]], 'EPSG:25830','EPSG:4326');
                    }
                    if (coors[0]==31){
                        proj4.defs("EPSG:25831","+proj=utm +zone=31 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs");
                        resultLL=ol.proj.transform([coors[1], coors[2]], 'EPSG:25831','EPSG:4326');
                    }
                    centrarVistaToponimo(objMap,parseFloat(resultLL[0]),parseFloat(resultLL[1]),15,$("#cooSearch").val());
        }else if (searchCooOption=="refcatastral"){
                    //9977715VK3797F
                    centrarVistaReferenciaCatastral(objMap,$("#cooSearch").val(),16,"cooSearch");
        }else if (searchCooOption=="what3words"){
                    //fiera.arañar.primo
                    console.log("Vamos");
                    centrarVistaWhatThreeWords(objMap,$("#cooSearch").val(),16,"cooSearch");
        }else if (searchCooOption=="numhojamtn50"){
            //fiera.arañar.primo
            console.log("Vamos");
            centrarVistaMTN50(objMap,$("#cooSearch").val(),16,"cooSearch");
        }

        

});

//https://www.cartociudad.es/geocoder/api/geocoder/findJsonp?q=Ajuntament%20de%20El%20Mil%C3%A0%2C%20El%20Mil%C3%A0&type=toponimo&tip_via=Ayuntamiento&id=BTN_3281968&portal=null&extension=null
//https://www.cartociudad.es/geocoder/api/geocoder/findJsonp?q=mila&type=portal&id=430830914286&outputformat=geojson
//https://www.cartociudad.es/geocoder/api/geocoder/findJsonp?q=Milmarcos%2C%20Guadalajara&type=Municipio&tip_via=null&id=19183&portal=null&extension=null

//https://www.cartociudad.es/geocoder/api/geocoder/findJsonp?q=Ajuntament del Milà , El Milà&type=toponimo&tip_via=null&id=43083&portal=null&extension=null

//https://www.cartociudad.es/geocoder/api/geocoder/findJsonp?q=Milmarcos%2C%20Milmarcos&type=poblacion&tip_via=null&id=800002464&portal=null&extension=null

https://www.cartociudad.es/geocoder/api/geocoder/findJsonp?q=Milmarcos%2C%20Milmarcos&type=poblacion&tip_via=null&id=800002464&portal=null&extension=null


function getCoordinateByIDEid(idIDEE){

    console.log("Valor seleccionado para búsqueda:" + idIDEE);
    $.ajax({
            url : 'https://www.idee.es/communicationsPoolServlet/Dispatcher',
            dataType : 'jsonp',
            data : {
                request : 'OpenQuerySource',
                query : '<ogc:Filter><ogc:FeatureId fid="' + idIDEE + '"/></ogc:Filter>',
                sourcename : 'http://www.idee.es/communicationsPoolServlet/sourceAccessWFS-INSPIRE-NGBE.rdf',
                outputformat : 'application/json'
            },
            success : function(data){
                console.log("Obtenemos los datos");
                //console.log(data);
                $.map(data.results, function(item){
                    console.log(item.location);
                    var coordinatesTopo = item.location.split(" ");
                    centrarVistaToponimo(objMap,coordinatesTopo[1],coordinatesTopo[0],12,item.title);
                    console.log("Existe el elemento:" + $('#mapSyncro').length);
                    if ($('#mapMirrorLienzo').length==1){
                        //Si hay un mapa sincronizado, mueve la posición hasta el mapa en el mapa espejo
                        objMapMirror.setView(objMap.getView());
                    }
                    sidebar.close();
                    if (mobileMode==true){$("#topoinput").hide(); }
                });
            },
            error: function(e){
                console.log("FALLO IGNSearch");
                console.log(e.responseText);
            }
    });

}

function getCoordinateById(geoItem){

    console.log("Valor seleccionado para búsqueda:");
    console.log(geoItem);
    //https://www.cartociudad.es/geocoder/api/geocoder/findJsonp?type=toponimo&id=430830914286
    var cooReq= "https://www.cartociudad.es/geocoder/api/geocoder/findJsonp?type=" + geoItem.type + "&id=" + geoItem.id;
    console.log(cooReq);
    fetch(cooReq,{
        method: 'GET',
        mode: 'cors'
    })
    .then( function (response) {
        return response.text()
    })
    .then(function (text)  {
            var response = JSON.parse(text.slice(9,-1))
            //console.log(response);
            centerToponym(objMap,response.lng,response.lat,12,response.address);
            if ($('#mapMirrorLienzo').length==1){
                //Si hay un mapa sincronizado, mueve la posición hasta el mapa en el mapa espejo
                objMapMirror.setView(objMap.getView());
            }
            sidebar.close();
            if (mobileMode === true){$("#topoinput").hide();
        }        
    })
    .catch(function (error){console.error(error)});ç

 
    // $.ajax({
    //         url : 'https://www.idee.es/communicationsPoolServlet/Dispatcher',
    //         dataType : 'jsonp',
    //         data : {
    //             request : 'OpenQuerySource',
    //             query : '<ogc:Filter><ogc:FeatureId fid="' + idIDEE + '"/></ogc:Filter>',
    //             sourcename : 'http://www.idee.es/communicationsPoolServlet/sourceAccessWFS-INSPIRE-NGBE.rdf',
    //             outputformat : 'application/json'
    //         },
    //         success : function(data){
    //             console.log("Obtenemos los datos");
    //             //console.log(data);
    //             $.map(data.results, function(item){
    //                 console.log(item.location);
    //                 var coordinatesTopo = item.location.split(" ");
    //                 centrarVistaToponimo(objMap,coordinatesTopo[1],coordinatesTopo[0],12,item.title);
    //                 console.log("Existe el elemento:" + $('#mapSyncro').length);
    //                 if ($('#mapMirrorLienzo').length==1){
    //                     //Si hay un mapa sincronizado, mueve la posición hasta el mapa en el mapa espejo
    //                     objMapMirror.setView(objMap.getView());
    //                 }
    //                 sidebar.close();
    //                 if (mobileMode==true){$("#topoinput").hide(); }
    //             });
    //         },
    //         error: function(e){
    //             console.log("FALLO IGNSearch");
    //             console.log(e.responseText);
    //         }
    // });

}

// https://www.cartociudad.es/geocoder/api/geocoder/candidatesJsonp?callback=jQuery22408684413746695392_1716205572699&q=s&limit=8&_=1716205572700
// https://www.cartociudad.es/geocoder/api/geocoder/candidatesJsonp?limit=10&q=sab&countrycode=es&autocancel=true





$(function() {

    $("#nameSearchIDE").autocomplete({
        source : function(request, response){
            $("#nameSearchIDE").removeClass("inputTopoWithoutSpinner").addClass("inputTopoWithSpinner");
            $.ajax({
                url : 'https://www.cartociudad.es/geocoder/api/geocoder/candidatesJsonp', //script del servidor
                dataType : 'jsonp',                             //Formato de los datos que vienen - El eso de JSONP evita los errores de CORS
                data : {
                    q : $("#nameSearchIDE").val(),    //Texto de muestra pasado para filtrar
                    no_process: "callejero,carretera,portal",
                    countrycodes: "es",
                    limit : 8                              //Número de resultados pedidos al servidor
                },
                success : function(data){
                        //console.log(data);
                        response($.map(data, function(object){
                        $("#nameSearchIDE").removeClass("inputTopoWithSpinner").addClass("inputTopoWithoutSpinner");
                        return object       //Este objeto que se devuelve pasa al método autocomplete para formatear los datos en el desplegable
                    }));
                },
                error: function(e){
                    console.log(e.responseText);
                }

            });
        },
        appendTo: "#topoSearchIDEResults",
        focus: function( event, ui ) {
            $( "#nameSearchIDE" ).val( ui.item.address );
            return false;
        },
        select: function( event, ui ) {
            //console.log("Seleccionado:" + ui.item.address);
            //console.log("Seleccionado:" + ui.item.type);
            console.log(ui.item)
            getCoordinateById(ui.item);
            //getCoordinateByIDEid(ui.item.id,false);
            return false;
        }
    })
    .autocomplete( "instance" )._renderItem = function( ul, item ) {
          return $( "<li>" )
            .append( '<img src="./img/pushpin16.png"> ' + item.address + ' <small style="color:#847777;">(' + item.type + ')</small>'  )
            .appendTo( ul );
    };

});
