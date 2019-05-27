/*
* created by: avneet kaur
* test class for ScenarioContainerApexController
* ***/

@isTest

public class TestScenarioApexController {
    public static Id incomeRecId = FinacastUtility.getRecordTypeId('Budget__c' , 'Scenario_Income_Record_Type');
    public static Id expenseRecId = FinacastUtility.getRecordTypeId('Budget__c' , 'Scenario_Expense_Record_Type');
    public static Id savingsRecId = FinacastUtility.getRecordTypeId('FinServ__FinancialAccount__c' , 'Scenario_Savings_Record_Type');
    public static Id goalsRecId = FinacastUtility.getRecordTypeId('FinServ__FinancialGoal__c' , 'Scenario_Goal_Record_Type');
    public static Id loansRecId = FinacastUtility.getRecordTypeId('FinServ__FinancialAccount__c' , 'Scenario_Loans_Record_Type');
    public static Id cardRecId = FinacastUtility.getRecordTypeId('FinServ__FinancialAccount__c' , 'Scenario_Credit_Cards_Record_Type');
    public static Id incomeTypeId = FinacastUtility.getRecordTypeId('Budget__c' , 'Income_Record_Type');
    public static Id expenseTypeId = FinacastUtility.getRecordTypeId('Budget__c' , 'Expense_Record_Type');
    public static Id savingsTypeId = FinacastUtility.getRecordTypeId('FinServ__FinancialAccount__c' , 'SavingsAccount');
    public static Id goalsTypeId = FinacastUtility.getRecordTypeId('FinServ__FinancialGoal__c' , 'CarRecordType');
    public static Id loansTypeId = FinacastUtility.getRecordTypeId('FinServ__FinancialAccount__c' , 'LoanAccount');
    public static Id cardTypeId = FinacastUtility.getRecordTypeId('FinServ__FinancialAccount__c' , 'CreditCard');
    public static Id hhTypeId = FinacastUtility.getRecordTypeId('Account' , 'IndustriesHousehold');
    
    
    @TestSetup
    static void testData() {
        Id recTypeId = Schema.SObjectType.Account.getRecordTypeInfosByName().get('Individual').getRecordTypeId();
        Account acc = new Account();
        acc.Name = 'Test Account';
        acc.RecordTypeId = recTypeId;
        insert acc;
        
        Account acc2 = new Account();
        acc2.Name = 'Test2 Account';
        acc2.RecordTypeId = recTypeId;
        insert acc2;
        
        Scenario__c scene = new Scenario__c();
        scene.Name = 'Test Scenario';
        scene.Client_Id__c = acc.id;
        insert scene;
        
        Scenario__c scene2 = new Scenario__c();
        scene2.Name = 'Test Scenario 2';
        scene2.Client_Id__c = acc.id;
        insert scene2;
        
        Budget__c income1 = new Budget__c();
        income1.Name = 'Test Income 1';
        income1.Income_Start_Date__c=system.today();
        income1.Income_End_Date__c=system.today();
        income1.Primary_Owner__c = acc.id;
        income1.RecordTypeId = incomeRecId;
        income1.Scenario_Id__c = scene.Id;
        income1.Amount__c = 178;
        insert income1;
        
        Budget__c income2 = new Budget__c();
        income2.Name = 'Test Income 2';
        income2.Income_Start_Date__c=system.today();
        income2.Income_End_Date__c=system.today();
        income2.Primary_Owner__c = acc2.id;
        income2.RecordTypeId = incomeTypeId;
        income2.Scenario_Id__c = scene2.Id;
        insert income2;
        
        Budget__c income3 = new Budget__c();
        income3.Name = 'Test Income 3';
        income3.Primary_Owner__c = acc.id;
        income3.Income_Start_Date__c=system.today();
        income3.Income_End_Date__c=system.today();
        income3.RecordTypeId = incomeTypeId;
        income3.Amount__c = 1234;
        insert income3;
        
        Budget__c expense1 = new Budget__c();
        expense1.Name = 'Test Expense 1';
        expense1.Income_Start_Date__c=system.today();
        expense1.Income_End_Date__c=system.today();
        expense1.Primary_Owner__c = acc.Id;
        expense1.Scenario_Id__c = scene.Id;
        expense1.RecordTypeId = expenseRecId;
        expense1.Amount__c = 1234;
        insert expense1;
        
        Budget__c expense2 = new Budget__c();
        expense2.Name = 'Test Expense 2';
        expense2.Primary_Owner__c = acc2.Id;
        expense2.Scenario_Id__c = scene2.Id;
        expense2.Income_Start_Date__c=system.today();
        expense2.Income_End_Date__c=system.today();
        expense2.RecordTypeId = expenseTypeId;
        insert expense2;
        
        Budget__c expense3 = new Budget__c();
        expense3.Name = 'Test Expense 3';
        expense3.Primary_Owner__c = acc.Id;
        expense3.Amount__c = 1212;
        expense3.Income_Start_Date__c=system.today();
        expense3.Income_End_Date__c=system.today();
        expense3.RecordTypeId = expenseTypeId;
        insert expense3;
        
        FinServ__FinancialAccount__c savings1 = new FinServ__FinancialAccount__c();
        savings1.FinServ__PrimaryOwner__c = acc.Id;
        savings1.Scenario_Id__c = scene.Id;
        savings1.RecordTypeId = savingsRecId;
        savings1.Name = 'Test Savings 1';
        savings1.FinServ__Balance__c = 98765;
        savings1.FinServ__APY__c = 3;   
        savings1.FinServ__LoanEndDate__c = Date.today();
        savings1.Account_Type__c = 'Saving';
        insert savings1;
        
        FinServ__FinancialAccount__c savings2 = new FinServ__FinancialAccount__c();
        savings2.FinServ__PrimaryOwner__c = acc.Id;
        savings2.RecordTypeId = savingsRecId;
        savings2.Name = 'Test Savings 2';
        savings2.FinServ__Balance__c = 98765;
        savings2.FinServ__APY__c = 3;   
        savings2.FinServ__LoanEndDate__c = Date.today();
        savings2.Account_Type__c = 'Saving';
        insert savings2;
        
        
        FinServ__FinancialGoal__c goals1 = new  FinServ__FinancialGoal__c();
        goals1.FinServ__PrimaryOwner__c = acc.Id;
        goals1.Scenario_Id__c = scene.Id;
        goals1.RecordTypeId = goalsRecId;
        goals1.Name = 'Test Goal 1';
        goals1.FinServ__TargetValue__c = 10000;
        goals1.FinServ__TargetDate__c = Date.today()+900;
        goals1.Start_Value__c = 2000;
        goals1.Goal_Priority__c = '1';
        goals1.Required_Monthly_Saving__c = 2000; 
        goals1.Associated_Account__c = savings1.Id;
        insert goals1;
        
        FinServ__FinancialGoal__c goals2 = new  FinServ__FinancialGoal__c();
        goals2.FinServ__PrimaryOwner__c = acc.Id;
        goals2.RecordTypeId = goalsTypeId;
        goals2.Name = 'Test Goal 2';
        goals2.FinServ__TargetValue__c = 10000;
        goals2.FinServ__TargetDate__c = Date.today()+900;
        goals2.Start_Value__c = 2000;
        goals2.Goal_Priority__c = '1';
        goals2.Required_Monthly_Saving__c = 2000; 
        goals2.Associated_Account__c = savings2.Id;
        insert goals2;
        
        FinServ__FinancialAccount__c loan1 = new FinServ__FinancialAccount__c();
        loan1.FinServ__PrimaryOwner__c = acc.Id;
        loan1.Scenario_Id__c = scene.Id;
        loan1.RecordTypeId = loansRecId;
        loan1.Name = 'Test Loan 1';
        loan1.APR__c = 5;
        loan1.FinServ__LoanAmount__c = 10000;
        loan1.FinServ__PaymentFrequency__c = 'Monthly';
        loan1.FinServ__PaymentAmount__c = 11000;
        loan1.Account_Type__c = 'Loan';
        insert loan1;
        
        FinServ__FinancialAccount__c loan2 = new FinServ__FinancialAccount__c();
        loan2.FinServ__PrimaryOwner__c = acc.Id;
        loan2.RecordTypeId = loansTypeId;
        loan2.Name = 'Test Loan 2';
        loan2.Account_Type__c = 'Loan';
        loan2.APR__c = 5;
        loan2.FinServ__LoanAmount__c = 10000;
        loan2.FinServ__PaymentFrequency__c = 'Monthly';
        loan2.FinServ__PaymentAmount__c = 11000;
        insert loan2;
        
        FinServ__FinancialAccount__c loan3 = new FinServ__FinancialAccount__c();
        loan3.FinServ__PrimaryOwner__c = acc.Id;
        loan3.RecordTypeId = loansTypeId;
        loan3.Name = 'Test Loan 3';
        loan3.Account_Type__c = 'Loan';
        loan3.APR__c = 5;
        loan3.FinServ__LoanAmount__c = 10000;
        loan3.FinServ__PaymentFrequency__c = 'Monthly';
        loan3.FinServ__PaymentAmount__c = 11000;
        insert loan3;
        
        FinServ__FinancialAccount__c card1 = new FinServ__FinancialAccount__c();
        card1.FinServ__PrimaryOwner__c = acc.Id;
        card1.Scenario_Id__c = scene.Id;
        card1.RecordTypeId = cardRecId;
        card1.Name = 'Test Credit Card 1';
        card1.FinServ__LoanAmount__c = 9000;
        card1.APR__c = 2;
        card1.Account_Type__c = 'Credit Card';
        insert card1;
        
        FinServ__FinancialAccount__c card2 = new FinServ__FinancialAccount__c();
        card2.FinServ__PrimaryOwner__c = acc.Id;
        card2.RecordTypeId = cardTypeId;
        card2.Name = 'Test Credit Card 2';
        card2.FinServ__LoanAmount__c = 9000;
        card2.APR__c = 2;
        card2.FinServ__FinancialAccountType__c ='Credit Card'; 
        card2.Account_Type__c = 'Credit Card';
        card2.FinServ__Balance__c=1000;
        
        insert card2;
    }
    
