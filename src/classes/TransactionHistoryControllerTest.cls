@isTest
public class TransactionHistoryControllerTest {
    
    @testSetup static void setup(){
        String namespace= NamespaceUtility.returnNamespace();
        
        Id devRecordTypeId = [select Id,DeveloperName  from RecordType where sObjectType='Account' AND DeveloperName='IndustriesIndividual'].Id;
        String objectName=namespace+'Budget__c';
        Id incomeRecordTypeId =[select Id,DeveloperName  from RecordType where sObjectType=:objectName AND DeveloperName='Income_Record_Type'].Id;
        
        Id expenseRecordTypeId =[select Id,DeveloperName  from RecordType where sObjectType=:objectName AND DeveloperName='Expense_Record_Type'].Id;
        Account a=new Account(Name='test', RecordTypeId=devRecordTypeId);
        insert a;
        List<FinServ__FinancialAccount__c> fa=new List<FinServ__FinancialAccount__c>(); 
        fa.add(new FinServ__FinancialAccount__c(Name='testfa',FinServ__Balance__c=2000, FinServ__PrimaryOwner__c=a.Id, Account_Type__c='Savings'));
        fa.add(new FinServ__FinancialAccount__c(Name='testfa',FinServ__LoanAmount__c=2000, FinServ__PrimaryOwner__c=a.Id, Account_Type__c='Loan'));
     
        insert fa;
        List<Budget__c> budget =new List<Budget__c>();
        budget.add(new Budget__c(Name='testi', Primary_Owner__c=a.Id, RecordTypeId=incomeRecordTypeId));
        budget.add(new Budget__c(Name='teste', Primary_Owner__c=a.Id, RecordTypeId=expenseRecordTypeId));
        
        insert budget;
        String fieldName=namespace+'Budget__c';
        
        List<FinServ__FinancialAccountTransaction__c> fat=new List<FinServ__FinancialAccountTransaction__c>();
        fat.add(new FinServ__FinancialAccountTransaction__c(FinServ__Amount__c=2000, FinServ__TransactionDate__c=Date.today(),FinServ__FinancialAccount__c=fa[0].Id));
        fat.add(new FinServ__FinancialAccountTransaction__c(FinServ__Amount__c=2000, FinServ__TransactionDate__c=Date.today(),FinServ__FinancialAccount__c=fa[1].Id));
        fat.add(new FinServ__FinancialAccountTransaction__c(FinServ__Amount__c=2000, FinServ__TransactionDate__c=Date.today(),Budget_Category__c=budget[0].Id));
        fat.add(new FinServ__FinancialAccountTransaction__c(FinServ__Amount__c=2000, FinServ__TransactionDate__c=Date.today(),Budget_Category__c=budget[1].Id));
       
        insert fat;
        
        
    }
    @isTest
    static void retrieveTransactionsWithoutFilter(){
        
        String clientId=[Select Id from Account where Name='test'].Id;   
        List<FinServ__FinancialAccountTransaction__c>  f=[Select Id from FinServ__FinancialAccountTransaction__c  where (FinServ__FinancialAccount__r.FinServ__PrimaryOwner__c= :clientId OR Budget_Category__r.Primary_Owner__c=:clientId)];
        
        Test.startTest();
        // public static TransactionWrapper retrieveTransactions(Id ClientId, Integer rowLimit, Integer rowOffset, Boolean isDays, String days,Boolean isDateRange, Date startDate, Date endDate, String type, String option, String subOption){
        TransactionHistoryController.TransactionWrapper tw=  TransactionHistoryController.retrieveTransactions(clientId,20,0,false,null, false,null, null,null,null,null);
        Test.stopTest();
        system.assertEquals(f.size(), tw.transactionList.size());
        
    }
       @isTest
    static void retrieveTransactionsWithRecentDaysFilter(){
        
        String clientId=[Select Id from Account where Name='test'].Id;   
                List<FinServ__FinancialAccountTransaction__c>  f=[Select Id from FinServ__FinancialAccountTransaction__c  where (FinServ__FinancialAccount__r.FinServ__PrimaryOwner__c= :clientId OR Budget_Category__r.Primary_Owner__c=:clientId) AND FinServ__TransactionDate__c = LAST_N_DAYS:15];

        Test.startTest();
        // public static TransactionWrapper retrieveTransactions(Id ClientId, Integer rowLimit, Integer rowOffset, Boolean isDays, String days,Boolean isDateRange, Date startDate, Date endDate, String type, String option, String subOption){
        TransactionHistoryController.TransactionWrapper tw=  TransactionHistoryController.retrieveTransactions(clientId,20,0,true,'15', false,null, null,null,null,null);
        Test.stopTest();
        system.assertEquals(f.size(), tw.transactionList.size());
        
    }
    @isTest
    static void retrieveTransactionsWithCategoryFilter1(){
        
        String clientId=[Select Id from Account where Name='test'].Id;   
                List<FinServ__FinancialAccountTransaction__c>  f=[Select Id from FinServ__FinancialAccountTransaction__c  where (FinServ__FinancialAccount__r.FinServ__PrimaryOwner__c= :clientId AND FinServ__FinancialAccount__r.Account_Type__c='Loan')];

        Test.startTest();
        // public static TransactionWrapper retrieveTransactions(Id ClientId, Integer rowLimit, Integer rowOffset, Boolean isDays, String days,Boolean isDateRange, Date startDate, Date endDate, String type, String option, String subOption){
        TransactionHistoryController.TransactionWrapper tw=  TransactionHistoryController.retrieveTransactions(clientId,20,0,false,null, false,null, null,null,'Debt',null);
        Test.stopTest();
        system.assertEquals(f.size(), tw.transactionList.size());
        
    }
    @isTest
    static void retrieveTransactionsWithCategoryFilter2(){
        
        String clientId=[Select Id from Account where Name='test'].Id;   
                List<FinServ__FinancialAccountTransaction__c>  f=[Select Id from FinServ__FinancialAccountTransaction__c  where (Budget_Category__r.Primary_Owner__c= :clientId AND Budget_Category__r.RecordType.developername='Income_Record_Type')];
        System.debug(f);

        Test.startTest();
        // public static TransactionWrapper retrieveTransactions(Id ClientId, Integer rowLimit, Integer rowOffset, Boolean isDays, String days,Boolean isDateRange, Date startDate, Date endDate, String type, String option, String subOption){
        TransactionHistoryController.TransactionWrapper tw=  TransactionHistoryController.retrieveTransactions(clientId,20,0,false,null, false,null, null,null,'Income',null);
        Test.stopTest();
        system.assertEquals(f.size(), tw.transactionList.size());
        
    }
    @isTest
    static void retrieveTransactionsWithCategoryFilter3(){
        
        String clientId=[Select Id from Account where Name='test'].Id;   
                List<FinServ__FinancialAccountTransaction__c>  f=[Select Id from FinServ__FinancialAccountTransaction__c  where (Budget_Category__r.Primary_Owner__c= :clientId AND Budget_Category__r.RecordType.developername='Expense_Record_Type')];
        System.debug(f);

        Test.startTest();
        // public static TransactionWrapper retrieveTransactions(Id ClientId, Integer rowLimit, Integer rowOffset, Boolean isDays, String days,Boolean isDateRange, Date startDate, Date endDate, String type, String option, String subOption){
        TransactionHistoryController.TransactionWrapper tw=  TransactionHistoryController.retrieveTransactions(clientId,20,0,false,null, false,null, null,null,'Expense',null);
        Test.stopTest();
        system.assertEquals(f.size(), tw.transactionList.size());
        
    }
    
