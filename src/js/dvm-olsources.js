var spotBaselyr;
var spotOverlaylyr;


overlayPNOAGroup=new ol.layer.Group({'title': 'Vuelos PNOA'});
overlayPNOAGroup.setLayers(new ol.Collection(overlayPNOAList));
