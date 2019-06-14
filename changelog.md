# Changelog
Fichero para documentar los cambios notables en el desarrollo

El formato de este documento está basado en [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), y utiliza [Semantic Versioning](https://semver.org/spec/v2.0.0.html). Además usa la nomenclatura de iconos [GIT emoji](https://gitmoji.carloscuesta.me/).

## Novedades futuras



##  :checkered_flag: [1.0.1] - 2019-06-14
### :bulb: Nuevo
* Nuevo grupo de capas con los datos LiDAR, el MDT y el SIOSE. 
* Al evento pinchazo se responde indicando la altura sobre el MDT, el tipo de terreno según SIOSE y si estamos sobre un edificio, su altura en metros.

### :wrench: Cambios y correcciones.
* :bug: Utiliza servicios **http** para el la consulta de servicios de mapa.
  * :wrench: Servicios de mapas cambiados al protocolo **https**.
* :bug: Utiliza servicios **http** para el IGNSearch.
  * :wrench: Servicios remotos cambiados al protocolo **https**.

### :see_no_evil: Eliminado
* Nada relevante

##  :checkered_flag: [1.0.0] - 2018-10-08 :tada:
* Primera versión liberada.

