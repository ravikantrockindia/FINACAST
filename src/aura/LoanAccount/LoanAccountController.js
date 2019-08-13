({
    doInit: function(component,event, helper){
        // alert(component.get("v.recordId"))
        component.set("v.showInModal",false)
        component.set("v.financialAccount",null)
        helper.getAccounts(component,event,helper);
    },
    backButton:function(component,event,helper){
        component.set("v.currentStep","2");
    },
    skipButton: function(component,event,helper){
        component.set("v.currentStep","4")
    },
    
    createDebtAccount:function(component,event,helper){
        component.set("v.financialAccount",null)
        component.set("v.showInModal",true)
    },
    onClickEdit:function(component,event,helper){
        var finId=event.getSource().get("v.value");
        //  alert(finId.Id)
        component.set("v.financialAccount", finId);
        component.set("v.showInModal",true)
        
        
    },
    onClickDelete: function(component,event,helper){
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
                    component.find('notifLib').showToast({
                        "variant": "success",
                        "title": "Success!",
                        "message": "The record has been deleted successfully."
                    });
                            component.set("v.disabled",false)

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
        }
        
        
    },
    saveButton: function(component,event,helper){
        var spinner = component.find("mySpinner");
        $A.util.removeClass(spinner, "slds-show");
        
        $A.util.addClass(spinner, "slds-hide");  
        component.set("v.disabled",true)
        var debtAccountForm=component.find("debtAccountForm")
        debtAccountForm.saveDebtAccount();
    },
    handleCancel: function(component,event,helper){
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
            
            // Create a callback that is executed after 
            // the server-side action returns
            action.setCallback(this, function(response) {
                var state = response.getState();
                // alert(state)
                if (state === "SUCCESS") {
                    
                    // alert("From server: " + JSON.stringify(response.getReturnValue()))
                    
                }
                
                else if (state === "INCOMPLETE") {
                    // do something
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
            // A client-side action could cause multiple events, 
            // which could trigger other events and 
            // other server-side action calls.
            // $A.enqueueAction adds the server-side action to the queue.
            $A.enqueueAction(action);
        }  
    },
})