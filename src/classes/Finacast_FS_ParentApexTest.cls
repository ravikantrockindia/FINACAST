@isTest
public class Finacast_FS_ParentApexTest {
    
    @testsetup
    public static void data(){
        String namespace= NamespaceUtility.returnNamespace();
        String cId = 'init';
        Account ac = new Account();
        ac.name = 'Test';
        ac.RecordTypeId = Schema.SObjectType.Account.getRecordTypeInfosByName().get('Individual').getRecordTypeId();
        insert ac;
        String cId1 = ac.id;
        
        Budget__c income = new Budget__c();
        income.Name = 'test income';
       
        income.Amount__c = 1234;
        income.Primary_Owner__c = ac.Id; 
        income.Start_Date__c = system.today();
        income.End_Date__c = system.today();
        income.RecordTypeId = FinacastUtility.getRecordTypeId('Budget__c', 'Income_Record_Type');
        insert income;
        
        Budget__c expense = new Budget__c();
        expense.Name = 'test expense';
        expense.Amount__c = 1234;
         expense.Start_Date__c = system.today();
        expense.End_Date__c = system.today();
        expense.Primary_Owner__c = ac.Id;
        expense.RecordTypeId = FinacastUtility.getRecordTypeId('Budget__c', 'Expense_Record_Type');
        insert expense;
        
        FinServ__FinancialAccount__c financial1 = new FinServ__FinancialAccount__c();
        financial1.Name = 'Test Financial Account 1';
        financial1.FinServ__PaymentAmount__c = 5000;
        financial1.FinServ__PrimaryOwner__c= ac.Id;
        financial1.FinServ__LoanAmount__c = 5000;
        financial1.FinServ__APY__c = 4;
        financial1.Max_yearly_tax_deduction_allowed__c =10;
        financial1.RecordTypeId = FinacastUtility.getRecordTypeId('FinServ__FinancialAccount__c', 'LoanAccount');
        financial1.Account_Type__c = 'Loan';
        insert financial1;
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
        insert savings1;
        update savings1;
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
        insert card;
        
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
        
        
    }
    
   @isTest
    public static void Test(){
        Test.startTest();
        Account t =[select id from Account where name = 'Test'];
       // Account t2 = [select id ,Name from Account where name='Test2'];
        Finacast_FS_ParentApex.createClientData(t.id);  
        //Finacast_FS_ParentApex.createClientData(t2.id);
        Finacast_FS_ParentApex.WrapperResponse.getData(t.Id);
       // Finacast_FS_ParentApex.WrapperResponse.getData(t2.Id);
        Test.stopTest(); 
    }
    
}