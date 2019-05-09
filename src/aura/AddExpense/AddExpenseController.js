({
    
    doInit : function(component, event, helper) {
        
        var cmpTarget = component.find('exampleModal');
        console.log('init for expense:',cmpTarget);
        $A.util.removeClass(cmpTarget, 'hideDiv');
        component.set("v.isActive",true);
        
    },
    
    saveAndCloseBtn : function(component, event, helper) {
        // Display a "toast" status message
        var resultsToast = $A.get("e.force:showToast");
        resultsToast.setParams({
            "title": "Save Success!",
            type: 'success',
            "message": "Expense Has been Saved"           
        });
        resultsToast.fire();
        // Close the action panel
        helper.hideExampleModal(component);
    },
    
    hideExampleModal : function(component, event, helper) {
        helper.hideExampleModal(component);
    },
    loadOptions: function (component, event, helper) {
        var opts = [
           
            { value: "Auto and Transportation", label: "Auto and Transportation" },
            { value: "Bills and Utilities", label: "Bills and Utilities" },
            { value: "Bussiness Expense", label: "Bussiness Expense" },
            { value: "Business Services", label: "Business Services" },
            { value: "Education", label: "Education" },
            { value: "Entertainment", label: "Entertainment" },
            { value: "Fees and Charges", label: "Fees and Charges" },
            { value: "Fee and Dining", label: "Fee and Dining" },
            { value: "Gifts and Donations", label: "Gifts and Donations" },
            { value: "Home", label: "Home" },
            { value: "Insurance", label: "Insurance" },
            { value: "Investment Expense", label: "Investment Expense" },
            { value: "Miscellaneous", label: "Miscellaneous" },
            { value: "Personal Care", label: "Personal Care" },
            { value: "Kids", label: "Kids" },
            { value: "Business", label: "Business" },
            { value: "Travel", label: "Travel" },
            { value: "Pets", label: "Pets" },
            { value: "Finance", label: "Finance" },
            { value: "Taxes", label: "Taxes" }
        ];
        component.set("v.options1", opts);
    },
    
   
    handleSubmit : function(component, event, helper)
    { 
        
        var status3 = 0;
        
        var msg = "";
        
        var priowner = component.find("owner").get("v.value");
        var freqcy = component.find("freq").get("v.value");
        var growth = component.find("yeargrowth").get("v.value");
        var amn = component.find("inQuantity").get("v.value");
        var sDate = component.find("stDate").get("v.value");
        var eDate = component.find("endDate").get("v.value");
        
        if($A.util.isUndefinedOrNull(priowner) || priowner == "" || $A.util.isUndefinedOrNull(freqcy) || freqcy == "" ||  $A.util.isUndefinedOrNull(growth) || growth == "" || $A.util.isUndefinedOrNull(amn) || amn =="" || amn == 0  )
        {
            status3 = 0;
            event.preventDefault();
            msg = "Please fill mandatory fields."
            helper.showAlertEmptyInvalidVal(component,msg);       
        }
        else if(eDate < sDate){
            status3 = 0;
            event.preventDefault();
            msg = "	End Date cannot be less than the Start Date"
            helper.showAlertEmptyInvalidVal(component,msg);    
        }
        else
        {
            status3 = 1;
        }
    }, 
    handleChange: function (cmp, event) {
        var changeValue = event.getParam("value");
        alert(changeValue);
        
    },
    handleRadio: function(component, event) {
        // component.set("v.displaySection" ,  true);
        
        console.log('handle')
        if(event.target.id=="yesCheck"){
            component.set("v.isTaxDeduction",true);
            
        }
        else if(event.target.id=="noCheck"){
            component.set("v.isTaxDeduction",false);
        }
    },
    handleIsMonthly: function(component, event){
        
        if(event.target.id=="yesMonthly"){
            
            component.set("v.isMonthly",true);
            
        }
        else if(event.target.id=="noMonthly"){
            
            component.set("v.isMonthly",false);
        }
    },
})