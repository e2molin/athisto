var mapOL;

var resourcesWMSList = new Array();
var userLayersWMSGroup;
var userLayersWMSList = new Array();
var userLayersWMSColeccion;
var userLayersWMScontador = 0;//Incremental de la capa cargada por el usuario. Crece sin límite.

var layerCapDisponibles=  new Array();//Aquí se guardan las capas de un WMS al que se le pide información.
var layerAdd;

/*
Botones
*/


//Botón que lanza la ventana modal con el componente dentro
$("#launchUserWMSSelector").click(function() {
    $('#wmsLayerDirectory').scrollTop(0);
    $('#modalWMSUserInterface').modal('show');
});

//Botón de la barra lateral que lanza la ventana modal con el componente dentro
$("#launchUserWMSSelectorInSidebar").click(function() {
    $('#wmsLayerDirectory').scrollTop(0);
    $('#modalWMSUserInterface').modal('show');
});




class layerWMSuser {
    //Constructor mediante lista de parámetros
    constructor( args = {} ) {
        ({
            id: this.id = 0,
            titulo: this.titulo = "",
            nombre: this.nombre = "",
            estilo: this.estilo = "",
            urlsource: this.urlsource = ""
        } = args );
    }
    toString () {
        return '(' + this.id + ' / ' + this.titulo + ' / ' + this.nombre + ' / ' + this.estilo + ' / ' + this.urlsource + ')';
    }
}



/*
Funciones básicas
*/
function replaceAll(str, find, replace) {
  return str.replace(new RegExp(find, 'g'), replace);
}



/*
Manager controles de usuario
*/
function mostrarDirectorioWMS(){
                    $("#wmsLayerDirectory").show();
                    $("#capDescriptionPanel").hide();
                    $("#wmsLayerCapab").hide();
                    $("#manualWMSparam").hide();
                    $("#btnAddLayer").hide();
                    $("#btnGetInfo").show();
        }
function manualWMS(){
            //Preparamos paneles
            $("#wmsLayerDirectory").hide();
            $("#capDescriptionPanel").hide();
            $("#wmsLayerCapab").hide();
            $("#manualWMSparam").show();
            //Preparamos controles
            $("#nameLayerWMSuser").val("");
            $("#nameStyleWMSuser").val("");
            $("#formatWMSuser").val("");
            $("#nameLegendWMSuser").val("");

            $("#btnAddLayer").show();
            //$("#btnGetInfo").hide();

}

//Al seleccionar un formato, se muestra en el inputbox correspondiente
$("#formatWMSuserSelector li a").click(function(){
    $("#formatWMSuser").val($(this).text());
});

//Al seleccionar un tipo de servicio, se muestra en el inputbox correspondiente
$("#typeWMSuserSelector li a").click(function(){
    $("#typeWMSuser").val($(this).text());
});


$("#wmsLayerDirectory").on('click', 'a', function () {
            var urlSel = $(this).children().text();
            $("#urlQueryCap").val(urlSel);
            $("#isCORS").val($(this).hasClass( "corsWMS" ));
            procesarCapabilities();
});


//Hacemos clic en una de las capas seleccionadas
$("#wmsLayerCapab").on('click', '.layerCap', function () {
    var classList = $(this).children("span").attr('class').split(/\s+/);
    $.each(classList, function(index, item) {
        if (item.startsWith("stylo_")) {
            //alert("Capa1: " + item);
            addLayerWMSUsuario(item);
        }
    });
});

$("#wmsLayerCapab").on('click', '.layerCap span', function (event) {
    event.stopPropagation();
    alert($(this).text());
    var classList = $(this).attr('class').split(/\s+/);
    $.each(classList, function(index, item) {
        if (item.startsWith("stylo_")) {
            addLayerWMSUsuario(item);
        }
    });

});
$("#btnGetInfo").click(function() {
  var urlServQuestion= $("#nameServerWMSuser").val();
  $("#urlQueryCap").val(urlServQuestion);
  $("#isCORS").val(true);
  $("#manualWMSparam").hide();
  procesarCapabilities();
});



/*
------------------------------------------------------------------------------------------------------

-------------------------------------------------------------------------------------------------------
*/

