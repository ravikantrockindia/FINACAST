public class AccountContactRelationTriggerHelper {
    
    
    @Future
    public static void insertGrpMemList(List<Id> idList)
    {
        
            
            Map<Id,Id> contUserMap = new Map<Id,Id>();
            List<GroupMember> grpMemberList = new List<GroupMember>();
            List<User> portalUsersList = [select id , contactid from user where contactid != null];
            
            for(User us : portalUsersList){
                contUserMap.put(us.contactid, us.id);
            }
            
            system.debug('gdgdgf'+ portalUsersList.size());
            
            for(AccountContactRelation acRel :[select id,accountid,contactid,contact.public_group_id__c from accountcontactrelation where id in: idList ]){
                
                List<AccountContactRelation> accRelList = [select id , accountid,contactid,account.public_group_id__c,contact.public_group_id__c from AccountContactRelation where accountid =:acRel.AccountId and id !=: acRel.id];
                for(AccountContactRelation acR :accRelList )
                {
                    GroupMember grpMember = new GroupMember();
                    grpMember.GroupId = acR.contact.public_group_id__c;
                    grpMember.UserOrGroupId = contUserMap.get(acRel.ContactId);
                    
                    grpMemberList.add(grpMember);
                    
                    GroupMember grpMember1 = new GroupMember();
                    grpMember1.GroupId = acRel.contact.public_group_id__c;
                    grpMember1.UserOrGroupId = contUserMap.get(acR.ContactId);
                    
                    grpMemberList.add(grpMember1); 
                    
                }
                
                
            }
            if(schema.sobjecttype.GroupMember.isCreateable())
                insert grpMemberList;
            
       
        
       
        
    }
  /*  public static void shareAccount(List<AccountContactRelation> Acrlist){
        try{
            List<Id> accountIdList = new List<Id>();
            Map<Id,String> accountGrpMap = new Map<Id,String>();
            List<AccountShare> shareList = new List<AccountShare>();
            for(AccountContactRelation Acr : Acrlist){
                accountIdList.add(Acr.AccountId);
            }
            
            List<Account>  accountList = [select id , Public_Group_Id__c from account where id in: accountIdList];
            for(Account ac :  accountList)
            {
                if(ac.Public_Group_Id__c != null || ac.Public_Group_Id__c != ''  )
                {
                    accountGrpMap.put(ac.id,ac.Public_Group_Id__c);
                }
            }
            
            for(AccountContactRelation Acr : Acrlist){
                if(accountGrpMap.get(Acr.AccountId) != null){
                    AccountShare shareAcc = new AccountShare();
                    shareAcc.AccountId = Acr.AccountId;
                    shareAcc.UserOrGroupId = accountGrpMap.get(Acr.AccountId); 
                    shareAcc.RowCause = Schema.AccountShare.RowCause.Manual;
                    // shareAcc.AccessLevel = 'Edit';
                    shareList.add(shareAcc);
                }
            }
            insert shareList;
        }
        catch(Exception e)
        {
            FinacastUtility.ExceptionHandle(e.getLineNumber(), e.getMessage(), e.getStackTraceString());
            
        }
    }*/
}