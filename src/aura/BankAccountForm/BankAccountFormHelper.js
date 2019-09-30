({
    handleChange : function(component,event,helper) {
        try{
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
            this.assignRecordType(component,accountType);
        }catch(e){
            console.log("Exception",e.message );
        }
    },
    
    
    assignRecordType:function(component,accountType){
        try{
            var recordTypeIds=component.get("v.recordTypeIds")
            if(accountType=='Savings'){
                for(var i=0;i<recordTypeIds.length;i++){             
                    if(recordTypeIds[i].DeveloperName=='SavingsAccount'){
                        component.set("v.recordTypeId",recordTypeIds[i].Id)
                    }
                }
            }
            if(accountType=='Checking' || accountType=='Money Market'  || accountType=="CD"){
                for(var i=0;i<recordTypeIds.length;i++){             
                    if(recordTypeIds[i].DeveloperName=='CheckingAccount'){
                        component.set("v.recordTypeId",recordTypeIds[i].Id)
                    }
                }
            }
            if(accountType=='401K' || accountType=='IRA' || accountType=='Roth IRA' || accountType=='529 Account' || accountType=='Retail Brokerage'){
                for(var i=0;i<recordTypeIds.length;i++){             
                    if(recordTypeIds[i].DeveloperName=='InvestmentAccount'){
                        component.set("v.recordTypeId",recordTypeIds[i].Id)
                    }
                }
            }
        }catch(e){
            console.log(e.message)
        }        
        
    },
    
    validateInput : function(component,event, acc)
    {
        try{
            var spinner = component.find("mySpinner");
            
            var name=component.find("name").get('v.value');
            var accountType=component.find("accountType").get("v.value")
            var currentBal=component.find("currentBalance").get("v.value")
            var apy
            var maturityDate;
            var cost;
            var withdrawalDate;
            
            if ($A.util.isUndefinedOrNull(name) || name == "" ||  
                $A.util.isUndefinedOrNull(accountType) || accountType == "" || accountType=="None" || $A.util.isUndefinedOrNull(currentBal) || currentBal =="" )
                
            {
                $A.util.removeClass(spinner, "slds-show");
                
                $A.util.addClass(spinner, "slds-hide");
                component.set("v.disabled",false)
                event.preventDefault();
                var msg = "Please fill mandatory fields!"
                this.showNotfication(component,msg,'error','Error!');
                return;
            }
            else{
                if(currentBal<0){
                    $A.util.removeClass(spinner, "slds-show");
                    
                    $A.util.addClass(spinner, "slds-hide");
                    component.set("v.disabled",false)
                    
                    event.preventDefault();
                    var msg = "Current Balance can't be negative!"
                    this.showNotfication(component,msg,'error','Error!');
                    return;
                }
                if(accountType!='401K'  && accountType!='IRA' && accountType!='Roth IRA' && accountType!='529 Account' ){
                    apy=component.find("apy").get("v.value")
                    if ($A.util.isUndefinedOrNull(apy) || apy == "")
                        
                    {
                        $A.util.removeClass(spinner, "slds-show");
                        
                        $A.util.addClass(spinner, "slds-hide");
                        component.set("v.disabled",false)
                        event.preventDefault();
                        var msg = "Please fill mandatory fields!"
                        this.showNotfication(component,msg,'error','Error!');
                        return;
                    }
                    else{
                        if(apy<0 ){
                            component.set("v.disabled",false)
                            $A.util.removeClass(spinner, "slds-show");
                            
                            $A.util.addClass(spinner, "slds-hide");
                            event.preventDefault();
                            var msg = "APY can't be negative!"
                            this.showNotfication(component,msg,'error','Error!');
                            return;
                        }
                    }
                }
                if(accountType=='CD'  ){
                    maturityDate=component.find("maturity_date").get("v.value")
                    if ($A.util.isUndefinedOrNull(maturityDate) || maturityDate == "")
                        
                    {
                        $A.util.removeClass(spinner, "slds-show");
                        
                        $A.util.addClass(spinner, "slds-hide");
                        component.set("v.disabled",false)
                        event.preventDefault();
                        var msg = "Please fill mandatory fields!"
                        this.showNotfication(component,msg,'error','Error!');
                        return;
                    }
                }
                if(accountType=='Retail Brokerage'  ){
                    cost=component.find("cost").get("v.value")
                    if ($A.util.isUndefinedOrNull(cost) || cost == "")
                        
                    {
                        $A.util.removeClass(spinner, "slds-show");
                        
                        $A.util.addClass(spinner, "slds-hide");
                        component.set("v.disabled",false)
                        event.preventDefault();
                        var msg = "Please fill mandatory fields!"
                        this.showNotfication(component,msg,'error','Error!');
                        return;
                    }
                    else{
                        if(cost<0){
                            component.set("v.disabled",false)
                            $A.util.removeClass(spinner, "slds-show");
                            
                            $A.util.addClass(spinner, "slds-hide");
                            event.preventDefault();
                            var msg = "Cost cannot be negative!"
                            this.showNotfication(component,msg,'error','Error!');
                            return;
                        }
                    }
                }
                debugger;
                if(accountType=='529 Account' ){
                    var  withdrawalDate=component.find("withdrawldate").get("v.value")
                    console.log(withdrawalDate)
                    if ($A.util.isUndefinedOrNull(withdrawalDate) || withdrawalDate == "")
                        
                    {
                        $A.util.removeClass(spinner, "slds-show");
                        
                        $A.util.addClass(spinner, "slds-hide");
                        component.set("v.disabled",false)
                        event.preventDefault();
                        var msg = "Please fill mandatory fields!"
                        this.showNotfication(component,msg,'error','Error!');
                        return;
                    }
                }
                event.preventDefault();       // stop the form from submitting
                var fields = event.getParam('fields');
                
                console.log(JSON.stringify(fields));
                fields.FinacastOpeningBalance__c = component.find("currentBalance").get("v.value");
                component.find('form').submit(fields);
                //  return true;
                
            }
        }catch(e){
            console.log(e.message)
            $A.util.removeClass(spinner, "slds-show");
            
            $A.util.addClass(spinner, "slds-hide");
            component.set("v.disabled",true)
            
        }        
        
        
    },
    showNotfication : function(component,msg,type,title){
        try{
            component.find('notifLib').showToast({
                "title": title,
                "variant":type,
                "message": msg,
                "mode":"dismissable"
            });
            
        }catch(e){
            console.log(e.message)
        } 
    },
    
})