    @isTest
    static void deleteTransactionsTest(){
        
        String clientId=[Select Id from Account where Name='test'].Id;   
        FinServ__FinancialAccountTransaction__c  f=[Select Id from FinServ__FinancialAccountTransaction__c  where (FinServ__FinancialAccount__r.FinServ__PrimaryOwner__c= :clientId OR Budget_Category__r.Primary_Owner__c=:clientId) limit 1];
        list<String> transactionIds=new list<string>();
        transactionIds.add(f.Id);
        Test.startTest();
       TransactionHistoryController.deleteTransactions(transactionIds);
        List<FinServ__FinancialAccountTransaction__c> li=new List<FinServ__FinancialAccountTransaction__c>();
        li=[Select Id, FinServ__Amount__c	,FinServ__FinancialAccount__c,FinServ__TransactionDate__c,FinServ__Description__c,FinServ__TransactionType__c from FinServ__FinancialAccountTransaction__c 
               where  Id in :transactionIds];
        Test.stopTest();
        System.assert(li.size()==0);
        
    }
    
    @isTest
    static void getSubOptionsDebt(){
        
        String clientId=[Select Id from Account where Name='test'].Id;   
        
        Test.startTest();
        List<TransactionHistoryController.SubOptionWrapper> t=TransactionHistoryController.getSubOptions(clientId, 'Debt');
        Test.stopTest();
        system.assertEquals(1, t.size());
        
    }
    
    @isTest
    static void getSubOptionsBank(){
        
        String clientId=[Select Id from Account where Name='test'].Id;   
        
        Test.startTest();
        List<TransactionHistoryController.SubOptionWrapper> t=TransactionHistoryController.getSubOptions(clientId, 'Bank');
        Test.stopTest();
        system.assertEquals(1, t.size());
        
    }
    @isTest
    static void getSubOptionsIncome(){
        
        String clientId=[Select Id from Account where Name='test'].Id;   
        
        Test.startTest();
        List<TransactionHistoryController.SubOptionWrapper> t=TransactionHistoryController.getSubOptions(clientId, 'Income');
        Test.stopTest();
        system.assertEquals(1, t.size());
        
    }
    @isTest
    static void getSubOptionsExpense(){
        
        String clientId=[Select Id from Account where Name='test'].Id;   
        
        Test.startTest();
        List<TransactionHistoryController.SubOptionWrapper> t=TransactionHistoryController.getSubOptions(clientId, 'Expense');
        Test.stopTest();
        system.assertEquals(1, t.size());
        
    }
    
}