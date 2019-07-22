({
	showChartData : function(component) {
        
        var action = component.get("c.getUserScenarios");  
        action.setParams({
            clientId: component.get("v.client.Id"),
            sceneId : component.get("v.scene")
        });
		action.setCallback(this, function(response) {
            console.log("client", component.get("v.client.Id"));
            console.log("sceneId", component.get("v.scene"));
            component.set("v.data",response.getReturnValue().response);
            console.log('resp: ',response.getReturnValue().response);
            console.log("data in parent: ", component.get("v.data"));
            component.set("v.parentInitialised", true);
        });
        $A.enqueueAction(action);
		
	}
})