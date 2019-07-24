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
         var cmpTarget = component.find('exampleModal');
            console.log('the cross is : '+ cmpTarget );
            $A.util.addClass(cmpTarget, 'hideDiv');
            component.set("v.isActive",false);
            var saveIncomeEvent = component.getEvent("saveIncomeEvent");
            saveIncomeEvent.setParam("clientFromEvent", component.get("v.client"));
            
            saveIncomeEvent.fire();
    
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
        
    },
     successToast : function(component, event, helper) {
        var toastEvent = $A.get("e.force:showToast");
        toastEvent.setParams({
            type : "success",
            "title": "Success!",
            "message": "The record has been saved."
        });
        toastEvent.fire();
    },
    errorToast : function(component, event, helper) {
        var toastEvent = $A.get("e.force:showToast");
        toastEvent.setParams({
            type : "error",
            "title": "Error!",
            "message": "Record can not be saved. Please try again"
        });
        toastEvent.fire();
    },
    currentAmtError : function(component, event, helper, msg) {
        var toastEvent = $A.get("e.force:showToast");
        toastEvent.setParams({
            type : "error",
            "title": "Error!",
            "message": msg
        });
        toastEvent.fire();
    },
    
    

    showAlertEmptyVal : function(component, event, helper) { 
        var toastEvent = $A.get("e.force:showToast");
        toastEvent.setParams({
            type : "Error",
            "title": "Error!",
            "message": "Some Fields are Empty."
        });
        toastEvent.fire();
        
    },
    
    updateEventHandler : function(component, event)
    {
        var updFlag = event.getParam("updateFlag");
        
        console.log("updFlag" + updFlag);
        
        if(updFlag)
        {
            //window.location.reload( );
            $A.get('e.force:refreshView').fire();
        }
    },
    
    
    setNewValue : function(component)
    {
        var emi = component.get("v.initialEmi");
        component.find("goalContri").set("v.value", emi);
        console.log("goal contri after set helper",component.find("goalContri").get("v.value"));
        
    }
    
   
    
    
})