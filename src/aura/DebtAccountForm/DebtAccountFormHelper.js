({
    validateInput : function(component,event, acc)
    {
        var spinner = component.find("mySpinner");
        
        var name=component.find("name").get('v.value');
        var accountType=component.find("accountType").get("v.value")
        
        var priowner = component.find("owner").get("v.value");
        
        var apr = component.find("apr").get("v.value");
        
        var amn = component.find("loanamt").get("v.value");
        
        if ($A.util.isUndefinedOrNull(name) || name == "" ||  
            $A.util.isUndefinedOrNull(accountType) || accountType == "" || $A.util.isUndefinedOrNull(amn) || amn =="" || $A.util.isUndefinedOrNull(priowner) || priowner == "" || $A.util.isUndefinedOrNull(apr) || apr == "" ){
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
            if(component.get("v.isFixedTerm")==true ){
                var amon = component.find("pymamt").get("v.value").toString();
                var pf = component.find("payfreq").get("v.value");
                if($A.util.isUndefinedOrNull(amon) || amon == "" ||  $A.util.isUndefinedOrNull(pf) || pf == "" ){
                    component.set("v.disabled",false)
                    $A.util.removeClass(spinner, "slds-show");
                    
                    $A.util.addClass(spinner, "slds-hide");
                    event.preventDefault();
                    var msg = "Please fill mandatory fields."
                    this.showAlertEmptyInvalidVal(event,msg);
                    return;
                }
                if(amon<0){
                    component.set("v.disabled",false)
                    $A.util.removeClass(spinner, "slds-show");
                    
                    $A.util.addClass(spinner, "slds-hide");
                    event.preventDefault();
                    var msg = "Payment amount cannot be negative."
                    this.showAlertEmptyInvalidVal(event,msg);
                    return; 
                }
                else{
                    if(component.get("v.isTaxBenefit")==true){
                        var taxbenfit = component.find("taxbenfit").get("v.value");
                        var taxdeduction=component.find("deducationtax").get("v.value")
                        if($A.util.isUndefinedOrNull(taxbenfit) || taxbenfit == ""){
                            component.set("v.disabled",false)
                            $A.util.removeClass(spinner, "slds-show");
                            
                            $A.util.addClass(spinner, "slds-hide");
                            event.preventDefault();
                            var msg = "Please fill mandatory fields."
                            this.showAlertEmptyInvalidVal(event,msg);
                            return;
                            
                        }
                        if(taxbenfit<0){
                            component.set("v.disabled",false)
                            $A.util.removeClass(spinner, "slds-show");
                            
                            $A.util.addClass(spinner, "slds-hide");
                            event.preventDefault();
                            var msg = "Tax contribution(%) cannot be negative."
                            this.showAlertEmptyInvalidVal(event,msg);
                            return; 
                        }
                        if(!($A.util.isUndefinedOrNull(taxdeduction) || taxdeduction == "")&&taxdeduction<0){
                            component.set("v.disabled",false)
                            $A.util.removeClass(spinner, "slds-show");
                            
                            $A.util.addClass(spinner, "slds-hide");
                            event.preventDefault();
                            var msg = "Max yearly tax deduction cannot be negative."
                            this.showAlertEmptyInvalidVal(event,msg);
                            return; 
                        }
                    }
                }
            }
            
            
            
        }
        event.preventDefault();       // stop the form from submitting
        // var fields = event.getParam('fields');
        
        // console.log(JSON.stringify(fields));
        //  fields.FinacastOpeningBalance__c = component.find("currentBalance").get("v.value");
        component.find("openingbalance").set("v.value",component.find("loanamt").get("v.value"));
        
        component.find('form').submit();
        // return true;
        
    },
    assignRecordType:function(component,accountType){
        
        var recordTypeIds=component.get("v.recordTypeIds")
        if(accountType=='Loan'){
            for(var i=0;i<recordTypeIds.length;i++){             
                if(recordTypeIds[i].DeveloperName=='LoanAccount'){
                    component.set("v.recordTypeId",recordTypeIds[i].Id)
                }
            }
        }
        if(accountType=='Credit Card'){
            for(var i=0;i<recordTypeIds.length;i++){             
                if(recordTypeIds[i].DeveloperName=='CreditCard'){
                    component.set("v.recordTypeId",recordTypeIds[i].Id)
                }
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
    }
})