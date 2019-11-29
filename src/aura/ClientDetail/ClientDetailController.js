({
	doInit : function(component, event, helper) {  
	 var workspaceAPI = component.find("workspace");
            var namespace = component.get("v.namespace");
            console.log('namespace value----'+ namespace);
            var tab=component.get("v.tabName")
            console.log('tab',tab)
            workspaceAPI.getFocusedTabInfo().then(function(response) {
                var focusedTabId = response.tabId;
                console.log('tab id',focusedTabId )
                workspaceAPI.setTabLabel({
                    label: 'Financial Summary'
                });
            })
            .catch(function(error) {
                console.log(error);
            });    
       /*  var action=component.get('c.getNamespace');
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
        $A.enqueueAction(action);*/
	}
})