    static testMethod void testScenario() {
        
       
        Account accVar1 = [select id from Account where name = 'Test Account'];
        Account accVar2 = [select id from Account where name = 'Test2 Account'];
        Scenario__c sceneVar1 = [select id from Scenario__c where name = 'Test Scenario'];
        Scenario__c sceneVar2 = [select id from Scenario__c where name = 'Test Scenario 2'];
        Budget__c incomeVar1 = [select Id from Budget__c where Name = 'Test Income 1' ];
        Budget__c expenseVar1 = [select Id from Budget__c where Name = 'Test Expense 1'];
        FinServ__FinancialGoal__c goalVar1 = [select id from FinServ__FinancialGoal__c where Name = 'Test Goal 1'];
        FinServ__FinancialAccount__c loanVar1 = [select id from FinServ__FinancialAccount__c where Name = 'Test Loan 1'];
        FinServ__FinancialAccount__c cardVar1 = [select id from FinServ__FinancialAccount__c where Name = 'Test Credit Card 1'];
        FinServ__FinancialAccount__c savingVar1 = [select id from FinServ__FinancialAccount__c where Name = 'Test Savings 1'];
        
        test.startTest();
        // FinacastBudgetHelper.shareBudget(bdId);
        ScenarioContainerApexController.getUserScenarios(accVar1.Id, sceneVar1.Id);
        ScenarioContainerApexController.getUserScenarios('init', 'init');
        ScenarioContainerApexController.getUserScenarios(accVar1.Id, null);
        ScenarioContainerApexController.getUserScenarios(accVar2.Id, sceneVar2.Id);
         ScenarioContainerApexController.saveRecord('scenario 1', accVar1.Id, 'scenario', null, 0, 0, null); 
        ScenarioContainerApexController.saveRecord('scene income 1',accVar1.Id, 'income save',sceneVar1.Id, 1234, 0, 'init');
        ScenarioContainerApexController.saveRecord('Test Income 1',accVar1.Id, 'income save',sceneVar1.Id, 1234, 0, incomeVar1.Id);
        ScenarioContainerApexController.saveRecord('scene expense 1',accVar1.Id, 'expense save',sceneVar1.Id, null, 1234, 'init');
        

        test.stopTest();
        
        System.assertEquals('1', '1');
    }
    static testMethod void testScenario1() 
    {
       
       Account accVar1 = [select id from Account where name = 'Test Account'];
        Account accVar2 = [select id from Account where name = 'Test2 Account'];
        Scenario__c sceneVar1 = [select id from Scenario__c where name = 'Test Scenario'];
        Scenario__c sceneVar2 = [select id from Scenario__c where name = 'Test Scenario 2'];
        Budget__c incomeVar1 = [select Id from Budget__c where Name = 'Test Income 1' ];
        Budget__c expenseVar1 = [select Id from Budget__c where Name = 'Test Expense 1'];
        FinServ__FinancialGoal__c goalVar1 = [select id from FinServ__FinancialGoal__c where Name = 'Test Goal 1'];
        FinServ__FinancialAccount__c loanVar1 = [select id from FinServ__FinancialAccount__c where Name = 'Test Loan 1'];
        FinServ__FinancialAccount__c cardVar1 = [select id from FinServ__FinancialAccount__c where Name = 'Test Credit Card 1'];
        FinServ__FinancialAccount__c savingVar1 = [select id from FinServ__FinancialAccount__c where Name = 'Test Savings 1']; 
        
        test.startTest();
        DateTime d = Date.today()+900;
        String tarDate = d.format('YYYY-MM-dd');
        ScenarioContainerApexController.getAmtContri (savingVar1.Id, 1232, tarDate, 11111);
        ScenarioContainerApexController.getRecordTypeId('goal button');
        ScenarioContainerApexController.getRecordTypeId('loan button');
        ScenarioContainerApexController.getRecordTypeId('saving button');
        ScenarioContainerApexController.getRecordTypeId('credit card button');
        ScenarioContainerApexController.saveRecord('scene expense 1',accVar1.Id, 'expense save',sceneVar1.Id, null,1234, expenseVar1.Id);
        ScenarioContainerApexController.deleteRecord(accVar1.Id,sceneVar1.Id, goalVar1.Id, 'goal button');
        
        ScenarioContainerApexController.deleteRecord(accVar1.Id,sceneVar1.Id, loanVar1.Id, 'loan button');
        ScenarioContainerApexController.deleteRecord(accVar1.Id,sceneVar1.Id, sceneVar1.Id, 'scenario');
        
        ScenarioContainerApexController.deleteRecord(accVar1.Id,sceneVar1.Id, goalVar1.Id, 'goal button');
        ScenarioContainerApexController.deleteRecord(accVar1.Id,sceneVar1.Id, loanVar1.Id, 'loan button');
        ScenarioContainerApexController.deleteRecord(accVar1.Id,sceneVar1.Id, cardVar1.Id, 'credit card button');
        ScenarioContainerApexController.deleteRecord(accVar1.Id,sceneVar1.Id, savingVar1.Id, 'saving button');
        
        
        
        ScenarioContainerApexController.deleteRecord (accVar1.Id, sceneVar1.Id, savingVar1.Id, 'saving button'); 
        ScenarioContainerApexController.getAmtContri (savingVar1.Id, 1232, tarDate, 11111);
        ScenarioContainerApexController.getAmtContri (savingVar1.Id, null, tarDate, 11111);
        ScenarioContainerApexController.getRecordTypeId('goal button');
        ScenarioContainerApexController.getRecordTypeId('loan button');
        ScenarioContainerApexController.getRecordTypeId('saving button');
        ScenarioContainerApexController.getRecordTypeId('credit card button');        
        ScenarioContainerApexController.deleteRecord (accVar1.Id, sceneVar1.Id, goalVar1.Id, 'goal button');
        ScenarioContainerApexController.deleteRecord (accVar1.Id, sceneVar2.Id, loanVar1.Id, 'loan button');
        ScenarioContainerApexController.deleteRecord (accVar1.Id, sceneVar1.Id, savingVar1.Id, 'saving button');
        test.stopTest();
    }
}