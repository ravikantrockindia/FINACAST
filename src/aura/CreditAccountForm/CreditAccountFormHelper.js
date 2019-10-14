({
    validateInput : function(component,event, acc)
    {	
        var ispresent=false;
        var spinner = component.find("mySpinner");
        
        var name=component.find("name").get('v.value');
        
        var priowner = component.find("owner").get("v.value");
        
        var apr = component.find("apr").get("v.value");
        
        var amn = component.find("loanamt").get("v.value");
         var creditRec=component.get("v.creditRec");
        var editCreditRec=component.get("v.editCreditRec");
         
        if(editCreditRec==false){
        for (var i = 0; i < creditRec.length; i++) { 
            
            if(name==creditRec[i].Name){
                $A.util.removeClass(spinner, "slds-show");
                
                $A.util.addClass(spinner, "slds-hide");
                component.set("v.disabled",false)
                event.preventDefault();
                var msg = "Credit Account name with this name already exist."
                this.showNotfication(component,msg,'error','Error!');
                ispresent=true;
                break;
  
            }
        }
        }
        else if(editCreditRec==true){
            var editCreditRec=component.get("v.CreditRecName");
            if(name==editCreditRec){
                ispresent=false;
            }
            else{
                for (var i = 0; i < creditRec.length; i++) { 
                    
                    if(name==creditRec[i].Name){
                        event.preventDefault();
                        component.set("v.disabled",false)
                        $A.util.removeClass(spinner, "slds-show");                       
                        $A.util.addClass(spinner, "slds-hide");
                        msg = "Credit Account name with this name already exist."
                        this.showNotfication(component,msg,'error','Error!');
                        ispresent=true;
                        return;
                    }
                }
                
            }
        }
        if(ispresent){
          //  component.find("Id_spinner").set("v.class" , 'slds-hide');
            return;
            
        }
        
        else{
        if ($A.util.isUndefinedOrNull(name) || name == "" ||  
            $A.util.isUndefinedOrNull(amn) || amn =="" || $A.util.isUndefinedOrNull(priowner) || priowner == "" || $A.util.isUndefinedOrNull(apr) || apr == ""){
            event.preventDefault();
            component.set("v.disabled",false)
            $A.util.removeClass(spinner, "slds-show");
            
            $A.util.addClass(spinner, "slds-hide");
            var msg = "Please fill mandatory fields."
            this.showNotfication(component,msg,'error','Error!');
          //  this.showAlertEmptyInvalidVal(event,msg);
            return;
        }
        else{
            if(amn<0){
                component.set("v.disabled",false)
                $A.util.removeClass(spinner, "slds-show");
                
                $A.util.addClass(spinner, "slds-hide");
                event.preventDefault();
                var msg = "Current Debt Value cannot be negative."
               // this.showAlertEmptyInvalidVal(event,msg);
               this.showNotfication(component,msg,'error','Error!');
                return; 
            }
            if(apr<0){
                component.set("v.disabled",false)
                $A.util.removeClass(spinner, "slds-show");
                
                $A.util.addClass(spinner, "slds-hide");
                event.preventDefault();
                var msg = "APR cannot be negative."
               // this.showAlertEmptyInvalidVal(event,msg);
                this.showNotfication(component,msg,'error','Error!');
                return; 
            }
            
            
        }   
        }
        event.preventDefault();       // stop the form from submitting
        var fields = event.getParam('fields');
        
        console.log(JSON.stringify(fields));
        fields.FinacastOpeningBalance__c = component.find("loanamt").get("v.value");
        component.find('form').submit(fields);
        //  return true;
        
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