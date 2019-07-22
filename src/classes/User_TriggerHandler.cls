public class User_TriggerHandler {
    
    public static void addUsertoGrp(List<User> usrList){
        try{
            List<User> portalUserList = new List<User>();
            List<Id> contactsIdList = new List<Id>();
            List<GroupMember> grpMemberList = new List<GroupMember>();
            Map<Id,String> groupIdMap = new Map<Id,String>();
            Map<Id,String> houseHoldGrp = new Map<Id,String>();
            for(User us: usrList)
            {
                if(us.contactid != null)
                {
                    system.debug('ddvv'+us.name);
                    portalUserList.add(us);
                    contactsIdList.add(us.contactId);
                }
            }
            
            
            List<Contact> contactsList = [select id , accountid,public_group_id__c from contact where id in :contactsIdList ];
            
            for(Contact cont: contactsList)
            {
                groupIdMap.put(cont.id , cont.public_group_id__c);
                
            }
            
            
            for(User us: portalUserList)
            {
                system.debug('efewg'+groupIdMap.get(us.contactid));
                GroupMember grpMember = new GroupMember();
                grpMember.GroupId = groupIdMap.get(us.contactid);
                grpMember.UserOrGroupId = us.Id;
                grpMemberList.add(grpMember);
                
            }
            if (Schema.sObjectType.GroupMember.isCreateable())
                insert grpMemberList;
            
        }
        catch(Exception e)
        {
            FinacastUtility.ExceptionHandle(e.getLineNumber(), e.getMessage(), e.getStackTraceString());
        }
    }
    
    
}