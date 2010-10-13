/**
* Gant script that copy extjs scaffolding templates to the project src/template folder
*
* @author Nabil Adouani
*
*
*/

includeTargets << grailsScript("_GrailsInit")

target ('default': "Installs the extjs scaffolding templates") {
    depends(checkVersion, parseArguments)

    viewsDir = "${basedir}/grails-app/views"
    targetDir = "${basedir}/src/templates/scaffolding"
	cssDir = "${basedir}/web-app/css"
	jsDir = "${basedir}/web-app/js/extjs"
	imagesDir = "${basedir}/web-app/images"
    overwriteTemplates = false
    overwriteStyles = false
    overwriteJS = false
    overwriteImages = false

    // only if template dir already exists in, ask to overwrite templates
    if (new File(targetDir).exists()) {
        if (!isInteractive || confirmInput("Overwrite existing templates? [y/n]","overwrite.templates"))
			overwriteTemplates = true
    }
    else {
        ant.mkdir(dir: targetDir)
    }		

    ant.copy(todir: targetDir, overwrite: overwriteTemplates) {
        fileset(dir: "${extjsScaffoldPluginDir}/src/templates/scaffolding", includes: "*")
    }
	
	// Copy the layout css
	if (new File(cssDir).exists()) {
		if (!isInteractive || confirmInput("Overwrite existing css styles? [y/n]","overwrite.templates"))
			overwriteStyles = true
	}
	else {
		ant.mkdir(dir: cssDir)
	}
	
	ant.copy(todir: cssDir, overwrite: overwriteStyles) {
		fileset(dir: "${extjsScaffoldPluginDir}/web-app/css", includes: "*")
	}
	
	// Copy the ExtJS library
	if (new File(jsDir).exists()) {
		if (!isInteractive || confirmInput("Overwrite existing extjs library? [y/n]","overwrite.templates"))
			overwriteJS = true
	}
	else {
		ant.mkdir(dir: jsDir)
	}
	ant.copy(todir: jsDir, overwrite: overwriteJS) {
		fileset(dir: "${extjsScaffoldPluginDir}/web-app/js/extjs", includes: "**/*")
	}
	
	// Copy the images
	if (new File(imagesDir).exists()) {
		if (!isInteractive || confirmInput("Overwrite existing images? [y/n]","overwrite.templates"))
			overwriteImages = true
	}
	else {
		ant.mkdir(dir: imagesDir)
	}
	ant.copy(todir: imagesDir, overwrite: overwriteImages) {
		fileset(dir: "${extjsScaffoldPluginDir}/web-app/images", includes: "**/*")
	}
	
	// Copy the index page
	ant.copy(toDir: viewsDir, overwrite: true){
		fileset(dir: "${extjsScaffoldPluginDir}/grails-app/views", includes: "index.gsp")
	}

    event("StatusUpdate", [ "extjs Templates installed successfully"])
}



