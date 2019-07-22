/********* Developer Name: Aditya Kaushal
* updated Date: July 5' 19
* provided new implementation *********/

public class Finacast_ScenarioApex {
    
    public static String requestEndpoint='https://mytafi.herokuapp.com/rest/service/getFutureSimulationsNew';
    
    //class variables come here
    public static Id incomeRecId = FinacastUtility.getRecordTypeId('Budget__c' , 'Scenario_Income_Record_Type');
    public static Id expenseRecId = FinacastUtility.getRecordTypeId('Budget__c' , 'Scenario_Expense_Record_Type');
    public static Id savingsRecId = FinacastUtility.getRecordTypeId('FinServ__FinancialAccount__c' , 'Scenario_Savings_Record_Type');
    public static Id goalsRecId = FinacastUtility.getRecordTypeId('FinServ__FinancialGoal__c' , 'Scenario_Goal_Record_Type');
    public static Id loansRecId = FinacastUtility.getRecordTypeId('FinServ__FinancialAccount__c' , 'Scenario_Loans_Record_Type');
    public static Id cardRecId = FinacastUtility.getRecordTypeId('FinServ__FinancialAccount__c' , 'Scenario_Credit_Cards_Record_Type');
    public static Id recIdLoan = FinacastUtility.getRecordTypeId('FinServ__FinancialAccount__c' , 'LoanAccount');
    public static Id recIdCard = FinacastUtility.getRecordTypeId('FinServ__FinancialAccount__c' , 'CreditCard');
    public static Id houseHoldRecId = FinacastUtility.getRecordTypeId('Account' , 'IndustriesHousehold');
    
    
    //Parent wrapper Class
    public class UserAndScenarios{
        @AuraEnabled public Account userNameId;                                     		 // id and name from account
        @AuraEnabled public List<Budget__c> userScenarioIncome;            					 // income of user for scenario income
        @AuraEnabled public List<Budget__c> userScenarioExpense;            				 // expense of user 
        @AuraEnabled public List<FinServ__FinancialGoal__c> userScenarioGoal;               // goal og user for scenario goal
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
        @AuraEnabled public List<Scenario__c> scenarioList;
    }
    
    @AuraEnabled
    public static  UserAndScenarios getUserScenarios(String clientId, String sceneId) {
        system.debug('clientId: '+clientId);
        system.debug('sceneId: '+sceneId);
        
        List<sobject> emptyList = new List<sObject>();       
        Integer hhStatus = 0;
        UserAndScenarios wrapper = new UserAndScenarios();
        
        try{
            List<Scenario__c> sceneList = new List<Scenario__c>();
            List<Account> accList  = new List<Account>();   
            Account ac = [select id,RecordTypeId,name from account where id=: clientId];
            wrapper.userNameId = ac;
            
            /*if(clientId == 'init') {
                accList  = [select id,RecordTypeId,name from account where ownerid =: UserInfo.getUserId() order by createddate desc];
                if(accList.size()> 0) {
                    ac = accList.get(0);   
                }
            }
            else {
                
                ac = [select id,RecordTypeId,name from account where id=: clientId];
            }*/
            
            //Aman Singh - If no account is found for the logged in user
           /* if(ac!=null){
                wrapper.userNameId = ac;
            }
            else{
                //Aman Singh - Add some handling to return empty response as no account exists for the logged in user
            }
           */
            
            
            if(sceneId == 'init' || String.isEmpty(sceneId) || String.isBlank(sceneId)) {
                sceneList = [select Name, Id from Scenario__c where Client_Id__c = :ac.Id order by LastModifiedDate DESC]; 
                
                if(sceneList != null && sceneList.size()> 0) {
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
            
            //if a scenaroi exists
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
                
                //call the build utility in Utility call to build scenario data
                String reqData = FinacastUtility.buildScenarioRequestData(incomeList, expenseList, fAccList, debtAccList,  goalList, sceneId, ac.Id);
                System.debug('Server Request in Scenario: ' + reqData);
                
                //Make Callout 
                wrapper.response = FinacastUtility.getCalloutResponseContents(requestEndpoint, 'POST', reqData);
                System.debug('Scenario Exists Response Data: ' + wrapper.response);
                wrapper.scenarioList = [select Name, Id from Scenario__c where Client_Id__c = :ac.Id order by LastModifiedDate DESC]; 
            }
            
            //when no scenario
            else {
                System.debug('No Scenarios yet');
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
                system.debug('No Scenario response Wrappr: '+wrapper);
                wrapper.scenarioList = [select Name, Id from Scenario__c where Client_Id__c = :ac.Id order by LastModifiedDate DESC];
            }
        }
        catch(Exception e){
            FinacastUtility.ExceptionHandle(e.getLineNumber(), e.getMessage(), e.getStackTraceString());
        }
        return wrapper;
        
    }//end init
    
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
    
    
    //to save the scenario to  Scenario__c object -----> calling js function: onScenarioSaveIcon()
    @AuraEnabled
    public static List<sObject> saveRecord(String recName, String clientId, String recType, String sceneId, Decimal incomeAmount, Decimal expenseAmount, String recordId) {
        
        Boolean status = false;
        Boolean hhStatus = false;
        List<sObject> recordList = new List<sObject>();
        Account accPrimaryOwn;							
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
                        //---> problem is here
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
                        //problem is here--> no start or end date
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
                List<Budget__c> sceneIncomeList = [select Id, Name, Amount__c from Budget__c where Scenario_Id__c = :sceneId];
                recordList = sceneIncomeList;
            }
            
            //insert/update scenario expense
            if(recType == 'expense save') {
                if(recordId != 'init') {
                    Budget__c scExpense = [select Amount__c from Budget__c where id = :recordId];
                    system.debug('expense: ' + expenseAmount);
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
    
}