function cargarWMSuser(){
    var urlServ= $("#nameServerWMSuser").val();
    var tipoServicio= $("#typeWMSuser").val()
    var nameLayer= $("#nameLayerWMSuser").val();
    var nameEstilo= $("#nameStyleWMSuser").val();
    var nameFormat= $("#formatWMSuser").val();
    var nameLegend= $("#nameLegendWMSuser").val()

    if (tipoServicio==""){nameEstilo="WMS sin teselado"}
    if (nameLegend==""){nameLegend=$("#nameLayerWMSuser").val();}
    if (nameEstilo==""){nameEstilo="default"}
    console.log("Servicio: " + urlServ);
    console.log("Tipo de servicio: " + tipoServicio);
    console.log("Capa: " + nameLayer);
    console.log("Estilo: " + nameEstilo);
    console.log("Formato: " + nameFormat);
    console.log("Nombre leyenda: " + nameLegend);

    userLayersWMScontador=userLayersWMScontador+1

    if (tipoServicio=="WMS sin teselado"){
      layerAdd=new ol.layer.Image({
          title: nameLegend,
          visible: true,
          source: new ol.source.ImageWMS({
            attributions: [new ol.Attribution({html: 'WMS sin teselado definido por el usuario'})],
            url: element.urlsource,
            params: {"LAYERS": nameLayer,"FORMAT": nameFormat}
           })
      });
    }
    if (tipoServicio=="WMS con teselado"){
      layerAdd=new ol.layer.Tile({
  							title: nameLegend,
  							visible: true,
  							source: new ol.source.TileWMS({
                  attributions: [new ol.Attribution({html: 'WMS con teselado definido por el usuario'})],
  								url: $("#urlQueryCap").val(),
  								params: {"LAYERS": nameLayer, "TILED": "true","FORMAT": nameFormat}
  							 })
      });
    }

    layerAdd.set("keyname","WMS" + userLayersWMScontador);
    var userLayersWMSColeccion=new ol.Collection();
    userLayersWMSColeccion=userLayersWMSGroup.getLayers();
    userLayersWMSColeccion.push(layerAdd);
    var newElement="<span class=\"tagSelfClose label label-info\">" +
                    "<span id=\"delLayer" + "WMS" + userLayersWMScontador +"\">" + nameLegend + "</span>" +
                    "<a><i class=\"remove glyphicon glyphicon-remove-sign glyphicon-white\"></i></a></span>";
    $("#userMaps").append(newElement);

    
    $(".tagSelfClose").click(function(){
                    var layerId = $(this).children("span").attr('id');
                    borrarLayerWMSUsuario(mapOL,"Capas WMS de usuario",replaceAll(layerId,"delLayer",""));
                    //alert(replaceAll(layerId,"delLayer",""));
                    $(this).remove();
    });
    console.log("llego0");


}



