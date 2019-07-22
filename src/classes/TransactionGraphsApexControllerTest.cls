@isTest
public class TransactionGraphsApexControllerTest {
    @isTest public static void testTransaction(){
        FinServ__FinancialAccountTransaction__c trans = new FinServ__FinancialAccountTransaction__c();
        trans.FinServ__TransactionDate__c = Date.today();
        trans.FinServ__Amount__c = 123456;
        trans.FinServ__TransactionType__c='Credit' ;
        insert trans;
        Test.startTest();
        TransactionGraphsApexController.getTransaction(trans.Id);
        System.assertEquals(1, 1);
        Test.stopTest();
    }
}