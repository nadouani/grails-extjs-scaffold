<% import grails.persistence.Event %><g:set var="entity" value="${className}" />
<%  
	excludedProps = Event.allEvents.toList() << 'version'
	props = domainClass.properties.findAll { !excludedProps.contains(it.name) && !it.oneToMany}
	associations = domainClass.properties.findAll {it.isAssociation() && it.oneToMany}
    Collections.sort(props, comparator.constructors[0].newInstance([domainClass] as Object[]))
%> 

(function(){
    
    Ext.ns('GrailsApp.ext.form');
    
    var \$cls = GrailsApp.ext.form.${className}Form = function(cfg){
    	
        \$cls.superclass.constructor.call(this, Ext.apply({
        	urlSave: '<g:resource dir="${domainClass.propertyName}" file="save" />',
		    urlUpdate: '<g:resource dir="${domainClass.propertyName}" file="update" />',
		    urlEdit: '<g:resource dir="${domainClass.propertyName}" file="edit" />',
		    items: [
				<%  
		        props.each { p -> 
		        	cp = domainClass.constrainedProperties[p.name]
		            display = (cp ? cp.display : true)        
		            if (display) { 
		        %>
		        ${renderEditor(p)}
		    	<%  }   } %>			    	
		    	<%
		    	if (associations.size() > 0){
		    	%>
		    	{xtype: 'tabpanel', activeItem:0,height:200,
			    	items:[
			    <%associations.each { a ->%>${renderEditor(a)}<%}%>
			    	]}
		    	<%}%>					
			],
			loadSuccess: this.loadSuccess
        },cfg));
        
    };

    Ext.extend(\$cls, Ext.Grails.ux.EntityFormPanel, { 
    	loadSuccess: function(form, action){
    		<%
			associations.each { a ->
			%>
			Ext.getCmp('grid${className}${a.referencedDomainClass.shortName}').store.loadData(action.result.data);
			<%
			}
			%>
    	}
    });
    
})();
