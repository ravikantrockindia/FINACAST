({
	helperMethod : function(component) {
		 var budgeteve1 = component.get("v.getExpenseBudgetId");    
       //alert( budgeteve1);
        var limit = component.get("v.initialRows");
            
       
        var action = component.get("c.getTransactionInfinite");
        action.setParams({
            budgetId : budgeteve1,
            rowOffset : 0,
            rowLimit :  limit
        });
        action.setCallback(this, function(response) {    
            var beve1 = response.getReturnValue().TransactionList;
           // console.log('gdhj' , beve1);    
            component.set("v.addExpenseTrans" , beve1);
            component.set("v.totalRows" , response.getReturnValue().totalRecords);
        });     
        var saveIncomeEvent = component.getEvent("saveIncomeEvent");
        saveIncomeEvent.setParam("clientFromEvent", component.get("v.client"));
        saveIncomeEvent.fire();
        $A.enqueueAction(action);
	},
    loadData : function(component){
        return new Promise($A.getCallback(function(resolve){
            var limit = component.get("v.initialRows");
            var offset = component.get("v.currentCount");
            var totalRows = component.get("v.totalRows");
            if(limit + offset > totalRows){
                limit = totalRows - offset;
            }
            //alert('kishan'+limit);
           // debugger;
            var budgeteve1 = component.get("v.getExpenseBudgetId");    
            var action = component.get("c.getTransactionInfinite");
            action.setParams({
                budgetId : budgeteve1,
                rowOffset : offset,
                rowLimit :  limit
            });
            action.setCallback(this,function(response){
                
                var state = response.getState();
                var newData = response.getReturnValue().TransactionList;
                // play a for each loop on list of new accounts and set Account URL in custom 'accountName' field
                
                resolve(newData);
                var currentCount = component.get("v.currentCount");
                currentCount += component.get("v.initialRows");
               // alert('jj'+currentCount);
                // set the current count with number of records loaded 
                component.set("v.currentCount",currentCount);
               
            });
            $A.enqueueAction(action);
        }));
    }
})