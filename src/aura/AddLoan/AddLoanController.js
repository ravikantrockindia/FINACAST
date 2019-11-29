({
    doInit : function(component, event, helper) {
          component.find("Id_spinner").set("v.class" , 'slds-show');
        var cmpTarget = component.find('exampleModal');
        $A.util.removeClass(cmpTarget, 'hideDiv');
        component.set("v.isActive",true);
        var loanId=component.get("v.loanId")  
        var ClientId=component.get("v.client.Id");
        var action = component.get("c.ClientLoanRecord");
        action.setParams({
            clientId : ClientId
        });
        action.setCallback(this, function(a) {
             component.find("Id_spinner").set("v.class" , 'slds-hide');
            var state  = a.getState();
            var loanRec=a.getReturnValue();
            component.set("v.loanRec",loanRec);
        });
     
        $A.enqueueAction(action);
        
    },
    
    saveAndCloseBtn : function(component, event, helper) {
        
        // Display a "toast" status message        
        var resultsToast = $A.get("e.force:showToast");
        resultsToast.setParams({
            "title": "Save Success!",
            type: 'success',
            "message": "Loan Has been Saved"           
        });
        
        resultsToast.fire(); 
        helper.hideExampleModal(component);
        
      /*  var workspaceAPI = component.find("workspace");
        workspaceAPI.getFocusedTabInfo().then(function(response) {
            console.log(JSON.stringify(response))
            var focusedTabId = response.parentTabId;
            workspaceAPI.refreshTab({
                tabId: focusedTabId,
                includeAllSubtabs: true
            });
        })
        .catch(function(error) {
            console.log(error);
        });*/
        
        //console.log( 'value',event.getSource().get("v.value"));   
        
    },
    
    hideExampleModal : function(component, event, helper) {
        helper.hideExampleModal(component);
        
    },
    
    handleSubmit : function(component, event, helper)
    { 
        component.find("Id_spinner").set("v.class" , 'slds-show');
        var loanId=component.get("v.loanId")
        var msg = "";
        var ispresent=false;
        var priowner = component.find("owner").get("v.value");
        var ap = component.find("apr").get("v.value");
        var amon = component.find("amount").get("v.value");
        var amn = component.find("inQuantity").get("v.value");
        var pf = component.find("payfreq").get("v.value");
      /*  var sDate = component.find("stDate").get("v.value");
       // alert(sDate );
        if($A.util.isUndefinedOrNull(sDate)){
            var today = new Date();
            var datestart = today.getFullYear()+'/'+(today.getMonth()+1)+'/'+(today.getDate()+1);
            sDate= datestart;
        }
        //
        var eDate = component.find("endDate").get("v.value");
     //   alert(eDate );
        if($A.util.isUndefinedOrNull(eDate)){
        var todayy=new Date();
        var datee =(todayy.getFullYear()+10)+'/'+(todayy.getMonth()+1)+'/'+(todayy.getDate()+1);
            eDate=datee;
        }
        */
        var getTypeEdit=component.get("v.editRecordLoan");
        var loanRec=component.get("v.loanRec");       
        if(getTypeEdit==false){
            
            for (var i = 0; i < loanRec.length; i++) { 
                
                if(priowner==loanRec[i].Name){
                    event.preventDefault();
                    msg = "'loan name with this name already exist'."
                    helper.showAlertEmptyInvalidVal(component,msg); 
                    ispresent=true;
                    break;  
                }
            }
        }
        else if(getTypeEdit==true){
            var Lid=component.get("v.loanRecName");
            if(priowner==Lid){
                ispresent=false;
            }
            else{
                for (var i = 0; i < loanRec.length; i++) { 
                    
                    if(priowner==loanRec[i].Name){
                        event.preventDefault();
                        msg = "'loan name with this name already exist'."
                        helper.showAlertEmptyInvalidVal(component,msg); 
                      	ispresent=true;
                        break;  
                        
                    }
                }
                
            }
        }
        if(ispresent){
            component.find("Id_spinner").set("v.class" , 'slds-hide');
            return;
            
        }
        else{
            if($A.util.isUndefinedOrNull(priowner) || priowner == "" || $A.util.isUndefinedOrNull(ap) || ap == "" ||  $A.util.isUndefinedOrNull(amon) || amon == "" || $A.util.isUndefinedOrNull(amn) || amn =="" || $A.util.isUndefinedOrNull(pf) || pf == "" ){
                event.preventDefault();
                msg = "Please fill mandatory fields."
                helper.showAlertEmptyInvalidVal(component,msg); 
                component.find("Id_spinner").set("v.class" , 'slds-hide');
                return;
                
            }
            else if (amon <=0 ){
                event.preventDefault();
                msg = "Payment Amount cannot be negative or zero."
                helper.showAlertEmptyInvalidVal(component,msg);
                component.find("Id_spinner").set("v.class" , 'slds-hide');
                return; 
                
            }
                else if (amn <0 ){
                    status3 =0;
                    event.preventDefault();
                    msg = "Loan Amount cannot be negative."
                    helper.showAlertEmptyInvalidVal(component,msg);
                    component.find("Id_spinner").set("v.class" , 'slds-hide');
                    return;
                    
                }
                    else if (ap <0 ){
                        status3 =0;
                        event.preventDefault();
                        msg = "APR cannot be negative."
                        helper.showAlertEmptyInvalidVal(component,msg);
                        component.find("Id_spinner").set("v.class" , 'slds-hide');
                        return;
                    }
            if (component.get("v.isTaxDeduction")){
                if(component.find("taxbenfit").get("v.value") < 0){
                    event.preventDefault();
                    msg= "What % of contribution bring tax benefits? cannot is negative"
                    helper.showAlertEmptyInvalidVal(component,msg); 
                    component.find("Id_spinner").set("v.class" , 'slds-hide');
                    return;
                }
                else if(component.find("deducationtax").get("v.value") < 0){
                    event.preventDefault();
                    msg = "Max yearly tax deduction allowed ($ )? cannot is negative"
                    helper.showAlertEmptyInvalidVal(component,msg); 
                    component.find("Id_spinner").set("v.class" , 'slds-hide');
                    return;
                }
            }
        
    
        event.preventDefault();       // stop the form from submitting
        var fields = event.getParam('fields');
        console.log(JSON.stringify(fields));
        fields.FinacastOpeningBalance__c = amn;
        component.find('form').submit(fields);
        }
    }, 
    handleRadio: function(component, event) {
        
        console.log('handle')
        if(event.target.id=="yesCheck"){
            component.set("v.isTaxDeduction",true);
            
        }
        else if(event.target.id=="noCheck"){
            component.set("v.isTaxDeduction",false);
        }
    },
    handleRadio: function(component, event) {
        
        
        console.log('handle')
        if(event.target.id=="yesCheck"){
            component.set("v.isTaxDeduction",true);
            component.set("v.isTaxDeduction1",true);
        }
        else if(event.target.id=="noCheck"){
            component.set("v.isTaxDeduction",false);
        }
    },
    handleIsMonthly: function(component, event){
        
        if(event.target.id=="yesMonthly"){
            
            component.set("v.isMonthly",true);
            
        }
        else if(event.target.id=="noMonthly"){
            
            component.set("v.isMonthly",false);
        }
    },
    recordLoaded: function(component,event,helper){
         
        var loanId=component.get("v.loanId")
        console.log('loanId'+loanId)
        if(!(loanId=="" || $A.util.isUndefinedOrNull(loanId))){
            var action = component.get("c.loanRecord");
            action.setParams({
                clientId : loanId
            });
            
            action.setCallback(this, function(a) {
                var state  = a.getState();
                //console.log('state',state);
                var loanRec=a.getReturnValue();
                component.set("v.loandata",loanRec);
                console.log('loanRec',loanRec);
                var tabledata = component.get("v.loandata");
                // tabledata = JSON.parse(tabledata);
                console.log('tabledata',tabledata);
                var taxDeduction =tabledata.Do_you_get_tax_benefit_from_interest_pay__c;
                console.log('taxDeduction',taxDeduction);
                if (taxDeduction){
                    component.set("v.isTaxDeduction",true);              
                    component.set("v.getYes",true);
                }
                else{
                    
                    component.set("v.getNo",true);
                }
                var ismonthly =tabledata.Do_tax_benefits_realize_monthly__c;
                console.log('ismonthly',ismonthly);
                if (ismonthly){
                    component.set("v.isMonthly",true);
                }
                else{
                    component.set("v.isMonthly",false);
                    
                }
                
            }); 
            var action2 = component.get("c.ClientNameLoanRecord");
            action2.setParams({
                loanId : loanId
            });
            action2.setCallback(this, function(a) {
                var state  = a.getState();
                var loanRecName=a.getReturnValue();
                if(state==='SUCCESS'){
                    component.set("v.loanRecName",loanRecName);
                }
                
            });
            $A.enqueueAction(action2);
            $A.enqueueAction(action); 
            
            /*    if(!(loanId=="" || $A.util.isUndefinedOrNull(loanId))){
           // var recUi = event.getParam("recordUi");
            //console.log('recUi'+recUi)
            var taxDeduction=event.getParam('recordUi').record.fields["Finsol__Do_you_get_tax_benefit_from_interest_pay__c"].value;
           
            if (taxDeduction){
                component.set("v.isTaxDeduction",true);
                
                component.set("v.getYes",true);
                
                
            }
            else{
                
                component.set("v.getNo",true);
            }
             var ismonthly=event.getParam('recordUi').record.fields["Finsol__Do_tax_benefits_realize_monthly__c"].value;
        
            console.log('ismonthly'+ismonthly)
            if (ismonthly){
                component.set("v.isMonthly",true);
            }
            else{
                component.set("v.isMonthly",false);
                
            }
        }*/
        }
    }
})