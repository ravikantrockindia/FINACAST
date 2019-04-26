public class IndividualAccountTriggerHandler {
    
    public static void createPublicGroup(List<Account> accList)
    {
        try
        {
            Map<Id,Group> publicgrpMap = new Map<Id,Group>();
            List<Account> updatedAccountList = new List<Account>();
            List<Id> accountIdList = new List<Id>();
            List<AccountShare> shareList = new List<AccountShare>();
            
            Id individualRecordId = Schema.SObjectType.Account.getRecordTypeInfosByName().get('Individual').getRecordTypeId();
            List<Account> acc = [select id, OwnerId, CreatedById from account 
                                 where id in : trigger.newMap.keySet() AND recordTypeId =: individualRecordId];
            
            for(Account ac : acc)
            {
                if (Schema.sObjectType.Group.isCreateable()){
                    Group grp = new Group();           
                    grp.name = ac.id;
                    publicgrpMap.put(ac.id,grp);
                }
            }
            if (Schema.sObjectType.Group.isCreateable())
                insert publicgrpMap.values();
            
            for(Account ac : acc)
            {
                if (Schema.sObjectType.Account.fields.Public_Group_Id__c.isUpdateable()){
                    ac.Public_Group_Id__c = publicgrpMap.get(ac.id).id;
                    updatedAccountList.add(ac);
                    accountIdList.add(ac.id);  
                    
                    if (Schema.sObjectType.AccountShare.isCreateable()){
                        AccountShare accShare = new AccountShare();   
                        if (Schema.sObjectType.AccountShare.fields.AccountId.isCreateable())
                            accShare.AccountId = ac.id;
                        if (Schema.sObjectType.AccountShare.fields.UserOrGroupId.isCreateable())
                            accShare.UserOrGroupId = publicgrpMap.get(ac.id).id;
                        if (Schema.sObjectType.AccountShare.fields.RowCause.isCreateable())
                            accShare.RowCause = Schema.FinServ__FinancialGoal__share.RowCause.Manual;
                        if (Schema.sObjectType.AccountShare.fields.AccountAccessLevel.isCreateable())
                            accShare.AccountAccessLevel = 'Edit';
                        if (Schema.sObjectType.AccountShare.fields.OpportunityAccessLevel.isCreateable())
                            accShare.OpportunityAccessLevel = 'Edit';
                        if (Schema.sObjectType.AccountShare.fields.CaseAccessLevel.isCreateable())
                            accShare.CaseAccessLevel= 'Edit';
                        if (Schema.sObjectType.AccountShare.fields.ContactAccessLevel.isCreateable())
                            accShare.ContactAccessLevel = 'Edit';
                        if (Schema.sObjectType.AccountShare.isCreateable())
                            shareList.add(accShare);
                    }
                }
            }
            if (Schema.sObjectType.Account.isUpdateable())
                update updatedAccountList;
            insertGroupMember(accountIdList);
            if (Schema.sObjectType.AccountShare.isCreateable())
                insert shareList;
        }
        catch(Exception e)
        {
            FinacastUtility.ExceptionHandle(e.getLineNumber(), e.getMessage(), e.getStackTraceString());
        }   
    }
    
    @Future
    public static void insertGroupMember(List<Id> accountIdList)
    {
        try{
            List<GroupMember> grpMemberList = new List<GroupMember>();
            List<Account> accList = [select id, createdbyid,ownerid,Public_Group_Id__c from account where id in : accountIdList];
            
            for(Account acc : accList)
            {
                if (Schema.sObjectType.GroupMember.isCreateable()){
                    GroupMember grpMemberOwner = new GroupMember();
                    if (Schema.sObjectType.GroupMember.fields.UserOrGroupId.isCreateable())
                        grpMemberOwner.UserOrGroupId = acc.ownerid;
                    if (Schema.sObjectType.GroupMember.fields.GroupId.isCreateable())
                        grpMemberOwner.GroupId = acc.Public_Group_Id__c;
                    
                    if (Schema.sObjectType.GroupMember.isCreateable()){
                        GroupMember grpMemberCreator = new GroupMember();
                        if (Schema.sObjectType.GroupMember.fields.UserOrGroupId.isCreateable())
                            grpMemberCreator.UserOrGroupId = acc.createdbyid;
                        if (Schema.sObjectType.GroupMember.fields.GroupId.isCreateable())
                            grpMemberCreator.GroupId = acc.Public_Group_Id__c;
                        
                        grpMemberList.add(grpMemberOwner);
                        grpMemberList.add(grpMemberCreator);  
                    }
                }
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