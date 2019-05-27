/****
* created by : avneet kaur
* used by ScenarioContainer.cmp and Scenario.cmp
* test class :  TestScenarioContainerApexController
* ***/


public class ScenarioContainerApexController {
    
    public static Id incomeRecId = FinacastUtility.getRecordTypeId('Budget__c' , 'Scenario_Income_Record_Type');
    public static Id expenseRecId = FinacastUtility.getRecordTypeId('Budget__c' , 'Scenario_Expense_Record_Type');
    public static Id savingsRecId = FinacastUtility.getRecordTypeId('FinServ__FinancialAccount__c' , 'Scenario_Savings_Record_Type');
    public static Id goalsRecId = FinacastUtility.getRecordTypeId('FinServ__FinancialGoal__c' , 'Scenario_Goal_Record_Type');
    public static Id loansRecId = FinacastUtility.getRecordTypeId('FinServ__FinancialAccount__c' , 'Scenario_Loans_Record_Type');
    public static Id cardRecId = FinacastUtility.getRecordTypeId('FinServ__FinancialAccount__c' , 'Scenario_Credit_Cards_Record_Type');
    public static Id recIdLoan = FinacastUtility.getRecordTypeId('FinServ__FinancialAccount__c' , 'LoanAccount');
    public static Id recIdCard = FinacastUtility.getRecordTypeId('FinServ__FinancialAccount__c' , 'CreditCard');
    public static Id houseHoldRecId = FinacastUtility.getRecordTypeId('Account' , 'IndustriesHousehold');
    
    
    public class UserAndScenarios{
        @AuraEnabled public Account userNameId;                                     		 // id and name from account
        @AuraEnabled public List<Budget__c> userScenarioIncome;            					 // income of user for scenario income
        @AuraEnabled public List<Budget__c> userScenarioExpense;            				 // expense of user 
        @AuraEnabled public List<FinServ__FinancialGoal__c> userScenarioGoal ;               // goal og user for scenario goal
        @AuraEnabled public List<Scenario__c> userScenario;                         		 // scenario of user
        @AuraEnabled public List<FinServ__FinancialAccount__c> userSceneSave;                // list of scenario saving
        @AuraEnabled public List<FinServ__FinancialAccount__c> userScenarioLoan;             // list of scenario Loan
        @AuraEnabled public List<FinServ__FinancialAccount__c> userScenarioCard;             // list of scenario credit card
        @AuraEnabled public Decimal totalGoalAmount;                                		 // total target amount of all goals of user 
        @AuraEnabled public Decimal totalIncomeAmount;                              		 // total income of user 
        @AuraEnabled public Decimal totalExpenseAmount;                              		 // total expense of user
        @AuraEnabled public Decimal totalSaveAmount;                                		 // total current amount of all savings of user 
        @AuraEnabled public Decimal totalLoanAmount;                                		 // total payment amount of all loans of user 
        @AuraEnabled public Decimal totalCardAmount;                                		 // total current value (debt amount) of all credit card of user
        @AuraEnabled public String scenarioId;                                      		 // scenario id for user
        @AuraEnabled public String response;                                      			 // response from web service
        @AuraEnabled public String primaryOwner;											 //get primaryMember id in case of household, or account id in case it is not household
    }
    
    /***
* to set the client and the associated income, goal of the client
* called : ScenarioContainerController.js ,  function : doInit()
* ***/ 
    
    @AuraEnabled
    public static  UserAndScenarios getUserScenarios(String clientId, String sceneId) {
        system.debug('clientId: '+clientId);
        system.debug('sceneId: '+sceneId);
        List<sobject> emptyList = new List<sObject>();              							// if no scenario exist return empty list
        Integer hhStatus = 0;
        UserAndScenarios wrapper = new UserAndScenarios();
        try{
            List<Account> accList  = new List<Account>();
            //Aman Singh - removed new account initialization for null check later on
            //Account ac  = new Account();
            Account ac;
            if(clientId == 'init') {
                accList  = [select id,RecordTypeId,name from account where ownerid =: UserInfo.getUserId() order by createddate desc ];
                if(accList.size()> 0) {
                    ac = accList.get(0);   
                }
            }
            else {
                
                ac = [select id,RecordTypeId,name from account where id=: clientId];
            }
            
            //Aman Singh - If no account is found for the logged in user
            if(ac!=null){
                wrapper.userNameId = ac;
            }
            else{
                //Aman Singh - Add some handling to return empty response as no account exists for the logged in user
            }
            
            List<Scenario__c> sceneList = new List<Scenario__c>();
            if(sceneId == 'init' || String.isEmpty(sceneId) || String.isBlank(sceneId)) {
                sceneList = [select Name, Id from Scenario__c where Client_Id__c = :ac.Id order by createddate desc];
                if(sceneList!=null && sceneList.size()> 0) {
                    sceneId = sceneList.get(0).Id;  
                    wrapper.scenarioId = sceneId;
                }
                else {
                    sceneId = 'No Scenario';  
                    wrapper.scenarioId = '';
                }
            }
            
            //Aman Singh - No sure why this was queried again. RecordTypeId is already fetched in previous queries
            //Account acc = [select id, RecordTypeId from Account where id = :ac.Id];
            //modified by Kishan
            if(ac.RecordTypeId == houseHoldRecId) {
                list<AccountContactRelation> acr  = [Select id,ContactId, Account.Id from AccountContactRelation where AccountId = :ac.Id AND FinServ__Primary__c = true ]; 
                for(AccountContactRelation c :acr){
                    id acrCon = c.ContactId;
                    Account accPrimaryOwn = [select id from Account where FinServ__PrimaryContact__c = :acrCon];
                    wrapper.primaryOwner = accPrimaryOwn.Id;
                }
            }
            else {
                wrapper.primaryOwner = ac.Id;
            }
            //search scenario income and calculate total income amount
            if(sceneId != 'No Scenario' && sceneId != null) {
                Decimal totalAmount = 0;
                List<Budget__c> sceneIncomeList = [select Id, Name, Amount__c from Budget__c where Scenario_Id__c = :sceneId AND RecordTypeId = :incomeRecId];  
                if(sceneIncomeList != null && sceneIncomeList.size() > 0) {
                    totalAmount = 0;
                    wrapper.userScenarioIncome = sceneIncomeList;
                    for(Budget__c incomeAmt : sceneIncomeList) {
                        if(incomeAmt.Amount__c != null) {
                            totalAmount += incomeAmt.Amount__c;    
                        }
                        else {
                            totalAmount += 0;
                        }
                    }
                    wrapper.totalIncomeAmount = totalAmount; 
                }
                else {
                    emptyList = new List<sObject>();
                    Budget__c sc = new Budget__c();
                    sc.amount__c = 0;
                    emptyList.add(sc);
                    wrapper.userScenarioIncome = (List<Budget__c>) emptyList;
                    wrapper.totalIncomeAmount = 0; 
                }
                
                //search scenario expense and calculate total expense amount
                List<Budget__c> sceneExpenseList = [select Id, Name, Amount__c from Budget__c where Scenario_Id__c = :sceneId AND RecordTypeId = :expenseRecId ];
                if(sceneExpenseList !=null && sceneExpenseList.size() > 0) {
                    totalAmount = 0;
                    wrapper.userScenarioExpense = sceneExpenseList;
                    for(Budget__c expenseAmt : sceneExpenseList) {
                        if(expenseAmt.Amount__c != null) {
                            totalAmount += expenseAmt.Amount__c;             
                        }
                        else {
                            totalAmount += 0; 
                        }
                    }
                    wrapper.totalExpenseAmount = totalAmount;
                }
                else {
                    emptyList = new List<sObject>();
                    Budget__c sc = new Budget__c();
                    sc.Amount__c = 0;
                    emptyList.add(sc);
                    wrapper.userScenarioExpense = (List<Budget__c>) emptyList;
                    wrapper.totalExpenseAmount = 0; 
                }
                
                //search scenario goals and calculate total goal amount
                List <FinServ__FinancialGoal__c> sceneGoal = [select name, FinServ__TargetValue__c from FinServ__FinancialGoal__c where Scenario_Id__c = :sceneId AND RecordTypeId = :goalsRecId];
                if(sceneGoal != null && sceneGoal.size() > 0)   {
                    totalAmount = 0;
                    wrapper.userScenarioGoal = sceneGoal; 
                    for(FinServ__FinancialGoal__c goalAmt : sceneGoal){
                        if(goalAmt.FinServ__TargetValue__c != Null)  {
                            totalAmount += goalAmt.FinServ__TargetValue__c;
                        }
                        else {
                            totalAmount += 0;  
                        }
                    }
                    wrapper.totalGoalAmount = totalAmount;
                }
                
                //search scenario loans and calculate total loan amount
                List <FinServ__FinancialAccount__c> sceneLoan = [select Name, FinServ__LoanAmount__c,FinServ__PaymentAmount__c, APR__c,FinServ__PaymentFrequency__c from FinServ__FinancialAccount__c where Scenario_Id__c = :sceneId AND RecordTypeId = :loansRecId];
                if(sceneLoan != null && sceneLoan.size() > 0)   {
                    totalAmount = 0;
                    wrapper.userScenarioLoan = sceneLoan; 
                    for(FinServ__FinancialAccount__c loanAmt : sceneLoan){
                        if(loanAmt.FinServ__PaymentAmount__c != Null) {
                            totalAmount += loanAmt.FinServ__PaymentAmount__c;
                        }
                        else {
                            totalAmount += 0;
                        }
                    }
                    wrapper.totalLoanAmount = totalAmount;
                }
                
                //search scenario credit card and calculate total credit card amount
                List <FinServ__FinancialAccount__c> sceneCard = [select Name, FinServ__LoanAmount__c, APR__c from FinServ__FinancialAccount__c where Scenario_Id__c = :sceneId AND RecordTypeId = :cardRecId];
                if(sceneCard != null && sceneCard.size() > 0 )   {
                    totalAmount = 0;
                    wrapper.userScenarioCard = sceneCard; 
                    for(FinServ__FinancialAccount__c cardAmt : sceneCard) {
                        if(cardAmt.FinServ__LoanAmount__c != null) {
                            totalAmount += cardAmt.FinServ__LoanAmount__c;
                        }
                        else {
                            totalAmount += 0;
                        }
                    }
                    wrapper.totalCardAmount = totalAmount;
                }
                
                //search scenario savinngs and calculate total saving amount
                List <FinServ__FinancialAccount__c> sceneSaveList = [select name, FinServ__Balance__c, FinServ__APY__c from FinServ__FinancialAccount__c where Scenario_Id__c = :sceneId AND RecordTypeId = :savingsRecId];
                if(sceneSaveList != null && sceneSaveList.size() > 0) {
                    totalAmount = 0;
                    wrapper.userSceneSave = sceneSaveList;
                    for(FinServ__FinancialAccount__c saveAmt : sceneSaveList) {
                        if(saveAmt.FinServ__Balance__c != Null) {
                            totalAmount += saveAmt.FinServ__Balance__c;
                        }
                        else {
                            totalAmount += 0;
                        }
                    }
                    wrapper.totalSaveAmount = totalAmount;
                }
                
                
                //search for scenario - Aman Singh - Not Sure Why
              // List<Scenario__c> sceneList = [select Name,id from Scenario__c where Client_Id__c = :ac.Id];
                if(sceneList.size() > 0) {
                    wrapper.userScenario = sceneList;
                }
                else {
                    emptyList = new List<sObject>();
                    Scenario__c sc = new Scenario__c();
                    emptyList.add(sc);
                    wrapper.userScenario  = (List<Scenario__c>) emptyList;
                }
                
                // call to getRequestData for to send request data 
                List<Budget__c> incomeList = [Select Amount__c from Budget__c  where Scenario_Id__c = :sceneId AND RecordTypeId = :incomeRecId ];
                List<Budget__c> expenseList = [Select Amount__c from Budget__c  where Scenario_Id__c = :sceneId AND RecordTypeId = :expenseRecId ];
                List<FinServ__FinancialAccount__c> fAccList = [Select id, Name, FinServ__Balance__c,APR__c from FinServ__FinancialAccount__c where Scenario_Id__c = :sceneId And  RecordTypeId != :cardRecId AND RecordTypeId != :loansRecId ];
                List<FinServ__FinancialAccount__c> debtAccList = [select Name, APR__c, FinServ__LoanAmount__c,FinServ__Balance__c, FinServ__PaymentAmount__c,RecordTypeId from FinServ__FinancialAccount__c where Scenario_Id__c = :sceneId And (RecordTypeId = :cardRecId OR RecordTypeId = :loansRecId)  ];
                List<FinServ__FinancialGoal__c> goalList = [select Start_Value__c, Name,  Required_Monthly_Saving__c,Goal_Priority__c, Start_Date__c, FinServ__TargetValue__c, Annual_Growth_Rate__c, FinServ__TargetDate__c, Associated_Account__c from FinServ__FinancialGoal__c where Scenario_Id__c = :sceneId AND RecordTypeId = :goalsRecId ];
                //String res = getRequestData(incomeList, expenseList, fAccList, debtAccList,  goalList);
                String res = getRequestData(incomeList, expenseList, fAccList, debtAccList,  goalList, sceneId, ac.Id);
                wrapper.response = res;
            }
            else {
                emptyList = new List<sObject>();
                Budget__c sc = new Budget__c();
                sc.amount__c = 0;
                emptyList.add(sc);
                wrapper.userScenarioIncome = (List<Budget__c>) emptyList;
                wrapper.totalIncomeAmount = 0; 
                wrapper.userScenarioExpense = (List<Budget__c>) emptyList;
                wrapper.totalExpenseAmount = 0; 
                
                emptyList = new List<sObject>();
                FinServ__FinancialAccount__c facc = new FinServ__FinancialAccount__c();
                facc.FinServ__Balance__c = 0;
                facc.FinServ__LoanAmount__c = 0;
                facc.FinServ__PaymentAmount__c = 0;
                emptyList.add(facc);
                wrapper.userSceneSave = (List<FinServ__FinancialAccount__c>) emptyList; 
                wrapper.totalSaveAmount = 0;
                wrapper.userScenarioLoan = (List<FinServ__FinancialAccount__c>) emptyList;
                wrapper.totalLoanAmount = 0;
                wrapper.userScenarioCard = (List<FinServ__FinancialAccount__c>) emptyList;
                wrapper.totalCardAmount = 0;
                
                emptyList = new List<sObject>();
                FinServ__FinancialGoal__c fGoal = new FinServ__FinancialGoal__c();
                fGoal.FinServ__TargetValue__c = 0;
                emptyList.add(fGoal);
                wrapper.userScenarioGoal = (List <FinServ__FinancialGoal__c>) emptyList;
                wrapper.totalGoalAmount = 0;
                
                emptyList = new List<sObject> ();
                Scenario__c s = new Scenario__c();
                s.Name = '';
                emptyList.add(s);
                wrapper.userScenario = (List<Scenario__c>) emptyList;
                system.debug('aa'+wrapper);
            }
        }
        catch(Exception e){
            FinacastUtility.ExceptionHandle(e.getLineNumber(), e.getMessage(), e.getStackTraceString());
        }
        return wrapper;
        
    }
    
