package fr.nadouani.extjsscaffold.converters;

import java.util.ArrayList;
import java.util.List;

import org.codehaus.groovy.grails.web.converters.Converter;
import org.codehaus.groovy.grails.web.converters.configuration.ChainedConverterConfiguration;
import org.codehaus.groovy.grails.web.converters.configuration.ConverterConfiguration;
import org.codehaus.groovy.grails.web.converters.configuration.ConvertersConfigurationHolder;
import org.codehaus.groovy.grails.web.converters.configuration.DefaultConverterConfiguration;
import org.codehaus.groovy.grails.web.converters.marshaller.ObjectMarshaller;
import org.codehaus.groovy.grails.web.converters.marshaller.json.ArrayMarshaller;
import org.codehaus.groovy.grails.web.converters.marshaller.json.ByteArrayMarshaller;
import org.codehaus.groovy.grails.web.converters.marshaller.json.CollectionMarshaller;
import org.codehaus.groovy.grails.web.converters.marshaller.json.DateMarshaller;
import org.codehaus.groovy.grails.web.converters.marshaller.json.EnumMarshaller;
import org.codehaus.groovy.grails.web.converters.marshaller.json.GenericJavaBeanMarshaller;
import org.codehaus.groovy.grails.web.converters.marshaller.json.GroovyBeanMarshaller;
import org.codehaus.groovy.grails.web.converters.marshaller.json.MapMarshaller;
import org.codehaus.groovy.grails.web.converters.marshaller.json.ToStringBeanMarshaller;

import fr.nadouani.extjsscaffold.marshallers.DomainClassMarshallerWithToString;

public class JSON extends grails.converters.JSON {
	
	public JSON() {
		super();
    }
    public JSON(Object target) {
        super(target);
    }

	@Override
	protected ConverterConfiguration<grails.converters.JSON> initConfig() {
		ConverterConfiguration config = super.initConfig();
		if (config.getOrderedObjectMarshallers().size() == 0) {
			initDefaultMarshallers();
			config = super.initConfig();
		}
		return config;
	}

	private void initDefaultMarshallers(){
	    List<ObjectMarshaller<grails.converters.JSON>> marshallers = new ArrayList<ObjectMarshaller<grails.converters.JSON>>();
	    marshallers.add(new ArrayMarshaller());
	    marshallers.add(new ByteArrayMarshaller());
	    marshallers.add(new CollectionMarshaller());
	    marshallers.add(new MapMarshaller());
	    marshallers.add(new EnumMarshaller());
	    marshallers.add(new org.codehaus.groovy.grails.web.converters.marshaller.ProxyUnwrappingMarshaller<grails.converters.JSON>());
	    marshallers.add(new DateMarshaller());
	    marshallers.add(new ToStringBeanMarshaller());
	    
	    // register custom JSON DomainClassMarshaller
	    marshallers.add(new DomainClassMarshallerWithToString(false));
	    marshallers.add(new GroovyBeanMarshaller());
	    marshallers.add(new GenericJavaBeanMarshaller());

	    DefaultConverterConfiguration<grails.converters.JSON> cfg = new DefaultConverterConfiguration<grails.converters.JSON>(marshallers);
	    cfg.setEncoding("UTF-8");
	    cfg.setCircularReferenceBehaviour(Converter.CircularReferenceBehaviour.DEFAULT);
	    cfg.setPrettyPrint(false);
	    ConvertersConfigurationHolder.setDefaultConfiguration(grails.converters.JSON.class, new ChainedConverterConfiguration<grails.converters.JSON>(cfg));
	  }

}
