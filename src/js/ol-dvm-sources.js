var rasterMTN_lyr;
var primeraEdiMTN50_lyr;
var primeraEdiMTN25_lyr;
var catastronesMTN50_lyr;
var actualPNOA_lyr;
var baseIGN_lyr;
var siose_lyr;
var mdtign_lyr;
var geologicoMinero_lyr;

var basicOSM_lyr;
var basicOSM2_lyr;
var waterColorOSM_lyr;
var blackWhiteOSM_lyr;
var footprints_lyr;

var baseLayerList = new Array();

var capasBaseMain = new Array();
var capasBaseMirror = new Array();
var capasBaseOSMLista = new Array();

/*Vuelos PNOA*/
var overlayPNOARasterList = new Array();
var overlayIGNRasterList = new Array();
var overlayVectorList = new Array();

/*Capa Vectorial PNOA Footprints*/
function loadAutonomFootsprints(){

  //Defino un estilo sin colores y transparente. Para dejar la capa visible pero que no se vea
  var style = new ol.style.Style({
      fill: new ol.style.Fill({
        color: 'rgba(255, 0, 0, 0.0)'
      }),
      stroke: new ol.style.Stroke({
        //color: '#319FD3',
        color: 'rgba(255, 255, 255, 0.0)',
        width: 1
      }),
      text: new ol.style.Text({
        font: '12px Calibri,sans-serif',
        fill: new ol.style.Fill({
          color: '#000'
        }),
        stroke: new ol.style.Stroke({
          color: '#fff',
          width: 3
        })
      })
    });
    footprints_lyr = new ol.layer.Vector({
      title: 'Autonomías',
      source: new ol.source.Vector({
        projection : 'EPSG:3857',
        url: 'autonom.geojson',
        format: new ol.format.GeoJSON()
      }),
      style: function(feature, resolution) {
        //style.getText().setText(resolution < 5000 ? feature.get('Fecha') : '');
        return style;
      }
    });
  objMap.addLayer(footprints_lyr);
  console.log("Capa de Autonomías cargada");    
}

/*
Función para el doble cursor
Los cursores son dos capas vectoriales que se cargan por encima de todas.
En su evento move el icono del vector se carga en la posición del ratón
*/
function configCursorMapa(){

  var LiconFeature = new ol.Feature();
  var LiconStyle = new ol.style.Style({
		  image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
		    anchor: [10, 10],
		    anchorXUnits: 'pixels',
		    anchorYUnits: 'pixels',
		    src: 'img/cross-orange.png'
		  }))
  });

  LiconFeature.setStyle(LiconStyle);

  var LvectorSource = new ol.source.Vector({
		  features: [LiconFeature]
	});

  var LvectorLayerMouseCross = new ol.layer.Vector({
		  source: LvectorSource,
		  title: 'vectorMouseCrossL'
	});

  //Encima de todas las capas insertamos el vector con la cruz
  objMap.getLayers().insertAt(1000,LvectorLayerMouseCross);

  objMap.on('pointermove', function(event) {
		    RiconFeature.setGeometry(null);
        var coord3857 = event.coordinate;
        RiconFeature.setGeometry( new ol.geom.Point(coord3857) );
  });


  var RiconFeature = new ol.Feature();
  var RiconStyle = new ol.style.Style({
		  image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
		    anchor: [10, 10],
		    anchorXUnits: 'pixels',
		    anchorYUnits: 'pixels',
        src: 'img/cross-blue.png'
		  }))
  });

  RiconFeature.setStyle(RiconStyle);

  var RvectorSource = new ol.source.Vector({
		  features: [RiconFeature]
	});

  var RvectorLayerMouseCross = new ol.layer.Vector({
		  source: RvectorSource,
		  title: 'vectorMouseCrossR'
  });

  //Encima de todas las capas insertamos el vector con la cruz
  var maprightlayerlength = objMapMirror.getLayers().getLength();
  objMapMirror.getLayers().insertAt(1000,RvectorLayerMouseCross);
  objMapMirror.on('pointermove', function(event) {
	   LiconFeature.setGeometry(null);
     var coord3857 = event.coordinate;
     LiconFeature.setGeometry( new ol.geom.Point(coord3857) );
	});


  $("#mapLienzo").on("mouseenter", function(event) {
		LiconFeature.setGeometry(null);
		RiconFeature.setGeometry(null);
	});

	$("#mapMirrorLienzo").on("mouseenter", function(event) {
		LiconFeature.setGeometry(null);
		RiconFeature.setGeometry(null);
	});

}

//Las capas OSM no se cargan, pero aquí están
function loadBasicOSM(visibilityDefault){

    waterColorOSM_lyr= new ol.layer.Tile({
                        title: 'OSM Acuarela',
                        /*type: 'base',*/
                        visible: visibilityDefault,
                        source: new ol.source.Stamen({
                            layer: 'watercolor'
                        })
                    });
    waterColorOSM_lyr.set("keyname","osmacuarela");
    waterColorOSM_lyr.set("alias","OSM Acuarela");
    capasBaseOSMLista.push(waterColorOSM_lyr);
    blackWhiteOSM_lyr= new ol.layer.Tile({
                        title: 'OSM Toner',
                        /*type: 'base',*/
                        visible: visibilityDefault,
                        source: new ol.source.Stamen({
                            layer: 'toner'
                        })
                    });
    blackWhiteOSM_lyr.set("keyname","osmatoner");
    blackWhiteOSM_lyr.set("alias","OSM Tóner");
    capasBaseOSMLista.push(blackWhiteOSM_lyr);
    basicOSM_lyr=new ol.layer.Tile({
                        title: 'OSM Básico',
                        /*type: 'base',*/
                        visible: visibilityDefault,
                        source: new ol.source.OSM()
                    });
    basicOSM_lyr.set("keyname","osmbasic");
    basicOSM_lyr.set("alias","OSM Básico");

    basicOSM2_lyr=new ol.layer.Tile({
                        title: 'OSM Básico 2',
                        /*type: 'base',*/
                        visible: visibilityDefault,
                        source: new ol.source.OSM()
                    });
    basicOSM2_lyr.set("keyname","osmbasic2");
    basicOSM2_lyr.set("alias","OSM Básico 2");

    capasBaseOSMLista.push(basicOSM2_lyr);

    console.log("Capas OSM cargadas");
}