    /**
* to save the scenario to  Scenario__c object
* called :  ScenarioContainerController.js, function : onScenarioSaveIcon()
* **/
    @AuraEnabled
    public static List<sObject> saveRecord(String recName, String clientId, String recType, String sceneId, Decimal incomeAmount, Decimal expenseAmount, String recordId) {
        
        Boolean status = false;
        Boolean hhStatus = false;
        List<sObject> recordList = new List<sObject>();
        Account accPrimaryOwn;										// to find the primary owner of household account
        String primaryOwner;
        
        //insert new scenario
        List<Id> client = new List<Id>();
        try{
            if(recType == 'scenario') {
                List<Scenario__c> sceneList = [select Name, Client_Id__c from Scenario__c];
                for(Scenario__c s : sceneList){
                    if(s.Name == recName && s.Client_Id__c ==  clientId) {
                        status = true;				// scenario exist with the same name for the client
                    }
                }
                
                // status = false i.e scenario doesn't exist, if scenario is saved, clone income -> amount , expense -> , savings, credit card, loan, goals of the user from budget__c
                if(status == false) {
                    Account acc = [select id, RecordTypeId from Account where id = :clientId];
                    if(acc.RecordTypeId == houseHoldRecId) {
                        AccountContactRelation acr  = [Select id,ContactId, Account.Id from AccountContactRelation where AccountId = :clientId AND FinServ__Primary__c = true ]; 
                        id acrCon = acr.ContactId;
                        accPrimaryOwn = [select id from Account where FinServ__PrimaryContact__c = :acrCon];
                        hhStatus = true;
                        system.debug('aa'+acrCon);
                    }
                    Decimal totalIncome = 0;
                    Scenario__c scene = new Scenario__c();
                    scene.Name = recName;
                    scene.Client_Id__c = clientId;
                    insert scene; 
                    if(sceneId == null) {
                        sceneId = scene.Id;
                    }
                    Account clientName = [select name from Account where id = :clientId];
                    Scenario__c sceneName = [select name from Scenario__c where id = :sceneId];
                    
                    //insert income
                    Id recIdIncome = FinacastUtility.getRecordTypeId('Budget__c' , 'Income_Record_Type');
                    List<Budget__c> scIncome;
                    if(hhStatus == false) {
                        scIncome = [select id, Amount__c from Budget__c where Primary_Owner__c = :clientId AND RecordTypeId = :recIdIncome AND Scenario_Id__c = null];
                        primaryOwner = clientId;
                    }
                    else {
                        scIncome = [select id, Amount__c from Budget__c where HouseHold__c = :clientId AND RecordTypeId = :recIdIncome AND Scenario_Id__c = null];
                        primaryOwner = accPrimaryOwn.Id;
                    }
                    if(scIncome.size() > 0) {
                        totalIncome = 0;
                        for(Budget__c b : scIncome) {
                            if(b.Amount__c != Null) {
                                totalIncome += b.Amount__c; 
                            }
                            else {
                                totalIncome += 0;
                            }
                        }
                        Budget__c income = new Budget__c();
                        income.Name = 'Income'+ clientName.Name + sceneName.Name ;
                        income.Primary_Owner__c = primaryOwner;
                        income.RecordTypeId = incomeRecId;
                        income.Scenario_Id__c = sceneId;
                        income.Amount__c = totalIncome;
                        insert income;
                    }
                    
                    //insert expense
                    Id recIdExpense = FinacastUtility.getRecordTypeId('Budget__c' , 'Expense_Record_Type');
                    List<Budget__c> scExpense;
                    if(hhStatus == false) {
                        scExpense = [select Amount__c from Budget__c where Primary_Owner__c = :clientId AND RecordTypeId = :recIdExpense AND Scenario_Id__c = null]; 
                        primaryOwner = clientId;
                    }
                    else {
                        scExpense = [select id, Amount__c from Budget__c where HouseHold__c = :clientId AND RecordTypeId = :recIdExpense AND Scenario_Id__c = null];
                        primaryOwner = accPrimaryOwn.Id;
                    }
                    if(scExpense.size() > 0) {
                        totalIncome = 0;
                        for(Budget__c b : scExpense) {
                            if(b.Amount__c != Null) {
                                totalIncome += b.Amount__c; 
                            }
                            else {
                                totalIncome += 0;
                            }
                        }
                        Budget__c expense = new Budget__c();
                        expense.Name = 'Expense' + clientName.Name + sceneName.Name;
                        expense.Primary_Owner__c = primaryOwner;
                        expense.Scenario_Id__c =sceneId;
                        expense.RecordTypeId = expenseRecId;
                        expense.Amount__c = totalIncome;
                        insert expense;   
                    }                
                    
                    //insert loan
                    List<FinServ__FinancialAccount__c> scLoan;
                    List<FinServ__FinancialAccount__c> newLoanList = new  List<FinServ__FinancialAccount__c> ();
                    if(hhStatus == false) {
                        scLoan = [select Name,FinServ__LoanAmount__c,FinServ__PaymentAmount__c, APR__c,FinServ__PaymentFrequency__c from FinServ__FinancialAccount__c where FinServ__PrimaryOwner__c = :clientId  AND RecordTypeId = :recIdLoan AND Scenario_Id__c = null ];
                        primaryOwner = clientId;
                    }
                    else {
                        scLoan = [select Name,id,FinServ__LoanAmount__c,FinServ__PaymentAmount__c, APR__c,FinServ__PaymentFrequency__c from FinServ__FinancialAccount__c where FinServ__Household__c = :clientId  AND RecordTypeId = :recIdLoan AND Scenario_Id__c = null ];    
                        primaryOwner = accPrimaryOwn.Id;
                    }
                    if(scLoan.size() > 0) {
                        for(FinServ__FinancialAccount__c sc : scLoan) {
                            FinServ__FinancialAccount__c loan = new FinServ__FinancialAccount__c();
                            loan.FinServ__PrimaryOwner__c = primaryOwner;
                            loan.Scenario_Id__c = sceneId;
                            loan.RecordTypeId = loansRecId;
                            loan.Name = sc.Name;
                            loan.APR__c = sc.APR__c;
                            loan.FinServ__LoanAmount__c = sc.FinServ__LoanAmount__c;
                            loan.FinServ__PaymentFrequency__c = sc.FinServ__PaymentFrequency__c;
                            loan.FinServ__PaymentAmount__c = sc.FinServ__PaymentAmount__c;
                            loan.Account_Type__c = 'Loan';
                            newLoanList.add(loan);
                        }
                        insert newLoanList;
                    }
                    
                    //insert credit cards
                    List<FinServ__FinancialAccount__c> scCard;
                    List<FinServ__FinancialAccount__c> newCardList = new  List<FinServ__FinancialAccount__c> ();
                    
                    if(hhStatus == false) {
                        
                        scCard = [select Name, FinServ__LoanAmount__c, APR__c from FinServ__FinancialAccount__c where FinServ__PrimaryOwner__c = :clientId AND RecordTypeId = :recIdCard AND Scenario_Id__c = null ];
                        primaryOwner = clientId;
                    }
                    else {
                        scCard = [select Name, FinServ__LoanAmount__c, APR__c from FinServ__FinancialAccount__c where FinServ__Household__c = :clientId AND RecordTypeId = :recIdCard AND Scenario_Id__c = null ];   
                        primaryOwner = accPrimaryOwn.Id;
                    }
                    if(scCard.size() > 0) {
                        for(FinServ__FinancialAccount__c sc : scCard) {
                            FinServ__FinancialAccount__c card = new FinServ__FinancialAccount__c();
                            card.FinServ__PrimaryOwner__c = primaryOwner;
                            card.Scenario_Id__c = sceneId;
                            card.RecordTypeId = cardRecId;
                            card.Name = sc.Name;
                            card.FinServ__LoanAmount__c = sc.FinServ__LoanAmount__c;
                            card.APR__c = sc.APR__c;
                            card.Account_Type__c = 'Credit Card';
                            newCardList.add(card);
                        }
                        insert newCardList;
                    }
                    
                    //insert savings
                    List<FinServ__FinancialAccount__c> scSaving;
                    Map <String, FinServ__FinancialAccount__c> bankAcc = new Map <String, FinServ__FinancialAccount__c>();			// to map scenario savings with scenario financial goals
                    if(hhStatus == false) {
                        scSaving = [select name, FinServ__Balance__c, FinServ__APY__c,FinServ__FinancialAccountType__c, FinServ__LoanEndDate__c from FinServ__FinancialAccount__c where FinServ__PrimaryOwner__c = :clientId AND (RecordTypeId != :recIdLoan OR RecordTypeId = :recIdCard) AND Scenario_Id__c = null];
                        primaryOwner = clientId;
                    }
                    else {
                        scSaving = [select name, FinServ__Balance__c, FinServ__APY__c,FinServ__FinancialAccountType__c, FinServ__LoanEndDate__c from FinServ__FinancialAccount__c where FinServ__Household__c = :clientId AND (RecordTypeId != :recIdLoan OR RecordTypeId = :recIdCard) AND Scenario_Id__c = null];
                        primaryOwner = accPrimaryOwn.Id;
                    }
                    if(scSaving.size() > 0) {
                        for(FinServ__FinancialAccount__c sc : scSaving) {
                            FinServ__FinancialAccount__c savings = new FinServ__FinancialAccount__c();
                            savings.FinServ__PrimaryOwner__c = primaryOwner;
                            savings.Scenario_Id__c = sceneId;
                            savings.RecordTypeId = savingsRecId;
                            savings.Name = sc.Name;
                            savings.FinServ__Balance__c = sc.FinServ__Balance__c;
                            savings.FinServ__APY__c = sc.FinServ__APY__c;
                            savings.FinServ__FinancialAccountType__c = sc.FinServ__FinancialAccountType__c;    
                            savings.FinServ__LoanEndDate__c = sc.FinServ__LoanEndDate__c;
                            savings.FinServ__FinancialAccountType__c = sc.FinServ__FinancialAccountType__c;
                            bankAcc.put(sc.Id,savings);
                        }
                        insert bankAcc.values();
                    }
                    
                    //insert goals
                    List<FinServ__FinancialGoal__c> scGoal;
                    List<FinServ__FinancialGoal__c> newgoalList = new List<FinServ__FinancialGoal__c>();
                    if(hhStatus == false) {
                        scGoal = [select Name, RecordType.DeveloperName, Start_Value__c,Goal_Priority__c,Required_Monthly_Saving__c, Associated_Account__c, FinServ__TargetValue__c, FinServ__TargetDate__c from FinServ__FinancialGoal__c where FinServ__PrimaryOwner__c = :clientId AND Scenario_Id__c = null AND RecordTypeId != :goalsRecId]; 
                        primaryOwner = clientId;
                    }
                    else {
                        scGoal = [select Name, RecordType.DeveloperName, Start_Value__c,Goal_Priority__c,Required_Monthly_Saving__c, Associated_Account__c, FinServ__TargetValue__c, FinServ__TargetDate__c from FinServ__FinancialGoal__c where FinServ__Household__c = :clientId AND Scenario_Id__c = null AND RecordTypeId != :goalsRecId]; 
                        primaryOwner = accPrimaryOwn.Id; 
                    }
                    if(scGoal.size() > 0) {
                        List<String> goalType = new List<String>();
                        for(FinServ__FinancialGoal__c g :scGoal) {
                            FinServ__FinancialGoal__c goals = new  FinServ__FinancialGoal__c();
                            goalType = g.RecordType.DeveloperName.split('RecordType');
                            goals.FinServ__PrimaryOwner__c = primaryOwner;
                            goals.Scenario_Id__c = sceneId;
                            goals.RecordTypeId = goalsRecId;
                            goals.Name = g.Name;
                            goals.FinServ__TargetValue__c = g.FinServ__TargetValue__c;
                            goals.FinServ__TargetDate__c = g.FinServ__TargetDate__c;
                            goals.Start_Value__c = g.Start_Value__c;
                            goals.Goal_Priority__c = g.Goal_Priority__c;
                            goals.Required_Monthly_Saving__c = g.Required_Monthly_Saving__c;
                            goals.Scenario_Goal_Type__c = goalType[0]; 
                            goals.Associated_Account__c = bankAcc.get(g.Associated_Account__c).Id;
                            newgoalList.add(goals);
                        }
                        insert newgoalList;
                    }    
                }
                
                List<Scenario__c> scList = [select id, name from Scenario__c where Client_Id__c = :clientId];
                recordList = scList;
            }
            
            //insert/update scenaro income
            if(recType == 'income save') {
                if(recordId != 'init') {
                    Budget__c scIncome = [select Amount__c from Budget__c where id = :recordId];  
                    scIncome.Amount__c = incomeAmount;
                    upsert scIncome;
                }
                else {   
                    Budget__c scIncome = new Budget__c ();
                    scIncome.Primary_Owner__c = clientId ;
                    scIncome.Scenario_Id__c = sceneId;
                    scIncome.RecordTypeId = incomeRecId;
                    scIncome.Amount__c = incomeAmount;
                    insert scIncome;
                }
                List<Budget__c> sceneIncomeList = [select Id, Name, Amount__c from Budget__c where Scenario_Id__c = :sceneId ];
                recordList = sceneIncomeList;
            }
            
            //insert/update scenario expense
            if(recType == 'expense save') {
                if(recordId != 'init') {
                    Budget__c scExpense = [select Amount__c from Budget__c where id = :recordId];  
                    scExpense.Amount__c = expenseAmount;
                    upsert scExpense;   
                }
                else {   
                    Budget__c scExpense = new Budget__c ();
                    scExpense.Primary_Owner__c = clientId ;
                    scExpense.Scenario_Id__c = sceneId;
                    scExpense.RecordTypeId  = expenseRecId;
                    scExpense.Amount__c = expenseAmount; 
                    insert scExpense;
                }
                List<Budget__c> sceneExpenseList = [select Id, Name, Amount__c from Budget__c where Scenario_Id__c = :sceneId];
                recordList = sceneExpenseList;
            }
        }
        catch(Exception e){
            FinacastUtility.ExceptionHandle(e.getLineNumber(), e.getMessage(), e.getStackTraceString());
        }
        return recordList;
    }
    
