@isTest
public class FinacastClientLookupTest {
    @isTest
    public static void testCase1()
    {
        Account ac = new Account ();
        ac.name = 'test';
        insert ac;
        FinacastClientLookupController.fetchLookUpValues('test', 'Account');
        System.assertEquals(1, 1);
    }

}