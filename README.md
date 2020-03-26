# Mapahisto
## Un comparador para el Archivo Topográfico :earth_africa: :earth_americas: :earth_asia:
## :bookmark_tabs: Contenido

* [Preparando un stack de desarrollo para un proyecto](#initstack)
* [Comenzar proyecto con Grunt](#proyect-grunt)
* [Documentación](#documentacion)


## 🚀 Empezando desde Github
Vamos a bajarnos el código de GitHub y prepararlo para ejecutar en la máquina de desarrollo. Para ello

* Lo primero es navegar a una carpeta donde queremos que se cree nuestro **working dir**.
* Ejecutamos el comando

```bash
git clone https://github.com/e2molin/athisto
```
* Vemos que se descarga el código nos crea una carpeta llamada *athisto*. Si nos metemos dentro veremos que hay varios ficheros y carpetas. Uno de ellos es un *package.json*, por lo que inmediatamente tenemos que pensar en ejecutar el administrador de paquetes de **NodeJS** para descargar los paquetes de desarrollo necesarios.
* 
```bash
npm install
```

* Veremos una carpeta llamada *node_modules*, donde se habrán descargado los paquetes para la máquina de desarrollo. Este directorio se encuentra dentro del *.gitignore*, porque su contenido no hay que incluirlo en el índice de nuestro sistema de versiones. Si estamos mal de espacio, podemos borrar su contenido, y solo tendremos que volver a hacer un **npm install**. También veremos un fichero *gruntfile.js*, lo que nos indica que el gestor de empaquetado que utiliza el proyecto es Grunt. Si no lo hemos utilizado antes, habrá que instalarlo globalmente en la máquina y así se puede usar para otros desarrollos. Lo instalamos así:

```bash
npm install grunt-cli -g  # Instala grunt en la máquina de manera global
```

* Podemos ver que todo funciona, realizando un empaquetado para distribución, con el comando

```bash
grunt default --force  # Ejecuta las tareas programadas
```

* Si todo va bien se creará una carpeta *dist* con el código para publicar. Podemos abrir un Servidor **Go Live** y ver el conteniso

## <a name="initstack"></a> 👨🏻‍💻👩🏻‍💻 Preparando un stack de desarrollo para un proyecto

### :baby_bottle: Primeros pasos

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

### 📝 Editor de código

Lo mejor es utilizar VSCode, con diferencia ahora uno de los mejores. Aunque en esto, los gustos son como los colores. Entre las extensiones de VSCode que sun útiles, hay varias: GitLens, MarkDown Emoji, :emojisense:, Live Server.....


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

### <a name="proyect-grunt"></a>:coffee: Configurando una herramienta de empaquetamiento. Comenzar proyecto con Grunt

#### Creamos fichero package.json
Previamente tenemos instalado node. Con el gestor de paquetes npm iniciamos nuestro proyecto.

``` bash
npm init: creamos el fichero package.json
```

#### Cómo usar **Grunt** como task manager
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



## <a name="documentacion"></a>:books: Documentación 

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