    /**
* to delete scenario from Scenario__c object, Scenario goal record
* called :  ScenarioContainerController.js, function : onScenarioDeleteIcon(),
ScenarioController.js, function : onDeleteButton() 
* **/    
    @AuraEnabled
    public static List<sObject> deleteRecord (String clientId, String sceneId, String recId, String recType) {
        List<sObject> recordList = new List<sObject>();
        Id typeId;
        
        //delete scenario and related data
        try{
            if(recType == 'scenario') {
                Scenario__c sceneDel = [select id from Scenario__c where id = :recId];
                List<FinServ__FinancialGoal__c> goalDel =[select id from FinServ__FinancialGoal__c where Scenario_Id__c = :sceneDel.Id];
                delete goalDel;
                List<FinServ__FinancialAccount__c> fAccDel = [select id from FinServ__FinancialAccount__c where  Scenario_Id__c = :sceneDel.Id];
                delete fAccDel;
                List<Budget__c> budgetDel = [select id from Budget__c where Scenario_Id__c = :sceneDel.Id];
                delete budgetDel;
                delete sceneDel;
                List<Scenario__c> scList = [select id, name from Scenario__c where Client_Id__c = :clientId];
                recordList = scList;
            }
            
            // delete scenario goals
            if(recType == 'goal button') {
                FinServ__FinancialGoal__c goalDel = [select id from FinServ__FinancialGoal__c where id = :recId];
                delete goalDel;
                List<FinServ__FinancialGoal__c> goalList = [select id, name, FinServ__TargetValue__c from FinServ__FinancialGoal__c where Scenario_Id__c = :sceneId];
                recordList = goalList;
            }
            
            //delete scenario loan, credit card and savings
            if(recType == 'loan button' || recType == 'credit card button' || recType == 'saving button') {
                if(recType == 'loan button') {
                    typeId =  loansRecId;
                }
                if(recType == 'credit card button') {
                    typeId = cardRecId;
                }
                if(recType == 'saving button') {
                    typeId = savingsRecId;
                }
                FinServ__FinancialAccount__c debtDel = [select id from FinServ__FinancialAccount__c where id = :recId];
                delete debtDel;
                List<FinServ__FinancialAccount__c> debtList = [select id, name,FinServ__Balance__c, FinServ__APY__c, FinServ__LoanAmount__c, FinServ__PaymentAmount__c, APR__c, FinServ__PaymentFrequency__c from  FinServ__FinancialAccount__c where Scenario_Id__c = :sceneId AND Account_Type__c = :typeId ];
                recordList = debtList;
            }
        }
        catch(Exception e){
            FinacastUtility.ExceptionHandle(e.getLineNumber(), e.getMessage(), e.getStackTraceString());
        }
        return recordList;
    } 
    
