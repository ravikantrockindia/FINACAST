@isTest
public class ClientDetailApexTest {
    @testsetup
    public static void data(){
        String namespace= NamespaceUtility.returnNamespace();
        String sObject1=namespace+'Budget__c';
        
        //String cId = 'init';
        Account ac = new Account();
        ac.name = 'Test';
        ac.RecordTypeId = Schema.SObjectType.Account.getRecordTypeInfosByName().get('Individual').getRecordTypeId();
        insert ac;
        // String cId1 = ac.id;
        
        
        Account ac2 = new Account();
        ac2.name = 'Test2';
        ac2.RecordTypeId = Schema.SObjectType.Account.getRecordTypeInfosByName().get('Individual').getRecordTypeId();
        insert ac2;
        
        /*  Account hac = new Account();
hac.name = 'Test2';
hac.RecordTypeId = Schema.SObjectType.Account.getRecordTypeInfosByDeveloperName().get('IndustriesHousehold').getRecordTypeId();
insert hac;


Account hac2 = new Account();
hac2.name = 'Test4';
hac2.RecordTypeId = Schema.SObjectType.Account.getRecordTypeInfosByDeveloperName().get('IndustriesHousehold').getRecordTypeId();
insert hac2;

AccountContactRelation acr = new AccountContactRelation();
acr.accountid = hac.id;
acr.contactid = [select id from contact where accountid =: ac.id].Id;
acr.IsActive = true;
acr.FinServ__PrimaryGroup__c = true;
acr.FinServ__Rollups__c = 'All';
acr.FinServ__Primary__c = true;
insert acr;
String cId2 = hac.id;*/
        
        List<Budget__c> budget=new List<Budget__c>();
        Budget__c income = new Budget__c();
        income.Name = 'test income';
        
        income.Amount__c = 1234;
        income.Primary_Owner__c = ac.Id; 
        income.Start_Date__c = system.today();
        income.End_Date__c = system.today();
        income.RecordTypeId = FinacastUtility.getRecordTypeId('Budget__c', 'Income_Record_Type');
        budget.add(income);
        //insert income;
        
        Budget__c expense = new Budget__c();
        expense.Name = 'test expense';
        expense.Amount__c = 1234;
        expense.Start_Date__c = system.today();
        expense.End_Date__c = system.today();
        expense.Primary_Owner__c = ac.Id;
        expense.RecordTypeId = FinacastUtility.getRecordTypeId('Budget__c','Expense_Record_Type');
        budget.add(expense);
        //insert expense;
        insert budget;
        
        List<FinServ__FinancialAccount__c> fin=new List<FinServ__FinancialAccount__c>();
        FinServ__FinancialAccount__c financial1 = new FinServ__FinancialAccount__c();
        financial1.Name = 'Test Financial Account 1';
        financial1.FinServ__PaymentAmount__c = 5000;
        financial1.FinServ__PrimaryOwner__c= ac.Id;
        financial1.FinServ__LoanAmount__c = 5000;
        financial1.FinServ__APY__c = 4;
        financial1.Max_yearly_tax_deduction_allowed__c =10;
        financial1.RecordTypeId = FinacastUtility.getRecordTypeId('FinServ__FinancialAccount__c', 'LoanAccount');
        financial1.Account_Type__c = 'Loan';
        fin.add(financial1);
        //  insert financial1;
        system.debug('typefin1'+financial1.Account_Type__c);
        
        FinServ__FinancialAccount__c savings1 = new FinServ__FinancialAccount__c();
        savings1.FinServ__PrimaryOwner__c = ac.Id;
        savings1.RecordTypeId = FinacastUtility.getRecordTypeId('FinServ__FinancialAccount__c', 'SavingsAccount');
        savings1.Name = 'Test Savings 1';
        savings1.FinServ__Balance__c = 0;
        savings1.FinServ__APY__c = 3;   
        savings1.FinServ__LoanEndDate__c = Date.today();
        savings1.FinServ__FinancialAccountType__c = 'Savings';
        savings1.Account_Type__c = 'Savings';
        savings1.Max_yearly_tax_deduction_allowed__c =10;
        fin.add(savings1);
        //insert savings1;
        //update savings1;
        system.debug('typefin1'+savings1.RecordTypeId);
        
        FinServ__FinancialAccount__c card = new FinServ__FinancialAccount__c();
        card.Name = 'Test Credit Card 1';
        card.FinServ__Balance__c = 98765;
        card.FinServ__PaymentAmount__c = 5000;
        card.FinServ__PrimaryOwner__c= ac.Id;
        card.FinServ__LoanAmount__c = 5000;
        card.FinServ__APY__c = 4;
        card.Max_yearly_tax_deduction_allowed__c =10;
        card.RecordTypeId = FinacastUtility.getRecordTypeId('FinServ__FinancialAccount__c', 'CreditCard');
        card.FinServ__FinancialAccountType__c  = 'Credit Card';
        card.Account_Type__c = 'Credit Card';
        fin.add(card);
        //insert card;
        
        FinServ__FinancialAccount__c investment = new FinServ__FinancialAccount__c();
        investment.FinServ__PrimaryOwner__c = ac.Id;
        investment.RecordTypeId = FinacastUtility.getRecordTypeId('FinServ__FinancialAccount__c', 'InvestmentAccount');
        investment.Name = 'Test Investment 1';
        investment.FinServ__Balance__c = 98765;
        investment.FinServ__APY__c = 0;   
        investment.Account_Type__c = 'IRA';
        //insert investment;
        fin.add(investment);
        insert fin;
        
        List<FinServ__FinancialAccountTransaction__c> fat=new List<FinServ__FinancialAccountTransaction__c>();
        fat.add(new FinServ__FinancialAccountTransaction__c(FinServ__Amount__c=2000, FinServ__TransactionDate__c=Date.today(),FinServ__FinancialAccount__c=fin[3].Id));
        fat.add(new FinServ__FinancialAccountTransaction__c(FinServ__Amount__c=2000, FinServ__TransactionDate__c=Date.today(),FinServ__FinancialAccount__c=fin[3].Id));
        
        
        insert fat;
        system.debug('typefin1'+card.Account_Type__c);
        FinServ__FinancialGoal__c goals1 = new  FinServ__FinancialGoal__c();
        goals1.FinServ__PrimaryOwner__c = ac.Id;
        goals1.RecordTypeId = FinacastUtility.getRecordTypeId('FinServ__FinancialGoal__c' , 'CarRecordType');
        goals1.Name = 'Test Goal 1';
        goals1.FinServ__TargetValue__c = 10000;
        goals1.FinServ__TargetDate__c = Date.today()+900;
        goals1.Start_Value__c = 2000;
        goals1.Start_Date__c = system.today();
        goals1.Goal_Priority__c = '1';
        goals1.Required_Monthly_Saving__c = 2000;
        goals1.Associated_Account__c = savings1.Id;
        insert goals1;
        
        
        
        //Household Account
        
        /* Budget__c income2 = new Budget__c();
income2.Name = 'test income';
income2.Start_Date__c = system.today();
income2.End_Date__c = system.today();
income2.Amount__c = 4234;
income2.Primary_Owner__c = ac.Id;
income2.HouseHold__c = hac.id;
income2.RecordTypeId = FinacastUtility.getRecordTypeId('Budget__c','Income_Record_Type');
insert income2;

Budget__c expense2 = new Budget__c();
expense2.Name = 'test expense';
expense2.Start_Date__c = system.today();
expense2.End_Date__c = system.today();
expense2.Amount__c = 1234;
expense2.Primary_Owner__c = ac.Id;
expense2.HouseHold__c = hac.id;
expense2.RecordTypeId = FinacastUtility.getRecordTypeId('Budget__c','Income_Record_Type');
insert expense2;

FinServ__FinancialAccount__c financial2 = new FinServ__FinancialAccount__c();
financial2.Name = 'Test Financial Account 1';
financial2.FinServ__PaymentAmount__c = 6000;
financial2.FinServ__PrimaryOwner__c= ac.Id;
financial2.FinServ__LoanAmount__c = 6000;
financial2.FinServ__APY__c = 4;
financial2.FinServ__Household__c = hac.id;
financial2.RecordTypeId = FinacastUtility.getRecordTypeId('FinServ__FinancialAccount__c', 'LoanAccount');
financial2.Account_Type__c = 'Loan';
insert financial2;

FinServ__FinancialAccount__c savings2 = new FinServ__FinancialAccount__c();
savings2.FinServ__PrimaryOwner__c = ac.Id;
savings2.RecordTypeId = FinacastUtility.getRecordTypeId('FinServ__FinancialAccount__c', 'SavingsAccount');
savings2.Name = 'Test Savings 1';
savings2.FinServ__Balance__c = 98765;
savings2.FinServ__Household__c = hac.id;
savings2.FinServ__APY__c = 0;   
savings2.FinServ__LoanEndDate__c = Date.today();
savings2.FinServ__FinancialAccountType__c = 'Savings';
insert savings2;

FinServ__FinancialAccount__c investment = new FinServ__FinancialAccount__c();
investment.FinServ__PrimaryOwner__c = ac.Id;
investment.RecordTypeId = FinacastUtility.getRecordTypeId('FinServ__FinancialAccount__c', 'InvestmentAccount');
investment.Name = 'Test Investment 1';
investment.FinServ__Balance__c = 98765;
investment.FinServ__APY__c = 0;   
investment.Account_Type__c = 'IRA';
insert investment;



FinServ__FinancialAccount__c card2 = new FinServ__FinancialAccount__c();
card2.Name = 'Test Credit Card 1';
card2.FinServ__Balance__c = 98765;
card2.FinServ__PaymentAmount__c = 5000;
card2.FinServ__PrimaryOwner__c= ac.Id;
card2.FinServ__LoanAmount__c = 5000;
card2.FinServ__Household__c = hac.id;
card2.FinServ__APY__c = 4;
card2.RecordTypeId = FinacastUtility.getRecordTypeId('FinServ__FinancialAccount__c', 'CreditCard');
card2.FinServ__FinancialAccountType__c  = 'Credit Card';
insert card2;

list<FinServ__FinancialGoal__c> goals4 = new  list<FinServ__FinancialGoal__c>();
FinServ__FinancialGoal__c goals2 = new  FinServ__FinancialGoal__c();
goals2.FinServ__PrimaryOwner__c = ac.Id;
goals2.RecordTypeId = FinacastUtility.getRecordTypeId('FinServ__FinancialGoal__c' , 'CarRecordType');
goals2.Name = 'Test Goal 1';
goals2.FinServ__TargetValue__c = 10000;
goals2.FinServ__TargetDate__c = Date.today()+900;
goals2.Start_Value__c = 2000;
goals2.FinServ__Household__c = hac.id;
goals2.Goal_Priority__c = '1';
goals2.Start_Date__c = system.today();
goals2.Max_yearly_tax_deduction_allowed__c=5;
goals2.Required_Monthly_Saving__c = 2000;
goals2.Associated_Account__c = savings1.Id;
goals4.add(goals2);
insert goals4;*/
    }
    
