({
    closeModel: function(component, event, helper) {
        // Set isModalOpen attribute to false  
        component.set("v.closeModal", false);
    },
    doInit: function(component, event, helper) {
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
        $A.enqueueAction(action);
    },
    createExpenseTransactionRecord : function(component, event, helper) {   
        component.set("v.addExpenseTransaction",true);
        component.set("v.expenseTransaction",event.getSource().get("v.value"));
        component.set("v.isActive",true)
        //alert(event.getSource().get("v.value"));
               
    },
     onClickEditExpenseTransaction : function(component,event,helper) {
         var recId=event.getSource().get("v.value");
        // alert(recId);
        // 
        
        component.set("v.showModalExpenseTransaction",true);
        component.set("v.editrecidTransactionExpense",recId);
    },
    onClickDeleteTransaction : function(component,event,helper) {  
        
        var action2 = component.get("c.deleteTransaction");
       // var budgeteve1 = component.get("v.getExpenseBudgetId"); 
        action2.setParams({
            'transactionId' :event.getSource().get("v.value")
        });
        
        action2.setCallback(this, function(response) {      
           // var saveIncomeEvent = component.getEvent("saveIncomeEvent");
          //  saveIncomeEvent.setParam("clientFromEvent", component.get("v.client"));
          //  saveIncomeEvent.fire();
            var resultsToast = $A.get("e.force:showToast");
            resultsToast.setParams({
                "title": "Delete Success!",
                type: 'success',
                "message": "Record has been deleted successfully"           
            });
            resultsToast.fire();
             helper.helperMethod(component);   
        });     
        $A.enqueueAction(action2);        
    },
})