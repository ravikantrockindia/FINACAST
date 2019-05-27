@isTest
public class AccountsControllerTest {
    public static testMethod void testm(){
   String ClientIdTest='0014600001didhZAAQ';
          
         Test.startTest();
          Accountscontroller.getAccounts();
         Accountscontroller.deleteClients(ClientIdTest);
        Test.stopTest();   
    }
}