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
        var homeEvent = $A.get("e.force:navigateToObjectHome");
        homeEvent.setParams({
            "scope": "FinServ__FinancialGoal__c"
        });
        homeEvent.fire();
    
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