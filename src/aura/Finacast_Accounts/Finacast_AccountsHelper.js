({
    fetchTransactionList:function(component, event, helper){
        debugger;
        var action=component.get('c.getTransctionList');
        action.setParams({
            AccountId: component.get('v.Tid')
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var data=JSON.parse(JSON.stringify(response.getReturnValue()));
                var data1=JSON.stringify(response.getReturnValue());
                component.set("v.data", data);
            }
            else if (state === "ERROR") {
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
      showAlertEmptyInvalidVal : function(component,msg)
    {
        var toastEvent = $A.get("e.force:showToast");
        toastEvent.setParams({
            type : "error",
            "title": "Error!",
            "message": msg
        });
        toastEvent.fire();
        
    },
      
})