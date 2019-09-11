({
    doInit: function(component, event, helper) {
        var spinner = component.find("mySpinner");
        $A.util.removeClass(spinner, "slds-show");
        
        $A.util.addClass(spinner, "slds-hide");
       
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