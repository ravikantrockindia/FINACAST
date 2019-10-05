@isTest 
public class UpdateFinancialAccountBalanceTest {
    
     @testSetup static void setup(){
        String namespace= NamespaceUtility.returnNamespace();
        
        Id devRecordTypeId = [select Id,DeveloperName  from RecordType where sObjectType='Account' AND DeveloperName='IndustriesIndividual'].Id;
        
        Account a=new Account(Name='test', RecordTypeId=devRecordTypeId);
        insert a;
        List<FinServ__FinancialAccount__c> fa=new List<FinServ__FinancialAccount__c>();
        fa.add(new FinServ__FinancialAccount__c(Name='testfa',FinServ__Balance__c=2000, FinServ__PrimaryOwner__c=a.Id, Account_Type__c='Savings'));
        fa.add(new FinServ__FinancialAccount__c(Name='testfl',FinServ__LoanAmount__c=2000, FinServ__PrimaryOwner__c=a.Id, Account_Type__c='Loan'));
        
        insert fa;
       
        
        List<FinServ__FinancialAccountTransaction__c> fat=new List<FinServ__FinancialAccountTransaction__c>();
        fat.add(new FinServ__FinancialAccountTransaction__c(FinServ__Amount__c=2000, FinServ__TransactionDate__c=Date.today(),FinServ__TransactionType__c='Credit',FinServ__FinancialAccount__c=fa[0].Id));
        fat.add(new FinServ__FinancialAccountTransaction__c(FinServ__Amount__c=2000, FinServ__TransactionDate__c=Date.today(),FinServ__TransactionType__c='Debit',FinServ__FinancialAccount__c=fa[0].Id));
        fat.add(new FinServ__FinancialAccountTransaction__c(FinServ__Amount__c=2000, FinServ__TransactionDate__c=Date.today(),FinServ__FinancialAccount__c=fa[1].Id));
        
        insert fat;
        
        
    }
    
    @isTest
    static void insertTransactionSavingCredit(){
        String ids=[Select Id from FinServ__FinancialAccount__c where Name='testfa' LIMIT 1].Id;
          FinServ__FinancialAccountTransaction__c f=new FinServ__FinancialAccountTransaction__c(FinServ__Amount__c=2000, FinServ__TransactionDate__c=Date.today(),FinServ__TransactionType__c='Credit',FinServ__FinancialAccount__c=ids);
       insert f;
        System.assert(f.Id!=null);
        
    }
    
     @isTest
    static void insertTransactionLoanCredit(){
        String ids=[Select Id from FinServ__FinancialAccount__c where Name='testfl' LIMIT 1].Id;
          FinServ__FinancialAccountTransaction__c f=new FinServ__FinancialAccountTransaction__c(FinServ__Amount__c=2000, FinServ__TransactionDate__c=Date.today(),FinServ__TransactionType__c='Credit',FinServ__FinancialAccount__c=ids);
       insert f;
        System.assert(f.Id!=null);
        
    }
     @isTest
    static void insertTransactionSavingDebit(){
        String ids=[Select Id from FinServ__FinancialAccount__c where Name='testfa' LIMIT 1].Id;
          FinServ__FinancialAccountTransaction__c f=new FinServ__FinancialAccountTransaction__c(FinServ__Amount__c=2000, FinServ__TransactionDate__c=Date.today(),FinServ__FinancialAccount__c=ids,FinServ__TransactionType__c='Debit');
       insert f;
        System.assert(f.Id!=null);
        
    }
    
     @isTest
    static void insertTransactionLoanDebit(){
        String ids=[Select Id from FinServ__FinancialAccount__c where Name='testfl' LIMIT 1].Id;
          FinServ__FinancialAccountTransaction__c f=new FinServ__FinancialAccountTransaction__c(FinServ__Amount__c=2000, FinServ__TransactionDate__c=Date.today(),FinServ__FinancialAccount__c=ids,FinServ__TransactionType__c='Debit');
       insert f;
        System.assert(f.Id!=null);
        
    }
    @isTest
    static void updateTransactionCredit(){
        FinServ__FinancialAccountTransaction__c f=[Select Id,FinServ__Amount__c from FinServ__FinancialAccountTransaction__c where FinServ__TransactionType__c='Credit' LIMIT 1];
        f.FinServ__Amount__c=20000;
        update f;
    }
    @isTest
    static void updateTransactionDebit(){
        FinServ__FinancialAccountTransaction__c f=[Select Id,FinServ__Amount__c from FinServ__FinancialAccountTransaction__c where FinServ__TransactionType__c='Debit' LIMIT 1];
        f.FinServ__Amount__c=20000;
        update f;
    }

    @isTest
    static void deleteTransactionCredit(){
        FinServ__FinancialAccountTransaction__c f=[Select Id,FinServ__Amount__c from FinServ__FinancialAccountTransaction__c where FinServ__TransactionType__c='Credit' LIMIT 1];
        delete f;
    }
    
     @isTest
    static void deleteTransactionDebit(){
        FinServ__FinancialAccountTransaction__c f=[Select Id,FinServ__Amount__c from FinServ__FinancialAccountTransaction__c where FinServ__TransactionType__c='Debit' LIMIT 1];
        delete f;
    }
    

}