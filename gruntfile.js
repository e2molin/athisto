/*
npm install grunt-cli -g									//Instala grunt de manera global en la máquina
npm install grunt --save-dev								//Añade grunt al fichero package.json del proyecto
npm install grunt-contrib-uglify --save-dev					//Instala el plugin uglify y lo añade al fichero package.json del proyecto
npm install grunt-contrib-copy --save-dev					//Instala el plugin copy y lo añade al fichero package.json del proyecto
npm install grunt-contrib-cssmin --save-dev					//Instala el plugin css minify y lo añade al fichero package.json del proyecto

Otros comandos
npm list --depth=0											//Comprueba los local package version instalados para ver si falta alguno
npm uninstall grunt-contrib-cssmin --save-dev				//Desinstalar un plugin


Documentación grunt
https://gruntjs.com/getting-started#an-example-gruntfile


Otros plugins de interés
http://www.beekeeperstudio.com/2016/11/how-to-watch-for-changes-to-your-files-with-grunt/			//Watching fileSize
http://www.beekeeperstudio.com/2016/11/how-to-setup-a-local-web-server-using-grunt/					//Local web server-using-grunt/
http://www.beekeeperstudio.com/2016/11/how-to-concatenate-multiple-css-into-one-file-with-grunt/	//Concatenar ficheros CSS

Documentación de grunt-contrib-copy
http://taswar.zeytinsoft.com/using-grunt-copying-files/
http://www.beekeeperstudio.com/2016/11/how-to-copy-files-to-another-folder-with-grunt/

Documentación de grunt-contrib-cssmin
http://www.beekeeperstudio.com/2016/11/how-to-minify-css-with-grunt/

*/

//Wrapper function
module.exports = function (grunt) {
  // Project configuration.
  grunt.initConfig({
	pkg: grunt.file.readJSON('package.json'),
    // uglify
    uglify: {
      options: {
        mangle: false,
        compress: {
          drop_console: true
        }
      },
      js: {
        files: [
			{
				cwd: 'src/js/',  // ruta de nuestro javascript fuente
				expand: true,    // ingresar a las subcarpetas
				src: ['*.js','!dvm-wmsUserComponent.js'],     // patrón relativo a cwd
				dest: 'dist/js/'  // destino de los archivos compresos
			}
		]
      }
    },
	cssmin: {
			target: {
				files: [{
					expand: true,
					cwd: 'src/css/',
					src: ['*.css', '!*.min.css'],
					dest: 'dist/css/',
					//ext: '.min.css'	//Si queremos que tengan extensión min. Comentando esto, mantienen la extensión
					}]
				}
	},
	copy: {
	  main: {
		files:[
			{
				//Ficheros imagen
				cwd: 'src/img/',  // set working folder / root to copy
				src: '**/*',           // copy all files and subfolders
				dest: 'dist/img/',    // destination folder
				expand: true           // required when using cwd
			},
			{
				//Assets javascript
				cwd: 'src/js/assets/',  // set working folder / root to copy
				src: '**/*',           // copy all files and subfolders
				dest: 'dist/js/assets/',    // destination folder
				expand: true           // required when using cwd
			},			
			{
				//Ficheros php
				cwd: 'src/php/',  // set working folder / root to copy
				src: '**/*',           // copy all files and subfolders
				dest: 'dist/php/',    // destination folder
				expand: true           // required when using cwd
			},
			{
				//Assets css
				cwd: 'src/css/assets/',  	// set working folder / root to copy
				src: '**/*',           		// copy all files and subfolders
				dest: 'dist/css/assets/',    // destination folder
				expand: true           		// required when using cwd
			},			
			{
				//Ficheros root
				cwd: 'src/',  // set working folder / root to copy
				src: ['index.html','*.json','*.php','*.geojson'],           // copy all files and subfolders
				dest: 'dist/',    // destination folder
				expand: true           // required when using cwd
			},
			{
				//Ficheros js no-uglify
				cwd: 'src/js/',  // set working folder / root to copy
				src: ['dvm-wmsUserComponent.js'],           // copy all files and subfolders
				dest: 'dist/js/',    // destination folder
				expand: true           // required when using cwd
			}				
		]
	  }
	}
 });

 // Ahora cargaremos el plugin que necesitamos usar:
 grunt.loadNpmTasks('grunt-contrib-uglify');
 grunt.loadNpmTasks('grunt-contrib-cssmin');
 grunt.loadNpmTasks('grunt-contrib-copy');

 // Luego registramos nuestra tarea:
 grunt.registerTask('default', ['uglify','cssmin','copy:main']);
 
 };