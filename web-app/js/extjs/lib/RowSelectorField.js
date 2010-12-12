/**
 * @author Nabil Adouani
 */

(function(){
    
    Ext.namespace("Ext.Grails.ux");
    
    var $cls = Ext.Grails.ux.RowSelectorField = function(cfg){
    	
    	this.form = cfg.form;
    	this.dialogTitle = cfg.dialogTitle;
    	
    	this.idProperty = cfg.idProperty || 'id';    	
    	this.valueProperty = cfg.valueProperty || 'value';
    	this.displayProperty = cfg.displayProperty || 'toString';
    	
    	this.hiddenName = '_' + cfg.name + '.' + this.idProperty;
    	this.rootProperty = cfg.name.split(".")[0];
    	
    	if(cfg.store){
    		this.store = cfg.store;
    	}else if(cfg.urlList){
    		this.urlList = cfg.urlList;
    		this.store = new Ext.data.JsonStore({
    			url: this.urlList,
    			remoteSort: true,
    			autoLoad:true,
    			root: 'data',
    			totalProperty: 'totalCount',
    			idProperty: this.idProperty,
    			fields: [this.idProperty, {name: this.valueProperty, mapping: this.displayProperty}]
    		});
    	}
    	
        $cls.superclass.constructor.call(this, Ext.apply({
    	    validationEvent:false,
		    validateOnBlur:false,
		    trigger1Class:'x-form-clear-trigger',
		    trigger2Class:'x-form-search-trigger',
		    hideTrigger1:true,
		    width:180,
		    editable: false
        },cfg));
        
        this.on('specialkey', function(f, e){
            if(e.getKey() == e.ENTER){
                this.onTrigger2Click();
            }
        }, this);
    };

    Ext.extend($cls, Ext.form.TwinTriggerField, { 
    	// private
        onRender : function(ct, position){
    		Ext.Grails.ux.RowSelectorField.superclass.onRender.call(this, ct, position);
    		
    		this.wrap = this.el.parent('.x-form-field-wrap');

            this.hiddenField = new Ext.form.Hidden({
            	renderTo: this.wrap,
                name: this.hiddenName,
                tag: 'input',
                type: 'text',
                cls: 'x-form-hidden x-form-field',
            });
            
            if(this.form.actionName === 'create'){
            	this.el.dom.name = this.name + '.' + this.idProperty;
    		}
        },
        
    	// Clear button
    	onTrigger1Click : function(){
        	this.setValues('', '');
            this.triggers[0].hide();
	    },
	
	    // Search button
	    onTrigger2Click : function(){
		    var win = new Ext.Grails.ux.RowSelectorDialog({
	            title : this.dialogTitle,
	            store : this.store,
	            valueField: this.hiddenField,
	            displayField: this,
	            listeners: {
		    		selected: function(record){
				        this.triggers[0].show();
				        this.setValues(record.data[this.idProperty], record.data[this.valueProperty]);
		    		},
		    		scope: this
		    	}
            });
            win.show();
	    },
	    
	    getValue: function(){
	    	return this.hiddenField.getValue();
	    },
	    
	    setValue: function(value){
	    	if(Ext.isObject(value)){
	    		this.setValues (value[this.idProperty], value[this.displayProperty]);
	    		this.el.dom.name = this.name + '.' + this.idProperty;
	    	}else{
	    		Ext.Grails.ux.RowSelectorField.superclass.setValue.call(this, value);
	    	}
	    },
	    
	    setValues: function(idValue, displayValue){
	    	if(idValue!= '' && displayValue != ''){
	    		this.triggers[0].show();
	    	}
	    	this.hiddenField.setValue(idValue);
	    	this.setValue(displayValue);
	    }
	    
    });
    
})();