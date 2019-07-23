public class FinacastBudgetHelper {
    @future
    public static void shareBudget(Set<Id> setOfBudgetIds){
        try{
            List<Id> accountIdList = new List<Id>();
            Map<Id,String> accountGrpMap = new Map<Id,String>();
            List<Budget__share> shareList = new List<Budget__share>();
            system.debug('in');
            List<Budget__c> budgetList = [select id,Primary_Owner__c from budget__c where id in: setOfBudgetIds ];
            for(Budget__c budget : budgetList){
                accountIdList.add(budget.Primary_Owner__c);
                
            }
            List<Account>  accountList = [select id , Public_Group_Id__c from account where id in: accountIdList];
            for(Account ac :  accountList)
            {
                if(ac.Public_Group_Id__c != null || ac.Public_Group_Id__c != ''  )
                {
                    accountGrpMap.put(ac.id,ac.Public_Group_Id__c);
                }
            }
            system.debug('in2');
            for(Budget__c bg : budgetList){
                if(accountGrpMap.get(bg.Primary_Owner__c) != null){
                    Budget__share shareBudget = new Budget__share();
                    shareBudget.ParentId = bg.id;
                    shareBudget.UserOrGroupId = accountGrpMap.get(bg.Primary_Owner__c); 
                    shareBudget.RowCause = Schema.Budget__share.RowCause.Manual;
                    shareBudget.AccessLevel = 'Edit';
                    shareList.add(shareBudget);
                }
            }
            if (Schema.sObjectType.Budget__c.isCreateable())
                insert shareList;   
        }
        catch(Exception e){
            FinacastUtility.ExceptionHandle(e.getLineNumber(), e.getMessage(), e.getStackTraceString());
        }
    }
    
    public static void householdAccount(Set<Id> setOfBudgetId){
        try{
            List<Id> accountIdList1 = new List<Id>();
            List<Budget__c> bg2 = new List<Budget__c>();
            Map<Id,Id> accountContactGrpMap = new Map<Id,Id>();
            List<Budget__c> updateHouseholdAccount = new List<Budget__c>();
            List<Budget__c> budgetList1 = [select id,Primary_Owner__c  from budget__c where id in: setOfBudgetId ];
            for(Budget__c budget1 : budgetList1){
                accountIdList1.add(budget1.Primary_Owner__c);
                
            }
            Id getRecordType1 =  FinacastUtility.getRecordTypeId('Account','IndustriesHousehold'); 
            List<AccountContactRelation> contactList = [select accountid, contactid,contact.accountid ,account.recordtypeid from AccountContactRelation where contact.accountid in:accountIdList1 and account.recordtypeid =:getRecordType1];         
            for(AccountContactRelation acc :  contactList)
            {
                if(acc.accountid != null || acc.accountid != ''  )
                {
                    accountContactGrpMap.put(acc.contact.accountid, acc.accountid);
                }
            }
            for(Budget__c bug1 : budgetList1){
                if(accountContactGrpMap.get(bug1.Primary_Owner__c) != null){
                    if (Schema.sObjectType.Budget__c.fields.HouseHold__c.isUpdateable()){
                        bug1.HouseHold__c = accountContactGrpMap.get(bug1.Primary_Owner__c);
                        
                        updateHouseholdAccount.add(bug1);                
                    }
                }
            }
            if (updateHouseholdAccount.Size() > 0 || Schema.sObjectType.Budget__c.isUpdateable()){
                upsert updateHouseholdAccount;
            }
        }
        catch(Exception e){
            FinacastUtility.ExceptionHandle(e.getLineNumber(), e.getMessage(), e.getStackTraceString());
        }
    }
}