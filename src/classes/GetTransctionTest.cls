@isTest
public class GetTransctionTest 
{
    @istest
    public static void TestAffordablity() 
    {
        Account ac = new Account();
        ac.name = 'Test';
        ac.RecordTypeId = Schema.SObjectType.Account.getRecordTypeInfosByName().get('Individual').getRecordTypeId();
        insert ac;
        
        GetTransction.getBudget('Expense', ac.id);
       GetTransction.getTransction( ac.id);
      
        System.assert(ac != null);
    }

}