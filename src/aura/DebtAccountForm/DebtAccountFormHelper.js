({
    validateInput : function(component,event, acc)
    {
        console.log("inhelper");
        var spinner = component.find("mySpinner");
        
        var name=component.find("name").get('v.value');
        console.log('name', name)
        var accountType=component.find("accountType").get("v.value")
        console.log("account Type",accountType)
        //var currentBal=component.find("currentBalance").get("v.value")
        //console.log("balance",currentBal);
        var priowner = component.find("owner").get("v.value");
        console.log("priowner",priowner)
        
        var apr = component.find("apr").get("v.value");
        console.log("apr",apr)
        
        var amn = component.find("loanamt").get("v.value");
        console.log("loanamt",amn)
        
        
        
        
        /*  console.log(priowner);
        console.log(ap);
        console.log(amon);
        console.log(amn);
        console.log(pf);*/
        /*if($A.util.isUndefinedOrNull(priowner) || priowner == "" || $A.util.isUndefinedOrNull(ap) || ap == "" ||  $A.util.isUndefinedOrNull(amon) || amon == "" ||amon==0 || $A.util.isUndefinedOrNull(amn) || amn =="" || $A.util.isUndefinedOrNull(pf) || pf == "" )
        {
            event.preventDefault();
            msg = "Please fill mandatory fields."
            helper.showAlertEmptyInvalidVal(component,msg);       
        }*/
        if ($A.util.isUndefinedOrNull(name) || name == "" ||  
            $A.util.isUndefinedOrNull(accountType) || accountType == "" || $A.util.isUndefinedOrNull(amn) || amn =="" || $A.util.isUndefinedOrNull(priowner) || priowner == "" ){
            //return false; 
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
                console.log("amount",amon)
                console.log(typeof amon)
                var pf = component.find("payfreq").get("v.value");
                console.log("payfreq",pf)
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
                        console.log("taxbenfit",taxbenfit)
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
        return true;
        /* if(acc="firstAccount"){
                component.find('form').submit();
                
            }*/
    },
    assignRecordType:function(component,accountType){
        
        var recordTypeIds=component.get("v.recordTypeIds")
        console.log(accountType)
        if(accountType=='Loan'){
            for(var i=0;i<recordTypeIds.length;i++){             
                if(recordTypeIds[i].DeveloperName=='LoanAccount'){
                    console.log('hi')
                    component.set("v.recordTypeId",recordTypeIds[i].Id)
                }
            }
        }
        if(accountType=='Credit Card'){
            for(var i=0;i<recordTypeIds.length;i++){             
                if(recordTypeIds[i].DeveloperName=='CreditCard'){
                    console.log('hi')
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
    }
})