    public class AmtContriWrapper {
        @AuraEnabled public Decimal currentAmt;
        @AuraEnabled public Decimal monthlyContri;
    }
    
    @AuraEnabled
    public static AmtContriWrapper getAmtContri (String accId, Decimal currentAmt, String tarDate, Decimal tarAmt) {
        AmtContriWrapper wrapper = new AmtContriWrapper();
        Double iRate = 0;
        try{
            if (accId != null && accId != '')
            {
                FinServ__FinancialAccount__c savingAcc = [select FinServ__Balance__c, FinServ__APY__c, APR__c, id from FinServ__FinancialAccount__c where id = :accId];
                Double bal = savingAcc.FinServ__Balance__c; 
                if(savingAcc.FinServ__APY__c != null)
                {
                    iRate = savingAcc.FinServ__APY__c;
                }
                if(savingAcc.APR__c != null)
                {
                    iRate =  savingAcc.APR__c;
                }
                else 
                    iRate = 0; 
                
                list<FinServ__FinancialGoal__c> allAssocGoals = [select Associated_Account__c, Required_Monthly_Saving__c, Start_Date__c, FinServ__TargetValue__c from FinServ__FinancialGoal__c where Associated_Account__c = :accId];
                
                Double totalEstimated = 0;
                Decimal remainingAmount = 0;
                Decimal growth=0;
                
                for(FinServ__FinancialGoal__c relgoal : allAssocGoals ) {
                    totalEstimated = totalEstimated + ((Decimal)FinacastGoalProgressApex.curentgoalestimation((double)(relgoal.Required_Monthly_Saving__c), relgoal.Start_Date__c, date.today(),growth)).setScale(2,RoundingMode.HALF_UP)+ relgoal.FinServ__TargetValue__c;
                }
                
                remainingAmount = bal - totalEstimated;
                if(remainingAmount < 0)
                {
                    remainingAmount = 0;    
                }
                double curr = Math.ceil( remainingAmount);       
                wrapper.currentAmt = Math.ceil( remainingAmount);
                system.debug('current amt'+wrapper.currentAmt);
                
                if(tarDate != null && tarAmt != null) {
                    Date targetDate = Date.valueOf(tarDate);
                    Decimal currentAmount;
                    if(currentAmt == null) {
                        currentAmount = curr;
                    }
                    else {
                        currentAmount = Double.valueOf(currentAmt);
                    }
                    
                    wrapper.monthlyContri = Math.ceil(getMonthlyContribution(currentAmount, tarAmt, targetDate, iRate ));
                }
                else {
                    wrapper.monthlyContri = 0;
                }
            } 
        }
        catch(Exception e){
            FinacastUtility.ExceptionHandle(e.getLineNumber(), e.getMessage(), e.getStackTraceString());
        }
        return wrapper;
        
    }
    
    /* to monthlyContribution
* called from apex function getAmtContri 
* ***/
    public static Decimal getMonthlyContribution(Decimal currentAmount, Decimal tarAmt, Date targetDate, Double  iRate ) {
        Integer months = (((targetDate.year())*12)+targetDate.month()) - ((((date.today()).year())*12)+date.today().month());
        
        if(months < 0) {
            months = Math.abs(months);
        }
        Double installment = 0;
        Double growth = (Math.pow((1 + ( iRate / 100)), (1/12)))- 1;
        Decimal monContri;
        system.debug('tarAmt'+tarAmt);
        system.debug('currentAmount'+currentAmount);
        system.debug('months'+months);
        
        If (tarAmt > (currentAmount * (Math.pow((1 + growth),months))))
        { 
            If (growth > 0) {
                installment = ((tarAmt - currentAmount * (Math.pow((1 + growth), months))) * growth) / ((Math.pow((1 + growth), months)) - 1);
            } 
            Else {
                installment = (tarAmt - currentAmount) / months;
            }
            monContri = installment;
        }
        Else {
            monContri = installment;
        }
        
        return Math.ceil(monContri);   
    }
    
    
    // get recordTypeId to create records for goals, loan, savings, credit card 
    @AuraEnabled
    public static String getRecordTypeId(String recName){
        String recId;
        
        if(recName == 'goal button') {
            recId = goalsRecId;
        }
        if(recName == 'loan button') {
            recId = loansRecId;
        }
        if(recName == 'saving button') {
            recId = savingsRecId;
        }
        if(recName == 'credit card button') {
            recId = cardRecId;
        }
        
        return recId;
    }
    
