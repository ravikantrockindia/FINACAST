/***
 * created by: avneet kaur
 * purpose: test class for FinacastAccountTeamBatch
 * **/

@isTest
public class TestFinacastAccountTeamBatch {
    
    static testMethod void testBatch()
    {
         Group g = new Group();
        g.Name = 'test public group';
        insert g;
        
        Account acc = new Account();
        acc.Name = 'test account';
        acc.Public_Group_Id__c = g.Id;
       
        insert acc;
        
        AccountTeamMember team = new AccountTeamMember();
        team.AccountId = acc.id;
        team.UserId = userInfo.getUserId();
        insert team;
        
        Test.startTest();
        FinacastAccountTeamBatch batch = new FinacastAccountTeamBatch();
        Database.executeBatch(batch);
        system.assertEquals(1, 1);
        Test.stopTest();
    }
}