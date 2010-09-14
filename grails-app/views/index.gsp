<html>
<head>
  	<title>Welcome to Grails</title>
  	<link rel="stylesheet" href="${resource(dir:'js/extjs/resources/css/',file:'ext-all.css')}" />
  	<link rel="stylesheet" href="${resource(dir:'css/',file:'layout.css')}" />
    
    <script type="text/javascript" src="${resource(dir:'js/extjs/adapter/ext/',file:'ext-base.js')}"></script>
    <script type="text/javascript" src="${resource(dir:'js/extjs/',file:'ext-all-debug.js')}"></script>
    
    <!-- Extensions -->
    <script type="text/javascript" src="${resource(dir:'js/extjs/ux',file:'Spinner.js')}"></script>
    <script type="text/javascript" src="${resource(dir:'js/extjs/ux',file:'SpinnerField.js')}"></script>
    <script type="text/javascript" src="${resource(dir:'js/extjs/ux',file:'Ext.ux.Toast.js')}"></script>
    <script type="text/javascript" src="${resource(dir:'js/extjs/ux',file:'RowEditor.js')}"></script>

	<!-- Plugin libs -->
    <script type="text/javascript" src="${resource(dir:'js/extjs/lib',file:'EntityGridPanel.js')}"></script>
    <script type="text/javascript" src="${resource(dir:'js/extjs/lib',file:'EntityCollectionGridPanel.js')}"></script>
    <script type="text/javascript" src="${resource(dir:'js/extjs/lib',file:'EntityFormPanel.js')}"></script>
    <script type="text/javascript" src="${resource(dir:'js/extjs/lib',file:'RowSelectorDialog.js')}"></script>
    <script type="text/javascript" src="${resource(dir:'js/extjs/lib',file:'RowSelectorField.js')}"></script>
    
    <!-- Extensions css -->
    <link rel="stylesheet" href="${resource(dir:'js/extjs/ux/css',file:'Spinner.css')}" />
    <link rel="stylesheet" href="${resource(dir:'js/extjs/resources/css',file:'RowEditor.css')}" />
    
    <style type="text/css">
    	.x-tree-node div.menu-node{		    
		    margin-top:1px;
		    padding-top:5px;
		    padding-bottom:5px;
		}
    </style>

    <script type="text/javascript">
    Ext.onReady(function(){
    	
    	Ext.QuickTips.init();
    	Ext.form.Field.prototype.msgTarget = 'side';

        new Ext.Viewport({
    		layout: 'border',
    		title: 'Grails Application',
    		items: [{
    			xtype: 'box',
    			region: 'north',
    			applyTo: 'header',
    			height: 33
    		}, {
    		    xtype: 'tabpanel',
    		    id: 'content-panel',
    		    plain: true, 
    		    activeTab: 0,
    		    margins: '5 5 5 5',
    		    region: 'center',
    		    items:[{
    		        title: 'Welcome',
    		        contentEl: 'center',
    		        bodyStyle: 'padding:15px'
    		    }]
    		}, {
                region: 'west',                
                width: 275, 
                minSize: 175,
                maxSize: 400,
                margins:'5 0 5 5',
                layout: 'border', 	
				border:false,				
                items: [{
						region: 'center',
						border: true,
						title: 'Application menu',
						layout: 'fit',
						items: [
							new Ext.tree.TreePanel({
								flex: 1,
								border: false,
								rootVisible:false,
								autoScroll:true,
								lines:false,
								root:new Ext.tree.AsyncTreeNode({
						            expanded: true,
						            children: [
										<g:each var="c" in="${grailsApplication.controllerClasses}">
										{
											text: '${c.logicalPropertyName}',
							                cls: 'menu-node',
							                icon: '${resource(dir:'images/skin',file:'grid.png')}',
							                leaf: true,
							                listeners:{
												click: function(){
							                		Ext.getCmp('tabList${c.name}').show();
							                	}
								            }
										},
										</g:each>
						            ]
						        }),

								collapseFirst:false
							})
						]
					},{
						region: 'south',
						title: 'Application settings',
						layout: 'fit',
						margins:'5 0 0 0',
						height: 200,
						border: true,
						collapsible: true,
						items : [
							new Ext.TabPanel({
							border: false,
							activeTab: 0,
							tabPosition: 'bottom',
							region: 'center',						
							items: [
								new Ext.grid.PropertyGrid({
									title: 'Application Status',
									border:false,
									source: {
										"App version": "<g:meta name="app.version"></g:meta>",
										"Grails version": "<g:meta name="app.grails.version"></g:meta>",
										"JVM version": "${System.getProperty('java.version')}",
										"Controllers": "${grailsApplication.controllerClasses.size()}",
										"Domains": "${grailsApplication.domainClasses.size()}",
										"Services": "${grailsApplication.serviceClasses.size()}",
										"Tag Libraries": "${grailsApplication.tagLibClasses.size()}"
									}
								}), new Ext.grid.PropertyGrid({
									title: 'Plugins',
									border:false,									
									source: {										
										<g:set var="pluginManager" value="${applicationContext.getBean('pluginManager')}"></g:set>
										<g:each var="plugin" in="${pluginManager.allPlugins}">
										"${plugin.name}" :  "${plugin.version}",
										</g:each>                           
									}
								})
							]
						})
						]
					}
					
				]
            }],
            renderTo: Ext.getBody()
        });
    });    
        
    </script>
    
    <!-- Import controllers javascript file -->
    <g:each var="c" in="${grailsApplication.controllerClasses}">
	<script type="text/javascript" src="<g:resource dir="${c.logicalPropertyName}" file="create" />"></script>
	<script type="text/javascript" src="<g:resource dir="${c.logicalPropertyName}" file="index" />"></script>
    </g:each>
</head>
<body>
	<div id="header">
		<a href="http://extjs.com" style="float:right;margin-right:10px;"><img src="${resource(dir:'images',file:'extjs.gif')}" style="width:83px;height:24px;margin-top:1px;"/></a>
		<h1>Grails application</h1>
	</div>
    <div id="center" class="x-hide-display">
    	<h1>Welcome to Grails</h1>
        <p>Congratulations, you have successfully started your first Grails application! At the moment
        this is the default page, feel free to modify it to either redirect to a controller or display whatever
        content you may choose. Below is a list of controllers that are currently deployed in this application,
        click on each to execute its default action:</p>
    </div>
</body>
</html>