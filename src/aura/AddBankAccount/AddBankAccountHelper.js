({
    getAccounts : function(component) {
        
        var action=component.get('c.returnBankAccount');
        action.setParams({ recordId : component.get("v.recordId") });
        //alert('helper')
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var spinner = component.find("mySpinner");
                $A.util.removeClass(spinner, "slds-show");
                
                $A.util.addClass(spinner, "slds-hide");
                component.set("v.FinancialAccountList",response.getReturnValue())
            }
            else if (state === "ERROR") {
                var spinner = component.find("mySpinner");
                $A.util.removeClass(spinner, "slds-show");
                
                $A.util.addClass(spinner, "slds-hide");       
                var errors = response.getError();
                if (errors) {
                    if (errors[0] && errors[0].message) {
                        console.log("Error message: " + 
                                    errors[0].message);
                    }
                } else {
                    console.log("Unknown error");
                }
            }
        });
        
        $A.enqueueAction(action);
        
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