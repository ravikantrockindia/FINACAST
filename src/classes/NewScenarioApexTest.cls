@istest
public class NewScenarioApexTest {
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
    @istest
    public static void TestUtility() {
        Account ac = new Account();
        ac.name = 'Test';
        ac.RecordTypeId = Schema.SObjectType.Account.getRecordTypeInfosByName().get('Individual').getRecordTypeId();
        insert ac;
        Account hac = new Account();
        hac.name = 'Test2';
        hac.RecordTypeId = Schema.SObjectType.Account.getRecordTypeInfosByDeveloperName().get('IndustriesHousehold').getRecordTypeId();
        insert hac;
        
        Scenario__c sc=new Scenario__c();
        sc.Client_Id__c=ac.Id;
        sc.Name = 'name';
        insert sc;
        
        Scenario_Expense__c scExpense = new Scenario_Expense__c ();
        scExpense.Name = 'Expense 1';
        scExpense.Client_Id__c = ac.id ;
        scExpense.Scenario_Id__c = sc.id;
        scExpense.Start_Date__c = system.today();
        scExpense.End_Date__c = system.today();
        //scExpense.RecordTypeId  = expenseRecId;
        scExpense.Amount__c = 200; 
        insert scExpense;
        
        Scenario_Income__c scIncome = new Scenario_Income__c ();
        scIncome.Client_Id__c = ac.id ;
        scIncome.Scenario_Id__c = sc.id;
        scIncome.Name= 'Income 1';
        //scIncome.RecordTypeId = incomeRecId;
        scIncome.Start_Date__c = system.today();
        scIncome.End_Date__c = system.today();
        scIncome.Amount__c = 300;
        insert scIncome;
        
        NewScenarioApex.getAmtContri(ac.id, 250, 'system.today()', 300);
        NewScenarioApex.getAmtContri(ac.id, null, 'system.today()', 300);
        NewScenarioApex.getRecordTypeId('goal button');
        NewScenarioApex.getRecordTypeId('loan button');
        NewScenarioApex.getRecordTypeId('saving button');
        NewScenarioApex.getRecordTypeId('credit card button');
        NewScenarioApex.getMonthlyContribution(252, 2, system.today(), 1);
        NewScenarioApex.getUserScenarios(ac.id, sc.id);
        NewScenarioApex.getUserScenarios(hac.id, sc.id);
        NewScenarioApex.getUserScenarios(ac.id, 'init');
        NewScenarioApex.getUserScenarios(hac.id, 'init');
        NewScenarioApex.saveRecord('Loan', 'ac.Id', 'scenario', 'sc.Id', 1200.00, 1000,scIncome.Id);
        NewScenarioApex.saveRecord('debt', 'ac.Id', 'expense save', 'sc.Id', 1200.00, 1000,scIncome.Id);
        NewScenarioApex.saveRecord('Loan', 'ac.Id', 'income save', 'sc.Id', 1200.00, 1000,scIncome.Id);
        NewScenarioApex.saveRecord('expense', 'ac.Id', 'scenario', 'sc.Id', 1200.00, 1000,scExpense.Id);
        NewScenarioApex.saveRecord('Loan', 'ac.Id', 'expense save', 'sc.Id', 1200.00, 1000,scExpense.Id);
        NewScenarioApex.saveRecord('income', 'ac.Id', 'income save', 'sc.Id', 1200.00, 1000,scExpense.Id);
        NewScenarioApex.saveRecord('Loan', 'ac.Id', 'income', 'sc.Id', 1200.00, 1000,scIncome.Id);
        
        NewScenarioApex.saveNewScenario('Ravi', ac.Id);
        NewScenarioApex.saveNewScenario('Ravi', hac.Id);
        
    }
    
    
}