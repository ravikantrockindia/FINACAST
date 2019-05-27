({
    doInit : function(component, event, helper) {
        var action = component.get("c.getData");  
        action.setParams({
            clId: "init"
        });
        action.setCallback(this, function(response) {
            try {
            var data = response.getReturnValue().response;
            if($A.util.isUndefinedOrNull(data)){
                component.set("v.data",{});
                helper.showtoast(component,event,helper);
            }
            else{
                component.set("v.data",data);
            }
            component.set("v.client",response.getReturnValue().clientAcc);
            console.log("data in parent: ", component.get("v.data"));
                component.set("v.parentInitialised", true);
            
            }
        catch(e)
            {
                console.log(e);
                
                 component.set("v.parentInitialised", true);
                
            }       
        });
        $A.enqueueAction(action);
    },
    
    //added by avneet kaur
    changeClient : function(component, event, helper) {
        console.log('Change Client on Future Simulation Controller called.');
        var params = event.getParam('arguments');
        if(params) {
            console.log('params in future simulation: ',params.clientId);
            component.set("v.client", params.clientId); 
            console.log('params (client) in future simulation: ', component.get("v.client"));
            helper.getUserData(component);
        }
    }
})