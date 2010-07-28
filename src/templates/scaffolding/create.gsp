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
${className}Form = Ext.extend(Ext.form.FormPanel, {
    labelWidth: 100,
    labelAlign: 'left',
    layout: 'form',
    padding: 10,
    autoScroll: true,
    monitorValid:true,
    actionName: 'create',
    entityId:0,
    urlSave: '<g:resource dir="${domainClass.propertyName}" file="save" />',
    urlUpdate: '<g:resource dir="${domainClass.propertyName}" file="update" />',
    urlEdit: '<g:resource dir="${domainClass.propertyName}" file="edit" />',
    
    constructor:function(config) {
 		config = config || {};
 		config.listeners = config.listeners || {};

		${className}Form.superclass.constructor.call(this, config);
	},
    
    initComponent: function() {
    	var config = {
    		items:[
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
	        buttons: [{
	        	text: 'Save', 
	        	iconCls: 'icon-save',
	        	scope:this,
	        	formBind:true,
	        	handler: this.save
	        },{
	        	text: 'Cancel',
	        	iconCls: 'icon-cancel',
	        	scope:this,
	        	handler: this.cancel
	        }]
    	};
    	
    	if(this.actionName == 'create'){
    		config.items.remove(config.items[0]);
    	}
    	
    	Ext.apply(this,  Ext.apply(this.initialConfig, config));
    	
        ${className}Form.superclass.initComponent.apply(this, arguments);
    },
    
    onRender:function() {
		${className}Form.superclass.onRender.apply(this, arguments);
		this.getForm().waitMsgTarget = this.getEl();
		
		if(this.actionName == 'edit'){
			var fieldId = this.getForm().findField('id');
			if(fieldId){
				fieldId.setReadOnly(true);
			}
					
			this.load({
				url:this.urlEdit,
				waitMsg:'Loading...',
				params:{'id':this.entityId},
				scope: this,
				success: function(form, action){
					<%
					associations.each { a ->
					%>
					Ext.getCmp('grid${className}${a.referencedDomainClass.shortName}').store.loadData(action.result.data);
					<%
					}
					%>
				}
			});
    	}
	},
    
	save:function() {
		var url = this.actionName == 'create' ? this.urlSave : this.urlUpdate;			
		this.getForm().submit({
			url:url,
			scope:this,
			success:this.onSuccess,
			failure:this.onFailure,
			waitMsg:'Saving...'
		});
 	},
 	
 	onSuccess:function(form, action) {
 		if(action.result.success == true){
 			Ext.ux.Toast.msg('Success', action.result.successMsg, 3);
			
			var tab = Ext.getCmp('tabList${className}'); 
			var grid = tab.items.itemAt(0);
			grid.getStore().load();
			
			this.destroy();
			tab.show();
 		}
 	},
    
	onFailure:function(form, action) {
		var msg;
        switch (action.failureType) {
            case Ext.form.Action.CLIENT_INVALID:
                msg = 'Form fields may not be submitted with invalid values';
                break;
            case Ext.form.Action.CONNECT_FAILURE:
                msg = 'Ajax communication failed';
                break;
            case Ext.form.Action.SERVER_INVALID:
               msg = action.result.errorMsg;
		}
       
		Ext.Msg.show({
			title:'Error',
			msg:msg,
			modal:true,
			icon:Ext.Msg.ERROR,
			buttons:Ext.Msg.OK
		});
    },
    
	cancel:function() {
		this.destroy();
		Ext.getCmp('tabList${className}').show();
 	}
});
