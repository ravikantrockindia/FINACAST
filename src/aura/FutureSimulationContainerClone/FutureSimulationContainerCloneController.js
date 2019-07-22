({
    doInit : function(component, event, helper) {
        var action = component.get("c.getData");  
        action.setParams({
            clId: "init"
        });
        action.setCallback(this, function(response) {
            component.set("v.data",response.getReturnValue().response);
             component.set("v.client",response.getReturnValue().clientAcc);
            console.log("data in parent: ", component.get("v.data"));
            component.set("v.parentInitialised", true);
        });
        $A.enqueueAction(action);
    },
    
    //added by avneet kaur
    changeClient : function(component, event, helper) {
        var params = event.getParam('arguments');
        if(params) {
            console.log('params in future simulation: ',params.clientId);
            component.set("v.client", params.clientId); 
            console.log('params (client) in future simulation: ', component.get("v.client"));
            helper.getUserData(component);
        }
    }
})