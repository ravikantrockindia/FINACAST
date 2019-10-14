({
    doInit: function(component, event, helper) {
        var spinner = component.find("mySpinner");
        $A.util.removeClass(spinner, "slds-show");
        
        $A.util.addClass(spinner, "slds-hide");
        var ClientId=component.get("v.accountRecordId");
            //var ClientId=Client.Id;
            var action = component.get("c.ClientCreditRecord");
            action.setParams({
                clientId : ClientId
            });
            action.setCallback(this, function(a) {
                var state  = a.getState();
                var creditRec=a.getReturnValue();
                component.set("v.creditRec",creditRec);
            });
        var creditId=component.get("v.financialAccount.Id");
        
        var action3 = component.get("c.ClientCreditNameRecord");
        action3.setParams({
            creditId : creditId
        });
        action3.setCallback(this, function(a) {
            var state  = a.getState();
            var  CreditRecName=a.getReturnValue();
            component.set("v.CreditRecName",CreditRecName);
             
        });
        $A.enqueueAction(action3);
        $A.enqueueAction(action);
    },
    onClickCancel: function(component, event, helper) {
        component.set("v.showInModal",false)
    },
    handleSubmit: function(component, event, helper){
        component.set("v.disabled",true)
        
        var spinner = component.find("mySpinner");
        $A.util.removeClass(spinner, "slds-hide");
        
        $A.util.addClass(spinner, "slds-show");
        helper.validateInput(component, event, "accounts"); 
         
    },
    handleSuccess: function(component, event, helper){
        var spinner = component.find("mySpinner");
        var navService = component.find("navService");
        $A.util.removeClass(spinner, "slds-show");
        
        $A.util.addClass(spinner, "slds-hide");
        helper.showNotfication(component,"The record has been saved successfully.","success","Success!");    
        component.set("v.showInModal",false);
     
    },
    handleError: function(component,event,helper){
        
        var spinner = component.find("mySpinner");
        $A.util.removeClass(spinner, "slds-show");
        $A.util.addClass(spinner, "slds-hide");
        component.set("v.disabled",false)
        helper.showNotfication(component,"The record cannot be saved.Please try again!","error","Error!");    
               
    },
    

})