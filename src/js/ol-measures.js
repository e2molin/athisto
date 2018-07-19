/*
Necesita un fichero de estilos para funcionar correctamente
<link rel="stylesheet" href="css/ol/ol3-sidebar.css"/>
*/

var wgs84Sphere = new ol.Sphere(6378137);
var measurementsSource=new ol.source.Vector();
var listener;
var sketch;
var helpTooltipElement;
var helpTooltip;
var measureTooltipElement;
var measureTooltip;
var continuePolygonMsg = 'Click para continuar dibujando el área';
var continueLineMsg = 'Click para continuar dibujando la polilínea';
var draw; // global so we can remove it later
var beginMeasurement = false;
var useGeodesicMeasures = true;

$( "#measureP" ).hover(function() {
    $("#btnToolDescript").html("<small><em>Desplazar el mapa</em></small>");
});
$( "#measureL" ).hover(function() {
    $("#btnToolDescript").html("<small><em>Medir longitud</em></small>");
});
$( "#measureA" ).hover(function() {
    $("#btnToolDescript").html("<small><em>Medir área</em></small>");
});
$( "#measureD" ).hover(function() {
    $("#btnToolDescript").html("<small><em>Borrar mediciones</em></small>");
});
$( "#mapToolbox .modal-content" ).hover(function() {
    $("#btnToolDescript").html("");
});
var vectorMeasures_Lyr = new ol.layer.Vector({
  zIndex:1000,
  source: measurementsSource,
  style: new ol.style.Style({
    fill: new ol.style.Fill({
      color: 'rgba(255, 255, 255, 0.2)'
    }),
    stroke: new ol.style.Stroke({
      color: '#ffcc33',
      width: 2
    }),
    image: new ol.style.Circle({
      radius: 7,
      fill: new ol.style.Fill({
        color: '#ffcc33'
      })
    })
  })
});



/**
 * format length output
 * @param {ol.geom.LineString} line
 * @return {string}
 */
var formatLength = function(line) {
  var length;
  if (useGeodesicMeasures==true) {
    var coordinates = line.getCoordinates();
    length = 0;
    var sourceProj = objMap.getView().getProjection();
    for (var i = 0, ii = coordinates.length - 1; i < ii; ++i) {
      var c1 = ol.proj.transform(coordinates[i], sourceProj, 'EPSG:4326');
      var c2 = ol.proj.transform(coordinates[i + 1], sourceProj, 'EPSG:4326');
      length += wgs84Sphere.haversineDistance(c1, c2);
    }
  } else {
    length = Math.round(line.getLength() * 100) / 100;
  }
  var output;
  if (length > 100) {
    output = (Math.round(length / 1000 * 100) / 100) +
        ' ' + 'km';
  } else {
    output = (Math.round(length * 100) / 100) +
        ' ' + 'm';
  }
  return output;
};


/**
 * format length output
 * @param {ol.geom.Polygon} polygon
 * @return {string}
 */
var formatArea = function(polygon) {
  var area;
  if (useGeodesicMeasures==true) {
    var sourceProj = objMap.getView().getProjection();
    var geom = /** @type {ol.geom.Polygon} */(polygon.clone().transform(
        sourceProj, 'EPSG:4326'));
    var coordinates = geom.getLinearRing(0).getCoordinates();
    area = Math.abs(wgs84Sphere.geodesicArea(coordinates));
  } else {
    area = polygon.getArea();
  }
  var output;
  if (area > 10000) {
    output = (Math.round(area / 1000000 * 100) / 100) +
        ' ' + 'km<sup>2</sup>';
  } else {
    output = (Math.round(area * 100) / 100) +
        ' ' + 'm<sup>2</sup>';
  }
  return output;
};

var pointerMoveHandler = function(evt) {
  if (evt.dragging) {
    return;
  }
  /** @type {string} */
  var helpMsg = 'Click para definir la zona a medir';

  if (sketch) {
    var geom = (sketch.getGeometry());
    if (geom instanceof ol.geom.Polygon) {
      helpMsg = continuePolygonMsg;
    } else if (geom instanceof ol.geom.LineString) {
      helpMsg = continueLineMsg;
    }
  }

  helpTooltipElement.innerHTML = helpMsg;
  helpTooltip.setPosition(evt.coordinate);

  if (beginMeasurement==true) {
    $(helpTooltipElement).removeClass('hidden');
  }
};

    function activateMeasurementTools(mapOL3){
                mapOL3.addLayer(vectorMeasures_Lyr);
                mapOL3.on('pointermove', pointerMoveHandler);
                $(mapOL3.getViewport()).on('mouseout', function() {
                  $(helpTooltipElement).addClass('hidden');
                });
                //createMeasureTooltip();
                createHelpTooltip();

    }