//Procesa el XML de la petición GetCapabilities, listando las capas con estilos.
//A la vez, mete cada recurso en el array para que luego el usuario pueda elegir layerCapDisponibles
function procesarCapabilities(){
    var nombreCapLayer= "";
    var nombreEstilo= "";
    var formatosWMS= "";
    var layerList= [];

    $("#iconHourGlass").show();

    var parser = new ol.format.WMSCapabilities();
    var urlService;

    urlService=$("#urlQueryCap").val();
    if ($("#isCORS").val()=='true'){
                urlService= 'proxy.php?urlCapabilities=' + urlService;// + '?request=GetCapabilities&service=WMS';
    }else{
                if (urlService.indexOf("request=GetCapabilities") !== -1){
                    urlService= urlService
                } else {
                    urlService= urlService + '?request=GetCapabilities&service=WMS';
                }
    }

    console.log("URL de consulta: " + urlService);
    fetch(urlService,{}).then(function(response) {
            if(response.ok){
                   return response.text();
            }else{
                   alert("Fallo en el servidor al consultar");
            }
    })
    .then(function(text) {
            var result = parser.read(text);
            //console.log("Versión: " + result.version);
            //console.log("Título: " + result.Service.Title);
            $.each(result.Capability.Request, function(idx, obj) {
                    //console.log("Capacidad: " + idx + ' Lista de formatos->' + obj.Format);
                    if (idx=="GetMap"){ formatosWMS =obj.Format.join(', ');}
            });
            $.each(result.Capability.Request, function(idx, obj) {
                    //console.log("Capacidad: " + idx + ' Primer formato de la lista->' + obj.Format[0]);
            });
            $("#capDescription").html(
                                    "<strong>" + result.Service.Title + "</strong>" + ". " + result.Service.Abstract +". <br/>" +
                                    "<em>Versión:</em> " + result.version + ". <em>Formatos: " + formatosWMS
                                     );

            console.log("Lista de capas seleccionables (" + result.Capability.Layer.Layer.length + ") y los estilo que hay de cada una------------------------------------");
            var idLayerCap = 0;
            layerCapDisponibles= [];//VAciamos el array

            $.each(result.Capability.Layer.Layer, function(idx, obj) {
                //OJO: obj = result.Capability.Layer.Layer[idx]
                if(obj.Name===undefined){//Es una capa con subcapas
                        $.each(obj.Layer, function(idx3, obj3) {
                            //obj3 = result.Capability.Layer.Layer[idx].Layer[idx3]
                            //console.log("\t- SUBCAPAs: " + obj3.Name);
                            //console.log("\t- Nombre: " + obj3.Name);
                            //console.log("\t- Título: " + obj3.Title);
                            //console.log("\t- Descrip: " + obj3.Abstract.substring(0,18) + "[...]");
                            nombreEstilo="";
                            $.each(obj3.Style, function(idxStylus, objStylus) {

                                idLayerCap=idLayerCap+1;
                                var layerCandidato = new layerWMSuser({
                                    id: idLayerCap,
                                    titulo: result.Capability.Layer.Layer[idx].Title + " - " + obj3.Title,
                                    nombre: result.Capability.Layer.Layer[idx].Layer[idx3].Name,
                                    estilo: objStylus.Name,
                                    urlsource: $("#urlQueryCap").val()
                                });

                                layerCapDisponibles.push(layerCandidato);
                                nombreEstilo=nombreEstilo + "<span class=\"badge" + " stylo_" + idLayerCap + "\">" + objStylus.Name + "</span>"
                            });
                            nombreCapLayer="<strong>" + obj.Title + " - " + obj3.Title + "</strong>" + nombreEstilo + "<br/>";
                            layerList.push("<a href=\"#\" class=\"list-group-item layerCap\">" + nombreCapLayer + "</a>");
                        });
                }else{
                        nombreEstilo="";
                        //console.log("* CAPA SELECCIONABLE: " + obj.Title);
                        //console.log("- Título: " + obj.Title);
                        //console.log("- Descrip: " + obj.Abstract.substring(0,18) + "[...]");
                        $.each(obj.Style, function(idxStylus, objStylus) {
                                idLayerCap=idLayerCap+1;
                                var layerCandidato = new layerWMSuser({
                                    id: idLayerCap,
                                    titulo: obj.Title,
                                    nombre: obj.Name,
                                    estilo: objStylus.Name,
                                    urlsource: $("#urlQueryCap").val()
                                });
                                layerCapDisponibles.push(layerCandidato);
                                nombreEstilo=nombreEstilo + "<span class=\"badge" + " stylo_" + idLayerCap + "\">" + objStylus.Name + "</span>";
                        });
                            nombreCapLayer="<strong>" + obj.Title + "</strong>" + " <em>" + obj.Name + "</em>" + nombreEstilo + "<br/><em>" + obj.Abstract + "</em>";
                            layerList.push("<a href=\"#\" class=\"list-group-item layerCap\">" + nombreCapLayer + "" + "</a>");
                }
            });
    })
    .then(function(){
                    //console.log("llego 5");
                    var container = document.getElementById('wmsLayerCapab');
                    container.innerHTML = layerList.join('');
                    $("#wmsLayerDirectory").hide();
                    $("#capDescriptionPanel").show();
                    $("#wmsLayerCapab").show();
                    $("#iconHourGlass").hide();
    })
    .catch(function(error) {

                    $("#iconHourGlass").hide();
                    alert('Problemas en la fetch operation: ' + error.message);
    });

}


//Añade capa WMS de la lista de las disponibles
function addLayerWMSUsuario(paramClass){
        layerCapDisponibles.forEach( function(valor, indice, array) {
            if (paramClass == "stylo_" + valor.id){
                //console.log("En el índice " + indice + " hay este valor: " + valor.toString());
                layerAdd=new ol.layer.Image({
                    title: valor.titulo,
                    visible: true,
                    source: new ol.source.ImageWMS({
                      attributions: [new ol.Attribution({html: 'WMS sin teselado definido por el usuario'})],
                      url: valor.urlsource,
                      params: {"LAYERS": valor.nombre}
                     })
                });                
                //Lo cargamos sin tileado para no cargarnos el WMS de fototeca...manda huevos
                /*
                layerAdd=new ol.layer.Tile({
							title: valor.titulo,
							visible: true,
							source: new ol.source.TileWMS({
                                attributions: [new ol.Attribution({html: 'WMS con teselado definido por el usuario'})],
								url: valor.urlsource,
								params: {"LAYERS": valor.nombre, "TILED": "true"}     
							 })
                });
                */
                userLayersWMScontador=userLayersWMScontador+1
                layerAdd.set("keyname","WMS" + userLayersWMScontador);
                var userLayersWMSColeccion=new ol.Collection();
                userLayersWMSColeccion=userLayersWMSGroup.getLayers();
                userLayersWMSColeccion.push(layerAdd);
                /*
                var newElement="<span class=\"tagSelfClose label label-info\">" +
                                "<span id=\"delLayer" + "WMS" + userLayersWMScontador +"\">" + valor.titulo + "</span>" +
                                "<a><i class=\"remove glyphicon glyphicon-remove-sign glyphicon-white\"></i></a></span>";
                $("#userMaps").append(newElement);
                $(".tagSelfClose").click(function(){
                    var layerId = $(this).children("span").attr('id');
                    borrarLayerWMSUsuario(mapOL,"Capas WMS de usuario",replaceAll(layerId,"delLayer",""));
                    //alert(replaceAll(layerId,"delLayer",""));
                    $(this).remove();
                });
                */
                add2UserTOC("content-panel-layers-User","WMS" + userLayersWMScontador,valor.titulo);
                console.log("Añadida capa WMS por defecto");
            }
        });
}

