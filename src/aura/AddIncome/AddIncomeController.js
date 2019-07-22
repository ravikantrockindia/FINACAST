({
    doInit : function(component, event, helper) {
         console.log('the helper is', component.get("v.accRecType"));
        var cmpTarget = component.find('exampleModal');
        $A.util.removeClass(cmpTarget, 'hideDiv');
        component.set("v.isActive",true);
        
    },
    
    saveAndCloseBtn : function(component, event, helper) {
        // Display a "toast" status message
        var resultsToast = $A.get("e.force:showToast");
        resultsToast.setParams({
            "title": "Save Success!",
            type: 'success',
            "message": "Income Has been Saved"           
        });
        resultsToast.fire();   
		helper.hideExampleModal(component);
     console.log( 'value',event.getSource().get("v.value"));   
    },
    
    hideExampleModal : function(component, event, helper) {
        helper.hideExampleModal(component);
        
    },
    
    handleSubmit : function(component, event, helper)
    { 

        var msg = "";        
        var priowner = component.find("owner").get("v.value");
        var freqcy = component.find("freq").get("v.value");
        var growth = component.find("yeargrowth").get("v.value");
        var amn = component.find("inQuantity").get("v.value");       
        var grate = component.find("rate").get("v.value");
        var sDate = component.find("stDate").get("v.value");
        var eDate = component.find("endDate").get("v.value");
        console.log('owner',priowner);
         console.log('frequency',freqcy);
         console.log('growth',growth);
         console.log('amount',amn);
         console.log('rate',grate);
        
        if($A.util.isUndefinedOrNull(priowner) || priowner == "" || $A.util.isUndefinedOrNull(sDate) || sDate == "" || $A.util.isUndefinedOrNull(eDate) || eDate == "" || $A.util.isUndefinedOrNull(freqcy) || freqcy == "" ||  $A.util.isUndefinedOrNull(growth) || growth == "" || $A.util.isUndefinedOrNull(amn) || amn ==""  || $A.util.isUndefinedOrNull(grate) || grate == "" )
        {
            
            event.preventDefault();
            msg = "Please fill mandatory fields."
            helper.showAlertEmptyInvalidVal(component,msg);       
        }
        else if(eDate < sDate ){
            
            event.preventDefault();
            msg = "	End Date cannot be less than the Start Date"
            helper.showAlertEmptyInvalidVal(component,msg);    
        }
            else if (amn <0 ){
               
                 event.preventDefault();
                msg = " Amount after tax per pay check($) cannot be negative."
                helper.showAlertEmptyInvalidVal(component,msg);
            }
        else if ( growth <0 ){
               
                 event.preventDefault();
                msg = " Yearly growth (%) cannot be negative."
                helper.showAlertEmptyInvalidVal(component,msg);
            }
        else if ( grate <0 ){
               
                 event.preventDefault();
                msg = " Approximate total income tax rate (%) cannot be negative."
                helper.showAlertEmptyInvalidVal(component,msg);
            }
        
        
        else
        {
           
        }
    },  
    
})