({
	hideExampleModal : function(component, event, helper) {
    	 var modal = component.find("exampleModal1");
        $A.util.addClass(modal, 'hideDiv'); 
    },
})