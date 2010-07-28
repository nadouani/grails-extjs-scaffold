package fr.nadouani.extjsscaffold.marshallers;

import grails.converters.JSON;

import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;
import java.util.SortedMap;
import java.util.SortedSet;
import java.util.TreeMap;
import java.util.TreeSet;

import org.codehaus.groovy.grails.commons.GrailsClassUtils;
import org.codehaus.groovy.grails.commons.GrailsDomainClass;
import org.codehaus.groovy.grails.commons.GrailsDomainClassProperty;
import org.codehaus.groovy.grails.web.converters.ConverterUtil;
import org.codehaus.groovy.grails.web.converters.exceptions.ConverterException;
import org.codehaus.groovy.grails.web.converters.marshaller.json.DomainClassMarshaller;
import org.codehaus.groovy.grails.web.json.JSONWriter;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.BeanWrapper;
import org.springframework.beans.BeanWrapperImpl;

public class DomainClassMarshallerWithToString extends DomainClassMarshaller {
	
	private boolean includeVersion = false;

	public DomainClassMarshallerWithToString(boolean includeVersion) {
		super(includeVersion);
		this.includeVersion = includeVersion;
	}
	
	public void marshalObject(Object value, JSON json) throws ConverterException {
        JSONWriter writer = json.getWriter();
        //value = proxyHandler.unwrapIfProxy(value);
        Class clazz = value.getClass();
        GrailsDomainClass domainClass = ConverterUtil.getDomainClass(clazz.getName());
        BeanWrapper beanWrapper = new BeanWrapperImpl(value);

        writer.object();
        writer.key("toString").value(value.toString());

        GrailsDomainClassProperty id = domainClass.getIdentifier();
        Object idValue = extractValue(value, id);

        json.property("id", idValue);

        if(isIncludeVersion()) {
            GrailsDomainClassProperty versionProperty = domainClass.getVersion();
            Object version = extractValue(value, versionProperty);
            json.property("version", version);
        }

        GrailsDomainClassProperty[] properties = domainClass.getPersistentProperties();

        for (GrailsDomainClassProperty property : properties) {
            writer.key(property.getName());
            if (!property.isAssociation()) {
            	
            	Object val = beanWrapper.getPropertyValue(property.getName());

            	// Write enum typed property
            	if (property.isEnum()) {
            		Class enumClass = val.getClass();
                    Method nameMethod = BeanUtils.findDeclaredMethod(enumClass, "name", null);
                    try {
                        val = nameMethod.invoke(val);
                    } catch (Exception e) {
                        val = val.toString();
                    }
                } 
            	
            	json.convertAnother(val);
            } else {
                Object referenceObject = beanWrapper.getPropertyValue(property.getName());
                if (isRenderDomainClassRelations()) {
                    if (referenceObject == null) {
                        writer.value(null);
                    } else {
                    	//referenceObject = proxyHandler.unwrapIfProxy(referenceObject);
                        if (referenceObject instanceof SortedMap) {
                            referenceObject = new TreeMap((SortedMap) referenceObject);
                        } else if (referenceObject instanceof SortedSet) {
                            referenceObject = new TreeSet((SortedSet) referenceObject);
                        } else if (referenceObject instanceof Set) {
                            referenceObject = new HashSet((Set) referenceObject);
                        } else if (referenceObject instanceof Map) {
                            referenceObject = new HashMap((Map) referenceObject);
                        } else if (referenceObject instanceof Collection){
                            referenceObject = new ArrayList((Collection) referenceObject);
                        }
                        json.convertAnother(referenceObject);
                    }
                } else {
                    if (referenceObject == null) {
                        json.value(null);
                    } else {
                        GrailsDomainClass referencedDomainClass = property.getReferencedDomainClass();

                        // Embedded are now always fully rendered
                        if(referencedDomainClass == null || property.isEmbedded() || GrailsClassUtils.isJdk5Enum(property.getType())) {
                            json.convertAnother(referenceObject);
                        } else if (property.isOneToOne() || property.isManyToOne() || property.isEmbedded()) {
                            asShortObject(referenceObject, json, referencedDomainClass.getIdentifier(), referencedDomainClass);
                        } else {
                            GrailsDomainClassProperty referencedIdProperty = referencedDomainClass.getIdentifier();
                            @SuppressWarnings("unused")
							String refPropertyName = referencedDomainClass.getPropertyName();
                            if (referenceObject instanceof Collection) {
                                Collection o = (Collection) referenceObject;
                                writer.array();
                                for (Object el : o) {
                                    asShortObject(el, json, referencedIdProperty, referencedDomainClass);
                                }
                                writer.endArray();

                            } else if (referenceObject instanceof Map) {
                                Map<Object, Object> map = (Map<Object, Object>) referenceObject;
                                for (Map.Entry<Object, Object> entry : map.entrySet()) {
                                    String key = String.valueOf(entry.getKey());
                                    Object o = entry.getValue();
                                    writer.object();
                                    writer.key(key);
                                    asShortObject(o, json, referencedIdProperty, referencedDomainClass);
                                    writer.endObject();
                                }
                            }
                        }
                    }
                }
            }
        }
        writer.endObject();
    }

    protected void asShortObject(Object refObj, JSON json, GrailsDomainClassProperty idProperty, GrailsDomainClass referencedDomainClass) throws ConverterException {
        JSONWriter writer = json.getWriter();
        writer.object();
        writer.key("toString").value(refObj.toString());
        writer.key("id").value(extractValue(refObj, idProperty));
        writer.endObject();
    }        
    
    protected boolean isRenderDomainClassRelations() {
        return true;
    }
}
