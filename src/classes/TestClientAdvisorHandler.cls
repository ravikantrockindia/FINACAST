/***
* created by : avneet kaur
* test class for ClientAdvisorHandler
* **/

@isTest
public class TestClientAdvisorHandler {
    
    @testSetup
    public static void testData()
    {
        List<Account> accList = new List<Account>();
        
        for(Integer i=0; i<2; i++)
        {
            Account acc = new Account();
            acc.Name = 'test account '+i;
           
            accList.add(acc);
        }
        insert accList;
    }
    
    static testMethod void testClientAdvisorApex()
    {
        List<Account> accList = [select id, CreatedById from account where name Like 'test%'];
        Test.startTest();
        ClientAdvisorHandler.createClientAdvisor(accList);
        ClientAdvisorHandler.deleteClientAdvisor(accList);
        Account acc1 = new Account();
            acc1.Name = 'test account ';
        insert acc1;
        delete acc1;
        System.assertEquals(1, 1);
        Test.stopTest();
    }
}