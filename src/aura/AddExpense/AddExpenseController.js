({
    
    doInit : function(component, event, helper) {
        
        var cmpTarget = component.find('exampleModal');
        console.log('init for expense:',cmpTarget);
        $A.util.removeClass(cmpTarget, 'hideDiv');
        component.set("v.isActive",true);
        var ClientId=component.get("v.client.Id");
        
        var action = component.get("c.ClientExpRecord");
        action.setParams({
            clientId : ClientId
        });
        action.setCallback(this, function(a) {
            var state  = a.getState();
            var expRec=a.getReturnValue();
            component.set("v.expRec",expRec);
        });
        $A.enqueueAction(action);

        
        
    },
    
    saveAndCloseBtn : function(component, event, helper) {
        // Display a "toast" status message
        var resultsToast = $A.get("e.force:showToast");
        resultsToast.setParams({
            "title": "Save Success!",
            type: 'success',
            "message": "Expense Has been Saved"           
        });
        resultsToast.fire();
        // Close the action panel
        helper.hideExampleModal(component);
    },
    
    hideExampleModal : function(component, event, helper) {
        helper.hideExampleModal(component);
    },
    
    
    handleSubmit : function(component, event, helper)
    { 
       debugger;
        var msg = "";
        var ispresent=false;   
        var priowner = component.find("owner").get("v.value");
         
        var freqcy = component.find("freq").get("v.value");
        var growth = component.find("yeargrowth").get("v.value");
        var amn = component.find("inQuantity").get("v.value");
        var sDate = component.find("stDate").get("v.value");
        var eDate = component.find("endDate").get("v.value");
        
        var getRecordEdit=component.get("v.editRecordExpense");
        var expRec=component.get("v.expRec");
        if(getRecordEdit==false){
            
            for (var i = 0; i < expRec.length; i++) { 
                
                if(priowner==expRec[i].Name){
                    event.preventDefault();
                    msg = "Expense name with this name already exist."
                    helper.showAlertEmptyInvalidVal(component,msg); 
                    ispresent=true;
                    break;
                    
                }
            }
        }
        else if(getRecordEdit==true){
            var Eid=component.get("v.expRecName");
            if(priowner==Eid){
                ispresent=false;
            }
            else{
                for (var i = 0; i < expRec.length; i++) { 
                    
                    if(priowner==expRec[i].Name){
                        event.preventDefault();
                        msg = "Expense name with this name already exist."
                        helper.showAlertEmptyInvalidVal(component,msg); 
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
            
        if($A.util.isUndefinedOrNull(priowner) || priowner == "" || $A.util.isUndefinedOrNull(freqcy) || freqcy == "" ||  $A.util.isUndefinedOrNull(growth) || growth == "" || $A.util.isUndefinedOrNull(amn) || amn =="" || amn == 0  )
        {
           // status3 = 0;
            event.preventDefault();
            msg = "Please fill mandatory fields."
            helper.showAlertEmptyInvalidVal(component,msg);  
            return;
        }
        else if(eDate < sDate){
           // status3 = 0;
            event.preventDefault();
            msg = "	End Date cannot be less than the Start Date"
            helper.showAlertEmptyInvalidVal(component,msg);    
        }
            else if (amn <0 ){
               // status3 =0;
                event.preventDefault();
                msg = " Amount after tax per pay check($) cannot be negative."
                helper.showAlertEmptyInvalidVal(component,msg);
            }
                else if ( growth <0 ){
                  //  status3 =0;
                    event.preventDefault();
                    msg = " Yearly growth (%) cannot be negative."
                    helper.showAlertEmptyInvalidVal(component,msg);
                }
        
                    else
                    {
                       // status3 = 1;
                    }
        
        if (component.get("v.isTaxDeduction")){
            if(component.find("taxbenfit").get("v.value") < 0){
               // status3 = 0;
                event.preventDefault();
                msg= "What % of contribution bring tax benefits? canot is negative"
                helper.showAlertEmptyInvalidVal(component,msg); 
                return;
            }
            else if(component.find("deducationtax").get("v.value") < 0){
              //  status3= 0;
                event.preventDefault();
                msg = "Max yearly tax deduction allowed ($ )? canot is negative"
                helper.showAlertEmptyInvalidVal(component,msg);  
                return;
            }
        }
        else
        {
            //status3 = 1;
        }
        }
    }, 
    handleChange: function (cmp, event) {
        var changeValue = event.getParam("value");
        alert(changeValue);
        
    },
    loadOptions: function (component, event, helper) {
        var opts = [
            { value: "None", label: "None" },
            { value: "Auto and Transportation", label: "Auto and Transportation" },
            { value: "Bills and Utilities", label: "Bills and Utilities" },
            { value: "Bussiness Expense", label: "Bussiness Expense" },
            { value: "Business Services", label: "Business Services" },
            { value: "Education", label: "Education" },
            { value: "Entertainment", label: "Entertainment" },
            { value: "Fees and Charges", label: "Fees and Charges" },
            { value: "Fee and Dining", label: "Fee and Dining" },
            { value: "Gifts and Donations", label: "Gifts and Donations" },
            { value: "Home", label: "Home" },
            { value: "Insurance", label: "Insurance" },
            { value: "Investment Expense", label: "Investment Expense" },
            { value: "Miscellaneous", label: "Miscellaneous" },
            { value: "Personal Care", label: "Personal Care" },
            { value: "Kids", label: "Kids" },
            { value: "Business", label: "Business" },
            { value: "Travel", label: "Travel" },
            { value: "Pets", label: "Pets" },
            { value: "Finance", label: "Finance" },
            { value: "Taxes", label: "Taxes" }
            
        ];
        component.set("v.options1",opts);
        
        
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
    handleIsMonthly: function(component, event){
        
        if(event.target.id=="yesMonthly"){
            
            component.set("v.isMonthly",true);
            
        }
        else if(event.target.id=="noMonthly"){
            
            component.set("v.isMonthly",false);
        }
    },
    recordLoaded: function(component,event,helper){
   		
        var expId = component.get("v.expId");
        console.log('expId'+expId)
         
        if(!(expId=="" || $A.util.isUndefinedOrNull(expId))){
            var action = component.get("c.Budgetlist");
            action.setParams({
                expId : expId
            });
            
            action.setCallback(this, function(a) {
                var ExpRec=a.getReturnValue();
                component.set("v.Expensedata",ExpRec);               
                var tabledata = component.get("v.Expensedata");
                var taxDeduction =tabledata.Does_contribution_bring_tax_benifit__c;
                console.log('taxDeduction',taxDeduction);
                if (taxDeduction){
                    component.set("v.isTaxDeduction",true);              
                    component.set("v.getYes",true);
                }
                else{
                    
                    component.set("v.getNo",true);
                }
                var ismonthly =tabledata.Does_tax_benifit_realize_really__c;
                console.log('ismonthly',ismonthly);
                if (ismonthly){
                    component.set("v.isMonthly",true);
                }
                else{
                    component.set("v.isMonthly",false);
                    
                }
                
            });
            var action2 = component.get("c.ClientNameExpRecord");
            action2.setParams({
                expId : expId
            });
            action2.setCallback(this, function(a) {
                var state  = a.getState();
                var expRecName=a.getReturnValue();
                if(state==='SUCCESS'){
                    component.set("v.expRecName",expRecName);
                     
                }
                
            });
            $A.enqueueAction(action2);

            $A.enqueueAction(action);      
 
        
      /*  var expId = component.get("v.expId");
        if(!(expId=="" || $A.util.isUndefinedOrNull(expId))){
             var recUi = event.getParam("recordUi");
        console.log(JSON.stringify(recUi));
        var namespace = component.get("v.namespace");
        var taxDeduction=recUi.record.fields["Does_contribution_bring_tax_benifit__c"].value;
        console.log(taxDeduction)
        if (taxDeduction){
            component.set("v.isTaxDeduction",true);
            component.set("v.getYes",true);
        }
        
        else{
            component.set("v.getNo",true);
            
        }
        var ismonthly=recUi.record.fields["Does_tax_benifit_realize_really__c"].value;
        console.log(ismonthly)
        
        if (ismonthly){
            component.set("v.isMonthly",true);
        }
        else{
            component.set("v.isMonthly",false);
            
        }
        }    */
        }
        }
})