function addEventsOnDraw(){

    draw.on('drawstart',
                      function(evt) {
                        // set sketch
                        sketch = evt.feature;
                        /** @type {ol.Coordinate|undefined} */
                        var tooltipCoord = evt.coordinate;

                        listener = sketch.getGeometry().on('change', function(evt) {
                          var geom = evt.target;
                          var output;
                          if (geom instanceof ol.geom.Polygon) {
                            output = formatArea(/** @type {ol.geom.Polygon} */ (geom));
                            tooltipCoord = geom.getInteriorPoint().getCoordinates();
                          } else if (geom instanceof ol.geom.LineString) {
                            output = formatLength( /** @type {ol.geom.LineString} */ (geom));
                            tooltipCoord = geom.getLastCoordinate();
                          }
                          measureTooltipElement.innerHTML = output;
                          measureTooltip.setPosition(tooltipCoord);
                        });
                      }, this);

    draw.on('drawend',
                  function(evt) {
                    measureTooltipElement.className = 'tooltip tooltip-static';
                    measureTooltip.setOffset([0, -7]);
                    // unset sketch
                    sketch = null;
                    // unset tooltip so that a new one can be created
                    measureTooltipElement = null;
                    createMeasureTooltip();
                    ol.Observable.unByKey(listener);
                  }, this);


}



function addInteractionMeasureLength() {
  var type = 'LineString';
  draw = new ol.interaction.Draw({
    source: measurementsSource,
    type: /** @type {ol.geom.GeometryType} */ (type),
    style: new ol.style.Style({
      fill: new ol.style.Fill({
        color: 'rgba(255, 255, 255, 0.2)'
      }),
      stroke: new ol.style.Stroke({
        color: 'rgba(0, 0, 0, 0.5)',
        lineDash: [10, 10],
        width: 2
      }),
      image: new ol.style.Circle({
        radius: 5,
        stroke: new ol.style.Stroke({
          color: 'rgba(0, 0, 0, 0.7)'
        }),
        fill: new ol.style.Fill({
          color: 'rgba(255, 255, 255, 0.2)'
        })
      })
    })
  });
  addEventsOnDraw();
}
function addInteractionMeasureArea() {
  var type = 'Polygon';
  draw = new ol.interaction.Draw({
    source: measurementsSource,
    type: /** @type {ol.geom.GeometryType} */ (type),
    style: new ol.style.Style({
      fill: new ol.style.Fill({
        color: 'rgba(255, 255, 255, 0.2)'
      }),
      stroke: new ol.style.Stroke({
        color: 'rgba(0, 0, 0, 0.5)',
        lineDash: [10, 10],
        width: 2
      }),
      image: new ol.style.Circle({
        radius: 5,
        stroke: new ol.style.Stroke({
          color: 'rgba(0, 0, 0, 0.7)'
        }),
        fill: new ol.style.Fill({
          color: 'rgba(255, 255, 255, 0.2)'
        })
      })
    })
  });
  addEventsOnDraw();
}



//var toolboxMeasures = $('#measureP').button('toggle');
console.log("Lanzo mediciones");
var interaction;
//Al hacer clic en un botón de la barra de herramientas
$('#toolboxMeasures .btn').on('click', function(event) {
                //closeModals();
                objMap.removeInteraction(draw);
                beginMeasurement=false;
                switch($(this).attr('id')) {
                    case "measureL":
                        $( ".tooltip" ).show();
                        beginMeasurement=true;
                        addInteractionMeasureLength();
                        createMeasureTooltip();
                        //createHelpTooltip();
                        objMap.addInteraction(draw);
                        break;
                    case "measureA":
                        $( ".tooltip" ).show();
                        beginMeasurement=true;
                        addInteractionMeasureArea();
                        createMeasureTooltip();
                        //createHelpTooltip();
                        objMap.addInteraction(draw);
                        break;
                    case "measureD":
                        measurementsSource.clear();
                        $( ".tooltip-static" ).remove();
                        break;
                    default:
                        break;
                }
});

 /**************************************************************************************************************************************/





/**
 * Creates a new help tooltip
 */
function createHelpTooltip() {
  if (helpTooltipElement) {
    helpTooltipElement.parentNode.removeChild(helpTooltipElement);
  }
  helpTooltipElement = document.createElement('div');
  helpTooltipElement.className = 'tooltip hidden';
  helpTooltip = new ol.Overlay({
    element: helpTooltipElement,
    offset: [15, 0],
    positioning: 'center-left'
  });
  objMap.addOverlay(helpTooltip);
}


/**
 * Creates a new measure tooltip
 */
function createMeasureTooltip() {
  if (measureTooltipElement) {
    measureTooltipElement.parentNode.removeChild(measureTooltipElement);
  }
  measureTooltipElement = document.createElement('div');
  measureTooltipElement.className = 'tooltip tooltip-measure';
  measureTooltip = new ol.Overlay({
    element: measureTooltipElement,
    offset: [0, -15],
    positioning: 'bottom-center'
  });
  objMap.addOverlay(measureTooltip);
}
