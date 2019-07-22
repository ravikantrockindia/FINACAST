({
	 doInit : function(component, event, helper) { 
         
          var clnt = component.get("v.cid");
        console.log('clntId',clnt);
        var clntId;
        
        if($A.util.isUndefinedOrNull(clnt) ){
            clntId = "init";
            
        }
        else
        {
            clntId = clnt;
        }
        console.log("sss-------------------------"+clntId);
        
        var action = component.get("c.getBudget");
        action.setParams({
            clientId : clntId,
            
        });
        action.setCallback(this, function(response) {
            try {
                var state = response.getState();
            if (state === "SUCCESS") {
                var data = response.getReturnValue();
              //  console.log("--->"+JSON.stringify(data));
                component.set("v.selectedClient" , data.client.Id);
                }
               
                   
        component.set("v.addTransaction",false);
        component.set("v.addExpenseTransaction",false);
        component.set("v.addLoanTransaction",false);  
        component.set("v.showModalIncome",false);
        component.set("v.showModalExpense",false);
        component.set("v.showModalLoan",false);
        component.set("v.showModalGoal",false);
        component.set("v.showModalIncomeTransaction",false);
        component.set("v.showModalExpenseTransaction",false);
        component.set("v.showModalLoanTransaction",false);
      
         
      }
            catch(e){
                           
            }
        });
        $A.enqueueAction(action); 
        
    },
         
     
  
  onChange: function(component, event, helper) {  
        
    },
    
      createTransactionRecord : function(component, event, helper) {   
        component.set("v.addTransaction",true);
        component.set("v.Transaction",event.getSource().get("v.value"));
        console.log('the transaction value is as follows:', event.getSource().get("v.value"));               
    },
    createExpenseTransactionRecord : function(component, event, helper) {   
        component.set("v.addExpenseTransaction",true);
        component.set("v.expenseTransaction",event.getSource().get("v.value"));
        console.log('the transaction value is as follows:', event.getSource().get("v.value"));               
    },
    createLoanTransactionRecord : function(component, event, helper) {   
        component.set("v.addLoanTransaction",true);
        component.set("v.loanTransaction",event.getSource().get("v.value"));
        console.log('the transaction value is as follows:', event.getSource().get("v.value"));               
    },
    handleComponentEvent : function(cmp, event) {
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
        
    },
    handleComponentEventExpense : function(cmp, event) {
        var budgeteve1 = cmp.get("v.getExpenseBudgetId");;      
        console.log('fghjkl' , budgeteve1);
        var action = cmp.get("c.getTransaction");
        action.setParams({
            budgetId : budgeteve1
        });
        action.setCallback(this, function(response) {    
            var beve1 = response.getReturnValue();
            console.log('gdhj' , beve1);    
            cmp.set("v.addExpenseTrans" , beve1);
        });     
        $A.enqueueAction(action);
        
    },
    handleComponentEventLoan : function(cmp, event) {
        var loanAccount = cmp.get("v.getLoanId");;      
        console.log('fghjkl' , loanAccount);
        var action = cmp.get("c.getLoanTransaction");
        action.setParams({
            financialAccountId : loanAccount
        });
        action.setCallback(this, function(response) {    
            var loanAcc = response.getReturnValue();
            console.log('gdhj' , loanAcc);    
            cmp.set("v.addLoanTrans" , loanAcc);
        });     
        $A.enqueueAction(action);
        
    },
        
 
    onClickEditIncomeTransaction : function(component,event,helper) {
        component.set("v.showModalIncomeTransaction",true);
        component.set("v.editrecidTransaction",event.getSource().get("v.value"));
    },
        
    onClickEditExpenseTransaction : function(component,event,helper) {
        component.set("v.showModalExpenseTransaction",true);
        component.set("v.editrecidTransactionExpense",event.getSource().get("v.value"));
    },

    onClickEditLoanTransaction : function(component,event,helper) {
        component.set("v.showModalLoanTransaction",true);
        component.set("v.editrecidTransactionLoan",event.getSource().get("v.value"));
    },
    
    onClickDeleteTransaction : function(component,event,helper) {  
        
        var action2 = component.get("c.deleteTransaction");
        action2.setParams({
            'transactionId' : event.getSource().get('v.value')
        });
        
        action2.setCallback(this, function(response) {      
            var saveIncomeEvent = component.getEvent("saveIncomeEvent");
            saveIncomeEvent.setParam("clientFromEvent", component.get("v.client"));
            saveIncomeEvent.fire();
            var resultsToast = $A.get("e.force:showToast");
            resultsToast.setParams({
                "title": "Delete Success!",
                type: 'success',
                "message": "Record has been deleted successfully"           
            });
            resultsToast.fire();
        });     
        $A.enqueueAction(action2);        
    },
    
})