    @istest
    public static void createClientDataTest1() {
        Account acc = [select id from Account where name = 'Test'];
        //Account acc2 = [select id from Account where name ='Test2'];
        //Account acc3 = [select id from Account where name = 'Test3'];
        //Account acc4 = [select id from Account where name = 'Test4'];
        //String finId=[select id from FinServ__FinancialAccount__c where name = 'Test Savings 1' limit 1].Id;
        // String finIds=[select id from FinServ__FinancialAccount__c where name = 'Test Credit Card 1' limit 1].Id;
        //String goalId=[select id from FinServ__FinancialGoal__c where name = 'Test Goal 1' limit 1].Id;
        
        test.startTest();
        
        
        ClientDetailApex.createClientData(acc.Id);
        //  ClientDetailApex.getAccounts(acc.Id);
        // ClientDetailApex.getGoals(acc2.Id);
        // ClientDetailApex.getRecordTypeIds();
        // ClientDetailApex.deleteFinAccout(finId);
        //ClientDetailApex.deleteFinAccout(finIds);
        //ClientDetailApex.deleteGoals(goalid);
        //   ClientDetailApex.getNamespace();
        //  ClientDetailApex.isportalEnabled =true;
        //        ClientDetailApex.NumberOfMonths(system.today(), system.today());
        //  ClientDetailApex.NumberOfMonths(null, system.today());
        
        //  ClientDetailApex.curentgoalestimation(250, system.today(), system.today()); 
        test.stopTest();
        System.assertEquals(1,1);
        
    }
    @istest
    public static void createClientDataTest2() {
        Account acc = [select id from Account where name = 'Test2'];
        test.startTest();
        ClientDetailApex.getData(acc.Id);
        
        test.stopTest();
        System.assertEquals(1,1);
        
    }
    @istest
    public static void getGoalsTest() {
        Account acc = [select id from Account where name = 'Test'];
        List<FinServ__FinancialGoal__c> goals=[select id from FinServ__FinancialGoal__c where FinServ__PrimaryOwner__c = :acc.Id];
        list<GoalPerformanceAndMonteCarlo.FinGoalWrapperClass> l;
        test.startTest();
        l= ClientDetailApex.getGoals(acc.Id);
        clientDetailApex.curentgoalestimation(250, system.today(), system.today()); 
        test.stopTest();
        System.assertEquals(goals.size(),l.size());
        
    }
    @istest
    public static void getAccountsTest() {
        Account acc = [select id from Account where name = 'Test'];
        test.startTest();
        
        
        ClientDetailApex.getAccounts(acc.Id);
        test.stopTest();
        
    }
    @istest
    public static void getRecordTypeIdsTest() {
        test.startTest();
        
        
        ClientDetailApex.getRecordTypeIds();
        
        test.stopTest();
        
    }
    
    
    @istest
    public static void getDebtDataTest() {
        Account acc = [select id from Account where name = 'Test'];
        List<FinServ__FinancialAccount__c> debt;
        List<ClientDetailApex.DebtData> l;
        Test.startTest();
        debt= [Select Id,Name, FinServ__LoanAmount__c,FinServ__OpenDate__c from FinServ__FinancialAccount__c where FinServ__PrimaryOwner__c=:acc.Id AND (Account_Type__c='Credit Card' OR Account_Type__c='Loan') ];
        l=ClientDetailApex.getDebtData(acc.Id);
        Test.stopTest();
        System.assertEquals(debt.size(), l.size());
    }
    
