({
    showToast: function(component,title,variant, message){
        try{
            component.find('notifLib').showToast({
                "title":title,
                "message": message,
                "variant":variant,
                "mode":"dismissable"
            });
        }catch(e){
            console.log(e.message)
        }
    },
    getRecordTypeId: function(component){
        try{
            var action=component.get('c.getRecordTypeIds');
            action.setCallback(this, function(response) {
                var state = response.getState();
                if (state === "SUCCESS") {
                    var data=response.getReturnValue();
                    component.set("v.accountRecordTypeId", response.getReturnValue().account);
                    component.set("v.financialAccountRecordTypeId", response.getReturnValue().financialAccount)
                    
                    component.set("v.incomeRecordType", response.getReturnValue().income);
                    component.set("v.expenseRecordType", response.getReturnValue().expense);
                    
                    
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
        }catch(e){
            console.log(e)
        }
    },
})