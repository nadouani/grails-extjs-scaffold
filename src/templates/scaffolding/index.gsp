<% import grails.persistence.Event %>
<g:set var="entityLabel" value="\${message(code: '${domainClass.propertyName}.label', default: '${className}')}" />
<g:set var="entity" value="${className}" />
<%  
	entityName = domainClass.propertyName
	excludedProps = Event.allEvents.toList() << 'version'
    props = domainClass.properties.findAll { !excludedProps.contains(it.name) }
    Collections.sort(props, comparator.constructors[0].newInstance([domainClass] as Object[]))
%>  


(function(){
    
    Ext.ns('GrailsApp.ext.grid');
    
    var \$cls = GrailsApp.ext.grid.${className}Grid = function(cfg){
    	
        \$cls.superclass.constructor.call(this, Ext.apply({
        	entity: '${className}',
			entityLabel : '\${entityLabel}',
		
			// store properties
			fields : [<%  
		        props.each { p -> 
		        	cp = domainClass.constrainedProperties[p.name]
		            display = (cp ? cp.display : true)        
		            if (display) { 
			    %>'${p.name}',<%  }   } %>],
			urlRead : '<g:resource dir="${entityName}" file="list" />',
		    urlCreate : '<g:resource dir="${entityName}" file="save" />',
		    urlUpdate: '<g:resource dir="${entityName}" file="update" />',
		    urlDestroy: '<g:resource dir="${entityName}" file="delete" />',
		
		    // structure properies
		    columns:[
		       	<%  
		        props.each { p -> 
		        	cp = domainClass.constrainedProperties[p.name]
		            display = (cp ? cp.display : true)        
		            if (display) {
		            	if(p.isAssociation() && (p.isManyToOne() || p.isOneToOne())){%>
            	{header: '<g:message code="${domainClass.propertyName}.${p.name}.label" default="${p.naturalName}" />', dataIndex: '${p.name}', width: 50, renderer: function(value) {return value.toString}},
		            	<%}else if(p.isAssociation()){%>	
            	{header: '<g:message code="${domainClass.propertyName}.${p.name}.label" default="${p.naturalName}" />', dataIndex: '${p.name}', width: 50, renderer: function(value) {return value.length>0 ? value.length + " instance(s)":"";}},	            	
		            	<%}else{%>
            	{header: '<g:message code="${domainClass.propertyName}.${p.name}.label" default="${p.naturalName}" />', dataIndex: '${p.name}', width: 50, sortable:true},		
		            	<%}}}%>
		    ],    
			
		   	// Toolbar
			newButtonLabel : '<g:message code="default.button.create.label" default="Create" /> ${className}',
			editButtonLabel : '<g:message code="default.button.edit.label" default="Edit" /> ${className}',
			deleteButtonLabel : '<g:message code="default.button.delete.label" default="delete" /> ${className}',
			
			// Handlers
			newButtonHandler: this.createFn,
			rowDblClickHandler: this.rowDblClickFn
        },cfg));
        
    };

    Ext.extend(\$cls, Ext.Grails.ux.EntityGridPanel, { 
   		createFn: function(){
			var createDialog = new GrailsApp.ext.dialog.${className}Dialog({
				title : '<g:message code="default.new.label" args="[entityLabel]" />',
				closable: true,
				actionName : 'create',
				listeners: {
	        		onSaved: function(dialog, formPanel){
	        			this.store.load();
	        		},
	        		scope:this
	        	}
			});
			createDialog.show();
    	},
    	
    	rowDblClickFn: function(grid, rowIndex, e) {
			var record = grid.getStore().getAt(rowIndex);
			
	        var editDialog = new GrailsApp.ext.dialog.${className}Dialog({
	        	title : '<g:message code="default.button.edit.label" default="Edit" /> ${className}',
	        	closable: true,
	        	modal: true,
	        	actionName : 'edit',
	        	entityId: record.data.id,
	        	listeners: {
	        		onSaved: function(dialog, formPanel){
	        			this.store.load();
	        		},
	        		scope:this
	        	}
	        });
	        editDialog.show();
		}
    });
    
})();


Ext.onReady(function(){
	var tabs = Ext.getCmp("content-panel");
    
    var tabList${className} = new Ext.Panel({
    	id:'tabList${className}',
        title: '\${entityLabel}',
        items:[new GrailsApp.ext.grid.${className}Grid()],
        layout:'fit'
    });
    tabs.add(tabList${className});
});
