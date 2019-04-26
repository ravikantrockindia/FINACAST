//-----------------Works on component initialization  --------------------------------------//
({
    getmonthlybudget : function(component, event, helper) {
        helper.removeBackgroundColor(component, helper);
        var monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN",
                          "JUL", "AUG", "SEP", "OCT", "NOV", "DEC" ];
        var arr=[];
        var fromDate = new Date();
        var toDate = new Date();
        component.set("v.addIncome",false);
        component.set("v.addTransaction",false);
        component.set("v.addExpenseTransaction",false);
        component.set("v.addLoanTransaction",false);
        component.set("v.addExpense",false);
        component.set("v.addLoan",false);
        component.set("v.addGoals",false);
        component.set("v.showModalIncome",false);
        component.set("v.showModalExpense",false);
        component.set("v.showModalLoan",false);
        component.set("v.showModalGoal",false);
        component.set("v.showModalIncomeTransaction",false);
        component.set("v.showModalExpenseTransaction",false);
        component.set("v.showModalLoanTransaction",false);
        fromDate.setMonth(toDate.getMonth()-11);
        if(fromDate.getFullYear() != toDate.getFullYear()) {
            for(var i=fromDate.getMonth();i<=11;i++) {
                arr.push({"label":monthNames[i] + '\n'+ fromDate.getFullYear(),"val":monthNames[i] + ','+ fromDate.getFullYear() });
                
            }
            for(var i=0;i<=toDate.getMonth();i++) {
                arr.push({"label":monthNames[i] + '\n' + toDate.getFullYear(),"val":monthNames[i] + ',' + toDate.getFullYear()} );
                
            }
        }
        if(fromDate.getFullYear() == toDate.getFullYear()) {
            for(var i=fromDate.getMonth();i<=toDate.getMonth();i++) {
                arr.push({"label":monthNames[i] + '\n' + toDate.getFullYear(),"val":monthNames[i] + ',' + toDate.getFullYear()} );
                
            }
        }
        component.set("v.today",arr);
        var clnt = event.getParam("clientFromEvent");
        console.log('clntId',clnt);
        var clntId;
        
        if($A.util.isUndefinedOrNull(clnt) ){
            clntId = "init";
        }
        else
        {
            clntId = clnt.Id;
        }
        console.log("sss"+clntId);
        var action = component.get("c.getBudget");
        action.setParams({
            clientId : clntId,
            
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var data = response.getReturnValue();
                //console.log("--->"+JSON.stringify(data));
                
                for(var e in data.expenseRecList){
                    data.expenseRecList[e]["showSection"]=false;
                    data.expenseRecList[e]["iconName"]="utility:right";
                    data.expenseRecList[e]["ariavaluenow"] = data.transAmountExpense[data.expenseRecList[e].Id];
                    data.expenseRecList[e]["trExpense"] = data.sumOfExpense[data.expenseRecList[e].Id];
                }
                for(var e in data.incomeRecList){
                    data.incomeRecList[e]["showSection"]=false;
                    data.incomeRecList[e]["iconName"]="utility:right";
                    data.incomeRecList[e]["ariavaluenow"] = data.transAmount[data.incomeRecList[e].Id];
                    data.incomeRecList[e]["trIncome"] = data.sumOfIncome[data.incomeRecList[e].Id];
                   data.incomeRecList[e]["amount"]=data.incomeRecList[e].Amount__c;
                     console.log(' monthly+',data.incomeRecList[e]["amount"])
                    console.log('income amount' + data.incomeRecList[e].Amount__c*2);
            		if (data.incomeRecList[e].Frequency__c=="Semi Monthly"){
                        console.log('semi monthly+',data.incomeRecList[e]["amount"])
					data.incomeRecList[e]["amount"]=data.incomeRecList[e].Amount__c*2;
            		}
                    else if(data.incomeRecList[e].Frequency__c=="Bi-Weekly"){
                       data.incomeRecList[e]["amount"]=data.incomeRecList[e].Amount__c*2.16; 
                    }
                    else if(data.incomeRecList[e].Frequency__c=="Weekly"){
                       data.incomeRecList[e]["amount"]=data.incomeRecList[e].Amount__c*4.33; 
           
                    }
                }
                console.log('loan Rec list',data.loanRecList);
                for(var e in data.loanRecList){
                    data.loanRecList[e]["showSection"]=false;
                    data.loanRecList[e]["iconName"]="utility:right";
                    data.loanRecList[e]["ariavaluenow"] = data.transAmountLoan[data.loanRecList[e].Id];
                    console.log('aria value',data.loanRecList[e]["ariavaluenow"]);
                    data.loanRecList[e]["trLoan"] = data.sumOfLoan[data.loanRecList[e].Id];
                    console.log('total loan',data.loanRecList[e]["trLoan"]);
                    data.loanRecList[e]["amount"]=data.loanRecList[e].FinServ__PaymentAmount__c;
                    
                    console.log('loan amount' + data.loanRecList[e].FinServ__PaymentAmount__c*2);
            		if (data.loanRecList[e].FinServ__PaymentFrequency__c=="Quaterly"){
					data.loanRecList[e]["amount"]=data.loanRecList[e].FinServ__PaymentAmount__c*2;
            		}
                    else if(data.loanRecList[e].FinServ__PaymentFrequency__c=="Biweekly"){
                       data.loanRecList[e]["amount"]=data.loanRecList[e].FinServ__PaymentAmount__c*2.16; 
                    }
                    else if(data.loanRecList[e].FinServ__PaymentFrequency__c=="Weekly"){
                       data.loanRecList[e]["amount"]=data.loanRecList[e].FinServ__PaymentAmount__c*4.33; 
           
                    }
                }
                
                component.set("v.IncomeRecord", data);
                
                component.set("v.tInc",data.totalIncome);
                component.set("v.tExp",data.totalExpense);
                component.set("v.tLoan", data.totalLoan);
                component.set("v.addGoal",data.goalRecList);
                component.set("v.GoalDetails", response.getReturnValue()[0]);
                component.set("v.tGoal" , data.totalGoal);
                component.set("v.LoanRecord" , data.loanRecList);
                component.set("v.client",data.client);
                component.set("v.clientName",data.client);
                component.set("v.isPortalUser", data.isportalUser);
                component.set("v.parentInitialised", true);
                component.set("v.accountRecTypeName" , data.client.RecordType.DeveloperName)
                component.set("v.SumOfIncomeTrans" , data.TransSumValInc);
                component.set("v.SumOfExpenseTrans" , data.TransSumValExp);
                component.set("v.SumOfLoanTrans" , data.TransSumValLoan);
              
            }
        });
        $A.enqueueAction(action); 
        
    },
    //----------------------Method to add Income records-----------------------------//  
    createIncomeRecord : function(component, event, helper) {
        // console.log("showModalIncome" ,component.get("v.showModalIncome" ));
        var getName = event.getSource().get("v.name");
        var action = component.get("c.getRecordType");
        action.setParams({
            recName : getName
        });
        action.setCallback(this, function(response) {
            var recordType = response.getReturnValue();
            component.set("v.recordTypeId",recordType);
            component.set("v.addIncome",true);
            
        });  
        
        $A.enqueueAction(action);     
    },
    //----------------------------Method to Add Transaction Record------------------------//
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
    
    /* ceHandlerController.js */
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
    //----------------------Method to Add Expense records-----------------------------//
    createExpenseRecord : function(component , event , helper){
        console.log('the output is:');
        var getName = event.getSource().get("v.name");
        var action = component.get("c.getRecordType");
        action.setParams({
            recName : getName
        });
        action.setCallback(this, function(response) {
            var recordType = response.getReturnValue();
            component.set("v.recordTypeId",recordType);
            component.set("v.addExpense",true);
            
        });  
        
        $A.enqueueAction(action); 
    },
    //----------------------Method to Add Loan records-----------------------------//
    createLoanRecord : function(component , event , helper){
        var getName = event.getSource().get("v.name");
        var action = component.get("c.getLoanRecordType");
        action.setParams({
            recName1 : getName
        });
        action.setCallback(this, function(response) {
            var recordType = response.getReturnValue();
            component.set("v.recordTypeId",recordType);
            component.set("v.addLoan",true);
            
        });  
        
        $A.enqueueAction(action); 
    },
    
    //----------------------Method to Add Goal records-----------------------------//
    createGoalRecord : function(component , event , helper){
        component.set("v.addGoals" , true);
    },
    
    //----------------------Method to Edit Income records-----------------------------//
    onClickEdit : function(component,event,helper) {
        component.set("v.showModalIncome",true);
        component.set("v.editrecid",event.getSource().get("v.value"));
    },
    
    //----------------------Method to Edit Expense records-----------------------------//
    onClickEditExpense : function(component,event,helper) {
        component.set("v.showModalExpense",true);
        component.set("v.editrecidExpense",event.getSource().get("v.value"));
    },
    
    //----------------------Method to Edit Loan records-----------------------------//
    onClickEditLoan : function(component,event,helper) {
        component.set("v.showModalLoan",true);
        component.set("v.editrecidLoan",event.getSource().get("v.value"));
    },
    //----------------------Method to Edit transaction records-----------------------------//
    onClickEditIncomeTransaction : function(component,event,helper) {
        component.set("v.showModalIncomeTransaction",true);
        component.set("v.editrecidTransaction",event.getSource().get("v.value"));
    },
    //----------------------Method to Edit Expense transaction records-----------------------------//
    onClickEditExpenseTransaction : function(component,event,helper) {
        component.set("v.showModalExpenseTransaction",true);
        component.set("v.editrecidTransactionExpense",event.getSource().get("v.value"));
    },
    //----------------------Method to Edit Loan transaction records-----------------------------//
    onClickEditLoanTransaction : function(component,event,helper) {
        component.set("v.showModalLoanTransaction",true);
        component.set("v.editrecidTransactionLoan",event.getSource().get("v.value"));
    },
    
    //----------------------Method to Edit Goal records-----------------------------//
    onClickEditGoals : function(component,event,helper) {
        
        var getName = event.getSource().get("v.value");
        console.log('the id is:'+getName);
        var action = component.get("c.getRecordTypeIdbyName");
        //component.set("v.editrecidGoal",event.getSource().get("v.value"));
        action.setParams({     
            objectName  : "FinServ__FinancialGoal__c",
            strRecordTypeName : getName
        });
        
        action.setCallback(this, function(response) {
            
            component.set("v.showModalGoal",true);
            
            
            var recordTypeName = response.getReturnValue();
            
            if(recordTypeName == "RetirementRecordType")
            {
                component.set("v.isRetirement",true);
            }
            else
            {
                component.set("v.isNonRetirement",true); 
            }  
            component.set("v.editrecidGoal",event.getSource().get("v.value"));            
        });             
        $A.enqueueAction(action); 
    },
    
    //----------------------Method to Delete Income and Expense records-----------------------------//
    onClickDelete : function(component,event,helper) {  
        
        var action2 = component.get("c.deleteIncome");
        action2.setParams({
            'IncomeId' : event.getSource().get('v.value')
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
    
    //----------------------Method to Delete Transaction records-----------------------------//
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
    
    
    
    //----------------------Method to Delete Loan records-----------------------------//
    onClickDeleteLoan : function(component,event,helper) {   
        var action2 = component.get("c.deleteLoan");
        action2.setParams({
            'loanId' : event.getSource().get('v.value')
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
    
    //----------------------Method to Delete Goal records-----------------------------//
    onClickDeletegoals : function(component,event,helper) {   
        var action2 = component.get("c.deleteGoals");
        action2.setParams({
            'goalId' : event.getSource().get('v.value')
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
    
    //-----------------------Method that displays data on Month click-----------------------------------//
    getAllIncomes : function(component , event , helper){
        helper.removeBackgroundColor(component, helper);
        component.set("v.addIncome",false);
        component.set("v.addTransaction",false);
        component.set("v.addExpenseTransaction",false);
        component.set("v.addLoanTransaction",false);
        component.set("v.addExpense",false);
        component.set("v.addLoan",false);
        component.set("v.addGoals",false);
        component.set("v.showModalIncome",false);
        component.set("v.showModalExpense",false);
        component.set("v.showModalLoan",false);
        component.set("v.showModalGoal",false);
        var eventgen = event.getSource().get("v.value");
        var action = component.get("c.getmonthincome");
        action.setParams({
            "month": eventgen,
            "acc": component.get("v.client") 
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state == "SUCCESS") {
                var data = response.getReturnValue();
                for(var e in data.expenseRecList){
                    data.expenseRecList[e]["showSection"]=false;
                    data.expenseRecList[e]["iconName"]="utility:right";
                    data.expenseRecList[e]["ariavaluenow"] = data.transAmountExpense[data.expenseRecList[e].Id];
                    data.expenseRecList[e]["trExpense"] = data.sumOfExpense[data.expenseRecList[e].Id];
                    
                    
                }
                for(var e in data.incomeRecList){
                    data.incomeRecList[e]["showSection"]=false;
                    data.incomeRecList[e]["iconName"]="utility:right";
                    data.incomeRecList[e]["ariavaluenow"] = data.transAmount[data.incomeRecList[e].Id];
                    data.incomeRecList[e]["trIncome"] = data.sumOfIncome[data.incomeRecList[e].Id];
                    data.incomeRecList[e]["amount"]=data.incomeRecList[e].Amount__c;
                    
                    console.log('income amount'+ data.incomeRecList[e].Amount__c);
            		if (data.incomeRecList[e].Frequency__c=="Semi Monthly"){
					data.incomeRecList[e]["amount"]=data.incomeRecList[e].Amount__c*2;
            		}
                    else if(data.incomeRecList[e].Frequency__c=="Bi-Weekly"){
                       data.incomeRecList[e]["amount"]=data.incomeRecList[e].Amount__c*2.16; 
                    }
                    else if(data.incomeRecList[e].Frequency__c=="Weekly"){
                       data.incomeRecList[e]["amount"]=data.incomeRecList[e].Amount__c*4.33; 
           
                    }
                }
                for(var e in data.loanRecList){
                    data.loanRecList[e]["showSection"]=false;
                    data.loanRecList[e]["iconName"]="utility:right";
                    data.loanRecList[e]["ariavaluenow"] = data.transAmountLoan[data.loanRecList[e].Id];
                     data.loanRecList[e]["trLoan"] = data.sumOfLoan[data.loanRecList[e].Id];
                     data.loanRecList[e]["amount"]=data.loanRecList[e].FinServ__PaymentAmount__c;
                    
                    console.log('income amount' + data.loanRecList[e].FinServ__PaymentAmount__c*2);
            		if (data.loanRecList[e].FinServ__PaymentFrequency__c=="Quaterly"){
					data.loanRecList[e]["amount"]=data.loanRecList[e].FinServ__PaymentAmount__c*2;
            		}
                    else if(data.loanRecList[e].FinServ__PaymentFrequency__c=="Biweekly"){
                       data.loanRecList[e]["amount"]=data.loanRecList[e].FinServ__PaymentAmount__c*2.16; 
                    }
                    else if(data.loanRecList[e].FinServ__PaymentFrequency__c=="Weekly"){
                       data.loanRecList[e]["amount"]=data.loanRecList[e].FinServ__PaymentAmount__c*4.33; 
           
                    }
                }
                component.set("v.IncomeRecord", data);
                component.set("v.tInc",data.totalIncome);
                component.set("v.tExp",data.totalExpense);
                component.set("v.tLoan", data.totalLoan);
                component.set("v.tGoal" , data.totalGoal);
                component.set("v.LoanRecord" , data.loanRecList);
                component.set("v.addGoal",data.goalRecList);
                component.set("v.GoalDetails", response.getReturnValue()[0]);
                component.set("v.client",data.client); 
                component.set("v.clientName",data.client); 
                // component.set("v.addTrans" , data.transactionRecList);
            }            
        });
        $A.enqueueAction(action);      
    },
    
    //-------------------------------Method for Change Client Functionality------------------------------//
    changeClient: function(component, event, helper) {
        helper.removeBackgroundColor(component, helper);
        var abc = component.get("v.client");
        console.log('the selected client is' , JSON.stringify(abc));
        var selectedClient =  component.get("v.selectedLookUpRecord");
        //console.log('the selected client is' , JSON.stringify(selectedClient));
        if($A.util.isEmpty(selectedClient)){
            alert("Please enter a valid Client");
            
        }
        
        // component.set("v.clientName", selectedClient);
        var action = component.get("c.getBudget");
        action.setParams({
            clientId : selectedClient.Id
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {        
                var data = response.getReturnValue();
                //  console.log('grgrg',data);
                
                for(var e in data.expenseRecList){
                    data.expenseRecList[e]["showSection"]=false;
                    data.expenseRecList[e]["iconName"]="utility:right";
                    data.expenseRecList[e]["ariavaluenow"] = data.transAmountExpense[data.expenseRecList[e].Id];
                    data.expenseRecList[e]["trExpense"] = data.sumOfExpense[data.expenseRecList[e].Id];
                }
                for(var e in data.incomeRecList){
                    data.incomeRecList[e]["showSection"]=false;
                    data.incomeRecList[e]["iconName"]="utility:right";
                    data.incomeRecList[e]["ariavaluenow"] = data.transAmount[data.incomeRecList[e].Id];
                    data.incomeRecList[e]["trIncome"] = data.sumOfIncome[data.incomeRecList[e].Id];
                    data.incomeRecList[e]["amount"]=data.incomeRecList[e].Amount__c;
                    
                    console.log('income amount'+ data.incomeRecList[e].Amount__c);
            		if (data.incomeRecList[e].Frequency__c=="Semi Monthly"){
					data.incomeRecList[e]["amount"]=data.incomeRecList[e].Amount__c*2;
            		}
                    else if(data.incomeRecList[e].Frequency__c=="Bi-Weekly"){
                       data.incomeRecList[e]["amount"]=data.incomeRecList[e].Amount__c*2.16; 
                    }
                    else if(data.incomeRecList[e].Frequency__c=="Weekly"){
                       data.incomeRecList[e]["amount"]=data.incomeRecList[e].Amount__c*4.33; 
           
                    }
                }
                console.log('loan Rec list',data.loanRecList);

                for(var e in data.loanRecList){
                    data.loanRecList[e]["showSection"]=false;
                    data.loanRecList[e]["iconName"]="utility:right";
                    data.loanRecList[e]["ariavaluenow"] = data.transAmountLoan[data.loanRecList[e].Id];
                     data.loanRecList[e]["trLoan"] = data.sumOfLoan[data.loanRecList[e].Id];
                                        data.loanRecList[e]["amount"]=data.loanRecList[e].FinServ__PaymentAmount__c;
                    
                    console.log('income amount' + data.loanRecList[e].FinServ__PaymentAmount__c*2);
            		if (data.loanRecList[e].FinServ__PaymentFrequency__c=="Quaterly"){
					data.loanRecList[e]["amount"]=data.loanRecList[e].FinServ__PaymentAmount__c*2;
            		}
                    else if(data.loanRecList[e].FinServ__PaymentFrequency__c=="Biweekly"){
                       data.loanRecList[e]["amount"]=data.loanRecList[e].FinServ__PaymentAmount__c*2.16; 
                    }
                    else if(data.loanRecList[e].FinServ__PaymentFrequency__c=="Weekly"){
                       data.loanRecList[e]["amount"]=data.loanRecList[e].FinServ__PaymentAmount__c*4.33; 
           
                    }
                }
                //  console.log("dgsrgrdgrg",data);
                component.set("v.IncomeRecord", data);
                
                component.set("v.tInc",data.totalIncome);
                component.set("v.tExp",data.totalExpense);
                component.set("v.tLoan", data.totalLoan);
                component.set("v.addGoal",data.goalRecList);
                component.set("v.GoalDetails", response.getReturnValue()[0]);
                component.set("v.tGoal" , data.totalGoal);
                component.set("v.LoanRecord" , data.loanRecList);
                component.set("v.client",data.client);
                component.set("v.clientName",data.client);
                // console.log('the client is' , component.get("v.clientName"));
                component.set("v.accountRecTypeName" , data.client.RecordType.DeveloperName);
            }
        })
        $A.enqueueAction(action);
    },
    //-------------------------------Method for Income Subsection------------------------------//
    handleClickExpand: function (cmp, event) {
        var recId=event.getSource().get("v.name");
        var records=cmp.get("v.IncomeRecord");
        var incomes=records["incomeRecList"];
        for(var r in incomes){
            if(incomes[r]["Id"]==recId){
                if(incomes[r]["showSection"]){
                    incomes[r]["showSection"]=false;
                    incomes[r]["iconName"]="utility:right";
                }else{
                    incomes[r]["showSection"]=true;
                    incomes[r]["iconName"]="utility:down";
                }
                break;
            }    
        }
        
        cmp.set("v.IncomeRecord",records);
        cmp.set("v.getBudgetId",recId);
        /*cmp.set("",event.getSource().get("v.value"));
         cmp.set("v.icon", cmp.get("v.icon")=="utility:right"?
                      "utility:down":"utility:right");
       var exInc = cmp.get("v.expandIncome");
        if(exInc == false){
            cmp.set("v.expandIncome", true);
        }
        else{
             cmp.set("v.expandIncome", false);
        } */             
    },
    //-------------------------------Method for Expense Subsection------------------------------//
    handleClickExpandExpense: function (cmp, event) {
        var recId=event.getSource().get("v.name");
        var records=cmp.get("v.IncomeRecord");
        var expenses=records["expenseRecList"];
        for(var r in expenses){
            if(expenses[r]["Id"]==recId){
                if(expenses[r]["showSection"]){
                    expenses[r]["showSection"]=false;
                    expenses[r]["iconName"]="utility:right";
                }else{
                    expenses[r]["showSection"]=true;
                    expenses[r]["iconName"]="utility:down";
                }
                break;
            }    
        }
        cmp.set("v.IncomeRecord",records); 
        cmp.set("v.getExpenseBudgetId",recId);
    },
    //-------------------------------Method for Loan Subsection------------------------------//
    handleClickExpandLoan: function (cmp, event) {
        var recId=event.getSource().get("v.name");
        var loans=cmp.get("v.LoanRecord");
        for(var r in loans){
            if(loans[r]["Id"]==recId){
                if(loans[r]["showSection"]){
                    loans[r]["showSection"]=false;
                    loans[r]["iconName"]="utility:right";
                }else{
                    loans[r]["showSection"]=true;
                    loans[r]["iconName"]="utility:down";
                }
                break;
            }    
        }
        cmp.set("v.LoanRecord",loans); 
        cmp.set("v.getLoanId",recId);
    }
    
})