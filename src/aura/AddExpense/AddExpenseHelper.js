({
	   hideExampleModal : function(component) {
      var cmpTarget = component.find('exampleModal');
           console.log('the cross is : '+ cmpTarget );
        $A.util.addClass(cmpTarget, 'hideDiv');
        component.set("v.isActive",false);
        var saveIncomeEvent = component.getEvent("saveIncomeEvent");
        saveIncomeEvent.setParam("clientFromEvent", component.get("v.client"));
       // saveIncomeEvent.setParams("showModalIncome", false);
        saveIncomeEvent.fire();
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