/***
* created by: avneet kaur
* purpose: to add account team member to public group
* test class: TestFinacastAccountTeamBatch 
* ***/

global class FinacastAccountTeamBatch implements Database.Batchable<sObject>, Database.Stateful{
    List<GroupMember> groupList = new List<GroupMember>();
    
    global Database.QueryLocator start(Database.BatchableContext b)
    {
        String query='';
        try {
            
            Date now = date.today();
            query = 'Select id, AccountId, UserId, account.Public_Group_Id__c, createdDate from accountTeamMember';        
            
        }catch(Exception e) {
            FinacastUtility.ExceptionHandle(e.getLineNumber(), e.getMessage(), e.getStackTraceString());
        }
        return Database.getQueryLocator(query);
        
    }
    
    global void execute(Database.BatchableContext b, List<accountTeamMember> scope)
    {     
        try{
            for(accountTeamMember teamMem : scope)
            {
                if((teamMem.CreatedDate).date() == Date.today())
                {
                    GroupMember gm = new GroupMember();
                    gm.GroupId = teamMem.account.Public_Group_Id__c;
                    gm.UserOrGroupId = teamMem.UserId;
                    System.debug('gm: '+gm);
                    groupList.add(gm);
                    System.debug('groupList: '+groupList);
                }
            }
            // List<Account> acc = [Select Public_Group_Id__c from Account where id IN :teamMemList];
            /*for(Account a : acc)
{
GroupMember gm = new GroupMember();
gm.GroupId = a.id;
gm.UserOrGroupId
}*/ }
        catch(Exception e)
        {
            FinacastUtility.ExceptionHandle(e.getLineNumber(), e.getMessage(), e.getStackTraceString());
        }
    }
    
    global void finish(Database.BatchableContext b)
    {
        try
        {
            Database.upsert(groupList, false);
        }
        catch(Exception e)
        {
            FinacastUtility.ExceptionHandle(e.getLineNumber(), e.getMessage(), e.getStackTraceString());
        }
    }
    
}