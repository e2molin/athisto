!function(root,factory){"function"==typeof define&&define.amd?define(["openlayers"],factory):"object"==typeof module&&module.exports?module.exports=factory(require("openlayers")):root.LayerSwitcher=factory(root.ol)}(this,function(ol){return ol.control.LayerSwitcher=function(opt_options){var options=opt_options||{},tipLabel=options.tipLabel?options.tipLabel:"Legend";this.mapListeners=[],this.hiddenClassName="ol-unselectable ol-control layer-switcher",ol.control.LayerSwitcher.isTouchDevice_()&&(this.hiddenClassName+=" touch"),this.shownClassName="shown";var element=document.createElement("div");element.className=this.hiddenClassName;var button=document.createElement("button");button.setAttribute("title",tipLabel),element.appendChild(button),this.panel=document.createElement("div"),this.panel.className="panel",element.appendChild(this.panel),ol.control.LayerSwitcher.enableTouchScroll_(this.panel);var this_=this;button.onmouseover=function(e){this_.showPanel()},button.onclick=function(e){e=e||window.event,this_.showPanel(),e.preventDefault()},this_.panel.onmouseout=function(e){e=e||window.event,this_.panel.contains(e.toElement||e.relatedTarget)||this_.hidePanel()},ol.control.Control.call(this,{element:element,target:options.target})},ol.inherits(ol.control.LayerSwitcher,ol.control.Control),ol.control.LayerSwitcher.prototype.showPanel=function(){this.element.classList.contains(this.shownClassName)||(this.element.classList.add(this.shownClassName),this.renderPanel())},ol.control.LayerSwitcher.prototype.hidePanel=function(){this.element.classList.contains(this.shownClassName)&&this.element.classList.remove(this.shownClassName)},ol.control.LayerSwitcher.prototype.renderPanel=function(){for(this.ensureTopVisibleBaseLayerShown_();this.panel.firstChild;)this.panel.removeChild(this.panel.firstChild);var ul=document.createElement("ul");this.panel.appendChild(ul),this.renderLayers_(this.getMap(),ul)},ol.control.LayerSwitcher.prototype.setMap=function(map){for(var i=0;i<this.mapListeners.length;i++)ol.Observable.unByKey(this.mapListeners[i]);if(this.mapListeners.length=0,ol.control.Control.prototype.setMap.call(this,map),map){var this_=this;this.mapListeners.push(map.on("pointerdown",function(){this_.hidePanel()})),this.renderPanel()}},ol.control.LayerSwitcher.prototype.ensureTopVisibleBaseLayerShown_=function(){var lastVisibleBaseLyr;ol.control.LayerSwitcher.forEachRecursive(this.getMap(),function(l,idx,a){"base"===l.get("type")&&l.getVisible()&&(lastVisibleBaseLyr=l)}),lastVisibleBaseLyr&&this.setVisible_(lastVisibleBaseLyr,!0)},ol.control.LayerSwitcher.prototype.setVisible_=function(lyr,visible){var map=this.getMap();lyr.setVisible(visible),visible&&"base"===lyr.get("type")&&ol.control.LayerSwitcher.forEachRecursive(map,function(l,idx,a){l!=lyr&&"base"===l.get("type")&&l.setVisible(!1)})},ol.control.LayerSwitcher.prototype.renderLayer_=function(lyr,idx){var this_=this,li=document.createElement("li"),lyrTitle=lyr.get("title"),lyrId=ol.control.LayerSwitcher.uuid(),label=document.createElement("label");if(lyr.getLayers&&!lyr.get("combine")){li.className="group",label.innerHTML=lyrTitle,li.appendChild(label);var ul=document.createElement("ul");li.appendChild(ul),this.renderLayers_(lyr,ul)}else{li.className="layer";var input=document.createElement("input");"base"===lyr.get("type")?(input.type="radio",input.name="base"):input.type="checkbox",input.id=lyrId,input.checked=lyr.get("visible"),input.onchange=function(e){this_.setVisible_(lyr,e.target.checked)},li.appendChild(input),label.htmlFor=lyrId,label.innerHTML=lyrTitle;var rsl=this.getMap().getView().getResolution();(rsl>lyr.getMaxResolution()||rsl<lyr.getMinResolution())&&(label.className+=" disabled"),li.appendChild(label)}return li},ol.control.LayerSwitcher.prototype.renderLayers_=function(lyr,elm){for(var l,lyrs=lyr.getLayers().getArray().slice().reverse(),i=0;i<lyrs.length;i++)(l=lyrs[i]).get("title")&&elm.appendChild(this.renderLayer_(l,i))},ol.control.LayerSwitcher.forEachRecursive=function(lyr,fn){lyr.getLayers().forEach(function(lyr,idx,a){fn(lyr,idx,a),lyr.getLayers&&ol.control.LayerSwitcher.forEachRecursive(lyr,fn)})},ol.control.LayerSwitcher.uuid=function(){return"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,function(c){var r=16*Math.random()|0;return("x"==c?r:3&r|8).toString(16)})},ol.control.LayerSwitcher.enableTouchScroll_=function(elm){if(ol.control.LayerSwitcher.isTouchDevice_()){var scrollStartPos=0;elm.addEventListener("touchstart",function(event){scrollStartPos=this.scrollTop+event.touches[0].pageY},!1),elm.addEventListener("touchmove",function(event){this.scrollTop=scrollStartPos-event.touches[0].pageY},!1)}},ol.control.LayerSwitcher.isTouchDevice_=function(){try{return document.createEvent("TouchEvent"),!0}catch(e){return!1}},ol.control.LayerSwitcher});