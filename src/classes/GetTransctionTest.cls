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
       GetTransction.getTransction('Saving', ac.id);
        GetTransction.getTransction('Debt', ac.id);
    }

}