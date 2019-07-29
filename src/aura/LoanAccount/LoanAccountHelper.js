({
	getAccounts : function(component) {
		var action=component.get('c.returnDebtAccount');
        action.setParams({ recordId : component.get("v.recordId") });
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                 var spinner = component.find("mySpinner");
                $A.util.removeClass(spinner, "slds-show");
                
                $A.util.addClass(spinner, "slds-hide");
                var list=JSON.stringify(response.getReturnValue());
                console.log(list.search("Finsol__"))
             var list1= list.replace("Finsol__","")
              console.log(list1)
                component.set("v.FinancialAccountList",JSON.parse(list1))
                console.log(JSON.stringify(component.get("v.FinancialAccountList")))
               // component.set("v.FinancialAccountList",response.getReturnValue())
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

	}
})