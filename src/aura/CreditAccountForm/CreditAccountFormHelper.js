({
    validateInput : function(component,event, acc)
    {
        var spinner = component.find("mySpinner");
        
        var name=component.find("name").get('v.value');
        
        var priowner = component.find("owner").get("v.value");
        
        var apr = component.find("apr").get("v.value");
        
        var amn = component.find("loanamt").get("v.value");
        
        if ($A.util.isUndefinedOrNull(name) || name == "" ||  
            $A.util.isUndefinedOrNull(amn) || amn =="" || $A.util.isUndefinedOrNull(priowner) || priowner == "" || $A.util.isUndefinedOrNull(apr) || apr == ""){
            event.preventDefault();
            component.set("v.disabled",false)
            $A.util.removeClass(spinner, "slds-show");
            
            $A.util.addClass(spinner, "slds-hide");
            var msg = "Please fill mandatory fields."
            this.showAlertEmptyInvalidVal(event,msg);
            return;
        }
        else{
            if(amn<0){
                component.set("v.disabled",false)
                $A.util.removeClass(spinner, "slds-show");
                
                $A.util.addClass(spinner, "slds-hide");
                event.preventDefault();
                var msg = "Current Debt Value cannot be negative."
                this.showAlertEmptyInvalidVal(event,msg);
                return; 
            }
            if(apr<0){
                component.set("v.disabled",false)
                $A.util.removeClass(spinner, "slds-show");
                
                $A.util.addClass(spinner, "slds-hide");
                event.preventDefault();
                var msg = "APR cannot be negative."
                this.showAlertEmptyInvalidVal(event,msg);
                return; 
            }
            
            
            
        }
        event.preventDefault();       // stop the form from submitting
        var fields = event.getParam('fields');
        
        console.log(JSON.stringify(fields));
        fields.Finsol__FinacastOpeningBalance__c = component.find("loanamt").get("v.value");
        component.find('form').submit(fields);
        //  return true;
        
    },
    
})