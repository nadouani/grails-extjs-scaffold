import fr.nadouani.extjsscaffold.marshallers.DomainClassMarshallerWithToString
import grails.converters.JSON
import org.codehaus.groovy.grails.web.converters.configuration.ConvertersConfigurationHolder
import org.codehaus.groovy.grails.web.converters.configuration.DefaultConverterConfiguration

class ExtjsScaffoldGrailsPlugin {
    // the plugin version
    def version = "0.2-SNAPSHOT"
    // the version or versions of Grails the plugin is designed for
    def grailsVersion = "1.2.1 > *"
    // the other plugins this plugin depends on
    def dependsOn = [:]
    // resources that are excluded from plugin packaging
    def pluginExcludes = [
            "grails-app/views/error.gsp"
    ]

    // TODO Fill in these fields
    def author = "Nabil ADOUANI"
    def authorEmail = "nabil.adouani@gmail.com"
    def title = "ExtJS based views scaffolding"
    def description = '''\\
This plugin allows user to scaffold ExtJS GUI instead of standard scaffolded views.
'''

    // URL to the plugin's documentation
    def documentation = "http://grails.org/plugin/extjs-scaffolding"

    def doWithWebDescriptor = { xml ->
        // TODO Implement additions to web.xml (optional), this event occurs before 
    }

    def doWithSpring = {
        // TODO Implement runtime spring config (optional)
    }

    def doWithDynamicMethods = { ctx ->
        // TODO Implement registering dynamic methods to classes (optional)
    }

    def doWithApplicationContext = { applicationContext ->
        // TODO Implement post initialization spring config (optional)
		DefaultConverterConfiguration<JSON> configDCMWithToString = new DefaultConverterConfiguration<JSON>(ConvertersConfigurationHolder.getConverterConfiguration(JSON.class));
		configDCMWithToString.registerObjectMarshaller(new DomainClassMarshallerWithToString(false), 100);
		ConvertersConfigurationHolder.setNamedConverterConfiguration(JSON.class, "dcmWithToString", configDCMWithToString);
    }

    def onChange = { event ->
        // TODO Implement code that is executed when any artefact that this plugin is
        // watching is modified and reloaded. The event contains: event.source,
        // event.application, event.manager, event.ctx, and event.plugin.
    }

    def onConfigChange = { event ->
        // TODO Implement code that is executed when the project configuration changes.
        // The event is the same as for 'onChange'.
    }
}
