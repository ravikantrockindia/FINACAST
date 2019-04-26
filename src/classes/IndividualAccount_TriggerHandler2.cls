public class IndividualAccount_TriggerHandler2 {  
    
    public static void createPublicGroup(List<Account> accList)
    {
        try{
            Set<Account> individualAccountSet = new Set<Account>();
            Map<Id,Group> publicgrpMap = new Map<Id,Group>();
            List<Account> updatedAccountList = new List<Account>();
            List<GroupMember> grpMemberList = new List<GroupMember>();
            
            //User U = UserPermissionAccess
            for(Account ac : accList)
            {
                if(ac.RecordTypeId == Schema.SObjectType.Account.getRecordTypeInfosByName().get('Individual').getRecordTypeId())
                {
                    Group grp = new Group();
                    grp.name = ac.id;     
                    individualAccountSet.add(ac);
                    
                    GroupMember grpMemberOwner = new GroupMember();
                    grpMemberOwner.UserOrGroupId = ac.OwnerId;
                    grpMemberOwner.GroupId = ac.id;
                    
                    GroupMember grpMemberCreator = new GroupMember();
                    grpMemberCreator.UserOrGroupId = ac.CreatedById;
                    grpMemberCreator.GroupId = ac.id;
                    
                    grpMemberList.add(grpMemberOwner);
                    grpMemberList.add(grpMemberCreator);
                }
            }
            insert publicgrpMap.values();
        } 
        catch(Exception e)
        {
            FinacastUtility.ExceptionHandle(e.getLineNumber(), e.getMessage(), e.getStackTraceString());
        }
    }
}