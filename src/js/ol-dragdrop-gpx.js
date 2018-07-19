//var vectorgpx_lyr;
var defaultStyle = {
        'Point': new ol.style.Style({
          image: new ol.style.Circle({
            fill: new ol.style.Fill({
              color: 'rgba(255,255,0,0.5)'
            }),
            radius: 5,
            stroke: new ol.style.Stroke({
              color: '#ff0',
              width: 1
            })
          })
        }),
        'LineString': new ol.style.Style({
          stroke: new ol.style.Stroke({
            color: '#f00',
            width: 3
          })
        }),
        'Polygon': new ol.style.Style({
          fill: new ol.style.Fill({
            color: 'rgba(0,255,255,0.5)'
          }),
          stroke: new ol.style.Stroke({
            color: '#0ff',
            width: 1
          })
        }),
        'MultiPoint': new ol.style.Style({
          image: new ol.style.Circle({
            fill: new ol.style.Fill({
              color: 'rgba(255,0,255,0.5)'
            }),
            radius: 5,
            stroke: new ol.style.Stroke({
              color: '#f0f',
              width: 1
            })
          })
        }),
        'MultiLineString': new ol.style.Style({
          stroke: new ol.style.Stroke({
            color: '#0f0',
            width: 3
          })
        }),
        'MultiPolygon': new ol.style.Style({
          fill: new ol.style.Fill({
            color: 'rgba(0,0,255,0.5)'
          }),
          stroke: new ol.style.Stroke({
            color: '#00f',
            width: 1
          })
        })
};


$( "#infoDragFile" ).hover(function() {
    $("#btnToolDescript").html("<small><em>Arrastre y suelte el fichero sobre el mapa</em></small>");
});
$( "#eraseDragFile" ).hover(function() {
    $("#btnToolDescript").html("<small><em>Borrar ficheros cargados</em></small>");
});

//Botón de la barra lateral que lanza la ventana modal con el componente dentro
$("#launchUserFilevectorInSidebar").click(function() {
  BootstrapDialog.alert({
              title: 'Cargar ficheros',
              message: 'Arrastre y suelte el fichero sobre el mapa.<br/> Formatos soportados: GPX, GeoJSON, IGC, KML, or TopoJSON.<br/>Los datos deben estar en coordenadas geográficas o en Mercator esférica.'
  });
});

$( "#infoDragFile" ).click(function() {
    BootstrapDialog.alert({
                title: 'Cargar ficheros',
                message: 'Arrastre y suelte el fichero sobre el mapa.<br/> Formatos soportados: GPX, GeoJSON, IGC, KML, or TopoJSON.<br/>Los datos deben estar en coordenadas geográficas o en Mercator esférica.'
    });
});
$( "#eraseDragFile" ).click(function() {
    vectorgpx_lyr.getSource().clear();
    closeModals();
});


var styleFunction = function(feature, resolution) {
        var featureStyleFunction = feature.getStyleFunction();
        if (featureStyleFunction) {
          return featureStyleFunction.call(feature, resolution);
        } else {
          return defaultStyle[feature.getGeometry().getType()];
        }
};

var dragAndDropInteraction = new ol.interaction.DragAndDrop({
        formatConstructors: [
          ol.format.GPX,
          ol.format.GeoJSON,
          ol.format.IGC,
          ol.format.KML,
          ol.format.TopoJSON
        ]
});


function init_activateDD2(){

    objMap.addInteraction(dragAndDropInteraction);

    dragAndDropInteraction.on('addfeatures', function(event) {

        if (vectorgpx_lyr===undefined){
            var vectorSource = new ol.source.Vector({
                features: event.features
            });
            vectorgpx_lyr = new ol.layer.Vector({
                    source: vectorSource,
                    style: styleFunction
                });
            objMap.addLayer(vectorgpx_lyr);
            console.log("Capa creada");
        }else{
            if (confirm("Borrar datos existentes") == true) {
                vectorgpx_lyr.getSource().clear();
            }
            vectorgpx_lyr.getSource().addFeatures(event.features);
        }
        console.log(vectorgpx_lyr.getSource().getExtent());
        objMap.getView().fit(vectorgpx_lyr.getSource().getExtent(),objMap.getSize());
      });

}

function init_activateDD(){

    objMap.addInteraction(dragAndDropInteraction);

    dragAndDropInteraction.on('addfeatures', function(event) {

        var vectorgpx_lyr;
        var vectorSource = new ol.source.Vector({
                features: event.features
        });
        vectorgpx_lyr = new ol.layer.Vector({
                    source: vectorSource,
                    style: styleFunction
        });
        userLayersWMScontador=userLayersWMScontador+1
        vectorgpx_lyr.set("keyname","WFS" + userLayersWMScontador);
        var userLayersWMSColeccion=new ol.Collection();
        userLayersWMSColeccion=userLayersWMSGroup.getLayers();
        userLayersWMSColeccion.push(vectorgpx_lyr);

        //Pregunto a l suuario cómo llamar a la capa en el TOC
        BootstrapDialog.show({
                    title: 'Introduce un nombre para la capa',
                    message: 'Capa: <input type="text" class="form-control">',
                    onhide: function(dialogRef){
                      var nombreCapa = dialogRef.getModalBody().find('input').val();
                      if($.trim(nombreCapa.toLowerCase()) !== '') {
                        add2UserTOC("content-panel-layers-User","WFS" + userLayersWMScontador,$.trim(nombreCapa));
                        objMap.getView().fit(vectorgpx_lyr.getSource().getExtent(),objMap.getSize());
                        return true;
                      }else{
                        alert('Introduce un nombre para la capa');
                        return false;
                      }
                    },
                    buttons: [{
                      label: 'Ok',
                      hotkey: 13, // Enter.
                      action: function(dialogRef) {
                          dialogRef.close();
                        }
                    }]
                });
        console.log("Capa creada");
        console.log(vectorgpx_lyr.getSource().getExtent());
      });
}
