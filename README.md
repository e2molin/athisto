# Mapahisto
## Un comparador para el Archivo Topográfico :earth_africa: :earth_americas: :earth_asia:
## :bookmark_tabs: Contenido

* [Primeros pasos](#general-info)
* [Comenzar proyecto con Grunt](#proyect-grunt)
* [Documentación](#documentacion)


## :baby_bottle: Primeros pasos

``` bash
#Comandos para inicializar el repositorio
git init

#Añadir un fichero al stage
git add README.md

#Añadir todos los ficheros al stage. Hacer con cuidado para no subir cosas innecesarias. Mejor comprobar antes con un git status
git add.

#Hacer un commit al repositorio local con mensaje
git commit -m "first commit"

#Configurar el repositorio de GitHub en nuestro repositorio local (origin)
git remote add origin https://github.com/e2molin/athisto.git

#Subir nuestro repositorio local (origin) al GitHub, en este caso la rama (branch) master
git push -u origin master
```

### Relación con **GitLens** de VSCode

Cuando instalamos **VsCode**, encontraremos herramientas para hacernos más fácil el manejo con **GIT**. Como estoy más acostumbrado a trabajar en inglés que en español, y estas herramientas viene castellanizadas, aquí apunto las equivalencias de las que voy usando.

``` bash
#Almacenar todos los cambios
git add .

#Confirmar todo
git commit -m "first commit"

#Publicar rama
git push -u origin master
```

## :coffee: Comenzar proyecto con Grunt

### Creamos fichero package.json
Previamente tenemos instalado node. Con el gestor de paquetes npm iniciamos nuestro proyecto.

``` bash
npm init: creamos el fichero package.json
```

### Cómo usar **Grunt** como task manager
Usaremos GRUNT como task runner. para eso tenemos que instalarlo, primero en la máquina, si no lo hemos usado nunca, y después en el _working directory_.

``` bash
npm install grunt-cli -g  # Instala grunt en la máquina de manera global
npm install grunt --save-dev  # Instala grunt en el directorio de trabajo y lo añade a package.json
npm install grunt-contrib-uglify --save-dev  # Instala plugin uglify y lo añade a package.json
npm install grunt-contrib-cssmin --save-dev  # Instala plugin uglify y lo añade a package.json
npm install grunt-contrib-copy --save-dev  # Instala plugin para copiar ficheros y lo añade a package.json

# Otros comandos que pueden ser útiles
npm list --depth=0  # Comprueba los local package instalados para ver si falta alguno
npm uninstall grunt-contrib-cssmin --save-dev	 # Desinstalar un plugin determinado
```

Después configuramos el fichero _gruntfile.js_ con la programación de las tareas. Una vez terminado, lo ejecutamos así:

``` bash
grunt default --force  # Ejecuta las tareas programadas
```

## :books: Documentación 

### Enlaces de interés con GitHub

* [Guía ultrarrápida de Git](https://medium.com/@sthefany/primeros-pasos-con-github-7d5e0769158c)
* [Listado de comandos Git](https://www.hostinger.es/tutoriales/comandos-de-git)
* [Emojis en GitHub](https://github.com/ikatyang/emoji-cheat-sheet/blob/master/README.md)


### Enlaces de interes para trabajar con _Grunt_.

Otros plugins de interés

* [Watching fileSize](http://www.beekeeperstudio.com/2016/11/how-to-watch-for-changes-to-your-files-with-grunt/)
* [Local web server-using-grunt](http://www.beekeeperstudio.com/2016/11/how-to-concatenate-multiple-css-into-one-file-with-grunt/)
* Documentación de grunt-contrib-copy [Enlace 1](http://taswar.zeytinsoft.com/using-grunt-copying-files/) [Enlace 2](http://www.beekeeperstudio.com/2016/11/how-to-copy-files-to-another-folder-with-grunt/)
* [Documentación de grunt-contrib-cssmin](http://www.beekeeperstudio.com/2016/11/how-to-minify-css-with-grunt/)


