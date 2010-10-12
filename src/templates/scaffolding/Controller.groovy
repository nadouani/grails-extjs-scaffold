<%=packageName ? "package ${packageName}\n\n" : ''%>

import fr.nadouani.extjsscaffold.dto.ExtJsJSONResponse;
import grails.converters.JSON

class ${className}Controller {

    static allowedMethods = [save: "POST", update: "POST", delete: "POST"]

    def index = {
        
    }

	def create = {
		def ${propertyName} = new ${className}()
		${propertyName}.properties = params
		return [${propertyName}: ${propertyName}]
	}

    def list = {		
		params.max = Math.min(params.limit ? params.int('limit') : 10, 100)
		params.offset = params.start ? params.int('start') : 0
		params.order = params.dir ? params.dir.toLowerCase() : ""
		
		def ${propertyName}List = ${className}.list(params)
		
		def dataToRender = ['data' : ${className}.list(params), 'totalCount' : ${className}.count() ]

		JSON.use("dcmWithToString") {
			render dataToRender as JSON
		}
    }
	
	def save = {
		def ${propertyName} = new ${className}(params)
		if (${propertyName}.save(flush: true)) {
			def successMsg = "\${message(code: 'default.created.message', args: [message(code: '${domainClass.propertyName}.label', default: '${className}'), ${propertyName}.id])}"
			
			JSON.use("dcmWithToString") {
				def converter = new JSON(success: true, successMsg:successMsg, data: ${propertyName})
				render(contentType:"application/json", text:converter.toString())				
			}
		}
		else {
			def errors = ""			
			${propertyName}.errors.allErrors.each {
				errors += "'\${it.getField()}': '\${message(error: it)}',"
			}
			errors = "{" + errors.substring(0, errors.length()-1) + "}"
			
			render(contentType:"application/json", text:"{'success': false, 'errorMsg': 'Validation Error', 'errors' : \${errors}}")
		}
	}
	
	def update = {
		def ${propertyName} = ${className}.get(params.id)
		if (${propertyName}) {
			if (params.version) {
				def version = params.version.toLong()
				if (${propertyName}.version > version) {
					render(contentType:"application/json", text:"{'success': false, 'errorMsg': 'Another user has updated this ${className} while you were editing'}")
					return
				}
			}
			
			${propertyName}.properties = params
			if (!${propertyName}.hasErrors() && ${propertyName}.save(flush: true)) {
				def successMsg = "\${message(code: 'default.updated.message', args: [message(code: '${domainClass.propertyName}.label', default: '${className}'), ${propertyName}.id])}"
				
				JSON.use("dcmWithToString") {
					def converter = new JSON(success: true, successMsg:successMsg, data: ${propertyName})
					render(contentType:"application/json", text:converter.toString())					
				}
			}
			else {
				def errors = ""			
				${propertyName}.errors.allErrors.each {
					errors += "'\${it.getField()}': '\${message(error: it)}',"
				}
				errors = "{" + errors.substring(0, errors.length()-1) + "}"
				
				render(contentType:"application/json", text:"{'success': false, 'errorMsg': 'Validation Error', 'errors' : \${errors}}")
			}
		}
		else {
			def errorMsg = "\${message(code: 'default.not.found.message', args: [message(code: '${domainClass.propertyName}.label', default: '${className}'), params.id])}"
			render(contentType:"application/json", text:"{'success': false, 'errorMsg': '\${errorMsg}'}")
		}
	}	
	
	def edit = {
		def ${propertyName} = ${className}.get(params.id)
		if (!${propertyName}) {
			def errorMsg = "\${message(code: 'default.not.found.message', args: [message(code: '${domainClass.propertyName}.label', default: '${className}'), params.id])}"
			render(contentType:"application/json", text:"{'success': false, 'errorMsg': '\${errorMsg}'}")
		}
		else {
			JSON.use("dcmWithToString") {
				render new ExtJsJSONResponse(true, ${propertyName}) as JSON
			}
		}
	}
	
	def delete = {
		def ${propertyName} = ${className}.get(params.data)
		if (${propertyName}) {
			try {
				${propertyName}.delete(flush: true)
				def successMsg = "\${message(code: 'default.deleted.message', args: [message(code: '${domainClass.propertyName}.label', default: '${className}'), params.data])}"
				render(contentType:"application/json", text:"{'success': true, 'message': '\${successMsg}'}")
			}
			catch (org.springframework.dao.DataIntegrityViolationException e) {
				def errorMsg = "\${message(code: 'default.not.deleted.message', args: [message(code: '${domainClass.propertyName}.label', default: '${className}'), params.data])}"
				render(contentType:"application/json", text:"{'success': false, 'message': '\${errorMsg}'}")
			}
		}
		else {
			def errorMsg = "\${message(code: 'default.not.found.message', args: [message(code: '${domainClass.propertyName}.label', default: '${className}'), params.data])}"
			render(contentType:"application/json", text:"{'success': false, 'message': '\${errorMsg}'}")
		}
	}
}
