({
	   hideExampleModal : function(component) {
     /* var cmpTarget = component.find('exampleModal');
           console.log('the cross is : '+ cmpTarget );
        $A.util.addClass(cmpTarget, 'hideDiv');
       
        component.set("v.isActive",false);
        var saveIncomeEvent = component.getEvent("saveIncomeEvent");
        saveIncomeEvent.setParam("clientFromEvent", component.get("v.client"));
       // saveIncomeEvent.setParams("showModalIncome", false);
        saveIncomeEvent.fire();*/
           var workspaceAPI = component.find("workspace");
           workspaceAPI.getFocusedTabInfo().then(function(response) {
               console.log(JSON.stringify(response))
               var focusedTabId = response.parentTabId;
               workspaceAPI.refreshTab({
                   tabId: focusedTabId,
                   includeAllSubtabs: true
               });
           })
           .catch(function(error) {
               console.log(error);
           });
       },
    
    
    showAlertEmptyInvalidVal : function(component,msg)
    {
        var toastEvent = $A.get("e.force:showToast");
        toastEvent.setParams({
            type : "error",
            "title": "Error!",
            "message": msg
        });
        toastEvent.fire();
        
    }
})