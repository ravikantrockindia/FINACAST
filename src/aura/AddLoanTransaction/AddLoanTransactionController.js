({
    doInit : function(component, event, helper) {
        var today = new Date();
        var datestart = today.getFullYear()+'/'+(today.getMonth()+1)+'/'+(today.getDate()+1); 
        component.set("v.maxDate",datestart);
        
        //alert(datestart);
      var cll = component.get("v.cid");
    // alert(cll);
         var action = component.get("c.getTransction"); 
         action.setParams({ 
                      clientId :    cll        
                          });
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") 
            {
           var data =  response.getReturnValue();
              //  alert('data------'+data);
                component.set("v.FinancialList",data);
            }    
        });
        $A.enqueueAction(action);
    },
    
    saveAndCloseBtn : function(component, event, helper) {
        // Display a "toast" status message
        var resultsToast = $A.get("e.force:showToast");
        resultsToast.setParams({
            "title": "Save Success!",
            type: 'success',
            "message": "Transactions has been Saved"                
        });
        resultsToast.fire();   
		helper.hideExampleModal(component);
        //helper.saveIncome(component);
        
    },
    
    hideExampleModal : function(component, event, helper) {
        helper.hideExampleModal(component);
        
    },
    
    handleSubmit : function(component, event, helper)
    { 
        
        var status1 = 0;
        
        var msg = "";
        
        var tdate = component.find("date").get("v.value");
         var type = component.find("type").get("v.value");
        //var tdest = component.find("dest").get("v.value");
        var tamt = component.find("amt").get("v.value");
        var tname = component.find("name").get("v.value");
        
        if($A.util.isUndefinedOrNull(type) || type == ""|| $A.util.isUndefinedOrNull(tname) || tname == ""|| $A.util.isUndefinedOrNull(tdate) || tdate == "" ||  $A.util.isUndefinedOrNull(tamt) || tamt =="" )
        {
            status1 = 0;
            event.preventDefault();
            msg = "Please fill mandatory fields."
            helper.showAlertEmptyInvalidVal(component,msg);       
        }
        else
        {
            status1 = 1;
        }
    },  
    
})