({
    showAlertEmptyVal : function(component, event, helper,msg) { 
        var toastEvent = $A.get("e.force:showToast");
        toastEvent.setParams({
            type : "Error",
            "title": "Error!",
            "message": msg
        });
        toastEvent.fire();
        
    },
    
    hideExampleModal : function(component) {
       //  if(window.location.pathname.includes("Budget"))
    //    {
         var cmpTarget = component.find('exampleModal');
        $A.util.addClass(cmpTarget, 'hideDiv');
        component.set("v.isActive",false);
		var saveIncomeEvent = component.getEvent("saveIncomeEvent");
        saveIncomeEvent.setParam("clientFromEvent", component.get("v.client"));
        saveIncomeEvent.fire();
  //  }
       /* else{
        var homeEvent = $A.get("e.force:navigateToObjectHome");
        homeEvent.setParams({
            "scope": "FinServ__FinancialGoal__c"
        });
        homeEvent.fire(); 
        }*/
    },
    
    showAlertEqualDate : function(component, event, helper) { 
        var toastEvent = $A.get("e.force:showToast");
        toastEvent.setParams({
            type : "Error",
            "title": "Error!",
            "message": "Retirement year cannot be same as current year."
        });
        toastEvent.fire();
        
    },
    
    showAlertLessDate : function(component, event, helper) { 
        var toastEvent = $A.get("e.force:showToast");
        toastEvent.setParams({
            type : "Error",
            "title": "Error!",
            "message": "Retirement year cannot be less than current year."
        });
        toastEvent.fire();
        
    }
    
    
})