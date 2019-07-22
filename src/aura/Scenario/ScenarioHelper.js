/*
 * created by : avneet kaur
**/

({
    showAlertValidation : function(component, msg) { 
        var toastEvent = $A.get("e.force:showToast");
        toastEvent.setParams({
            type : "Error",
            "title": "Error!",
            "message": msg
        });
        toastEvent.fire();  
    },
    
    hideExampleModal : function(component) {
        component.set("v.recordName", "");
        component.set("v.goalButtonStatus",false);
        component.set("v.savingButtonStatus",false);
        component.set("v.debtButtonStatus",false);
    },
    
    showFieldsValue : function(component) {
        console.log("id in helper: ",component.get("v.client.Id"));
        console.log("client id: ",component.get("v.client.Id"));
        console.log("scene Id ic child: ",component.get("v.scene"));
        
        var action = component.get("c.getUserScenarios"); 
        action.setParams({
            clientId : component.get("v.client.Id"),
            sceneId : component.get("v.scene")
        });      
        action.setCallback(this, function(response){
            component.set("v.income", response.getReturnValue().userScenarioIncome); 
            component.set("v.expense", response.getReturnValue().userScenarioExpense); 
            console.log("resp: ",JSON.stringify(response.getReturnValue()));
            component.set("v.savings", response.getReturnValue().userSceneSave);
            component.set("v.goal", response.getReturnValue().userScenarioGoal); 
            component.set("v.goalAmount", response.getReturnValue().totalGoalAmount);
            component.set("v.incomeAmount", response.getReturnValue().totalIncomeAmount);
            component.set("v.expenseAmount", response.getReturnValue().totalExpenseAmount);
            component.set("v.savingsAmount", response.getReturnValue().totalSaveAmount);
            component.set("v.loan",  response.getReturnValue().userScenarioLoan);
            component.set("v.loanAmount", response.getReturnValue().totalLoanAmount);
            component.set("v.creditcard",  response.getReturnValue().userScenarioCard);
            component.set("v.cardAmount", response.getReturnValue().totalCardAmount);
            component.set("v.primaryOwner", response.getReturnValue().primaryOwner);
            
            var limIncome = Number  ((response.getReturnValue().totalIncomeAmount)*2);
            if(limIncome == 0 || $A.util.isUndefinedOrNull(response.getReturnValue().totalIncomeAmount)) {
                component.set("v.incomeLimit",5000);
            }
            else {
                component.set("v.incomeLimit",limIncome);
            }
            
            var limExpense = Number  ((response.getReturnValue().totalExpenseAmount)*2);
            if(limExpense == 0 || $A.util.isUndefinedOrNull(response.getReturnValue().totalExpenseAmount)) {
                component.set("v.expenseLimit",5000);
            }
            else {
                component.set("v.expenseLimit",limExpense);
            }
            
            var limLoan = Number  ((response.getReturnValue().totalLoanAmount)*2);
            if(limLoan == 0 || $A.util.isUndefinedOrNull(response.getReturnValue().totalLoanAmount)) {
                component.set("v.loanLimit",5000);
            }
            else {
                component.set("v.loanLimit",limLoan);
            }
            var limCard = Number  ((response.getReturnValue().totalCardAmount)*2);
            if(limCard == 0 || $A.util.isUndefinedOrNull(response.getReturnValue().totalCardAmount)) {
                component.set("v.creditCardLimit",5000);
            }
            else {
                component.set("v.creditCardLimit",limCard);
            }
            
            var limSaving = Number (response.getReturnValue().totalSaveAmount)*2;
            if(limSaving == 0) {
                component.set("v.savingLimit",5000);
            }
            else {
                component.set("v.savingLimit",limSaving);
            }
            var limGoal = Number ( response.getReturnValue().totalGoalAmount)*2;
            if(limGoal == 0) {
                component.set("v.goalLimit",5000);
            }
            else {
                component.set("v.goalLimit",limGoal);
            }
            component.set("v.parentInitialized", true);
            component.find("child").changeClient(component.get("v.client"),component.get("v.scene"));
        });
        $A.enqueueAction(action); 
    }
})