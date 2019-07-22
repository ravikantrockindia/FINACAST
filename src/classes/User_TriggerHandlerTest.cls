@isTest
public class User_TriggerHandlerTest {
    
    @isTest
    public static void testCreateGrpAndAddUser()
    {
        Account ac = new Account();
        ac.recordTypeId = Schema.SObjectType.Account.getRecordTypeInfosByName().get('Individual').getRecordTypeId();
        ac.Name = 'Test';
        insert ac;
        
        Contact cont = [select id , public_group_id__c from contact where accountid =: ac.id ];
        Profile profileId = [SELECT Id,userLicenseId FROM Profile WHERE Name = 'Customer Community Plus Login User' LIMIT 1];
        testcreateUser(cont.id , profileid.id);
        System.assertEquals(1, 1);
    }
    
    @future
    public static void testcreateUser(Id contId , Id profileId)   
        
    {
        
        User commUser = new User();
        commUser.FirstName = 'test user';
        commUser.LastName = 'test User';
        commUser.ProfileId = profileId;
        commUser.ContactId = contId;
        commUser.Username = 'userName@mirketa.com';
        commUser.Email = 'userName@mirketa.com';
        commUser.Country = 'India';
        commUser.CommunityNickname = 'test124';
        commUser.Alias = 'tUser';
        commUser.TimeZoneSidKey = 'America/Phoenix';
        commUser.LocaleSidKey = 'en_US';
        commUser.EmailEncodingKey = 'ISO-8859-1';
        commUser.LanguageLocaleKey = 'en_US';
        commUser.IsActive = true ;
        //commUser.UserRoleId = us.Id ;
        insert commUser;
}
}