function loadBasicIGN(visibilityDefault){
  var projectionExtent = projection.getExtent();
  var size = ol.extent.getWidth(projectionExtent) / 256;
	var resolutions = new Array(18);
	var matrixIds = new Array(18);
	for (var z = 0; z < 18; ++z) {
		  // generate resolutions and matrixIds arrays for this WMTS
		  resolutions[z] = size / Math.pow(2, z);
		  matrixIds[z] = z;
	}

	var attributionPNOA = new ol.Attribution({
			html: ' - PNOA Actual'
	});

	var attributionIGNBase = new ol.Attribution({
			html: ' - IGN BASE'
	});

  var attributionrasterMTN = new ol.Attribution({
			html: ' - Cartografí­a raster'
	});

  var attributionprimeraEdiMTN50 = new ol.Attribution({
			html: ' - Primera edición del MTN50'
	});

  var attributionprimeraEdiMTN25 = new ol.Attribution({
			html: ' - Primera edición del MTN25'
	});

  var attributioncatastronesMTN50 = new ol.Attribution({
			html: ' - Minutas MTN50'
	});

  var attributiongenericaIGN = new ol.Attribution({
			html: '&copy; <a href="http://www.ign.es"  target="_blank">IGN</a>'
  });

  var attributionGeologico = new ol.Attribution({
			html: ' - &copy; <a href="http://www.igme.es/"  target="_blank">Instituto Geológico y Minero</a>'
  });



    //Ponemos IGNBase como el mapa de fondo por defecto Por esa es la unica que no se regula con visibilityDefault
	baseIGN_lyr = new ol.layer.Tile({
			  title: 'IGN Base',
        /*type: 'base',*/
        visible: visibilityDefault,
			  extent: projectionExtent,
			  opacity: 1.0,
			  source: new ol.source.WMTS({
			         attributions: [attributionIGNBase],
               url: 'http://www.ign.es/wmts/ign-base',
               layer: 'IGNBaseTodo',
				matrixSet: 'EPSG:3857',
				format: 'image/jpeg',
				projection: projection,
				tileGrid: new ol.tilegrid.WMTS({
				  origin: ol.extent.getTopLeft(projectionExtent),
				  resolutions: resolutions,
				  matrixIds: matrixIds
				}),
				style: 'default'
			  })
	});
  baseIGN_lyr.set("keyname","baseIGN");
  baseIGN_lyr.set("alias","Mapa");
  //baseLayerList.push(baseIGN_lyr);


  actualPNOA_lyr=new ol.layer.Tile({
                    title: 'PNOA',
                    /*type: 'base',*/
                    visible: visibilityDefault,
                    extent: projectionExtent,
                    opacity: 1.0,
                    source: new ol.source.XYZ({
										attributions: [attributionPNOA],
                                        url: 'http://www.ign.es/wmts/pnoa-ma?request=getTile&layer=OI.OrthoimageCoverage&TileMatrixSet=GoogleMapsCompatible&TileMatrix={z}&TileCol={x}&TileRow={y}&format=image/jpeg'
										//url: './php/tesel-pnoa-mr.php?z={z}&x={x}&y={y}'
							})
  });
  actualPNOA_lyr.set("keyname","actualPNOA");
  actualPNOA_lyr.set("alias","Imagen");
  //baseLayerList.push(actualPNOA_lyr);

  rasterMTN_lyr=new ol.layer.Tile({
                    title: 'Cartografí­a raster',
                    /*type: 'base',*/
                    visible: visibilityDefault,
                    extent: projectionExtent,
                    opacity: 1.0,
                    source: new ol.source.XYZ({
										attributions: [attributionrasterMTN],
                                        url: 'http://www.ign.es/wmts/mapa-raster?request=getTile&layer=MTN&TileMatrixSet=GoogleMapsCompatible&TileMatrix={z}&TileCol={x}&TileRow={y}&format=image/jpeg'
										//url: './php/tesel-igncartoraster.php?z={z}&x={x}&y={y}'

							})
  });
  rasterMTN_lyr.set("keyname","rasterMTN");
  rasterMTN_lyr.set("alias","MTN");
  //baseLayerList.push(rasterMTN_lyr);

	primeraEdiMTN50_lyr=new ol.layer.Tile({
							title: 'Serie MTN Primera EdiciÃ³n base',
							/*type: 'base',*/
							visible: visibilityDefault,
                            opacity: 1.0,
						//	source: new ol.source.TileWMS({
							source: new ol.source.XYZ({
							//	url: 'http://www.ign.es/wms/primera-edicion-mtn',
								url: 'http://www.ign.es/wmts/primera-edicion-mtn?request=getTile&layer=mtn50-edicion1&TileMatrixSet=GoogleMapsCompatible&TileMatrix={z}&TileCol={x}&TileRow={y}&format=image/jpeg',
                                attributions: [attributionprimeraEdiMTN50],
							//	params: {"LAYERS": "MTN50", "TILED": "true"}
							})
	});
  primeraEdiMTN50_lyr.set("alias","1ªMTN50");
  primeraEdiMTN50_lyr.set("keyname","primeraEdiMTN50");
  //baseLayerList.push(primeraEdiMTN50_lyr);

	primeraEdiMTN25_lyr=new ol.layer.Tile({
							title: 'Serie MTN25 Primera Edición base',
							/*type: 'base',*/
							visible: visibilityDefault,
                            opacity: 1.0,
						//	source: new ol.source.TileWMS({
							source: new ol.source.XYZ({
							//	url: 'http://www.ign.es/wms/primera-edicion-mtn',
								url: 'http://www.ign.es/wmts/primera-edicion-mtn?request=getTile&layer=mtn25-edicion1&TileMatrixSet=GoogleMapsCompatible&TileMatrix={z}&TileCol={x}&TileRow={y}&format=image/jpeg',
                                attributions: [attributionprimeraEdiMTN25],
							//	params: {"LAYERS": "MTN50", "TILED": "true"}
							})
	});
  primeraEdiMTN25_lyr.set("alias","1ªMTN25");
  primeraEdiMTN25_lyr.set("keyname","primeraEdiMTN25");
  //baseLayerList.push(primeraEdiMTN25_lyr);

	catastronesMTN50_lyr=new ol.layer.Tile({
							title: 'Serie minutas MTN50 base',
							/*type: 'base',*/
							visible: visibilityDefault,
                            opacity: 1.0,
						//	source: new ol.source.TileWMS({
							source: new ol.source.XYZ({
							//	url: 'http://www.ign.es/wms/primera-edicion-mtn',
								url: 'http://www.ign.es/wmts/primera-edicion-mtn?request=getTile&layer=catastrones&TileMatrixSet=GoogleMapsCompatible&TileMatrix={z}&TileCol={x}&TileRow={y}&format=image/jpeg',
                                attributions: [attributioncatastronesMTN50],
							//	params: {"LAYERS": "MTN50", "TILED": "true"}
							})
	});
  catastronesMTN50_lyr.set("alias","MinMTN50");
  catastronesMTN50_lyr.set("keyname","MinMTN50");
  //baseLayerList.push(catastronesMTN50_lyr);

  mdtign_lyr=new ol.layer.Tile({
                  title: 'MDT',
                  /*type: 'base',*/
                  visible: visibilityDefault,
                  extent: projectionExtent,
                  opacity: 1.0,
                  source: new ol.source.XYZ({
                                      attributions: [attributiongenericaIGN],
                                      url: 'http://www.ign.es/wmts/mdt?request=getTile&layer=Relieve&TileMatrixSet=GoogleMapsCompatible' +
                                      '&TileMatrix={z}&TileCol={x}&TileRow={y}&format=image/jpeg'
                          })
  });
  mdtign_lyr.set("keyname","mdtign");
  mdtign_lyr.set("alias","MDT");
  //baseLayerList.push(mdtign_lyr);

  siose_lyr=new ol.layer.Tile({
                          title: 'Usos del suelo',
                          /*type: 'base',*/
                          visible: visibilityDefault,
                          source: new ol.source.TileWMS({
                              url: 'http://www.ign.es/wms-inspire/ocupacion-suelo',
                              attributions: [attributiongenericaIGN],
                              params: {"LAYERS": "LU.ExistingLandUse", "TILED": "true"}
                          })
  });
  siose_lyr.set("keyname","siose");
  siose_lyr.set("alias","SIOSE");
  //capasBaseLista.push(siose_lyr);

  geologicoMinero_lyr=new ol.layer.Tile({
                              title: 'Geológico',
                              /*type: 'base',*/
                              visible: visibilityDefault,
                              source: new ol.source.TileWMS({
                                  url: 'http://mapas.igme.es/gis/services/Cartografia_Geologica/IGME_Geologico_1M/MapServer/WMSServer',
                                  attributions: [attributionGeologico],
                                  params: {"LAYERS": "3,2,1,0", "TILED": "true","FORMAT": "image/png"}
                              })
  });
  geologicoMinero_lyr.set("keyname","geologico");
  geologicoMinero_lyr.set("alias","IGM50");
  //baseLayerList.push(geologicoMinero_lyr);

  console.log("Capas base cargadas");



}

