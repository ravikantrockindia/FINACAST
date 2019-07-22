public class FinacastBankAccountHelper {
    
    public static void shareBankAccount(List<FinServ__FinancialAccount__c> bankaccountList){
        try{
            List<Id> accountIdList = new List<Id>();
            Map<Id,String> accountGrpMap = new Map<Id,String>();
            List<FinServ__FinancialAccount__share> shareList = new List<FinServ__FinancialAccount__share>();
            for(FinServ__FinancialAccount__c bankaccount : bankaccountList){
                accountIdList.add(bankaccount.FinServ__PrimaryOwner__c);
            }
            
            List<Account>  accountList = [select id , Public_Group_Id__c from account where id in: accountIdList];
            for(Account ac :  accountList)
            {
                if(ac.Public_Group_Id__c != null || ac.Public_Group_Id__c != ''  )
                {
                    accountGrpMap.put(ac.id,ac.Public_Group_Id__c);
                }
            }
            
            for(FinServ__FinancialAccount__c bankaccount : bankaccountList){
                if(accountGrpMap.get(bankaccount.FinServ__PrimaryOwner__c) != null){
                    FinServ__FinancialAccount__share shareBankAccount = new FinServ__FinancialAccount__share();
                    shareBankAccount.ParentId = bankaccount.id;
                    shareBankAccount.UserOrGroupId = accountGrpMap.get(bankaccount.FinServ__PrimaryOwner__c); 
                    shareBankAccount.RowCause = Schema.FinServ__FinancialAccount__share.RowCause.Manual;
                    shareBankAccount.AccessLevel = 'Edit';
                    shareList.add(shareBankAccount);
                }
            }
            insert shareList;
        }
        catch(Exception e)
        {
            FinacastUtility.ExceptionHandle(e.getLineNumber(), e.getMessage(), e.getStackTraceString());
            
        }
        
    }
    
    public static void updateOwnerforPortalBankAcc(List<FinServ__FinancialAccount__c> bankAccList)
    {
        try{
            Map<Id,Id> bankAccountMap = new Map<Id,Id>();
            User us = [select accountid,contactid,account.ownerid from user where id =: UserInfo.getUserId() ];
            for(FinServ__FinancialAccount__c bankAcc : bankAccList){
                if(us.contactid != null){
                    bankAcc.ownerid = us.account.ownerid;         
                }
            }
        }
        catch(Exception e)
        {
            FinacastUtility.ExceptionHandle(e.getLineNumber(), e.getMessage(), e.getStackTraceString());
            
        }
    }
    
    public static void deleteItem(){
        try{
            List<FinServ__FinancialAccount__c>  finAccountList = [Select id,(SELECT Id FROM Financial_Goals__r)
                                                                  from FinServ__FinancialAccount__c where id IN :Trigger.Old];
            List<FinServ__FinancialGoal__c> FinGoalList = new List<FinServ__FinancialGoal__c>();
            
            for(FinServ__FinancialAccount__c finAccount: finAccountList) {
                List <FinServ__FinancialGoal__c> innerfinGoalList = finAccount.Financial_Goals__r;
                FinGoalList.addAll(innerfinGoalList);
                
                System.debug(FinGoalList);
                //delete FinGoalList;
            }
        }
        catch(Exception e)
        {
            FinacastUtility.ExceptionHandle(e.getLineNumber(), e.getMessage(), e.getStackTraceString());
            
        }
        
    }
    
    
}