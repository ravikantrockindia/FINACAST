({
    doInit: function(component,event, helper){
        // alert(component.get("v.recordId"))
        try{
            component.set("v.showInModal",false)
            component.set("v.financialAccount",null)
            //console.log('abc')
            // console.log('abc',JSON.stringify(component.get("v.recordTypeIds")))
            
            helper.getAccounts(component,event,helper);
        }catch(e){
            console.log('Exception',e.message)
        }
    },
    /*  handleEvent:function(component,event,helper){
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
        
    },*/
    /* handleSuccess : function(component, event, helper) {
        //  alert("abc")
        component.set("v.currentStep","3")
        
    },*/
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
            // alert(finId)
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
                        
                        /* component.find('notifLib').showToast({
                        "variant": "success",
                        "title": "Success!",
                        "message": "The record has been deleted successfully."
                    });*/
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
            // alert('click save')
            var bankAccountForm=component.find("bankAccountForm")
            bankAccountForm.saveBankAccount();
        }catch(e){
            console.log(e.message)
        }
    },
    
})