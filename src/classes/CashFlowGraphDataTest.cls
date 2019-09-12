@isTest
private class CashFlowGraphDataTest {
@isTest
    private static void testGraph(){
        Account acc = new Account(Name='TestGraph');
        acc.RecordTypeId = Schema.SObjectType.Account.getRecordTypeInfosByName().get('Individual').getRecordTypeId();
        insert acc;
        FinServ__FinancialAccount__c act = new FinServ__FinancialAccount__c(Name='Testgraph',Account_Type__c='Savings', FinServ__PrimaryOwner__c=acc.id);
		insert act;
        List<FinServ__FinancialAccountTransaction__c> fat = new List<FinServ__FinancialAccountTransaction__c>();
        FinServ__FinancialAccountTransaction__c datevalue = new FinServ__FinancialAccountTransaction__c(Finserv__FinancialAccount__c=act.id,FinServ__Amount__c=23421, FinServ__TransactionDate__c=Date.today().addDays(-30), FinServ__TransactionType__c='Debit');
        FinServ__FinancialAccountTransaction__c datevalue1 = new FinServ__FinancialAccountTransaction__c(Finserv__FinancialAccount__c=act.id,FinServ__Amount__c=23421, FinServ__TransactionDate__c=Date.today().addDays(-60), FinServ__TransactionType__c='Credit');
        
        fat.add(datevalue);
        fat.add(datevalue1);
        insert fat;       
        
        
        Account acId = [select id from Account where name = 'TestGraph'];
        test.startTest();
        System.assert(acId != null);
        CashFlowGraphData.getTransctionLoanSavingAmount(acId.id);
        test.stopTest();
    }
}