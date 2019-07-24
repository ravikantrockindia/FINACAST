({
    doInit : function(component, event, helper) {
        console.log('the helper is', component.get("v.accRecType"));
        var cmpTarget = component.find('exampleModal');
        $A.util.removeClass(cmpTarget, 'hideDiv');
        component.set("v.isActive",true);
        
    },
    
    saveAndCloseBtn : function(component, event, helper) {
        // Display a "toast" status message
        component.set("v.isActive",false);
        console.log("clientId from loan",component.get("v.client"))
        
        var resultsToast = $A.get("e.force:showToast");
        resultsToast.setParams({
            "title": "Save Success!",
            type: 'success',
            "message": "Loan Has been Saved"           
        });
        
        resultsToast.fire(); 
        
        helper.hideExampleModal(component);
        //console.log( 'value',event.getSource().get("v.value"));   
    },
    
    hideExampleModal : function(component, event, helper) {
        helper.hideExampleModal(component);
        
    },
    
    handleSubmit : function(component, event, helper)
    { 
        
        var status3 = 0;
        
        var msg = "";
        
        var priowner = component.find("owner").get("v.value");
        var ap = component.find("apr").get("v.value");
        var amon = component.find("amount").get("v.value");
        var amn = component.find("inQuantity").get("v.value");
        var pf = component.find("payfreq").get("v.value");
        
        if($A.util.isUndefinedOrNull(priowner) || priowner == "" || $A.util.isUndefinedOrNull(ap) || ap == "" ||  $A.util.isUndefinedOrNull(amon) || amon == "" ||amon==0 || $A.util.isUndefinedOrNull(amn) || amn =="" || $A.util.isUndefinedOrNull(pf) || pf == "" )
        {
            status3 = 0;
            event.preventDefault();
            msg = "Please fill mandatory fields."
            helper.showAlertEmptyInvalidVal(component,msg);       
        }
        else if (amon <0 ){
            status3 =0;
            event.preventDefault();
            msg = "Payment Amount cannot be negative."
            helper.showAlertEmptyInvalidVal(component,msg);
        }
            else if (amn <0 ){
                status3 =0;
                event.preventDefault();
                msg = "Loan Amount cannot be negative."
                helper.showAlertEmptyInvalidVal(component,msg);
            }
                else if (ap <0 ){
                    status3 =0;
                    event.preventDefault();
                    msg = "APR cannot be negative."
                    helper.showAlertEmptyInvalidVal(component,msg);
                }
        if (component.get("v.isTaxDeduction")){
            if(component.find("taxbenfit").get("v.value") < 0){
                status3 = 0;
                event.preventDefault();
                msg= "What % of contribution bring tax benefits? canot is negative"
                helper.showAlertEmptyInvalidVal(component,msg);    
            }
            else if(component.find("deducationtax").get("v.value") < 0){
                status3= 0;
                event.preventDefault();
                msg = "Max yearly tax deduction allowed ($ )? canot is negative"
                helper.showAlertEmptyInvalidVal(component,msg);    
            }
        }
        
        
        else
        {
            status3 = 1;
        }
    }, 
    handleRadio: function(component, event) {
        // component.set("v.displaySection" ,  true);
        
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
        debugger;
        var recUi = event.getParam("recordUi");
        console.log(recUi);
        var taxDeduction=recUi.record.fields["Do_you_get_tax_benefit_from_interest_pay__c"].value;
        console.log(taxDeduction)
        if (taxDeduction){
            component.set("v.isTaxDeduction",true);
            component.set("v.getYes",true);
        }
        else{
            component.set("v.getNo",true);
            
        }
        var ismonthly=recUi.record.fields["Do_tax_benefits_realize_monthly__c"].value;
        console.log(ismonthly)
        if (ismonthly){
            component.set("v.isMonthly",true);
        }
        else{
            component.set("v.isMonthly",false);
            
        }
    }
    
})