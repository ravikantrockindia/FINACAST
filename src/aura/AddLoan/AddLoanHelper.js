({
    hideExampleModal : function(component) {
        var cmpTarget = component.find('exampleModal');
        $A.util.addClass(cmpTarget, 'hideDiv');
        component.set("v.isActive",false);
       /* var saveIncomeEvent = component.getEvent("saveIncomeEvent");
        console.log("clientId from loan",JSON.stringify(component.get("v.client")))
        saveIncomeEvent.setParam("clientFromEvent", component.get("v.client"));
        saveIncomeEvent.fire();*/
     	component.find("Id_spinner").set("v.class" , 'slds-hide');
	
    },
    
    showAlertEmptyInvalidVal : function(component,msg)
    {
        var toastEvent = $A.get("e.force:showToast");
        toastEvent.setParams({
            type : "error",
            "title": "Error!",
            "message": msg
        });
        toastEvent.fire();
        
    }
})