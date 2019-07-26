@isTest
public class CreateNewClientTest {
    @testSetup static void setup() {
                String namespace= NamespaceUtility.returnNamespace();

        // Create common test accounts
        Id devRecordTypeId = [select Id,DeveloperName  from RecordType where sObjectType='Account' AND DeveloperName='IndustriesIndividual'].Id;
                    String objectName=namespace+'Budget__c';
           // String recordType=namespace+'Income_Record_Type';
        Id incomeRecordTypeId =[select Id,DeveloperName  from RecordType where sObjectType=:objectName AND DeveloperName='Income_Record_Type'].Id;
        //Schema.SObjectType.Budget__c.getRecordTypeInfosByName().get('Expense_Record_Type').getRecordTypeId();
                    // recordType=namespace+'Expense_Record_Type';

        Id expenseRecordTypeId =[select Id,DeveloperName  from RecordType where sObjectType=:objectName AND DeveloperName='Expense_Record_Type'].Id;
        Account a=new Account(Name='test', RecordTypeId=devRecordTypeId);
        insert a;
        List<FinServ__FinancialAccount__c> fa=new List<FinServ__FinancialAccount__c>();
        fa.add(new FinServ__FinancialAccount__c(Name='testfa', FinServ__PrimaryOwner__c=a.Id, Account_Type__c='Other'));
        fa.add(new FinServ__FinancialAccount__c(Name='testfa', FinServ__PrimaryOwner__c=a.Id, Account_Type__c='Loan'));
        
        insert fa;
        List<Budget__c> budget =new List<Budget__c>();
        budget.add(new Budget__c(Name='testi', Primary_Owner__c=a.Id, RecordTypeId=incomeRecordTypeId));
        budget.add(new Budget__c(Name='teste', Primary_Owner__c=a.Id, RecordTypeId=expenseRecordTypeId));
        
        insert budget;
    }
    
    @isTest 
    static void getRecordTypeIdsTest(){
        Id devRecordTypeId = [select Id,DeveloperName  from RecordType where sObjectType='Account' AND DeveloperName='IndustriesIndividual'].Id;
        //Schema.getGlobalDescribe().get('Account').getDescribe().getRecordTypeInfosByName().get('Individual').getRecordTypeId();
        List<RecordType> recordTypes=[select Id,DeveloperName  from RecordType where sObjectType='FinServ__FinancialAccount__c'];
                        String namespace=NamespaceUtility.returnNamespace();
                    String objectName=namespace+'Budget__c';

        Id incomeRecordTypeId =[select Id,DeveloperName  from RecordType where sObjectType=:objectName AND DeveloperName='Income_Record_Type'].Id;
        //Schema.SObjectType.Budget__c.getRecordTypeInfosByName().get('Expense_Record_Type').getRecordTypeId();
        Id expenseRecordTypeId =[select Id,DeveloperName  from RecordType where sObjectType=:objectName AND DeveloperName='Expense_Record_Type'].Id;
        
        Test.startTest();
        CreateNewClient.WrapRecordTypeIds Ids=CreateNewClient.getRecordTypeIds();  
        Test.stopTest();
        System.assertEquals(devRecordTypeId, ids.account);
        System.assertEquals(recordTypes, ids.financialAccount);
        System.assertEquals(incomeRecordTypeId, ids.income);
        System.assertEquals(expenseRecordTypeId,ids.expense);
        
    }
    
    @isTest
    static void deleteRecordsTest(){
        
        Account a=[Select Id, RecordTypeId from Account where Name='test' Limit 1];
        // insert a;
        Id accountId=a.Id;
        System.debug(accountId);
        System.debug(a.RecordTypeId);
        List<Account> ab=[Select Id, RecordTypeId from Account where Id=: a.Id];
        System.debug(ab);
        // delete ab;
        // FinServ__FinancialAccount__c fa=new FinServ__FinancialAccount__c(Name='testfa', FinServ__PrimaryOwner__c=accountId);
        // insert fa;
        // System.debug(fa.Id);
        // Budget__c b=new Budget__c(Name='testb', Primary_Owner__c=accountId);
        // insert b;
        // System.debug(b.Id);
        Test.startTest();
        CreateNewClient.deleteRecords(a.Id);
        Test.stopTest();
        
    }
    
