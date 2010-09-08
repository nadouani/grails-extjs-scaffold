/**
 * @author Nabil Adouani
 */
(function(){
    
    Ext.namespace("Ext.Grails.ux");
    
    var $cls = Ext.Grails.ux.RowSelectorDialog = function(cfg){
    	this.title = cfg.title || 'Select a row';
    	this.store = cfg.store || new Ext.data.ArrayStore({fields: [ 'id', 'value']});
    	this.data = cfg.data;
    	this.field = cfg.field || null;
    	
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
		        			//Ext.MessageBox.alert('double click event', 'the selected row has the is [' + record.data.id +']')
		        			
		        			this.field.setValue(record.data.value);
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
                			this.field.setValue(record.data.value);
                    		this.close();
                		}else{
                			Ext.MessageBox.alert('Alert', 'Please select a row.');
                		}
                	},
                    scope: this
                }
            ],
        },cfg));
        
        this.store.loadData(this.data);
    };
    

    Ext.extend($cls, Ext.Window, {                             

    });
    
})();
