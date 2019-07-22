({
	getUserData : function(component) {
        var action = component.get("c.getData");  
        action.setParams({
            clId: component.get("v.client")
        });
        action.setCallback(this, function(response) {
            var data = response.getReturnValue().response;
            if($A.util.isUndefinedOrNull(data)){
                component.set("v.data",{});
                helper.showtoast(component,event,helper);
                
            }
            else{
                component.set("v.data",data);
            }
            component.find("futureSimulation").changeClientData(component.get("v.data"));
            component.set("v.parentInitialised", true);
        });
        $A.enqueueAction(action);
	},
    showtoast : function(component,event,helper) {
        var event = $A.get("e.force:showToast");
        event.setParams({
        "type" : "Warnning",
         "title" : "Info !",
         "message" : "No Data for client available"
        });
        event.fire();
    },
})