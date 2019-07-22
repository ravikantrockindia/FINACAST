public class FinacastGoalHelper {
    
    public static void shareGoal(List<FinServ__FinancialGoal__c> goalList){
        try{
            List<Id> accountIdList = new List<Id>();
            Map<Id,String> accountGrpMap = new Map<Id,String>();
            List<FinServ__FinancialGoal__share> shareList = new List<FinServ__FinancialGoal__share>();
            for(FinServ__FinancialGoal__c goal : goalList){
                accountIdList.add(goal.FinServ__PrimaryOwner__c);
            }
            
            List<Account>  accountList = [select id , Public_Group_Id__c from account where id in: accountIdList];
            for(Account ac :  accountList)
            {
                if(ac.Public_Group_Id__c != null || ac.Public_Group_Id__c != ''  )
                {
                    accountGrpMap.put(ac.id,ac.Public_Group_Id__c);
                }
            }
            
            for(FinServ__FinancialGoal__c goal : goalList){
                if(accountGrpMap.get(goal.FinServ__PrimaryOwner__c) != null){
                    FinServ__FinancialGoal__share shareGoal = new FinServ__FinancialGoal__share();
                    shareGoal.ParentId = goal.id;
                    shareGoal.UserOrGroupId = accountGrpMap.get(goal.FinServ__PrimaryOwner__c); 
                    shareGoal.RowCause = Schema.FinServ__FinancialGoal__share.RowCause.Manual;
                    shareGoal.AccessLevel = 'Edit';
                    shareList.add(shareGoal);
                }
            }
            insert shareList;
        }
        catch(Exception e)
        {
            FinacastUtility.ExceptionHandle(e.getLineNumber(), e.getMessage(), e.getStackTraceString());
            
        }
    }
    
    public static void updateOwnerforPortalGoals(List<FinServ__FinancialGoal__c> goalList)
    {
        try{
            Map<Id,Id> goalAccountMap = new Map<Id,Id>();
            User us = [select accountid,account.ownerid,contactid from user where id =: UserInfo.getUserId() ];
            for(FinServ__FinancialGoal__c goal : goalList){
                if(us.contactid != null){
                    goal.ownerid = us.account.ownerid;              
                }
            }
        } 
        catch(Exception e)
        {
            FinacastUtility.ExceptionHandle(e.getLineNumber(), e.getMessage(), e.getStackTraceString());
            
        }
    }
    
}