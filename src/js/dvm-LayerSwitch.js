

function add2UserTOC(container,aliasUserLyr,nameUserLyr){
    var nameUserLyrResumen= "";
    if (nameUserLyr.length>40){
        nameUserLyrResumen=nameUserLyr.substring(0, 40) + "...";
    }else{
        nameUserLyrResumen=nameUserLyr;
    }


    var newElement= "<li id=\"userLyr-" + aliasUserLyr + "\" class=\"panel panel-info lyrUser\">" +
        "<div style=\"background-color:#e9be7d;\" class=\"panel-heading lyrUserPH\"  data-toggle=\"tooltip\" title=\"\">" +
            "<h6 class=\"panel-title\">" +
                    "<i class=\"fa fa-user-circle\" style=\"margin-right:5px;\"></i>" +
                "<a style=\"font-size:0.8em; color:#000000;\" data-toggle=\"collapse\" data-target=\"#collapse-" + aliasUserLyr + "\" href=\"#collapse-" + aliasUserLyr + "\">"+ nameUserLyrResumen +"</a>" +
            "</h6>" +
        "</div>" +
        "<div id=\"collapse-" + aliasUserLyr + "\" class=\"panel-collapse collapse\">" +
            "<div class=\"panel-body lyrUserPB\">" +
                "Opacidad <input id=\"opac-" + aliasUserLyr + "\" data-slider-id=\"slider-" + aliasUserLyr + "\" type=\"text\" data-slider-tooltip=\"hide\" " +
                            "data-slider-min=\"0\" data-slider-max=\"100\" data-slider-step=\"1\" data-slider-value=\"100\"   style=\"width:180px;\" />" +
                "<span class=\"fa-stack pull-right\" id=\"closeUserLyr" + aliasUserLyr + "\" data-toggle=\"tooltip\" title=\"Cerrar capa\">" +
                "<i class=\"fa fa-circle fa-stack-2x text-danger\"></i><i class=\"fa fa-times fa-stack-1x fa-inverse\"></i></span>" +
                "<span class=\"fa-stack pull-right\" id=\"zoomExtenLyr" + aliasUserLyr + "\" data-toggle=\"tooltip\" title=\"Zoom a la capa\">" +
                "<i class=\"fa fa-circle fa-stack-2x text-info\"></i><i class=\"fa fa-home fa-stack-1x fa-inverse\"></i></span>" +
                "<span style=\"display:none;\" class=\"fa-stack pull-right\" id=\"showUserLyr" + aliasUserLyr + "\" data-toggle=\"tooltip\" title=\"Mostrar capa\">" +
                "<i class=\"fa fa-circle fa-stack-2x \"></i><i class=\"fa fa-eye fa-stack-1x fa-inverse\"></i></span>" +
                "<span class=\"fa-stack pull-right\"id=\"hideUserLyr" + aliasUserLyr + "\" data-toggle=\"tooltip\" title=\"Ocultar capa\">" +
                "<i class=\"fa fa-circle fa-stack-2x\"></i><i class=\"fa fa-eye fa-stack-1x fa-inverse\"></i><i class=\"fa fa-ban fa-stack-2x text-danger\"></i></span>" +
                "<p><small><em>" + nameUserLyr + "</em></small></p>" +
            "</div>" +
        "</div>" +
      "</li>";
    $("#" + container).prepend(newElement);

    var userLyrOpac1 = new Slider('#opac-' + aliasUserLyr, {
	   formatter: function(value) {
		      //return 'Opacidad: ' + value + "%";
       }
    });

    $("#opac-" + aliasUserLyr).on("slide slideStop", function(slideEvt) {
        setOpacityWMSUsuario(objMap,"Capas WMS de usuario",aliasUserLyr,slideEvt.value);
    });


    //Cerra la capa
    $("#closeUserLyr" + aliasUserLyr).click(function(){
        console.log("1");
        //alert("Borro: " + aliasUserLyr);
        borrarLayerWMSUsuario(objMap,"Capas WMS de usuario",aliasUserLyr);
        $("#userLyr-" + aliasUserLyr).remove();
    });
    //Apagar capa
    $("#hideUserLyr" + aliasUserLyr).click(function(){
      console.log("2");
        $(this).hide();
        $("#showUserLyr" + aliasUserLyr).show();
        setLayerVisibleByKeyGroup(objMap,aliasUserLyr,0);
    });
    //Encender
    $("#showUserLyr" + aliasUserLyr).click(function(){
      console.log("3");
        $(this).hide();
        $("#hideUserLyr" + aliasUserLyr).show();
        setLayerVisibleByKeyGroup(objMap,aliasUserLyr,1);
    });
    //Zoom a la capa
    $("#zoomExtenLyr" + aliasUserLyr).click(function(){
        console.log("4");
        setZoomToLayerByKey(objMap,aliasUserLyr);
    });

    //$('[data-toggle="tooltip"]').tooltip();


}

//Lo descomento mientras no funciona
jQuery(function($) {
        var panelList = $('#panel-layers-User');
        panelList.sortable({
            handle: '.lyrUserPH',//Elemento sobre el que se permite el dragging
            update: function() {
                $('.panel-info', panelList).each(function(index, elem) {
                     var $listItem = $(elem),
                            newIndex = $listItem.index();
                            console.log("Se ha movido:" + $(elem).attr('id'));
                            console.log("Orden:");
                            $('#panel-layers-User').children('li').each(function () {
                                console.log($(this).attr('id'));
                            });


                });
            }
        });
});
