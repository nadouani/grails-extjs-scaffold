/**
 * @author Nabil Adouani
 */

(function(){
    
    Ext.namespace("Ext.Grails.ux");
    
    var $cls = Ext.Grails.ux.RowSelectorField = function(cfg){
    	
    	this.dialogTitle = cfg.dialogTitle;
    	this.data = cfg.data || [];
    	this.store = cfg.store || new Ext.data.ArrayStore({fields: [ 'id', 'value']});;
    	
        $cls.superclass.constructor.call(this, Ext.apply({
    	    validationEvent:false,
		    validateOnBlur:false,
		    trigger1Class:'x-form-clear-trigger',
		    trigger2Class:'x-form-search-trigger',
		    hideTrigger1:true,
		    width:180,
		    hasSearch : false,
		    editable: false
        },cfg));
        
        this.addEvents('selected');
        
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
            this.el.dom.removeAttribute('name');

            this.hiddenField = new Ext.form.Hidden({
            	renderTo: this.wrap,
            	id: this.name + '_id',
                name: this.name,
                tag: 'input',
                type: 'text',
                cls: 'x-form-hidden x-form-field',
            });
        },
    	
    	// Clear button
    	onTrigger1Click : function(){
	        if(this.hasSearch){
	            this.el.dom.value = '';
	            this.triggers[0].hide();
	            this.hasSearch = false;
	        }
	    },
	
	    // Search button
	    onTrigger2Click : function(){
		    var win = new Ext.Grails.ux.RowSelectorDialog({
	            title : this.dialogTitle,
	            data : this.data,
	            valueField: this.hiddenField,
	            displayField: this,
	            listeners: {
		    		selected: function(){
				    	this.hasSearch = true;
				        this.triggers[0].show();
				        this.fireEvent('selected');
		    		},
		    		scope: this
		    	}
            });
            win.show();
	    },
	    
	    getValue: function(){
	    	return this.hiddenField.getValue();
	    }

    });
    
})();