    /*
* parameters
* 1. incomeList --> list of all the incomes of a user, of particular record type, 
[Select Amount__c from Budget__c where primaryowner =: clientId AND RecordTypeId = :recId limit 1]
* 2. expenseList--> list of all the expenses of a user, of particular record type, 
[Select Amount__c from Budget__c where primaryowner =: clientId AND RecordTypeId = :recId limit 1]; 
* 3. fAccList --> list of financial account of a user except loan or credit card,
[Select id, Name, FinServ__Balance__c,APR__c from FinServ__FinancialAccount__c where primaryowner =: clientId And RecordTypeId != creditcard and RecordTypeId != loan limit 1];
* 4.debtAccList -->		list of financial account of a user of type loan or credit card,
[select Name, APR__c, FinServ__Balance__c, FinServ__PaymentAmount__c from FinServ__FinancialAccount__c where primaryowner =: clientId And RecordTypeId = creditcard or RecordTypeId = loan  limit 1];
5. goalList --> = list of financial goal of a user ,
[select Start_Value__c, Name,  Required_Monthly_Saving__c, Start_Date__c, FinServ__TargetValue__c, Annual_Growth_Rate__c, FinServ__TargetDate__c, Associated_Account__c from FinServ__FinancialGoal__c where Client__c =: clientId limit 1];
*/
    public static String getRequestData(List<Budget__c> incomeList1, List<Budget__c> expenseList1
                                        , List<FinServ__FinancialAccount__c> fAccList1, List<FinServ__FinancialAccount__c> debtAccList1
                                        , List<FinServ__FinancialGoal__c> goalList1, String sceneId, String clientId) {
                                            
                                            System.debug('inside Method create Client');      
                                            Boolean showClientLookup = false;
                                            Boolean fadeOut = false; 
                                            Boolean isSelected =false;
                                            Boolean cashFlowPopup;
                                            String setData;
                                            Map<string, String> accountNameMap = new  Map<string, String>();
                                            Map<string, String> categoryNameMap = new Map<string, String>();
                                            Map<string, String> CategoryMap2 = new Map<string, String>();
                                            List<Budget__c> incmeList = new List<Budget__c>();
                                            List<Budget__c> expList = new List<Budget__c>();
                                            
                                            //Store Household status here
                                            Boolean isHousehold = false;
                                            Account a = [select id, Name, RecordType.DeveloperName from Account where id =: clientId];
                                            if(a.RecordType.DeveloperName == 'IndustriesHousehold'){
                                                isHousehold = true;
                                            }
                                            
                                            /************ For Household Accounts ********/
                                            if(isHousehold){            
                                                List<account> householdMembersList = new List<Account>();
                                                //householdMembersList = [select id, name from FinServ__AccountAccountRelation__c where FinServ__RelatedAccount__c =: clientId];           
                                                system.debug('Inside Household');       
                                                String FSK ='a22955a47eff160d4ba3ee2bc35581818336cd8d3c73ea789b52c14d6eeba212c6a572097cbb1bf11e29422cefc2f89as';
                                                
                                                if(clientId != null && clientId != '' && FSK.length() > 0 && FSK != Null) {                 
                                                    isSelected = false;
                                                    cashFlowPopup = false;
                                                    List<FinServ__FinancialAccount__c> FFDAList = new List<FinServ__FinancialAccount__c>();
                                                    List<FinServ__FinancialAccount__c> FFAList = new List<FinServ__FinancialAccount__c>();
                                                    
                                                    try {               
                                                        System.debug('Inside try');
                                                        setData = '{"key":"'+FSK+'","formParams":"[';
                                                        
                                                        //double monthlyIncome = 0;                   
                                                        incmeList = [Select id, Name, Amount__c,Income_Start_Date__c,Income_End_Date__c,Frequency__c from Budget__c where HouseHold__c =: clientId 
                                                                     and recordType.developerName = 'Income_Record_Type' and Scenario_Id__c = :sceneId ];
                                                        
                                                        System.debug('client Id: '+ clientId);
                                                        System.debug('Income List: ' + incmeList);
                                                        
                                                        //Create Income List
                                                        if(incmeList!=null && incmeList.size() > 0){
                                                            Integer i = 1;
                                                            for(Budget__c inc: incmeList) {
                                                                Double incomeAmount = 0;
                                                                Double incomeFrequency = 1;
                                                                switch on inc.Frequency__c {
                                                                    when 'Monthly' {
                                                                        incomeFrequency = 1;
                                                                    }	
                                                                    when 'Semi Monthly' {
                                                                        incomeFrequency = 2;
                                                                    }
                                                                    when 'Bi-Weekly' {
                                                                        incomeFrequency = 2;
                                                                    }
                                                                    when 'Weekly' {
                                                                        incomeFrequency = 4;
                                                                    }
                                                                    when else {
                                                                        incomeFrequency = 1;
                                                                    }
                                                                }
                                                                if(inc.Amount__c != Null){
                                                                    incomeAmount = inc.Amount__c.round();
                                                                }
                                                                else {
                                                                    incomeAmount = 0;
                                                                }
                                                                setData +='{';
                                                                setData +='\'id\':\'' + i + '\',';
                                                                setData +='\'type\':\'income\',';
                                                                setData +='\'name\':\''+inc.Name+'\',';
                                                                setData +='\'amount\':'+incomeAmount+',';
                                                                setData +='\'incomepopuppretax\':'+incomeAmount+',';
                                                                setData +='\'incomepopupfrequency\':\'' + incomeFrequency + '\',';
                                                                setData +='\'incomepopupgrowthrate\':\'0\',';
                                                                setData +='\'startdate\':\'' + inc.Income_Start_Date__c.month() + '/' + inc.Income_Start_Date__c.year() + '\',';
                                                                setData +='\'enddate\':\'' + inc.Income_End_Date__c.month() + '/' + inc.Income_End_Date__c.year() + '\'';
                                                                setData +='},';
                                                                CategoryMap2.put(inc.id, inc.Name.toUppercase());
                                                                categoryNameMap.put(inc.id, inc.Name);
                                                                ++i;
                                                            }//end of for
                                                        }//end of if
                                                        else {
                                                            String startdate = '1/2018';
                                                            String enddate = '12/2100';
                                                            setData +='{';
                                                            setData +='\'id\':\'1\',';
                                                            setData +='\'type\':\'income\',';
                                                            setData +='\'name\':\'income\',';
                                                            setData +='\'amount\':0,';
                                                            setData +='\'incomepopuppretax\':0,';
                                                            setData +='\'incomepopupfrequency\':\'1\',';
                                                            setData +='\'incomepopupgrowthrate\':\'0\',';
                                                            setData +='\'startdate\':\'' + startdate + '\',';
                                                            setData +='\'enddate\':\'' + enddate + '\'';
                                                            setData +='},';
                                                        }
                                                        
                                                        
                                                        System.debug('income here: ' + setData);
                                                        Integer flag = 0; 
                                                        Map<id, integer> FFAMap = new Map<id, integer>();
                                                        
                                                        //non Loan and Non credit accouts, i.e., savings and investment
                                                        FFAList = [Select id, Name, 
                                                                   //Current_Value__c, 
                                                                   FinServ__Balance__c, FinServ__APY__c from FinServ__FinancialAccount__c where
                                                                   Account_Type__c != 'Loan' and Account_Type__c !='Credit Card' and
                                                                   RecordType.DeveloperName != 'Scenario_Credit_Cards_Record_Type' AND
                                                                   RecordType.DeveloperName != 'Scenario_Loans_Record_Type' AND
                                                                   RecordType.DeveloperName != 'Scenario_Savings_Record_Type' AND
                                                                   FinServ__Household__c =: clientId and Scenario_Id__c = :sceneId
                                                                   limit 1000];
                                                        
                                                        System.debug('FFA List: '+FFAList.size());
                                                        
                                                        if(FFAList.size() > 0){
                                                            for(FinServ__FinancialAccount__c FFA : FFAList){
                                                                accountNameMap.put(FFA.Id, FFA.Name);
                                                                flag++;
                                                                FFAMap.put(FFA.Id, flag);
                                                                setData +='{';
                                                                setData +='\'id\':\''+flag+'\',';
                                                                setData +='\'type\':\'account\',';
                                                                setData +='\'accountype\':\'3\',';
                                                                setData +='\'name\':\''+FFA.Name+'\',';
                                                                if(FFA.FinServ__Balance__c == null){
                                                                    FFA.FinServ__Balance__c = 0;
                                                                }
                                                                setData +='\'amount\':'+FFA.FinServ__Balance__c+',';
                                                                if(FFA.FinServ__APY__c == null){
                                                                    FFA.FinServ__APY__c = 0;
                                                                }
                                                                setData +='\'APR\':'+FFA.FinServ__APY__c;
                                                                setData +='},';
                                                            }
                                                        }
                                                        
                                                        // Loan and debt accounts
                                                        System.debug('above');
                                                        FFDAList = [select id, Name, APR__c, FinServ__Balance__c, FinServ__LoanAmount__c, FinServ__PrimaryOwner__c, Account_Type__c, FinServ__PaymentAmount__c
                                                                    from FinServ__FinancialAccount__c where
                                                                    (Account_Type__c = 'Loan' or
                                                                     Account_Type__c = 'Credit Card') AND
                                                                    RecordType.DeveloperName != 'Scenario_Credit_Cards_Record_Type' AND
                                                                    RecordType.DeveloperName != 'Scenario_Loans_Record_Type' AND
                                                                    RecordType.DeveloperName != 'Scenario_Savings_Record_Type' AND
                                                                    FinServ__Household__c =: clientId and Scenario_Id__c = :sceneId
                                                                    limit 1000];
                                                        
                                                        /*********** NOTE: Outstanding Payment and Loan End Date *********/
                                                        
                                                        
                                                        System.debug('Debt Accounts: ' + FFDAList.size());
                                                        if(FFDAList.size() > 0){
                                                            for(FinServ__FinancialAccount__c FFDA : FFDAList){
                                                                accountNameMap.put(FFDA.Id, FFDA.Name);
                                                                flag++;
                                                                setData +='{';
                                                                setData +='\'id\':\''+flag+'\',';
                                                                setData +='\'type\':\'account\',';
                                                                
                                                                //term Loan
                                                                if(FFDA.Account_Type__c == 'Credit Card'){
                                                                    setData +='\'accountype\':\'account_creditcard\',';
                                                                    setData +='\'name\':\''+FFDA.Name+'\',';
                                                                    
                                                                    //fill which ever is not empty
                                                                    if(FFDA.FinServ__LoanAmount__c != Null){
                                                                        setData +='\'amount\':'+FFDA.FinServ__LoanAmount__c+',';
                                                                    }else {
                                                                        setData +='\'amount\':'+FFDA.FinServ__Balance__c+',';
                                                                    }
                                                                    
                                                                }else if(FFDA.Account_Type__c == 'Loan'){
                                                                    setData +='\'accountype\':\'account_loan\',';
                                                                    setData +='\'name\':\''+FFDA.Name+'\',';
                                                                    setData +='\'amount\':'+FFDA.FinServ__PaymentAmount__c+',';
                                                                    
                                                                    setData +='\'endDate\':\''+Date.today().month()+'/'+Date.today().year()+'\',';
                                                                    setData +='\'outstandingamt\':'+FFDA.FinServ__LoanAmount__c+',';
                                                                }
                                                                else{}
                                                                setData +='\'APR\':'+FFDA.APR__c;
                                                                setData +='},';
                                                            }
                                                        }
                                                        //Goals Data
                                                        
                                                        List<FinServ__FinancialGoal__c> goalList = [select Start_Value__c,
                                                                                                    //Account_Value__c, 
                                                                                                    Name, 
                                                                                                    Required_Monthly_Saving__c, Start_Date__c, FinServ__TargetValue__c,
                                                                                                    Annual_Growth_Rate__c, 	FinServ__TargetDate__c, Associated_Account__c, Goal_Priority__c 
                                                                                                    from FinServ__FinancialGoal__c where
                                                                                                    RecordType.DeveloperName !='Scenario_Goal_Record_Type' and
                                                                                                    FinServ__Household__c =: clientId and Scenario_Id__c = :sceneId
                                                                                                    limit 1000];
                                                        System.debug('Goal List: ' + goalList);
                                                        if(goalList.size() > 0){
                                                            for(FinServ__FinancialGoal__c goal : goalList){
                                                                Decimal growth=0;
                                                                flag++;
                                                                setData +='{';
                                                                setData +='\'id\':\''+flag+'\',';
                                                                setData +='\'type\':\'goals\',';
                                                                Decimal getcurrentEstimation = ((Decimal)FinacastGoalProgressApex.curentgoalestimation((double)(goal.Required_Monthly_Saving__c), goal.Start_Date__c, Date.today(),growth)).setScale(2, RoundingMode.HALF_UP) + goal.Start_Value__c;
                                                                //System.debug('Goal Estimation'+((Decimal)curentgoalestimation((double)(goal.Required_Monthly_Saving__c), goal.Start_Date__c, Date.today())).setScale(2, RoundingMode.HALF_UP) + goal.Start_Value__c);
                                                                setData +='\'currentamount\':\''+getcurrentEstimation+'\',';
                                                                setData +='\'name\':\''+goal.Name+'\',';
                                                                setData +='\'monthlycontribution\':'+goal.Required_Monthly_Saving__c+',';
                                                                setData +='\'startdate\':\''+goal.Start_Date__c.month()+'/'+goal.Start_Date__c.year()+'\',';
                                                                setData +='\'targetamount\':'+goal.FinServ__TargetValue__c+',';
                                                                setData +='\'priority\':'+goal.Goal_Priority__c+',';
                                                                setData +='\'growth\':'+goal.Annual_Growth_Rate__c+',';
                                                                setData +='\'targetdate\':\''+goal.FinServ__TargetDate__c.month()+'/'+goal.FinServ__TargetDate__c.year()+'\',';
                                                                setData +='\'savingid\':\''+FFAMap.get(goal.Associated_Account__c)+'\',';
                                                                setData +='\'startvalue\':\''+goal.Start_Value__c+'\'';
                                                                setData +='},';
                                                            }                   
                                                        } //end of if
                                                        
                                                        
                                                        //Create Expense Data
                                                        expList = [Select id, Name, Amount__c ,Income_Start_Date__c, Income_End_Date__c, Expense_Start_Date__c,Expense_End_Date__c from Budget__c where HouseHold__c =: clientId 
                                                                   and recordType.developerName = 'Expense_Record_Type' and Scenario_Id__c = :sceneId]; 
                                                        System.debug('Expense List: ' + expList);
                                                        double monthlyExpenses = 0;
                                                        //set expenses here    
                                                        if(expList!=null && expList.size() > 0){
                                                            Integer j=1;
                                                            for(Budget__c e: expList) {
                                                                if(e.Amount__c != Null){
                                                                    monthlyExpenses+= e.Amount__c;
                                                                } 
                                                                else {
                                                                    monthlyExpenses += 0; 
                                                                }
                                                                setData +='{';
                                                                setData +='\'id\':\''+j+'\',';
                                                                setData +='\'type\':\''+e.Name+'\',';
                                                                if(monthlyExpenses != null){
                                                                    setData +='\'amount\':'+monthlyExpenses+',';
                                                                }else{
                                                                    setData +='\'amount\':0,';
                                                                }
                                                                setData +='\'startdate\':\'' + e.Income_Start_Date__c.month() + '/' + e.Income_Start_Date__c.year() + '\',';
                                                                setData +='\'enddate\':\'' + e.Income_End_Date__c.month() + '/' + e.Income_End_Date__c.year() + '\'';
                                                                setData +='}';
                                                                ++j;
                                                            }//end for
                                                        }//end if
                                                        else {
                                                            String startdate = '1/2018';
                                                            String enddate = '12/2100';
                                                            setData +='{';
                                                            setData +='\'id\':\'1\',';
                                                            setData +='\'type\':\'expenses\',';
                                                            setData +='\'amount\':0,';
                                                            setData +='\'startdate\':\'' + startdate + '\',';
                                                            setData +='\'enddate\':\'' + enddate + '\'';
                                                            setData +='}';
                                                        }
                                                        setData += ']"}';
                                                        
                                                        //clientData = setData;
                                                        System.debug('Client Data from Future Simulation: ' + setData);
                                                    } //end of try            
                                                    catch(Exception e){
                                                        System.debug('Exception' + e.getStackTraceString());
                                                        FinacastUtility.ExceptionHandle(e.getLineNumber(), e.getMessage(), e.getStackTraceString());
                                                    }
                                                }
                                                System.debug('HouseHold Request Data:' + setData);
                                                return setData;                                
                                            }
                                            //end of Household  
                                            
                                            
                                            
                                            /******** Normal non - Household Code goes here *******/
                                            else {            	
                                                String FSK ='a22955a47eff160d4ba3ee2bc35581818336cd8d3c73ea789b52c14d6eeba212c6a572097cbb1bf11e29422cefc2f89as';
                                                
                                                if(clientId != null && clientId != '' && FSK.length() > 0 && FSK != Null) { 
                                                    
                                                    isSelected = false;
                                                    cashFlowPopup = false;
                                                    List<FinServ__FinancialAccount__c> FFDAList = new List<FinServ__FinancialAccount__c>();
                                                    List<FinServ__FinancialAccount__c> FFAList = new List<FinServ__FinancialAccount__c>();
                                                    
                                                    try {                
                                                        System.debug('Inside try');
                                                        setData = '{"key":"'+FSK+'","formParams":"[';
                                                        
                                                        incmeList = [Select id, Name, Amount__c,Income_Start_Date__c,Income_End_Date__c,Frequency__c from Budget__c where Primary_Owner__c =: clientId 
                                                                     and recordType.developerName = 'Income_Record_Type'  and Scenario_Id__c = :sceneId]; 
                                                        System.debug('client Id: '+ clientId);
                                                        System.debug('Income List: ' + incmeList);
                                                        
                                                        //set monthly income here 
                                                        //Create Income List
                                                        if(incmeList!=null && incmeList.size() > 0){
                                                            Integer i = 1;
                                                            for(Budget__c inc: incmeList) {
                                                                Double incomeAmount = 0;
                                                                Double incomeFrequency = 1;
                                                                switch on inc.Frequency__c {
                                                                    when 'Monthly' {
                                                                        incomeFrequency = 1;
                                                                    }	
                                                                    when 'Semi Monthly' {
                                                                        incomeFrequency = 2;
                                                                    }
                                                                    when 'Bi-Weekly' {
                                                                        incomeFrequency = 2;
                                                                    }
                                                                    when 'Weekly' {
                                                                        incomeFrequency = 4;
                                                                    }
                                                                    when else {
                                                                        incomeFrequency = 1;
                                                                    }
                                                                }
                                                                if(inc.Amount__c != Null){
                                                                    incomeAmount = inc.Amount__c.round();
                                                                }
                                                                else {
                                                                    incomeAmount = 0;
                                                                }
                                                                setData +='{';
                                                                setData +='\'id\':\'' + i + '\',';
                                                                setData +='\'type\':\'income\',';
                                                                setData +='\'name\':\''+inc.Name+'\',';
                                                                setData +='\'amount\':'+incomeAmount+',';
                                                                setData +='\'incomepopuppretax\':'+incomeAmount+',';
                                                                setData +='\'incomepopupfrequency\':\'' + incomeFrequency + '\',';
                                                                setData +='\'incomepopupgrowthrate\':\'0\',';
                                                                setData +='\'startdate\':\'' + inc.Income_Start_Date__c.month() + '/' + inc.Income_Start_Date__c.year() + '\',';
                                                                setData +='\'enddate\':\'' + inc.Income_End_Date__c.month() + '/' + inc.Income_End_Date__c.year() + '\'';
                                                                setData +='},';
                                                                CategoryMap2.put(inc.id, inc.Name.toUppercase());
                                                                categoryNameMap.put(inc.id, inc.Name);
                                                                ++i;
                                                            }//end of for
                                                        }//end of if
                                                        else {
                                                            String startdate = '1/2018';
                                                            String enddate = '12/2100';
                                                            setData +='{';
                                                            setData +='\'id\':\'1\',';
                                                            setData +='\'type\':\'income\',';
                                                            setData +='\'name\':\'income\',';
                                                            setData +='\'amount\':0,';
                                                            setData +='\'incomepopuppretax\':0,';
                                                            setData +='\'incomepopupfrequency\':\'1\',';
                                                            setData +='\'incomepopupgrowthrate\':\'0\',';
                                                            setData +='\'startdate\':\'' + startdate + '\',';
                                                            setData +='\'enddate\':\'' + enddate + '\'';
                                                            setData +='},';
                                                        }
                                                        
                                                        System.debug('income here: ' + setData);
                                                        Integer flag = 0; 
                                                        Map<id, integer> FFAMap = new Map<id, integer>();
                                                        
                                                        //non Loan and Non credit accouts, i.e., savings and investment
                                                        FFAList = [Select id, Name, 
                                                                   //Current_Value__c, 
                                                                   FinServ__Balance__c, FinServ__APY__c from FinServ__FinancialAccount__c where
                                                                   Account_Type__c != 'Loan' and Account_Type__c !='Credit Card' and
                                                                   RecordType.DeveloperName != 'Scenario_Credit_Cards_Record_Type' AND
                                                                   RecordType.DeveloperName != 'Scenario_Loans_Record_Type' AND
                                                                   RecordType.DeveloperName != 'Scenario_Savings_Record_Type' AND
                                                                   FinServ__PrimaryOwner__c =: clientId  and Scenario_Id__c = :sceneId
                                                                   limit 1000];
                                                        
                                                        System.debug('FFA List: '+FFAList.size());
                                                        
                                                        if(FFAList.size() > 0){
                                                            for(FinServ__FinancialAccount__c FFA : FFAList){
                                                                accountNameMap.put(FFA.Id, FFA.Name);
                                                                flag++;
                                                                FFAMap.put(FFA.Id, flag);
                                                                setData +='{';
                                                                setData +='\'id\':\''+flag+'\',';
                                                                setData +='\'type\':\'account\',';
                                                                setData +='\'accountype\':\'3\',';
                                                                setData +='\'name\':\''+FFA.Name+'\',';
                                                                if(FFA.FinServ__Balance__c == null){
                                                                    FFA.FinServ__Balance__c = 0;
                                                                }
                                                                setData +='\'amount\':'+FFA.FinServ__Balance__c+',';
                                                                if(FFA.FinServ__APY__c == null){
                                                                    FFA.FinServ__APY__c = 0;
                                                                }
                                                                setData +='\'APR\':'+FFA.FinServ__APY__c;
                                                                setData +='},';
                                                            }
                                                        }
                                                        
                                                        // Loan and debt accounts
                                                        System.debug('above');
                                                        FFDAList = [select id, Name, APR__c, FinServ__Balance__c, FinServ__LoanAmount__c, FinServ__PrimaryOwner__c, Account_Type__c, FinServ__PaymentAmount__c
                                                                    //Is_TERM_Debt__c,  PAYMENT_AMOUNT__c
                                                                    from FinServ__FinancialAccount__c where
                                                                    (Account_Type__c = 'Loan' or
                                                                     Account_Type__c = 'Credit Card') AND
                                                                    RecordType.DeveloperName != 'Scenario_Credit_Cards_Record_Type' AND
                                                                    RecordType.DeveloperName != 'Scenario_Loans_Record_Type' AND
                                                                    RecordType.DeveloperName != 'Scenario_Savings_Record_Type' AND
                                                                    FinServ__PrimaryOwner__c =: clientId  and Scenario_Id__c = :sceneId
                                                                    limit 1000];
                                                        
                                                        /*********** NOTE: Outstanding Payment and Loan End Date *********/
                                                        
                                                        System.debug('Debt Accounts: ' + FFDAList.size());
                                                        if(FFDAList.size() > 0){
                                                            for(FinServ__FinancialAccount__c FFDA : FFDAList){
                                                                accountNameMap.put(FFDA.Id, FFDA.Name);
                                                                flag++;
                                                                setData +='{';
                                                                setData +='\'id\':\''+flag+'\',';
                                                                setData +='\'type\':\'account\',';
                                                                
                                                                //term Loan
                                                                if(FFDA.Account_Type__c == 'Credit Card'){
                                                                    setData +='\'accountype\':\'account_creditcard\',';
                                                                    setData +='\'name\':\''+FFDA.Name+'\',';
                                                                    
                                                                    //fill which ever is not empty
                                                                    if(FFDA.FinServ__LoanAmount__c != Null){
                                                                        setData +='\'amount\':'+FFDA.FinServ__LoanAmount__c+',';
                                                                    }else {
                                                                        setData +='\'amount\':'+FFDA.FinServ__Balance__c+',';
                                                                    }
                                                                    
                                                                }else if(FFDA.Account_Type__c == 'Loan'){
                                                                    setData +='\'accountype\':\'account_loan\',';
                                                                    setData +='\'name\':\''+FFDA.Name+'\',';
                                                                    setData +='\'amount\':'+FFDA.FinServ__PaymentAmount__c+',';
                                                                    
                                                                    setData +='\'startdate\':\''+Date.today().month()+'/'+Date.today().year()+'\',';
                                                                    setData +='\'outstandingamt\':'+FFDA.FinServ__LoanAmount__c+',';
                                                                }
                                                                else{}
                                                                setData +='\'APR\':'+FFDA.APR__c;
                                                                setData +='},';
                                                            }
                                                        }
                                                        //Goals Data
                                                        
                                                        List<FinServ__FinancialGoal__c> goalList = [select Start_Value__c,
                                                                                                    //Account_Value__c, 
                                                                                                    Name, 
                                                                                                    Required_Monthly_Saving__c, Start_Date__c, FinServ__TargetValue__c,
                                                                                                    Annual_Growth_Rate__c, 	FinServ__TargetDate__c, Associated_Account__c,Goal_Priority__c
                                                                                                    from FinServ__FinancialGoal__c where
                                                                                                    RecordType.DeveloperName !='Scenario_Goal_Record_Type' and
                                                                                                    FinServ__PrimaryOwner__c =: clientId and Scenario_Id__c = :sceneId
                                                                                                    limit 1000];
                                                        System.debug('Goal List: ' + goalList);
                                                        if(goalList.size() > 0){
                                                            for(FinServ__FinancialGoal__c goal : goalList){
                                                                Decimal growth=0;
                                                                flag++;
                                                                setData +='{';
                                                                setData +='\'id\':\''+flag+'\',';
                                                                setData +='\'type\':\'goals\',';
                                                                Decimal getcurrentEstimation = ((Decimal)FinacastGoalProgressApex.curentgoalestimation((double)(goal.Required_Monthly_Saving__c), goal.Start_Date__c, Date.today(),growth)).setScale(2, RoundingMode.HALF_UP) + goal.Start_Value__c;
                                                                //System.debug('Goal Estimation'+((Decimal)curentgoalestimation((double)(goal.Required_Monthly_Saving__c), goal.Start_Date__c, Date.today())).setScale(2, RoundingMode.HALF_UP) + goal.Start_Value__c);
                                                                setData +='\'currentamount\':\''+getcurrentEstimation+'\',';
                                                                setData +='\'name\':\''+goal.Name+'\',';
                                                                setData +='\'monthlycontribution\':'+goal.Required_Monthly_Saving__c+',';
                                                                setData +='\'startdate\':\''+goal.Start_Date__c.month()+'/'+goal.Start_Date__c.year()+'\',';
                                                                setData +='\'targetamount\':'+goal.FinServ__TargetValue__c+',';
                                                                setData +='\'priority\':'+goal.Goal_Priority__c+',';
                                                                setData +='\'growth\':'+goal.Annual_Growth_Rate__c+',';
                                                                setData +='\'targetdate\':\''+goal.FinServ__TargetDate__c.month()+'/'+goal.FinServ__TargetDate__c.year()+'\',';
                                                                setData +='\'savingid\':\''+FFAMap.get(goal.Associated_Account__c)+'\',';
                                                                setData +='\'startvalue\':\''+goal.Start_Value__c+'\'';
                                                                setData +='},';
                                                            }                   
                                                        } //end of if
                                                        
                                                        expList = [Select id, Name, Amount__c, Income_Start_Date__c, Income_End_Date__c, Expense_Start_Date__c,Expense_End_Date__c from Budget__c where Primary_Owner__c =: clientId 
                                                                   and recordType.developerName = 'Expense_Record_Type' and Scenario_Id__c = :sceneId]; 
                                                        //set expenses here    
                                                        System.debug('Expense List: ' + expList);
                                                        double monthlyExpenses = 0;
                                                        //set expenses here    
                                                        if(expList!=null && expList.size() > 0){
                                                            Integer j=1;
                                                            for(Budget__c e: expList) {
                                                                if(e.Amount__c != Null){
                                                                    monthlyExpenses+= e.Amount__c;
                                                                } 
                                                                else {
                                                                    monthlyExpenses += 0; 
                                                                }
                                                                setData +='{';
                                                                setData +='\'id\':\''+j+'\',';
                                                                setData +='\'type\':\''+e.Name+'\',';
                                                                if(monthlyExpenses != null){
                                                                    setData +='\'amount\':'+monthlyExpenses + ',';
                                                                }else{
                                                                    setData +='\'amount\':0,';
                                                                }
                                                                setData +='\'startdate\':\'' + e.Income_Start_Date__c.month() + '/' + e.Income_Start_Date__c.year() + '\',';
                                                                setData +='\'enddate\':\'' + e.Income_End_Date__c.month() + '/' + e.Income_End_Date__c.year() + '\'';
                                                                setData +='}';
                                                                ++j;
                                                            }//end for
                                                        }//end if
                                                        else {
                                                            String startdate = '1/2018';
                                                            String enddate = '12/2100';
                                                            setData +='{';
                                                            setData +='\'id\':\'1\',';
                                                            setData +='\'type\':\'expenses\',';
                                                            setData +='\'amount\':0,';
                                                            setData +='\'startdate\':\'' + startdate + '\',';
                                                            setData +='\'enddate\':\'' + enddate + '\'';
                                                            setData +='}';
                                                        }
                                                        
                                                        setData += ']"}';
                                                        //clientData = setData;
                                                        System.debug('Client Data from Future Simulation: ' + setData);
                                                    } //end of try            
                                                    catch(Exception e){
                                                        System.debug('Exception' + e.getStackTraceString());
                                                        FinacastUtility.ExceptionHandle(e.getLineNumber(), e.getMessage(), e.getStackTraceString());
                                                    }
                                                }
                                                System.debug('Non-HouseHold Request Data:' + setData);
                                                return setData;
                                            }
                                        } 
    
