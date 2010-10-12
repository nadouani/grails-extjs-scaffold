<% import grails.persistence.Event %><g:set var="entity" value="${className}" />
<%  
	excludedProps = Event.allEvents.toList() << 'version'
	props = domainClass.properties.findAll { !excludedProps.contains(it.name) && !it.oneToMany}
	associations = domainClass.properties.findAll {it.isAssociation() && it.oneToMany}
    Collections.sort(props, comparator.constructors[0].newInstance([domainClass] as Object[]))
%> 

(function(){
    
    Ext.ns('GrailsApp.ext.dialog');
    
    var \$cls = GrailsApp.ext.dialog.${className}Dialog = function(cfg){
    	
        \$cls.superclass.constructor.call(this, Ext.apply({
        	urlSave: '<g:resource dir="${domainClass.propertyName}" file="save" />',
		    urlUpdate: '<g:resource dir="${domainClass.propertyName}" file="update" />',
		    urlEdit: '<g:resource dir="${domainClass.propertyName}" file="edit" />',
			tabs:[
		    	{
		    		xtype: 'panel',
		    		layout: 'form',
		    		autoHeight: true,
		    		title: 'Details',
		    		bodyStyle: 'padding: 5px',
		    		items:[
		    			<%  
				        props.each { p -> 
				        	cp = domainClass.constrainedProperties[p.name]
				            display = (cp ? cp.display : true)        
				            if (display) { 
				        %>
				        ${renderEditor(p)}
				    	<%  }   } %>
		    		]
		    	},
		    	<%if (associations.size() > 0){ associations.each { a ->%>${renderEditor(a)}<%}}%>
		    ],
			loadSuccess: this.loadSuccess
        },cfg));
        
    };

    Ext.extend(\$cls, Ext.Grails.ux.EntityFormDialog, { 
    	loadSuccess: function(form, action){
    		<%associations.each { a ->%>
			this.grid${className}${a.referencedDomainClass.shortName}.store.loadData(action.result.data);
			this.grid${className}${a.referencedDomainClass.shortName}.setEntityId(this.entityId);
			<%}%>
    	}
    });
    
})();
