({
    doInit: function(component,event, helper){
        // alert(component.get("v.recordId"))
        component.set("v.showInModal",false)
        component.set("v.financialAccount",null)
        helper.getAccounts(component,event,helper);
    },
    handleEvent:function(component,event,helper){
       // var message = event.getParam("result"); 
        console.log(message);
        if(message=="success"){
            component.set("v.showInModal",false)
            component.set("v.financialAccount",null)
            var msg = "Record saved Successfully!"
            helper.showNotfication(component,msg,"success","Success!");    
            component.set("v.disabled",false)
            helper.getAccounts(component,event,helper); 
        }
        if(message=="error"){
            var msg = "Record couldn't be saved. Please try again!"
            helper.showNotfication(component,msg,"error","Error!");    
            component.set("v.disabled",false)
        }
        
    },
    handleSuccess : function(component, event, helper) {
        //  alert("abc")
        component.set("v.currentStep","3")
        
    },
    backButton:function(component,event,helper){
        component.set("v.currentStep","1");
    },
    skipButton: function(component,event,helper){
        component.set("v.currentStep","3")
    },
    createBankAccount:function(component,event,helper){
        component.set("v.financialAccount",null)
        component.set("v.showInModal",true)
        
    },
    
    onClickEdit:function(component,event,helper){
        var finId=event.getSource().get("v.value");
        // alert(finId)
        component.set("v.financialAccount", finId);
        component.set("v.showInModal",true)
        
    },
    onClickDelete: function(component,event,helper){
        var finId=event.getSource().get("v.value");
        var action=component.get('c.deleteBankAccount');
        if(confirm("Are you sure you want to delete?")){
            action.setParams({ recordId : finId });
            action.setCallback(this, function(response) {
                var state = response.getState();
                if (state === "SUCCESS") {
                    component.find('notifLib').showToast({
                        "variant": "success",
                        "title": "Success!",
                        "message": "The record has been deleted successfully."
                    });
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
            component.set("v.showInModal",false)
            component.set("v.financialAccount",null)
            helper.getAccounts(component,event,helper);
        }
        
        
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
                console.log(state)
                
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
    
    saveButton: function(component,event,helper){
        
         component.set("v.disabled",true)
        // alert('click save')
        var bankAccountForm=component.find("bankAccountForm")
        bankAccountForm.saveBankAccount();
    },
    
})