({
    showFieldsValue : function(component,helper) {
          component.set("v.Spinner",true)
        var s = component.get("v.selectedValue");
        
        //to tell if it is the first load and set listItems again only then
        //to maintain selection on the component UI. 
  		var flag = false;
        if(component.get("v.scene") == "init") flag = true;
            
            var action = component.get("c.getUserScenarios"); 
        action.setParams({
            clientId : component.get("v.cid"),
            sceneId : component.get("v.scene")
        });      
        action.setCallback(this, function(response){
            //console.log("resp: ",JSON.stringify(response.getReturnValue()));
			component.set("v.Spinner",false);  
            if($A.util.isUndefinedOrNull(response.getReturnValue().userScenarioIncome)) {
                component.set("v.income", [{'Name': 'Income 1', 'Amount' : '0'}]); 
                component.set("v.incomeAmount", 0);}
            else {component.set("v.income", response.getReturnValue().userScenarioIncome);
                  component.set("v.incomeAmount", response.getReturnValue().totalIncomeAmount);}
            
            if($A.util.isUndefinedOrNull(response.getReturnValue().userScenarioExpense)) {
                component.set("v.expense", [{'Name': 'Expense 1', 'Amount' : '0'}]); 
                component.set("v.expenseAmount", 0);}
            else {component.set("v.expense", response.getReturnValue().userScenarioExpense); 
                  component.set("v.expenseAmount", response.getReturnValue().totalExpenseAmount);}
            
            //component.set("v.income", response.getReturnValue().userScenarioIncome); 
            //component.set("v.expense", response.getReturnValue().userScenarioExpense); 
            
            if($A.util.isUndefinedOrNull(response.getReturnValue().userSceneSave))
                component.set("v.savings",null);
            else {
                component.set("v.savings", response.getReturnValue().userSceneSave);
                  component.set("v.savingsAmount", response.getReturnValue().totalSaveAmount);
                  component.set("v.savingProgress", 70);
                 }
            
            if($A.util.isUndefinedOrNull(response.getReturnValue().userScenarioGoal)){
                component.set("v.goal", null); 
                component.set("v.goalAmount", 0)}
            else{
                component.set("v.goal", response.getReturnValue().userScenarioGoal); 
                component.set("v.goalAmount", response.getReturnValue().totalGoalAmount);
                component.set("v.goalProgress", 75);
              //   component.set("v.goalProgress", Math.round(response.getReturnValue().totalGoalAmount)/100000*100);
            }
            
            if($A.util.isUndefinedOrNull(response.getReturnValue().userScenarioLoan)){
                component.set("v.loan",null); 
                component.set("v.loanAmount", 0)
            }
            else{
                component.set("v.loan", response.getReturnValue().userScenarioLoan); 
                component.set("v.loanAmount", response.getReturnValue().totalLoanAmount);
                 component.set("v.loanProgress", 60);
            }
            
                //   component.set("v.loan",[{'Name': 'Loan 1', 'Amount' : '0'}]);        
            //component.set("v.incomeAmount", response.getReturnValue().totalIncomeAmount);
            //component.set("v.expenseAmount", response.getReturnValue().totalExpenseAmount);
            
         //  component.set("v.savingProgress", Math.round(response.getReturnValue().totalSaveAmount)/1000000*100);
             // alert('jj'+component.get("v.savingProgress"));
            //component.set("v.loan",  response.getReturnValue().userScenarioLoan);
            //component.set("v.loanAmount", response.getReturnValue().totalLoanAmount);
            //component.set("v.creditcard",  response.getReturnValue().userScenarioCard);
            //component.set("v.cardAmount", response.getReturnValue().totalCardAmount);
            component.set("v.primaryOwner", response.getReturnValue().primaryOwner);
            
            component.set("v.data2", JSON.parse(response.getReturnValue().response));
            
           // if(flag)
            component.set("v.scenarioList", response.getReturnValue().scenarioList);
            
            
            
            //if(component.get("v.scene") == 'init')
            component.set("v.scene", response.getReturnValue().scenarioId);
            //console.log('Inside apex response: '+ response.getReturnValue().scenarioId);   
            
            var limIncome = Number  ((response.getReturnValue().totalIncomeAmount)*2);
            if(limIncome == 0 || $A.util.isUndefinedOrNull(response.getReturnValue().totalIncomeAmount)) {
                component.set("v.incomeLimit", 5000);
            }
            else {
                component.set("v.incomeLimit",limIncome);
            }
            
            var limExpense = Number  ((response.getReturnValue().totalExpenseAmount)*2);
            if(limExpense == 0 || $A.util.isUndefinedOrNull(response.getReturnValue().totalExpenseAmount)) {
                component.set("v.expenseLimit", 5000);
            }
            else {
                component.set("v.expenseLimit",limExpense);
            }
            
            var limLoan = Number  ((response.getReturnValue().totalLoanAmount)*2);
            if(limLoan == 0 || $A.util.isUndefinedOrNull(response.getReturnValue().totalLoanAmount)) {
                component.set("v.loanLimit", 5000);
            }
            else {
                component.set("v.loanLimit",limLoan);
            }
            
            /*var limCard = Number  ((response.getReturnValue().totalCardAmount)*2);
            if(limCard == 0 || $A.util.isUndefinedOrNull(response.getReturnValue().totalCardAmount)) {
                component.set("v.creditCardLimit",5000);
            }
            else {
                component.set("v.creditCardLimit",limCard);
            }*/
            
            var limSaving = Number (response.getReturnValue().totalSaveAmount)*2;
            if(limSaving == 0) {
                component.set("v.savingLimit", 5000);
            }
            else {
                component.set("v.savingLimit",limSaving);
            }
            var limGoal = Number ( response.getReturnValue().totalGoalAmount)*2;
            if(limGoal == 0) {
                component.set("v.goalLimit", 5000);
            }
            else {
                component.set("v.goalLimit",limGoal);
            }
  
            var sliderIncome = new Slider('#incomeSlider001', {
                formatter: function(value) {
                    component.set("v.val",value);
                    
                    return 'Amount: '+value;  
                }
            });
            
            var amount = component.get("v.incomeAmount");
            sliderIncome.setValue(amount);
            
            var sliderExpense = new Slider('#ExpenseSlider001', {
                formatter: function(value) {
                    component.set("v.expAmt",value);
                    return 'Amount: '+value;
                }
            });
            var Expenseamount = component.get("v.expenseAmount");
            sliderExpense.setValue(Expenseamount);
            
          /*  var sliderGoal = new Slider('#GoalSlider001', {
                formatter: function(value) {
                   	component.set("v.goalAmount",value);
                    return 'amount: '+value;
                }
            });
             var Goalamount = component.get("v.goalAmount");
             sliderGoal.setValue(Goalamount);   */
        });
        $A.enqueueAction(action); 
    },
    
    hideExampleModal : function(component) {
        component.set("v.recordName", "");
        component.set("v.goalButtonStatus",false);
        component.set("v.savingButtonStatus",false);
        component.set("v.debtButtonStatus",false);
    },
    
    showAlertValidation : function(component, msg) { 
        var toastEvent = $A.get("e.force:showToast");
        toastEvent.setParams({
            type : "Error",
            "title": "Error!",
            "message": msg
        });
        toastEvent.fire();  
    },
    
    sliderHelper:function(component,helper){   
    /*    var sliderIncome = new Slider('#incomeSlider001', {
            formatter: function(value) {
                var amount = component.get("v.incomeAmount");
                document.getElementById('incomeSlider001').setAttribute('data-slider-value',amount) ;
        	    return 'amount: '+value;
            }
        });
        
        var sliderExpense = new Slider('#ExpenseSlider001', {
            formatter: function(value) {
                var amount = component.get("v.expenseAmount");
               // document.getElementById('ExpenseSlider001').setAttribute('data-slider-value',amount) ;
                return 'amount: '+value;
            }
        });  */
        //sliderIncome.setValue(component.get("v.incomeAmount"));
        //sliderExpense.setValue(component.get("v.expenseAmount"));
        
    }
})