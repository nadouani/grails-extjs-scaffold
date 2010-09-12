<% import grails.persistence.Event %><g:set var="entity" value="${className}" />
<%  
	excludedProps = Event.allEvents.toList() << 'version'
	props = domainClass.properties.findAll { !excludedProps.contains(it.name) && !it.oneToMany}
	associations = domainClass.properties.findAll {it.isAssociation() && it.oneToMany}
    Collections.sort(props, comparator.constructors[0].newInstance([domainClass] as Object[]))
%> 
<%
associations.each { a ->
	aShortName = a.referencedDomainClass.shortName
	storeName = "${className}${aShortName}Store" 
	
	aProps = a.referencedDomainClass.properties.findAll { !excludedProps.contains(it.name) && !it.isAssociation()}
	Collections.sort(aProps, comparator.constructors[0].newInstance([a.referencedDomainClass] as Object[]))
%>
${storeName} = Ext.extend(Ext.data.JsonStore, {
	constructor:function(config) {
		config = config || {
 			autoDestroy: true,
		    root: '${a.name}',
		   	idProperty: 'id',
		 	fields: [
<% aProps.each{ p -> %>{name: '${p.name}'},<% } %>		       
		    ]
    	};
		${storeName}.superclass.constructor.call(this, config);
	},	
	initComponent: function() {
		Ext.apply(this,  Ext.apply(this.initialConfig, config));
        ${storeName}.superclass.initComponent.apply(this, arguments);
	}
});
<%
}
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
