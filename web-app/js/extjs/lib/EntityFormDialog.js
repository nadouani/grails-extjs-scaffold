/**
 * @author Nabil Adouani
 */

(function(){
	
	Ext.namespace("Ext.Grails.ux");
	
	$cls = Ext.Grails.ux.EntityFormDialog = function(cfg){
		
		this.tabs = cfg.tabs;
		
		this.actionName = cfg.actionName || 'create';
    	this.entityId = cfg.entityId || 0;
    	this.items = cfg.items || [];
    	this.loadSuccess = cfg.loadSuccess || function(){};
    	
    	if(this.actionName == 'create' && this.items.length > 0){
    		this.items.remove(this.items[0]);
    	}
    	
    	this.urlSave = cfg.urlSave;
    	this.urlUpdate = cfg.urlUpdate;
    	this.urlEdit = cfg.urlEdit;
    	
    	this.resized = false;
		
		$cls.superclass.constructor.call(this, Ext.apply({
			modal: true,
			closable: true,
			width: 700,
			border: false,
			layout: 'fit',
			items:[
		       this.formPanel = new Ext.form.FormPanel({
		    	   flex:1,
		    	   border: false,
		    	   autoScroll: true,
		    	   monitorValid:true,
		    	   items:[
		    	          this.tabPanel = new Ext.TabPanel({
		    	        	  xtype: 'tabpanel',
		    	        	  activeTab: 0,	
		    	        	  anchor:'100% 100%',
		    	        	  defaults:{
		    	        	  	border: false,
		    	          		},
			    	          items:this.tabs
		    	          })
    	           ],
    	           buttons: [{
    		        	text: 'Save', 
    		        	iconCls: 'icon-save',
    		        	formBind:true,
    		        	handler: this.save,
    		        	scope:this
    		        },{
    		        	text: 'Cancel',
    		        	iconCls: 'icon-cancel',
    		        	handler: this.cancel,
    		        	scope:this
    		        }]
		       })
			]
		}, cfg));
		
		this.addEvents('beforeSave', 'onSaved', 'onCancel');
		
		this.on({
			afterlayout: function(){
				if(!this.resized){
					var formPanelHeight = this.formPanel.getHeight() + this.formPanel.getFooterToolbar().getHeight();
					var winHeight = Math.min(500, Math.max(300, formPanelHeight));
					
					this.resized = true;
					this.setHeight(winHeight);
					this.doLayout();
				}
			},
			scope: this
		})
	};
	
	Ext.extend($cls, Ext.Window, {
		//private
    	onRender:function() {
			Ext.Grails.ux.EntityFormDialog.superclass.onRender.apply(this, arguments);
			var form =  this.formPanel.getForm();
			form.waitMsgTarget = this.getEl();
			
			if(this.actionName == 'edit'){
				var fieldId = form.findField('id');
				if(fieldId){
					fieldId.setReadOnly(true);
				}
						
				this.formPanel.load({
					url:this.urlEdit,
					waitMsg:'Loading...',
					params:{'id':this.entityId},
					success: this.loadSuccess,
					scope: this
				});
	    	}else{
	    		var fieldId = form.findField('id');
				if(fieldId){
					fieldId.hideLabel = true
					fieldId.hide();
				}
				
	    		Ext.each(this.tabPanel.items.items, function(item, index, all){
	    			if(index>0){
	    				item.setDisabled(true);	    				
	    			}
	    		}, this);
	    	}
		},
		
		save:function() {
			this.fireEvent('beforeSave', this, this.formPanel);
			
			var url = this.actionName == 'create' ? this.urlSave : this.urlUpdate;			
			this.formPanel.getForm().submit({
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
	 			this.fireEvent('onSaved', this, this.formPanel, action.result.data);
	 			this.close();

	 			Ext.ux.Toast.msg('Success', action.result.successMsg, 3);
	 		}
	 	},
	    
		cancel:function() {
	 		this.fireEvent('onCancel', this, this.formPanel);
			this.close();
	 	}
	});
	
	// Redefine the Submit form Action
	Ext.form.Action.Submit.prototype.run = function() {
        var o = this.options,
        method = this.getMethod(),
        isGet = method == 'GET';
	    if(o.clientValidation === false || this.form.isValid()){
	        if (o.submitEmptyText === false) {
	            var fields = this.form.items,
	                emptyFields = [];
	            fields.each(function(f) {
	                if (f.el.getValue() == f.emptyText) {
	                    emptyFields.push(f);
	                    f.el.dom.value = "";
	                }
	            });
	        }
	        
	        var params = {};	        
	        this.form.items.each(function(item) {
	            if (o.affectedOnly && !item.hasChanged())
	                return;
	            var f = item.getName()
	            var v = item.getValue();
	            
	            if (v instanceof Date) {
	                params[f] = 'struct';
	                params[f + '_year'] = v.format('Y');
	                params[f + '_month'] = v.format('m');
	                params[f + '_day'] = v.format('d');
	                params[f + '_hour'] = v.format('H');
	                params[f + '_minute'] = v.format('i');
	            } else {
	                params[f] = v;
	            }
	        }, this);
	        
	        var p = Ext.applyIf(this.form.baseParams || {} ,Ext.applyIf(o.params || {}, params));
	        
	        //TODO : handle fileUpload fields (this.form.fileUpload)
	        Ext.lib.Ajax.request(
                this.getMethod(),
                this.getUrl(isGet),
                this.createCallback(o),
                Ext.urlEncode(p)
	        );
	        
	        if (o.submitEmptyText === false) {
	            Ext.each(emptyFields, function(f) {
	                if (f.applyEmptyText) {
	                    f.applyEmptyText();
	                }
	            });
	        }
	    }else if (o.clientValidation !== false){ // client validation failed
	        this.failureType = Ext.form.Action.CLIENT_INVALID;
	        this.form.afterAction(this, false);
	    }
	}
})();