    @isTest
    static void returnBankAccountTest(){
        Account a=[Select Id, RecordTypeId from Account where Name='test' Limit 1];
        // insert a;
        Id accountId=a.Id;
        List<FinServ__FinancialAccount__c> bankAccounts=[Select Id, Name, FinServ__PrimaryOwner__c, FinServ__Balance__c, Account_Type__c, FinServ__APY__c, Financial_Institution__c from FinServ__FinancialAccount__c where FinServ__PrimaryOwner__c=:a.Id AND Account_Type__c!='Credit Card' AND Account_Type__c!='Loan' ];
        Test.startTest();
        List<FinServ__FinancialAccount__c> returnBankAccounts=CreateNewClient.returnBankAccount(a.Id);
        Test.stopTest();
        System.assertEquals(bankAccounts, returnBankAccounts,'Equals');
        
    }
    
    /* @isTest
static void returnBankAccountExceptionTest(){
FinServ__FinancialAccount__c a=[Select Id, RecordTypeId from FinServ__FinancialAccount__c Limit 1];
// insert a;
Id accountId=a.Id;
//List<FinServ__FinancialAccount__c> bankAccounts=[Select Id, Name, FinServ__PrimaryOwner__c, FinServ__Balance__c, Account_Type__c, FinServ__APY__c, Financial_Institution__c from FinServ__FinancialAccount__c where FinServ__PrimaryOwner__c=:a.Id AND Account_Type__c!='Debt' AND Account_Type__c!='Loan' ];
Test.startTest();
CreateNewClient.returnBankAccount(a.Id);
CreateNewClient.returnDebtAccount(a.id);
Test.stopTest();
//  System.assertEquals(bankAccounts, returnBankAccounts,'Equals');

}*/
    @isTest
    static void deleteBankAccountTest(){
        FinServ__FinancialAccount__c financialAccount=[Select Id,Name from FinServ__FinancialAccount__c where Name='testfa' limit 1];
        Test.startTest();
        CreateNewClient.deleteBankAccount(financialAccount.Id);
        Test.stopTest();
    }
    
    @isTest
    static void returnDebtAccountTest(){
        Account a=[Select Id, RecordTypeId from Account where Name='test' Limit 1];
        // insert a;
        Id accountId=a.Id;
        List<FinServ__FinancialAccount__c> debtAccounts=[Select Id, Name, FinServ__PrimaryOwner__c, FinServ__LoanAmount__c, Account_Type__c, Financial_Institution__c, Do_you_get_tax_benefit_from_interest_pay__c, Do_tax_benefits_realize_monthly__c, FinServ__PaymentFrequency__c, What_of_contribution_bring_tax_benefit__c, Max_yearly_tax_deduction_allowed__c from FinServ__FinancialAccount__c where FinServ__PrimaryOwner__c=:accountId AND (Account_Type__c='Loan' OR Account_Type__c='Credit Card')];
        Test.startTest();
        List<FinServ__FinancialAccount__c> returndebtAccounts=CreateNewClient.returnDebtAccount(a.Id);
        Test.stopTest();
        System.assertEquals(debtAccounts, returndebtAccounts,'Equals');
    }
    
