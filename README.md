# Mapahisto
## Un comparador para el AT

### Primeros pasos

``` bash
#Comandos para inicializar el repositorio
git init
git add README.md
git commit -m "first commit"
git remote add origin https://github.com/e2molin/athisto.git
git push -u origin master
```

#### Relación con GitLens de VSCode
``` bash
#Almacenar todos los cambios
git add .

#Confirmar todo
git commit -m "first commit"
```


# Creamos fichero package.json
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

#### Enlaces de interes para trabajar con _Grunt_.

Otros plugins de interés

* [Watching fileSize](http://www.beekeeperstudio.com/2016/11/how-to-watch-for-changes-to-your-files-with-grunt/)
* [Local web server-using-grunt](http://www.beekeeperstudio.com/2016/11/how-to-concatenate-multiple-css-into-one-file-with-grunt/)
* Documentación de grunt-contrib-copy [Enlace 1](http://taswar.zeytinsoft.com/using-grunt-copying-files/) [Enlace 2](http://www.beekeeperstudio.com/2016/11/how-to-copy-files-to-another-folder-with-grunt/)
* [Documentación de grunt-contrib-cssmin](http://www.beekeeperstudio.com/2016/11/how-to-minify-css-with-grunt/)