function cargaCapasBaseMain(){

  var projectionExtent = projection.getExtent();
  var size = ol.extent.getWidth(projectionExtent) / 256;
	var resolutions = new Array(18);
	var matrixIds = new Array(18);
	for (var z = 0; z < 18; ++z) {
		  // generate resolutions and matrixIds arrays for this WMTS
		  resolutions[z] = size / Math.pow(2, z);
		  matrixIds[z] = z;
	}

  var attributionIGNBase = new ol.Attribution({
			html: 'IGN Base'
	});

	var attributionPNOA = new ol.Attribution({
			html: 'PNOA'
	});

  baseIGN_Mainlyr = new ol.layer.Tile({
        title: 'IGN Base - Main',
        /*type: 'base',*/
        visible: true,
        extent: projectionExtent,
        opacity: 1.0,
        source: new ol.source.WMTS({
               attributions: [attributionIGNBase],
               url: 'http://www.ign.es/wmts/ign-base',
               layer: 'IGNBaseTodo',
        matrixSet: 'EPSG:3857',
        format: 'image/jpeg',
        projection: projection,
        tileGrid: new ol.tilegrid.WMTS({
          origin: ol.extent.getTopLeft(projectionExtent),
          resolutions: resolutions,
          matrixIds: matrixIds
        }),
        style: 'default'
        })
  });
  baseIGN_Mainlyr.set("keyname","baseIGNMain");
  baseIGN_Mainlyr.set("alias","Mapa");
  baseIGN_Mainlyr.set('group',"imaginery-base");
  capasBaseMain.push(baseIGN_Mainlyr);


  pnoaIGN_Mainlyr=new ol.layer.Tile({
                    title: 'PNOA Actual - Main',
                    /*type: 'base',*/
                    visible: false,
                    extent: projectionExtent,
                    opacity: 1.0,
                    source: new ol.source.XYZ({
                    attributions: [attributionPNOA],
                                        url: 'http://www.ign.es/wmts/pnoa-ma?request=getTile&layer=OI.OrthoimageCoverage&TileMatrixSet=GoogleMapsCompatible&TileMatrix={z}&TileCol={x}&TileRow={y}&format=image/jpeg'
                    //url: './php/tesel-pnoa-mr.php?z={z}&x={x}&y={y}'
              })
  });
  pnoaIGN_Mainlyr.set("keyname","pnoaActualIGNMain");
  pnoaIGN_Mainlyr.set("alias","Imagen");
  pnoaIGN_Mainlyr.set('group',"imaginery-base");
  capasBaseMain.push(pnoaIGN_Mainlyr);

  /*baseIGNTrans_Mainlyr = new ol.layer.Tile({
        title: 'IGN Base Orto - Main',
        visible: false,
        extent: projectionExtent,
        opacity: 1.0,
        source: new ol.source.WMTS({
               attributions: [attributionIGNBase],
               url: 'http://www.ign.es/wmts/ign-base',
               layer: 'IGNBaseOrto',
        matrixSet: 'EPSG:3857',
        format: 'image/jpeg',
        projection: projection,
        tileGrid: new ol.tilegrid.WMTS({
          origin: ol.extent.getTopLeft(projectionExtent),
          resolutions: resolutions,
          matrixIds: matrixIds
        }),
        style: 'default'
        })
  });*/
  baseIGNTrans_Mainlyr=new ol.layer.Tile({
                    title: 'IGN Base Orto - Main',
                    /*type: 'base',*/
                    visible: false,
                    extent: projectionExtent,
                    opacity: 1.0,
                    source: new ol.source.XYZ({
                    attributions: [attributionIGNBase],
                                        //url: 'http://www.ign.es/wmts/pnoa-ma?request=getTile&layer=OI.OrthoimageCoverage&TileMatrixSet=GoogleMapsCompatible&TileMatrix={z}&TileCol={x}&TileRow={y}&format=image/jpeg'
                                        url: 'http://www.ign.es/wmts/ign-base?request=getTile&layer=IGNBaseOrto&TileMatrixSet=GoogleMapsCompatible&TileMatrix={z}&TileCol={x}&TileRow={y}&format=image/png'
                    //url: './php/tesel-pnoa-mr.php?z={z}&x={x}&y={y}'
              })
  });
  baseIGNTrans_Mainlyr.set("keyname","baseIGNTransMain");
  baseIGNTrans_Mainlyr.set("alias","Mapa Textos");
  baseIGNTrans_Mainlyr.set('group',"imaginery-base");
  capasBaseMain.push(baseIGNTrans_Mainlyr);

  console.log("Capas base main cargadas");

}

function cargaCapasBaseMirror(){

  var projectionExtent = projection.getExtent();
  var size = ol.extent.getWidth(projectionExtent) / 256;
	var resolutions = new Array(18);
	var matrixIds = new Array(18);
	for (var z = 0; z < 18; ++z) {
		  // generate resolutions and matrixIds arrays for this WMTS
		  resolutions[z] = size / Math.pow(2, z);
		  matrixIds[z] = z;
	}

  var attributionIGNBase = new ol.Attribution({
			html: 'IGN Base - &copy; <a href="http://www.ign.es" target="_blank">Instituto Geográfico Nacional</a>'
	});

	var attributionPNOA = new ol.Attribution({
			html: 'PNOA - &copy; <a href="http://www.ign.es" target="_blank">Instituto Geográfico Nacional</a>'
	});
  baseIGN_Mirrorlyr=new ol.layer.Tile({
                    title: 'IGN Base - Mirror',
                    /*type: 'base',*/
                    visible: true,
                    extent: projectionExtent,
                    opacity: 1.0,
                    source: new ol.source.XYZ({
                    attributions: [attributionIGNBase],
                                        //url: 'http://www.ign.es/wmts/pnoa-ma?request=getTile&layer=OI.OrthoimageCoverage&TileMatrixSet=GoogleMapsCompatible&TileMatrix={z}&TileCol={x}&TileRow={y}&format=image/jpeg'
                                        url: 'http://www.ign.es/wmts/ign-base?request=getTile&layer=IGNBaseTodo&TileMatrixSet=GoogleMapsCompatible&TileMatrix={z}&TileCol={x}&TileRow={y}&format=image/jpeg'
                    //url: './php/tesel-pnoa-mr.php?z={z}&x={x}&y={y}'
              })
  });
  baseIGN_Mirrorlyr.set("keyname","baseIGNMirror");
  baseIGN_Mirrorlyr.set("alias","Mapa");
  baseIGN_Mirrorlyr.set('group',"imaginery-base");
  capasBaseMirror.push(baseIGN_Mirrorlyr);


  pnoaIGN_Mirrorlyr=new ol.layer.Tile({
                    title: 'PNOA Actual - Mirror',
                    /*type: 'base',*/
                    visible: false,
                    extent: projectionExtent,
                    opacity: 1.0,
                    source: new ol.source.XYZ({
                    attributions: [attributionPNOA],
                                        url: 'http://www.ign.es/wmts/pnoa-ma?request=getTile&layer=OI.OrthoimageCoverage&TileMatrixSet=GoogleMapsCompatible&TileMatrix={z}&TileCol={x}&TileRow={y}&format=image/jpeg'
                                        //url: 'http://www.ign.es/wmts/ign-base?request=getTile&layer=IGNBaseTodo&TileMatrixSet=GoogleMapsCompatible&TileMatrix={z}&TileCol={x}&TileRow={y}&format=image/jpeg'
                    //url: './php/tesel-pnoa-mr.php?z={z}&x={x}&y={y}'
              })
  });
  pnoaIGN_Mirrorlyr.set("keyname","pnoaActualIGNMirror");
  pnoaIGN_Mirrorlyr.set("alias","Imagen");
  pnoaIGN_Mirrorlyr.set('group',"imaginery-base");
  capasBaseMirror.push(pnoaIGN_Mirrorlyr);

  baseIGNTrans_Mirrorlyr=new ol.layer.Tile({
                    title: 'IGN Base Orto - Mirror',
                    /*type: 'base',*/
                    visible: false,
                    extent: projectionExtent,
                    opacity: 1.0,
                    source: new ol.source.XYZ({
                    attributions: [attributionIGNBase],
                                        //url: 'http://www.ign.es/wmts/pnoa-ma?request=getTile&layer=OI.OrthoimageCoverage&TileMatrixSet=GoogleMapsCompatible&TileMatrix={z}&TileCol={x}&TileRow={y}&format=image/jpeg'
                                        url: 'http://www.ign.es/wmts/ign-base?request=getTile&layer=IGNBaseOrto&TileMatrixSet=GoogleMapsCompatible&TileMatrix={z}&TileCol={x}&TileRow={y}&format=image/png'
                    //url: './php/tesel-pnoa-mr.php?z={z}&x={x}&y={y}'
              })
  });
  baseIGNTrans_Mirrorlyr.set("keyname","baseIGNTransMirror");
  baseIGNTrans_Mirrorlyr.set("alias","Mapa Textos");
  baseIGNTrans_Mirrorlyr.set('group',"imaginery-base");
  capasBaseMirror.push(baseIGNTrans_Mirrorlyr);
  console.log("Capas base mirror cargado");
}

