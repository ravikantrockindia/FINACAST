({
    handleChange : function(component,event,helper) {
        try{
            var accountType=component.find("accountType").get("v.value");
            component.set("v.selectedAccount", accountType)
            console.log(component.get("v.selectedAccount"))
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
            //console.log(component.get(recordTypeId))
            this.assignRecordType(component,accountType);
        }catch(e){
            console.log("Exception",e.message );
        }
    },
    
    
    assignRecordType:function(component,accountType){
        try{
            var recordTypeIds=component.get("v.recordTypeIds")
            console.log(recordTypeIds[0].DeveloperName)
            if(accountType=='CD' || accountType=='Other' || accountType=='Money Market' || accountType=='Cash'){
                for(var i=0;i<recordTypeIds.length;i++){             
                    if(recordTypeIds[i].DeveloperName=='BankingAccount'){
                        console.log('hi')
                        component.set("v.recordTypeId",recordTypeIds[i].Id)
                    }
                }
            }
            if(accountType=='Savings'){
                for(var i=0;i<recordTypeIds.length;i++){             
                    if(recordTypeIds[i].DeveloperName=='SavingsAccount'){
                        console.log('hi')
                        component.set("v.recordTypeId",recordTypeIds[i].Id)
                    }
                }
            }
            if(accountType=='Checking'){
                for(var i=0;i<recordTypeIds.length;i++){             
                    if(recordTypeIds[i].DeveloperName=='CheckingAccount'){
                        console.log('hi')
                        component.set("v.recordTypeId",recordTypeIds[i].Id)
                    }
                }
            }
            if(accountType=='401K' || accountType=='IRA' || accountType=='Roth IRA' || accountType=='529 Account' || accountType=='Retail Brokerage'){
                for(var i=0;i<recordTypeIds.length;i++){             
                    if(recordTypeIds[i].DeveloperName=='InvestmentAccount'){
                        console.log('hi')
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
            // console.log('name', name)
            var accountType=component.find("accountType").get("v.value")
            // console.log("account Type",accountType)
            var currentBal=component.find("currentBalance").get("v.value")
            var apy
            if(accountType!='401K'  && accountType!='IRA' && accountType!='Roth IRA' && accountType!='529 Account' )
                apy=component.find("apy").get("v.value")
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
                if(! ($A.util.isUndefinedOrNull(apy) || apy == "")&& apy<0 ){
                    component.set("v.disabled",false)
                    $A.util.removeClass(spinner, "slds-show");
                    
                    $A.util.addClass(spinner, "slds-hide");
                    event.preventDefault();
                    var msg = "APY can't be negative!"
                    this.showNotfication(component,msg,'error','Error!');
                    return;
                }
                if(accountType=="CD" && new Date(component.find("maturity_date").get("v.value"))>new Date()){
                    component.set("v.disabled",false)
                    $A.util.removeClass(spinner, "slds-show");
                    
                    $A.util.addClass(spinner, "slds-hide");
                    event.preventDefault();
                    var msg = "Maturity Date cannot be greater than today's date"
                    this.showNotfication(component,msg,'error','Error!');
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
                    this.showNotfication(component,msg,'error','Error!');
                    return; 
                }
                /*if(acc="firstAccount"){
                alert('submit')
                component.find('form').submit();
                
            }*/
                return true;
                
            }
        }catch(e){
            console.log(e.message)
            $A.util.removeClass(spinner, "slds-show");
            
            $A.util.addClass(spinner, "slds-hide");
            component.set("v.disabled",true)
                   // this.showNotfication(component,"The record cannot be saved.Please try again!","error","Error!");    

        }        
        
        
    },
    showNotfication : function(component,msg,type,title){
        //console.log("inhelper");
        try{
            // component.set("v.errors", [{message:"Invalid field: " }]);
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
    /* showAlertEmptyInvalidVal:function(event,msg){
        
        var toastEvent = $A.get("e.force:showToast");
        toastEvent.setParams({
            type : "error",
            "title": "Error!",
            "message": msg
        });
        toastEvent.fire();             
    }*/
})