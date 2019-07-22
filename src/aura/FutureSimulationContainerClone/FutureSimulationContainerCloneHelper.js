({
	getUserData : function(component) {
		var action = component.get("c.getData");  
        action.setParams({
            clId: component.get("v.client")
        });
		action.setCallback(this, function(response) {
            component.set("v.data",response.getReturnValue().response);
           component.find("futureSimulation").changeClientData(component.get("v.data"));
           component.set("v.parentInitialised", true);
        });
        $A.enqueueAction(action);
	}
})