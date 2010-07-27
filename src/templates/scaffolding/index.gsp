<% import grails.persistence.Event %>
<g:set var="entityLabel" value="\${message(code: '${domainClass.propertyName}.label', default: '${className}')}" />
<g:set var="entity" value="${className}" />
<%  
	entityName = domainClass.propertyName
	excludedProps = Event.allEvents.toList() << 'version'
    props = domainClass.properties.findAll { !excludedProps.contains(it.name) }
    Collections.sort(props, comparator.constructors[0].newInstance([domainClass] as Object[]))
%>  

${className}Grid = Ext.extend(Ext.grid.GridPanel, {
	constructor:function(config) {
		config = config || {};
		config.listeners = config.listeners || {};

		${className}Grid.superclass.constructor.call(this, config);
	},
	
	initComponent: function() {
		var proxy = new Ext.data.HttpProxy({
		    api: {
		        read : '<g:resource dir="${entityName}" file="list" />',
		        create : '<g:resource dir="${entityName}" file="save" />',
		        update: '<g:resource dir="${entityName}" file="update" />',
		        destroy: '<g:resource dir="${entityName}" file="delete" />'
		    }
		});
		
		var reader = new Ext.data.JsonReader({
		    totalProperty: 'totalCount',
		    successProperty: 'success',
		    idProperty: 'id',
		    root: 'data',
		    messageProperty: 'message'
		}, [
			<%  
	        props.each { p -> 
	        	cp = domainClass.constrainedProperties[p.name]
	            display = (cp ? cp.display : true)        
	            if (display) { 
		    %>'${p.name}',<%  }   } %>
		]);
		
		var writer = new Ext.data.JsonWriter({
		    encode: true,
		    writeAllFields: false
		});		
		
		var store = new Ext.data.Store({
		    proxy: proxy,
		    reader: reader,
		    writer: writer, 
		    autoSave: true 
		});
		
		var config = {
			store: store,
	        loadMask: true,
	        layout: 'anchor',
	        border:false,
	        selModel : new Ext.grid.RowSelectionModel( {
				singleSelect : true
			}),
	        columns:this.getColumnsModel(),
	        viewConfig: {
	            forceFit:true,
	            enableRowBody:true,
	            emptyText: 'No data to display',
	        },
	        bbar: this.getBottomBar(store),
	        tbar: this.getToolbar()
		}
		
		this.on('rowdblclick', function(grid, rowIndex, e) {
			var record = grid.getStore().getAt(rowIndex);
			
			var formTab = new ${className}Form({
	        	title : '<g:message code="default.button.edit.label" default="Edit" /> ${className}',
	        	closable: true,
	        	actionName : 'edit',
	        	entityId: record.data.id
	        });
	        
	        var tabs = Ext.getCmp("content-panel");
	        tabs.add(formTab).show();
		});
		
		Ext.data.DataProxy.addListener('write', function(proxy, action, result, res, rs) {
			Ext.ux.Toast.msg('Success', res.message, 3);
		});
				
		Ext.data.DataProxy.addListener('exception', function(proxy, type, action, options, res) {
		    if (type === 'remote') {
		        Ext.ux.Toast.msg('Remote error', res.message, 5);
		    }
		});

		Ext.apply(this,  Ext.apply(this.initialConfig, config));
    	
		${className}Grid.superclass.initComponent.apply(this, arguments);
	},

	getColumnsModel: function(){
		return [
	        <%  
	        props.each { p -> 
	        	cp = domainClass.constrainedProperties[p.name]
	            display = (cp ? cp.display : true)        
	            if (display) {
	            	if(p.isAssociation() && (p.isManyToOne() || p.isOneToOne())){%>
	            	{header: '<g:message code="${domainClass.propertyName}.${p.name}.label" default="${p.naturalName}" />', dataIndex: '${p.name}', width: 50, renderer: function(value) {return value.toString}},
	            	<%}else if(p.isAssociation()){%>	
	            	{header: '<g:message code="${domainClass.propertyName}.${p.name}.label" default="${p.naturalName}" />', dataIndex: '${p.name}', width: 50, renderer: function(value) {return value.length>0 ? value.length + " instance(s)":"";}},
	            	<%}else if(p.isEnum()){%>	
	            	{header: '<g:message code="${domainClass.propertyName}.${p.name}.label" default="${p.naturalName}" />', dataIndex: '${p.name}', width: 50, sortable:true, renderer: function(value) {return value.name}},
	            	<%}else{%>
	            	{header: '<g:message code="${domainClass.propertyName}.${p.name}.label" default="${p.naturalName}" />', dataIndex: '${p.name}', width: 50, sortable:true},		
	            	<%}}}%>
	        ];
	},
	
	getBottomBar: function(store){
		return new Ext.PagingToolbar({
	            pageSize: 10,
	            store: store,
	            displayInfo: true,
	            displayMsg: 'total {2} results found. Current shows {0} - {1}',
	            emptyMsg: "No data to display"
	        });
	},
	
	getToolbar: function(){
		return [{
	            text: '<g:message code="default.new.label" args="[entityLabel]" />',
	            iconCls: 'icon-add',
	            handler: function(){
	                var formTab = new ${className}Form({
	                	title : '<g:message code="default.new.label" args="[entityLabel]" />',
	                	closable: true,
	                	actionName : 'create'
	                });
	                
	                var tabs = Ext.getCmp("content-panel");
	                tabs.add(formTab).show();
	            }
	        },{
	            text: '<g:message code="default.button.edit.label" default="Edit" /> ${className}',
	            iconCls: 'icon-edit'
	        },{
	            text: '<g:message code="default.button.delete.label" default="Delete" /> ${className}',
	            iconCls: 'icon-delete',
	            handler: this.confirmDelete,
            	scope: this
	        }];
	},
	
	onRender:function() {
		${className}Grid.superclass.onRender.apply(this, arguments);
		this.store.load({params:{start:0, limit:10}});
	},
	
	confirmDelete : function(btn, ev) {
		var count = this.getSelectionModel().getCount();
        if(count > 0){
        	Ext.MessageBox.confirm('Message', 'Do you really want to delete it?' , this.doDelete, this);	
        }else{
        	Ext.MessageBox.alert('Message', 'Please select at least one item to delete');
        }
    },
    
    doDelete: function(btn){		
    	if(btn == 'yes'){
    		var record = this.getSelectionModel().getSelected();
	        if (!record) {
	            return false;
	        }        
	        this.store.remove(record);
    	}	        
    }
});

Ext.onReady(function(){
	var tabs = Ext.getCmp("content-panel");
    
    var tabList${className} = new Ext.Panel({
    	id:'tabList${className}',
        title: '\${entityLabel}',
        items:[new ${className}Grid()],
        layout:'fit'
    });
    tabs.add(tabList${className});
});
