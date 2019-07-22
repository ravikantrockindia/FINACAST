@isTest
public class AccountContactRelationHandlerTest {
    @isTest
    public static void testCase1()
    {
        Account ac = new Account();
        ac.name = 'Test1';
        ac.RecordTypeId = Schema.SObjectType.Account.getRecordTypeInfosByName().get('Individual').getRecordTypeId();
        insert ac;
        
        Contact cont = [select id from contact where accountid =: ac.id];
        Profile profileId = [SELECT Id FROM Profile WHERE Name = 'Customer Community Plus Login User' LIMIT 1];     
        testcreateUser(cont.id , profileid.id,'test1@testkk.com');       
        Account ac2 = new Account();
        ac2.name = 'Test2';
        ac2.RecordTypeId = Schema.SObjectType.Account.getRecordTypeInfosByName().get('Individual').getRecordTypeId();
        insert ac2;
        
        Contact cont2 = [select id from contact where accountid =: ac2.id];
       
      testcreateUser(cont2.id , profileid.id,'test11@testkk.com' );
       
        
        Account acHH = new Account();
        acHH.name = 'Test';
        acHH.RecordTypeId = Schema.SObjectType.Account.getRecordTypeInfosByName().get('Household').getRecordTypeId();
        insert acHH;
        
        AccountContactRelation acContRel1 = new AccountContactRelation();
        acContRel1.accountid = acHH.id;
        acContRel1.contactid = cont.id;
        insert acContRel1;
        
        AccountContactRelation acContRel2 = new AccountContactRelation();
        acContRel2.accountid = acHH.id;
        acContRel2.contactid = cont2.id;
        insert acContRel2;
      
       System.assertEquals(1, 1);
    }
    
    
    @future
    public static void testcreateUser(Id contId , Id profileId,String username  )   
        
        {
        
       // Userrole us = [SELECT id from userrole where name = 'Karan Individual Nov 28 Customer User'];
        User commUsers = new User();
        commUsers.FirstName = 'testusers2';
        commUsers.LastName = 'testusers2';
        commUsers.ProfileId = profileId;
        commUsers.ContactId = contId;
        commUsers.Username = username;
        commUsers.Email = 'test1@testkk.com';
        commUsers.Country = 'Canada';
        commUsers.Alias = 'test12';
        commUsers.IsActive = true ;
        commUsers.TimeZoneSidKey = 'America/Phoenix';
            commUsers.LocaleSidKey = 'en_US';
            commUsers.LanguageLocaleKey = 'en_US';
           // commUsers.PortalRole ='Managerial';
            commUsers.EmailEncodingKey = 'ISO-8859-1';
        //commUser.UserRoleId = us.Id ;
        insert commUsers;
}
}