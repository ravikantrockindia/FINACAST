({
    doInit : function(component, event, helper) {
         var action = cmp.get("c.getNameSpace");
         
        action.setCallback(this, function(response) {
            var state = response.getState();
             
            if( state === 'SUCCESS') {
                
                cmp.set("v.NameSpace", response.getReturnValue());
            } 
        });
        $A.enqueueAction(action);
        helper.doGraph(component,event,helper);
    },
    
    itemsChange : function(component, event, helper) {        
          helper.doGraph(component,event,helper);     
    }
})