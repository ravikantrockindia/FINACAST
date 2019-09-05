({
    doInit: function(component,event, helper){
        try{
            component.set("v.showInModal",false)
            component.set("v.financialAccount",null)            
            helper.getAccounts(component,event,helper);
        }catch(e){
            console.log('Exception',e.message)
        }
    },
    backButton:function(component,event,helper){
        try{
            component.set("v.currentStep","1");
        }catch(e){
            console.log(e.message)
        }
    },
    skipButton: function(component,event,helper){
        try{
            component.set("v.currentStep","3")
        }catch(e){
            console.log(e.message)
        }
    },
    createBankAccount:function(component,event,helper){
        try{
            component.set("v.financialAccount",null)
            component.set("v.showInModal",true)
        }catch(e){
            console.log(e.message)
        }
    },
    
    onClickEdit:function(component,event,helper){
        try{
            var finId=event.getSource().get("v.value");
            component.set("v.financialAccount", finId);
            component.set("v.showInModal",true)
        }catch(e){
            console.log(e.message)
        }
        
    },
    onClickDelete: function(component,event,helper){
        try{
            var finId=event.getSource().get("v.value");
            var action=component.get('c.deleteBankAccount');
            if(confirm("Are you sure you want to delete?")){
                var spinner = component.find("mySpinner");
                $A.util.removeClass(spinner, "slds-hide");
                $A.util.addClass(spinner, "slds-show");
                action.setParams({ recordId : finId });
                action.setCallback(this, function(response) {
                    var state = response.getState();
                    if (state === "SUCCESS") {
                        var spinner = component.find("mySpinner");
                        $A.util.removeClass(spinner, "slds-show");
                        
                        $A.util.addClass(spinner, "slds-hide");
                        helper.showNotfication(component,"The record has been deleted successfully.","success","Success!");    
                    }
                    else if (state === "ERROR") {
                        var spinner = component.find("mySpinner");
                        $A.util.removeClass(spinner, "slds-show");
                        
                        $A.util.addClass(spinner, "slds-hide");
                        var errors = response.getError();
                        if (errors) {
                            if (errors[0] && errors[0].message) {
                                console.log("Error message: " + 
                                            errors[0].message);
                            }
                        } else {
                            console.log("Unknown error");
                        }
                    }
                });
                $A.enqueueAction(action);
                component.set("v.showInModal",false)
                component.set("v.financialAccount",null)
                helper.getAccounts(component,event,helper);
                component.set("v.disabled",false)
            }
        }catch(e){
            console.log(e.message)
            var spinner = component.find("mySpinner");
            $A.util.removeClass(spinner, "slds-show");
            
            $A.util.addClass(spinner, "slds-hide");
        }
        
    },
    handleCancel: function(component,event,helper){
        try{
            var isDelete=confirm("You will lose all the saved data. Do you want to continue?")
            if(isDelete){
                var workspaceAPI = component.find("workspace");
                workspaceAPI.getFocusedTabInfo().then(function(response) {
                    var focusedTabId = response.tabId;
                    workspaceAPI.closeTab({tabId: focusedTabId});
                })
                .catch(function(error) {
                    console.log(error);
                });
                var action=component.get("c.deleteRecords");
                action.setParams({ recordId : component.get("v.recordId") });
                
                
                action.setCallback(this, function(response) {
                    var state = response.getState();
                    
                    if (state === "SUCCESS") {
                        
                    }
                    
                    else if (state === "INCOMPLETE") {
                    }
                        else if (state === "ERROR") {
                            var errors = response.getError();
                            if (errors) {
                                if (errors[0] && errors[0].message) {
                                    console.log("Error message: " + 
                                                errors[0].message);
                                }
                            } else {
                                console.log("Unknown error");
                            }
                        }
                });
                $A.enqueueAction(action);
            } 
        }catch(e){
            console.log(e.message)
        }
    },
    
    saveButton: function(component,event,helper){
        try{
            var spinner = component.find("mySpinner");
            $A.util.removeClass(spinner, "slds-show");
            
            $A.util.addClass(spinner, "slds-hide");  
            component.set("v.disabled",true)
            var bankAccountForm=component.find("bankAccountForm")
            bankAccountForm.saveBankAccount();
        }catch(e){
            console.log(e.message)
        }
    },
    
})