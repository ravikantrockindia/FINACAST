({
    
    doInit: function(component,event,helper){
        try{
            
            var spinner = component.find("mySpinner");
            $A.util.removeClass(spinner, "slds-show");
            $A.util.addClass(spinner, "slds-hide");
            
            console.log(JSON.stringify(component.get("v.recordTypeIds")))
            component.set("v.TypeOfAccounts",[{label:'--None--', value: ''},{label:'Other', value:'Other'},{label:'Checking', value:'Checking'},{label:'Savings', value:'Savings'},{label:'Money Market', value:'Money Market'},{label:'CD', value:'CD'},{label:'Retail Brokerage', value:'Retail Brokerage'},{label:'Cash', value:'Cash'},{label:'401K', value:'401K'},{label:'IRA', value:'IRA'},{label:'Roth IRA', value:'Roth IRA'},{label:'529 Account', value:'529 Account'}])
            var accountType=component.get("v.financialAccount.Account_Type__c")
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
            
            //  alert(component.get("v.financialAccount.Id"))
            var spinner = component.find("mySpinner");
            $A.util.removeClass(spinner, "slds-hide");
            
            $A.util.addClass(spinner, "slds-show");
            helper.validateInput(component,event);
        }catch(e){
            console.log(e.message)
        }        
        
        /*if(!valid){
            helper.showAlertEmptyInvalidVal(event);
        }
        var name=component.find("name").get('v.value');
        // console.log('name', name)
        var accountType=component.find("accountType").get("v.value")
        // console.log("account Type",accountType)
        var currentBal=component.find("currentBalance").get("v.value")
        var apy=component.find("apy").get("v.value")
        // console.log("balance",currentBal);
        if ($A.util.isUndefinedOrNull(name) || name == "" ||  
            $A.util.isUndefinedOrNull(accountType) || accountType == "" || accountType=="None" || $A.util.isUndefinedOrNull(currentBal) || currentBal =="" )
            
        {
            event.preventDefault();
            var msg = "Please fill mandatory fields!"
            helper.showAlertEmptyInvalidVal(event,msg);
        }
        else{
            if(currentBal<0){
                event.preventDefault();
                var msg = "Current Balance can't be negative!"
                helper.showAlertEmptyInvalidVal(event,msg);
            }
            if(! ($A.util.isUndefinedOrNull(apy) || apy == "")&& apy<0 ){
                event.preventDefault();
                var msg = "Current Balance can't be negative!"
                helper.showAlertEmptyInvalidVal(event,msg);
            }
            if(accountType="CD" && new Date(component.find("maturity_date").get("v.value"))>new Date()){
                event.preventDefault();
                var msg = "Maturity Date cannot be greater than today's date"
                helper.showAlertEmptyInvalidVal(event,msg);
            }
            
        }*/
        
    },
    handleSuccess : function(component, event, helper) {
        component.set("v.showInModal",false)
        var spinner = component.find("mySpinner");
        
        $A.util.removeClass(spinner, "slds-show");
        
        $A.util.addClass(spinner, "slds-hide");
        console.log(event.getParams().response.id)
        helper.showNotfication(component,"The record has been saved successfully.","success","Success!");    
        
        var event = component.getEvent("lightningEvent");
        // event.setParams({"result" : "success"}); 
        
        event.fire();
    },
    handleError: function(component,event,helper){
        
        //  component.set("v.showInModal",true)
        var spinner = component.find("mySpinner");
        $A.util.removeClass(spinner, "slds-show");
        $A.util.addClass(spinner, "slds-hide");
        component.set("v.disabled",false)
        helper.showNotfication(component,"The record cannot be saved.Please try again!","error","Error!");    
        // console.log('record save failed', e.message, ', ', e.detail)
        // var event=component.getEvent("lightningEvent");
        // cmpEvent.setParams({"result" : "error"}); 
        
        // event.fire();
        
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
        var validate= helper.validateInput(component,event); 
        if(validate){
            component.find('form').submit();
            
        }
        
        /* if(!valid){
            helper.showAlertEmptyInvalidVal(event);
        }
         var name=component.find("name").get('v.value');
         console.log('name', name)
        var accountType=component.find("accountType").get("v.value")
         console.log("account Type",accountType)
        var currentBal=component.find("currentBalance").get("v.value")
        var apy=component.find("apy").get("v.value")
         console.log("balance",currentBal);
        if ($A.util.isUndefinedOrNull(name) || name == "" ||  
            $A.util.isUndefinedOrNull(accountType) || accountType == "" || accountType=="None" || $A.util.isUndefinedOrNull(currentBal) || currentBal =="" )
            
        {
            var msg = "Please fill mandatory fields!"
            helper.showAlertEmptyInvalidVal(event,msg);
            return;
        }
        else{
            alert('inelse')
            if(currentBal<0){
               // event.preventDefault();
                var msg = "Current Balance can't be negative!"
                helper.showAlertEmptyInvalidVal(event,msg);
                return;
            }
            if(! ($A.util.isUndefinedOrNull(apy) || apy == "")&& apy<0 ){
               // event.preventDefault();
                var msg = "APY can't be negative!"
                helper.showAlertEmptyInvalidVal(event,msg);
                return;
            }
            if(accountType="CD" && new Date(component.find("maturity_date"))>new Date()){
                //event.preventDefault();
                var msg = "Maturity Date cannot be greater than today's date"
                helper.showAlertEmptyInvalidVal(event,msg);
                return;
            }
                        component.find('form').submit();

        }*/
        
        
    }
    
})