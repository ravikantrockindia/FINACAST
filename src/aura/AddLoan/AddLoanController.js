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
    /*  console.log(priowner);
        console.log(ap);
        console.log(amon);
        console.log(amn);
        console.log(pf);*/
        if($A.util.isUndefinedOrNull(priowner) || priowner == "" || $A.util.isUndefinedOrNull(ap) || ap == "" ||  $A.util.isUndefinedOrNull(amon) || amon == "" ||amon==0 || $A.util.isUndefinedOrNull(amn) || amn =="" || $A.util.isUndefinedOrNull(pf) || pf == "" )
        {
            status3 = 0;
            event.preventDefault();
            msg = "Please fill mandatory fields."
            helper.showAlertEmptyInvalidVal(component,msg);       
        }
        else
        {
            status3 = 1;
        }
    }, 
        
})