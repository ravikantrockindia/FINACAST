({
    doInit : function(component, event, helper) {
        console.log('the helper is:', component.get("v.ExpenseTransaction"));
        var cmpTarget = component.find('exampleModal');
        $A.util.removeClass(cmpTarget, 'hideDiv');
        component.set("v.isActive",true);
        
    },
    
    saveAndCloseBtn : function(component, event, helper) {
        // Display a "toast" status message
        var resultsToast = $A.get("e.force:showToast");
        resultsToast.setParams({
            "title": "Save Success!",
            type: 'success',
            "message": "Income Has been Saved"           
        });
        resultsToast.fire();   
		helper.hideExampleModal(component);
        //helper.saveIncome(component);
        
    },
    
    hideExampleModal : function(component, event, helper) {
        helper.hideExampleModal(component);
        
    },
    
    handleSubmit : function(component, event, helper)
    { 
        
        var status1 = 0;
        
        var msg = "";
        
        var tdate = component.find("date").get("v.value");
        
        var tdest = component.find("dest").get("v.value");
        var tamt = component.find("amt").get("v.value");
        var tname = component.find("name").get("v.value");
        
        if($A.util.isUndefinedOrNull(tname) || tname == ""|| $A.util.isUndefinedOrNull(tdate) || tdate == "" ||  $A.util.isUndefinedOrNull(tdest) || tdest == "" || $A.util.isUndefinedOrNull(tamt) || tamt =="" )
        {
            status1 = 0;
            event.preventDefault();
            msg = "Please fill mandatory fields."
            helper.showAlertEmptyInvalidVal(component,msg);       
        }
        else
        {
            status1 = 1;
        }
    },  
    
})