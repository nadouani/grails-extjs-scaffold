/**
 * @author Nabil Adouani
 */

(function(){
    
    Ext.namespace("Ext.Grails.ux");
    
    var $cls = Ext.Grails.ux.EntityCollectionGridPanel = function(cfg){    	    	
    	
    	this.entityId = 0;
    	this.entity = cfg.entity;
    	this.entityLabel = cfg.entityLabel;
    	
    	// Select dialog
    	this.urlSelect = cfg.urlSelect;
    	this.urlUpdate = cfg.urlUpdate;
    	this.selectDlgTitle = cfg.selectDlgTitle || 'Select a row';
    	this.selectDlgWidth = cfg.selectDlgWidth || 600;
    	this.selectDlgHeight = cfg.seledDlgHeight || 300;
    	this.selectDlgStoreRoot = cfg.selectDlgStoreRoot || 'data';
    	
    	// Grid
    	this.cols = cfg.cols;

    	// Store properties
    	this.fields = cfg.fields || [];
    	this.root = cfg.root;
    	
    	// Toolbar buttons label
    	this.newButtonLabel = cfg.newButtonLabel;
    	this.deleteButtonLabel = cfg.deleteButtonLabel;
    	this.selectButtonLabel = cfg.selectButtonLabel;
    	
    	this.createDialogClass = cfg.createDialogClass;
    	this.createDialogTitle = cfg.createDialogTitle;
    	
		this.store = new Ext.data.JsonStore({
			autoDestroy: true,
		    root: this.root,
		   	idProperty: 'id',
		 	fields: this.fields
		});
		
        $cls.superclass.constructor.call(this, Ext.apply({
        	// style
        	autoHeight: true,        	
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
				singleSelect : true
			}),
			
			columns : this.cols,
	        tbar: [{
	            text: this.newButtonLabel,
	            iconCls: 'icon-add',
	            handler: this.openCreateDialog,
	            scope: this
	        },{
	            text: this.deleteButtonLabel,
	            iconCls: 'icon-delete',
	            handler: this.confirmDelete,
            	scope: this
	        }, 
	        '-',
	        {
	            text: this.selectButtonLabel,
	            iconCls: 'icon-select',
	            handler: this.openSelectDialog,
            	scope: this
	        }]
        },cfg));
    };

    Ext.extend($cls, Ext.grid.GridPanel, {
    	setEntityId: function(entityId){
    		this.entityId = entityId;
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
	    },
	    
	    openCreateDialog: function(){
			var dialog = new this.createDialogClass({
				title : this.createDialogTitle,				
				listeners: {
	        		onSaved: function(dialog, formPanel, data){	
	        			var record  = new Ext.data.Record();
	        			record.data = data;			        			
	        			
	        			this.store.add(record);
	        		},
	        		scope:this
	        	}
			});
			dialog.show();
		},
	    
	    openSelectDialog: function(){	    	
	    	this.selectDlgStore = new Ext.data.JsonStore({
    			url: this.urlSelect,
    			remoteSort: true,
    			autoLoad:true,
    			root: this.selectDlgStoreRoot,
    			totalProperty: 'totalCount',
    			idProperty: 'id',
    			fields: this.fields
    		});
    		
	    	this.selectDlgColumns = this.cols;
	    	
	    	var win = new Ext.Grails.ux.RowSelectorDialog({
	            title : this.selectDlgTitle,
	            store : this.selectDlgStore,
	            columns: this.selectDlgColumns,
	            width: this.selectDlgWidth,
	            height: this.selectDlgHeight,
	            listeners: {
		    		selected: function(record){	
	    				Ext.Ajax.request({
    						url: this.urlUpdate,
    						success: function(response, opts){
	    						var obj = Ext.decode(response.responseText);

	    						var r = new Ext.data.Record();
	    						r.data = obj.data;
	    						this.store.add(r);
    						},
    						failure: function(response, opts){
    							Ext.MessageBox.Alert('Error', response.responseText)
    						},
    						params: {id: record.data.id, 'proprietaire.id': this.entityId },
    						scope: this
    					});
		    		},
		    		scope: this
		    	}
            });
            win.show();
	    }
    });
    
})();