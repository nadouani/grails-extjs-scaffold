/**
 * @author Nabil Adouani
 */

(function(){
    
    Ext.namespace("Ext.Grails.ux");
    
    var $cls = Ext.Grails.ux.EntityFormPanel = function(cfg){
    	
    	this.actionName = cfg.actionName || 'create';
    	this.entityId = cfg.entityId || 0;
    	this.items = cfg.items || [];
    	this.loadSuccess = cfg.loadSuccess || function(){};
    	
    	this.callerComponent = cfg.callerComponent;
    	
    	if(this.actionName == 'create' && this.items.length > 0){
    		this.items.remove(this.items[0]);
    	}
    	
    	this.urlSave = cfg.urlSave;
    	this.urlUpdate = cfg.urlUpdate;
    	this.urlEdit = cfg.urlEdit;
    	
        $cls.superclass.constructor.call(this, Ext.apply({
        	// Style
            labelWidth: 100,
            labelAlign: 'left',
            layout: 'form',
            padding: 10,
            autoScroll: true,
            monitorValid:true,
            
            items: this.items,
            
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
        },cfg));
        
    };

    Ext.extend($cls, Ext.form.FormPanel, { 
    	//private
    	onRender:function() {
    		Ext.Grails.ux.EntityFormPanel.superclass.onRender.apply(this, arguments);
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
					success: this.loadSuccess,
					scope: this
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
	    
	    onSuccess:function(form, action) {
	 		if(action.result.success == true){
	 			Ext.ux.Toast.msg('Success', action.result.successMsg, 3);
				
	 			// TODO handle the success action
				var tab = this.callerComponent; 
				var grid = tab.items.itemAt(0);
				grid.getStore().load();
				
				this.destroy();
				tab.show();
	 		}
	 	},
	    
		cancel:function() {
			this.destroy();
			
			// TODO handle the cancel action
			this.callerComponent.show();
	 	}
    });
    
})();