@isTest
public class CashFolwGraphIncomeTest {
    @isTest
    static void testGraph(){
        Account acc = new Account(Name='TestGraph');
        acc.RecordTypeId = Schema.SObjectType.Account.getRecordTypeInfosByName().get('Individual').getRecordTypeId();
        insert acc;
        
        Budget__c   bg = new Budget__c();
        bg.name = 'Test';  
        bg.Primary_Owner__c=acc.id;
        insert bg;
        
        
        
        List<FinServ__FinancialAccountTransaction__c> fat = new List<FinServ__FinancialAccountTransaction__c>();
        FinServ__FinancialAccountTransaction__c datevalue = new FinServ__FinancialAccountTransaction__c(Budget_Category__c=bg.id,FinServ__Amount__c=23421, FinServ__TransactionDate__c=Date.today().addDays(-30), FinServ__TransactionType__c='Debit');
        FinServ__FinancialAccountTransaction__c datevalue1 = new FinServ__FinancialAccountTransaction__c(Budget_Category__c=bg.id,FinServ__Amount__c=23421, FinServ__TransactionDate__c=Date.today().addDays(-60), FinServ__TransactionType__c='Credit');
        
        fat.add(datevalue);
        fat.add(datevalue1);
        insert fat;
        
        
        
        test.startTest();
        System.assert(bg.id != null);
        CashFolwGraphIncome.getTransctionLoanSavingAmount(bg.id);
        
        test.stopTest();
    }

}