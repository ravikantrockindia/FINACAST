({
	helperMethod : function(component) {
		 var budgeteve1 = component.get("v.getExpenseBudgetId");    
       //alert( budgeteve1);
        var action = component.get("c.getTransaction");
        action.setParams({
            budgetId : budgeteve1
        });
        action.setCallback(this, function(response) {    
            var beve1 = response.getReturnValue();
            console.log('gdhj' , beve1);    
            component.set("v.addExpenseTrans" , beve1);
        });     
        var saveIncomeEvent = component.getEvent("saveIncomeEvent");
        saveIncomeEvent.setParam("clientFromEvent", component.get("v.client"));
        saveIncomeEvent.fire();
        $A.enqueueAction(action);
	}
})