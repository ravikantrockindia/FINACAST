({
	helperMethod : function(component) {
		 component.set("v.Spinner", true);
        var action = component.get("c.ScenarioData");  
         action.setParams({
            clientId: component.get("v.cid")
        });
        action.setCallback(this, function(response) {
            
            component.set("v.scenario", response.getReturnValue());
            component.set("v.Spinner", false);
        });
        $A.enqueueAction(action);
	}
})