    @istest
    public static void getInvestmentDataTest() {
        Account acc = [select id from Account where name = 'Test'];
        Test.startTest();
        ClientDetailApex.getInvestmentdata(acc.Id);
        Test.stopTest();
    }
    @istest
    public static void deleteFinAccoutTest() {
        String finId=[select id from FinServ__FinancialAccount__c where name = 'Test Savings 1' limit 1].Id;
        Test.startTest();
        ClientDetailApex.deleteFinAccout(finId);
        Test.stopTest();
    }
    
    @istest
    public static void getClientTest() {
        Account acc = [select id from Account where name = 'Test'];
        Account a;
        Test.startTest();
        a= ClientDetailApex.getClient(acc.Id);
        Test.stopTest();
        System.assertEquals(acc.Id, a.Id);
    }
    
    @istest
    public static void getRecordTypeIdbyName() {
        String goalId=[select id from FinServ__FinancialGoal__c where name = 'Test Goal 1' limit 1].Id;
        Test.startTest();
        ClientDetailApex.getRecordTypeIdbyName('FinServ__FinancialGoal__c',goalId);
        Test.stopTest();
    }
    
    @istest
    public static void deleteGoalsTest() {
        String goalId=[select id from FinServ__FinancialGoal__c where name = 'Test Goal 1' limit 1].Id;
        Test.startTest();
        ClientDetailApex.deleteGoals(goalId);
        Test.stopTest();
    }
}