({
    
    doInit : function(component, event, helper) {
        
        var cmpTarget = component.find('exampleModal');
        console.log('init for expense:',cmpTarget);
        $A.util.removeClass(cmpTarget, 'hideDiv');
        component.set("v.isActive",true);
        
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
        
        var status3 = 0;
        
        var msg = "";
        var priowner = component.find("owner").get("v.value");
        // console.log('owner',priowner);
        var myselect1 =component.find("mySelect").get("v.value");
        console.log('myselect',myselect1);
        var freqcy = component.find("freq").get("v.value");
        var growth = component.find("yeargrowth").get("v.value");
        var amn = component.find("inQuantity").get("v.value");
        var sDate = component.find("stDate").get("v.value");
        var eDate = component.find("endDate").get("v.value");
               
        if($A.util.isUndefinedOrNull(priowner) || priowner == "" || $A.util.isUndefinedOrNull(freqcy) || freqcy == "" ||  $A.util.isUndefinedOrNull(growth) || growth == "" || $A.util.isUndefinedOrNull(amn) || amn =="" || amn == 0  )
        {
            status3 = 0;
            event.preventDefault();
            msg = "Please fill mandatory fields."
            helper.showAlertEmptyInvalidVal(component,msg);       
        }
        else if(eDate < sDate){
            status3 = 0;
            event.preventDefault();
            msg = "	End Date cannot be less than the Start Date"
            helper.showAlertEmptyInvalidVal(component,msg);    
        }
          else if (amn <0 ){
                status3 =0;
                 event.preventDefault();
                msg = " Amount after tax per pay check($) cannot be negative."
                helper.showAlertEmptyInvalidVal(component,msg);
            }
        else if ( growth <0 ){
                status3 =0;
                 event.preventDefault();
                msg = " Yearly growth (%) cannot be negative."
                helper.showAlertEmptyInvalidVal(component,msg);
            }
        
            else
            {
                status3 = 1;
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
        // var priowner = component.find("owner").get("v.value");
                 // console.log('owner',priowner);
          //opts.value=component.find("owner").get("v.value");
           //system.log('mySelect',opts);
          // var sel1=component.find("selectedValue").get("v.value");
        // component.find(elementId).set("v.options", opts);
         
         
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
        var recUi = event.getParam("recordUi");
        console.log(recUi);
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
    }
})