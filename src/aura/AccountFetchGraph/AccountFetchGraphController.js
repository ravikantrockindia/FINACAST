({
	handleComponentEvent : function(cmp, event, helper) {
		var budgeteve = cmp.get("v.getBudgetId");;      
        console.log('fghjkl' , budgeteve);
        var action = cmp.get("c.getTransaction");
        action.setParams({
            budgetId : budgeteve
        });
        action.setCallback(this, function(response) {    
            var beve = response.getReturnValue();
            console.log('gdhj' , beve);
            cmp.set("v.addTrans", beve); 
        });     
        $A.enqueueAction(action);

	}
})