/**
 * @author Nabil Adouani
 */
(function(){
    
    Ext.namespace("Ext.Grails.ux");
    
    var $cls = Ext.Grails.ux.RowSelectorDialog = function(cfg){
    	this.title = cfg.title || 'Select a row';
    	this.store = cfg.store
    	this.valueField = cfg.valueField || null;
    	this.displayField = cfg.displayField || null;
    	
        $cls.superclass.constructor.call(this, Ext.apply({
            title: this.title,
            layout:'border',
            modal: true,
            width: 400,
            height: 400,
            
            items: [
                this.grid = new Ext.grid.GridPanel({
				    store: this.store,
				    region: 'center',
				    border: false,

				    columns:[{
				        header: "ID",
				        dataIndex: 'id',
				        width: 50,
				        sortable: true
				    },{
				        header: "Value",
				        dataIndex: 'value',
				        sortable: true
				    }],
				
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
		        			
		        			this.valueField.setValue(record.data.id);
		        			this.displayField.setValue(record.data.value);
		        			this.fireEvent ('selected');
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
                			this.valueField.setValue(record.data.id);
		        			this.displayField.setValue(record.data.value);
                			this.fireEvent ('selected');
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
