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
                console.log('account',data.account)
                component.set("v.accountRecordTypeId", response.getReturnValue().account);
                console.log(component.get("v.accountRecordTypeId"))
                component.set("v.financialAccountRecordTypeId", response.getReturnValue().financialAccount)
                                console.log(JSON.stringify(component.get("v.financialAccountRecordTypeId")))

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
   /* getFinancialAccountRecordTypeId: function(component){
        var action=component.get('c.getFinancialAccountRecordType');
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                component.set("v.financialAccountRecordTypeId", response.getReturnValue());
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
    getIncomeRecordType: function(component){
        var action=component.get('c.getIncomeRecordType');
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                component.set("v.incomeRecordType", response.getReturnValue());
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
    getExpenseRecordType: function(component){
        var action=component.get('c.getExpenseRecordType');
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                component.set("v.expenseRecordType", response.getReturnValue());
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
    }*/
})