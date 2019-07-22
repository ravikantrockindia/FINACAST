({
	/*doInit : function(component, event, helper) {
        component.set("v.client", "init");
        component.set("v.scene", "init");
        console.log("client in charts: ",  component.get("v.client"));
        console.log("secene in charts: ",  component.get("v.scene"));
        helper.showChartData(component);
    },*/
    doInit : function(component, event, helper) {
        console.log("client in charts: ",  component.get("v.client"));
        console.log("secene in charts: ",  component.get("v.scene"));
        console.log('Inside SimulationSimulationContainer Component');
    },
    changeClient : function(component, event, helper) {
        console.log('sscenrio simulation container');
        var params = event.getParam('arguments');
        if(params) {
            component.set("v.client", params.clientId);
            component.set("v.scene", params.sceneId);
             var action = component.get("c.getUserScenarios");  
        action.setParams({
            clientId: component.get("v.client.Id"),
            sceneId : component.get("v.scene")
        });
		action.setCallback(this, function(response) {
            console.log("client", component.get("v.client.Id"));
            console.log("sceneId", component.get("v.scene"));
            console.log("scene werftghjuygtfrds",params.sceneId);
            component.set("v.data",response.getReturnValue().response);
            console.log('resp in setcallback of SSCC: ',JSON.stringify(response.getReturnValue().response));
            console.log("data in parent: ", component.get("v.data"));
            component.set("v.parentInitialised", true);
            component.find("child").changeClientData(response.getReturnValue().response);
        });
        $A.enqueueAction(action);
		
        }
    }
})