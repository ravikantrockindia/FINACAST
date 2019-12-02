@isTest
public class BatchUpdateFinancialHistoryTest {
  
    @testSetup 
    static void setup() {
      
        List<FinServ__FinancialAccount__c> FAcc = new List<FinServ__FinancialAccount__c>();
 		
        for (Integer i=0;i<10;i++) {
            Account ac=new Account();
            ac.Name='AccName'+i;
            ac.RecordTypeId = Schema.SObjectType.Account.getRecordTypeInfosByName().get('Individual').getRecordTypeId();
			insert ac;            
            FinServ__FinancialAccount__c FA = new FinServ__FinancialAccount__c();
            FA.Name='FAccName'+i;
            FA.FinServ__PrimaryOwner__c=ac.Id;
            FA.FinServ__PaymentAmount__c = 5000;
            FA.FinServ__LoanAmount__c = 5000;
            FA.FinServ__APY__c = 4;
            FA.Max_yearly_tax_deduction_allowed__c =10;
            FA.RecordTypeId = FinacastUtility.getRecordTypeId('FinServ__FinancialAccount__c', 'LoanAccount');
            FA.Account_Type__c = 'Loan';
            
            
            FAcc.add(FA);

        }
      
        insert FAcc;
         
    }
    static testmethod void test() {        
        Test.startTest();
        BatchUpdateFinancialHistory uca = new BatchUpdateFinancialHistory();
        Id batchId = Database.executeBatch(uca);
        Test.stopTest();
         
         
    
    
}
}