/*
Función para cargar las capas descritas en un fichero: overlays-pnoa.json
Las capas se muestran mediante botones toggle dentro de un contenedor #content-panel-layers-rasteroverlays con el título Vuelos históricos
*/
function rasterPNOAOverlays(visibilityDefault){
    var projectionExtent = projection.getExtent();
    var size = ol.extent.getWidth(projectionExtent) / 256;
  	var resolutions = new Array(19);
  	var matrixIds = new Array(19);
    var elemLyr;
  	for (var z = 0; z < 19; ++z) {
  		  // generate resolutions and matrixIds arrays for this WMTS
  		  resolutions[z] = size / Math.pow(2, z);
  		  matrixIds[z] = z;
  	}
    $.getJSON('overlays-pnoa.json', { get_param: 'value' }, function(data) {
        var htmlList = [];
        var ctrlNames = [];
        //Si añadimos  clase "collapse in", el menú se despliega por defecto
        //USando la clase "collapsed" en el hipervínculo hacemos que aparezca la flechita correctamente
        htmlList.push("<div class=\"panel panel-info\" style=\"margin:0px;\">");
        htmlList.push("<div class='panel-heading panel-heading-sm'><a id='btn-content-panel-AirPhotoLayers' href='#content-panel-AirPhotoLayers' data-toggle='collapse' class='collapsed'>" +
                      "<i class='fa fa-plus-square' aria-hidden='true'></i> Imágenes aéreas históricas</a></div>");
        htmlList.push("<div id='content-panel-AirPhotoLayers' class=\"panel-body collapse \" style=\"margin:5px; padding:0px;\">");
        $.each(data, function(index, element) {
          var txtAttribution;
          if (element.author.html !== undefined) {
            txtAttribution = element.author.html;
          }else{
            txtAttribution = '<a href="' + element.author.url + '" target="_blank">' + element.author.name + '</a>';
          }

          if (element.tiposerv=="WMS"){
            rasterOverlay_lyr=new ol.layer.Tile({
  							title: element.title,
  							visible: visibilityDefault,
  							source: new ol.source.TileWMS({
                                  attributions: [new ol.Attribution({
  		                                          html: txtAttribution
  	                            })],
  								url: element.urlsource,
  								params: {"LAYERS": element.layernames, "TILED": "true"}
  							 })
            });
          }else if (element.tiposerv=="WMTS"){
            rasterOverlay_lyr = new ol.layer.Tile({
                title: element.title,
                visible: visibilityDefault,
                extent: projectionExtent,
                opacity: 1.0,
                source: new ol.source.XYZ({
                          attributions: [new ol.Attribution({
                            html: txtAttribution
                          })],
                          url: element.urlsource + '?request=getTile&layer=' + element.layernames + '&TileMatrixSet=GoogleMapsCompatible&TileMatrix={z}&TileCol={x}&TileRow={y}&format=' + element.imgformat
                })
            });
          }

          rasterOverlay_lyr.set('nombre',element.nombre);
          rasterOverlay_lyr.set('group',element.group);
          rasterOverlay_lyr.set('queryable',element.queryable);
          rasterOverlay_lyr.set('keyname',element.layerkey);
          rasterOverlay_lyr.set('alias',element.alias);
          rasterOverlay_lyr.set('year',element.year);
          overlayPNOARasterList.push(rasterOverlay_lyr);
          objMap.addLayer(rasterOverlay_lyr);

          //Preparamos los controles para la web
          htmlList.push("<div class=\"col-md-6 col-sm-6 col-xs-12\" style=\"margin-top:15px;\">" +
                    "<input class=\"toolboxOverlayRaster\" data-onstyle=\"success\" data-toggle=\"toggle\" data-on=\"<img src='img/eye16.png'/> <small>" + element.title +
                    "</small>\" data-off=\"" + element.title + "\" type=\"checkbox\" data-width=\"160\" data-size=\"mini\" id=\"sidebarBtn" + element.layerkey + "\">" +
                    "<div class=\"opacityLyrClass\" id=\"opacityLyrElem" + element.layerkey + "\"><div class=\"ui-slider-handle\"><span style=\"display:none;\" class=\"ui-slider-tooltip\"></span></div></div>" +
                    "</div>");
          ctrlNames.push(element.layerkey);
          //
        });
        htmlList.push("</div></div>");

        //Cargamos en el panel las capsa para que el usuario las manipule.
        //Introducimos la función para que al pulsar sonre el encabezado del panel, se muestre el texto para expandir/contraer
        var containerOverlayRaster = document.getElementById('panel-AirPhotoLayers');
        containerOverlayRaster.innerHTML = htmlList.join('');
        $("#content-panel-AirPhotoLayers").on("hide.bs.collapse", function(){
            $("#btn-content-panel-AirPhotoLayers").html("<i class='fa fa-plus-square' aria-hidden='true'></i> Imágenes aéreas históricas</a></div>");
        });
        $("#content-panel-AirPhotoLayers").on("show.bs.collapse", function(){
            $("#btn-content-panel-AirPhotoLayers").html("<i class='fa fa-minus-square' aria-hidden='true'></i> Imágenes aéreas históricas</a></div>");
        });

        //Como metemos componentes Bootstrap-Toggle, es necesario inicalizarlos, porque si no aparecen como inputbox normales sin customizar

        for (var i = 0, len = ctrlNames.length; i < len; i++) {
            $('#sidebarBtn' + ctrlNames[i]).bootstrapToggle();
        }


        $(".toolboxOverlayRaster").change(function() {
                var id = $(this).prop('id');
                var value_id = $(this).prop('checked');
                var nomLayer = replaceAll(id,"sidebarBtn","");
                setLayerVisibleByKey(objMap,nomLayer,value_id);
                $("#opacityLyrElem" + nomLayer).slider( "option", "value",100*value_id);//Si el usuario enciende la capa, el slider de opacidad marca 100
                //Vemos las capas que hay activas en el visor que sea de PNOA de IGN
                var capasActive = new Array();
                objMap.getLayers().forEach(
                  //Objeto Capa,index
                  function (layer, iLayer, layers) {
                    if ((layer.getProperties()['group']=='imaginery-flight' || layer.getProperties()['group']=='imaginery-IGN') && layer.getProperties()['visible']==true){
                      capasActive.push(layer.getProperties()['keyname']);
                    }
                  }
                );
                listaCapas = capasActive.join(",");
                if (modeViz==0){
                  apagarTodo();
                }
                //Esto es para mostrar/ocultar el contenedor que almacena el control de opacidad
        });

        //Como metemos componentes jquery ui-opacity, es necesaro inicializarlos

        $(".opacityLyrClass").slider({
            min: 0,
            max: 100,
            orientation: "horizontal",
            range: "min",
            value: 100,
            slide: function( event, ui ) {
                var id = $(this).prop('id');
                var nomLayer = replaceAll(id,"opacityLyrElem","");
                //$( "#amount" ).val( ui.value );
                //$(this).find('.ui-slider-handle').text(ui.value);
                $(this).find('.ui-slider-tooltip').text(ui.value);
                manageVisibleOverlaysByKeyname(objMap,nomLayer,"opacity",ui.value);
            },
            change: function( event, ui ) {
              //$(this).find('.ui-slider-handle').text(ui.value);
            },
            start: function( event, ui ) {
              $(this).find('.ui-slider-tooltip').fadeIn('fast');
            },
            stop: function( event, ui ) {
              //$(this).find('.ui-slider-handle').text("");
              $(this).find('.ui-slider-tooltip').fadeOut('fast');
            },
            create: function(event, ui) {
                var v=$(this).slider('value');
                //$(this).find('.ui-slider-handle').text(v);
            }
        });

        //Cargamos aquí para que las capas de usuario estén justo por encima de las capas de los Vuelos históricos y las capas del Archivo topográfico y popr debajo de las capas vectoriales
        //Cargamos si el navegador no es un IE antiguo
        if ((browserIE>0) && (browserIE<14)){
          $("#launchUserWMSSelectorInSidebar").hide();
        }else{
          initWMSUserComponent(objMap);
        }

        vectorOverLays(false);
        //Cargamos las capas con los cursores
        if (mobileMode==false){
                configCursorMapa();
        }
        console.log("Capas PNOA cargadas");
        processHash();
    });
}

