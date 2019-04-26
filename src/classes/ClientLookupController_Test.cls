@IsTest
public class ClientLookupController_Test {
   
    @isTest
    public static void testClient()
    {
        ClientLookupController a = new ClientLookupController();
        a.getClient();
        a.getSelectedClientName();
        a.getSelectedClientId();
        a.setSelectedClientId('Test');
        a.setSelectedClientName('test1');
    }
    

}