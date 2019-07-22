@isTest
public class TestUser_Trigger {
    static testMethod void m1()
    {
 
        
        String orgId = UserInfo.getOrganizationId();
    String dateString = 
        String.valueof(Datetime.now()).replace(' ','').replace(':','').replace('-','');
    Integer randomInt = Integer.valueOf(math.rint(math.random()*1000000));
    String uniqueName = orgId + dateString + randomInt;
    User tuser = new User(  firstname = 'sahil1234',
                            lastName = 'Dalal9876543',
                            email = uniqueName + '@test' + orgId + '.org',
                            Username = uniqueName + '@test' + orgId + '.org',
                            EmailEncodingKey = 'ISO-8859-1',
                            Alias = uniqueName.substring(18, 23),
                            TimeZoneSidKey = 'America/Los_Angeles',
                            LocaleSidKey = 'en_US',
                            LanguageLocaleKey = 'en_US',
                            ProfileId = '00e46000000NnK3AAK',
                            UserRoleId = '00E46000000IBkkEAG');
        
        insert tuser;
        
        
    }
    }