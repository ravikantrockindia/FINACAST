({
    doInit : function(component, event, helper) {
         var action = component.get("c.getNameSpace");
         
        action.setCallback(this, function(response) {
            var state = response.getState();
             
            if( state === 'SUCCESS') {
                
                component.set("v.NameSpace", response.getReturnValue());
                console.log('Namespace of showDemographic' + component.get("v.NameSpace"));
            } 
        });
        $A.enqueueAction(action);
        helper.doGraph(component,event,helper);
    },
    
    itemsChange : function(component, event, helper) {        
          helper.doGraph(component,event,helper);     
    }
})