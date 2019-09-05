({
    doInit: function(component, event, helper) {
        var namespace=component.get("v.namespace")
        var spinner = component.find("mySpinner");
        $A.util.removeClass(spinner, "slds-show");
        
        $A.util.addClass(spinner, "slds-hide");
        if(component.get("v.financialAccount.Id")!=null){
            var field='v.financialAccount.'+'Account_Type__c'
            var accountType=component.get(field)
            if (accountType=='Loan'){
                component.set("v.isFixedTerm",true)
                component.set("v.accountType", 'Loan')
                
            }
            else{
                component.set("v.isFixedTerm",false)
                component.set("v.accountType", 'Credit Card')
                
            }
            field='v.financialAccount.'+'Do_you_get_tax_benefit_from_interest_pay__c'
            if (component.get(field)){
                component.set("v.isTaxBenefit",true);
                
            }
            else{
                component.set("v.isTaxBenefit",false);
                
            }
            field='v.financialAccount.'+'Do_tax_benefits_realize_monthly__c'
            if(component.get(field)){
                component.set("v.isMonthly",true)
            }
            else{
                component.set("v.isMonthly",false)
                
            }
        }
        helper.assignRecordType(component,component.get("v.accountType"))
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
        
        $A.util.removeClass(spinner, "slds-show");
        
        $A.util.addClass(spinner, "slds-hide");
        var event = component.getEvent("submitDebtForm");
        event.fire();
        component.set("v.showInModal",false);
    },
    handleError: function(component,event,helper){
        
        var spinner = component.find("mySpinner");
        $A.util.removeClass(spinner, "slds-show");
        $A.util.addClass(spinner, "slds-hide");
        component.set("v.disabled",false)
        helper.showNotfication(component,"The record cannot be saved.Please try again!","error","Error!");    
        
    },
    
    handleFixTerm: function(component,event,helper){
        var selected = event.getSource().get("v.name");
        if (selected=='FixTerm'){
            component.set("v.isFixedTerm",true)
            component.set("v.accountType", 'Loan')
            component.find('pymamt').set("v.value", "")
            component.find('payfreq').set("v.value","")
            
        }
        
        else{
            component.find('pymamt').set("v.value", "")
            component.find('payfreq').set("v.value","")
            component.set("v.isFixedTerm",false)
            component.set("v.accountType", 'Credit Card')
            
        }
        helper.assignRecordType(component,component.get("v.accountType"))
        
    },
    handleTaxBenefit: function(component,event,helper){
        var selected = event.getSource().get("v.name");
        if (selected=='TaxBenefit')
        {        
            component.set("v.isTaxBenefit",true)
            component.find('taxbenfit').set("v.value", "")
            component.set("v.isMonthly",true)
            component.find('deducationtax').set("v.value","")
        }
        else{
            component.find('taxbenfit').set("v.value", "")
            component.set("v.isMonthly",false)
            component.find('deducationtax').set("v.value","")
            component.set("v.isTaxBenefit",false)
        }
        
        
        
    },
    handleMonthly: function(component,event,helper){
        var selected = event.getSource().get("v.name");
        if (selected=='Monthly')
            component.set("v.isMonthly",true)
            else
                component.set("v.isMonthly",false)
                
                },
    createDebtAccount : function(component,event,helper){
        var spinner = component.find("mySpinner");
        $A.util.removeClass(spinner, "slds-hide");
        
        $A.util.addClass(spinner, "slds-show");
        var validate=helper.validateInput(component, event, "firstAccount"); 
        if(validate){
            component.find('form').submit();
            
        }
        
    }
})