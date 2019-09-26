@isTest
public class updateOfFinancialAccount {
@isTest
    static void TestDeleteAccountWithOneOpportunity() {
        
        List<FinServ__AssetsAndLiabilities__c> c=new List<FinServ__AssetsAndLiabilities__c>();
        Account ac=new Account();
        ac.Name='Test Account';
       	ac.RecordTypeId=Schema.SObjectType.Account.getRecordTypeInfosByName().get('Individual').getRecordTypeId();
        insert ac;
        
        Account ac1=new Account();
        ac1.Name='Test Account2';
       	ac1.RecordTypeId=Schema.SObjectType.Account.getRecordTypeInfosByName().get('Individual').getRecordTypeId();
        insert ac1;
        
        FinServ__FinancialAccount__c fa=new FinServ__FinancialAccount__c();
        fa.RecordTypeId=Schema.SObjectType.FinServ__FinancialAccount__c.getRecordTypeInfosByName().get('Bank Account').getRecordTypeId();
        fa.Account_Type__c='Savings';
        fa.FinServ__Balance__c=5000;
        fa.FinServ__PrimaryOwner__c=ac.Id;
  //      fa.FinServ__JointOwner__c=ac1.Id;
        fa.Name='FaName';
        insert fa;
        
        FinServ__FinancialAccount__c fa1=new FinServ__FinancialAccount__c();
        fa1.RecordTypeId=Schema.SObjectType.FinServ__FinancialAccount__c.getRecordTypeInfosByName().get('Bank Account').getRecordTypeId();
        fa1.Account_Type__c='401K';
        fa1.FinServ__Balance__c=6000;
        fa1.FinServ__PrimaryOwner__c=ac1.Id;
  //      fa.FinServ__JointOwner__c=ac1.Id;
        fa1.Name='FaName1';
        insert fa1;
        
        FinServ__FinancialAccount__c fa2=new FinServ__FinancialAccount__c();
        fa2.RecordTypeId=Schema.SObjectType.FinServ__FinancialAccount__c.getRecordTypeInfosByName().get('Bank Account').getRecordTypeId();
        fa2.Account_Type__c='Checking';
        fa2.FinServ__Balance__c=7000;
        fa2.FinServ__PrimaryOwner__c=ac1.Id;
  //      fa.FinServ__JointOwner__c=ac1.Id;
        fa2.Name='FaName2';
        insert fa2;
        
        FinServ__FinancialAccount__c fa3=new FinServ__FinancialAccount__c();
        fa3.RecordTypeId=Schema.SObjectType.FinServ__FinancialAccount__c.getRecordTypeInfosByName().get('Bank Account').getRecordTypeId();
      //  fa3.Account_Type__c='Checking';
        fa3.FinServ__Balance__c=7000;
        fa3.FinServ__PrimaryOwner__c=ac1.Id;
  //      fa.FinServ__JointOwner__c=ac1.Id;
        fa3.Name='FaName3';
        insert fa3;
        
        FinServ__AssetsAndLiabilities__c ast=new FinServ__AssetsAndLiabilities__c();
        ast.FinServ__FinancialAccount__c=fa.Id;
        ast.FinServ__Amount__c=fa.FinServ__Balance__c;
        ast.FinServ__PrimaryOwner__c=fa.FinServ__PrimaryOwner__c;
        ast.FinServ__AssetsAndLiabilitiesType__c='cash';
        ast.Name=fa.Name;
        insert ast;
        
        FinServ__AssetsAndLiabilities__c ast1=new FinServ__AssetsAndLiabilities__c();
        ast1.FinServ__FinancialAccount__c=fa1.Id;
        ast1.FinServ__Amount__c=fa1.FinServ__Balance__c;
        ast1.FinServ__PrimaryOwner__c=fa1.FinServ__PrimaryOwner__c;
        ast1.FinServ__AssetsAndLiabilitiesType__c='Bonds';
        ast1.Name=fa1.Name;
        insert ast1;
        
        FinServ__AssetsAndLiabilities__c ast2=new FinServ__AssetsAndLiabilities__c();
        ast2.FinServ__FinancialAccount__c=fa2.Id;
        ast2.FinServ__Amount__c=fa2.FinServ__Balance__c;
        ast2.FinServ__PrimaryOwner__c=fa2.FinServ__PrimaryOwner__c;
        ast2.FinServ__AssetsAndLiabilitiesType__c='Stocks';
        ast2.Name=fa2.Name;
        insert ast2;
        
        FinServ__AssetsAndLiabilities__c ast3=new FinServ__AssetsAndLiabilities__c();
        ast3.FinServ__FinancialAccount__c=fa3.Id;
        ast3.FinServ__Amount__c=fa3.FinServ__Balance__c;
        ast3.FinServ__PrimaryOwner__c=fa3.FinServ__PrimaryOwner__c;
        ast3.FinServ__AssetsAndLiabilitiesType__c='Others';
        ast3.Name=fa3.Name;
        insert ast3;
        
        Database.DeleteResult result = Database.delete(fa, false);
        
        c.add(ast);
        c.add(ast1);
        c.add(ast2);
         c.add(ast3);
    }
}