function getPropertyValueFromPNOAOverlaysByYear(nameProperty,year){
  for (var i = 0, len = overlayPNOARasterList.length; i < len; i++) {
      if (overlayPNOARasterList[i].getProperties()['year']==year){
          return overlayPNOARasterList[i].getProperties()[nameProperty];
      }
  }
}

function getPropertyValueFromPNOAOverlaysByLayerkey(nameProperty,layerkey){
  for (var i = 0, len = overlayPNOARasterList.length; i < len; i++) {
      if (overlayPNOARasterList[i].getProperties()['keyname']==layerkey){
          return overlayPNOARasterList[i].getProperties()[nameProperty];
      }
  }
}

function getOBJlayerByKeyname(layerkey){
  for (var i = 0, len = overlayPNOARasterList.length; i < len; i++) {
      if (overlayPNOARasterList[i].getProperties()['keyname']==layerkey){
          return overlayPNOARasterList[i];
      }
  }
  for (var i = 0, len = overlayIGNRasterList.length; i < len; i++) {
      if (overlayIGNRasterList[i].getProperties()['keyname']==layerkey){
          return overlayIGNRasterList[i];
      }
  }
  for (var i = 0, len = baseLayerList.length; i < len; i++) {
      if (baseLayerList[i].getProperties()['keyname']==layerkey){
          return baseLayerList[i];
      }
  }
}




//Analizo los dos arrays de fuentes de capas que tengo y devuelvo la layer
function getLayerSourceByKeyname(layerkey){
  for (var i = 0, len = overlayPNOARasterList.length; i < len; i++) {
      if (overlayPNOARasterList[i].getProperties()['keyname']==layerkey){
        layerChange = overlayPNOARasterList[i];
        return layerChange;
      }
  }
  for (var i = 0, len = overlayIGNRasterList.length; i < len; i++) {
      if (overlayIGNRasterList[i].getProperties()['keyname']==layerkey){
        layerChange = overlayIGNRasterList[i];
        return layerChange;
      }
  }
  for (var i = 0, len = baseLayerList.length; i < len; i++) {
      if (baseLayerList[i].getProperties()['keyname']==layerkey){
        layerChange = baseLayerList[i];
        return layerChange;
      }
  }
}

