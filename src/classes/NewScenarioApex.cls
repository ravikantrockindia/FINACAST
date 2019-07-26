/********* Developer Name: Aditya Kaushal
* updated Date: July 5' 19
* provided new implementation *********/


public class NewScenarioApex {

    
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
        @AuraEnabled public List<Scenario_Income__c> userScenarioIncome;            					 // income of user for scenario income
        @AuraEnabled public List<Scenario_Expense__c> userScenarioExpense;            				 // expense of user 
        @AuraEnabled public List<Scenario_Goal__c> userScenarioGoal;                // goal og user for scenario goal
        @AuraEnabled public List<Scenario__c> userScenario;                         		 // scenario of user
        @AuraEnabled public List<Scenario_Savings__c> userSceneSave;                         // list of scenario saving
        @AuraEnabled public List<Scenario_Debt__c> userScenarioLoan;                         // list of scenario Loan
        @AuraEnabled public Decimal totalGoalAmount;                                		 // total target amount of all goals of user 
        @AuraEnabled public Decimal totalIncomeAmount;                              		 // total income of user 
        @AuraEnabled public Decimal totalExpenseAmount;                              		 // total expense of user
        @AuraEnabled public Decimal totalSaveAmount;                                		 // total current amount of all savings of user 
        @AuraEnabled public Decimal totalLoanAmount;                                		 // total payment amount of all loans of user 
        @AuraEnabled public String scenarioId;                                      		 // scenario id for user
        @AuraEnabled public String response;                                      			 // response from web service
        @AuraEnabled public String primaryOwner;											 //get primaryMember id in case of household, or account id in case it is not household
        @AuraEnabled public List<Scenario__c> scenarioList;
    }
    
    @AuraEnabled
    public static  UserAndScenarios getUserScenarios(String clientId, String sceneId) {
        system.debug('clientId: '+ clientId);
        system.debug('sceneId: '+ sceneId);
        String s2 = sceneId;
        List<sobject> emptyList = new List<sObject>();       
        Integer hhStatus = 0;
        UserAndScenarios wrapper = new UserAndScenarios();
        
        
        try{
            List<Scenario__c> sceneList = new List<Scenario__c>();
            List<Account> accList  = new List<Account>();   
            Account ac = [select id,RecordTypeId,name from account where id=: clientId];
            wrapper.userNameId = ac;           
            
            //give values to sceneId
            if(sceneId == 'init' || String.isEmpty(sceneId) || String.isBlank(sceneId)) {
                sceneList = [select Name, Id from Scenario__c where Client_Id__c = :clientId order by LastModifiedDate DESC]; 
                
                if(sceneList != null && sceneList.size()> 0) {
                    sceneId = sceneList.get(0).Id;  
                    wrapper.scenarioId = sceneId;
                    System.debug('inside if of has scene id' + sceneId);
                }
                else {
                    System.debug('inside else of has scene id' + s2);
                    //sceneId = 'No Scenario';  
                    //wrapper.scenarioId = '';
                    wrapper.scenarioId = s2;
                }
            }//end if
            else{
               wrapper.scenarioId = s2; 
            }
                      
            /*if(ac.RecordTypeId == houseHoldRecId) {
                list<AccountContactRelation> acr  = [Select id,ContactId, Account.Id from AccountContactRelation where AccountId = :ac.Id AND FinServ__Primary__c = true ]; 
                for(AccountContactRelation c :acr){
                    id acrCon = c.ContactId;
                    Account accPrimaryOwn = [select id from Account where FinServ__PrimaryContact__c = :acrCon];
                    wrapper.primaryOwner = accPrimaryOwn.Id;
                }
            }*/
            
           // else {
                wrapper.primaryOwner = ac.Id;
           // }
            
            
            //CAse1:   if a scenaroi exists
            if(sceneId != 'No Scenario' && sceneId != null) {
                Decimal totalAmount = 0;
                
                // 1. Create income list
                List<Scenario_Income__c> sceneIncomeList = [select Id, Name, Amount__c from Scenario_Income__c where Scenario_Id__c = :sceneId];  
                if(sceneIncomeList != null && sceneIncomeList.size() > 0) {
                    totalAmount = 0;
                    wrapper.userScenarioIncome = sceneIncomeList;
                    for(Scenario_Income__c incomeAmt : sceneIncomeList) {
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
                    Scenario_Income__c sc = new Scenario_Income__c();
                    sc.amount__c = 0;
                    emptyList.add(sc);
                    wrapper.userScenarioIncome = (List<Scenario_Income__c>) emptyList;
                    wrapper.totalIncomeAmount = 0; 
                }
                
                // 2. search scenario expense and calculate total expense amount
                List<Scenario_Expense__c> sceneExpenseList = [select Id, Name, Amount__c from Scenario_Expense__c where Scenario_Id__c = :sceneId ];
                if(sceneExpenseList !=null && sceneExpenseList.size() > 0) {
                    totalAmount = 0;
                    wrapper.userScenarioExpense = sceneExpenseList;
                    for(Scenario_Expense__c expenseAmt : sceneExpenseList) {
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
                    Scenario_Expense__c sc = new Scenario_Expense__c();
                    sc.Amount__c = 0;
                    emptyList.add(sc);
                    wrapper.userScenarioExpense = (List<Scenario_Expense__c>) emptyList;
                    wrapper.totalExpenseAmount = 0; 
                }
                
                // 3. search scenario goals and calculate total goal amount
                List <Scenario_Goal__c> sceneGoal = [select name, Scenario_Target_Amount__c from Scenario_Goal__c where Scenario__c = :sceneId];
                if(sceneGoal != null && sceneGoal.size() > 0)   {
                    totalAmount = 0;
                    wrapper.userScenarioGoal = sceneGoal; 
                    for(Scenario_Goal__c goalAmt : sceneGoal){
                        if(goalAmt.Scenario_Target_Amount__c != Null)  {
                            totalAmount += goalAmt.Scenario_Target_Amount__c;
                        }
                        else {
                            totalAmount += 0;  
                        }
                    }
                    wrapper.totalGoalAmount = totalAmount;
                }
                
                // 4. search scenario loans and calculate total loan amount
                List <Scenario_Debt__c> sceneLoan = [select Name, Current_Value__c, Payment_Amount__c, APR__c,Frequency__c from Scenario_Debt__c where Scenario_Id__c = :sceneId];
                if(sceneLoan != null && sceneLoan.size() > 0)   {
                    totalAmount = 0;
                    wrapper.userScenarioLoan = sceneLoan; 
                    for(Scenario_Debt__c loanAmt : sceneLoan){
                        if(loanAmt.Payment_Amount__c != Null) {
                            totalAmount += loanAmt.Payment_Amount__c;
                        }
                        else {
                            totalAmount += 0;
                        }
                    }
                    wrapper.totalLoanAmount = totalAmount;
                }
                
                
                // 5. search scenario savinngs and calculate total saving amount
                List<Scenario_Savings__c> sceneSaveList = [select name, Current_Value__c, APY__c from Scenario_Savings__c where Scenario__c = :sceneId];
                if(sceneSaveList != null && sceneSaveList.size() > 0) {
                    totalAmount = 0;
                    wrapper.userSceneSave = sceneSaveList;
                    for(Scenario_Savings__c saveAmt : sceneSaveList) {
                        if(saveAmt.Current_Value__c != Null) {
                            totalAmount += saveAmt.Current_Value__c;
                        }
                        else {
                            totalAmount += 0;
                        }
                    }
                    wrapper.totalSaveAmount = totalAmount;
                }
                
                
                // 6. List of iteration objects on the UI for name on select
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
                List<Scenario_Income__c> incomeList = [Select Amount__c from Scenario_Income__c  where Scenario_Id__c = :sceneId ];
                List<Scenario_Expense__c> expenseList = [Select Amount__c from Scenario_Expense__c  where Scenario_Id__c = :sceneId ];
                List<Scenario_Savings__c> fAccList = [Select id, Name, Current_Value__c,APY__c from Scenario_Savings__c where Scenario__c = :sceneId];
                List<Scenario_Debt__c> debtAccList = [select Name, APR__c, Current_Value__c, Payment_Amount__c from Scenario_Debt__c where Scenario_Id__c = :sceneId ];
                
                List<Scenario_Goal__c> goalList = [select Scenario_Current_Amount__c, Name,  Scenario_Monthly_Contribution__c,Scenario_Goal_Priority__c, Scenario_Start_Date__c, 
                                                   Scenario_Target_Amount__c, Scenario_Target_Date__c, Associated_Account__c 
                                                   //Annual_Growth_Rate__c
                                                   from Scenario_Goal__c where Scenario__c = :sceneId ];
                
                /*List<Scenario_Goal__c> goalList = [select Start_Value__c, Name,  Required_Monthly_Saving__c,Goal_Priority__c, Start_Date__c, FinServ__TargetValue__c,
                                                            Annual_Growth_Rate__c, FinServ__TargetDate__c, Associated_Account__c from Scenario_Goal__c where Scenario_Id__c = :sceneId ];*/
                
                //call the build utility in Utility call to build scenario data
                String reqData = FinacastUtility.buildScenarioRequestData2(incomeList, expenseList, fAccList, debtAccList,  goalList, sceneId, ac.Id);
                System.debug('Server Request in Scenario: ' + reqData);
                
                //Make Callout 
                wrapper.response = FinacastUtility.getCalloutResponseContents(requestEndpoint, 'POST', reqData);
                System.debug('Scenario Exists Response Data: ' + wrapper.response);
                wrapper.scenarioList = [select Name, Id from Scenario__c where Client_Id__c = :ac.Id order by LastModifiedDate DESC]; 
            }
            
            //case 2. no scenario
            else {
                System.debug('No Scenarios yet');
                emptyList = new List<sObject>();
                //Budget__c sc = new Budget__c();
                //sc.amount__c = 0;
                //emptyList.add(sc);
                
                wrapper.userScenarioIncome = (List<Scenario_Income__c>) emptyList;
                wrapper.totalIncomeAmount = 0; 
                
                wrapper.userScenarioExpense = (List<Scenario_Expense__c>) emptyList;
                wrapper.totalExpenseAmount = 0; 
                
                wrapper.userSceneSave = (List<Scenario_Savings__c>) emptyList; 
                wrapper.totalSaveAmount = 0;
                
                wrapper.userScenarioLoan = (List<Scenario_Debt__c>) emptyList;
                wrapper.totalLoanAmount = 0;
                
                
                emptyList = new List<sObject>();
                Scenario_Goal__c fGoal = new Scenario_Goal__c();
                fGoal.Scenario_Target_Amount__c = 0;
                emptyList.add(fGoal);
                wrapper.userScenarioGoal = (List <Scenario_Goal__c>) emptyList;
                wrapper.totalGoalAmount = 0;
                
                emptyList = new List<sObject> ();
                Scenario__c s = new Scenario__c();
                s.Name = '';
                emptyList.add(s);
                wrapper.userScenario = (List<Scenario__c>) emptyList;
                
                system.debug('No Scenario response Wrappr: '+wrapper);
                wrapper.scenarioList = [select Name, Id from Scenario__c where Client_Id__c = :ac.Id order by LastModifiedDate DESC];
            }//end else
            
        }//end catch
        
        catch(Exception e){  FinacastUtility.ExceptionHandle(e.getLineNumber(), e.getMessage(), e.getStackTraceString()); }
        
        return wrapper;  
    }//end init
    
        
    
    // get recordTypeId to create records for goals, loan, savings, credit card 
    @AuraEnabled
    public static String getRecordTypeId(String recName){
        String recId;
        
        if(recName == 'goal button') {
            recId = goalsRecId;        }
        if(recName == 'loan button') {
            recId = loansRecId;        }
        if(recName == 'saving button') {
            recId = savingsRecId;        }
        if(recName == 'credit card button') {
            recId = cardRecId;       }
        
        return recId;
    }
    
    
    //to save the scenario to  Scenario__c object -----> calling js function: onScenarioSaveIcon()
    @AuraEnabled
    public static List<sObject> saveRecord(String recName, String clientId, String recType, String sceneId, Decimal incomeAmount, Decimal expenseAmount, String recordId) {
        
        System.debug('SceneId in Save method:' + sceneId);
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
                    Account acc = [select id, RecordTypeId from Account where id = : clientId];
                    /*if(acc.RecordTypeId == houseHoldRecId) {
                        AccountContactRelation acr  = [Select id,ContactId, Account.Id from AccountContactRelation where AccountId = :clientId AND FinServ__Primary__c = true ]; 
                        id acrCon = acr.ContactId;
                        accPrimaryOwn = [select id from Account where FinServ__PrimaryContact__c = :acrCon];
                        hhStatus = true;
                        system.debug('aa'+acrCon);
                    }*/
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
                    //Id recIdIncome = FinacastUtility.getRecordTypeId('Budget__c' , 'Income_Record_Type');
                    //List<Budget__c> scIncome;
                 /*   if(hhStatus == false) {
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
                    }*/
                    
                    //insert expense
                   /* Id recIdExpense = FinacastUtility.getRecordTypeId('Budget__c' , 'Expense_Record_Type');
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
                    }     */           
                    
                    //insert loan
                    List<Scenario_Debt__c> scLoan;
                    List<Scenario_Debt__c> newLoanList = new  List<Scenario_Debt__c>();
                    if(hhStatus == false) {
                        scLoan = [select Name,Current_Value__c,Payment_Amount__c,Scenario_Id__c, Client_Id__c,APR__c,Frequency__c from Scenario_Debt__c where Client_Id__c = :clientId  AND Scenario_Id__c = null ];
                        primaryOwner = clientId;
                    }
                    else {
                        scLoan = [select Name,id,Current_Value__c,Payment_Amount__c,Scenario_Id__c,Client_Id__c, APR__c,Frequency__c from Scenario_Debt__c where Client_Id__c = :clientId  AND Scenario_Id__c = null ];    
                        primaryOwner = accPrimaryOwn.Id;
                    }
                    if(scLoan.size() > 0) {
                        for(Scenario_Debt__c sc : scLoan) {
                            Scenario_Debt__c loan = new Scenario_Debt__c();
                            loan.Client_Id__c = primaryOwner;
                            loan.Scenario_Id__c = sceneId;                 
                            loan.Name = sc.Name;
                            loan.APR__c = sc.APR__c;
                            loan.Current_Value__c = sc.Current_Value__c;
                            loan.Frequency__c = sc.Frequency__c;
                            loan.Payment_Amount__c = sc.Payment_Amount__c;
                            //loan.Account_Type__c = 'Loan';
                            newLoanList.add(loan);
                        }
                        insert newLoanList;
                    }
                    

                    //insert savings
                    List<Scenario_Savings__c> scSaving;
                    Map <String, Scenario_Savings__c> bankAcc = new Map <String, Scenario_Savings__c>();			// to map scenario savings with scenario financial goals
                    
                    if(hhStatus == false) {
                        scSaving = [select name, Current_Value__c,Client_Id__c,Scenario__c, APY__c, End_Date__c from Scenario_Savings__c where Client_Id__c = :clientId AND Scenario__c = null];
                        primaryOwner = clientId;
                    }
                    else {
                        scSaving = [select name, Current_Value__c, Client_Id__c,Scenario__c,APY__c, End_Date__c from Scenario_Savings__c where Client_Id__c = :clientId AND Scenario__c = null];
                        primaryOwner = accPrimaryOwn.Id;
                    }
                    if(scSaving.size() > 0) {
                        for(Scenario_Savings__c sc : scSaving) {
                            Scenario_Savings__c savings = new Scenario_Savings__c();
                            savings.Client_Id__c = primaryOwner;
                            savings.Scenario__c = sceneId;
                            savings.Name = sc.Name;
                            savings.Current_Value__c = sc.Current_Value__c;
                            savings.APY__c = sc.APY__c;
                            savings.End_Date__c = sc.End_Date__c;
                            bankAcc.put(sc.Id,savings);
                        }
                        insert bankAcc.values();
                    }
                    
                    //insert goals
                    List<Scenario_Goal__c> scGoal;
                    List<Scenario_Goal__c> newgoalList = new List<Scenario_Goal__c>();
                    //if(hhStatus == false) {
                        scGoal = [select Name, Scenario_Start_Date__c,Scenario_Goal_Priority__c,Scenario_Current_Amount__c,Scenario_Monthly_Contribution__c, Associated_Account__c, Scenario_Target_Amount__c, Scenario_Target_Date__c from Scenario_Goal__c where Client_Id__c = :clientId AND Scenario__c = null ]; 
                        primaryOwner = clientId;
                    //}
                    //else {
                      //  scGoal = [select Name, RecordType.DeveloperName, Start_Value__c,Goal_Priority__c,Required_Monthly_Saving__c, Associated_Account__c, FinServ__TargetValue__c, FinServ__TargetDate__c from Scenario_Goal__c where FinServ__Household__c = :clientId AND Scenario_Id__c = null ]; 
                        //primaryOwner = accPrimaryOwn.Id; 
                    //}
                    if(scGoal.size() > 0) {
                        List<String> goalType = new List<String>();
                        for(Scenario_Goal__c g :scGoal) {
                            Scenario_Goal__c goals = new  Scenario_Goal__c();
                            //goalType = g.RecordType.DeveloperName.split('RecordType');
                            goals.Client_Id__c = primaryOwner;
                            goals.Scenario__c = sceneId;
                            goals.Scenario_Goal_Type__c = g.Scenario_Goal_Type__c;
                            goals.Name = g.Name;
                            goals.Scenario_Target_Amount__c = g.Scenario_Target_Amount__c;
                            goals.Scenario_Start_Date__c = g.Scenario_Start_Date__c; 
                            date startDate = date.today();
					        date endDate = startDate.addYears(10);
                            goals.Scenario_Target_Date__c = endDate;
                            goals.Scenario_Current_Amount__c = g.Scenario_Current_Amount__c;
                            goals.Scenario_Goal_Priority__c = g.Scenario_Goal_Priority__c;
                            goals.Scenario_Monthly_Contribution__c = g.Scenario_Monthly_Contribution__c;
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
                System.debug('inside inceome');
                if(recordId != 'init') {
                    Scenario_Income__c scIncome = [select Amount__c from Scenario_Income__c where id = :recordId];  
                    scIncome.Amount__c = incomeAmount;
                    System.debug('inceome init');
                    upsert scIncome;
                }
                else {   System.debug('new Income');
                    
                    Scenario_Income__c scIncome = new Scenario_Income__c ();
                    scIncome.Client_Id__c = clientId ;
                    scIncome.Scenario_Id__c = sceneId;
                    scIncome.Name= 'Income 1';
                    //scIncome.RecordTypeId = incomeRecId;
                    date startDate = date.today();
					date endDate = startDate.addYears(10);
                    scIncome.Start_Date__c = startDate;
                    scIncome.End_Date__c = endDate;
                    scIncome.Amount__c = incomeAmount;
                    insert scIncome;
                }
                List<Budget__c> sceneIncomeList = [select Id, Name, Amount__c from Budget__c where Scenario_Id__c = :sceneId];
                recordList = sceneIncomeList;
            }
            
            //insert/update scenario expense
            if(recType == 'expense save') {
                if(recordId != 'init') {
                    Scenario_Expense__c scExpense = [select Amount__c from Scenario_Expense__c where id = :recordId];
                    system.debug('expense: ' + expenseAmount);
                    scExpense.Amount__c = expenseAmount;
                    upsert scExpense;   
                }
                else {   
                    Scenario_Expense__c scExpense = new Scenario_Expense__c ();
                    scExpense.Name = 'Expense 1';
                    scExpense.Client_Id__c = clientId ;
                    scExpense.Scenario_Id__c = sceneId;
                    date startDate = date.today();
					date endDate = startDate.addYears(10);
                    scExpense.Start_Date__c = startDate;
                    scExpense.End_Date__c = endDate;
                    //scExpense.RecordTypeId  = expenseRecId;
                    scExpense.Amount__c = expenseAmount; 
                    insert scExpense;
                }
                List<Scenario_Expense__c> sceneExpenseList = [select Id, Name, Amount__c from Scenario_Expense__c where Scenario_Id__c = :sceneId];
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
    public static AmtContriWrapper getAmtContri (String accId, Decimal currentAmt, Date tarDate, Decimal tarAmt) {
        AmtContriWrapper wrapper = new AmtContriWrapper();
        Double iRate = 0;
        try{
            if (accId != null && accId != '')
            {
                Scenario_Savings__c savingAcc = [select Current_Value__c, APY__c, id from Scenario_Savings__c where id = :accId];
                Double bal = savingAcc.Current_Value__c; 
                if(savingAcc.APY__c != null)
                {
                    iRate = savingAcc.APY__c;
                }
                /*if(savingAcc.APR__c != null)
                {
                    iRate =  savingAcc.APR__c;
                }*/
                else 
                    iRate = 0; 
                
                list<Scenario_Goal__c> allAssocGoals = [select Associated_Account__c, Scenario_Monthly_Contribution__c, Scenario_Start_Date__c, Scenario_Target_Amount__c 
                                                        from Scenario_Goal__c where Associated_Account__c = :accId];
                
                Double totalEstimated = 0;
                Decimal remainingAmount = 0;
                Decimal growth=0;
                
                for(Scenario_Goal__c relgoal : allAssocGoals ) {
                    totalEstimated = totalEstimated + ((Decimal)FinacastGoalProgressApex.curentgoalestimation((double)(relgoal.Scenario_Monthly_Contribution__c), relgoal.Scenario_Start_Date__c, date.today(),growth)).setScale(2,RoundingMode.HALF_UP)+ relgoal.Scenario_Target_Amount__c;
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
    
    @auraEnabled
    public static UserAndScenarios saveNewScenario(String name, String clientId){
        try{
            Account clientAccount = [select name from Account where id = :clientId];
            
            //create Scenario
            Scenario__c scene = new Scenario__c();
            scene.Name = name;
            scene.Client_Id__c = clientId;
            insert scene; 
            
            String sceneId = scene.Id;
            
            //create income
            Scenario_Income__c scIncome = new Scenario_Income__c ();
            scIncome.Client_Id__c = clientId ;
            scIncome.Scenario_Id__c = sceneId;
            scIncome.Name= 'Income 1';
            date startDate = date.today();
            date endDate = startDate.addYears(10);
            scIncome.Start_Date__c = startDate;
            scIncome.End_Date__c = endDate;
            scIncome.Amount__c = 40000;
            insert scIncome;
            
            //create expense
            Scenario_Expense__c scExpense = new Scenario_Expense__c ();
            scExpense.Name = 'Expense 1';
            scExpense.Client_Id__c = clientId ;
            scExpense.Scenario_Id__c = sceneId;
            scExpense.Start_Date__c = startDate;
            scExpense.End_Date__c = endDate;
            scExpense.Amount__c = 5000; 
            insert scExpense;
            
            //create saving
            Scenario_Savings__c savings = new Scenario_Savings__c();
            savings.Client_Id__c = clientID;
            savings.Scenario__c = sceneId;
            savings.Name = 'Saving 1';
            savings.Current_Value__c = 200000;
            savings.APY__c = 6;
            savings.Start_Date__c= startDate;
            savings.End_Date__c = endDate;
            insert Savings;
            //bankAcc.put(sc.Id,savings);
            
            //create debt
            Scenario_Debt__c loan = new Scenario_Debt__c();
            loan.Client_Id__c = clientID;
            loan.Scenario_Id__c = sceneId;                 
            loan.Name = 'Loan 1';
            loan.APR__c = 3;
            loan.Current_Value__c = 500000;
            loan.Frequency__c = 'Monthly';
            loan.Start_Date__c = startDate;
            loan.End_Date__c = endDate;
            loan.Payment_Amount__c = 1000;
            insert loan;
 
            //crate goal
            Scenario_Goal__c sGoal = new Scenario_Goal__c();
            sGoal.Scenario_Target_Amount__c = 60000;
            sGoal.Scenario_Current_Amount__c = 10000;
            sGoal.Scenario_Monthly_Contribution__c =500;
            sGoal.Name = 'Goal 1';
            sGoal.Scenario__c = sceneId;
			//sGoal.Tax_Benefit__c = 'false';
            sGoal.Scenario_Goal_Type__c = 'Education';
            sGoal.Associated_Account__c = savings.Id;
            sGoal.Client_Id__c = clientId;
            sGoal.Scenario_Goal_Priority__c = 'Priority 1 (must have)';
            sGoal.Scenario_Target_Date__c = endDate;
            sGoal.Scenario_Start_Date__c = startDate;
            insert sGoal;
  
            //Create Response wrapper
            UserAndScenarios wrapper = new UserAndScenarios();
            
            List<Scenario_Income__c> sceneIncomeList = new List<sObject>();
            sceneIncomeList.add(scIncome); 
            wrapper.userScenarioIncome = sceneIncomeList;
            
            List<Scenario_Expense__c> sceneExpenseList = new List<sObject>();
            sceneExpenseList.add(scExpense);
            wrapper.userScenarioExpense = sceneExpenseList;
            
            List<Scenario_Goal__c> sceneGoalList = new List<sObject>(); 
            sceneGoalList.add(sGoal);
            wrapper.userScenarioGoal = sceneGoalList;
            
            List<Scenario__c> emptyList = new List<sObject> ();
            Scenario__c s = new Scenario__c(Name = '');
            emptyList.add(s);
            wrapper.userScenario = (List<Scenario__c>) emptyList;
            
            List<Scenario_Savings__c> savingList = new List<sObject> ();
            savingList.add(savings);
            wrapper.userSceneSave = savingList;
                
            List<Scenario_Debt__c> loanList = new List<sObject> ();
            loanList.add(loan);
            wrapper.userScenarioLoan = loanList;
                
            wrapper.totalGoalAmount = 0;
            wrapper.totalIncomeAmount = 0;
            wrapper.totalExpenseAmount = 0;
            wrapper.totalLoanAmount = 0;
            wrapper.scenarioId = sceneId;
            
            String reqData = FinacastUtility.buildScenarioRequestData2(sceneIncomeList, sceneExpenseList, savingList, loanList,  sceneGoalList, sceneId, clientId);
            if(!test.isRunningTest())
            wrapper.response  = FinacastUtility.getCalloutResponseContents(requestEndpoint, 'POST', reqData);
            wrapper.scenarioList = [select Name, Id from Scenario__c where id =: sceneId];
            wrapper.userNameId = clientAccount; 
            wrapper.primaryOwner = clientAccount.id;
            	
            return wrapper;

        }
        catch(exception e){}
        return new UserAndScenarios();
    }
    
    //Delete records
    @AuraEnabled
    public static List<sObject> deleteRecord (String recId, String sceneId ) {
        List<sObject> recordList = new List<sObject>();
        Id typeId;
        
        Id sId = recId;
         String recType = sId.getSObjectType().getDescribe().getName();
        //delete scenario and related data
        try{
            if(recType == 'scenario__c') {
                Scenario__c sceneDel = [select id from Scenario__c where id = :recId];
                
                List<Scenario_Goal__c> goalDel =[select id from Scenario_Goal__c where Scenario__c = :sceneDel.Id];
                delete goalDel;
                
                List<Scenario_Debt__c> debtDel = [select id from Scenario_Debt__c where  Scenario_Id__c = :sceneDel.Id];
                delete debtDel;
                
                List<Scenario_Savings__c> savingDel = [select id from Scenario_Savings__c where  Scenario__c = :sceneDel.Id];
                delete savingDel;
                
                List<Scenario_Income__c> sceneIncomeList = [select Id, Name, Amount__c from Scenario_Income__c where Scenario_Id__c = :sceneDel.Id]; 
                delete sceneIncomeList;
                
                List<Scenario_Expense__c> sceneExpenseList = [select Id, Name, Amount__c from Scenario_Expense__c where Scenario_Id__c = :sceneDel.Id]; 
                delete sceneExpenseList;
                
                delete sceneDel;
                
                List<Scenario__c> scList = [select id, name from Scenario__c where id = :recId];
                recordList = scList;
            }
            
            // delete scenario goals
            if(recType == 'Scenario_Goal__c') {
                Scenario_Goal__c goalDel = [select id from Scenario_Goal__c where id = :recId];
                delete goalDel;
                
                List<Scenario_Goal__c> goalList = [select Name, Scenario_Start_Date__c,Scenario_Goal_Priority__c,Scenario_Current_Amount__c,Scenario_Monthly_Contribution__c, Associated_Account__c,
                                                   Scenario_Target_Amount__c, 
                                                   Scenario_Target_Date__c from Scenario_Goal__c where Scenario__c = :sceneId ]; 
                recordList = goalList;
            }
            
            //delete scenario loan savings
                
                if(recType == 'Scenario_Debt__c') {
                    Scenario_Debt__c debtDel = [select id from Scenario_Debt__c where id = :recId];
                    delete debtDel;
                    List<Scenario_Debt__c> updatedList = [select Name, Current_Value__c, Payment_Amount__c, APR__c,Frequency__c from Scenario_Debt__c where Scenario_Id__c = :sceneId];
                    recordList = updatedList;
                }
                
                if(recType == 'Scenario_Savings__c') {
                    Scenario_Savings__c savingDel = [select id from Scenario_Savings__c where id = :recId];
                    Scenario_Goal__c gDel = [select id from Scenario_Goal__c where Associated_Account__c = :savingDel.Id];
                    if(gDel != NULL)
                    delete gDel;
                    
                    delete savingDel;
                    List<Scenario_Savings__c> updatedList = [select name, Current_Value__c, APY__c from Scenario_Savings__c where Scenario__c = :sceneId];
                    recordList = updatedList;
                }
        }
        catch(Exception e){
            FinacastUtility.ExceptionHandle(e.getLineNumber(), e.getMessage(), e.getStackTraceString());
        }
        return recordList;
    }
}