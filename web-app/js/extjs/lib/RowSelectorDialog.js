/**
 * @author Nabil Adouani
 */
(function(){
    
    Ext.namespace("Ext.Grails.ux");
    
    var $cls = Ext.Grails.ux.RowSelectorDialog = function(cfg){
    	this.width = cfg.width || 400;
    	this.height = cfg.height || 400;
    	this.title = cfg.title || 'Select a row';
    	this.store = cfg.store
    	this.valueField = cfg.valueField || null;
    	this.displayField = cfg.displayField || null;
    	
    	this.columns = cfg.columns || [{header: "ID",dataIndex: 'id',sortable: true},{header: "Value", dataIndex: 'value', sortable: true}];
    	
        $cls.superclass.constructor.call(this, Ext.apply({
            title: this.title,
            layout:'border',
            modal: true,
            width: this.width,
            height: this.height,
            
            items: [
                this.grid = new Ext.grid.GridPanel({
				    store: this.store,
				    region: 'center',
				    border: false,

				    columns: this.columns,
				
				    sm: new Ext.grid.RowSelectionModel({
				    	singleSelect:true,
				    }),

				    viewConfig:{forceFit:true},
				
				    bbar: new Ext.PagingToolbar({
				        pageSize: 25,
				        store: this.store,
				        displayInfo: true,
				        displayMsg: 'Displaying rows {0} - {1} of {2}',
				        emptyMsg: "No row to display"
				    }),
				    
				    listeners: {
		                rowdblclick: function (grid, rowIndex, e) {
		        			var record = grid.getStore().getAt(rowIndex);
		        			
		        			this.fireEvent ('selected', record);
		        			this.close();
		                },
		                scope: this
		            }
				})
            ],
            
            buttons: [
                {
                    text: 'Select',
                    handler: function(){
                		var record = this.grid.getSelectionModel().getSelected();
                		
                		if(record != null){
                			this.fireEvent ('selected', record);
                    		this.close();
                		}else{
                			Ext.MessageBox.alert('Alert', 'Please select a row.');
                		}
                	},
                    scope: this
                }
            ],
        },cfg));
        
        this.addEvents('selected');
        
        this.store.load();
    };
    

    Ext.extend($cls, Ext.Window, {                             

    });
    
})();