/*
--------------------------------------------------------------------------------------
Capas IGN Overlays
--------------------------------------------------------------------------------------
*/
function rasterIGNOverlays(visibilityDefault){
  var projectionExtent = projection.getExtent();
  var size = ol.extent.getWidth(projectionExtent) / 256;
	var resolutions = new Array(19);
	var matrixIds = new Array(19);
  var elemLyr;
  var infoIcon="";

	for (var z = 0; z < 19; ++z) {
		  // generate resolutions and matrixIds arrays for this WMTS
		  resolutions[z] = size / Math.pow(2, z);
		  matrixIds[z] = z;
	}
	var attributionGeneric = new ol.Attribution({
			html: 'PNOA cedido por &copy; <a href="http://www.ign.es" target="_blank">Instituto Geográfico Nacional</a>'
	});

    $.getJSON('overlays-other.json', { get_param: 'value' }, function(data) {
        var itemsATLayer = [];
        var ctrlNames = [];
        itemsATLayer.push("<div class=\"panel panel-info\" style=\"margin-left:0px;\">");
        itemsATLayer.push("<div class='panel-heading panel-heading-sm'><a id='btn-content-panel-ATLayers' href='#content-panel-ATLayers' data-toggle='collapse'>" +
                      "<i class='fa fa-minus-square' aria-hidden='true'></i> Series MTN y Archivo Topográfico</a></div>");
                      itemsATLayer.push("<div id='content-panel-ATLayers' class=\"panel-body collapse in\" style=\"margin:5px; padding:0px;\">");

        //Bucle de lectura
        $.each(data, function(index, element) {
          var txtAttribution = "";
          if (element.author.html !== undefined) {
            txtAttribution = element.author.html;
          }else{
            txtAttribution = '<a href="' + element.author.url + '" target="_blank">' + element.author.name + '</a>';
          }
  
          if (element.tiposerv=="WMS"){
            if (element.tileMode==true){
              elemLyr=new ol.layer.Tile({
    							title: element.title,
    							visible: visibilityDefault,
    							source: new ol.source.TileWMS({
                                    attributions: [new ol.Attribution({
                                      html: txtAttribution
                                    })],
    								url: element.urlsource,
    								params: {"LAYERS": element.layernames, "TILED": element.tileMode,"FORMAT": element.imgformat}
    							 })
              });
            } else{
              elemLyr=new ol.layer.Image({
    							title: element.title,
    							visible: visibilityDefault,
    							source: new ol.source.ImageWMS({
                                    attributions: [new ol.Attribution({
                                      html: txtAttribution
                                    })],
    								url: element.urlsource,
    								params: {"LAYERS": element.layernames,"FORMAT": element.imgformat}
    							 })
              });
            }
          }else if (element.tiposerv=="WMTS"){
            elemLyr=new ol.layer.Tile({
                title: element.title,
                visible: visibilityDefault,
                extent: projectionExtent,
                opacity: 1.0,
                source: new ol.source.XYZ({
                          attributions: [new ol.Attribution({
                            html: txtAttribution
                          })],
                          url: element.urlsource + '?request=getTile&layer=' + element.layernames + '&TileMatrixSet=GoogleMapsCompatible&TileMatrix={z}&TileCol={x}&TileRow={y}&format=' + element.imgformat
                })
            });
          }
          //console.log(element.author.name);
          elemLyr.set('nombre',element.title);
          elemLyr.set('tiposerv',element.tiposerv);
          elemLyr.set('group',element.group);
          elemLyr.set('queryable',element.queryable);
          elemLyr.set('useproxy',element.useproxy);
          elemLyr.set('urlQuery',element.GetFeatureInfo.urlQuery);
          elemLyr.set('layerQuery',element.GetFeatureInfo.layerQuery);
          //console.log(element.GetFeatureInfo.layerQuery);
          elemLyr.set('keyname',element.layerkey);
          elemLyr.set('alias',element.alias);
          elemLyr.set('year',element.year);
          elemLyr.set("panel","ATLayers");
          elemLyr.set("mostrarenpanel",element.mostrarenpanel);
          elemLyr.set("unicoenfila",element.unicoenfila);
          overlayIGNRasterList.push(elemLyr);

          objMap.addLayer(elemLyr);
          if (element.zindex>0){
            setLayerZindex(objMap,element.layerkey,element.zindex);
          }
          
          //Preparamos los controles para la web
          if (elemLyr.getProperties()['queryable']==true){
            infoIcon = "<i class='fa fa-list-alt' aria-hidden='true'></i>";
          }else{
            infoIcon = "";
          }

          if (elemLyr.getProperties()['mostrarenpanel']==true) {
              var rtnCarro="";  //Esto me vale para poner una única capa en una fila.
              if (element.unicoenfila==true){
                rtnCarro=12;
              }else{
                rtnCarro=6;
              }

              itemsATLayer.push("<div class=\"col-md-" + rtnCarro + " col-sm-" + rtnCarro + " col-xs-12\" style=\"margin-top:15px;\">" +
              "<input class=\"toolboxOverlayRaster\" data-onstyle=\"success\" data-toggle=\"toggle\" data-on=\"<img src='img/eye16.png'/> <small>" + element.title + " " + infoIcon +
              "</small>\" data-off=\"" + element.title + " " + infoIcon + "\" type=\"checkbox\" data-width=\"160\" data-size=\"mini\" id=\"sidebarBtn" + element.layerkey + "\">" +
              "<div class=\"opacityLyrClass\" id=\"opacityLyrElem" + element.layerkey + "\"><div class=\"ui-slider-handle\"><span style=\"display:none;\" class=\"ui-slider-tooltip\">" + "</span></div></div>" + "</div>");
            ctrlNames.push(element.layerkey);
          }
        });
        itemsATLayer.push("</div></div>");



        //Cargamos en el panel las capsa para que el usuario las manipule.
        //Introducimos la función para que al pulsar sobre el encabezado del panel, se muestre el texto para expandir/contraer
        var containerOverlayRaster = document.getElementById('panel-ATLayers');
        containerOverlayRaster.innerHTML = itemsATLayer.join('');
        $("#content-panel-ATLayers").on("hide.bs.collapse", function(){
            $("#btn-content-panel-ATLayers").html("<i class='fa fa-plus-square' aria-hidden='true'></i> Series MTN y Archivo Topográfico</a></div>");
        });
        $("#content-panel-ATLayers").on("show.bs.collapse", function(){
            $("#btn-content-panel-ATLayers").html("<i class='fa fa-minus-square' aria-hidden='true'></i> Series MTN y Archivo Topográfico</a></div>");
        });

        //Como metemos componentes Bootstrap-Toggle, es necesario inicalizarlos, porque si no aparecen como inputbox normales sin customizar

        for (var i = 0, len = ctrlNames.length; i < len; i++) {
            $('#sidebarBtn' + ctrlNames[i]).bootstrapToggle();
        }

     
        $(".toolboxOverlayRaster").change(function() {
                var id = $(this).prop('id');
                var value_id = $(this).prop('checked');
                var nomLayer = replaceAll(id,"sidebarBtn","");
                setLayerVisibleByKey(objMap,nomLayer,value_id);
                var capasActive = new Array();
                objMap.getLayers().forEach(
                  function (layer, iLayer, layers) {
                    if ((layer.getProperties()['group']=='imaginery-flight' || layer.getProperties()['group']=='imaginery-ign') && layer.getProperties()['visible']==true){
                      capasActive.push(layer.getProperties()['keyname']);
                    }
                  }
                );
                listaCapas = capasActive.join(",");
                if (modeViz==0){
                  apagarTodo();
                }
        });

        //Como metemos componentes jquery ui-opacity, es necesaro inicializarlos

        $(".opacityLyrClass").slider({
            min: 0,
            max: 100,
            orientation: "horizontal",
            range: "min",
            value: 100,
            slide: function( event, ui ) {
                var id = $(this).prop('id');
                var nomLayer = replaceAll(id,"opacityLyrElem","");
                $(this).find('.ui-slider-tooltip').text(ui.value);
                //$( "#amount" ).val( ui.value );
                //$(this).find('.ui-slider-handle').text(ui.value);
                manageVisibleOverlaysByKeyname(objMap,nomLayer,"opacity",ui.value);
            },
            change: function( event, ui ) {
              //$( "#amount" ).val( ui.value );
              //$(this).find('.ui-slider-handle').text(ui.value);
            },
            start: function( event, ui ) {
              $(this).find('.ui-slider-tooltip').fadeIn('fast');
            },
            stop: function( event, ui ) {
              //$(this).find('.ui-slider-handle').text("");
              $(this).find('.ui-slider-tooltip').fadeOut('fast');
            },
            create: function(event, ui) {
                var v=$(this).slider('value');
                //$(this).find('.ui-slider-handle').text(v);
            }
        });

        console.log("Capas Archivo Topográfico cargadas");
        //processHash();
    });
}



