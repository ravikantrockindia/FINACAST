({
	cancelButton : function(component, event, helper) {
        var evt = $A.get("e.force:navigateToComponent");
        evt.setParams({
            componentDef  : "c:ClientComponent"    
        });
        evt.fire();  
    },
    
      saveButton : function(component, event, helper) {
        var acc = component.get("v.name");
        var fn = component.get("v.firstname");
        var ln = component.get("v.lastname");
        var eml = component.get("v.email");
           
        var action = component.get("c.saveData");
        action.setParams
        ({ 
            name : acc,
            firstname : fn,
            lastname : ln,
            email : eml
        });
        
        action.setCallback(this, function(response) {
            var state = response.getState();
            console.log('state',state);
            if (state == "SUCCESS") {
                var evt = $A.get("e.force:navigateToComponent");
                evt.setParams({
                    componentDef  : "c:ClientComponent"    
                });
                evt.fire(); 
                helper.successToast();
            }
            else if (state == "Error") {
                var evt = $A.get("e.force:navigateToComponent");
                evt.setParams({
                    componentDef  : "c:ClientComponent"    
                });
                evt.fire(); 
                helper.errorToast();   
            }
        } );
        $A.enqueueAction(action);   
    }
})