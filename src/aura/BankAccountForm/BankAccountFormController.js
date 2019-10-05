({
    
    doInit: function(component,event,helper){
        try{
            
            var spinner = component.find("mySpinner");
            $A.util.removeClass(spinner, "slds-show");
            $A.util.addClass(spinner, "slds-hide");
            var field='v.financialAccount.'+'Account_Type__c'
            var selectedAccountType=component.get("v.selectedAccountType");
            if(selectedAccountType=='Cash'){
                component.set("v.TypeOfAccounts",[{label:'--None--', value: ''},{label:'Checking', value:'Checking'},{label:'Savings', value:'Savings'},{label:'Money Market', value:'Money Market'},{label:'CD', value:'CD'}])
                
            }
            else if(selectedAccountType=='Investment'){
                component.set("v.TypeOfAccounts",[{label:'--None--', value: ''},{label:'Retail Brokerage', value:'Retail Brokerage'},{label:'401K', value:'401K'},{label:'IRA', value:'IRA'},{label:'Roth IRA', value:'Roth IRA'},{label:'529 Account', value:'529 Account'}])
                
            }
                else{
                    component.set("v.TypeOfAccounts",[{label:'--None--', value: ''},{label:'Checking', value:'Checking'},{label:'Savings', value:'Savings'},{label:'Money Market', value:'Money Market'},{label:'CD', value:'CD'},{label:'Retail Brokerage', value:'Retail Brokerage'},{label:'401K', value:'401K'},{label:'IRA', value:'IRA'},{label:'Roth IRA', value:'Roth IRA'},{label:'529 Account', value:'529 Account'}])
                }
            var accountType=component.get(field)
            if( $A.util.isUndefinedOrNull(accountType) || accountType == "" ){
                component.set("v.selectedAccount",'')
            }
            else{
                component.set("v.selectedAccount",accountType)
                
            }
            helper.handleChange(component,event,helper)
            
        }catch(e){
            console.log(e.message)
        }        
    },
    
    handleSubmit:function(component,event,helper){
        try{
            component.set("v.disabled",true)
            var spinner = component.find("mySpinner");
            $A.util.removeClass(spinner, "slds-hide");
            
            $A.util.addClass(spinner, "slds-show");
            helper.validateInput(component,event);
           /* event.preventDefault();       // stop the form from submitting
            var fields = event.getParam('fields');
            fields.FinacastOpeningBalance__c = component.find("currentBalance").get("v.value");
            component.find('form').submit(fields);*/
        }catch(e){
            console.log(e.message)
        }        
    },
    handleSuccess : function(component, event, helper) {
        component.set("v.showInModal",false)
        var spinner = component.find("mySpinner");
        
        $A.util.removeClass(spinner, "slds-show");
        
        $A.util.addClass(spinner, "slds-hide");
        helper.showNotfication(component,"The record has been saved successfully.","success","Success!");    
        
        var event = component.getEvent("lightningEvent");
        
        event.fire();
    },
    handleError: function(component,event,helper){
        
        var spinner = component.find("mySpinner");
        $A.util.removeClass(spinner, "slds-show");
        $A.util.addClass(spinner, "slds-hide");
        component.set("v.disabled",false)
        helper.showNotfication(component,"The record cannot be saved. Please try again!","error","Error!");    
        
    },
    
    onClickCancel: function(component, event, helper) {
        component.set("v.showInModal",false)
    },
    
    handleAccountTypeChange: function(component,event,helper){
        helper.handleChange(component,event,helper)
    },
    
    createBankAccount : function(component,event,helper){
        var spinner = component.find("mySpinner");
        $A.util.removeClass(spinner, "slds-hide");
        
        $A.util.addClass(spinner, "slds-show");
       helper.validateInput(component,event); 
       /* if(validate){
               event.preventDefault();       // stop the form from submitting
            var fields = event.getParam('fields');
            fields.FinacastOpeningBalance__c = component.find("currentBalance").get("v.value");
            component.find('form').submit();
            
        }*/
        
        
    }
    
})