function vectorOverLays(visibilityDefault){
  //Las insertanos a partir del zIndex=900
  wmsSourceBDLJE = new ol.source.TileWMS({
      url: 'http://www.ign.es/wms-inspire/unidades-administrativas',
      params: {"LAYERS": "AU.AdministrativeBoundary", "TILED": "true"},
      serverType: 'geoserver',
      crossOrigin: ''
  });
  BDLJE_lyr=new ol.layer.Tile({
            title: 'Lí­mites administrativos',
            visible: visibilityDefault,
            zIndex: 901,
            source: new ol.source.TileWMS({
              attributions:new ol.Attribution({
                        html: " - BDLJE <a href='http://www.ign.es/web/ign/portal/rcc-info-delimitaciones' title='División Administrativa - Servicio de Delimitaciones Territoriales - IGN' target='_blank'> IGN</a>"
              }),
              url: 'http://www.ign.es/wms-inspire/unidades-administrativas',
              params: {"LAYERS": "AU.AdministrativeUnit","STYLES":"ua-comparador","FORMAT":"image/png", "TILED": "true"}
            })
      });
      //AU.AdministrativeBoundary.Default,ua-comparador,LimitesAdministrativos
  BDLJE_lyr.set('keyname','BDLJE');
  BDLJE_lyr.set('queryable',true);//La consulta se hace siempre por defecto
  BDLJE_lyr.set('group','Vector overlay');
  BDLJE_lyr.set("alias","Líneas límite");
  BDLJE_lyr.set("useproxy",false);
  BDLJE_lyr.set("panel","AdminLayers");
  BDLJE_lyr.set("abstract","Líneas límite municipales, provinciales y autonómicas. Capa con información asociada a la hoja registral");
  overlayVectorList.push(BDLJE_lyr);

  var attributionCadastral = new ol.Attribution({
    html: ' - &copy; <a href="http://www.catastro.minhap.gob.es/esp/wms.asp"  target="_blank">Dirección General del Catastro</a>'
   });
  cadastralOverlay=new ol.layer.Image({
            title: 'Catastro',
            visible: visibilityDefault,
            zIndex: 903,
            source: new ol.source.ImageWMS({
              attributions: [attributionCadastral],
              url: 'http://ovc.catastro.meh.es/Cartografia/WMS/ServidorWMS.aspx?',
              params: {'VERSION': '1.1.1','LAYERS': 'Catastro','SRS': 'EPSG:3857','TILED': 'false'},
              serverType: 'geoserver'
            })
      });
  cadastralOverlay.set('keyname','cadastral');
  cadastralOverlay.set('group','Vector overlay');
  cadastralOverlay.set("alias",'Catastro');
  cadastralOverlay.set("useproxy",false);
  cadastralOverlay.set("panel","OtherLayers");
  cadastralOverlay.set("abstract","Información del servicio publicado por al Dirección General del Catastro");
  overlayVectorList.push(cadastralOverlay);
    
    coastline_lyr=new ol.layer.Tile({
              title: 'Lí­nea de costa',
              visible: visibilityDefault,
              zIndex: 910,
              source: new ol.source.TileWMS({
                  url: 'http://ideihm.covam.es/wms/costaspain',
                  params: {"LAYERS": "HY","STYLES":"default","FORMAT":"image/png", "TILED": "true"}
              })
    });
    coastline_lyr.set('keyname','lineacosta');
    coastline_lyr.set('group','Vector overlay');
    coastline_lyr.set("alias","L­ínea de costa");
    coastline_lyr.set('queryable',false);
    coastline_lyr.set("useproxy",false);
    coastline_lyr.set("panel","AdminLayers");
    coastline_lyr.set("abstract","Línea de costa publicada por el Instituto Hidrográfico de la Marina");
    overlayVectorList.push(coastline_lyr);

    baserecta_lyr=new ol.layer.Tile({
      title: 'Líneas de base recta',
      visible: visibilityDefault,
      zIndex: 909,
      source: new ol.source.TileWMS({
          attributions:new ol.Attribution({
            html: " - LBR <a href='http://www.armada.mde.es/ihm/' title='Base Recta - Instituto Hidrográfico de la Marina - Ministerio de Defensa' target='_blank'> IHM</a>"
          }),        
          url: 'http://ideihm.covam.es/wms/limitesMAR',
          params: {"LAYERS": "LBR","STYLES":"default","FORMAT":"image/png", "TILED": "true"}
      })
    });
    baserecta_lyr.set('keyname','baserecta');
    baserecta_lyr.set('group','Vector overlay');
    baserecta_lyr.set("alias","Líneas de base recta");
    baserecta_lyr.set('queryable',true);
    baserecta_lyr.set("useproxy",false);
    baserecta_lyr.set("panel","AdminLayers");
    baserecta_lyr.set("abstract","Líneas que limitan las aguas interiores a partir de la cual se mide el mar territorial. Capa con información asociada. Publicado por el Instituto Hidrográfico de la Marina");
    overlayVectorList.push(baserecta_lyr);


    zee_lyr=new ol.layer.Tile({
              title: 'ZEE',
              visible: visibilityDefault,
              zIndex: 911,
              source: new ol.source.TileWMS({
                attributions:new ol.Attribution({
                  html: " - ZEE <a href='http://www.armada.mde.es/ihm/' title='Zona Económica Exclusiva - Instituto Hidrográfico de la Marina - Ministerio de Defensa' target='_blank'> IHM</a>"
                }),                  
                url: 'http://ideihm.covam.es/wms/limitesMAR',
                params: {"LAYERS": "ZEEE,ZEEE_textos","STYLES":"default","FORMAT":"image/png", "TILED": "true"}
              })
    });
    zee_lyr.set('keyname','ZEE');
    zee_lyr.set('group','Vector overlay');
    zee_lyr.set("alias","Zona Económico Exclusiva");
    zee_lyr.set('queryable',false);
    zee_lyr.set("useproxy",false);
    zee_lyr.set("panel","AdminLayers");
    zee_lyr.set("abstract","Zona económica exclusiva (200 millas). Publicado por el Instituto Hidrográfico de la Marina");
    overlayVectorList.push(zee_lyr);


    pcymt_lyr=new ol.layer.Tile({
              title: 'Mar territ.-Plat. cont',
              visible: visibilityDefault,
              zIndex: 912,
              source: new ol.source.TileWMS({
                attributions:new ol.Attribution({
                  html: " - PCYMT <a href='http://www.armada.mde.es/ihm/' title='Plataforma continental y Mar territorial - Instituto Hidrográfico de la Marina - Ministerio de Defensa' target='_blank'> IHM</a>"
                }),                   
                url: 'http://ideihm.covam.es/wms/limitesMAR',
                params: {"LAYERS": "PC,MT","STYLES":"default","FORMAT":"image/png", "TILED": "true"}
              })
    });
    pcymt_lyr.set("keyname","PCMT");
    pcymt_lyr.set('group','Vector overlay');
    pcymt_lyr.set("alias","Mar territorial-Plataforma");
    pcymt_lyr.set('queryable',false);
    pcymt_lyr.set("useproxy",false);
    pcymt_lyr.set("panel","AdminLayers");
    pcymt_lyr.set("abstract","Mar territorial y plataforma continental. Publicado por el Instituto Hidrográfico de la Marina");
    overlayVectorList.push(pcymt_lyr);


    infoToponim=new ol.layer.Tile({
              title: 'Toponimos',
              visible: visibilityDefault,
              zIndex: 915,
              source: new ol.source.TileWMS({
                attributions:new ol.Attribution({
                  html: " - Toponimia <a href='http://www.ign.es/web/ign/portal/rcc-nomenclator-nacional' title='Toponimia - Servicio de Nomenclátor - IGN' target='_blank'> IGN</a>"
                }),                  
                url: 'http://www.ign.es/wms-inspire/ign-base',
                params: {"LAYERS": "GN.GeographicalNames", "TILED": "true"}
              })
    });

    infoToponim.set('keyname','infoToponim');
    infoToponim.set('group','Vector overlay');
    infoToponim.set("alias","Topónimos");
    infoToponim.set('queryable',false);
    infoToponim.set("useproxy",false);
    infoToponim.set("panel","OtherLayers");
    infoToponim.set("abstract","Toponimia procedente del Nomenclátor");
    overlayVectorList.push(infoToponim);

    infoComunicacion=new ol.layer.Tile({
              title: 'Vías comunicación',
              visible: visibilityDefault,
              zIndex: 914,
              source: new ol.source.TileWMS({
                attributions:new ol.Attribution({
                  html: " - Transportes <a href='http://www.ign.es/web/ign/portal/cbg-area-cartografia' title='Redes de Transportes - Cartografía y Datos geográficos - IGN' target='_blank'> IGN</a>"
                }),                  
                url: 'http://servicios.idee.es/wms-inspire/transportes',
                params: {"LAYERS": "TN.RoadTransportNetwork.RoadLink", "TILED": "true"}
              })
        });

  infoComunicacion.set('keyname','infoComunicacion');
  infoComunicacion.set('group','Vector overlay');
  infoComunicacion.set("alias","Vías comunicación");
  infoComunicacion.set('queryable',true);
  infoComunicacion.set("useproxy",true);
  infoComunicacion.set("panel","OtherLayers");
  infoComunicacion.set("abstract","Red e Infraestructura del Transporte del Sistema Cartográfico Nacional. Capa con información asociada");
  overlayVectorList.push(infoComunicacion);

  var itemsAdminLayers = [];
  itemsAdminLayers.push("<div class=\"panel panel-info\" style=\"margin-left:0px;\">");
  itemsAdminLayers.push("<div class='panel-heading panel-heading-sm'><a id='btn-content-panel-AdminLayers' href='#content-panel-AdminLayers' data-toggle='collapse' class='collapsed'>" +
                        "<i class='fa fa-plus-square' aria-hidden='true'></i> Divisiones administrativas</a></div>");
  itemsAdminLayers.push("<div id='content-panel-AdminLayers' class=\"panel-body collapse\" style=\"margin:5px; padding:0px;\">");

  var itemsOtherLayers = [];
  itemsOtherLayers.push("<div class=\"panel panel-info\" style=\"margin-left:0px;\">");
  itemsOtherLayers.push("<div class='panel-heading panel-heading-sm'><a id='btn-content-panel-OtherLayers' href='#content-panel-OtherLayers' data-toggle='collapse' class='collapsed'>" +
                        "<i class='fa fa-plus-square' aria-hidden='true'></i> Otras capas</a></div>");
  itemsOtherLayers.push("<div id='content-panel-OtherLayers' class=\"panel-body collapse\" style=\"margin:5px; padding:0px;\">");



  var infoIcon="";
  for (var i = 0, len = overlayVectorList.length; i < len; i++) {
    if (overlayVectorList[i].getProperties()['queryable']==true){
      infoIcon = "<i class='fa fa-list-alt' aria-hidden='true'></i>";
    }else{
      infoIcon = "";
    }
    if(overlayVectorList[i].getProperties()['panel']=="AdminLayers"){
        itemsAdminLayers.push("<div class=\"col-md-6 col-sm-6 col-xs-12\" data-toggle=\"tooltip\" title=\"" + overlayVectorList[i].getProperties()['abstract'] + "\" style=\"margin-top:15px;\">" +
                            "<input  class=\"toolboxOverlayVector\" data-onstyle=\"success\" data-toggle=\"toggle\" data-width=\"160\" data-size=\"mini\" data-on=\"<img src='img/eye16.png'/> <small>" +
                             overlayVectorList[i].getProperties()['alias'] + " " + infoIcon +
                            "</small>\" data-off=\"" + overlayVectorList[i].getProperties()['alias'] + " " + infoIcon + "\" type=\"checkbox\" data-width=\"150\" data-size=\"mini\" id=\"sidebarBtn" + overlayVectorList[i].getProperties()['keyname'] + "\">" +
                            "</div>");
    }
    if(overlayVectorList[i].getProperties()['panel']=="OtherLayers"){
        itemsOtherLayers.push("<div class=\"col-md-6 col-sm-6 col-xs-12\" data-toggle=\"tooltip\" title=\"" + overlayVectorList[i].getProperties()['abstract'] + "\" style=\"margin-top:15px;\">" +
                            "<input class=\"toolboxOverlayVector\" data-onstyle=\"success\" data-toggle=\"toggle\"  data-width=\"160\" data-size=\"mini\" data-on=\"<img src='img/eye16.png'/> <small>" +
                            overlayVectorList[i].getProperties()['alias'] + " " + infoIcon +
                            "</small>\" data-off=\"" + overlayVectorList[i].getProperties()['alias'] + " " + infoIcon + "\" type=\"checkbox\" data-width=\"150\" data-size=\"mini\" id=\"sidebarBtn" + overlayVectorList[i].getProperties()['keyname'] + "\">" +
                            "</div>");
    }
  }
  itemsAdminLayers.push("</div></div>");
  itemsOtherLayers.push("</div></div>");

  //Metemos los compnentes del panel-AdminLayers 
  var containerOverlayVector = document.getElementById('panel-AdminLayers');
  containerOverlayVector.innerHTML = itemsAdminLayers.join('');

  //Metemos los compnentes del panel-AdminLayers 
  var containerOverlayVector = document.getElementById('panel-OtherLayers');
  containerOverlayVector.innerHTML = itemsOtherLayers.join('');  

  //Configuramos la función acordeón de panel-AdminLayers 
  $("#content-panel-AdminLayers").on("hide.bs.collapse", function(){
      $("#btn-content-panel-AdminLayers").html("<i class='fa fa-plus-square' aria-hidden='true'></i> Divisiones administrativas</a></div>");
  });
  $("#content-panel-AdminLayers").on("show.bs.collapse", function(){
      $("#btn-content-panel-AdminLayers").html("<i class='fa fa-minus-square' aria-hidden='true'></i> Divisiones administrativas</a></div>");
  });
  //Configuramos la función acordeón de panel-OtherLayers 
  $("#content-panel-OtherLayers").on("hide.bs.collapse", function(){
    $("#btn-content-panel-OtherLayers").html("<i class='fa fa-plus-square' aria-hidden='true'></i> Otras capas</a></div>");
  });
  $("#content-panel-OtherLayers").on("show.bs.collapse", function(){
      $("#btn-content-panel-OtherLayers").html("<i class='fa fa-minus-square' aria-hidden='true'></i> Otras capas</a></div>");
  });


  for (var i = 0, len = overlayVectorList.length; i < len; i++) {
    if(overlayVectorList[i].getProperties()['keyname']=="gridMTN50Can"){continue;}
    if(overlayVectorList[i].getProperties()['keyname']=="gridMTN25Can"){continue;}
    $('#sidebarBtn' + overlayVectorList[i].getProperties()['keyname']).bootstrapToggle();
    objMap.addLayer(overlayVectorList[i]);
    
  }
  $(".toolboxOverlayVector").change(function() {
          var id = $(this).prop('id');
          var value_id = $(this).prop('checked');
          var nomLayer = replaceAll(id,"sidebarBtn","");
          if (nomLayer=="gridMTN50Pen"){
            setLayerVisibleByKey(objMap,"gridMTN50Pen",value_id);
            setLayerVisibleByKey(objMap,"gridMTN50Can",value_id);
          }else if (nomLayer=="gridMTN25Pen"){
            setLayerVisibleByKey(objMap,"gridMTN25Pen",value_id);
            setLayerVisibleByKey(objMap,"gridMTN25Can",value_id);
          }else {
            setLayerVisibleByKey(objMap,nomLayer,value_id);
          }
          //alert(nomLayer);

  });


  setLayerZindex(objMap,"parcelaskm",5000);


}


//-------------------------------------- END CODE ----------------------------------------------------------------------//
