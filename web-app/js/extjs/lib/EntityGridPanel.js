/**
 * @author Nabil Adouani
 */

(function(){
    
    Ext.namespace("Ext.Grails.ux");
    
    var $cls = Ext.Grails.ux.EntityGridPanel = function(cfg){
    	
    	this.entity = cfg.entity;
    	this.entityLabel = cfg.entityLabel;
    	
    	// Proxy properties
    	this.read = cfg.urlRead;
    	this.create = cfg.urlCreate;
    	this.update = cfg.urlUpdate;
    	this.destroy = cfg.urlDestroy;
    	
    	// Reader properties
    	this.totalProperty = cfg.totalProperty || 'totalCount';
    	this.successProperty = cfg.successProperty || 'success';
    	this.idProperty = cfg.idProperty || 'id';
    	this.rootProperty = cfg.rootProperty || 'data';
    	this.messageProperty = cfg.messageProperty || 'message';
    	this.fields = cfg.fields || [];
    	
    	// Toolbar buttons label
    	this.newButtonLabel = cfg.newButtonLabel;
    	this.editButtonLabel = cfg.editButtonLabel;
    	this.deleteButtonLabel = cfg.deleteButtonLabel;
    	
    	this.newButtonHandler = cfg.newButtonHandler;
    	this.rowDblClickHandler = cfg.rowDblClickHandler;
    	
    	this.proxy = new Ext.data.HttpProxy({
		    api: {
		        read : this.read,
		        create : this.create,
		        update: this.update,
		        destroy: this.destroy
		    }
		});
		
		this.reader = new Ext.data.JsonReader({
		    totalProperty: this.totalProperty,
		    successProperty: this.successProperty,
		    idProperty: this.idProperty,
		    root: this.rootProperty,
		    messageProperty: this.messageProperty
		}, this.fields);
		
		this.writer = new Ext.data.JsonWriter({
		    encode: true,
		    writeAllFields: false
		});		
		
		this.store = new Ext.data.Store({
		    proxy: this.proxy,
		    reader: this.reader,
		    writer: this.writer, 
		    autoSave: true 
		});
    	
        $cls.superclass.constructor.call(this, Ext.apply({
        	// style
        	layout: 'anchor',
        	loadMask: true,
        	border:false,
        	viewConfig: {
	        	forceFit:true,
	        	enableRowBody:true,
	        	emptyText: 'No data to display',
	        },
        	
        	// data
        	store: this.store,

        	// structure
        	selModel : new Ext.grid.RowSelectionModel( {
				singleSelect : true,
				listeners: {
        			selectionchange: this.rowSelectionChanged,
        			scope: this
        		}
			}),
	        
	        bbar: this.getBottomBar(this.store),
	        tbar: this.getToolbar()
        },cfg));
        
        this.on('rowdblclick', this.rowDblClickHandler);
		
        /*
		Ext.data.DataProxy.addListener('write', function(proxy, action, result, res, rs) {
			Ext.ux.Toast.msg('Success', res.message, 3);
		});
				
		Ext.data.DataProxy.addListener('exception', function(proxy, type, action, options, res) {
		    if (type === 'remote') {
		        Ext.ux.Toast.msg('Remote error', res.message, 5);
		    }
		});
		*/
        
    };

    Ext.extend($cls, Ext.grid.GridPanel, {
    	// private
    	onRender:function() {
    		Ext.Grails.ux.EntityGridPanel.superclass.onRender.apply(this, arguments);
			this.store.load({params:{start:0, limit:10}});
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
	            text: this.newButtonLabel,
	            iconCls: 'icon-add',
	            handler: this.newButtonHandler,
	            scope: this
	        },{
	        	ref: '../editButton',
	            text: this.editButtonLabel,
	            iconCls: 'icon-edit',
            	disabled: true
	        },{
	        	ref: '../removeButton',
	            text: this.deleteButtonLabel,
	            iconCls: 'icon-delete',
	            disabled: true,
	            handler: this.confirmDelete,
            	scope: this
	        }];
		},
		
		rowSelectionChanged: function(sm){
			if(sm.getCount()){
				this.removeButton.enable();
				this.editButton.enable();
			}else{
				this.removeButton.disable();
				this.editButton.disable();
			}
		},
		
		confirmDelete : function(btn, ev) {
			var count = this.getSelectionModel().getCount();
	        if(count > 0){
	        	Ext.MessageBox.confirm('Message', 'Do you really want to delete the selected item?' , this.doDelete, this);	
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
    
})();