({
    currentAmtError : function(component, event, helper, msg) {
        var toastEvent = $A.get("e.force:showToast");
        toastEvent.setParams({
            type : "error",
            "title": "Error!",
            "message": msg
        });
        toastEvent.fire();
    },
    
    
    hideExampleModal : function(component) {
         var cmpTarget = component.find('exampleModal');
        
            console.log('the cross is : '+ cmpTarget );
            $A.util.addClass(cmpTarget, 'hideDiv');
            component.set("v.isActive",false);
            var saveIncomeEvent = component.getEvent("saveIncomeEvent");
            saveIncomeEvent.setParam("clientFromEvent", component.get("v.client"));
            
            saveIncomeEvent.fire();
    
    },
    
    showAlertEmptyInvalidVal : function(component,msg)
    {
        console.log("inhelper");
       // component.set("v.errors", [{message:"Invalid field: " }]);
        var toastEvent = $A.get("e.force:showToast");
        toastEvent.setParams({
            type : "error",
            "title": "Error!",
            "message": msg
        });
        toastEvent.fire();
        
    }
})