    @isTest
    static void getIncomeTest(){
        
        Account a=[Select Id, RecordTypeId from Account where Name='test' Limit 1];
        // insert a;
        Id accountId=a.Id;
        List<Budget__c> incomel=[select id,Primary_Owner__c,Name,Frequency__c,Primary_Owner__r.Name,recordtype.developername,Yearly_growth__c,End_Date__c,Amount__c,Start_Date__c,Tax_Rate__c 
                                 from Budget__c where Primary_Owner__c =:accountId AND recordtype.developername='Income_Record_Type'];    
        
        
        Test.startTest();
        List<CreateNewClient.wrapIncome> returnIncomeList=CreateNewClient.getincome(a.Id);
        Test.stopTest();
        System.assertEquals(incomel[0].Id, returnIncomeList[0].income.Id,'Equals');
        
    }
    
    @isTest
    static void getExpenseTest(){
        
        Account a=[Select Id, RecordTypeId from Account where Name='test' Limit 1];
        // insert a;
        Id accountId=a.Id;
        List<Budget__c> expensel=[select id,Primary_Owner__c,Name,recordtype.developername,Yearly_growth__c,End_Date__c	,Amount__c,Start_Date__c,Does_contribution_bring_tax_benifit__c  , Does_tax_benifit_realize_really__c, May_yearly_tax_deduction_allowed__c, What_of_contribution_bring_tax_benifit__c, Priority__c
                                  from Budget__c where Primary_Owner__c =:accountId AND recordtype.developername='Expense_Record_Type'];    
        
        
        Test.startTest();
        List<CreateNewClient.wrapExpense> returnExpenseList=CreateNewClient.getExpense(a.Id);
        Test.stopTest();
        System.assertEquals(expensel[0].id, returnExpenseList[0].expense.id,'Equals');
        
    }
    
    @isTest
    static void saveIncomeTest(){
        List<Budget__c> ib=[Select Id,Name, RecordTypeId from Budget__c where Name='testi' Limit 1];
        ib[0].Name='testb';
        Id ibId=ib[0].Id;
        //   upsert b;
        // List<CreateNewClient.wrapIncome> incomeList=new List<CreateNewClient.wrapIncome>();
        Test.startTest();
        
        CreateNewClient.saveIncome(JSON.serialize(ib));
        
        Budget__c b=[Select Id,Name, RecordTypeId from Budget__c where Id=:ibId Limit 1];
        System.debug(b.Name);
        System.assertEquals('testb', b.Name);  
        Test.stopTest();
        System.debug(JSON.serialize(ib));
        
        
    }
    @isTest
    static void saveExpenseTest(){
        List<Budget__c> ib=[Select Id,Name, RecordTypeId from Budget__c where Name='teste' Limit 1];
        ib[0].Name='testb';
        Id ibId=ib[0].Id;
        //   upsert b;
        // List<CreateNewClient.wrapIncome> incomeList=new List<CreateNewClient.wrapIncome>();
        Test.startTest();
        
        CreateNewClient.saveExpense(JSON.serialize(ib));
        
        Budget__c b=[Select Id,Name, RecordTypeId from Budget__c where Id=:ibId Limit 1];
        System.debug(b.Name);
        System.assertEquals('testb', b.Name);  
        Test.stopTest();
        System.debug(JSON.serialize(ib));
        
        
    }
    
    @isTest
    static void deleteIncomeTest(){
        Budget__c b=[Select Id,Name, IsDeleted from Budget__c where Name='testi' Limit 1];
        System.debug(b.IsDeleted);
        Test.startTest();
        CreateNewClient.hello(b.id);
        // b=[Select Id,Name, IsDeleted from Budget__c where Name='teste' Limit 1];
        
        // System.assertEquals(b.IsDeleted, true);
        
        Test.stopTest();
        
    }
    @isTest
    static void deleteExpenseTest(){
        Budget__c b=[Select Id,Name, IsDeleted from Budget__c where Name='teste' Limit 1];
        System.debug(b.IsDeleted);
        Test.startTest();
        CreateNewClient.deleteExpense(b.id);
        // b=[Select Id,Name, IsDeleted from Budget__c where Name='teste' Limit 1];
        
        // System.assertEquals(b.IsDeleted, true);
        
        Test.stopTest();
        
    }
}