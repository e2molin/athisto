# Changelog
Fichero para documentar los cambios notables en el desarrollo

El formato de este documento está basado en [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), y utiliza [Semantic Versioning](https://semver.org/spec/v2.0.0.html). Además usa la nomenclatura de iconos [GIT emoji](https://gitmoji.carloscuesta.me/).

## Novedades futuras

Nada previsto por ahora

##  🏁 [1.2.0] - 2020-01-24
### 💡 Nuevo
#### Mejora en la detección del pinchazo sobre una línea límite
La tolerancia del _GetFeatureInfo_ no se configura en el visualizador. El visualizador  manda exactamente la coordenada donde se pincha, porque la llamada _GetFeatureInfo_ no permite más parámetros. Es a nivel de servidor (Mapserver o Geoserver), donde este pinchazo se interpreta asignándole una tolerancia en forma de buffer. Mientras Mapserver parece que permite configurar esto, Geoserver  lo tiene capado a __3 píxeles__ por el grosor de la línea del estilo. 

Hay un hilo abierto desde 2013 sobre este tema [aquí](http://osgeo-org.1560.x6.nabble.com/GetFeatureInfo-Buffer-tolerance-default-td5071320.html) pero no sé si en las versiones recientes esto ya se contempla.

Respecto a usar el estilo INSPIRE como dice Gloria, el problema es que pinta siempre todas líneas municipales en color rojo, por lo que a zooms alejados se ve un mapa chuchurrío lleno de líneas rojas y gordas, un desastre. Lo que se me ha ocurrido es seguir pintando las líneas límite como hasta ahora, con trazo finito, porque queda más elegante. Lo que cambio es que al componer la llamada GetFeatureInfo al servicio, modifico por detrás los parámetros y utilizo el estilo horroroso INSPIRE; con el grosor de 2-3 píxeles multiplicado por los 3 por defecto, nos da un margen de 9 píxeles. He estado haciendo pruebas y he conseguido atinar a líneas a zoom 11, y creo que el comportamiento es mucho mejor. Ya me dirás cómo lo ves. Puedes probarlo aquí hasta que lo saquen a producción.Respecto a usar el estilo INSPIRE como dice Gloria, el problema es que pinta siempre todas líneas municipales en color rojo, por lo que a zooms alejados se ve un mapa chuchurrío lleno de líneas rojas y gordas, un desastre. Lo que se me ha ocurrido es seguir pintando las líneas límite como hasta ahora, con trazo finito, porque queda más elegante. Lo que cambio es que al componer la llamada GetFeatureInfo al servicio, modifico por detrás los parámetros y utilizo el estilo horroroso INSPIRE; con el grosor de 2-3 píxeles multiplicado por los 3 por defecto, nos da un margen de __9 píxeles__. He estado haciendo pruebas y he conseguido atinar a líneas a zoom 11, y creo que el comportamiento es mucho mejor.


##  🏁 [1.1.1] - 2020-01-07
### 🔧 Cambios y correcciones.
* 🐛 No funciona el acceso a la hoja registral.
  * 🔧 Corregido.

##  🏁 [1.1.0] - 2019-06-14
### 💡 Nuevo
* Nuevo grupo de capas con los datos LiDAR, el MDT y el SIOSE. 
* Al evento pinchazo se responde indicando la altura sobre el MDT, el tipo de terreno según SIOSE y si estamos sobre un edificio, su altura en metros.
* Enlace al Pinterest de IGN.

### 🔧 Cambios y correcciones.
* 🐛 Utiliza servicios **http** para el la consulta de servicios de mapa.
  * 🔧 Servicios de mapas cambiados al protocolo **https**.
* 🐛 Utiliza servicios **http** para el IGNSearch.
  * 🔧 Servicios remotos cambiados al protocolo **https**.

### 🙈 Eliminado
* Nada relevante

##  🏁 [1.0.0] - 2018-10-08 :tada:
* Primera versión liberada.

