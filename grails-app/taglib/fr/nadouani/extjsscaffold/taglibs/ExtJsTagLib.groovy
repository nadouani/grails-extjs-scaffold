package fr.nadouani.extjsscaffold.taglibs

class ExtJsTagLib {
	static namespace = "extjsUtils"
	
	def array = { attrs, body ->
		if(attrs.data){
			out << "["
			attrs.data.each{
				out << "\"$it\", "
			}
			out << "]"
		} else{
			out << "[]"
		}
	}
}