//Borra capa WMS
function borrarLayerWMSUsuario(mapOL3,nombreGrupo,keyLayer){

        var listaGrupos=mapOL3.getLayers();
        var resultado=-99;
        listaGrupos.forEach(function(grupoLayers, i) {
                //Si el elemento está en un grupo
                if (grupoLayers instanceof ol.layer.Group) {
                    if (grupoLayers.getProperties()['title']==nombreGrupo){
                        console.log("Esta el grupo");
                        grupoLayers.getLayers().forEach(function(sublayer, j) {
                            //console.log(sublayer.getProperties()['keyname']);
                            if(sublayer.getProperties()['keyname']==keyLayer){
                                console.log("Esta el grupo y la clave de la capa:" + j);
                                resultado=j;
                            }

                        });
                        if (resultado>=0){
                            grupoLayers.getLayers().removeAt(resultado);
                        }
                    }
                }
                //Si el elemento no está en un grupo y es una capa base
                if (grupoLayers instanceof ol.layer.Base) {
                    //console.log(grupoLayers.getProperties()['visible']);
                }
        });
        return resultado;
    }

function zoomLayerWMSUsuario(mapOL3,nombreGrupo,keyLayer){

        var listaGrupos=mapOL3.getLayers();
        var resultado=-99;
        listaGrupos.forEach(function(grupoLayers, i) {
                //Si el elemento está en un grupo
                if (grupoLayers instanceof ol.layer.Group) {
                    if (grupoLayers.getProperties()['title']==nombreGrupo){
                        console.log("Esta el grupo");
                        grupoLayers.getLayers().forEach(function(sublayer, j) {
                            //console.log(sublayer.getProperties()['keyname']);
                            if(sublayer.getProperties()['keyname']==keyLayer){

                                //console.log("Esta el grupo y la clave de la capa:" + j);
                                console.log(sublayer.getExtent());
                                resultado=j;
                            }

                        });
                    }
                }
                if (grupoLayers instanceof ol.layer.Base) {
                }
        });
        return resultado;
}
function setOpacityWMSUsuario(mapOL3,nombreGrupo,keyLayer,opacityValue){

        var listaGrupos=mapOL3.getLayers();
        var resultado=-99;
        listaGrupos.forEach(function(grupoLayers, i) {
                //Si el elemento está en un grupo
                if (grupoLayers instanceof ol.layer.Group) {
                    if (grupoLayers.getProperties()['title']==nombreGrupo){
                        grupoLayers.getLayers().forEach(function(sublayer, j) {
                            //console.log(sublayer.getProperties()['keyname']);
                            if(sublayer.getProperties()['keyname']==keyLayer){
                                sublayer.setOpacity(opacityValue/100);
                            }
                        });
                    }
                }
                if (grupoLayers instanceof ol.layer.Base) {
                }
        });
        return resultado;
}


function loadWMSresources(){
  var htmlList = [];
  $.getJSON('wms-resources.json', { get_param: 'value' }, function(data) {
      var htmlList = [];
      var classCORS = "";
      $.each(data, function(index, element) {
        classCORS= "";
        if (element.isCORS == true){
          classCORS = "corsWMS";
        }
        htmlList.push("<a id=\"directory" + element.layerkey + "\" href=\"#\" class=\"list-group-item " + classCORS + "\">" + element.title + "<span class=\"badge\">" + element.urlCapabilities + "</span></a>");
      });
      var containerWMSdirectory = document.getElementById('wmsLayerDirectory');
      containerWMSdirectory.innerHTML = htmlList.join('');
    });
}


/*
Inicia el componente
*/
function initWMSUserComponent(mapa){
    loadWMSresources();
    mapOL=mapa;
    userLayersWMSGroup=new ol.layer.Group({
      'title': 'Capas WMS de usuario'
    });
    userLayersWMSGroup.setLayers(new ol.Collection(userLayersWMSList));
    mapOL.addLayer(userLayersWMSGroup);

}