    /*public static String getRequestData_bak(List<Budget__c> incomeList, List<Budget__c> expenseList, List<FinServ__FinancialAccount__c> fAccList, List<FinServ__FinancialAccount__c> debtAccList, List<FinServ__FinancialGoal__c> goalList) {
String response;
String setData;
System.debug('setdata 1: '+setData);
String FSK = 'a22955a47eff160d4ba3ee2bc35581818336cd8d3c73ea789b52c14d6eeba212c6a572097cbb1bf11e29422cefc2f89a';
try{
if(FSK.length() != 0 && FSK != Null){    
try {
setData = '{"key":"'+ FSK + '","formParams":"[';
setData +='{';
System.debug('setdata 2: '+setData);
double monthlyIncome;
double monthlyExpenses;
if(incomeList.size() > 0 && incomeList[0].Amount__c != Null) {
monthlyIncome =  incomeList[0].Amount__c;
}
else {
monthlyIncome = 0; 
}
if(expenseList.size() > 0 && expenseList[0].Amount__c != Null) {
monthlyExpenses = expenseList[0].Amount__c;
}
else {
monthlyExpenses=0;
}
monthlyIncome = monthlyIncome.round();
setData +='\'id\':\'1\',';
setData +='\'type\':\'income\',';
setData +='\'name\':\'income\',';
setData +='\'amount\':'+monthlyIncome+',';
setData +='\'incomepopuppretax\':7000,';
setData +='\'incomepopupfrequency\':\'1\',';
setData +='\'incomepopupgrowthrate\':\'0\'';
setData +='},';
System.debug('setdata 3: '+setData);
Integer flag = 0; 
Map<id, integer> fAccMap = new Map<id, integer>();

if(fAccList.size() > 0 ){
for(FinServ__FinancialAccount__c fAcc : fAccList){
flag++;
fAccMap.put(fAcc.Id, flag);
setData +='{';
setData +='\'id\':\''+flag+'\',';
setData +='\'type\':\'account\',';
setData +='\'accountype\':\'1\',';
if(fAcc.Name == Null) {
fAcc.Name = '';
}
setData +='\'name\':\''+fAcc.Name+'\',';
if(fAcc.FinServ__Balance__c == null){
fAcc.FinServ__Balance__c = 0;
}
setData +='\'amount\':'+ fAcc.FinServ__Balance__c + ',';
if(fAcc.APR__c == null){
fAcc.APR__c = 0;
}
setData +='\'APR\':'+fAcc.APR__c;
setData +='},';
}
}
System.debug('setdata 4: '+setData);
if(debtAccList.size() > 0){
for(FinServ__FinancialAccount__c debt : debtAccList) {
flag++;
setData +='{';
setData +='\'id\':\''+flag+'\',';
setData +='\'type\':\'account\',';
System.debug('setdata credit card: '+setData);
if(debt.RecordTypeId == cardRecId) {
setData +='\'accountype\':\'account_creditcard\',';
if(debt.Name == Null) {
debt.Name = '';
}
setData +='\'name\':\''+debt.Name+'\',';
if(debt.FinServ__LoanAmount__c == Null) {
debt.FinServ__LoanAmount__c = 0;
}
setData +='\'amount\':'+debt.FinServ__LoanAmount__c+',';
}

else if(debt.RecordTypeId == loansRecId) {
setData +='\'accountype\':\'account_loan\',';
if(debt.Name == Null) {
debt.Name = '';
}
setData +='\'name\':\''+debt.Name+'\',';
if(debt.FinServ__PaymentAmount__c == Null) {
debt.FinServ__PaymentAmount__c = 0;
}
setData +='\'amount\':'+debt.FinServ__PaymentAmount__c+',';
setData +='\'endDate\':\''+Date.today().addYears(2).month()+'/'+Date.today().addYears(2).year()+'\',';
if(debt.FinServ__LoanAmount__c == Null) {
debt.FinServ__LoanAmount__c = 0;
}
setData +='\'outstandingamt\':'+debt.FinServ__LoanAmount__c+',';
}
System.debug('setdata 5: '+setData);
setData +='\'APR\':'+debt.APR__c;

setData +='},';
}
}
System.debug('setdata 6: '+setData);
if(goalList.size() > 0){
for(FinServ__FinancialGoal__c goal : goalList){
if(goal.Associated_Account__c != null && fAccMap.containsKey(goal.Associated_Account__c)){
flag++;
setData +='{';
setData +='\'id\':\''+flag+'\',';
setData +='\'type\':\'goals\',';
Decimal getcurrentEstimation = ((Decimal)FinacastGoalProgressApex.curentgoalestimation((double)(goal.Required_Monthly_Saving__c), goal.Start_Date__c, Date.today())).setScale(2, RoundingMode.HALF_UP) + goal.Start_Value__c;
if(getcurrentEstimation == Null) {
getcurrentEstimation = 0;
}
setData +='\'currentamount\':\''+getcurrentEstimation+'\',';
if(goal.Name == Null) {
goal.Name = '';
}
setData +='\'name\':\''+goal.Name+'\',';
if(goal.Required_Monthly_Saving__c == Null) {
goal.Required_Monthly_Saving__c = 0;
}
setData +='\'monthlycontribution\':'+goal.Required_Monthly_Saving__c+',';
if(goal.Start_Date__c == Null) {
goal.Start_Date__c = date.today();
}
setData +='\'startdate\':\''+goal.Start_Date__c.month()+'/'+goal.Start_Date__c.year()+'\',';
if(goal.FinServ__TargetValue__c == Null) {
goal.FinServ__TargetValue__c = 0;
}
setData +='\'targetamount\':'+goal.FinServ__TargetValue__c+',';
if(goal.Goal_Priority__c == Null) {
goal.Goal_Priority__c = '1';
}
setData +='\'priority\':'+goal.Goal_Priority__c+',';

setData +='\'growth\':'+goal.Annual_Growth_Rate__c+',';
if(goal.FinServ__TargetDate__c == Null) {
goal.FinServ__TargetDate__c = date.today();
}
setData +='\'targetdate\':\''+goal.FinServ__TargetDate__c.month()+'/'+goal.FinServ__TargetDate__c.year()+'\',';
setData +='\'savingid\':\''+fAccMap.get(goal.Associated_Account__c)+'\',';

if(goal.Start_Value__c == Null) {
goal.Start_Value__c =0;
}
setData +='\'startvalue\':\''+goal.Start_Value__c+'\'';
//setData +='\'priority\':\''+goal.Goal_Priority__c+'\'';
setData +='},';
}
}
}
System.debug('setdata 7: '+setData);
setData +='{';
setData +='\'id\':\'1\',';
setData +='\'type\':\'expenses\',';
if(monthlyExpenses != null){
setData +='\'amount\':'+monthlyExpenses;
}
else{
setData +='\'amount\':0';
}
System.debug('setdata 8: '+setData);
setData +='}';
setData += ']"}'; 
System.debug('setdata 9: '+setData);
response = FinacastUtility.getCalloutResponseContents('https://mytafi.herokuapp.com/rest/service/getFutureSimulationsNew', 'POST', setData);
}
catch(Exception ee)
{
System.debug(ee.getStackTraceString());
}
}
}
catch(Exception e){
FinacastUtility.ExceptionHandle(e.getLineNumber(), e.getMessage(), e.getStackTraceString());
}
System.debug('setdata 10: '+setData);
System.debug('response: '+response);
return response;
} */
    
}