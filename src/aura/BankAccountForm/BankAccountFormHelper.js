({
    handleChange : function(component,event,helper) {
        var accountType=component.find("accountType").get("v.value");
        component.set("v.selectedAccount", accountType)
        if (accountType=='CD'){
            component.set("v.isCD",true)
        }
        else{
            component.set("v.isCD",false)
        }
        if (accountType=='Retail Brokerage'){
            component.set("v.isRetailBrokerage",true)
        }
        else{
            component.set("v.isRetailBrokerage",false)
        }
        if (accountType=='401K' || accountType=='IRA' || accountType=='Roth IRA' || accountType=='529 Account'){
            component.set("v.isAPY",false)
        }
        else{
            component.set("v.isAPY",true)
        }
        if(accountType=='529 Account'){
            component.set("v.is529Account",true)
        }
        else{
            component.set("v.is529Account",false)
            
        }
        if (accountType=='401K' || accountType=='IRA' || accountType=='Roth IRA' || accountType=='Retail Brokerage'){
            component.set("v.isInvestmentAccount",true)
        }
        else{
            component.set("v.isInvestmentAccount",false)
            
        }
    },
    validateInput : function(component,event, acc)
    {
                      var spinner = component.find("mySpinner");

        var name=component.find("name").get('v.value');
        // console.log('name', name)
        var accountType=component.find("accountType").get("v.value")
        // console.log("account Type",accountType)
        var currentBal=component.find("currentBalance").get("v.value")
        var apy=component.find("apy").get("v.value")
        //var cost=    component.find("cost").get("v.value")
        // console.log("balance",currentBal);
        if ($A.util.isUndefinedOrNull(name) || name == "" ||  
            $A.util.isUndefinedOrNull(accountType) || accountType == "" || accountType=="None" || $A.util.isUndefinedOrNull(currentBal) || currentBal =="" )
            
        {
                $A.util.removeClass(spinner, "slds-show");
                
                $A.util.addClass(spinner, "slds-hide");
            component.set("v.disabled",false)
            event.preventDefault();
            var msg = "Please fill mandatory fields!"
            this.showAlertEmptyInvalidVal(event,msg);
            return;
        }
        else{
            if(currentBal<0){
                $A.util.removeClass(spinner, "slds-show");
                
                $A.util.addClass(spinner, "slds-hide");
                component.set("v.disabled",false)
                
                event.preventDefault();
                var msg = "Current Balance can't be negative!"
                this.showAlertEmptyInvalidVal(event,msg);
                return;
            }
            if(! ($A.util.isUndefinedOrNull(apy) || apy == "")&& apy<0 ){
                component.set("v.disabled",false)
                $A.util.removeClass(spinner, "slds-show");
                
                $A.util.addClass(spinner, "slds-hide");
                event.preventDefault();
                var msg = "APY can't be negative!"
                this.showAlertEmptyInvalidVal(event,msg);
                return;
            }
            if(accountType=="CD" && new Date(component.find("maturity_date").get("v.value"))>new Date()){
                component.set("v.disabled",false)
                $A.util.removeClass(spinner, "slds-show");
                
                $A.util.addClass(spinner, "slds-hide");
                event.preventDefault();
                var msg = "Maturity Date cannot be greater than today's date"
                this.showAlertEmptyInvalidVal(event,msg);
                return;
            }
            /* if(accountType=="Retail Brokerage"&& (!($A.util.isUndefinedOrNull(cost) || cost == "")&& cost<0)){
                event.preventDefault();
                var msg = "Cost can't be negative!"
                this.showAlertEmptyInvalidVal(event,msg);
                return;
            }*/
            if(accountType=="529 Account" && new Date(component.find("withdrawldate").get("v.value"))>new Date()){
                component.set("v.disabled",false)

                $A.util.removeClass(spinner, "slds-show");
                
                $A.util.addClass(spinner, "slds-hide");
                event.preventDefault();
                var msg = "Withdrawl Date cannot be greater than today's date!"
                this.showAlertEmptyInvalidVal(event,msg);
                return; 
            }
            if(acc="firstAccount"){
                component.find('form').submit();
                
            }
            
        }
        
    },
    
    showAlertEmptyInvalidVal:function(event,msg){
        
        var toastEvent = $A.get("e.force:showToast");
        toastEvent.setParams({
            type : "error",
            "title": "Error!",
            "message": msg
        });
        toastEvent.fire();             
    }
})