({
	doInit : function(component, event, helper) {    
         var action=component.get('c.getNamespace');
        console.log('id hello----------'+component.get('v.recordId'));
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                component.set("v.NameSpace", response.getReturnValue());
                var ab =response.getReturnValue();
                 
                var eve = $A.get("e.c:changeclientevent");
        eve.setParams({"idclient":component.get('v.recordId'),
                       "NameSpace":component.get('v.NameSpace')
                      }); 
        eve.fire();
            }           
        });
        $A.enqueueAction(action);
	}
})